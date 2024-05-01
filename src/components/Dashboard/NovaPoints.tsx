import { CardBox } from "@/styles/common";
import { formatNumber2, formatNumberWithUnit, getBooster } from "@/utils";
import styled from "styled-components";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Decimal from "decimal.js";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Checkbox } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import useOldestFriendsStatus from "@/hooks/useOldestFriendsStatus";

const GreenTag = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.375rem;
  background: linear-gradient(90deg, #0bc48f 0%, #00192b 107.78%);
`;

const RoyaltyBooster = styled.span`
  border-radius: 0.25rem;
  background: linear-gradient(90deg, #48ecae 0%, #3e52fc 100%);
`;

interface INovaPointsProps {
  groupTvl: number;
  referPoints: number;
  novaPoints: number;
  pufferEigenlayerPoints: number;
  pufferPoints: number;
  renzoPoints: number;
  renzoEigenLayerPoints: number;
  magpiePointsData: { points: number; layerPoints: number };
  royaltyBooster: number;
  okxPoints: number;
  kolPoints: number;
  trademarkPoints: number;
  totalNovaPoints: number;
  kelpMiles: number;
  kelpEigenlayerPoints: number;
  dAppNovaPoints: number;
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
            borderRadius: "0.5rem",
            background: "#666",
            fontSize: "0.875rem",
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
            borderRadius: "0.5rem",
            background: "#666",
            fontSize: "0.875rem",
          }}
          content={eigenlayerTips}
        />
      )}
    </div>
  );
};

export default function NovaPoints(props: INovaPointsProps) {
  const {
    novaPoints,
    referPoints,
    groupTvl,
    pufferEigenlayerPoints,
    pufferPoints,
    renzoPoints,
    renzoEigenLayerPoints,
    magpiePointsData,
    royaltyBooster,
    okxPoints,
    kolPoints,
    trademarkPoints,
    totalNovaPoints,
    kelpMiles,
    kelpEigenlayerPoints,
    dAppNovaPoints,
  } = props;
  // const royaltyBooster = 0.205;
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
        pointsTips:
          "Your Puffer Points will be visible one hour after you deposit your pufETH.",
        eigenlayerTips:
          "zkLink Nova utilizes the puffer API to showcase puffer Eigenlayer Points. According to Puffer, new users who join puffer after February 9th will not receive Eigenlayer points.",
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
      {
        icon: "/img/icon-eigenpie.png",
        pointsName: "EigenPie Points",
        eigenlayerName: "EigenPie",
        pointsValue: magpiePointsData.points,
        eigenlayerValue: magpiePointsData.layerPoints,
        pointsTips:
          "Your EngenPie Points will be visible one hour after you deposit your mxETH",
      },
      {
        icon: "/img/icon-kelp.png",
        pointsName: "Kelp Miles",
        eigenlayerName: "KelpDao",
        pointsValue: kelpMiles,
        eigenlayerValue: kelpEigenlayerPoints,
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
    magpiePointsData,
    kelpMiles,
    kelpEigenlayerPoints,
  ]);

  const totalBooster = useMemo(() => {
    return Decimal.mul(getBooster(groupTvl) + 1, royaltyBooster).toNumber();
  }, [groupTvl, royaltyBooster]);

  const royaltyBoosterPencentage = useMemo(() => {
    return Number(royaltyBooster)
      ? `${formatNumber2(Decimal.sub(royaltyBooster, 1).toNumber() * 100)}%`
      : "0%";
  }, [royaltyBooster]);

  const { minted } = useOldestFriendsStatus();

  return (
    <>
      <CardBox className="mt-[1.5rem] p-[1.5rem]">
        <p className="w-full text-[1rem] font-[700] text-[1rem] leading-[1.5rem] tracking-[0.06rem]">
          Nova Points
        </p>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-[1rem]">
            <span
              className="text-[2.5rem] font-[700]"
              data-tooltip-id="nova-points"
            >
              {formatNumberWithUnit(totalNovaPoints)}
            </span>

            <ReactTooltip
              id="nova-points"
              place="top-start"
              style={{
                borderRadius: "0.5rem",
                background: "#666",
                fontSize: "0.875rem",
              }}
              render={() => (
                <div>
                  <p className="flex justify-between gap-4 items-center font-[400] text-[14px] leading-[1.5rem] tracking-[0.06rem]">
                    <span>Earned by Your Holding</span>
                    <span>
                      {formatNumberWithUnit(novaPoints + okxPoints + kolPoints)}
                    </span>
                  </p>
                  <p className="flex justify-between gap-4 items-center mt-[0.5rem] font-[400] text-[14px] leading-[1.5rem] tracking-[0.06rem]">
                    <span>Earned by Referring Friends</span>
                    <span>{formatNumberWithUnit(referPoints)}</span>
                  </p>
                  <p className="flex justify-between gap-4 items-center mt-[0.5rem] font-[400] text-[14px] leading-[1.5rem] tracking-[0.06rem]">
                    <span>Earned by interacting with dApp</span>
                    <span>{formatNumberWithUnit(dAppNovaPoints)}</span>
                  </p>
                  <p className="flex justify-between gap-4 items-center mt-[0.5rem] font-[400] text-[14px] leading-[1.5rem] tracking-[0.06rem]">
                    <span>Earned by opening invite box</span>
                    <span>{trademarkPoints}</span>
                  </p>
                  {/* <p className="flex justify-between gap-4 items-center mt-[0.5rem] font-[400] text-[14px] leading-[1.5rem] tracking-[0.06rem]">
                    <span>Earned by OKX points</span>
                    <span>{okxPoints}</span>
                  </p>
                  <p className="flex justify-between gap-4 items-center mt-[0.5rem] font-[400] text-[14px] leading-[1.5rem] tracking-[0.06rem]">
                    <span>Earned by KOL points</span>
                    <span>{formatNumberWithUnit(kolPoints)}</span>
                  </p> */}
                </div>
              )}
            />

            <GreenTag
              data-tooltip-id="booster-learn-more"
              className="py-[0.375rem] w-[5.625rem] text-[1rem]"
            >
              {formatNumber2(totalBooster)}x
            </GreenTag>

            <ReactTooltip
              id="booster-learn-more"
              place="top"
              style={{
                borderRadius: "0.5rem",
                background: "#666",
                fontSize: "0.875rem",
              }}
              render={() => (
                <div>
                  <p>
                    {`Group Booster: ${
                      getBooster(groupTvl) !== 0 ? getBooster(groupTvl) : 1
                    }x`}
                  </p>
                  <p className="mt-[0.5rem]">
                    Loyalty Booster: {royaltyBooster}x
                  </p>
                  <p className="mt-[0.5rem]">
                    {`Total Booster = ${royaltyBooster} * ${
                      getBooster(groupTvl) !== 0
                        ? `(1 + ${getBooster(groupTvl)})`
                        : "1"
                    }`}
                  </p>
                  {invite?.kolGroup && (
                    <p className="mt-[0.5rem]">Referral Booster: 5%</p>
                  )}
                  {/* <a
                    href="https://blog.zk.link/aggregation-parade-7997d31ca8e1"
                    target="_blank"
                    className="text-[#0bc48f]"
                  >
                    Learn More
                  </a> */}
                </div>
              )}
            />
          </div>

          <RoyaltyBooster
            className="px-[0.75rem] py-[0.375rem] text-[1rem]"
            data-tooltip-id="royalty-booster"
          >
            +{royaltyBoosterPencentage}
          </RoyaltyBooster>
          <ReactTooltip
            id="royalty-booster"
            place="top"
            style={{
              borderRadius: "0.5rem",
              background: "#666",
              fontSize: "0.875rem",
            }}
            render={() => (
              <div className="max-w-[20rem]">
                <h4 className="font-[700] text-[0.875rem] leading-[1.3755rem]">
                  Loyalty Booster
                </h4>
                <p className="mt-[0.75rem] font-[400] text-[0.875rem] leading-[1.3755rem]">
                  An extra boost for Loyalty users, tied with days in the
                  Aggregation parade:
                  <br />
                  <br />
                  Loyalty Booster = 0.5% * days joined.
                </p>
              </div>
            )}
          />
        </div>

        <ReactTooltip
          id="more-points-soon"
          place="top"
          style={{
            borderRadius: "0.5rem",
            background: "#666",
            fontSize: "0.875rem",
          }}
          content="More points will be listed here soon."
        />

        {Number(invite?.points) !== 0 && (
          <div className="text-[14px] text-[#919192] leading-[1] flex items-end gap-2">
            <span className="text-[1.5rem] text-[#0ABB8A] font-[700]">
              +{invite?.points}
            </span>

            <span>from</span>
            <span className="font-[700]">
              Invite Box, Eco Box {minted && ", Old Friend Rewards"}
            </span>
          </div>
        )}

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
