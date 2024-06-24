import styled from "styled-components";
import { useState } from "react";
import { BlurBox } from "@/styles/common";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import { Button } from "@nextui-org/react";
import NovaNetworkTVL from "@/components/NovaNetworkTVL";
// import { TableBoxs } from "@/styles/common";

const BgBox = styled.div`
  position: relative;
  padding-top: 92px;
  width: 100%;
  /* max-height: 1878px; */
  overflow: auto;
  background-image: url("/img/bg-leaderboard.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50%;
`;

const Title = styled.div`
  color: #fff;
  font-family: Satoshi;
  font-size: 56px;
  font-style: normal;
  font-weight: 900;
  line-height: 70px; /* 125% */
  letter-spacing: -0.168px;
  text-transform: capitalize;
`;

const Description = styled.p`
  color: #fff;
  font-family: Satoshi;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 28px; /* 175% */
`;

const Epoch = styled.div`
  border-radius: 16px;
  color: var(--Green, #03d498);
  text-align: center;
  font-family: Satoshi;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 26px; /* 144.444% */
  .epoch-btn {
    width: 44px;
    height: 52px;
    /* padding: 20px 24px; */
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(20px);
    color: #fff;

    &.left {
      border-radius: 16px 0px 0px 16px;
    }
    &.right {
      border-radius: 0 16px 16px 0;
    }
  }

  .epoch-text {
    height: 52px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(20px);
    border-left: 1px solid rgba(255, 255, 255, 0.2);
    border-right: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

const Tabs = styled.div`
  padding: 10px;
  border-radius: 20px;
  border: 0.6px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px);

  .tab-item {
    padding: 20px 24px;
    color: #fff;
    text-align: center;
    font-family: Satoshi;
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 26px; /* 144.444% */
    cursor: pointer;
    white-space: nowrap;

    &.active {
      border-radius: 10px;
      background: #03d498;
      box-shadow: 0px 4px 16px 0px rgba(41, 218, 167, 0.3);
      color: #030d19;
    }
  }
`;

const Table = styled.table`
  width: 100%;
  border-radius: 16px;
  overflow: hidden;

  background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.08) 0%,
      rgba(255, 255, 255, 0.08) 100%
    ),
    rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(20px);

  thead {
    tr {
      background: linear-gradient(
        180deg,
        rgba(16, 243, 178, 0.24) 0%,
        rgba(0, 181, 129, 0.24) 100%
      );
    }

    th {
      padding: 25px;
      color: #fff;
      text-align: left;
      font-family: Satoshi;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 26px; /* 185.714% */
      border-bottom: 0.6px solid rgba(255, 255, 255, 0.2);

      &.rank {
        width: 80px;
        color: #03d498;
        border-right: 0.6px solid rgba(255, 255, 255, 0.2);
        background: rgba(255, 255, 255, 0.04);
      }

      &.points {
        text-align: right;
      }
    }
  }

  .self {
    background: rgba(255, 255, 255, 0.12);
  }

  td {
    padding: 33px 25px;
    color: #fff;
    font-family: Satoshi;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 26px; /* 130% */
    border-bottom: 0.8px solid rgba(255, 255, 255, 0.1);
    /* background: rgba(255, 255, 255, 0.12); */
    white-space: nowrap;

    &.rank {
      width: 80px;
      color: #03d498;
      text-align: center;
      border-right: 0.8px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.04);
    }

    &.points {
      text-align: right;
    }
  }
`;

export default function Leaderboard() {
  const tabs = [
    { name: "Holding" },
    { name: "Spot Dex" },
    { name: "Perp Dex" },
    { name: "Lending" },
    { name: "GameFi" },
    { name: "Other" },
  ];

  const [tabActive, setTabActive] = useState(0);

  return (
    <BgBox>
      <div className="mt-[80px] px-[16px] md:px-[140px] relative z-1">
        <div className="flex items-end flex-col md:flex-row gap-[46px]">
          <div>
            <div className="flex">
              <BlurBox className="px-[16px] py-[14px]">Leaderboard</BlurBox>
            </div>
            <Title className="mt-[20px]">Points Leaderboard</Title>
            <Description className="mt-[30px]">
              Please note that the leaderboard currently displays only the Nova
              Points earned through deposits and holdings. It does not yet
              include Nova Points earned from interacting with eco dapps, invite
              boxes, and other activities. Don't worry—you won't lose these
              points.
            </Description>
          </div>
          <Epoch className="flex items-center whitespace-nowrap">
            <div className="epoch-btn left flex items-center justify-center">
              <AiFillCaretLeft />
            </div>
            <div className="epoch-text px-[20px] flex items-center justify-center">
              Epoch One
            </div>
            <div className="epoch-btn right flex items-center justify-center">
              <AiFillCaretRight />
            </div>
          </Epoch>
        </div>

        <div className="mt-[50px] flex max-w-[100%] overflow-auto">
          <Tabs className="flex items-center gap-[24px]">
            {tabs.map((tab, index) => (
              <span
                key={index}
                className={`tab-item ${index === tabActive ? "active" : ""}`}
                onClick={() => setTabActive(index)}
              >
                {tab.name}
              </span>
            ))}
          </Tabs>
        </div>
        <div className="mt-[26px] max-w-[100%] overflow-auto">
          <Table>
            <thead>
              <tr>
                <th className="rank">RANK</th>
                <th>USER</th>
                <th className="points">DEX POINTS</th>
              </tr>
            </thead>
            <tbody>
              {new Array(10).fill("").map((_, index) =>
                index === 0 ? (
                  <tr className={index === 0 ? "self" : ""}>
                    <td className="rank">{index + 1}</td>
                    <td>
                      <div className="flex items-center gap-[7px]">
                        <span>James Lee</span>
                        <BlurBox className="px-[12px] py-[6px]">You</BlurBox>
                      </div>
                    </td>
                    <td className="points">100,000.00</td>
                  </tr>
                ) : (
                  <tr>
                    <td className="rank">{index + 1}</td>
                    <td>James Lee</td>
                    <td className="points">100,000.00</td>
                  </tr>
                )
              )}
            </tbody>
          </Table>
        </div>
        <div className="mt-[26px] flex justify-center">
          <Button className="text-center text-[16px] leading-[52px] w-[125px] h-[52px] bg-[#03D498] rounded-[100px] text-[#030D19] flex items-center gap-[10px]">
            <span>Load More</span>
            <img
              src="/img/icon-submit-arrow.svg"
              alt=""
              width={13}
              height={10}
            />
          </Button>
        </div>
      </div>

      <NovaNetworkTVL />
    </BgBox>
  );
}
