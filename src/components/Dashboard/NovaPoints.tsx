import { CardBox } from "@/styles/common";
import { formatNumberWithUnit, getBooster } from "@/utils";
import styled from "styled-components";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Decimal from "decimal.js";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Checkbox } from "@nextui-org/react";
import { useEffect, useState } from "react";

const GreenTag = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.375rem;
  background: linear-gradient(90deg, #0bc48f 0%, #00192b 107.78%);
`;

interface INovaPointsProps {
  groupTvl: number;
  accountPoint: {
    novaPoint: number;
    referPoint: number;
  };
  pufferEigenlayerPoints: number;
  pufferPoints: number;
  renzoPoints: number;
  renzoEigenLayerPoints: number;
}

export interface OtherPointsItem {
  icon: string;
  pointsName: string;
  eigenlayerName: string;
  pointsValue: number;
  eigenlayerValue: number;
  eigenlayerTips?: string;
  pointsTips?: string;
}

export const OtherPointsItem: React.FC<OtherPointsItem> = ({
  icon,
  pointsName,
  pointsValue,
  eigenlayerName,
  eigenlayerValue,
  pointsTips,
  eigenlayerTips,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mt-[1rem] font-[400] text-[1rem] leading-[1.5rem] tracking-[0.06rem]">
        <div className="flex items-center gap-2">
          <img src={icon} className="w-[1.5rem]" />
          <span className="font-[700]">{pointsName}</span>
          {pointsTips && (
            <img
              data-tooltip-id={`${pointsName.trim()}`}
              src="/img/icon-info.svg"
              className="w-[0.875rem] h-[0.875rem] opacity-40"
            />
          )}
        </div>

        <span>{formatNumberWithUnit(pointsValue)}</span>
      </div>

      <div className="flex justify-between items-center mt-[0.75rem] font-[400] text-[1rem] leading-[1.5rem] tracking-[0.06rem]">
        <div className="flex items-center gap-[0.5rem]">
          <span className="ml-[2rem]">
            Eigenlayer Points ({eigenlayerName})
          </span>

          {eigenlayerTips && (
            <img
              data-tooltip-id={`${eigenlayerName.trim()}`}
              src="/img/icon-info.svg"
              className="w-[0.875rem] h-[0.875rem] opacity-40"
            />
          )}
        </div>
        <span>{formatNumberWithUnit(eigenlayerValue)}</span>
      </div>

      {pointsTips && (
        <ReactTooltip
          id={`${pointsName.trim()}`}
          place="top"
          style={{
            maxWidth: "20rem",
            fontSize: "14px",
            borderRadius: "16px",
          }}
          content={pointsTips}
        />
      )}

      {eigenlayerTips && (
        <ReactTooltip
          id={`${eigenlayerName.trim()}`}
          place="top"
          style={{
            maxWidth: "20rem",
            fontSize: "14px",
            borderRadius: "16px",
          }}
          content={eigenlayerTips}
        />
      )}
    </div>
  );
};

export default function NovaPoints(props: INovaPointsProps) {
  const {
    accountPoint,
    groupTvl,
    pufferEigenlayerPoints,
    pufferPoints,
    renzoPoints,
    renzoEigenLayerPoints,
  } = props;
  const eralyBirdBooster = 1.5;
  const { invite } = useSelector((store: RootState) => store.airdrop);
  const [isHidePoints, setIsHidePoints] = useState(false);
  const [otherPointsList, setOtherPointsList] = useState<OtherPointsItem[]>([]);

  useEffect(() => {
    let otherPoints: OtherPointsItem[] = [
      {
        icon: "/img/icon-puffer-points.png",
        pointsName: "Puffer Points",
        eigenlayerName: "Puffer",
        pointsValue: pufferPoints,
        eigenlayerValue: pufferEigenlayerPoints,
        eigenlayerTips:
          "zkLink Nova utilizes the puffer API to showcase puffer Eigenlayer Points.",
      },
      {
        icon: "/img/icon-ezPoints.png",
        pointsName: "ezPoints",
        eigenlayerName: "Renzo",
        pointsValue: renzoPoints,
        eigenlayerValue: renzoEigenLayerPoints,
        pointsTips:
          "Your ezPoints will be visible one hour after you deposit your ezETH.",
      },
      // TODO: get EigenPie (points & eigenlayer points) num
      {
        icon: "/img/icon-eigenpie.png",
        pointsName: "EigenPie Points",
        eigenlayerName: "EigenPie",
        pointsValue: 0, // TODO
        eigenlayerValue: 0, // TODO
      },
    ];
    if (isHidePoints) {
      setOtherPointsList(otherPoints.filter((item) => item.pointsValue >= 0.1));
    } else {
      setOtherPointsList(otherPoints);
    }
  }, [
    pufferPoints,
    pufferEigenlayerPoints,
    renzoPoints,
    renzoEigenLayerPoints,
    isHidePoints,
  ]);

  return (
    <>
      {/* // TODO update nova points style */}
      {/* <CardBox className="mt-[1.5rem] p-[1.5rem] bg">
        <p className="w-full text-[1rem] font-[700] text-[1rem] leading-[1.5rem] tracking-[0.06rem]">
          Nova Points
        </p>
        <div className="py-[0.7rem] ml-[4rem] text-[2.5rem] font-[700]">
          {formatNumberWithUnit(
            (+accountPoint.novaPoint || 0) + (+accountPoint.referPoint || 0)
          )}
        </div>
        <p className="text-[1rem] pr-4 opacity-60">
          Don't worry, we are synchronizing Nova Points. Your Nova Points will
          be updated after the syncing process has ended.
        </p>
      </CardBox> */}

      <CardBox className="mt-[1.5rem] p-[1.5rem]">
        <p className="w-full text-[1rem] font-[700] text-[1rem] leading-[1.5rem] tracking-[0.06rem]">
          Nova Points
        </p>

        <div className="flex items-center gap-[1rem]">
          <span
            className="text-[2.5rem] font-[700]"
            data-tooltip-id="nova-points"
          >
            {formatNumberWithUnit(
              (+accountPoint.novaPoint || 0) + (+accountPoint.referPoint || 0)
            )}
          </span>

          <ReactTooltip
            id="nova-points"
            place="top-start"
            style={{ fontSize: "14px", borderRadius: "16px", zIndex: "999999" }}
            render={() => (
              <div>
                <p className="flex justify-between gap-4 items-center font-[400] text-[14px] leading-[1.5rem] tracking-[0.06rem]">
                  <span>Earn By Your Deposit and Holding</span>
                  <span>{formatNumberWithUnit(accountPoint.novaPoint)}</span>
                </p>
                <p className="flex justify-between gap-4 items-center mt-[0.5rem] font-[400] text-[14px] leading-[1.5rem] tracking-[0.06rem]">
                  <span>Earned By Referring Friends</span>
                  <span>{formatNumberWithUnit(accountPoint.referPoint)}</span>
                </p>
              </div>
            )}
          />

          <GreenTag
            data-tooltip-id="booster-learn-more"
            className="py-[0.375rem] w-[5.625rem] text-[1rem]"
          >
            {Decimal.mul(getBooster(groupTvl) + 1, eralyBirdBooster).toNumber()}
            x
          </GreenTag>

          <ReactTooltip
            id="booster-learn-more"
            place="top"
            style={{ fontSize: "14px", borderRadius: "16px" }}
            render={() => (
              <div>
                <p>
                  {getBooster(groupTvl) !== 0 &&
                    `Group Booster: ${getBooster(groupTvl)}x`}
                </p>
                <p className="mt-[0.5rem]">
                  Early Bird Booster: {eralyBirdBooster}x
                </p>
                <p className="mt-[0.5rem]">
                  Total Booster = {eralyBirdBooster} * ({1} +{" "}
                  {getBooster(groupTvl)})
                </p>
                {invite?.kolGroup && (
                  <p className="mt-[0.5rem]">Referral Booster: 5%</p>
                )}
                <br />
                <a
                  href="https://blog.zk.link/aggregation-parade-7997d31ca8e1"
                  target="_blank"
                  className="text-[#0bc48f]"
                >
                  Learn More
                </a>
              </div>
            )}
          />
        </div>
        {/* TODO Est. in next epoch */}
        {/* <p className="w-full text-[1rem] font-[700] text-[1rem] leading-[1.5rem] tracking-[0.06rem]">
          +{accountPoint.referPoint}
        </p>
        <p className="text-[1rem] text-[#919192] font-[400]">
          Est. in next epoch
        </p> */}

        <ReactTooltip
          id="more-points-soon"
          place="top"
          style={{ fontSize: "14px", borderRadius: "16px" }}
          content="More points will be listed here soon."
        />

        <div className="mt-[3rem] w-full flex justify-between items-center">
          <div className="text-[1rem] font-[700] text-[1rem] leading-[1.5rem] tracking-[0.06rem] flex items-center gap-[0.5rem]">
            <span>Other Points</span>
            <img
              data-tooltip-id="more-points-soon"
              src="/img/icon-info.svg"
              className="w-[0.875rem] h-[0.875rem] opacity-40"
            />
          </div>
          <Checkbox
            className="mr-[-1rem] flex-row-reverse items-center gap-[0.5rem] whitespace-nowrap"
            isSelected={isHidePoints}
            onValueChange={setIsHidePoints}
          >
            {"Hide Points < 0.1"}
          </Checkbox>
        </div>

        {otherPointsList.map((item, index) => (
          <OtherPointsItem
            key={index}
            icon={item.icon}
            pointsName={item.pointsName}
            eigenlayerName={item.eigenlayerName}
            pointsValue={item.pointsValue}
            eigenlayerValue={item.eigenlayerValue}
            pointsTips={item?.pointsTips}
            eigenlayerTips={item?.eigenlayerTips}
          />
        ))}
      </CardBox>
    </>
  );
}
