import PointsLeaderboard from "@/components/PointsLeaderboard";
import NFTLeaderboard from "./components/NFTLeaderboard";
import NFTLuckWinner from "./components/NFTLuckWinner";
import styled from "styled-components";
import { useState } from "react";
import { BgBox, BgCoverImg, TableBox } from "@/styles/common";
import { Tooltip as ReactTooltip } from "react-tooltip";
const TabItem = styled.div`
  border-radius: 1rem;
  background: rgba(51, 51, 51, 0.4);
  backdrop-filter: blur(15.800000190734863px);
  color: #7b8ea0;
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
`;

export default function Leaderboard() {
  const [tabsActive, setTabsActive] = useState(0);
  return (
    <BgBox>
      <BgCoverImg />
      <div className="px-[10.44rem] mt-[3rem] min-h-[50rem] overflow-auto z-[10]">
        {/* Tab btns */}
        <div className="flex items-center gap-[2rem]">
          <TabItem
            className={`px-[2rem] py-[1rem] cursor-pointer ${
              tabsActive === 0 ? "active" : ""
            }`}
            onClick={() => setTabsActive(0)}
          >
            Points Leaderboard
          </TabItem>

          {/* <Tooltip content="coming soon"> */}
          <TabItem
            data-tooltip-id="coming-soon"
            className={`px-[2rem] py-[1rem] opacity-40 cursor-not-allowed`}
          >
            Referral Leaderboard
          </TabItem>
          <TabItem
            data-tooltip-id="coming-soon"
            className={`px-[2rem] py-[1rem] opacity-40 cursor-not-allowed`}
          >
            Mystery Box Winners
          </TabItem>
        </div>

        <ReactTooltip
          id="coming-soon"
          place="top"
          style={{fontSize: '14px'}}
          content="coming soon"
        />

        {/* Content: tab views */}
        <TableBox className="mt-[2rem]">
          {tabsActive === 0 && <PointsLeaderboard />}
          {tabsActive === 1 && <NFTLeaderboard />}
          {tabsActive === 2 && <NFTLuckWinner />}
        </TableBox>
      </div>
    </BgBox>
  );
}
