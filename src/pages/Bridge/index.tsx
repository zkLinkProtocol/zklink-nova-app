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
export const BgBox = styled.div`
  position: relative;
  padding-top: 4.5rem;
  padding-bottom: 2rem;
  width: 100%;
  min-height: 100vh;
  background-image: url("/img/bg-leaderboard.jpg");
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

export default function Bridge() {
  const [activeType, setActiveType] = useState(ActiveTypes[0].value);
  const NovaPoints = () => (
    <>
      <div className="text-base mt-8">
        <h2 className="text-[1.5rem] text-[#fff] font-[700]">
          Aggregation Parade Season II
        </h2>
        <p className="mt-[0.75rem] text-[1rem] text-[#A0A5AD] font-[500]">
          1. 💎Continue reaping loyalty rewards from season I by maintaining
          your funds on Nova L3
        </p>
        <p className="mt-[0.75rem] text-[1rem] text-[#A0A5AD] font-[500]">
          2. 🎯Get up to x5 Nova Point boost for Merge Tokens
        </p>
        <p className="mt-[0.75rem] text-[1rem] text-[#A0A5AD] font-[500]">
          3. 🙌Maximize your Nova point boost by interacting with dApps within
          Nova’s Ecosystem
        </p>
        <p className="mt-[0.75rem] text-[1rem] text-[#A0A5AD] font-[500]">
          4. Nova Lynks holder of season I & II to split 10M $ZKL (Available for
          purchase on{" "}
          <a
            href="https://www.okx.com/web3/marketplace/nft/collection/zklinknova/nova-lynks"
            target="_blank"
            className="text-[#03d498] underline underline-offset-1"
          >
            OKX NFT Marketplace
          </a>
          )
        </p>
      </div>

      <div>
        <h3 className="mt-[1.25rem] text-[1rem] text-[#fff] font-[500]">
          😀 Nova NFT Introduction
        </h3>
        <div className="mt-[0.75rem] text-[1rem] text-[#A0A5AD] font-[500]">
          <p>
            You will be able to mint one of the four Nova SBT once you bridge a
            minimal worth of 0.1 ETH.
          </p>
        </div>
      </div>
      <div className="text-base mt-8">
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
      </div>
    </>
    // <>
    //   <div className="text-base mt-8">
    //     <h2 className="text-[1.5rem] text-[#fff] font-[700]">
    //       Aggregation Parade Phase II
    //     </h2>
    //     <p className="mt-[0.75rem] text-[1rem] text-[#A0A5AD] font-[500]">
    //       The minimal entry requirement has been lowered from 0.25ETH/
    //       equivalent to{" "}
    //       <b className="text-[#fff] font-[700]">0.1ETH/ equivalent</b>.
    //     </p>
    //     <p className="mt-[0.75rem] text-[1rem] text-[#A0A5AD] font-[500]">
    //       Anti-Sybil measures will be taken once withdrawal is available. For
    //       instance, users won't have instant deposit rewards when they deposit
    //       assets.
    //     </p>

    //     <h3 className="mt-[1.25rem] text-[1rem] text-[#fff] font-[500]">
    //       ❤️ Rewarding Loyal Users of Aggregation Parade:
    //     </h3>
    //     <div className="mt-[0.75rem] text-[1rem] text-[#A0A5AD] font-[500]">
    //       <p>
    //         All users' points will be boosted by a Loyalty Booster, which is
    //         calculated in proportion to the days they joined the Agg parade:
    //       </p>
    //       <ul>
    //         <li className="before">
    //           Loyalty Booster= 0.5% * num of days they joined
    //         </li>
    //         <li className="before">
    //           Nova point_after the boost= (1+loyalty booster) * Nova
    //           point_before the boost
    //         </li>
    //       </ul>
    //     </div>

    //     <h3 className="mt-[1.25rem] text-[1rem] text-[#fff] font-[500]">
    //       🙆 Rewarding zkLink's Oldest Friends:
    //     </h3>
    //     <div className="mt-[0.75rem] text-[1rem] text-[#A0A5AD] font-[500]">
    //       <p>
    //         zkLink's oldest friends (previous campaign participants) taking part
    //         in the zkLink Aggregation Parade will have the opportunity to win
    //         one of the following rewards: point boosters, NFT trademarks, and
    //         Lynks. See examples of past campaigns below.
    //       </p>
    //       <br />
    //       <ul>
    //         <li className="before">
    //           zkLink Nexus Playground Alpha Mainnet Celebration Campaign
    //         </li>
    //         <li className="before">zkLink Summer Tour</li>
    //         <li className="before">Dunkirk Asset Recovery Test</li>
    //         <li className="before">zkLink loyalty NFT</li>
    //         <li className="before">And more</li>
    //       </ul>
    //     </div>

    //     <h3 className="mt-[1.25rem] text-[1rem] text-[#fff] font-[500]">
    //       🚀 Token Merge Bonus (begins 10AM Apr 9, 2024 UTC), unlock another
    //       chance to boost your Nova points!
    //     </h3>
    //     <div className="mt-[0.75rem] text-[1rem] text-[#A0A5AD] font-[500]">
    //       <p>💎merged wBTC: 2.5x;</p>
    //       <p>💎merged stablecoins: 3x</p>
    //     </div>
    //     <h3 className="mt-[1.25rem] text-[1rem] text-[#fff] font-[500]">
    //       💡 Ecosystem Bootstrap Bonuses:
    //     </h3>
    //     <div className="mt-[0.75rem] text-[1rem] text-[#A0A5AD] font-[500]">
    //       <p>
    //         Engage with Nova dApps for additional Nova point incentives (1.5 -
    //         2x boost for asset interactions). Read more details{" "}
    //         <a
    //           href="https://blog.zk.link/aggregation-parade-phase-ii-defis-turn-to-blossom-on-zklink-nova-7b30e2ab1d82"
    //           target="_blank"
    //           style={{ color: "#03d498" }}
    //         >
    //           here
    //         </a>
    //         .
    //         <br />
    //         <br />
    //         More ECO DApps bonus boost will be updated by Apr 14th, 2024
    //       </p>
    //     </div>
    //   </div>

    //   <div className="text-base mt-8 text-[#A0A5AD]">
    //     <h3 className="mt-[1.25rem] text-[1rem] text-[#fff] font-[500]">
    //       💻 How we calculate Nova Points
    //     </h3>
    //     <p className="mt-[0.75rem]">
    //       You can see the detail and formula of how we calculate Nova points{" "}
    //       <a
    //         href="https://blog.zk.link/aggregation-parade-7997d31ca8e1"
    //         target="_blank"
    //         style={{ color: "#03d498" }}
    //       >
    //         here
    //       </a>
    //       .
    //     </p>
    //     <p className="mt-6">
    //       <span className="font-bold text-[#fff]">
    //         Holding assets on Nova:{" "}
    //       </span>
    //       Holding any supported assets on Nova allows you to accrue Nova points
    //       every 8 hours until the final Nova Point computation date.
    //     </p>
    //     <p className="mt-6">
    //       <span className="font-bold text-[#fff]">Referral Rewards: </span>
    //       By inviting friends, you can earn 10% of the Nova points they earn
    //       throughout the duration of the Aggregation Parade.
    //     </p>

    //     <p className="mt-6">
    //       <span className="font-bold text-[#fff]">Token Multiplier: </span>
    //       Tokens are categorized into three tiers, with higher liquidity tokens
    //       receiving more Nova Points.
    //     </p>

    //     <p className="mt-6">
    //       <span className="font-bold text-[#fff]">Group Multiplier: </span>
    //       You, along with the users you've referred and their subsequent
    //       referrals, will be placed into the same group. This group has the
    //       potential to unlock Group Booster by achieving the following
    //       Milestones.
    //     </p>
    //   </div>
    // </>
  );

  const NovaNFT = () => (
    <>
      <div className="text-base mt-8">
        <h2 className="text-[1.5rem] text-[#fff] font-[700]">
          Aggregation Parade Phase II
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

        {/* <h3 className="mt-[1.25rem] text-[1rem] text-[#fff] font-[500]">
          🎁 Mystery Box Season 2 (Starting April 24):
        </h3>
        <div className="mt-[0.75rem] text-[1rem] text-[#A0A5AD] font-[500]">
          <p>
            Each day, top 100 referrers of previous day and 900 randomly{" "}
            <a
              href="https://app.galxe.com/quest/zkLink/GCqPcthi45"
              target="_blank"
              className="text-green inline-flex items-center gap-1"
            >
              <span>Galxe Quest</span>
              <img src="/img/icon-open-in-new-green.svg" width={14} />
            </a>{" "}
            participants can mint a mystery box.
          </p>
        </div> */}
        <h3 className="mt-[1.25rem] text-[1rem] text-[#fff] font-[500]">
          🎁 Invite Box
        </h3>
        <div className="mt-[0.75rem] text-[1rem] text-[#A0A5AD] font-[500]">
          <p>
            With each referral, you'll receive an 'Invite Box', and have the
            opportunity to win one of the following rewards: point boosters, NFT
            trademarks, and Lynks.
          </p>
        </div>
        <h3 className="mt-[1.25rem] text-[1rem] text-[#fff] font-[500]">
          😀 Nova NFT Introduction
        </h3>
        <div className="mt-[0.75rem] text-[1rem] text-[#A0A5AD] font-[500]">
          <p>
            You will be able to mint one of the four Nova SBT once you bridge a
            minimal worth of 0.1 ETH.
          </p>
        </div>
      </div>
      <div className="text-base mt-8">
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

        <p className="mt-10 text-[1rem] text-[#A0A5AD] font-[500]">
          Upon collecting your SBT, you can upgrade it into Nova Lynks through
          collecting different types of 4 trademark NFTs.
          <br />
          <br />
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

  const Header = () => (
    <div className="flex flex-col px-6 pb-6 md:px-16 lg:px-32 pt-20">
      <h1 className="text-[56px] mb-6 text-white font-bold leading-[41px]">
        zk.Link Nova
      </h1>
      <p className="text-[20px] text-white font-bold">
        The Industry's Leading L3 Aggregating Fragmented Liquidity Across
        Ethereum
      </p>
    </div>
  );

  const SeasonTwoItems = [
    "Continue reaping loyalty rewards from season I by maintaining your funds on Nova L3",
    "Get up to x5 Nova Point boost for Merge Tokens",
    "Maximize your Nova point boost by interacting with dApps within Nova’s Ecosystem",
    () => (
      <p>
        Nova Lynks holder of season I & II to split 10M $ZKL (Available for
        purchase on{" "}
        <a
          className="text-[#03D498] "
          target="_blank"
          href={TRADEMARK_NFT_MARKET_URL}
        >
          OKX NFT Marketplace
        </a>
        )
      </p>
    ),
  ];

  const NftIntroduction = () => (
    <div className="bridge-bg-main mt-10">
      <p className="text-[22px] font-bold leading-5 mb-6">
        Nova NFT Introduction
      </p>
      <div className="bridge-divide"></div>
      <p className="text-[16px] font-normal leading-6 my-6">
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
    </div>
  );

  const SeasonTwo = () => (
    <div className="bridge-bg-main mt-10">
      <p className="text-[24px] font-bold  mb-6">
        Aggregation Parade Season II
      </p>
      <div className="bridge-divide"></div>
      <ul className="season-two-list mt-6 ">
        {SeasonTwoItems.map(
          (item: string | (() => JSX.Element), index: number) => (
            <li key={index} className="flex mb-6">
              <img
                src="./img/icon-check.svg"
                alt=""
                className="w-[18px] h-[18px] mr-2 mt-1"
              />
              {typeof item === "string" ? <p>{item}</p> : item()}
            </li>
          )
        )}
      </ul>
    </div>
  );

  return (
    <BgBox>
      {/* <div className="relative mb-4 z-[10]">
        <img src="/img/banner-zkl-1.gif" className="w-full md:block hidden" />
        <img
          src="/img/banner-zkl-mobile.gif"
          className="w-full block md:hidden"
        />
      </div> */}
      {/* <Banner /> */}
      <Header />
      <div className="block lg:flex  pt-6">
        <div className="md:hidden mx-6 mb-16">
          <BridgeComponent />
          <ThirdPartyBridge />
        </div>
        <div className="px-6 pb-6 md:pl-16 lg:pl-32 lg:w-1/2">
          <h2 className="text-[32px] md:text-4xl mt-0 font-black leading-10 mt-6">
            Bridge to zkLink Nova to Earn Nova Points & $ZKL
          </h2>
          <SeasonTwo />
          <NftIntroduction />
        </div>
        <div className="relative p-6 md:pr-16 lg:pr-32 lg:w-1/2 ">
          <div className="hidden md:block">
            <BridgeComponent />
            <ThirdPartyBridge />
          </div>
        </div>
      </div>
      <div className="flex flex-col px-6 pb-6 md:px-16 lg:px-32">
        <NovaNetworkTVL />
      </div>
    </BgBox>
  );
}