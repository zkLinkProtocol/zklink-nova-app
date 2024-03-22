import { useState, useMemo, useCallback, useEffect } from "react";
import classnames from "classnames";
import "@/styles/otp-input.css";
import BridgeComponent from "@/components/Bridge";
import { Button } from "@nextui-org/react";
import styled from "styled-components";
import { FooterTvlText } from "@/styles/common";
import TotalTvlCard from "@/components/TotalTvlCard";
import { useAccount } from "wagmi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const BgBox = styled.div`
  position: relative;
  padding-top: 5.5rem;
  padding-bottom: 2rem;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(
    360deg,
    rgba(0, 179, 255, 0.4) 0%,
    rgba(12, 14, 17, 0.4) 100%
  );

  overflow: auto;
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

export default function Bridge() {
  const [activeType, setActiveType] = useState(ActiveTypes[0].value);
  const NovaPoints = () => (
    <div className="text-base mt-8">
      <p className="font-normal">
        You can see the detail and formula of how we calculate Nova points{" "}
        <a
          href="https://blog.zk.link/aggregation-parade-7997d31ca8e1"
          target="_blank"
          style={{ color: "#03d498" }}
        >
          here
        </a>
      </p>
      <p className="mt-6 font-bold">Minimal Entry: </p>
      <ul className="list mb-8">
        <li>1. First 7 days 0.1 ETH</li>
        <li>2. After the 7th day 0.25 ETH</li>
      </ul>
      <p className="mt-6">
        <span className="font-bold">Deposit / Bridge Assets to Nova: </span>
        Bridging any supported assets to Nova can instantly earn Nova points.
      </p>
      <p className="mt-6">
        <span className="font-bold"> Holding assets on Nova: </span>
        Holding any supported assets on Nova allows you to accrue Nova points
        every 8 hours until the final Nova Point computation date.
      </p>
      <p className="mt-6">
        <span className="font-bold"> Referral Rewards: </span>
        By inviting friends, you can earn 10% of the Nova points they earn
        throughout the duration of the Aggregation Parade.
      </p>

      <p className="mt-6">
        <span className="font-bold">Multiplier: </span>
        <br />
        <span className="font-bold">Early Bird Multiplier: </span>
        During Phase 1 of the Nova Aggregation Parade, withdrawals are
        temporarily restricted for a Maximum of 30 days.
      </p>
      <p className="mt-6">
        <span className="font-bold">Token Multiplier: </span>
        Tokens are categorized into three tiers, with higher liquidity tokens
        receiving more Nova Points.
      </p>
      <p className="mt-6">
        <span className="font-bold"> Deposit Multiplier: </span>
        After making a valid deposit, you will instantly receive a x10 Nova Points boost.
      </p>
      <p className="mt-6">
        <span className="font-bold"> Group Multiplier: </span>
        You, along with the users you've referred and their subsequent
        referrals, will be placed into the same group. This group has the
        potential to unlock Group Booster by achieving the following
        Milestones. 
      </p>
    </div>
  );

  const NovaNFT = () => (
    <>
      <div className="text-base mt-8">
        <p className="font-normal">
          You will be able to mint one of the four Nova SBT once you bridge a
          minimal worth of 0.1 ETH.
        </p>
        <div className="flex items-center mt-8 mb-8">
          <img
            className="w-16 h-16 md:w-20 md:h-20 mr-6"
            src={"/img/nft-1.svg"}
            alt=""
          />
          <img
            className="w-16 h-16 md:w-20 md:h-20 mr-6"
            src={"/img/nft-2.svg"}
            alt=""
          />
          <img
            className="w-16 h-16 md:w-20 md:h-20 mr-6"
            src={"/img/nft-3.svg"}
            alt=""
          />
          <img
            className="w-16 h-16 md:w-20 md:h-20 mr-6"
            src={"/img/nft-4.svg"}
            alt=""
          />
        </div>
        <p className="font-medium text-[16px] text-[#A0A5AD]">
          Upon collecting your SBT, you can upgrade it into an ERC-721 NFT
          through collecting 4 different types of 100 NFT with our referral
          program.
        </p>
        <p className="font-medium text-[16px] text-[#A0A5AD]">
          You will get a trademark NFT airdrop for each 3 referrals <br />
          Top 100 on the referral leader-board and 50 Randon users are eligible
          to mint a Mystery Box every day.
        </p>
        <p className="font-medium text-[16px] mt-10">
          Once you upgrade your SBT to Nova Lynks, here are the utilities.
        </p>
      </div>
      <div
        className="p-6 rounded-[18px] mt-4"
        style={{ background: "rgba(0, 0, 0, 0.4)" }}
      >
        {UtilityList.map((item, index) => (
          <p
            className={classnames(
              "font-semibold text-lg",
              index === UtilityList.length - 1 ? "mb-0" : "mb-4"
            )}
            key={item}
          >
            {item}
          </p>
        ))}
      </div>
    </>
  );

  return (
    <BgBox>
      <div className="block lg:flex md:py-24 pb-24 pt-6">
        <div className="md:hidden mx-6 mb-16">
          <BridgeComponent />
        </div>
        <div className="px-6 pb-6 md:px-16 lg:px-32 lg:w-1/2">
          <h2 className="text-[32px] md:text-4xl mt-0 font-black leading-10">
            Bridge To zkLink Nova To Earn Extra Yield & Token Rewards
          </h2>
          <div className="inline-flex items-center mt-7 bg-[#1E1F24] px-2 py-2 rounded-md">
            {ActiveTypes.map((item, index) => (
              <Button
                onClick={() => setActiveType(item.value)}
                className={classnames(
                  activeType === item.value ? "gradient-btn" : "default-btn",
                  " px-[1rem] py-[0.5rem] text-[1rem] ",
                  index === 0 ? "mr-4" : 0
                )}
              >
                {item.label}
              </Button>
            ))}
          </div>
          {activeType === "nft" ? <NovaNFT /> : <NovaPoints />}
        </div>
        <div className="relative px-6 md:px-16 lg:px-32 lg:w-1/2">
          <div className="hidden md:block">
            <BridgeComponent />
          </div>

          <div className="md:absolute left-0 bottom-0 flex flex-col md:items-end w-full px-8 md:px-16 lg:px-32">
            <FooterTvlText className="mt-4 md:mt-0 mb-[0.5rem] text-right">
              TVL
            </FooterTvlText>
            <TotalTvlCard />
          </div>
        </div>
      </div>
    </BgBox>
  );
}
