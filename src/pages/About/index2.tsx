import NovaNetworkTVL from "@/components/NovaNetworkTVL";
import { useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import styled from "styled-components";

const Container = styled.div`
  position: relative;
  padding-top: 92px;
  min-height: 100vh;
  background-image: url("/img/bg-about.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top center;
`;

const Title = styled.h1`
  color: #fff;
  text-align: center;
  font-family: Satoshi;
  font-size: 56px;
  font-style: normal;
  font-weight: 900;
  line-height: 70px; /* 125% */
  letter-spacing: -0.168px;
  text-transform: capitalize;
`;

const CardBox = styled.div`
  padding: 30px;
  border-radius: 14px;
  border: 0.6px solid rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(30px);

  .card-title {
    color: #fff;
    font-family: Satoshi;
    font-size: 22px;
    font-style: normal;
    font-weight: 700;
    line-height: 46px; /* 209.091% */
    letter-spacing: -0.066px;
    cursor: pointer;
  }

  .paragraph {
    color: #d5d5d5;
    font-family: Satoshi;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 26px; /* 162.5% */

    &.text-green,
    .text-green,
    .title {
      color: #03d498;
    }

    .before:before {
      content: "•";
      margin-right: 5px;
    }

    table {
      .tr {
        /* width: 80%; */
        display: flex;
        justify-content: space-around;
        height: 60px;
        background: rgba(0, 0, 0, 0.4);
      }
      .th {
        background: linear-gradient(
          90deg,
          #49eaae 0%,
          #3f54fb 50%,
          #4aced7 100%
        );
        border-radius: 10px 10px 0 0;
      }
      .td {
        /* min-width: 150px; */
        width: 50%;
        color: #fff;
        text-align: center;
        font-family: Satoshi;
        font-size: 18px;
        font-style: normal;
        font-weight: 900;
        line-height: 24px; /* 133.333% */
        letter-spacing: -0.5px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
`;

const Underline = styled.div`
  width: 100%;
  height: 0.8px;
  background: rgba(255, 255, 255, 0.1);
`;

const GreenCard = styled.div`
  height: 79px;
  border-radius: 14px;
  border: 0.6px solid rgba(255, 255, 255, 0.2);
  background: var(--Green, #03d498);
  backdrop-filter: blur(30px);
  color: #030d19;
  font-family: Satoshi;
  font-size: 26px;
  font-style: normal;
  font-weight: 700;
  line-height: 79px;
  letter-spacing: -0.078px;
  text-align: center;
`;

const tokenList1 = [
  { token: "ETH (Merge)", boost: "5" },
  { token: "wETH (Merge)", boost: "5" },
  { token: "wBTC (Merge)", boost: "5" },
  { token: "USDT (Merge)", boost: "5" },
  { token: "USDC (Merge)", boost: "5" },
  { token: "DAI (Merge)", boost: "5" },
  { token: "wBTC", boost: "2" },
  { token: "USDT", boost: "2" },
  { token: "USDC", boost: "2" },
  { token: "DAI", boost: "2" },
  { token: "uniETH", boost: "2" },
  { token: "mstETH", boost: "2" },
  { token: "mswETH", boost: "2" },
  { token: "mmETH", boost: "2" },
  { token: "mwBETH", boost: "2" },
  { token: "uniBTC", boost: "1" },
  { token: "ARB", boost: "1" },
  { token: "OP", boost: "1" },
  { token: "wMNT", boost: "1" },
  { token: "MANTA", boost: "1" },
  { token: "wUSDm", boost: "1" },
];

const tokenList2 = [
  { token: "Stone", boost: "1" },
  { token: "swETH", boost: "1" },
  { token: "wstETH", boost: "1" },
  { token: "nETH", boost: "1" },
  { token: "rsETH", boost: "1" },
  { token: "pufETH", boost: "1" },
  { token: "CYBER", boost: "1" },
  { token: "GAL", boost: "1" },
  { token: "BEL", boost: "1" },
  { token: "ARPA", boost: "1" },
  { token: "weETH", boost: "1" },
  { token: "ezETH", boost: "1" },
  { token: "rswETH", boost: "1" },
  { token: "rnETH", boost: "1" },
  { token: "solvBTC", boost: "1" },
  { token: "M-BTC", boost: "1" },
  { token: "solvBTC.m", boost: "1" },
  { token: "BTCT", boost: "1" },
  { token: "BBTC", boost: "1" },
  { token: "BBUSD", boost: "1" },
];

const Introduction = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <CardBox className="flex flex-col gap-[30px]">
      <div
        className="card-title flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Introduction To The zkLink Nova Aggregation Parade</span>
        {isOpen ? (
          <BsChevronUp className="text-[20px]" />
        ) : (
          <BsChevronDown className="text-[20px]" />
        )}
      </div>
      {isOpen && (
        <>
          <Underline />
          <div className="paragraph">
            zkLink Nova is the first Aggregated Layer 3 ZK Rollup Network with
            EVM compatibility that’s built on top of Ethereum and multiple
            Ethereum Layer 2 Rollups.
          </div>

          <div className="paragraph">
            The Aggregation Parade is a flagship campaign created to introduce
            users to the zkLink Nova platform and ecosystem, rewarding users
            with Nova Points, NFT rewards, and a share of $ZKL prize pools.
            Campaign participants earn Nova Points by interacting with zkLink
            Nova’s Layer 3 platform by bridging assets, engaging with zkLink
            Nova ecosystem DApps, referring friends, and contributing to the
            network’s TVL.
          </div>
          <div className="paragraph">
            <p className="title">
              The Aggregation Parade has reached its second “Season.”
            </p>
            <div>
              <ul>
                <li className="before">
                  Season I of the Aggregation Parade concluded on May 30, 2024,
                  12 AM UTC – in which a snapshot of user Nova Points was taken
                  and subsequent $ZKL was distributed.
                </li>
                <li className="before">
                  Season I of the Aggregation Parade began on May 31, 2024, and
                  will operate under an Epoch timeline, in which there will be
                  at least Three Epochs.
                </li>
              </ul>
            </div>
          </div>
          <div className="paragraph">
            The total prize pool for Aggregation Parade Season II will be 30
            million $ZKL.
          </div>
          <div className="paragraph">
            To participate in our Aggregation Parade Season II, head over to our{" "}
            <a href="https://app.zklink.io/" className="text-green">
              campaign portal
            </a>
            .
          </div>

          <div>
            <img src="/img/about-1.png" alt="" className="block w-full" />
          </div>
        </>
      )}
    </CardBox>
  );
};

const HowToJoin = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CardBox className="flex flex-col gap-[30px]">
      <div
        className="card-title flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>How To Join The Aggregation Parade?</span>
        {isOpen ? (
          <BsChevronUp className="text-[20px]" />
        ) : (
          <BsChevronDown className="text-[20px]" />
        )}
      </div>
      {isOpen && (
        <>
          <Underline />
          <div className="paragraph">
            To participate in our Aggregation Parade Season II, head over to our{" "}
            <a href="https://app.zklink.io/" className="text-green">
              campaign portal
            </a>
            , enter your Invite Code, Connect Your Wallet, and Bridge the
            minimum requirement of 0.1 ETH or equivalent.
          </div>
        </>
      )}
    </CardBox>
  );
};

const EarnNovaNFTs = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CardBox className="flex flex-col gap-[30px]">
      <div
        className="card-title flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>How to earn Nova NFTs?</span>
        {isOpen ? (
          <BsChevronUp className="text-[20px]" />
        ) : (
          <BsChevronDown className="text-[20px]" />
        )}
      </div>
      {isOpen && (
        <>
          <Underline />
          <div>
            <img src="/img/image5.svg" className="w-full block" />
          </div>
          <div className="paragraph">
            <div>
              After obtaining your SBT, you can upgrade it into an ERC-721 NFT
              through collecting ONE OF EACH of the four different types of
              trademark NFT through our referral program.
            </div>
            <div className="before">
              You will get a trademark NFT airdrop for each 3 referrals.
            </div>
            <div className="before">
              Top 100 referrer on the referral leader-board will be airdrop a
              Mystery Box.
            </div>
          </div>
          <div className="paragraph">
            <div>
              Upon Upgrading your Nova Lynks NFT, you will unlock the following
              utilities:
            </div>
            <div className="before">
              <span className="text-[#03D498]">10,000,000 ZKL</span> Airdrop
            </div>
            <div className="before">ZKL swags</div>
            <div className="before">Future NFT whitelist</div>
            <div className="before">zkLink on-site event access</div>
          </div>
        </>
      )}
    </CardBox>
  );
};

const ImportantUpdates = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CardBox className="flex flex-col gap-[30px]">
      <div
        className="card-title flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>📢 Important Updates</span>
        {isOpen ? (
          <BsChevronUp className="text-[20px]" />
        ) : (
          <BsChevronDown className="text-[20px]" />
        )}
      </div>
      {isOpen && (
        <>
          <Underline />
          <div className="paragraph">
            <p>
              1. <b className="text-[#fff]">INITIAL ONE-TIME BOOST</b> in Phase
              I will conclude and Nova points will be calculated and settled for
              campaign participants.
            </p>
            <p>
              2. The minimal entry requirement has been lowered from 0.25ETH/
              equivalent to 0.1ETH/ equivalent.
            </p>
            <p>
              3. All users will earn “loyalty” boosters in proportion to the
              days they joined the Agg parade.
            </p>
            <p>
              4. Referral CAP for each referral is increased from 30 to 100.
            </p>
            <p className="ml-4">
              a. With each referral, you'll receive an 'Invite Box'.
            </p>
            <p>
              5. Mystery Box Season 2 to kick start on{" "}
              <b className="text-[#fff] font-[700]">10AM Apr 9, 2024 UTC</b>.
            </p>
            <p>
              6.Phase II will reward loyal zkLinkers to express appreciation for
              your long term dedication and support.
            </p>
            <p>
              7.Anti-Sybil measures will be taken once withdrawal is available.
              For instance, users won't have instant deposit rewards when they
              deposit assets.
            </p>
            <p>8. 2 key highlights of Phase II entail:</p>
            <p className="ml-4">
              a. Token Merge begins{" "}
              <b className="text-[#fff] font-[700]">10AM Apr 9, 2024 UTC</b>.
            </p>
            <p className="ml-4">
              b. Ecosystem Bootstrap (More details to be revealed on 10AM April
              14, 2024 UTC).
            </p>
          </div>
        </>
      )}
    </CardBox>
  );
};

const InviteMore = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CardBox className="flex flex-col gap-[30px]">
      <div
        className="card-title flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>📈 Invite more friends to the Aggregation Parade!</span>
        {isOpen ? (
          <BsChevronUp className="text-[20px]" />
        ) : (
          <BsChevronDown className="text-[20px]" />
        )}
      </div>
      {isOpen && (
        <>
          <Underline />
          <div className="paragraph">
            Referral code limit increases from 30 to 100.
          </div>
          <div className="paragraph">
            <img
              src="/img/about-referral-rules-v2.png"
              className="w-full block"
            />
          </div>

          <div className="paragraph title">
            Invite Box rarity (14th Apr. 2024)
          </div>
          <div className="paragraph">
            <img src="/img/about-invite-box-rarity.png" className="w-full" />
          </div>

          <div className="paragraph title">
            Invite Box rarity (23rd Apr. 2024)
          </div>
          <div className="paragraph">
            <img src="/img/about-invite-box-rarity2.png" className="w-full" />
          </div>
        </>
      )}
    </CardBox>
  );
};

const MysteryBoxSeason2 = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CardBox className="flex flex-col gap-[30px]">
      <div
        className="card-title flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>🎁 Mystery Box Season 2 (Starting April 9)</span>
        {isOpen ? (
          <BsChevronUp className="text-[20px]" />
        ) : (
          <BsChevronDown className="text-[20px]" />
        )}
      </div>
      {isOpen && (
        <>
          <Underline />
          <div className="paragraph">
            <p>Drops increased from 100 to 1000.</p>
            <p>
              100 drops exclusive to the top 100 leaderboard, 900 randomly
              dropped to active campaign referrers. (See Rarity below)
            </p>
          </div>
          <div className="paragraph title">
            Mystery Box Rarity (14th Apr. 2024)
          </div>
          <div className="paragraph">
            <img
              src="/img/about-aggregation-parade-v2.png"
              className="w-full block"
            />
          </div>

          <div className="paragraph title">
            Mystery Box Rarity (24th Apr. 2024)
          </div>
          <div className="paragraph">
            <p>
              An additional 900 boxes will be distributed to 900 lucky
              participants in the Galxe Quest. (Quest will be back online soon)
            </p>
          </div>
          <div className="paragraph">
            <img
              src="/img/about-aggregation-parade-v2-2.jpg"
              className="w-full block"
            />
          </div>

          <div className="paragraph title">Eco Box Rarity</div>
          <div className="paragraph">
            Eco boxes will be distributed to the top 500 users who earn the most
            Nova Points daily through interactions with Nova ecosystem dApps.
          </div>
          <div className="paragraph">
            <img
              src="/img/about-aggregation-parade-v2-3.png"
              className="w-full block"
            />
          </div>
        </>
      )}
    </CardBox>
  );
};

const RewardingOldestFriends = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CardBox className="flex flex-col gap-[30px]">
      <div
        className="card-title flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>🙆 Rewarding zkLink's Oldest Friends</span>
        {isOpen ? (
          <BsChevronUp className="text-[20px]" />
        ) : (
          <BsChevronDown className="text-[20px]" />
        )}
      </div>
      {isOpen && (
        <>
          <Underline />
          <div className="paragraph">
            <p>
              Rewards including point boosters, NFT trademarks, and Lynks, will
              be dropped randomly to past campaign participants. (See examples
              of past campaigns below)
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
        </>
      )}
    </CardBox>
  );
};

const RewardingLoyalUsers = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CardBox className="flex flex-col gap-[30px]">
      <div
        className="card-title flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>❤️ Rewarding Loyal Users of Aggregation Parade</span>
        {isOpen ? (
          <BsChevronUp className="text-[20px]" />
        ) : (
          <BsChevronDown className="text-[20px]" />
        )}
      </div>
      {isOpen && (
        <>
          <Underline />
          <div className="paragraph">
            <p>
              All users' points will be boosted by a Loyalty Booster, which is
              calculated in proportion to the days they joined the Aggregation:
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
        </>
      )}
    </CardBox>
  );
};

const TokenMergeBonus = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CardBox className="flex flex-col gap-[30px]">
      <div
        className="card-title flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="max-w-[850px]">
          🚀 Token Merge Bonus (begins 10AM Apr 9, 2024 UTC), unlock another
          chance to boost your Nova points!
        </span>
        {isOpen ? (
          <BsChevronUp className="text-[20px]" />
        ) : (
          <BsChevronDown className="text-[20px]" />
        )}
      </div>
      {isOpen && (
        <>
          <Underline />
          <div className="paragraph">
            <p>💎merged wBTC: 2.5x;</p>
            <p>💎merged stablecoins: 3x</p>
          </div>
        </>
      )}
    </CardBox>
  );
};

const EcosystemBootstrapBonuses = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CardBox className="flex flex-col gap-[30px]">
      <div
        className="card-title flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="max-w-[850px]">💡 Ecosystem Bootstrap Bonuses</span>
        {isOpen ? (
          <BsChevronUp className="text-[20px]" />
        ) : (
          <BsChevronDown className="text-[20px]" />
        )}
      </div>
      {isOpen && (
        <>
          <Underline />
          <div className="paragraph">
            Engage with Nova dApps for additional Nova point incentives (1.5 -
            2x boost for asset interactions). More ECO DApps bonus boost will be
            updated by <b className="text-[#fff] font-[700]">Apr 14th, 2024</b>
          </div>
        </>
      )}
    </CardBox>
  );
};

const Timeline = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CardBox className="flex flex-col gap-[30px]">
      <div
        className="card-title flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="max-w-[850px]">Timeline</span>
        {isOpen ? (
          <BsChevronUp className="text-[20px]" />
        ) : (
          <BsChevronDown className="text-[20px]" />
        )}
      </div>
      {isOpen && (
        <>
          <Underline />
          <div className="paragraph">
            <div className="title">Phase 1: Aggregation Phase</div>
            <div className="before">
              Deposit all accepted token types onto NOVA to earn Nova Points
            </div>
          </div>
          <div className="paragraph">
            <div className="title">Phase 2: Token Merge Ceremony</div>
            <div className="before">
              Forming of token merge committee Token Merge participants to get
              added bonus
            </div>
          </div>
          <div className="paragraph">
            <div className="title">Phase 3: Ecosystem Bootstrap</div>
            <div className="before">
              Nova Points Boost will be applied to ECO dApps interactions
            </div>
          </div>
          <div className="paragraph">
            <div className="title">Phase 4: Claiming & Releasing</div>
            <div className="before">
              Nova Points' $ZKL allocation will be announced.
            </div>
          </div>
          <div className="paragraph">
            <img src="/img/about-timeline.png" className="w-full block" />
          </div>
        </>
      )}
    </CardBox>
  );
};

const S2Details = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CardBox className="flex flex-col gap-[30px]">
      <div
        className="card-title flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="max-w-[850px]">
          Aggregation Parade Season II: Details
        </span>
        {isOpen ? (
          <BsChevronUp className="text-[20px]" />
        ) : (
          <BsChevronDown className="text-[20px]" />
        )}
      </div>
      {isOpen && (
        <>
          <Underline />
          <div className="paragraph">
            Aggregation Parade Season II has a combined prize pool of 30 million
            $ZKL that will be distributed to users over the span of at least
            Three Epochs, with Nova Points being converted into ZKL and given to
            participants at the end of each Epoch, based on the user’s
            respective Nova Points accumulated throughout the Epoch.
          </div>
          <div className="paragraph">
            <p>
              The 30 million $ZKL prize pool will be allocated to the following
              categories:
            </p>
            <div>
              <ul>
                <li className="before">
                  Holding Assets (Including Token Merge, Roulette, & Referrals)
                </li>
                <li className="before">Spot DEXs</li>
                <li className="before">Perp DEXs</li>
                <li className="before">Lending</li>
                <li className="before">GameFi</li>
                <li className="before">Other Protocols</li>
                <li className="before">
                  Boost (zkLink Nova Native Ecosystem DApps)
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </CardBox>
  );
};

const AllAboutNovaPoints = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CardBox className="flex flex-col gap-[30px]">
      <div
        className="card-title flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="max-w-[850px]">
          All About Nova Points: How To Earn Nova Points?
        </span>
        {isOpen ? (
          <BsChevronUp className="text-[20px]" />
        ) : (
          <BsChevronDown className="text-[20px]" />
        )}
      </div>
      {isOpen && (
        <>
          <Underline />

          <div className="paragraph">
            Nova Points (NPs) are the designated metric for our campaign system
            used to recognize and reward individuals with $ZKL according to our
            allocation scheme who participate in the zkLink Nova Aggregation
            Parade.
          </div>
          <div className="paragraph">
            Aggregation Parade Season II users who partake in any of the above
            tasks, such as holding assets, merging tokens, referring, engaging
            with dashboard-listed sectors and DApps, and interacting with native
            zkLink Nova DApps will receive Nova Points.
          </div>
          <div className="paragraph">
            <div>In short, to earn Nova Points, users can:</div>
            <ol>
              <li>1. Deposit & Hold Assets On zkLink Nova</li>
              <li>2. Merge Tokens</li>
              <li>
                3. Interact With zkLink Nova Aggregation Parade Participating
                Ecosystem DApps Under The Categories Of Spot DEXs, Perp DEXs,
                Lending, GameFi, & Others.
              </li>
              <li>4. Boost: Interact With Native zkLink Nova DApps</li>
              <li>5. Refer Friends</li>
              <li>5. Roulette</li>
            </ol>
          </div>
          <div className="paragraph">
            Nova Points measure users’ contribution to each sector and action
            mentioned above, and will be used to distribute $ZKL rewards of the
            prize pool of each sector. Nova Points earned during the campaign
            will be converted into $ZKL at the end of each Epoch and distributed
            to participants.
          </div>
          <div className="paragraph">
            <div>
              Nova Points earned are determined and calculated according to
              multiple factors, including:
            </div>
            <ul>
              <li className="before">Deposit Value</li>
              <li className="before">Token Multiplier</li>
              <li className="before">Ecosystem Sector</li>
              <li className="before">Native DApp Boost Engagement</li>
              <li className="before">Referral Activity</li>
              <li className="before">Roulette Distribution</li>
            </ul>
          </div>
          <div className="paragraph">
            As a reminder, to join the Aggregation Parade, please ensure your
            deposit surpasses the Minimum Entry of 0.1 ETH or equivalent.
          </div>
          <div className="paragraph">
            For more information regarding how Nova Points will be calculated,
            please see our{" "}
            <a
              href="https://docs.zklink.io/nova-points-design/nova-points"
              className="text-green"
            >
              Nova Points documentation page
            </a>
          </div>
        </>
      )}
    </CardBox>
  );
};

const TheDifferent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CardBox className="flex flex-col gap-[30px]">
      <div
        className="card-title flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="max-w-[850px]">
          The Different Aggregation Parade Season II Sector/Verticals
        </span>
        {isOpen ? (
          <BsChevronUp className="text-[20px]" />
        ) : (
          <BsChevronDown className="text-[20px]" />
        )}
      </div>
      {isOpen && (
        <>
          <Underline />
          <div className="paragraph">
            <div>
              The focus of Aggregation Parade Season II is ecosystem engagement,
              where participants can earn more Nova Points by interacting with
              zkLink Nova ecosystem DApps. In Season II, the DApps are
              categorized into:
            </div>
            <ul>
              <li className="before">Spot DEXs</li>
              <li className="before">Perp DEXs</li>
              <li className="before">Lending</li>
              <li className="before">GameFi</li>
              <li className="before">Other Protocols</li>
            </ul>
          </div>
          <div className="paragraph">
            Examples of participating protocols include LayerBank, LogX, Aqua,
            iZUMI, Allspark, Interport, Orbiter Finance, Symbiosis, and Meson
            Finance. By interacting with these protocols, users have the
            opportunity to earn extra Nova Points and yield on top of the zkLink
            Nova platform. See the Aggregation Parade Season II Dashboard or the
            image below for additional participating DApps.
          </div>
          <div className="paragraph">
            In terms of calculating rewards according to the different
            categories, it’s important to note that Nova Point calculations will
            vary depending on the sector/vertical, the points a user earns
            inside a particular DApp, and the amount of financial activity a
            user performs within a sector/vertical/DApp.
          </div>
          <div className="paragraph">
            In addition, the size of the prize pool for each sector will depend
            on the milestone that has been achieved – a higher TVL or trading
            volume will result in larger prize pools.
          </div>
        </>
      )}
    </CardBox>
  );
};

const HighRewards = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CardBox className="flex flex-col gap-[30px]">
      <div
        className="card-title flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="max-w-[850px]">
          How To Earn The Highest Rewards & Most Nova Points? Engage With zkLink
          Nova Native DApps
        </span>
        {isOpen ? (
          <BsChevronUp className="text-[20px]" />
        ) : (
          <BsChevronDown className="text-[20px]" />
        )}
      </div>
      {isOpen && (
        <>
          <Underline />
          <div className="paragraph">
            To receive the most Nova Point rewards out of all the categories,
            users can interact with native zkLink Nova DApps such as NovaSwap
            (with more to be featured soon).
          </div>
          <div className="paragraph">
            NovaSwap is an innovative multi-chain aggregated asset AMM DEX built
            on zkLink Nova that offers ultimate security and multi-layer yields.
            NovaSwap enables users to enjoy fast, low-cost transactions and earn
            multiple layers of yields, including LSD yield, LRT points, Nova
            points, trading fees, and $NOVA rewards.
          </div>
          <div className="paragraph">
            To explore NovaSwap {">>"} please go to the{" "}
            <a href="https://novaswap.fi/" className="text-green">
              NovaSwap homepage
            </a>{" "}
            and{" "}
            <a href="https://novaswap.fi/#/swap" className="text-green">
              Launch the App
            </a>
          </div>
        </>
      )}
    </CardBox>
  );
};

const NovaNFTDetails = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CardBox className="flex flex-col gap-[30px]">
      <div
        className="card-title flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="max-w-[850px]">
          Nova NFTs Details, Types, & Utility: How To Earn Nova NFTs?
        </span>
        {isOpen ? (
          <BsChevronUp className="text-[20px]" />
        ) : (
          <BsChevronDown className="text-[20px]" />
        )}
      </div>
      {isOpen && (
        <>
          <Underline />
          <div className="paragraph">
            Users who deposit a minimum amount of 0.1 ETH or equivalent through
            the campaign page or the official canonical bridge to participate in
            the campaign will automatically be given a zkLink Nova SBT.
          </div>
          <div className="paragraph">
            Similar to Season I, Aggregation Parade participants will have the
            chance to earn Trademark NFTs to upgrade their SBT into a special
            Nova Lynks NFT. However, users must collect ONE OF EACH of the four
            different types of Trademark NFTs to upgrade their SBTs. To collect
            Trademark NFTs, users must receive them from the daily “Roulette” or
            through Mystery Boxes.
          </div>
          <div className="paragraph">
            Holding on to these upgraded Nova Lynks NFTs allows users to split
            the pool of 5 million $ZKL tokens allocated to this sector.
          </div>
          <div className="paragraph">
            <div>
              Nova Lynks NFTs can also be purchased on the{" "}
              <a
                href="https://www.okx.com/web3/marketplace/nft/collection/zklinknova/nova-lynks"
                className="text-green"
              >
                OKX NFT
              </a>{" "}
              Marketplace.
            </div>
            <ul>
              <li className="before">
                0-3999 Lynk holders during Season I split 5 million $ZKL
              </li>
              <li className="before">
                4000-9999 Lynk holders during Season II can split 5 million $ZKL
              </li>
            </ul>
          </div>
        </>
      )}
    </CardBox>
  );
};

const ReferralInformation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CardBox className="flex flex-col gap-[30px]">
      <div
        className="card-title flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="max-w-[850px]">
          Referral Information: How To Earn From Inviting Friends?
        </span>
        {isOpen ? (
          <BsChevronUp className="text-[20px]" />
        ) : (
          <BsChevronDown className="text-[20px]" />
        )}
      </div>
      {isOpen && (
        <>
          <Underline />
          <div className="paragraph">
            Similar to Season I of the Aggregation Parade, users who invite
            friends to participate in Season II will earn Nova Points as a
            reward. This happens in two ways.
          </div>
          <div className="paragraph">
            First, those who refer new participants will earn 10% of the Nova
            Points from their direct invitees throughout the campaign’s Epochs.
            Please note that 10% of the Nova Points earned from a user’s
            referral will be distributed to the user’s account by sector (per
            the invitee’s campaign activity). Second, for Season II referrals,
            users who successfully invite a new referee can get 1 Invite Box
            which equates to a certain amount of Nova Points.
          </div>
          <div className="paragraph">
            Also, we are removing the Group Booster to give new campaign
            participants a better advantage!
          </div>
        </>
      )}
    </CardBox>
  );
};

const Roulette = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CardBox className="flex flex-col gap-[30px]">
      <div
        className="card-title flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="max-w-[850px]">
          Referral Information: How To Earn From Inviting Friends?
        </span>
        {isOpen ? (
          <BsChevronUp className="text-[20px]" />
        ) : (
          <BsChevronDown className="text-[20px]" />
        )}
      </div>
      {isOpen && (
        <>
          <Underline />
          <div className="paragraph">
            “Roulette” is a new feature to the Aggregation Parade where every
            day, users can spin a special roulette to win zkLink Nova trademark
            NFTs and Nova Points.
          </div>
        </>
      )}
    </CardBox>
  );
};

const Disclaimer = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CardBox className="flex flex-col gap-[30px]">
      <div
        className="card-title flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="max-w-[850px]">
          Disclaimer: Aggregation Parade Online Campaign
        </span>
        {isOpen ? (
          <BsChevronUp className="text-[20px]" />
        ) : (
          <BsChevronDown className="text-[20px]" />
        )}
      </div>
      {isOpen && (
        <>
          <Underline />
          <div className="paragraph">
            By participating in the Aggregation Parade Online Campaign, you
            agree to the following terms and conditions:
          </div>

          <div className="paragraph">
            <span className="title">Campaign Rules: </span> We reserve the right
            to modify the campaign rules at any time without prior notice.
            Participants are responsible for regularly reviewing the rules to
            stay informed of any changes.
          </div>
          <div className="paragraph">
            <span className="title">Distribution in the Event of Sybil: </span>
            In the event of suspected Sybil activity, where participants create
            multiple accounts to manipulate outcomes, we reserve the right to
            adjust distribution methods and outcomes accordingly. Our decision
            in such matters is final.
          </div>
          <div className="paragraph">
            <span className="title">Rights Reserved: </span> We hold the final
            rights to interpret, explain, and enforce the rules and regulations
            of the campaign. Our decisions regarding any aspect of the campaign,
            including but not limited to participant eligibility, rule
            enforcement, and prize distribution, are binding and not subject to
            dispute.
          </div>
          <div className="paragraph">
            <span className="title">Participant Responsibility: </span>
            Participants are responsible for familiarizing themselves with the
            campaign rules and complying with them. Ignorance of the rules will
            not be accepted as an excuse for non-compliance.
          </div>
          <div className="paragraph">
            <span className="title">Liability: </span>
            Liability: We shall not be held liable for any loss, damage,
            inconvenience, or other adverse outcomes sustained by participants
            or third parties arising from participation in the campaign, except
            in cases of willful misconduct or gross negligence on our part.
          </div>
          <div className="paragraph">
            <span className="title">Consent to Use of Likeness: </span>
            By participating in the campaign, participants consent to the use of
            their likeness, including but not limited to twitter handles, NFTs,
            and other identifying information, for promotional purposes related
            to the campaign, without any compensation.
          </div>
          <div className="paragraph">
            <span className="title">Indemnification: </span>
            Participants agree to indemnify and hold harmless the campaign
            organizers, sponsors, partners, and affiliates from and against any
            claims, losses, damages, liabilities, costs, and expenses arising
            out of or relating to their participation in the campaign.
          </div>
          <div className="paragraph">
            By participating in the Aggregation Parade Online Campaign, you
            acknowledge that you have read, understood, and agree to abide by
            these terms and conditions. Failure to comply with these terms may
            result in disqualification from the campaign and forfeiture of any
            prizes or benefits.
          </div>
        </>
      )}
    </CardBox>
  );
};

const AboutNovaNetwork = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CardBox className="flex flex-col gap-[30px]">
      <div
        className="card-title flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="max-w-[850px]">About zkLink Nova Network</span>
        {isOpen ? (
          <BsChevronUp className="text-[20px]" />
        ) : (
          <BsChevronDown className="text-[20px]" />
        )}
      </div>
      {isOpen && (
        <>
          <Underline />
          <div className="paragraph">
            zkLink Nova is the industry’s first Aggregated Layer 3 Rollup zkEVM
            Network that brings unprecedented liquidity and asset aggregation to
            Ethereum and its Layer 2 Rollups. Built with ZK Stack and zkLink
            Nexus, it leverages zero-knowledge proofs to enhance scalability and
            security. Developers enjoy an open platform for deploying Solidity
            smart contracts, tapping into integrated networks such as Arbitrum
            and zkSync. zkLink Nova simplifies DeFi by presenting a unified
            ecosystem for users and DApps, promoting a seamless blockchain
            experience.
          </div>
        </>
      )}
    </CardBox>
  );
};

export default function About() {
  return (
    <Container>
      <Title className="mt-[80px]">About zkLink Nova Aggregation Parade</Title>

      <div className="mt-[60px] mx-auto max-w-[982px] flex flex-col gap-[30px]">
        <Introduction />
        <HowToJoin />
        <S2Details />
        <AllAboutNovaPoints />
        <TheDifferent />
        <HighRewards />
        <NovaNFTDetails />
        <ReferralInformation />
        <Roulette />
        <Disclaimer />
        <AboutNovaNetwork />
      </div>

      <NovaNetworkTVL />
    </Container>
  );
}
