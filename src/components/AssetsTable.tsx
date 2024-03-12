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
import { symbol } from "prop-types";
import { formatNumberWithUnit } from "@/utils";
import _ from "lodash";
import { ExplorerTvlItem, getExplorerTokenTvl } from "@/api";

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

export type AssetsListItem = {
  // acount tvl
  tvl: string;
  amount: string;
  tokenAddress: string;
  iconURL: string;
  // total tvl by token
  groupAmount: string;
  groupTvl: string;
  // support token
  symbol: string;
  address: string;
  decimals: number;
  cgPriceId: string;
  type: string;
  yieldType: string[];
  multiplier: string;
};

export type TokenAddress = {
  chain: string;
  l1Address: string;
  l2Address: string;
};

interface IAssetsTableProps {
  data: any[];
  totalTvlList: any[];
  supportTokens: any[];
}

export default function AssetsTable(props: IAssetsTableProps) {
  const { data, totalTvlList, supportTokens } = props;
  const [assetsTabsActive, setAssetsTabsActive] = useState(0);
  const [assetTabList, setAssetTabList] = useState([{ name: "All" }]);
  const [tableList, setTableList] = useState<AssetsListItem[]>([]);
  const [bridgeToken, setBridgeToken] = useState("");
  const [isMyHolding, setIsMyHolding] = useState(false);
  const bridgeModal = useDisclosure();

  const yieldsTypeList = [
    { name: "NOVA Points", label: "NOVA Pts" },
    { name: "Native Yield", label: "Native Yield" },
    { name: "EL Points", label: "EL Pts" },
    { name: "Kelp Miles", label: "Kelp Miles" },
    { name: "Puffer Points", label: "Puffer Pts" },
    { name: "ezPoints", label: "ezPoints" },
    { name: "Loyalty", label: "Loyalty Pts" },
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

  const getTotalTvl = (symbol: string) => {
    return totalTvlList.find((item: any) => item.symbol == symbol);
  };

  const handleBridgeMore = (token: string) => {
    setBridgeToken(token);
    bridgeModal.onOpen();
  };

  const getToken = (symbol: string) => {
    const obj = supportTokens.find((item) => item.symbol == symbol);
    return obj;
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

  const getIconUrlByL2Address = (tokenAddress: TokenAddress[]) => {
    let imgURL = "";

    if (
      tokenAddress &&
      Array.isArray(tokenAddress) &&
      tokenAddress.length > 0
    ) {
      tokenAddress.forEach((addressItem) => {
        const obj = explorerTvl.find(
          (item) =>
            item.l2Address.toLowerCase() == addressItem.l2Address.toLowerCase()
        );
        if (obj?.iconURL && obj.iconURL !== "") {
          imgURL = obj.iconURL;
        }
      });
    }

    return imgURL;
  };

  useEffect(() => {
    let arr: AssetsListItem[] = [];

    if (isMyHolding) {
      arr = data.map((item: any) => {
        const tokenObj = getToken(item?.symbol);
        const totalTvlObj = getTotalTvl(item?.symbol);

        let obj = {
          // acount tvl
          amount: formatNumberWithUnit(+item?.amount),
          tvl: formatNumberWithUnit(item?.tvl, "$"),
          tokenAddress: item?.tokenAddress,
          iconURL: getIconUrlByL2Address(tokenObj?.address),
          // total tvl by token
          groupAmount: formatNumberWithUnit(totalTvlObj?.amount),
          groupTvl: formatNumberWithUnit(totalTvlObj?.amount, "$"),
          // support token
          symbol: tokenObj?.symbol,
          address: tokenObj?.address,
          decimals: tokenObj?.decimals,
          cgPriceId: tokenObj?.cgPriceId,
          type: tokenObj?.type,
          yieldType: tokenObj?.yieldType,
          multiplier: tokenObj?.multiplier,
        };
        return obj;
      });

      // if (isMyHolding) {
      //     arr = arr.filter((item) => +item.tvl !== 0)
      // }
    } else {
      arr = supportTokens.map((item) => {
        const accountTvlObj = data.find((obj) => obj?.symbol == item?.symbol);
        const totalTvlObj = getTotalTvl(item?.symbol);

        let obj = {
          // acount tvl
          amount: formatNumberWithUnit(accountTvlObj?.amount),
          tvl: formatNumberWithUnit(accountTvlObj?.tvl, "$"),
          tokenAddress: accountTvlObj?.tokenAddress,
          iconURL: getIconUrlByL2Address(item?.address),
          // total tvl by token
          groupAmount: formatNumberWithUnit(totalTvlObj?.amount),
          groupTvl: formatNumberWithUnit(totalTvlObj?.tvl, "$"),
          // support token
          symbol: item?.symbol,
          address: item?.address,
          decimals: item?.decimals,
          cgPriceId: item?.cgPriceId,
          type: item?.type,
          yieldType: item?.yieldType,
          multiplier: item?.multiplier,
        };
        return obj;
      });
    }

    if (assetsTabsActive !== 0) {
      const filterType = assetTabList[assetsTabsActive].name;
      arr = arr.filter((item) => item?.type === filterType);
    }

    console.log("----assets list----", arr);
    setTableList(arr);
  }, [isMyHolding, assetsTabsActive, data, supportTokens, explorerTvl]);

  return (
    <>
      <CardBox className="mt-[2rem] p-[0.38rem] flex justify-between items-center w-full overflow-auto">
        <div style={{ maxWidth: "calc(100% - 14rem)", overflow: "auto" }}>
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
            My Holding
          </Checkbox>
        </div>
      </CardBox>

      <TableBox>
        <Table
          removeWrapper
          className="table mt-[1.5rem] min-h-[30rem]"
          classNames={{ thead: "table-header", tbody: "table-tbody" }}
        >
          <TableHeader>
            <TableColumn>Name</TableColumn>
            <TableColumn>TVL</TableColumn>
            <TableColumn>
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
            </TableColumn>
            <TableColumn>Your Deposit</TableColumn>
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
                      <p className="value ml-[0.5rem]">{item?.symbol}</p>
                      <span className="tag tag-green ml-[0.44rem] px-[1rem] py-[0.12rem] whitespace-nowrap">
                        {item?.multiplier}x boost
                      </span>
                    </TableItem>
                  </TableCell>
                  <TableCell>
                    <TableItem>
                      <div className="value">{item.groupAmount}</div>
                      <div className="sub-value mt-[0.12rem]">
                        {item.groupTvl}
                      </div>
                    </TableItem>
                  </TableCell>
                  <TableCell>
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
                      {/* <span className='tag tag-gradient-purple px-[1rem] py-[0.12rem]'>Kelp Miles</span> */}
                      {/* <span className='tag tag-gradient-green px-[1rem] py-[0.12rem]'>ZKL Points</span> */}
                    </TableItem>
                  </TableCell>
                  <TableCell>
                    <TableItem>
                      <div className="value">{item.amount}</div>
                      <div className="sub-value mt-[0.12rem]">{item.tvl}</div>
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
        style={{ minHeight: "600px" }}
        size="2xl"
        isOpen={bridgeModal.isOpen}
        onOpenChange={bridgeModal.onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Bridge</ModalHeader>
              <ModalBody className="pb-8">
                <BridgeComponent
                  isFirstDeposit={false}
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
