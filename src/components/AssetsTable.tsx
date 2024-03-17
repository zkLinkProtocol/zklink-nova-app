import { CardBox } from "@/styles/common";
import {
  Avatar,
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import BridgeComponent from "@/components/Bridge";
import { formatNumberWithUnit } from "@/utils";
import _ from "lodash";
import { ExplorerTvlItem, SupportToken, getExplorerTokenTvl } from "@/api";
import { AccountTvlItem, TotalTvlItem } from "@/pages/Dashboard";

const TabsBar = styled.div`
  .tab-item {
    padding: 0.44rem 1.5rem;
    color: #a9a9a9;
    font-family: Poppins;
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.5rem; /* 150% */
    letter-spacing: -0.03125rem;
    cursor: pointer;
    user-select: none;

    &.hover,
    &.active {
      border-radius: 0.5rem;
      background: #fff;
      color: #000;
    }
  }
`;

const TableItem = styled.div`
  padding: 0 0.5rem;
  .value {
    color: #fff;
    font-family: "Space Mono";
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 700;
    line-height: 1.375rem; /* 157.143% */
  }
  .sub-value {
    color: #8f9193;
    font-family: Satoshi;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 700;
    line-height: 1.375rem; /* 157.143% */
  }
  .tag {
    /* padding: 0.12rem 1rem; */
    text-align: center;
    font-family: Satoshi;
    font-size: 0.75rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.5rem; /* 200% */
    letter-spacing: -0.00375rem;
    &.tag-green {
      color: #0bc48f;
      border-radius: 0.375rem;
      background: rgba(11, 196, 143, 0.24);
    }

    &.tag-gradient-1 {
      color: #fff;
      border-radius: 0.375rem;
      border-radius: 0.375rem;
      background: linear-gradient(90deg, #0ac08c -0.39%, #013038 99.76%);
    }
    &.tag-gradient-2 {
      color: #fff;
      border-radius: 0.375rem;
      border-radius: 0.375rem;
      background: linear-gradient(90deg, #793bc4 -0.39%, #150334 99.76%);
    }
    &.tag-gradient-3 {
      color: #fff;
      border-radius: 0.375rem;
      border-radius: 0.375rem;
      background: linear-gradient(90deg, #64b3ec -0.39%, #1e1a6a 99.76%);
    }
    &.tag-gradient-4 {
      color: #fff;
      border-radius: 0.375rem;
      border-radius: 0.375rem;
      background: linear-gradient(90deg, #075a5a -0.39%, #000404 99.76%);
    }
    &.tag-gradient-5 {
      color: #fff;
      border-radius: 0.375rem;
      border-radius: 0.375rem;
      background: linear-gradient(90deg, #874fff -0.39%, #41ff54 99.76%);
    }
    &.tag-gradient-6 {
      color: #fff;
      border-radius: 0.375rem;
      border-radius: 0.375rem;
      background: linear-gradient(90deg, #ace730 -0.39%, #324900 99.76%);
    }
    &.tag-gradient-7 {
      color: #fff;
      border-radius: 0.375rem;
      border-radius: 0.375rem;
      background: linear-gradient(90deg, #905ef0 -0.39%, #2cb8f9 99.76%);
    }
    &.tag-gradient-8 {
      color: #fff;
      border-radius: 0.375rem;
      border-radius: 0.375rem;
      background: linear-gradient(90deg, #2e64eb -0.39%, #00061b 99.76%);
    }
    &.tag-gradient-9 {
      color: #fff;
      border-radius: 0.375rem;
      border-radius: 0.375rem;
      background: linear-gradient(90deg, #91b3f0 -0.39%, #051635 99.76%);
    }
  }
`;

export const TableBox = styled.div`
  .table {
    padding: 0 1.5rem;
    border-radius: 1rem;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(15.800000190734863px);
  }
  .table-header {
    tr {
      border-bottom: 0.0625rem solid #292a2a;
    }
    th {
      padding: 1.5rem 0;
      background: none;
      color: #7e7e7e;
      font-family: Satoshi;
      font-size: 1rem;
      font-style: normal;
      font-weight: 500;
      line-height: 1.5rem; /* 150% */
      letter-spacing: -0.005rem;
    }
  }

  .table-tbody {
    tr:first-child td {
      padding: 1.5rem 0 0.75rem;
    }
    tr:last-child td {
      padding: 0.75rem 0 1.5rem;
    }
    td {
      padding: 0.75rem 0;
    }
  }
`;

export type TokenAddress = {
  chain: string;
  l1Address: string;
  l2Address: string;
};

export type AssetsListItem = {
  // acount tvl
  tvl: string | number;
  amount: string | number;
  tokenAddress: string;
  iconURL: string;
  // total tvl by token
  groupAmount: string | number;
  groupTvl: string | number;
  // support token
  symbol: string;
  decimals: number;
  cgPriceId: string;
  type: string;
  yieldType: string[];
  multiplier: number;
  chain?: string;
};

interface IAssetsTableProps {
  accountTvlData: AccountTvlItem[];
  totalTvlList: TotalTvlItem[];
  supportTokens: SupportToken[];
}

export default function AssetsTable(props: IAssetsTableProps) {
  const { accountTvlData, totalTvlList, supportTokens } = props;
  const [assetsTabsActive, setAssetsTabsActive] = useState(0);
  const [assetTabList, setAssetTabList] = useState([{ name: "All" }]);
  const [tableList, setTableList] = useState<AssetsListItem[]>([]);
  const [bridgeToken, setBridgeToken] = useState("");
  const [isMyHolding, setIsMyHolding] = useState(false);
  const bridgeModal = useDisclosure();

  const yieldsTypeList = [
    { name: "NOVA Points", label: "Nova Points" },
    { name: "Native Yield", label: "Native Yield" },
    { name: "EL Points", label: "EL Points" },
    { name: "Kelp Miles", label: "Kelp Miles" },
    { name: "Puffer Points", label: "Puffer Points" },
    { name: "ezPoints", label: "ezPoints" },
    { name: "Loyalty", label: "Loyalty Points" },
    { name: "Pearls", label: "Pearls" },
    { name: "Shard", label: "Shard" },
  ];

  const getYieldsType = (name: string) => {
    let obj = {
      label: "",
      index: 0,
    };
    if (
      yieldsTypeList &&
      Array.isArray(yieldsTypeList) &&
      yieldsTypeList.length > 0
    ) {
      yieldsTypeList.forEach((item, index) => {
        if (item.name === name) {
          obj.label = item.label;
          obj.index = index;
        }
      });
    }

    return obj;
  };

  const getTotalTvl = (tokenAddress: string) => {
    return totalTvlList.find(
      (item) => item.tokenAddress.toLowerCase() === tokenAddress.toLowerCase()
    );
  };

  const handleBridgeMore = (token: string) => {
    setBridgeToken(token);
    bridgeModal.onOpen();
  };

  const getTokenAndChain = (
    symbol: string,
    tokenAddress: string
  ): { chain: string; token: SupportToken | null } => {
    // const obj = supportTokens.find((item) => item.symbol == tokenAddress);

    let chain = "";
    let supportToken = null;

    const tokenFilter = supportTokens.filter(
      (token) => token.symbol === symbol
    );

    tokenFilter.forEach((token: SupportToken) => {
      const addressObj = token.address.find(
        (item) => item.l2Address.toLowerCase() === tokenAddress.toLowerCase()
      );

      if (addressObj) {
        chain = addressObj.chain;
        supportToken = token;
      }
    });

    return {
      token: supportToken,
      chain: chain,
    };
  };

  const [explorerTvl, setExplorerTvl] = useState<ExplorerTvlItem[]>([]);
  const getExplorerTokenTvlFunc = async () => {
    const res = await getExplorerTokenTvl(true);
    setExplorerTvl(res);
  };

  useEffect(() => {
    getExplorerTokenTvlFunc();
  }, []);

  useEffect(() => {
    let arr = [{ name: "All" }];
    if (
      supportTokens &&
      Array.isArray(supportTokens) &&
      supportTokens.length > 0
    ) {
      supportTokens.forEach((item) => {
        if (item?.type) {
          arr.push({ name: item?.type });
        }
      });
    }

    let list = _.uniqBy(arr, "name");

    setAssetTabList(list);
  }, [supportTokens]);

  const getIconUrlByL2Address = (tokenAddress: string) => {
    let imgURL = "";

    const obj = explorerTvl.find(
      (item) => item.l2Address.toLowerCase() === tokenAddress.toLowerCase()
    );
    if (obj?.iconURL && obj.iconURL !== "") {
      imgURL = obj.iconURL;
    }

    return imgURL;
  };

  const getTokenAccountTvl = (l2Address: string) => {
    const accountTvl = accountTvlData.find(
      (tvlItem) =>
        l2Address.toLowerCase() === tvlItem.tokenAddress.toLowerCase()
    );

    return accountTvl;
  };

  const getTotalTvlByAddressList = (
    address: TokenAddress[]
  ): TotalTvlItem | null => {
    let obj = null;
    address.forEach((item) => {
      const totalTvlObj = getTotalTvl(item.l2Address);
      if (totalTvlObj) {
        obj = totalTvlObj;
      }
    });

    return obj;
  };

  useEffect(() => {
    let arr: AssetsListItem[] = [];
    supportTokens.forEach((item) => {
      let obj = {
        // acount tvl
        amount: 0,
        tvl: 0,
        tokenAddress: "",
        iconURL: "",
        // total tvl by token
        groupAmount: 0,
        groupTvl: 0,
        // support token
        symbol: item?.symbol,
        // address: item?.address,
        decimals: item?.decimals,
        cgPriceId: item?.cgPriceId,
        type: item?.type,
        yieldType: item?.yieldType,
        multiplier: item?.multiplier,
      };
      item.address.forEach((chains) => {
        const accountTvl = getTokenAccountTvl(chains.l2Address);
        const totalTvl = getTotalTvl(chains.l2Address);
        obj.amount += accountTvl?.amount ? +accountTvl.amount : 0;
        obj.tvl += accountTvl?.tvl ? +accountTvl.tvl : 0;
        obj.groupAmount += totalTvl?.amount ? +totalTvl.amount : 0;
        obj.groupTvl += totalTvl?.tvl ? +totalTvl.tvl : 0;
        obj.tokenAddress = totalTvl?.tokenAddress || "";

        obj.iconURL =
          !obj?.iconURL || obj.iconURL === ""
            ? getIconUrlByL2Address(chains.l2Address)
            : obj.iconURL;
      });
      arr.push(obj);
    });

    if (isMyHolding) {
      arr = arr.filter((item) => +item.tvl !== 0);
    }

    if (assetsTabsActive !== 0) {
      const filterType = assetTabList[assetsTabsActive].name;
      arr = arr.filter((item) => item?.type === filterType);
    }

    setTableList(arr);
  }, [
    isMyHolding,
    assetsTabsActive,
    accountTvlData,
    supportTokens,
    explorerTvl,
  ]);

  return (
    <>
      <CardBox className="mt-[2rem] p-[0.38rem] flex justify-between items-center w-full overflow-auto">
        <div className="maxWid">
          <TabsBar className="flex items-center gap-[0.5rem]">
            {assetTabList.map((item, index) => (
              <span
                key={index}
                className={`tab-item ${
                  assetsTabsActive === index ? "active" : ""
                }`}
                onClick={() => setAssetsTabsActive(index)}
              >
                {item.name}
              </span>
            ))}
          </TabsBar>
        </div>

        <div>
          <Checkbox
            className="mr-[1.5rem] flex-row-reverse items-center gap-[0.5rem] whitespace-nowrap ml-[1.5rem]"
            isSelected={isMyHolding}
            onValueChange={setIsMyHolding}
          >
            My Holdings
          </Checkbox>
        </div>
      </CardBox>

      <TableBox className="overflow-auto md:overflow-visible">
        <Table
          removeWrapper
          className="table mt-[1.5rem] min-h-[30rem]"
          classNames={{ thead: "table-header", tbody: "table-tbody" }}
        >
          <TableHeader>
            <TableColumn>Asset Name</TableColumn>
            <TableColumn>Nova TVL</TableColumn>
            {/* <TableColumn>
              <div className="flex gap-[0.5rem] items-center">
                <span>Yield Opportunity</span>
                <Tooltip
                  className="p-[1rem]"
                  content={
                    <p className="text-[1rem]">
                      Users will receive yields from all related parties.
                    </p>
                  }
                >
                  <img
                    src="/img/icon-info.svg"
                    className="w-[0.875rem] h-[0.875rem] opacity-40"
                  />
                </Tooltip>
              </div>
            </TableColumn> */}
            <TableColumn>Your Deposits</TableColumn>
            <TableColumn children={undefined}></TableColumn>
          </TableHeader>
          <TableBody>
            {tableList.map((item: AssetsListItem, index) => {
              return (
                <TableRow key={index} className="py-5">
                  <TableCell>
                    <TableItem className="flex items-center min-w-[13rem]">
                      <img
                        src={item.iconURL}
                        className="flex rounded-full w-[2.125rem] h-[2.125rem]"
                      />
                      <p className="value ml-[0.5rem]">
                        {item.symbol}
                        {/* {item?.chain && `.${item.chain}`} */}
                      </p>
                      <span className="tag tag-green ml-[0.44rem] px-[1rem] py-[0.12rem] whitespace-nowrap">
                        {item?.multiplier}x Boost
                      </span>
                    </TableItem>
                  </TableCell>
                  <TableCell>
                    <TableItem>
                      <div className="value">
                        {formatNumberWithUnit(item.groupAmount)}
                      </div>
                      <div className="sub-value mt-[0.12rem]">
                        {formatNumberWithUnit(item.groupTvl, "$")}
                      </div>
                    </TableItem>
                  </TableCell>
                  {/* <TableCell>
                    <TableItem className="flex flex-wrap items-center gap-[0.44rem]">
                      {item?.yieldType &&
                        Array.isArray(item?.yieldType) &&
                        item?.yieldType.map((type, index) =>
                          getYieldsType(type)?.label ? (
                            <span
                              key={index}
                              className={`tag px-[0.5rem] py-[0.12rem] tag-gradient-${
                                getYieldsType(type).index + 1
                              }`}
                            >
                              {getYieldsType(type).label}
                            </span>
                          ) : (
                            <></>
                          )
                        )}
                    </TableItem>
                  </TableCell> */}
                  <TableCell>
                    <TableItem>
                      <div className="value">
                        {formatNumberWithUnit(item.amount)}
                      </div>
                      <div className="sub-value mt-[0.12rem]">
                        {formatNumberWithUnit(item.tvl, "$")}
                      </div>
                    </TableItem>
                  </TableCell>
                  <TableCell>
                    <Button
                      className="bg-[#0BC48F] text-[#000] text-[1rem]"
                      onClick={() => {
                        console.log("item: ", item);
                        handleBridgeMore(item.symbol);
                      }}
                    >
                      Bridge More
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableBox>

      <Modal
        classNames={{closeButton: 'text-[1.5rem]'}}
        style={{ minHeight: "600px" }}
        size="2xl"
        isOpen={bridgeModal.isOpen}
        onOpenChange={bridgeModal.onOpenChange}
      >
        <ModalContent className="mb-[5.75rem]">
          {(onClose) => (
            <>
              <ModalHeader>Bridge</ModalHeader>
              <ModalBody className="pb-8">
                <BridgeComponent
                  bridgeToken={bridgeToken}
                  onClose={onClose}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
