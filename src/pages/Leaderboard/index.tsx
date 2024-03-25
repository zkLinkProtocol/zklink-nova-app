import PointsLeaderboard from "@/components/PointsLeaderboard";
import NFTLeaderboard from "./components/NFTLeaderboard";
import NFTLuckWinner from "./components/NFTLuckWinner";
import styled from "styled-components";
import { useState } from "react";
import { BgBox, BgCoverImg, TableBoxs } from "@/styles/common";
import { Tooltip as ReactTooltip } from "react-tooltip";
const TabItem = styled.div`
  border-radius: 1rem;
  backdrop-filter: blur(15.800000190734863px);
  font-family: Satoshi;
  font-size: 1rem;
  font-style: normal;
  font-weight: 700;
  line-height: 2rem; /* 200% */
  letter-spacing: -0.03125rem;
  d &.active,
  &:hover {
    color: #fff;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(15.800000190734863px);
  }
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
      <div className="md:px-[10.44rem] md:mt-[3rem] min-h-[50rem] overflow-auto z-[10] px-[1rem] mt-[1rem]">
        {/* Tab btns */}
        <div className="flex items-center md:gap-[2rem] gap-[1rem]">
          <TabItem
            className={`md:px-[2rem] px-[1rem] md:py-[1rem] py-[0.5rem] cursor-pointer text-nowrap bg-slate-700 ${
              tabsActive === 0 ? "gradient-btn" : ""
            }`}
            onClick={() => setTabsActive(0)}
          >
            Points Leaderboard
          </TabItem>

          {/* <Tooltip content="coming soon"> */}
          <TabItem
            className={`md:px-[2rem] px-[1rem] md:py-[1rem] py-[0.5rem] cursor-pointer text-nowrap bg-slate-700 ${
              tabsActive === 1 ? "gradient-btn " : ""
            }`}
            onClick={() => setTabsActive(1)}
          >
            Referral Leaderboard
          </TabItem>
          <TabItem
            data-tooltip-id="coming-soon"
            className={`md:px-[2rem] px-[1rem] md:py-[1rem] py-[0.5rem] opacity-40 cursor-not-allowed text-nowrap bg-slate-700/40 text-slate-500 ${
              tabsActive === 2 ? "gradient-btn" : ""
            }`}
          >
            Mystery Box Winners
          </TabItem>
        </div>

        <ReactTooltip
          id="coming-soon"
          place="top"
          style={{ fontSize: "14px" }}
          content="coming soon"
        />

        {/* Content: tab views */}
        <TableBoxs className="mt-[2rem]">
          {tabsActive === 0 && <PointsLeaderboard />}
          {tabsActive === 1 && <NFTLeaderboard />}
          {tabsActive === 2 && <NFTLuckWinner />}
        </TableBoxs>
      </div>
    </BgBox>
  );
}
