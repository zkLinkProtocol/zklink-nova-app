import Assets from "@/components/DashboardS2/Tabs/Assets";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  CategoryZKLItem,
  NovaCategoryPoints,
  NovaCategoryUserPoints,
  NovaCategoryUserPointsTotal,
  SupportToken,
  TvlCategoryMilestone,
  getAccountTvl,
  getCategoryZKL,
  getCategoryZKLE2,
  getExplorerTokenTvl,
  getNovaCategoryPoints,
  getNovaCategoryUserPoints,
  getNovaCategoryUserPointsTotal,
  getSupportTokens,
  getTokenPrice,
  getTotalTvlByToken,
  getTvlCategoryMilestone,
  getTvlCategoryMilestoneBySeason,
} from "@/api";
import { useAccount } from "wagmi";
import EcoDApps from "@/components/DashboardS2/Tabs/EcoDApps";
import Portfolio from "@/components/DashboardS2/Tabs/Protfolio";
import DailyRoulette from "@/components/DashboardS2/DailyRoulette";
import { Tooltip } from "@nextui-org/react";
import { epochList } from "@/constants/epoch";
import ZKLClaimAd from "@/components/DashboardS2/ZKLClaimAd";
import MysteryBoxIII from "@/components/Dashboard/MysteryBoxIII";
import { useTranslation } from "react-i18next";
import { GradientBox } from "@/styles/common";

export type TotalTvlItem = {
  symbol: string;
  tokenAddress: string;
  amount: string;
  tvl: string;
  type: string;
  yieldType: string;
  iconURL: string | null;
};

export type AccountTvlItem = {
  tvl: string;
  amount: string;
  tokenAddress: string;
  symbol: string;
  iconURL: string | null;
};

const Container = styled.div`
  position: relative;
  padding-top: 92px;
  min-height: 100vh;
  /* background-color: #000811; */
  background: url("/img/bg-s2-dashboard.jpg") no-repeat;
  background-size: 100%;
  background-position: center top;

  @media only screen and (max-width: 768px) {
    max-width: 100%;
    padding-left: 16px;
    padding-right: 16px;
  }
`;

const CardBox2 = styled.div`
  padding: 16px;
  background: linear-gradient(180deg, #282828 0%, #000 47.56%);
  border-radius: 16px;
  .total-prize-pool {
    color: var(--Neutral-1, #fff);
    font-family: Satoshi;
    font-size: 24px;
    font-style: normal;
    font-weight: 900;
    line-height: 110%; /* 26.4px */
  }
  .desc {
    color: var(--Neutral-2, rgba(251, 251, 251, 0.6));
    font-family: Satoshi;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 110%; /* 17.6px */

    .before {
      position: relative;
      padding-left: 20px;
    }
    .before::before {
      content: "";
      display: block;
      position: absolute;
      top: 50%;
      left: 6px;
      transform: translate(0, -50%);
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: rgba(251, 251, 251, 0.6);
    }
  }

  .zkl-value {
    text-align: right;
    font-family: Satoshi;
    font-size: 84px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
    background: linear-gradient(180deg, #fff 0%, #bababa 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .all-suported-points {
    color: #fff;
    text-align: right;
    font-family: Satoshi;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 110%; /* 17.6px */
  }
`;

const PrizePoolBoxH5 = styled(GradientBox)`
  color: var(--Neutral-1, #fff);
  font-family: Satoshi;
  font-style: normal;
  font-weight: 900;
  line-height: 110%; /* 22px */

  .num {
    margin-top: 12px;
    margin-bottom: 32px;
    text-align: center;
    font-family: Satoshi;
    font-size: 46.085px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
    background: linear-gradient(180deg, #fff 0%, #bababa 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const Line = styled.div`
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(251, 251, 251, 0.6) 51.5%,
    rgba(255, 255, 255, 0) 100%
  );
`;

const TabsCard = styled.div`
  .tab-item {
    /* margin-bottom: -24px; */
    padding: 12px 14px 24px;
    color: rgba(251, 251, 251, 0.6);
    text-align: center;
    font-family: Satoshi;
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    border-radius: 8px 8px 0 0;
    border: 1px solid #635f5f;
    border-bottom: none;
    opacity: 0.6;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(45, 45, 45, 0.1) 40.05%,
      rgba(19, 19, 19, 0.1) 100%
    );
    cursor: pointer;

    &.active {
      position: relative;
      color: #fff;
      opacity: 1;
      /* background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.1) 0%,
        rgba(145, 145, 145, 0.1) 40.05%,
        rgba(19, 19, 19, 0.1) 100%
      ); */
      border: 2px solid transparent;
      border-bottom: 0;
      background-clip: padding-box, border-box;
      background-origin: padding-box, border-box;
      background-image: linear-gradient(to right, #282828, #282828),
        linear-gradient(
          100deg,
          #fb2450 1%,
          #fbc82e,
          #6eee3f,
          #5889f3,
          #5095f1,
          #b10af4
        );

      &::after {
        content: "";
        display: block;
        position: absolute;
        bottom: -2px;
        left: 0px;
        right: 0px;
        /* width: 100%; */
        background: #282828;
        height: 4px;
        z-index: 3;
      }
    }
  }

  .tab-container {
    position: relative;
    margin-top: -2px;
    min-height: 965.435px;
    border-radius: 24px;
    border: 2px solid transparent;
    background-clip: padding-box, border-box;
    background-origin: padding-box, border-box;
    background-image: linear-gradient(to bottom, #282828 5%, #000000),
      linear-gradient(
        100deg,
        #fb2450 1%,
        #fbc82e,
        #6eee3f,
        #5889f3,
        #5095f1,
        #b10af4
      );
    overflow: hidden;

    &::before {
      content: "";
      display: block;
      height: 1800px;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      background-image: url("/img/bg-s2-sectors.png");
      background-size: 100% 100%;
      max-height: 1800px;
      z-index: 0;
    }

    .tab-content {
      position: relative;
      z-index: 2;
    }
  }
`;

export interface NovaPointsListItem {
  name: string;
  category: string;
  userTotalPoints: number;
  userEcoPoints: number;
  userReferralPoints: number;
  userOtherPoints: number;
  sectorTotalPoints: number;
  sectorEcoPoints: number;
  sectorReferralPoints: number;
  sectorOtherPoints: number;
  zkl: number;
}

export default function Dashboard() {
  const { address } = useAccount();
  const { t } = useTranslation();
  // const { invite } = useSelector((store: RootState) => store.airdrop);

  const tabs2 = [
    {
      iconURL: "/img/icon-sector-assets.svg",
      name: "Assets",
      category: "holding",
    },
    {
      iconURL: "/img/icon-sector-boosted.svg",
      name: "Boosted",
      category: "nativeboost",
    },
    {
      iconURL: "/img/icon-sector-spotdex.svg",
      name: "Spot DEX",
      category: "spotdex",
    },
    {
      iconURL: "/img/icon-sector-perpdex.svg",
      name: "Perp DEX",
      category: "perpdex",
    },
    {
      iconURL: "/img/icon-sector-lending.svg",
      name: "Lending & Staking",
      category: "lending",
    },
    // {
    //   iconURL: "/img/icon-sector-gamefi.svg",
    //   name: "GameFi",
    //   category: "gamefi",
    // },
    {
      iconURL: "/img/icon-sector-other.svg",
      name: "Others",
      category: "other",
    },
  ];

  const [tabs2Active, setTabs2Active] = useState(0);

  const [ethUsdPrice, setEthUsdPrice] = useState(0);
  const [supportTokens, setSupportTokens] = useState<SupportToken[]>([]);
  const [totalTvlList, setTotalTvlList] = useState<TotalTvlItem[]>([]);
  const [accountTvlData, setAccountTvlData] = useState<AccountTvlItem[]>([]);

  const [totalTvl, setTotalTvl] = useState(0);
  const getTotalTvlFunc = async () => {
    const res = await getExplorerTokenTvl(false);

    let num = 0;
    if (res.length > 0) {
      num = +parseInt(res[0].tvl);
    }

    setTotalTvl(num);
  };

  useEffect(() => {
    getTotalTvlFunc();
  }, []);

  const getAccountTvlFunc = async () => {
    let usdPrice = 0;
    const tokenList = await getExplorerTokenTvl(true);
    const ethToken = tokenList.find((item) => item.symbol === "ETH");
    if (ethToken) {
      const res = await getTokenPrice(ethToken.l2Address);
      usdPrice = +res.usdPrice || 0;
      setEthUsdPrice(usdPrice);
    }

    if (!address) return;

    const res = await getAccountTvl(address);
    const { result } = res;
    let data = [];
    if (result && Array.isArray(result) && result.length > 0) {
      data = result;
    }
    setAccountTvlData(data);

    let usd = 0;
    let eth = 0;
    data.forEach((item) => {
      usd += +item?.tvl;
      eth += +item?.tvl;
    });
    // setStakingEthValue(eth);
    // setStakingUsdValue(usd * usdPrice);
  };

  const getSupportTokensFunc = async () => {
    const res = await getSupportTokens();
    if (res && Array.isArray(res)) {
      setSupportTokens(res);
    }
  };

  const getTotalTvlByTokenFunc = async () => {
    const res = await getTotalTvlByToken();
    const { result } = res;
    let arr = [];
    if (result && Array.isArray(result) && result.length > 0) {
      arr = result;
    }
    setTotalTvlList(arr);
  };

  const [novaCategoryUserPoints, setNovaCategoryUserPoints] = useState<
    NovaCategoryUserPoints[]
  >([]);

  const getNovaCategoryUserPointsFunc = async () => {
    setNovaCategoryUserPoints([]);
    if (!address) return;
    const res = await getNovaCategoryUserPoints({
      address,
      season,
    });
    console.log("getNovaCategoryUserPoints", res);
    setNovaCategoryUserPoints(res?.data || []);
  };

  const [novaCategoryPoints, setNovaCategoryPoints] = useState<
    NovaCategoryPoints[]
  >([]);

  const getNovaCategoryPointsFunc = async () => {
    setNovaCategoryPoints([]);

    const res = await getNovaCategoryPoints({
      season,
    });
    console.log("getNovaCategoryPoints", res);
    setNovaCategoryPoints(res?.data || []);
  };

  const [tvlCategoryMilestone, setTvlCategoryMilestone] = useState<
    TvlCategoryMilestone[]
  >([]);
  const getTvlCategoryMilestoneFunc = async () => {
    const res = await getTvlCategoryMilestone();
    console.log("getTvlCategory", res);
    setTvlCategoryMilestone(res?.data || []);
  };
  const [epochActive, setEpochActive] = useState(2);

  const season = useMemo(() => {
    if (tabs2Active === 99) {
      return epochList[epochActive].season;
    } else {
      return epochList[epochList.length - 1].season;
    }
  }, [tabs2Active, epochActive]);

  const [novaCategoryUserPointsTotal, setNovaCategoryUserPointsTotal] =
    useState<NovaCategoryUserPointsTotal[]>([]);

  const getNovaCategoryUserPointsTotalFunc = async () => {
    setNovaCategoryUserPointsTotal([]);
    if (!address) return;

    const { data } = await getNovaCategoryUserPointsTotal({
      address,
      season,
    });
    setNovaCategoryUserPointsTotal(data || []);
  };

  const [categoryZKLs, setCategoryZKLs] = useState<CategoryZKLItem[]>([]);

  const getCategoryZKLFunc = async () => {
    console.log("epoch", epochActive);
    const { data } =
      epochActive === 1
        ? await getTvlCategoryMilestoneBySeason({ season: 2 })
        : await getCategoryZKL();
    setCategoryZKLs(data || []);
  };

  const novaPointsList = useMemo(() => {
    const categorys = [
      {
        name: "Assets Points",
        category: "holding",
      },
      {
        name: "Native Boost Points",
        category: "nativeboost",
      },
      {
        name: "Spot DEX Points",
        category: "spotdex",
      },
      {
        name: "Perp DEX Points",
        category: "perpdex",
      },
      {
        name: "Lending Points",
        category: "lending",
      },
      {
        name: "Others Points",
        category: "other",
      },
    ];

    const arr = categorys.map((c) => {
      const userCategoryData = novaCategoryUserPointsTotal.find(
        (item) => item.category === c.category
      );
      const gamefiData = novaCategoryUserPointsTotal.find(
        (item) => item.category === "gamefi"
      );
      const userEcoPoints =
        epochActive === epochList.length - 1 && c.category === "other"
          ? (Number(gamefiData?.ecoPoints) || 0) +
            (Number(userCategoryData?.ecoPoints) || 0)
          : Number(userCategoryData?.ecoPoints) || 0;
      const userReferralPoints =
        epochActive === epochList.length - 1 && c.category === "other"
          ? (Number(gamefiData?.referralPoints) || 0) +
            (Number(userCategoryData?.referralPoints) || 0)
          : Number(userCategoryData?.referralPoints) || 0;
      const userOtherPoints = Number(userCategoryData?.otherPoints) || 0;
      const userTotalPoints =
        userEcoPoints + userReferralPoints + userOtherPoints;

      const sectorCategoryData = novaCategoryPoints.find(
        (item) => item.category === c.category
      );
      const sectorEcoPoints = Number(sectorCategoryData?.ecoPoints) || 0;
      const sectorReferralPoints =
        Number(sectorCategoryData?.referralPoints) || 0;
      const sectorOtherPoints = Number(sectorCategoryData?.otherPoints) || 0;

      const sectorTotalPoints =
        sectorEcoPoints + sectorReferralPoints + sectorOtherPoints;

      const categoryZKLData = categoryZKLs.find(
        (item) => item.name === c.category
      );

      const obj: NovaPointsListItem = {
        name: c.name,
        category: c.category,
        userTotalPoints,
        userEcoPoints,
        userReferralPoints,
        userOtherPoints,
        sectorTotalPoints,
        sectorEcoPoints,
        sectorReferralPoints,
        sectorOtherPoints,
        zkl: categoryZKLData?.zkl || 0,
      };

      return obj;
    });
    return arr;
  }, [
    novaCategoryUserPointsTotal,
    novaCategoryPoints,
    categoryZKLs,
    epochActive,
  ]);

  const userHoldingPoints = useMemo(() => {
    const category = tabs2[tabs2Active]?.category;
    const categoryData = novaPointsList.find(
      (item) => item.category === category
    );
    return categoryData;
  }, [novaPointsList, tabs2Active]);

  const gamefiHoldingPoints = useMemo(() => {
    const categoryData = novaPointsList.find(
      (item) => item.category === "gamefi"
    );
    return categoryData;
  }, [novaPointsList]);

  const novaCategoryTotalPoints = useMemo(() => {
    const category = tabs2[tabs2Active]?.category;
    const categoryData = novaCategoryPoints.find(
      (item) => item.category === category
    );

    return categoryData;
  }, [tabs2Active, novaCategoryPoints]);

  const gamefiTotalPoints = useMemo(() => {
    const categoryData = novaCategoryPoints.find(
      (item) => item.category === "gamefi"
    );

    return categoryData;
  }, [novaCategoryPoints]);

  useEffect(() => {
    getAccountTvlFunc();
    getSupportTokensFunc();
    getTotalTvlByTokenFunc();
    getTvlCategoryMilestoneFunc();
  }, [address]);

  useEffect(() => {
    // if (tabs2Active !== 99 && season === 1) return;
    getNovaCategoryPointsFunc();
    getNovaCategoryUserPointsFunc();
    getNovaCategoryUserPointsTotalFunc();
  }, [address, season]);

  useEffect(() => {
    getCategoryZKLFunc();
  }, [address, epochActive]);

  const allSupportedPoints = [
    {
      name: "Nova Points",
      iconURL: "/img/icon-rewards-nova.svg",
    },
    {
      name: "Linea LXP-L",
      iconURL: "/img/icon-rewards-linea.svg",
    },
    {
      name: "Eigenlayer Points",
      iconURL: "/img/icon-rewards-eigenlayer.svg",
    },
    {
      name: "Puffer Points",
      iconURL: "/img/icon-rewards-puffer.svg",
    },
    {
      name: "Renzo Points",
      iconURL: "/img/icon-rewards-renzo.svg",
    },
    {
      name: "Eigenpie Points",
      iconURL: "/img/icon-rewards-eigenpie.svg",
    },
    {
      name: "KelpDAO Miles",
      iconURL: "/img/icon-rewards-kelp.svg",
    },
    {
      name: "Allspark Points",
      iconURL: "/img/icon-rewards-allspark.svg",
    },
    {
      name: "L.Points",
      iconURL: "/img/icon-rewards-layerbank.svg",
    },
  ];

  return (
    <Container>
      <div className="side fixed right-[8px] md:right-[32px] top-[120px] z-[9] max-w-[350px] md:max-w-[392px] w-full md:w-[392px]">
        <MysteryBoxIII />
      </div>

      <div className="mt-[29.6px] mx-auto max-w-[1246px] hidden md:block">
        <CardBox2 className="flex justify-between">
          <div className="px-[16px] py-[10px]">
            <div className="flex items-center gap-[10px]">
              <img
                src="/img/icon-dollar.svg"
                alt=""
                width={32}
                height={32}
                className="min-w-[32px]"
              />
              <span className="total-prize-pool">
                {t("dashboard.total_prize_pool")}
              </span>
            </div>

            <div className="desc whitespace-nowrap">
              <div className="mt-[12px] max-w-[400px] whitespace-normal">
                The 30 million $ZKL will be distributed by epoches, based on
                milestone achievement.
              </div>
              <div className="mt-[12px] before">
                {t("dashboard.epoch_one_form")}
              </div>
              <div className="mt-[12px] before">
                {t("dashboard.epoch_two_form")}
              </div>
              <div className="mt-[12px] before text-[#fff]">
                Epoch Three (From Step 1)
              </div>
            </div>
          </div>

          <div>
            <div className="zkl-value flex items-start min-w-[750px]">
              <span>30,000,000</span>
              <Tooltip
                classNames={{
                  content:
                    "max-w-[300px] py-[20px] px-[16px] text-[14px] text-[#FBFBFB99] bg-[#000811]",
                }}
                content="Aggregation Parade Season II will reward participants from a prize pool of 30 million $ZKL tokens over three epochs."
              >
                <img
                  src="/img/icon-zkl-info.svg"
                  alt=""
                  className="mt-[20px] w-[20px] h-[20px]"
                />
              </Tooltip>

              <span>$ZKL</span>
            </div>
            <div className="all-suported-points flex items-center justify-end gap-[10px]">
              <div>{t("dashboard.all_supported_points")}</div>
              <div className="flex items-center">
                {allSupportedPoints.map((item, index) => (
                  <Tooltip content={item.name} key={index}>
                    <img
                      src={item.iconURL}
                      alt=""
                      className="mt-[10px] min-w-[32px] w-[32px] block"
                    />
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>
        </CardBox2>
      </div>

      <div className="block md:hidden">
        <PrizePoolBoxH5 className="rounded-[8px] px-[16px] py-[20px]">
          <div className="flex justify-between text-[20px]">
            <span>Prize Pool</span>
            <span>$ZKL</span>
          </div>
          <div className="num">30,000,000</div>
          <div className="text-[16px]">
            Rewards gathered so far from there companies
          </div>
          <Line className="mt-[12px]" />
          <div className="flex justify-center items-center">
            {allSupportedPoints.map((item, index) => (
              <Tooltip content={item.name} key={index}>
                <img
                  src={item.iconURL}
                  alt=""
                  className="mt-[10px] min-w-[40px] w-[40px] block"
                />
              </Tooltip>
            ))}
          </div>
        </PrizePoolBoxH5>
      </div>

      <div className="mx-auto max-w-[1246px]">
        <DailyRoulette />

        <div className="mt-[40px]">
          <TabsCard className="pb-[40px]">
            <div className="relative flex items-center justify-between gap-[8px] overflow-x-auto overflow-y-hidden">
              <div className="flex flex items-center gap-[12.15px]">
                {tabs2.map((tab, index) => (
                  <div
                    className={`tab-item flex justify-center items-center gap-[8px] whitespace-nowrap ${
                      index === tabs2Active ? "active" : ""
                    }`}
                    onClick={() => setTabs2Active(index)}
                    key={index}
                  >
                    <img
                      src={tab.iconURL}
                      alt=""
                      className="w-[24px] h-[24px] block"
                    />
                    <span>{tab.name}</span>
                  </div>
                ))}
              </div>

              <div
                className={`tab-item flex justify-center items-center gap-[8px] ${
                  tabs2Active === 99 ? "active" : ""
                }`}
                onClick={() => setTabs2Active(99)}
              >
                <img
                  src={"/img/icon-sector-portfolio.svg"}
                  alt=""
                  className="w-[24px] h-[24px] block"
                />
                <span>{t("dashboard.portfolio")}</span>
              </div>
            </div>

            <div
              className="tab-container"
              style={{
                borderRadius: `${tabs2Active === 0 ? "0" : "24px"} ${
                  tabs2Active === 99 ? "0" : "24px"
                } 24px 24px`,
              }}
            >
              <div className="tab-content px-[14px] md:px-[32px] py-[32px]">
                {tabs2Active === 0 && (
                  <Assets
                    tabActive={tabs2[tabs2Active]}
                    ethUsdPrice={ethUsdPrice}
                    supportTokens={supportTokens}
                    totalTvlList={totalTvlList}
                    accountTvlData={accountTvlData}
                    currentTvl={totalTvl}
                    holdingPoints={userHoldingPoints}
                    gamefiHoldingPoints={gamefiHoldingPoints}
                    novaCategoryTotalPoints={novaCategoryTotalPoints}
                    gamefiTotalPoints={gamefiTotalPoints}
                    tvlCategoryMilestone={tvlCategoryMilestone}
                  />
                )}
                {tabs2Active !== 0 && tabs2Active !== 99 && (
                  <EcoDApps
                    season={season}
                    tabActive={tabs2[tabs2Active]}
                    novaCategoryUserPoints={novaCategoryUserPoints}
                    tvlCategoryMilestone={tvlCategoryMilestone}
                    holdingPoints={userHoldingPoints}
                    gamefiHoldingPoints={gamefiHoldingPoints}
                    gamefiTotalPoints={gamefiTotalPoints}
                    novaCategoryTotalPoints={novaCategoryTotalPoints}
                  />
                )}

                {tabs2Active === 99 && (
                  <Portfolio
                    novaPointsList={novaPointsList}
                    handleTabChange={setTabs2Active}
                    epochActive={epochActive}
                    handleEpochChange={setEpochActive}
                  />
                )}
              </div>
            </div>
          </TabsCard>
        </div>
      </div>
    </Container>
  );
}
