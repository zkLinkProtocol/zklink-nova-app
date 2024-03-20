import { CardBox } from "@/styles/common";
import { formatNumberWithUnit, getBooster } from "@/utils";
import styled from "styled-components";
import { Tooltip as ReactTooltip } from "react-tooltip";

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
  eigenlayerPoints: number;
  pufferPoints: number;
}

export default function NovaPoints(props: INovaPointsProps) {
  const { accountPoint, groupTvl, eigenlayerPoints, pufferPoints } = props;
  const eralyBirdBooster = 2;

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
            {(getBooster(groupTvl) + 1) * 2}x
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

        <p className="mt-[3rem] w-full text-[1rem] font-[700] text-[1rem] leading-[1.5rem] tracking-[0.06rem] flex items-center gap-[0.5rem]">
          <span>Other Points</span>

          <img
            data-tooltip-id="more-points-soon"
            src="/img/icon-info.svg"
            className="w-[0.875rem] h-[0.875rem] opacity-40"
          />
        </p>

        <p className="flex justify-between items-center mt-[1rem] font-[400] text-[1rem] leading-[1.5rem] tracking-[0.06rem]">
          <div className="flex items-center gap-2">
            <img src="/img/icon-puffer-points.png" />
            <span>Puffer Points</span>
          </div>
          <span>{formatNumberWithUnit(pufferPoints)}</span>
        </p>

        <p className="flex justify-between items-center mt-[1rem] font-[400] text-[1rem] leading-[1.5rem] tracking-[0.06rem]">
          <div className="flex items-center gap-2">
            <img src="/img/icon-eigenlayer-points.png" />
            <span>Eigenlayer Points (Puffer)</span>
          </div>
          <span>{formatNumberWithUnit(eigenlayerPoints)}</span>
        </p>
      </CardBox>
    </>
  );
}
