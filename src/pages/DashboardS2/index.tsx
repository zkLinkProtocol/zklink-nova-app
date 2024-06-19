import { GradientButton2 } from "@/styles/common";
import styled from "styled-components";
import { Link } from "react-router-dom";
import SideRefeffal from "@/components/DashboardS2/Side/SideRefeffal";
import SideNovaPoints from "@/components/DashboardS2/Side/SideNovaPoints";
import SideProjectPoints from "@/components/DashboardS2/Side/SideProjectPoints";
import SideNovaNFT from "@/components/DashboardS2/Side/SideNovaNFT";
import TvlList, { TvlItem } from "@/components/DashboardS2/TvlList";

const Banner1 = styled.div`
  padding: 15px 0;
  text-align: center;
  background: #47e3b2;
  color: #0f242e;
  text-align: center;
  font-family: "Chakra Petch";
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 100% */
  letter-spacing: -0.5px;
`;

const Banner2 = styled.div`
  padding: 20px 77px;
  background: #13388e;
  color: #fff;
  text-align: left;
  font-family: Heebo;
  font-size: 48px;
  font-style: normal;
  font-weight: 900;
  line-height: 56px; /* 116.667% */
  letter-spacing: -0.5px;
`;

const Side = styled.div`
  position: relative;
  padding: 24px;
  padding-bottom: 160px;
  min-width: 440px;
  min-height: 1200px;
  background: #011a24;

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
  width: 100%;
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

const UserInfo = styled.div`
  .nft-num {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    color: #fff;
    font-family: "Chakra Petch";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px; /* 100% */
    letter-spacing: -0.5px;
    background: linear-gradient(
        90deg,
        rgba(72, 236, 174, 0.5) 0%,
        rgba(62, 82, 252, 0.5) 51.07%,
        rgba(73, 206, 215, 0.5) 100%
      ),
      #282828;
  }

  .username {
    color: #fff;
    font-family: "Chakra Petch";
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px; /* 100% */
    letter-spacing: -0.5px;
  }

  .check-in {
    padding: 8px;
    border-radius: 8px;
    border: 1px solid #0bc48f;
    color: #0bc48f;
    text-align: center;
    font-family: "Chakra Petch";
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 16px; /* 100% */
    letter-spacing: -0.5px;
  }

  .upgrade-btn {
    color: #fff;
    text-align: center;
    font-family: "Chakra Petch";
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px; /* 100% */
    letter-spacing: -0.5px;
  }
`;

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

  return (
    <div className="relative pt-[64px] bg-[#0F242E] min-w-[1440px]">
      <div>
        <Banner1 className="banner-1">
          Novadrop Round One, Genesis Wallet Checker is live, Check Now!
        </Banner1>
        <Banner2 className="banner-2">
          <p>zkLink Nova</p>
          <p className="mt-[16px]">
            The Pioneering and Largest L3 with Aggregated liquidity
          </p>
        </Banner2>
      </div>

      <div className="flex">
        <Side>
          <div className="flex">
            <span className="title">Portfolio</span>
          </div>
          <UserInfo>
            <div className="mt-[24px] flex gap-[16px]">
              <div className="relative h-[96px]">
                <img
                  src="/img/img-INFJ-LYNK.png"
                  alt=""
                  width={96}
                  height={96}
                  className="rounded-[16px] block min-w-[96px]"
                />
                <div className="nft-num">x1</div>
              </div>

              <div className="w-full">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <span className="username">User123456</span>
                  </div>

                  <div className="check-in">Check In</div>
                </div>

                <div className="mt-[20px]">
                  <GradientButton2 className="upgrade-btn py-[8px] w-full block text-center disabled">
                    Upgrade
                  </GradientButton2>
                </div>
              </div>
            </div>
          </UserInfo>

          <div>
            <SideRefeffal />
            <SideNovaPoints />
            <SideProjectPoints />
            <SideNovaNFT />
          </div>

          <div className="absolute bottom-[40px] left-0 right-0 w-full">
            <div className="flex justify-center items-center">
              <div className="flex items-center gap-[24px]">
                <a href="https://blog.zk.link/" target="_blank">
                  <img
                    src="/img/icon-medium.svg"
                    className="w-[32px] h-[32px]"
                  />
                </a>
                <a href="https://discord.com/invite/zklink" target="_blank">
                  <img src="/img/icon-dc.svg" className="w-[32px] h-[32px]" />
                </a>
                <a href="https://t.me/zkLinkorg">
                  <img src="/img/icon-tg.svg" className="w-[32px] h-[32px]" />
                </a>
                <a href="https://twitter.com/zkLink_Official" target="_blank">
                  <img
                    src="/img/icon-twitter.svg"
                    className="w-[24px] h-[24px]"
                  />
                </a>
                <a href="https://github.com/zkLinkProtocol" target="_blank">
                  <img
                    src="/img/icon-github.svg"
                    className="w-[32px] h-[32px]"
                  />
                </a>
              </div>
            </div>

            <div className="mt-[24px]">
              <Link
                to="/about?anchor=disclaimer"
                className="block text-center text-[#999] text-[24px]"
              >
                zkLink Nova Disclaimer
              </Link>
            </div>
          </div>
        </Side>
        <Content>
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

          <div>
            <TvlList tvlList={tvlList} />
          </div>
        </Content>
      </div>
    </div>
  );
}
