import { ReactNode, useState } from "react";
import classnames from "classnames";
import "@/styles/otp-input.css";
import BridgeComponent from "@/components/Bridge";
import styled from "styled-components";
import { FooterTvlText } from "@/styles/common";
import TotalTvlCard from "@/components/TotalTvlCard";
import ThirdPartyBridge from "@/components/ThirdPartyBridge";
import "./index.scss";
import { TRADEMARK_NFT_MARKET_URL } from "@/constants";
import NovaNetworkTVL from "@/components/NovaNetworkTVL";

<NovaNetworkTVL />;
export const Container = styled.div`
  position: relative;
  padding-top: 100px;
  width: 100%;
  min-width: 1440px;
  min-height: 1498px;
  background-image: url("/img/s2/bg-s2-bridge.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  overflow: auto;

  .before:before {
    content: "•";
    margin-right: 5px;
  }
`;
const ActiveTypes = [
  { label: "NOVA Points", value: "points" },
  { label: "NOVA NFT", value: "nft" },
];
const UtilityList = [
  "ZKL tokens",
  "ZKL Swags (Merchandise)",
  "Future NFT whitelist",
  "On-site Event Access",
];
const Link = styled.span`
  color: #03d498;
`;

const Title = styled.h1`
  font-family: Satoshi;
  font-size: 44.103px;
  font-style: normal;
  font-weight: 900;
  line-height: normal;
  background: linear-gradient(180deg, #fff 0%, #bababa 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const SubTitle = styled.p`
  color: var(--Neutral-2, rgba(251, 251, 251, 0.6));
  font-family: Satoshi;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  text-transform: capitalize;
`;

const Title2 = styled.h2`
  color: var(--Neutral-2, rgba(251, 251, 251, 0.6));
  font-family: Satoshi;
  font-size: 32px;
  font-style: normal;
  font-weight: 700;
  line-height: 46px; /* 143.75% */
  letter-spacing: -0.096px;
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(251, 251, 251, 0.6) 51.5%,
    rgba(255, 255, 255, 0) 100%
  );
`;

const CardBox = styled.div`
  border-radius: 20px;
  border: 0.6px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(45, 45, 45, 0.08) 51.5%,
    rgba(0, 0, 0, 0.08) 100%
  );
  backdrop-filter: blur(30px);
  .card-title {
    color: #fff;
    font-family: Satoshi;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 26px; /* 130% */
  }
`;

export default function Bridge() {
  const SeasonTwoItems = [
    "Total Prize Pool: 30M $ZKL (3% of total supply)",
    "$ZKL will be distributed based on the Nova Points users gained within each Epoch.",
    "Earn Nova Points by actively performing holding assets, transactions, referring friends, and staking assets in DApps.",
    "Nova Lynks NFT holders in Season I & II share a separate 10M $ZKL prize pool",
  ];

  const NftIntroduction = () => (
    <CardBox className="mt-10 p-[26px]">
      <p className="text-[22px] font-bold leading-5 mb-6">
        Nova NFT Introduction
      </p>
      <div className="bridge-divide"></div>
      <p className="text-[#FBFBFB99] text-[16px] font-[700] leading-6 my-6">
        You will be able to mint one of the four Nova SBT once you bridge a
        minimal worth of 0.1 ETH.
      </p>
      <div className="flex items-center justify-between md:justify-start">
        <img
          className="w-16 h-16 md:w-20 md:h-20 md:mr-6"
          src={"/img/nft-1.svg"}
          alt=""
        />
        <img
          className="w-16 h-16 md:w-20 md:h-20 md:mr-6"
          src={"/img/nft-2.svg"}
          alt=""
        />
        <img
          className="w-16 h-16 md:w-20 md:h-20 md:mr-6"
          src={"/img/nft-3.svg"}
          alt=""
        />
        <img
          className="w-16 h-16 md:w-20 md:h-20"
          src={"/img/nft-4.svg"}
          alt=""
        />
      </div>
    </CardBox>
  );

  const SeasonTwo = () => (
    <CardBox className="mt-[45px] p-[26px]">
      <p className="text-[24px] font-bold  mb-6">
        Aggregation Parade Season II
      </p>
      <Line />
      <ul className="season-two-list">
        {SeasonTwoItems.map(
          (item: string | (() => JSX.Element), index: number) => (
            <li key={index} className="flex items-center gap-[10px] mt-6">
              <img
                src="./img/icon-check-white.svg"
                alt=""
                className="w-[18px] h-[18px]"
              />
              {typeof item === "string" ? (
                <p className="text-[#FBFBFB99] text-[14px] font-[700]">
                  {item}
                </p>
              ) : (
                item()
              )}
            </li>
          )
        )}
      </ul>
    </CardBox>
  );

  return (
    <Container>
      <div className="mt-[50px] flex justify-center gap-[50px]">
        <div className="w-[622px]">
          <Title>zk.Link Nova</Title>
          <SubTitle className="mt-[24px]">
            The Industry's Leading L3 Aggregating Fragmented Liquidity Across
            Ethereum
          </SubTitle>
          <Line className="my-[16px]" />
          <Title2 className="w-[612px]">
            Bridge to zkLink Nova to Earn Nova Points & $ZKL
          </Title2>
          <SeasonTwo />
          <NftIntroduction />
        </div>
        <div className="w-[683px] min-w-[683px]">
          <BridgeComponent />
        </div>
      </div>

      <div className="absolute bottom-0 w-full">
        <NovaNetworkTVL />
      </div>
    </Container>
  );
}
