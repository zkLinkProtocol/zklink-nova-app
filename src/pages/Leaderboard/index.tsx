import PointsLeaderboard from "@/components/Leaderboard/PointsLeaderboard";
import TrademarksLeaderboard from "@/components/Leaderboard/TrademarksLeaderboard";
import MysteryBoxWinners from "@/components/Leaderboard/MysteryBoxWinners";
import styled from "styled-components";
import { useState } from "react";
import { BgBox, BgCoverImg, TableBoxs } from "@/styles/common";
import EcoBoxWinners from "@/components/Leaderboard/EcoBoxWinners";

const TabItem = styled.div`
  border-radius: 1rem;
  backdrop-filter: blur(15.800000190734863px);
  font-family: Satoshi;
  font-size: 1rem;
  font-style: normal;
  font-weight: 700;
  line-height: 2rem; /* 200% */
  letter-spacing: -0.03125rem;
  /* &.active,
  &:hover {
    color: #fff;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(15.800000190734863px);
  } */
  .gradient-btn {
    background: linear-gradient(to right, #48ebae, #3d51fc, #49e9b0);
    color: #fff;
  }
`;

export default function Leaderboard() {
  const [tabsActive, setTabsActive] = useState(0);
  return (
    <BgBox>
      <BgCoverImg />
      <div className="md:px-[10.44rem] md:mt-[3rem] min-h-[50rem] overflow-auto z-[10] px-[1rem] mt-[1rem] relative z-1">
        {/* Tab btns */}
        <div className="flex items-center md:gap-[2rem] gap-[1re]">
          {[
            "Points Leaderboard",
            "Trademarks Leaderboard",
            "Mystery Box Winners",
            "Eco Box Winners",
          ].map((item, index) => (
            <TabItem
              key={index}
              className={`md:px-[2rem] px-[1rem] md:py-[1rem] py-[0.5rem] cursor-pointer text-nowrap bg-slate-700 ${
                tabsActive === index ? "gradient-btn" : ""
              }`}
              onClick={() => setTabsActive(index)}
            >
              {item}
            </TabItem>
          ))}
        </div>

        {/* Content: tab views */}
        <TableBoxs className="mt-[2rem]">
          {tabsActive === 0 && <PointsLeaderboard />}
          {tabsActive === 1 && <TrademarksLeaderboard />}
          {tabsActive === 2 && <MysteryBoxWinners />}
          {tabsActive === 3 && <EcoBoxWinners />}
        </TableBoxs>
      </div>
    </BgBox>
  );
}
