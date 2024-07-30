import { NovaCategoryPoints, TvlCategoryMilestone } from "@/api";
import { NovaPointsListItem } from "@/pages/DashboardS2/index2";
import { formatNumberWithUnit, formatToThounds } from "@/utils";
import { Tooltip } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import MilestoneProgress from "../MilestoneProgress";
import { useTranslation } from "react-i18next";

const AllocatedBox = styled.div`
  padding: 16px 28px;
  min-width: 419px;
  border-radius: 16px;
  filter: blur(0.125px);
  border: 2px solid transparent;
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;
  background-image: linear-gradient(to right, #282828, #000000),
    linear-gradient(
      175deg,
      #fb2450 1%,
      #fbc82e 5%,
      #6eee3f,
      #5889f3,
      #5095f1,
      #b10af4
    );

  .label {
    color: var(--Neutral-2, rgba(251, 251, 251, 0.6));
    text-align: center;
    font-family: Satoshi;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }

  .value {
    text-align: right;
    font-family: Satoshi;
    font-size: 24px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
    background: linear-gradient(180deg, #fff 0%, #bababa 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .line {
    margin: 12px auto;
    width: 100%;
    height: 1px;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(251, 251, 251, 0.6) 51.5%,
      rgba(255, 255, 255, 0) 100%
    );
  }
`;

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
  holdingPoints,
  tabActive,
  totalTvl,
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
        zkl: 500000,
      },
      {
        tvl: 200000000,
        zkl: 1000000,
      },
      {
        tvl: 500000000,
        zkl: 2000000,
      },
      {
        tvl: 1000000000,
        zkl: 3000000,
      },
    ],
    spotdex: [
      {
        tvl: 0,
        zkl: 100000,
      },
      {
        tvl: 5000000,
        zkl: 500000,
      },
      {
        tvl: 25000000,
        zkl: 1000000,
      },
      {
        tvl: 50000000,
        zkl: 1500000,
      },
    ],
    perpdex: [
      {
        tvl: 0,
        zkl: 100000,
      },
      {
        tvl: 100000000,
        zkl: 500000,
      },
      {
        tvl: 500000000,
        zkl: 1000000,
      },
      {
        tvl: 2000000000,
        zkl: 2000000,
      },
    ],
    lending: [
      {
        tvl: 0,
        zkl: 100000,
      },
      {
        tvl: 10000000,
        zkl: 350000,
      },
      {
        tvl: 50000000,
        zkl: 700000,
      },
      {
        tvl: 200000000,
        zkl: 1500000,
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
      max: 1000000,
    },
    other: {
      zkl: 50000,
      max: 500000,
    },
    nativeboost: {
      zkl: 50000,
      max: 500000,
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
    return tabActive?.category === "holding" ? totalTvl || 0 : tvl;
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

  const categoryPointsTooltips = useMemo(() => {
    const arr = [
      {
        label: "By Interaction",
        value: formatNumberWithUnit(novaCategoryTotalPoints?.ecoPoints || 0),
      },
      {
        label: "By Referral",
        value: formatNumberWithUnit(
          novaCategoryTotalPoints?.referralPoints || 0
        ),
      },
    ];
    if (novaCategoryTotalPoints?.otherPoints) {
      arr.push({
        label: "By Other Activities",
        value: formatNumberWithUnit(novaCategoryTotalPoints?.otherPoints || 0),
      });
    }
    return arr;
  }, [novaCategoryTotalPoints]);

  const holdingPointsTooltips = useMemo(() => {
    const arr = [
      {
        label: "By Interaction",
        value: formatNumberWithUnit(holdingPoints?.userEcoPoints || 0),
      },
      {
        label: "By Referral",
        value: formatNumberWithUnit(holdingPoints?.userReferralPoints || 0),
      },
    ];

    if (tabActive?.category === "holding") {
      arr.push({
        label: "By Other Activities",
        value: formatNumberWithUnit(holdingPoints?.userOtherPoints || 0),
      });
    }

    return arr;
  }, [holdingPoints, tabActive]);

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

  const { t } = useTranslation();

  return (
    <>
      <div className="flex justify-between">
        <div>
          <div className="holding-title flex items-center gap-[4px]">
            <img
              src={tabActive?.iconURL}
              alt=""
              className="w-[16px] h-[16px]"
            />
            <span>
              {t("dashboard.zkl_allocation_for_sector", {
                sector: tabActive?.name,
              })}
            </span>
          </div>
          <div className="holding-value mt-[16px]">
            {formatToThounds(currentAllocationZKL)} $ZKL{" "}
            <span className="max">(Up to {formatToThounds(maxZKL)} $ZKL)</span>
          </div>
          {!isNoProgress ? (
            <div className="holding-desc mt-[25px] flex items-center gap-[4px]">
              {t("dashboard.next_zkl_allocation_lv")}:{" "}
              {formatToThounds(nextAllocationZKL)} $ZKL
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
        <AllocatedBox>
          <div className="flex items-center justify-between">
            <span className="label">
              {t("dashboard.total_sector_allocated_points")}
            </span>
            <Tooltip
              classNames={{
                content: "py-[20px] px-[16px] text-[14px] bg-[#000811]",
              }}
              content={
                <div className="min-w-[200px]">
                  <div className="text-[#999] text-[14px] font-[500]">
                    Sector Allocated Points
                  </div>
                  {categoryPointsTooltips.map((item, index) => (
                    <div
                      className="mt-[8px] flex items-center justify-between"
                      key={index}
                    >
                      <span className="text-[#fff] text-[14px] font-[500]">
                        {item.label}
                      </span>
                      <span className="text-[#fff] text-[14px] font-[500]">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              }
            >
              <span className="value">
                {formatNumberWithUnit(
                  (novaCategoryTotalPoints?.ecoPoints || 0) +
                    (novaCategoryTotalPoints?.referralPoints || 0)
                )}
              </span>
            </Tooltip>
          </div>
          <div className="line"></div>
          <div className="flex items-center justify-between">
            <span className="label">{t("dashboard.ur_sector_points")}</span>
            <Tooltip
              classNames={{
                content: "py-[20px] px-[16px] text-[14px] bg-[#000811]",
              }}
              content={
                <div className="min-w-[200px]">
                  <div className="text-[#999] text-[14px] font-[500]">
                    {t("dashboard.ur_sector_points")}
                  </div>
                  {holdingPointsTooltips.map((item, index) => (
                    <div
                      className="mt-[8px] flex items-center justify-between"
                      key={index}
                    >
                      <span className="text-[#fff] text-[14px] font-[500]">
                        {item.label}
                      </span>
                      <span className="text-[#fff] text-[14px] font-[500]">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              }
            >
              <span className="value">
                {formatNumberWithUnit(holdingPoints?.userTotalPoints || 0)}
              </span>
            </Tooltip>
          </div>
        </AllocatedBox>
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
                {tabActive?.category === "perpdex"
                  ? `${t("dashboard.current_trading_volume")}: `
                  : `${t("dashboard.current_tvl")}: `}
                ${formatToThounds(currentTvl)}
              </div>
              <div>
                {isMaxProgress ? (
                  <span className="text-green">Max</span>
                ) : (
                  <>
                    {tabActive?.category === "perpdex"
                      ? `${t("dashboard.next_trading_volume_milestone")}: `
                      : `${t("dashboard.next_tvl_milestone")}: `}
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
