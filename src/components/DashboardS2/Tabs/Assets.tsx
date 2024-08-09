import styled from "styled-components";
import {
  ExplorerTvlItem,
  NovaCategoryPoints,
  SupportToken,
  TvlCategoryMilestone,
  getExplorerTokenTvl,
} from "@/api";
import { AccountTvlItem, TotalTvlItem } from "@/pages/Dashboard";
import { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { findClosestMultiplier, formatNumberWithUnit } from "@/utils";
import _ from "lodash";
import { SearchIcon } from "@/components/SearchIcon";
import BridgeComponent from "@/components/Bridge";
import { NovaPointsListItem } from "@/pages/DashboardS2/index2";
import SectorHeader from "./SectorHeader";
import { useTranslation } from "react-i18next";
import AllocatedPoints from "./AllocatedPoints";

const Container = styled.div`
  .holding-title {
    color: #fff;
    font-family: Satoshi;
    font-size: 14px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
    text-transform: capitalize;
  }
  .holding-value {
    color: #fff;
    font-family: Satoshi;
    font-size: 32px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    text-transform: capitalize;
    .max {
      color: #a9a9a9;
      font-family: Satoshi;
      font-size: 15.436px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      text-transform: capitalize;
    }
  }
  .holding-desc {
    color: rgba(251, 251, 251, 0.6);
    font-family: Satoshi;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    text-transform: capitalize;
  }
  .search-input {
    border-radius: 8px;
    border: 1px solid rgb(51, 49, 49);
    background: #10131c;
    filter: blur(0.125px);
  }
`;

const List = styled.div`
  width: 100%;

  .list-header-item {
    padding: 24px 0;
    color: rgba(251, 251, 251, 0.6);
    font-family: Satoshi;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }

  .row {
    border-radius: 24px;
    border: 2px solid #635f5f;
    background: #151923;
  }

  .list-content-item {
    color: var(--Neutral-1, #fff);
    font-family: Satoshi;
    font-size: 14px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;

    .symbol {
      color: #fff;
      font-family: Satoshi;
      font-size: 16px;
      font-style: normal;
      font-weight: 900;
      line-height: normal;
    }
    .name {
      color: #03d498;
      font-family: Satoshi;
      font-size: 12px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }

    .text-gray {
      color: rgba(255, 255, 255, 0.6);
      font-family: Satoshi;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
    .action {
      color: rgba(251, 251, 251, 0.6);
      font-family: Satoshi;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      text-align: center;
    }
    .participate {
      text-align: center;
      font-family: Satoshi;
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      background: linear-gradient(
        90deg,
        #4ba790 0%,
        rgba(251, 251, 251, 0.6) 50.31%,
        #9747ff 100%
      );
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .col-line {
    min-width: 1px;
    width: 1px;
    height: 44px;
    opacity: 0.3;
    opacity: 0.3;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(251, 251, 251, 0.6) 51.5%,
      rgba(255, 255, 255, 0) 100%
    );
  }

  .list-header-item,
  .list-content-item {
    width: 20%;

    &:last-child {
      width: 268px;
    }
  }
`;

const GradientBox = styled.div`
  padding: 4px 28px;
  border: 2px solid transparent;
  border-radius: 16px;
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;
  background-image: linear-gradient(to right, #282828, #000000),
    linear-gradient(#fb2450 1%, #fbc82e 5%, #6eee3f, #5889f3, #5095f1, #b10af4);
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
  totalAmount: string | number;
  totalTvl: string | number;
  // support token
  symbol: string;
  decimals: number;
  cgPriceId: string;
  type: string;
  yieldType: string[];
  multipliers: {
    multiplier: number;
    timestamp: number;
  }[];
  isNova: boolean;
  chain?: string;
};

interface IAssetsTableProps {
  accountTvlData: AccountTvlItem[];
  totalTvlList: TotalTvlItem[];
  supportTokens: SupportToken[];
  ethUsdPrice: number;
  currentTvl: number;
  holdingPoints?: NovaPointsListItem;
  novaCategoryTotalPoints?: NovaCategoryPoints;
  tvlCategoryMilestone: TvlCategoryMilestone[];
  tabActive?: {
    category: string;
    name: string;
    iconURL: string;
  };
}

export default function Assets(props: IAssetsTableProps) {
  const {
    accountTvlData,
    totalTvlList,
    supportTokens,
    ethUsdPrice,
    currentTvl,
    holdingPoints,
    novaCategoryTotalPoints,
    tabActive,
    tvlCategoryMilestone,
  } = props;
  const [assetsTabsActive, setAssetsTabsActive] = useState(0);
  const [assetTabList, setAssetTabList] = useState([{ name: "All" }]);
  const [tableList, setTableList] = useState<AssetsListItem[]>([]);
  const [filterTableList, setFilterTableList] = useState<AssetsListItem[]>([]);
  const [bridgeToken, setBridgeToken] = useState("");
  const [isMyHolding, setIsMyHolding] = useState(false);
  const bridgeModal = useDisclosure();
  const [serachValue, setSearchValue] = useState("");

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

  const getTotalTvl = (tokenAddress: string) => {
    return totalTvlList.find(
      (item) => item.tokenAddress.toLowerCase() === tokenAddress.toLowerCase()
    );
  };

  const handleBridgeMore = (token: string) => {
    console.log("bridge token", token);
    if (
      token === "BBTC" ||
      token === "BBUSD" ||
      token === "M-BTC" ||
      token === "solvBTC.m"
    ) {
      window.open("https://app.free.tech/");
    } else {
      setBridgeToken(token);
      bridgeModal.onOpen();
    }
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
    const accountTvlItem = accountTvlData.find(
      (tvlItem) =>
        l2Address.toLowerCase() === tvlItem.tokenAddress.toLowerCase()
    );

    return accountTvlItem;
  };

  useEffect(() => {
    let arr: AssetsListItem[] = [];
    supportTokens.forEach((item: any) => {
      let obj = {
        // acount tvl
        amount: 0,
        tvl: 0,
        tokenAddress: "",
        iconURL: "",
        // total tvl by token
        totalAmount: 0,
        totalTvl: 0,
        // support token
        symbol: item?.symbol,
        // address: item?.address,
        decimals: item?.decimals,
        cgPriceId: item?.cgPriceId,
        type: item?.type,
        yieldType: item?.yieldType,
        multipliers: item?.multipliers,
        isNova: item.address[0]?.chain === "Nova" ? true : false,
      };

      // sum all chains token amount/tvl
      item.address.forEach((chains: any) => {
        obj.tokenAddress = chains.l2Address;
        const accountTvlItem = getTokenAccountTvl(chains.l2Address);
        const totalTvlItem = getTotalTvl(chains.l2Address);
        if (accountTvlItem) {
          obj.amount += +accountTvlItem.amount ? +accountTvlItem.amount : 0;
          obj.tvl += +accountTvlItem.tvl
            ? +accountTvlItem.tvl * ethUsdPrice
            : 0;
        }

        if (totalTvlItem) {
          obj.totalAmount += +totalTvlItem.amount ? +totalTvlItem.amount : 0;
          obj.totalTvl += +totalTvlItem.tvl
            ? +totalTvlItem.tvl * ethUsdPrice
            : 0;
        }

        obj.iconURL =
          !obj?.iconURL || obj.iconURL === ""
            ? getIconUrlByL2Address(chains.l2Address)
            : obj.iconURL;

        if (obj.symbol === "ZKL") {
          obj.iconURL = "https://etherscan.io/token/images/zklink_32.png";
        }
      });

      // not WETH
      if (
        obj.tokenAddress.toLowerCase() !==
        "0x8280a4e7d5b3b658ec4580d3bc30f5e50454f169"
      ) {
        arr.push(obj);
      }
    });

    setTableList(arr);
  }, [
    isMyHolding,
    assetsTabsActive,
    accountTvlData,
    supportTokens,
    explorerTvl,
  ]);

  useEffect(() => {
    let arr = [...tableList];

    if (isMyHolding) {
      arr = arr.filter((item) => +item.tvl !== 0);
    }

    if (assetsTabsActive !== 0) {
      const filterType = assetTabList[assetsTabsActive].name;
      arr = arr.filter((item) => item?.type === filterType);
    }

    if (serachValue.trim()) {
      let queryStringArr = serachValue.split("");
      let str = "(.*?)";
      let regStr = str + queryStringArr.join(str) + str;
      let reg = RegExp(regStr, "i");

      arr = arr.filter((item) => reg.test(item.symbol));
    }

    arr = arr
      .filter(
        (item) =>
          item?.multipliers &&
          Number(findClosestMultiplier(item.multipliers)) !== 0
      )
      .sort(
        (a, b) =>
          Number(findClosestMultiplier(b.multipliers)) -
          Number(findClosestMultiplier(a.multipliers))
      );

    setFilterTableList(arr);
  }, [tableList, serachValue, isMyHolding, assetsTabsActive]);

  const { t } = useTranslation();

  return (
    <>
      <Container>
        <SectorHeader
          tabActive={tabActive}
          holdingPoints={holdingPoints}
          novaCategoryTotalPoints={novaCategoryTotalPoints}
          tvlCategoryMilestone={tvlCategoryMilestone}
          totalTvl={currentTvl}
        />

        <div className="mt-[24px] md:hidden block">
          <Input
            data-hover={false}
            isClearable
            placeholder={t("dashboard.enter_token_symbol")}
            className="search-input"
            classNames={{
              base: ["bg-[rgba(0,0,0,.4)]", "bg-[rgba(0,0,0,.4)]"],
              mainWrapper: ["bg-transparent", "hover:bg-transparent"],
              inputWrapper: ["bg-transparent", "hover:bg-transparent"],
              input: ["bg-transparent", "hover:bg-transparent"],
            }}
            startContent={
              <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
            }
            onClear={() => {
              setSearchValue("");
            }}
            onValueChange={setSearchValue}
          />
        </div>

        <div className="overflow-x-auto">
          <List className="min-w-[900px]">
            <div className="list-header flex items-center">
              <div className="list-header-item text-left">
                {t("dashboard.token")}
              </div>
              <div className="list-header-item text-center">
                {t("dashboard.points_booster")}
              </div>
              <div className="list-header-item text-center">
                {t("dashboard.nova_tvl")}
              </div>
              <div className="list-header-item text-center">
                {t("dashboard.ur_deposit")}
              </div>
              <div className="list-header-item">
                <Input
                  data-hover={false}
                  isClearable
                  placeholder={t("dashboard.enter_token_symbol")}
                  className="search-input md:block hidden"
                  classNames={{
                    base: ["bg-[rgba(0,0,0,.4)]", "bg-[rgba(0,0,0,.4)]"],
                    mainWrapper: ["bg-transparent", "hover:bg-transparent"],
                    inputWrapper: ["bg-transparent", "hover:bg-transparent"],
                    input: ["bg-transparent", "hover:bg-transparent"],
                  }}
                  startContent={
                    <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                  }
                  onClear={() => {
                    setSearchValue("");
                  }}
                  onValueChange={setSearchValue}
                />
              </div>
            </div>
            <div className="list-content">
              {filterTableList.map((item, index) => (
                <div className="row mb-[24px] flex items-center" key={index}>
                  <div className="list-content-item px-[20px] md:px-[28px] py-[16px] flex items-center gap-[10px]">
                    {item?.iconURL && (
                      <img
                        src={item?.iconURL}
                        alt=""
                        className="min-w-[32px] w-[32px] h-[32px] md:w-[55px] md:h-[56px] rounded-full block"
                      />
                    )}
                    <div>
                      <div className="symbol">{item?.symbol}</div>
                      {item?.isNova && (
                        <div className="name mt-[5px]">Merged Token</div>
                      )}
                    </div>
                  </div>
                  <div className="col-line"></div>
                  <div className="list-content-item px-[20px] md:px-[28px] py-[16px] flex items-center justify-center text-center">
                    <GradientBox>
                      {item?.multipliers && Array.isArray(item.multipliers)
                        ? findClosestMultiplier(item?.multipliers)
                        : 0}
                      x Boost
                    </GradientBox>
                  </div>
                  <div className="col-line"></div>

                  <div className="list-content-item px-[20px] md:px-[28px] py-[16px] text-center">
                    {item.symbol === "ZKL" ? (
                      "-"
                    ) : (
                      <>
                        {formatNumberWithUnit(item?.totalAmount)}
                        <span className="text-gray">
                          ({formatNumberWithUnit(item?.totalTvl, "$")})
                        </span>
                      </>
                    )}
                  </div>
                  <div className="col-line"></div>

                  <div className="list-content-item px-[20px] md:px-[28px] py-[16px] text-center">
                    {" "}
                    {formatNumberWithUnit(item?.amount)}
                  </div>
                  <div className="col-line"></div>

                  <div className="list-content-item px-[20px] md:px-[28px] py-[16px] flex justify-end items-center gap-[10px]">
                    <span className="action">Action:</span>
                    {item.symbol === "ZKL" ? (
                      <Dropdown className="bg-[#000811] py-[20px]">
                        <DropdownTrigger>
                          <span className="participate cursor-pointer">
                            Buy Now
                          </span>
                        </DropdownTrigger>
                        <DropdownMenu
                          aria-label="ACME features"
                          itemClasses={{
                            base: "gap-4",
                          }}
                        >
                          <DropdownItem key="bridge">
                            <div
                              className="flex justify-between items-center"
                              onClick={() => {
                                window.open(
                                  "https://novaswap.fi/#/swap",
                                  "_blank"
                                );
                              }}
                            >
                              Buy from Novaswap
                              <img
                                src="/img/icon-bridge-link-arrow.svg"
                                alt=""
                              />
                            </div>
                          </DropdownItem>

                          <DropdownItem key="merge">
                            <div
                              className="flex justify-between items-center"
                              onClick={() => {
                                window.open(
                                  "https://izumi.finance/trade/swap?chainId=810180",
                                  "_blank"
                                );
                              }}
                            >
                              Buy from izumi
                              <img
                                src="/img/icon-bridge-link-arrow.svg"
                                alt=""
                              />
                            </div>
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    ) : item?.isNova ? (
                      <Dropdown className="bg-[#000811] py-[20px]">
                        <DropdownTrigger>
                          <span className="participate cursor-pointer">
                            Participate
                          </span>
                        </DropdownTrigger>
                        <DropdownMenu
                          aria-label="ACME features"
                          itemClasses={{
                            base: "gap-4",
                          }}
                        >
                          <DropdownItem key="bridge">
                            <div
                              className="flex justify-between items-center"
                              onClick={() => {
                                console.log("item: ", item);
                                handleBridgeMore(item?.symbol);
                              }}
                            >
                              {t("dashboard.bridge_now")}
                              <img
                                src="/img/icon-bridge-link-arrow.svg"
                                alt=""
                              />
                            </div>
                          </DropdownItem>

                          <DropdownItem key="merge">
                            <div
                              className="flex justify-between items-center"
                              onClick={() => {
                                window.open(
                                  "https://zklink.io/merge",
                                  "_blank"
                                );
                              }}
                            >
                              Merge Now
                              <img
                                src="/img/icon-bridge-link-arrow.svg"
                                alt=""
                              />
                            </div>
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    ) : (
                      <span
                        className="participate cursor-pointer"
                        onClick={() => {
                          console.log("item: ", item);
                          handleBridgeMore(item?.symbol);
                        }}
                      >
                        {t("dashboard.bridge_now")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </List>
        </div>

        <div className="md:hidden block">
          <AllocatedPoints
            novaCategoryTotalPoints={novaCategoryTotalPoints}
            holdingPoints={holdingPoints}
            tabActive={tabActive}
          />
        </div>
      </Container>

      <Modal
        classNames={{ closeButton: "text-[1.5rem]" }}
        style={{ minHeight: "600px" }}
        size="2xl"
        isOpen={bridgeModal.isOpen}
        onOpenChange={bridgeModal.onOpenChange}
      >
        <ModalContent className="mb-[3.75rem]">
          {(onClose) => (
            <>
              <ModalHeader>Bridge</ModalHeader>
              <ModalBody className="pb-8">
                <BridgeComponent bridgeToken={bridgeToken} onClose={onClose} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
