import NovaNetworkTVL from "@/components/NovaNetworkTVL";
import { useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import styled from "styled-components";

const Container = styled.div`
  position: relative;
  padding-top: 92px;
  min-height: 100vh;
  /* max-height: 3266px; */
  overflow: auto;
  background-image: url("/img/s2/bg-s2-about.jpg");
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
`;

const CardBox = styled.div`
  padding: 24px 30px;
  border-radius: 24px;
  border: 2px solid #635f5f;
  background: #151923;

  &.gradient-border {
    filter: blur(0.125px);
    border: 4px solid transparent;
    background-clip: padding-box, border-box;
    background-origin: padding-box, border-box;
    background-image: linear-gradient(to bottom, #282828, #000000),
      linear-gradient(
        175deg,
        #fb2450,
        #fbc82e,
        #6eee3f,
        #5889f3,
        #5095f1,
        #b10af4 80%
      );
  }

  .card-title {
    color: var(--White, #fff);
    font-family: Satoshi;
    font-size: 22px;
    font-style: normal;
    font-weight: 700;
    line-height: 46px; /* 209.091% */
    letter-spacing: -0.066px;
  }

  .paragraph {
    color: var(--Neutral-2, rgba(251, 251, 251, 0.6));
    font-family: Satoshi;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 26px;

    &.text-green,
    .text-green,
    .title {
      color: #03d498;
      font-weight: 900;
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
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(251, 251, 251, 0.6) 51.5%,
    rgba(255, 255, 255, 0) 100%
  );
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

const CollapseCard = ({
  question,
  answer,
  isOpened,
  isGradientBorder,
}: {
  question: string | JSX.Element;
  answer: string | JSX.Element;
  isOpened?: boolean;
  isGradientBorder?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState<Boolean>(Boolean(isOpened) || false);

  return (
    <CardBox
      className={`flex flex-col gap-[30px] ${
        isGradientBorder ? "gradient-border" : ""
      }`}
    >
      <div
        className="card-title flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        {isOpen ? (
          <img
            src="/img/s2/about-arrow-up.svg"
            alt=""
            className="w-[32px] h-[32px]"
          />
        ) : (
          <img
            src="/img/s2/about-arrow-down.svg"
            alt=""
            className="w-[32px] h-[32px]"
          />
        )}
      </div>
      {isOpen && (
        <>
          <Underline />
          {answer}
        </>
      )}
    </CardBox>
  );
};

export default function About() {
  const list = [
    {
      question: "Introduction To The zkLink Nova Aggregation Parade",
      answer: (
        <>
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
                  Season II of the Aggregation Parade began on May 30, 2024, and
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
      ),
      isOpened: true,
      isGradientBorder: true,
    },
    {
      question: "What is the Aggregation Parade Season 2?",
      answer: (
        <>
          <div className="paragraph">
            Aggregation Parade Season 2 is a campaign by zkLink designed to
            incentivize participation within the zkLink ecosystem. Participants
            can earn Nova Points and NFTs (Lynks), which contribute to potential
            $ZKL token rewards.
          </div>
        </>
      ),
    },
    {
      question: "When did Aggregation Parade Season 2 start?",
      answer: (
        <>
          <div className="paragraph">
            The second season of the Aggregation Parade started on May 30, 2024,
            at 10:00 AM UTC.
          </div>
        </>
      ),
    },
    {
      question:
        "How can I earn Nova Points during Aggregation Parade Season 2?",
      answer: (
        <>
          <div className="paragraph">
            You can earn Nova Points by actively performing transactions,
            holding assets, referring friends, and staking assets in DApps.
          </div>
        </>
      ),
    },
    {
      question: "What are Nova Points and how do they benefit me?",
      answer: (
        <>
          <div className="paragraph">
            Nova Points are rewards that participants earn for engaging with the
            zkLink ecosystem. Accumulating these points eables you to share the
            ZKL prize pools.
          </div>
        </>
      ),
    },
    {
      question:
        "Is there a specific amount of ZKL tokens allocated for Aggregation Parade Season 2?",
      answer: (
        <>
          <div className="paragraph">
            3% of the total ZKL supply will be allocated to participants of
            Aggregation Parade Season 2.
          </div>
        </>
      ),
    },
    {
      question:
        "What are the key improvements or new features introduced in Aggregation-Parade Season 2 compared to the first season?",
      answer: (
        <>
          <div className="paragraph">
            The key improvements and features introduced in our Aggregation
            Parade Season II that are distinct from Season I include a newly
            designed and revamped dashboard, where users can view their Nova
            Points accumulated from their platform holdings, sector/vertical
            point rewards, DApp rewards, zkLink Nova native DApp booster rewards
            – as well as a brand new entertainment element where users can spin
            a daily “roulette” for surprise campaign benefits. In addition,
            Season II will convert user Nova Points to $ZKL at the end of each
            Epoch, in which there will be a total of at least three Epochs.
          </div>
        </>
      ),
    },
    {
      question:
        "Can users now check how many Nova points they earn from each DApp in Season 2?",
      answer: (
        <>
          <div className="paragraph">
            Yes. Users will be able to see their Nova Points accumulated from
            each DApp and the total Nova Points accumulated in a DApp’s category
            on the campaign dashboard. This applies across all sectors/verticals
            seen within the dashboard, and the DApps within them.
          </div>
        </>
      ),
    },
    {
      question:
        "Where can I find more information about the Aggregation Parade and how to earn Nova Points?",
      answer: (
        <>
          <div className="paragraph">
            You can find more details within our blog post
          </div>
        </>
      ),
    },
    {
      question:
        "Is there any bonus that S1 participants can receive if they also participate in S2?(ex: points,booster)",
      answer: (
        <>
          <div className="paragraph">
            Early participants (including S1 participants) can earn additional
            points by loyalty booster.
          </div>
        </>
      ),
    },
    {
      question:
        "I have points from Season 1, will they be transferred In Season 2? ",
      answer: (
        <>
          <div className="paragraph">
            Nova Points earned from Season I do not count, continue, or transfer
            over to Season II. Nova Points earned in Season II began on May 30,
            2024, and will be calculated and converted into $ZKL at the end of
            each Epoch.
          </div>
        </>
      ),
    },
    {
      question:
        "Can users who have minted Lynks NFTs in S1 still mint Lynk in S2 if they collect all 4 unique trademark NFTs?",
      answer: (
        <>
          <div className="paragraph">
            Yes, you may mint additional Lynk in S2 and collect trademarks.
          </div>
        </>
      ),
    },
  ];

  return (
    <Container className="px-[104px]">
      <Title className="mt-[80px]">About zkLink Nova Aggregation Parade</Title>

      <div className="mt-[60px] mx-auto flex flex-col gap-[30px]">
        {list.map((item, index) => (
          <CollapseCard
            key={index}
            question={item.question}
            answer={item.answer}
            isOpened={item.isOpened}
            isGradientBorder={item.isGradientBorder}
          />
        ))}
      </div>

      <NovaNetworkTVL />
    </Container>
  );
}
