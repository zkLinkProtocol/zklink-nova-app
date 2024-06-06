import styled from "styled-components";
import "@/styles/otp-input.css";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
const BgBox = styled.div`
  width: 100%;
  min-height: 100vh;
  color: #a0a5ad;
  font-family: Satoshi;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px; /* 150% */
  letter-spacing: -0.5px;
  background: linear-gradient(
    0deg,
    rgba(0, 178, 255, 0.4) 0%,
    rgba(12, 14, 17, 0.4) 100%
  );
  .banner {
    width: 100%;
    margin-bottom: 24px;
  }
  .title {
    color: #fff;
  }
  .paragraph {
    margin-bottom: 24px;
  }
  .paragraph1 {
    margin-bottom: 16px;
  }
  .paragraph2 {
    margin-bottom: 32px;
  }
  .paragraph3 {
    margin-bottom: 90px;
  }
  .before:before {
    content: "•";
    margin-right: 5px;
  }
  .title-1 {
    font-size: 32px;
    line-height: 3rem; /* 150% */
    letter-spacing: -0.03125rem;
  }
  .title-2 {
    font-size: 28px;
    line-height: 1.5; /* 150% */
    letter-spacing: -0.03125rem;
  }
  .jump {
    color: #03d498;
    cursor: pointer;
  }
  .marginLeft {
    margin-left: 30px;
  }
  .tr {
    /* width: 80%; */
    display: flex;
    justify-content: space-around;
    height: 60px;
    background: rgba(0, 0, 0, 0.4);
  }
  .th {
    background: linear-gradient(90deg, #49eaae 0%, #3f54fb 50%, #4aced7 100%);
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
  .last {
    border-radius: 0 0 10px 10px;
  }
  .person {
    width: 147px;
    height: 147px;
    flex-shrink: 0;
    border-radius: 8px;
    background: url(<path-to-image>), lightgray 50% / cover no-repeat;
    margin-right: 55px;
  }

  @media (max-width: 768px) {
    .title-1 {
      font-size: 28px;
    }
  }
`;

const BannerText = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.32);

  .text {
    background: linear-gradient(90deg, #fff 0%, #a1f4ff 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke-width: 1;
    -webkit-text-stroke-color: #000;
    font-family: "Irish Grover";
    font-size: 60px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 1.6px;
    text-transform: capitalize;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    .text {
      font-size: 26px;
    }
  }
`;
export default function About() {
  const [searchParams] = useSearchParams();

  const scrollToAnchor = () => {
    const anchorName = searchParams.get("anchor");

    if (!!anchorName) {
      let anchorElement = document.getElementById(anchorName);
      if (anchorElement) {
        const scrollTop = anchorElement.offsetTop - 100;
        window.scrollTo(0, scrollTop);
        document.documentElement.scrollTop = scrollTop;
        document.body.scrollTop = scrollTop;
      }
    }
  };

  useEffect(() => {
    scrollToAnchor();
  }, [searchParams]);

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

  return (
    <BgBox className="relative pb-[3rem]">
      <div className="md:pt-[8.5rem] pt-[5rem] 2xl:px-[300px] md:px-[252px] px-[20px] box-content ">
        <div className="flex relative ">
          <img
            src="/img/about-banner.png"
            className="banner"
            onLoad={scrollToAnchor}
          />

          <BannerText className="absolute flex flex-col justify-center items-center">
            <p className="text text-center">zkLink Nova Campaign</p>
          </BannerText>
        </div>
        <div className="paragraph">
          zkLink Nova is the first aggregated Layer 3 ZK-Rollup network with
          EVM-compatibility, built on top of Ethereum and multiple Layer 2
          rollup networks (L2s).
        </div>
        <div className="paragraph">
          <span className="title">
            Participate in the Aggregation Parade Campaign to earn a share of
            ZKL tokens.
          </span>{" "}
          The Aggregation Parade encompasses rewards in the form of Nova Points
          and NFTs, all tied to the Finale Reward. Users can enhance their Nova
          points by contributing meaningfully to the ecosystem's growth.
          Activities such as early participation, holding more assets, referring
          more friends, and achieving higher group TVL will boost your final
          Nova points which impacts your final reward.
        </div>

        <div className="paragraph">
          <p className="title">
            The campaign will be divided into two Seasons:
          </p>
          <div>
            <ul>
              <li className="before">
                Season 1 of #zkLinkNovaAggParade Season 1 has concluded and
                snapshot of Nova Points taken on May 30, 2024, at 12am UTC 
              </li>
              <li className="before">
                Season 2 will commence 31st May 2024 across a 3 month period
              </li>
            </ul>
          </div>
        </div>

        <div className="paragraph">
          <p className="title">Important updates on Season II</p>
          <div>
            <ul>
              <li className="before">
                Duration: 31st May 2024 - 31st Aug 2, 2024
              </li>
              <li className="before">Group Booster feature will be removed</li>
              <li className="before">Loyalty Booster will be capped at 50%</li>
              <li className="before">
                3% of $ZKL of total supply will be allocated to season II
              </li>
              <li className="before">
                Nova points boost will target rewarding user activities
                associated with DApp interaction within Nova Ecosystem (Find out
                more under Eco dApp section)
              </li>
            </ul>
          </div>
        </div>

        <div className="paragraph1 title title-2">How to earn Nova points?</div>
        <div className="paragraph">
          You can see the detail and formula of how we calculate Nova points{" "}
          <a
            className="jump"
            href="https://blog.zk.link/aggregation-parade-7997d31ca8e1"
            target="_blank"
          >
            here
          </a>
          .
        </div>

        <div className="paragraph">
          <div className="title mt-4">Minimal Entry:</div>
          <div>1. First 7 days 0.1 ETH (Or Equivalent)</div>
          <div>2. After the 7th day 0.25 ETH (Or Equivalent)</div>
        </div>
        <div className="paragraph2">
          <div className="title">Deposit / Bridge Assets to Nova</div>
          <div>
            Bridging any supported assets to Nova can instantly earn Nova
            points. The points earned is determined by a multiple factors:
          </div>
          <ul>
            <li className="before">Deposit Value </li>
            <li className="before">Token Multiplier</li>
            <li className="before">Deposit Multiplier</li>
          </ul>
          <div className="title">
            To join the Aggregation Parade, make sure your deposit surpasses the
            Minimum Entry of 0.1ETH or equivalent.
          </div>
        </div>
        <div className="paragraph">
          <div className="title">Holding assets on Nova</div>
          <div>
            Holding any supported assets on Nova allows you to accrue Nova
            points every 8 hours until the final Nova Point computation date.
          </div>
          <div className="flex gap-[20px] mt-[30px]">
            {/* <img
              src="/img/image2.svg"
              alt=""
              className="w-full"
              onLoad={scrollToAnchor}
            /> */}
            <div className="w-1/2">
              <table className="w-full">
                <tr className="tr">
                  <td className="td">Token</td>
                  <td className="td">Boost</td>
                </tr>
                {tokenList1.map((item, index) => (
                  <tr className="tr" key={index}>
                    <td className="td">{item.token}</td>
                    <td className="td">{item.boost}</td>
                  </tr>
                ))}
              </table>
            </div>

            <div className="w-1/2">
              <table className="w-full">
                <tr className="tr">
                  <td className="td">Token</td>
                  <td className="td">Boost</td>
                </tr>
                {tokenList2.map((item, index) => (
                  <tr className="tr" key={index}>
                    <td className="td">{item.token}</td>
                    <td className="td">{item.boost}</td>
                  </tr>
                ))}
              </table>
            </div>
          </div>
        </div>

        <div className="paragraph">
          <div className="title">Referral Rewards</div>
          <div>
            By inviting friends, you can earn 10% of the Nova points they earn
            throughout the duration of the Aggregation Parade. For instance, if
            you refer to 10 users, and collectively they earn 100 Nova points,
            you will also earn 10 points.
          </div>
        </div>

        <div className="paragraph title title-2">How to earn Nova NFTs?</div>

        {/* <div className='flex paragraph'>
                    <img src="/img/4.png" alt="" className='person'/>
                    <img src="/img/3.png" alt="" className='person'/>
                    <img src="/img/2.png" alt="" className='person'/>
                    <img src="/img/1.png" alt="" className='person'/>
                </div> */}
        <div className="mb-[1rem]">
          <img
            src="/img/image5.svg"
            className="w-full"
            onLoad={scrollToAnchor}
          />
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

        <div>
          <div className="paragraph title title-1">
            Aggregation Parade Phase II begins 10AM April 14, 2024 UTC
          </div>
          <div className="paragraph title title-2">📢 Important Updates</div>
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
          <div className="paragraph title title-2">
            📈 Invite more friends to the Aggregation Parade!
          </div>
          <div className="paragraph">
            Referral code limit increases from 30 to 100.
          </div>
          <div className="paragraph">
            <img
              src="/img/about-referral-rules-v2.png"
              className="w-full"
              onLoad={scrollToAnchor}
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

          <div className="paragraph title title-2">
            🎁 Mystery Box Season 2{" "}
            <b className="text-[#fff] font-[700]">(Starting April 9)</b>
          </div>
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
              className="w-full"
              onLoad={scrollToAnchor}
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
              className="w-full"
              onLoad={scrollToAnchor}
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
              className="w-full"
              onLoad={scrollToAnchor}
            />
          </div>

          <div className="paragraph title title-2">
            🙆 Rewarding zkLink's Oldest Friends
          </div>

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

          <div className="paragraph title title-2">
            ❤️ Rewarding Loyal Users of Aggregation Parade
          </div>
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

          <div className="paragraph title title-2">
            🚀 Token Merge Bonus{" "}
            <b className="text-[#fff] font-[700]">
              (begins 10AM Apr 9, 2024 UTC)
            </b>
            , unlock another chance to boost your Nova points!
          </div>

          <div className="paragraph">
            <p>💎merged wBTC: 2.5x;</p>
            <p>💎merged stablecoins: 3x</p>
          </div>

          <div className="paragraph title title-2">
            💡 Ecosystem Bootstrap Bonuses
          </div>
          <div className="paragraph">
            Engage with Nova dApps for additional Nova point incentives (1.5 -
            2x boost for asset interactions). More ECO DApps bonus boost will be
            updated by <b className="text-[#fff] font-[700]">Apr 14th, 2024</b>
          </div>
        </div>

        <div
          className="paragraph title title-2"
          onClick={() =>
            window.open("https://preview.portal.zklink.io/", "_blank")
          }
        >
          Timeline
        </div>
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
          <img
            src="/img/about-timeline.png"
            className="w-full"
            onLoad={scrollToAnchor}
          />
        </div>

        <div id="disclaimer">
          <div className="paragraph title title-2">
            Disclaimer: Aggregation Parade Online Campaign
          </div>
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
        </div>

        <div className="paragraph title title-2">About zkLink Nova Network</div>
        <div className="paragraph3">
          zkLink Nova is the pioneering Aggregated Layer 3 Rollup zkEVM network
          that brings unprecedented liquidity and asset aggregation to Ethereum
          and its Layer 2 Rollups. Built with ZK Stack and zkLink Nexus, it
          leverages ZK Proofs to enhance scalability and security. Developers
          enjoy an open platform for deploying Solidity smart contracts, tapping
          into integrated networks like Arbitrum and zkSync. Nova simplifies
          DeFi by presenting a unified ecosystem for users and DApps, promoting
          a seamless blockchain experience.
        </div>
      </div>
    </BgBox>
  );
}
