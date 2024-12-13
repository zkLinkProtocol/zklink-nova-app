import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  CategoryZKLItem,
  NovaCategoryPoints,
  NovaCategoryUserPointsTotal,
  getCategoryZKL,
  getNovaCategoryPoints,
  getNovaCategoryUserPointsTotal,
  getTvlCategoryMilestoneBySeason,
} from "@/api";
import { useAccount } from "wagmi";
import Portfolio from "@/components/DashboardS2/Tabs/Protfolio";
import { epochList } from "@/constants/epoch";
import MysteryBoxIII from "@/components/Dashboard/MysteryBoxIII";

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
    /* cursor: pointer; */

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
  const [tabs2Active, setTabs2Active] = useState(99);

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
    if (epochActive === 2) {
      setCategoryZKLs([
        {
          name: "holding",
          data: "",
          type: "",
          zkl: 100000,
        },
        {
          name: "spotdex",
          data: "",
          type: "",
          zkl: 100000,
        },
        {
          name: "perpdex",
          data: "",
          type: "",
          zkl: 100000,
        },
        {
          name: "lending",
          data: "",
          type: "",
          zkl: 200000,
        },
        {
          name: "nativeboost",
          data: "",
          type: "",
          zkl: 50000,
        },
        {
          name: "other",
          data: "",
          type: "",
          zkl: 50000,
        },
      ]);
    } else {
      setCategoryZKLs(data || []);
    }
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

  useEffect(() => {
    getNovaCategoryPointsFunc();
    getNovaCategoryUserPointsTotalFunc();
  }, [address, season]);

  useEffect(() => {
    getCategoryZKLFunc();
  }, [address, epochActive]);

  return (
    <Container>
      <div className="side fixed right-[8px] md:right-[32px] top-[120px] z-[9] max-w-[350px] md:max-w-[392px] w-full md:w-[392px]">
        <MysteryBoxIII />
      </div>

      <div className="mx-auto max-w-[1246px]">
        <div className="mt-[40px]">
          <TabsCard className="pb-[40px]">
            <div className="relative flex items-center justify-between gap-[8px] overflow-x-auto overflow-y-hidden">
              <div className="flex flex items-center gap-[12.15px]">
                <div
                  className={`tab-item flex justify-center items-center gap-[8px] whitespace-nowrap active`}
                >
                  <img
                    src={"/img/icon-sector-portfolio.svg"}
                    alt=""
                    className="w-[24px] h-[24px] block"
                  />
                  <span>Portfolio</span>
                </div>
              </div>
            </div>

            <div
              className="tab-container"
              style={{
                borderRadius: `0 24px 24px`,
              }}
            >
              <div className="tab-content px-[14px] md:px-[32px] py-[32px]">
                <Portfolio
                  novaPointsList={novaPointsList}
                  handleTabChange={setTabs2Active}
                  epochActive={epochActive}
                  handleEpochChange={setEpochActive}
                />
              </div>
            </div>
          </TabsCard>
        </div>
      </div>
    </Container>
  );
}
