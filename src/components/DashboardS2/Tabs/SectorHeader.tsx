import { NovaCategoryPoints, TvlCategoryMilestone } from "@/api";
import { NovaPointsListItem } from "@/pages/DashboardS2/index2";
import { formatToThounds } from "@/utils";
import { Tooltip } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import MilestoneProgress from "../MilestoneProgress";
import AllocatedPoints from "./AllocatedPoints";

const MilestoneBox = styled.div`
  color: rgba(251, 251, 251, 0.6);
  font-family: Satoshi;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

interface IProps {
  tvlCategoryMilestone: TvlCategoryMilestone[];
  novaCategoryTotalPoints?: NovaCategoryPoints;
  gamefiTotalPoints?: NovaCategoryPoints;
  gamefiHoldingPoints?: NovaPointsListItem;
  holdingPoints?: NovaPointsListItem;
  tabActive?: {
    category: string;
    name: string;
    iconURL: string;
  };
  totalTvl?: number;
}

export default function SectorHeader({
  tvlCategoryMilestone,
  novaCategoryTotalPoints,
  gamefiTotalPoints,
  holdingPoints,
  gamefiHoldingPoints,
  tabActive,
}: IProps) {
  const [currentAllocationZKL, setCurrentAllocationZKL] = useState(0);
  const [nextAllocationZKL, setNextAllocationZKL] = useState(0);
  const [nextTargetTvl, setNextTargetTvl] = useState(0);
  const [maxZKL, setMaxZKL] = useState(0);

  const milestoneMap: {
    [key: string]: {
      zkl: number;
      tvl: number;
    }[];
  } = {
    holding: [
      {
        tvl: 0,
        zkl: 100000,
      },
      {
        tvl: 200000000,
        zkl: 200000,
      },
      {
        tvl: 500000000,
        zkl: 500000,
      },
      {
        tvl: 1000000000,
        zkl: 1000000,
      },
    ],
    spotdex: [
      {
        tvl: 0,
        zkl: 100000,
      },
      {
        tvl: 5000000,
        zkl: 200000,
      },
      {
        tvl: 25000000,
        zkl: 500000,
      },
      {
        tvl: 50000000,
        zkl: 1000000,
      },
    ],
    perpdex: [
      {
        tvl: 0,
        zkl: 100000,
      },
      {
        tvl: 100000000,
        zkl: 200000,
      },
      {
        tvl: 500000000,
        zkl: 500000,
      },
      {
        tvl: 2000000000,
        zkl: 1000000,
      },
    ],
    lending: [
      {
        tvl: 0,
        zkl: 100000,
      },
      {
        tvl: 10000000,
        zkl: 200000,
      },
      {
        tvl: 50000000,
        zkl: 500000,
      },
      {
        tvl: 200000000,
        zkl: 1000000,
      },
    ],
  };

  const milestoneNoProgressMap: {
    [key: string]: {
      zkl: number;
      max: number;
    };
  } = {
    gamefi: {
      zkl: 10000,
      max: 500000,
    },
    other: {
      zkl: 50000,
      max: 500000,
    },
    nativeboost: {
      zkl: 50000,
      max: 5000000,
    },
  };

  const isNoProgress = useMemo(() => {
    if (
      tabActive?.category === "gamefi" ||
      tabActive?.category === "other" ||
      tabActive?.category === "nativeboost"
    ) {
      return true;
    } else {
      return false;
    }
  }, [tabActive]);

  const currentTvl = useMemo(() => {
    console.log("tvlCategory", tvlCategoryMilestone, tabActive?.category);
    const tvl =
      tvlCategoryMilestone?.find((item) => item.name === tabActive?.category)
        ?.data || 0;

    console.log("tvl", tvl);
    return tvl;
  }, [tvlCategoryMilestone, tabActive]);

  const [milestoneProgressList, setMilestoneProgressList] = useState<number[]>(
    []
  );

  const isMaxProgress = useMemo(() => {
    if (
      milestoneProgressList.length > 0 &&
      milestoneProgressList[milestoneProgressList.length - 1] === 100
    ) {
      return true;
    } else {
      return false;
    }
  }, [milestoneProgressList]);

  useEffect(() => {
    if (!tabActive) return;
    console.log("tabActive", tabActive);

    if (tabActive?.category && isNoProgress) {
      setCurrentAllocationZKL(
        milestoneNoProgressMap[tabActive?.category].zkl || 0
      );
      setMaxZKL(milestoneNoProgressMap[tabActive?.category].max || 0);
    } else {
      const milestoneData = milestoneMap[tabActive?.category];
      console.log("milestoneData", milestoneData);

      if (milestoneData) {
        const currentTvlNum = Number(currentTvl);

        const progressFilters = milestoneData.filter((item) => item.tvl !== 0);

        const arr = progressFilters.map((item, index) => {
          let progress = 0;

          const prevTvl = index > 0 ? progressFilters[index - 1].tvl : 0;
          if (currentTvlNum >= item.tvl) {
            progress = 100;
          } else if (currentTvlNum > prevTvl && currentTvlNum < item.tvl) {
            progress = (currentTvlNum / item.tvl) * 100;
          } else {
            progress = 0;
          }

          return progress;
        });

        const activeFilters = milestoneData.filter(
          (item) => currentTvlNum > item.tvl
        );
        const currentIndex =
          activeFilters.length === 0 ? 0 : activeFilters.length - 1;
        const nextIndex =
          currentIndex + 1 === milestoneData.length
            ? currentIndex
            : currentIndex + 1;

        setCurrentAllocationZKL(milestoneData[currentIndex].zkl || 0);
        setNextAllocationZKL(milestoneData[nextIndex].zkl || 0);
        setNextTargetTvl(milestoneData[nextIndex].tvl || 0);

        setMaxZKL(milestoneData[milestoneData.length - 1].zkl || 0);

        setMilestoneProgressList(arr);
      }
    }
  }, [tabActive?.category, isNoProgress, currentTvl]);

  return (
    <>
      <div className="flex justify-center md:justify-between text-center md:text-left">
        <div>
          <div className="holding-title flex justify-center md:justify-start items-center gap-[4px]">
            <img
              src={tabActive?.iconURL}
              alt=""
              className="w-[16px] h-[16px]"
            />
            <span>$ZKL Allocation for {tabActive?.name}</span>
          </div>
          <div className="holding-value mt-[16px]">
            {formatToThounds(currentAllocationZKL)} $ZKL{" "}
            <br className="md:hidden" />
            <span className="max">(Up to {formatToThounds(maxZKL)} $ZKL)</span>
          </div>
          {!isNoProgress ? (
            <div className="holding-desc mt-[25px] flex items-center gap-[4px]">
              Next $ZKL Allocation Level: {formatToThounds(nextAllocationZKL)}{" "}
              $ZKL
              <Tooltip
                classNames={{
                  content:
                    "max-w-[300px] py-[20px] px-[16px] text-[14px] text-[#FBFBFB99] bg-[#000811]",
                }}
                content={`This sector will allocate ${formatToThounds(
                  nextAllocationZKL
                )} $ZKL after reaching the next milestone.`}
              >
                <img
                  src="/img/icon-info-2.svg"
                  alt=""
                  className="w-[20px] h-[20px]"
                />
              </Tooltip>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="md:block hidden">
          <AllocatedPoints
            gamefiTotalPoints={gamefiTotalPoints}
            novaCategoryTotalPoints={novaCategoryTotalPoints}
            holdingPoints={holdingPoints}
            gamefiHoldingPoints={gamefiHoldingPoints}
            tabActive={tabActive}
          />
        </div>
      </div>
      <MilestoneBox>
        <div className="mt-[36px] flex justify-between items-center">
          {isNoProgress ? (
            <div>
              This sector currently doesn't have a milestone, so the $ZKL
              allocation will grow contingently.
            </div>
          ) : (
            <>
              <div>
                Current{" "}
                {tabActive?.category === "perpdex"
                  ? "Trading Volume: "
                  : "TVL: "}
                ${formatToThounds(currentTvl)}
              </div>
              <div className="text-right">
                {isMaxProgress ? (
                  <span className="text-green">Max</span>
                ) : (
                  <>
                    Next{" "}
                    {tabActive?.category === "perpdex"
                      ? "Trading Volume Milestone: "
                      : "TVL Milestone: "}
                    ${formatToThounds(nextTargetTvl)}
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {isNoProgress ? (
          <div className="w-full mt-[22px]">
            <MilestoneProgress progress={0} isDisabled={true} />
          </div>
        ) : (
          <div className="mt-[22px] flex items-center justify-between gap-[17px]">
            {milestoneProgressList.map((item, index) => (
              <div className="w-full" key={index}>
                <MilestoneProgress progress={item} />
              </div>
            ))}
          </div>
        )}
      </MilestoneBox>
    </>
  );
}
