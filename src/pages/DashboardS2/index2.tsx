import Assets from "@/components/DashboardS2/Tabs/Assets";
import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  NovaCategoryPoints,
  NovaCategoryUserPoints,
  SupportToken,
  TvlCategory,
  TvlCategoryMilestone,
  getAccountPoint,
  getAccountTvl,
  getExplorerTokenTvl,
  getNovaCategoryPoints,
  getNovaCategoryUserPoints,
  getPointsDetail,
  getSupportTokens,
  getTokenPrice,
  getTotalTvlByToken,
  getTvlCategory,
  getTvlCategoryMilestone,
} from "@/api";
import { useAccount } from "wagmi";
import EcoDApps from "@/components/DashboardS2/Tabs/EcoDApps";
import Portfolio from "@/components/DashboardS2/Tabs/Protfolio";
import DailyRoulette from "@/components/DashboardS2/DailyRoulette";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Decimal from "decimal.js";
import { Tooltip } from "@nextui-org/react";
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
`;

const CardBox = styled.div`
  padding: 23px 32px;
  /* background: #000811; */
  border-radius: 24px;
  border: 2px solid transparent;
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;
  background-image: linear-gradient(to bottom, #000000, #282828),
    linear-gradient(
      175deg,
      #fb2450 1%,
      #fbc82e,
      #6eee3f,
      #5889f3,
      #5095f1,
      #b10af4
    );

  .rewards {
    color: #fff;
    font-family: Satoshi;
    font-size: 19.033px;
    font-style: normal;
    font-weight: 900;
    line-height: 110%; /* 20.936px */
  }
  .rewards-line {
    margin: 12px 0 18px;
    width: 438.813px;
    height: 1.057px;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(251, 251, 251, 0.6) 51.5%,
      rgba(255, 255, 255, 0) 100%
    );
  }
  .prize {
    color: #fff;
    font-family: Satoshi;
    font-size: 46.525px;
    font-style: normal;
    font-weight: 900;
    line-height: 110%; /* 51.177px */
  }
  .zkl {
    text-align: right;
    font-family: Satoshi;
    font-size: 109.968px;
    font-style: normal;
    font-weight: 900;
    line-height: 110%; /* 120.964px */
    background: linear-gradient(180deg, #fff 0%, #bababa 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .zkl-num {
    text-align: center;
    font-family: Satoshi;
    font-size: 160.289px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
    letter-spacing: 16px;
    background: linear-gradient(180deg, #fff 0%, #bababa 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const BlurButton = styled.span`
  border-radius: 24px;
  border: 1px solid rgba(51, 49, 49, 0.6);
  background: #10131c;
  filter: blur(0.125px);
  color: rgba(251, 251, 251, 0.6);
  text-align: center;
  font-family: Satoshi;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  text-transform: capitalize;
  cursor: pointer;
`;

const Tabs = styled.div`
  .tab-item {
    color: rgba(251, 251, 251, 0.6);
    font-family: "Chakra Petch";
    font-size: 28px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    letter-spacing: -0.5px;
    cursor: pointer;
    &.active {
      color: #fff;
      font-family: "Chakra Petch";
      font-size: 28px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      letter-spacing: -0.5px;
      text-decoration-line: underline;
      /* text-underline-offset: 14px; */
      /* border-bottom: 1px solid #fff; */
    }
  }

  .tag {
    padding: 2px 12px;
    color: #fff;
    text-align: center;
    font-family: "Chakra Petch";
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 20px; /* 100% */
    letter-spacing: -0.5px;
    border-radius: 32px;
    background: #03ca91;
  }
`;

const GreenButton = styled.span`
  color: #0bc48f;
  text-align: center;
  font-family: "Chakra Petch";
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 16px; /* 66.667% */
  letter-spacing: -0.5px;
  border-radius: 40px;
  border: 1px solid #0bc48f;
  cursor: pointer;
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

const ReawardBox = styled.div`
  background: linear-gradient(0deg, #040507 0%, #181d28 100%);
`;

const PrizeLine = styled.div`
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(251, 251, 251, 0.6) 51.5%,
    rgba(255, 255, 255, 0) 100%
  );
`;

export interface NovaPointsListItem {
  name: string;
  points: number;
  earnedBy: {
    name: string;
    points: number;
  }[];
}

export default function Dashboard() {
  const { address } = useAccount();
  const { invite } = useSelector((store: RootState) => store.airdrop);

  const tabs1 = [
    {
      name: "Aggregation Parade",
      tag: "+50%",
    },
    {
      name: "Points & NFTs Breakdown",
    },
    {
      name: "Referrals",
    },
  ];
  const [tabs1Active, setTabs1Active] = useState(0);

  const tabs2 = [
    {
      iconURL: "/img/icon-sector-1.svg",
      name: "Assets",
      category: "holding",
    },
    {
      iconURL: "/img/icon-sector-2.svg",
      name: "Boosted",
      category: "nativeboost",
    },
    {
      iconURL: "/img/icon-sector-3.svg",
      name: "Spot DEX",
      category: "spotdex",
    },
    {
      iconURL: "/img/icon-sector-4.svg",
      name: "Perp DEX",
      category: "perpdex",
    },
    {
      iconURL: "/img/icon-sector-5.svg",
      name: "Lending",
      category: "lending",
    },
    {
      iconURL: "/img/icon-sector-6.svg",
      name: "GameFi",
      category: "gamefi",
    },
    {
      iconURL: "/img/icon-sector-7.svg",
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
    if (!address) return;
    const res = await getNovaCategoryUserPoints(address);
    console.log("getNovaCategoryUserPoints", res);
    setNovaCategoryUserPoints(res?.data || []);
  };

  const [novaCategoryPoints, setNovaCategoryPoints] = useState<
    NovaCategoryPoints[]
  >([]);

  const getNovaCategoryPointsFunc = async () => {
    const res = await getNovaCategoryPoints();
    console.log("getNovaCategoryPoints", res);
    setNovaCategoryPoints(res?.data || []);
  };

  const [tvlCategory, setTvlCategory] = useState<TvlCategory[]>([]);
  const getTvlCategoryFunc = async () => {
    const res = await getTvlCategory();
    console.log("getTvlCategory", res);
    setTvlCategory(res?.data || []);
  };

  const [tvlCategoryMilestone, setTvlCategoryMilestone] = useState<
    TvlCategoryMilestone[]
  >([]);
  const getTvlCategoryMilestoneFunc = async () => {
    const res = await getTvlCategoryMilestone();
    console.log("getTvlCategory", res);
    setTvlCategoryMilestone(res?.data || []);
  };

  const [holdingPoints, setHoldingPoints] = useState(0);
  const getAccountPointFunc = async () => {
    if (!address) {
      setHoldingPoints(0);
      return;
    }
    const { result } = await getAccountPoint(address);
    const points = Number(result?.novaPoint) || 0;

    const kolPoints =
      points !== 0 && invite?.kolGroup
        ? Decimal.mul(points, 0.05).toNumber()
        : 0;
    setHoldingPoints(points + kolPoints);
  };

  const [referPoints, setReferPoints] = useState(0);
  const [pointsDetail, setPointsDetail] = useState({
    refPoints: 0,
    boostPoints: 0,
    okxCampaignPoints: 0,
  });

  const otherNovaPoints = useMemo(() => {
    const points =
      (Number(invite?.points) || 0) +
      pointsDetail.okxCampaignPoints +
      pointsDetail.boostPoints;

    return address ? points : 0;
  }, [invite?.points, pointsDetail]);

  const getPointsDetailFunc = async () => {
    if (!address) return;
    const { result } = await getPointsDetail();
    // console.log("getPointsDetail", res);
    if (result) {
      setPointsDetail({
        refPoints: Number(result?.refPoints) || 0,
        boostPoints: Number(result?.boostPoints) || 0,
        okxCampaignPoints: Number(result?.okxCampaignPoints) || 0,
      });
    }

    setReferPoints(Number(result?.refPoints) || 0);
  };

  const getEcoCategoryPoints = useCallback(
    (category: string) => {
      const filters = novaCategoryUserPoints.filter(
        (item) => item.category === category
      );

      const holdingPoints = filters.reduce(
        (prev, cur) => prev + Number(cur.holdingPoints),
        0
      );
      const refPoints = filters.reduce(
        (prev, cur) => prev + Number(cur.refPoints),
        0
      );

      return {
        points: holdingPoints + refPoints,
        holdingPoints,
        refPoints,
      };
    },
    [novaCategoryUserPoints]
  );

  const ecoHoldingPoints = useMemo(() => {
    const category = tabs2[tabs2Active]?.category;
    const categoryData = getEcoCategoryPoints(category);
    return categoryData?.points || 0;
  }, [getEcoCategoryPoints, tabs2Active]);

  const novaCategoryTotalPoints = useMemo(() => {
    const category = tabs2[tabs2Active]?.category;
    const categoryData = novaCategoryPoints.find(
      (item) => item.category === category
    );

    return categoryData?.totalPoints || 0;
  }, [tabs2Active, novaCategoryPoints]);

  const novaPointsList: NovaPointsListItem[] = useMemo(() => {
    const ecoList = [
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
        name: "GameFi Points",
        category: "gamefi",
      },
      {
        name: "Others Points",
        category: "other",
      },
    ];

    const ecoPoints = ecoList.map((item) => {
      const categoryData = getEcoCategoryPoints(item.category);
      return {
        name: item.name,
        points: categoryData.points,
        earnedBy: [
          {
            name: "Earned by Holding",
            points: categoryData.holdingPoints,
          },
          {
            name: "Earned by Referral",
            points: categoryData.refPoints,
          },
        ],
      };
    });

    const arr: NovaPointsListItem[] = [
      {
        name: "Assets Points",
        points: holdingPoints + referPoints + otherNovaPoints,
        earnedBy: [
          {
            name: "Earned by Holding",
            points: holdingPoints,
          },
          {
            name: "Earned by Referral",
            points: referPoints,
          },
          {
            name: "Earned by Other Activities",
            points: otherNovaPoints,
          },
        ],
      },
      ...ecoPoints,
    ];

    return arr;
  }, [holdingPoints, referPoints, otherNovaPoints, getEcoCategoryPoints]);

  useEffect(() => {
    getAccountPointFunc();
    getPointsDetailFunc();
    getAccountTvlFunc();
    getSupportTokensFunc();
    getTotalTvlByTokenFunc();
    getNovaCategoryUserPointsFunc();
    getTvlCategoryFunc();
    getTvlCategoryMilestoneFunc();
    getNovaCategoryPointsFunc();
  }, [address]);

  return (
    <Container>
      <div className="mt-[29.6px] mx-auto max-w-[1246px] ">
        <CardBox className="relative w-[full]">
          <div className="flex justify-between">
            <div>
              <div className="rewards">
                Rewards gathered so far from there companies
              </div>
              <div className="rewards-line"></div>
              <div className="flex items-center">
                {[
                  "nova",
                  "linea",
                  "layerbank",
                  "puffer",
                  "renzo",
                  "eigenpie",
                  "kelp",
                  "allspark",
                ].map((icon, index) => (
                  <img
                    key={index}
                    src={`/img/icon-rewards-${icon}.svg`}
                    alt=""
                    className="min-w-[72px] w-[72px] h-[72px] block"
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-[30px]">
              <span className="prize">Prize Pool</span>
              <span className="zkl">$ZKL</span>
            </div>
          </div>
          <div className="zkl-num flex justify-center">
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
                className="mt-[30px] ml-[-30px] w-[20px] h-[20px]"
              />
            </Tooltip>
          </div>
        </CardBox>
      </div>

      <div className="mx-auto max-w-[1246px]">
        <DailyRoulette />
        {/* <div className="mt-[40px] flex justify-between items-center">
          <Tabs className="flex items-center gap-[40px]">
            {tabs1.map((tab, index) => (
              <div
                key={index}
                className={`flex items-center gap-[10px]`}
                onClick={() => setTabs1Active(index)}
              >
                <span
                  className={`tab-item ${
                    index === tabs1Active ? "active" : ""
                  }`}
                >
                  {tab.name}
                </span>
                {tab?.tag && <span className="tag">{tab.tag}</span>}
              </div>
            ))}
          </Tabs>
          <GreenButton className="px-[14px] py-[12px] flex justify-center items-center gap-[2px]">
            <img
              src="/img/icon-cale.svg"
              alt=""
              className="mt-[4px] w-[24px] h-[24px] block"
            />
            <span>Check Invite Box 1</span>
          </GreenButton>
        </div> */}

        <div className="mt-[40px]">
          <TabsCard className="pb-[40px]">
            <div className="relative flex items-center justify-between">
              <div className="flex flex items-center gap-[12.15px]">
                {tabs2.map((tab, index) => (
                  <div
                    className={`tab-item flex justify-center items-center gap-[8px] ${
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
                  src={"/img/icon-sector-1.svg"}
                  alt=""
                  className="w-[24px] h-[24px] block"
                />
                <span>Portfolio</span>
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
              <div className="tab-content px-[31px] py-[32.5px]">
                {tabs2Active === 0 && (
                  <Assets
                    ethUsdPrice={ethUsdPrice}
                    supportTokens={supportTokens}
                    totalTvlList={totalTvlList}
                    accountTvlData={accountTvlData}
                    currentTvl={totalTvl}
                    holdingPoints={holdingPoints}
                    novaCategoryTotalPoints={novaCategoryTotalPoints}
                  />
                )}
                {tabs2Active !== 0 && tabs2Active !== 99 && (
                  <EcoDApps
                    tabActive={tabs2[tabs2Active]}
                    novaCategoryUserPoints={novaCategoryUserPoints}
                    tvlCategoryMilestone={tvlCategoryMilestone}
                    holdingPoints={ecoHoldingPoints}
                    novaCategoryTotalPoints={novaCategoryTotalPoints}
                  />
                )}

                {tabs2Active === 99 && (
                  <Portfolio
                    novaPointsList={novaPointsList}
                    handleTabChange={setTabs2Active}
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
