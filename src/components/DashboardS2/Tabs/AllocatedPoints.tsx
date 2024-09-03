import { NovaCategoryPoints } from "@/api";
import { NovaPointsListItem } from "@/pages/DashboardS2/index2";
import { formatNumberWithUnit } from "@/utils";
import { Tooltip } from "@nextui-org/react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const AllocatedBox = styled.div`
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

interface IProps {
  novaCategoryTotalPoints?: NovaCategoryPoints;
  gamefiTotalPoints?: NovaCategoryPoints;
  holdingPoints?: NovaPointsListItem;
  gamefiHoldingPoints?: NovaPointsListItem;
  tabActive?: {
    category: string;
    name: string;
    iconURL: string;
  };
}

export default function AllocatedPoints({
  gamefiTotalPoints,
  novaCategoryTotalPoints,
  holdingPoints,
  gamefiHoldingPoints,
  tabActive,
}: IProps) {
  const { t } = useTranslation();
  const categoryPointsTooltips = useMemo(() => {
    const arr = [
      {
        label: "By Interaction",
        value:
          tabActive?.category === "other"
            ? formatNumberWithUnit(
                (novaCategoryTotalPoints?.ecoPoints || 0) +
                  (gamefiTotalPoints?.ecoPoints || 0)
              )
            : formatNumberWithUnit(novaCategoryTotalPoints?.ecoPoints || 0),
      },
      {
        label: "By Referral",
        value:
          tabActive?.category === "other"
            ? formatNumberWithUnit(
                (novaCategoryTotalPoints?.referralPoints || 0) +
                  (gamefiTotalPoints?.referralPoints || 0)
              )
            : formatNumberWithUnit(
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
  }, [gamefiTotalPoints, novaCategoryTotalPoints, tabActive]);

  const holdingPointsTooltips = useMemo(() => {
    const arr = [
      {
        label: "By Interaction",
        value:
          tabActive?.category === "ohter"
            ? formatNumberWithUnit(
                (holdingPoints?.userEcoPoints || 0) +
                  (gamefiHoldingPoints?.userEcoPoints || 0)
              )
            : formatNumberWithUnit(holdingPoints?.userEcoPoints || 0),
      },
      {
        label: "By Referral",
        value:
          tabActive?.category === "ohter"
            ? formatNumberWithUnit(
                (holdingPoints?.userReferralPoints || 0) +
                  (gamefiHoldingPoints?.userReferralPoints || 0)
              )
            : formatNumberWithUnit(holdingPoints?.userReferralPoints || 0),
      },
    ];

    if (tabActive?.category === "holding") {
      arr.push({
        label: "By Other Activities",
        value: formatNumberWithUnit(holdingPoints?.userOtherPoints || 0),
      });
    }

    return arr;
  }, [gamefiHoldingPoints, holdingPoints, tabActive]);

  return (
    <AllocatedBox className="md:min-w-[419px] px-[20px] md:px-[28px] py-[16px]">
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
            {tabActive?.category === "other"
              ? formatNumberWithUnit(
                  (novaCategoryTotalPoints?.ecoPoints || 0) +
                    (novaCategoryTotalPoints?.referralPoints || 0) +
                    (novaCategoryTotalPoints?.otherPoints || 0) +
                    (gamefiTotalPoints?.ecoPoints || 0) +
                    (gamefiTotalPoints?.referralPoints || 0) +
                    (gamefiTotalPoints?.otherPoints || 0)
                )
              : formatNumberWithUnit(
                  (novaCategoryTotalPoints?.ecoPoints || 0) +
                    (novaCategoryTotalPoints?.referralPoints || 0) +
                    (novaCategoryTotalPoints?.otherPoints || 0)
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
  );
}
