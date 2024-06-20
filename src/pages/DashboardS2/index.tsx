import styled from "styled-components";
import { Link } from "react-router-dom";
import SideReferral from "@/components/DashboardS2/Side/SideReferral";
import SideNovaPoints from "@/components/DashboardS2/Side/SideNovaPoints";
import SideProjectPoints from "@/components/DashboardS2/Side/SideProjectPoints";
import SideNovaNFT from "@/components/DashboardS2/Side/SideNovaNFT";
import UserInfo from "@/components/DashboardS2/Side/UserInfo";
import SocialMedia from "@/components/DashboardS2/Side/SocialMedia";
import Banner from "@/components/DashboardS2/Banner";
import EcoDApps from "@/components/DashboardS2/EcoDApps";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import {
  SupportToken,
  getAccountTvl,
  getExplorerTokenTvl,
  getSupportTokens,
  getTokenPrice,
  getTotalTvlByToken,
} from "@/api";
import AssetsTable from "@/components/DashboardS2/AssetsTable";
import TvlCard, { TvlItem } from "@/components/DashboardS2/TvlCard";

const Side = styled.div`
  position: relative;
  padding: 24px;
  padding-bottom: 160px;
  min-width: 440px;
  min-height: 1200px;
  background: #011a24;

  &.collapsed {
    width: 80px;
    min-width: 80px;

    .title,
    .side-content {
      display: none;
    }
  }

  .title {
    color: #fff;
    font-family: "Chakra Petch";
    font-size: 32px;
    font-style: normal;
    font-weight: 700;
    line-height: 32px; /* 100% */
    letter-spacing: -0.5px;
  }
`;

const Content = styled.div`
  margin-left: 10px;
  padding: 40px 75px;
  width: calc(100% - 440px);
  &.collapsed {
    width: calc(100% - 80px);
  }
  /* height: 1494px; */
  /* background: #011a24; */
`;

const Title = styled.div`
  .main-title {
    color: #fff;
    font-family: "Chakra Petch";
    font-size: 40px;
    font-style: normal;
    font-weight: 700;
    line-height: 40px; /* 100% */
    letter-spacing: -0.5px;
  }

  .allocated {
    font-family: "Chakra Petch";
    font-size: 36px;
    font-style: normal;
    font-weight: 400;
    line-height: 36px; /* 100% */
    letter-spacing: -0.5px;
    background: linear-gradient(90deg, #6276e7 0%, #e884fe 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .tag {
    padding: 8px 16px;
    border-radius: 8px;
    background: #043f38;
    color: #fff;
    text-align: center;
    font-family: "Chakra Petch";
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 16px; /* 100% */
    letter-spacing: -0.5px;
  }

  .date {
    color: #999;
    font-family: "Chakra Petch";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 14px; /* 100% */
    letter-spacing: -0.5px;
  }

  .desc {
    color: #999;
    font-family: "Chakra Petch";
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px; /* 100% */
    letter-spacing: -0.5px;
  }
`;

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

export default function DashboardS2() {
  const tvlList: TvlItem[] = [
    {
      title: "3,500,000 $ZKL",
      name: "HOLDING",
      currentTvl: "1.23m",
      targetTvl: "5m",
      nextMilestone: "3,500,000 $ZKL",
      progress: "100%",
    },
    {
      title: "500,000 $ZKL",
      name: "SPOT DEX",
      currentTvl: "1.23m",
      targetTvl: "5m",
      nextMilestone: "3,500,000 $ZKL",
      progress: "20%",
    },
    {
      title: "500,000 $ZKL",
      name: "PERP DEX",
      currentTvl: "1.23m",
      targetTvl: "5m",
      nextMilestone: "3,500,000 $ZKL",
      progress: "20%",
    },
    {
      title: "100,000 $ZKL",
      name: "LENDING",
      currentTvl: "1.23m",
      targetTvl: "5m",
      nextMilestone: "3,500,000 $ZKL",
      progress: "20%",
    },
    {
      title: "100,000 $ZKL",
      name: "GAMEFI",
      currentTvl: "1.23m",
      targetTvl: "5m",
      nextMilestone: "3,500,000 $ZKL",
      progress: "20%",
    },
    {
      title: "100,000 $ZKL",
      name: "OTHER",
      currentTvl: "1.23m",
      targetTvl: "5m",
      nextMilestone: "3,500,000 $ZKL",
      progress: "20%",
    },
  ];

  const [tabActive, setTabActive] = useState<string | undefined>(undefined);

  const { address } = useAccount();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const [ethUsdPrice, setEthUsdPrice] = useState(0);
  const [supportTokens, setSupportTokens] = useState<SupportToken[]>([]);
  const [totalTvlList, setTotalTvlList] = useState<TotalTvlItem[]>([]);
  const [accountTvlData, setAccountTvlData] = useState<AccountTvlItem[]>([]);

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

  useEffect(() => {
    getAccountTvlFunc();
    getSupportTokensFunc();
    getTotalTvlByTokenFunc();
  }, [address]);

  return (
    <div className="relative pt-[64px] bg-[#0F242E] min-w-[1440px]">
      <Banner />

      <div className="flex">
        <Side className={`${isCollapsed ? "collapsed" : ""}`}>
          <div className="flex justify-between items-center">
            <span className="title">Portfolio</span>
            {isCollapsed ? (
              <img
                src="/img/icon-increase.svg"
                alt=""
                width={32}
                height={32}
                onClick={() => setIsCollapsed(false)}
              />
            ) : (
              <img
                src="/img/icon-decrease.svg"
                alt=""
                width={32}
                height={32}
                onClick={() => setIsCollapsed(true)}
              />
            )}
            {/* <img src="/img/icon-increase.svg" alt="" width={32} height={32} />
            <img src="/img/icon-decrease.svg" alt="" width={32} height={32} /> */}
          </div>
          <div className="side-content">
            <UserInfo />
            <SideReferral />
            <SideNovaPoints />
            <SideProjectPoints />
            <SideNovaNFT />
          </div>

          <div className="absolute bottom-[40px] left-0 right-0 w-full">
            <SocialMedia isCollapsed={isCollapsed} />
            <div className="disclaimer mt-[24px]">
              <Link
                to="/about?anchor=disclaimer"
                className="flex justify-center block text-center text-[#999] text-[24px]"
              >
                {isCollapsed ? (
                  <img
                    src="/img/icon-warning-white.svg"
                    alt=""
                    width={32}
                    height={32}
                  />
                ) : (
                  "zkLink Nova Disclaimer"
                )}
              </Link>
            </div>
          </div>
        </Side>

        <Content className={`${isCollapsed ? "collapsed" : ""}`}>
          <Title>
            <div className="flex justify-between">
              <span className="main-title">Aggregation Parade Season II</span>
              <span className="allocated">Allocated: 30,000,000 $ZKL</span>
            </div>
            <div className="mt-[16px] flex items-center gap-[16px]">
              <span className="tag">Epoch One - 10,000,000 $ZKL Allocated</span>
              <span className="date">From 06/15/2024 - 07/15/2024</span>
            </div>
            <div className="mt-[16px] desc">
              The Aggregation Parade has allocated 30,000,000 $ZKL for Season 2,
              which will last at least three months. Each month, up to
              10,000,000 $ZKL will be distributed to participants. $ZKL will be
              divided among various sectors, each starting with a minimum
              allocation and its own set of milestones. Sectors can unlock
              additional $ZKL by reaching their goals, and participants in each
              sector will share the sector's $ZKL based on their Nova points
              ratio.
            </div>
          </Title>

          <div className="mt-[40px] flex flex-wrap gap-[24px]">
            {tvlList.map((tvlItem, index) => (
              <TvlCard
                key={index}
                data={tvlItem}
                tabActive={tabActive}
                handleClick={setTabActive}
              />
            ))}
          </div>

          {tabActive === "HOLDING" ? (
            <AssetsTable
              ethUsdPrice={ethUsdPrice}
              supportTokens={supportTokens}
              totalTvlList={totalTvlList}
              accountTvlData={accountTvlData}
            />
          ) : (
            <EcoDApps tabActive={tabActive} />
          )}
        </Content>
      </div>
    </div>
  );
}
