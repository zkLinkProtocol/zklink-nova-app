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

export const BgBox = styled.div`
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

export default function Bridge() {
  const [activeType, setActiveType] = useState(ActiveTypes[0].value);
  const NovaPoints = () => (
    <>
      <div className="text-base mt-8">
        <h2 className="text-[1.5rem] text-[#fff] font-[700]">
          Aggregation Parade Phase II - Updates
        </h2>
        <p className="mt-[0.75rem] text-[1rem] text-[#A0A5AD] font-[500]">
          The minimal entry requirement has been lowered from 0.25ETH/
          equivalent to{" "}
          <b className="text-[#fff] font-[700]">0.1ETH/ equivalent</b>.
        </p>
        <p className="mt-[0.75rem] text-[1rem] text-[#A0A5AD] font-[500]">
          Anti-Sybil measures will be taken once withdrawal is available. For
          instance, users won't have instant deposit rewards when they deposit
          assets.
        </p>

        <h3 className="mt-[1.25rem] text-[1rem] text-[#fff] font-[500]">
          ❤️ Rewarding Loyal Users of Aggregation Parade:
        </h3>
        <div className="mt-[0.75rem] text-[1rem] text-[#A0A5AD] font-[500]">
          <p>
            All users' points will be boosted by a Loyalty Booster, which is
            calculated in proportion to the days they joined the Agg parade:
          </p>
          <ul>
            <li className="before">
              Loyalty Booster= 0.5% * num of days they joined
            </li>
            <li className="before">
              Nova point_after the boost= (1+loyalty booster) * Nova
              point_before the boost
            </li>
          </ul>
        </div>

        <h3 className="mt-[1.25rem] text-[1rem] text-[#fff] font-[500]">
          🙆 Rewarding zkLink's Oldest Friends:
        </h3>
        <div className="mt-[0.75rem] text-[1rem] text-[#A0A5AD] font-[500]">
          <p>
            zkLink's oldest friends (previous campaign participants) taking part
            in the zkLink Aggregation Parade will have the opportunity to win
            one of the following rewards: point boosters, NFT trademarks, and
            Lynks. See examples of past campaigns below.
          </p>
          <br />
          <ul>
            <li className="before">
              zkLink Nexus Playground Alpha Mainnet Celebration Campaign
            </li>
            <li className="before">zkLink Summer Tour</li>
            <li className="before">Dunkirk Asset Recovery Test</li>
            <li className="before">zkLink loyalty NFT</li>
            <li className="before">And more</li>
          </ul>
        </div>

        <h3 className="mt-[1.25rem] text-[1rem] text-[#fff] font-[500]">
          🚀 Token Merge Bonus (begins 10AM Apr 9, 2024 UTC), unlock another
          chance to boost your Nova points!
        </h3>
        <div className="mt-[0.75rem] text-[1rem] text-[#A0A5AD] font-[500]">
          <p>💎merged wBTC: 2.5x;</p>
          <p>💎merged stablecoins: 3x</p>
        </div>
        <h3 className="mt-[1.25rem] text-[1rem] text-[#fff] font-[500]">
          💡 Ecosystem Bootstrap Bonuses:
        </h3>
        <div className="mt-[0.75rem] text-[1rem] text-[#A0A5AD] font-[500]">
          <p>
            Engage with Nova dApps for additional Nova point incentives (1.5 -
            2x boost for asset interactions). Read more details{" "}
            <a
              href="https://blog.zk.link/aggregation-parade-phase-ii-defis-turn-to-blossom-on-zklink-nova-7b30e2ab1d82"
              target="_blank"
              style={{ color: "#03d498" }}
            >
              here
            </a>
            .
            <br />
            <br />
            More ECO DApps bonus boost will be updated by Apr 14th, 2024
          </p>
        </div>
      </div>
      <div className="text-base mt-8">
        <h2 className="text-[1.5rem] text-[#fff] font-[700]">
          Aggregation Parade Phase I
        </h2>
        <p className="mt-[0.75rem] font-normal">
          You can see the detail and formula of how we calculate Nova points{" "}
          <a
            href="https://blog.zk.link/aggregation-parade-7997d31ca8e1"
            target="_blank"
            style={{ color: "#03d498" }}
          >
            here
          </a>
          .
          <br />
          <br />
          More ECO DApps bonus boost will be updated by Apr 14th, 2024
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
          After making a valid deposit, you will instantly receive a x10 Nova
          Points boost.
        </p>
        <p className="mt-6">
          <span className="font-bold"> Group Multiplier: </span>
          You, along with the users you've referred and their subsequent
          referrals, will be placed into the same group. This group has the
          potential to unlock Group Booster by achieving the following
          Milestones.
        </p>
      </div>
    </>
  );

  const NovaNFT = () => (
    <>
      <div className="text-base mt-8">
        <h2 className="text-[1.5rem] text-[#fff] font-[700]">
          Aggregation Parade Phase II - Updates
        </h2>
        <p className="mt-[0.75rem] text-[1rem] text-[#A0A5AD] font-[500] ">
          <b className="text-[#fff] font-[700]">INITIAL ONE-TIME BOOST</b> in
          Phase I will conclude and Nova points will be calculated and settled
          for campaign participants
        </p>

        <h3 className="mt-[1.25rem] text-[1rem] text-[#fff] font-[500]">
          🙆 Rewarding zkLink’s Oldest Friends:
        </h3>
        <div className="mt-[0.75rem] text-[1rem] text-[#A0A5AD] font-[500]">
          <p>
            Rewards including point boosters, NFT trademarks, and Lynks, will be
            dropped randomly to past campaign participants. (See examples of
            past campaigns below)
          </p>
          <ul>
            <li className="before">
              zkLink Nexus Playground Alpha Mainnet Celebration Campaign
            </li>
            <li className="before">zkLink Summer Tour</li>
            <li className="before">Dunkirk Asset Recovery Test</li>
            <li className="before">zkLink loyalty NFT</li>
          </ul>
        </div>

        <h3 className="mt-[1.25rem] text-[1rem] text-[#fff] font-[500]">
          🎁 Mystery Box Season 2 (Starting April 9):
        </h3>
        <div className="mt-[0.75rem] text-[1rem] text-[#A0A5AD] font-[500]">
          <p>Increased drops from 100 to 1000.</p>
          <p>
            100 drops exclusive to the top 100 leaderboard, 900 randomly dropped
            to active campaign referrers.
          </p>
        </div>
        <h3 className="mt-[1.25rem] text-[1rem] text-[#fff] font-[500]">
          🎁 Invite Box
        </h3>
        <div className="mt-[0.75rem] text-[1rem] text-[#A0A5AD] font-[500]">
          <p>With each referral, you'll receive an 'Invite Box'.</p>
        </div>
      </div>
      <div className="text-base mt-8">
        <h2 className="text-[1.5rem] text-[#fff] font-[700]">
          Aggregation Parade Phase I
        </h2>

        <p className="mt-[0.75rem] font-normal">
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
          through collecting different types of 4 trademark NFTs with our
          referral program.
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
      <div className="relative mb-4 z-[10]">
        <img
          src="/img/zklink-nova-banner@2x.png"
          className="w-full hidden md:block"
        />
        <img
          src="/img/zklink-nova-banner-mobile.png"
          className="w-full block md:hidden"
        />
      </div>
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
