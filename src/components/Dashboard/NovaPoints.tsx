import { CardBox } from "@/styles/common";
import { formatNumberWithUnit, getBooster } from "@/utils";
import { Tooltip } from "@nextui-org/react";
import { useState } from "react";
import styled from "styled-components";

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
}

export default function NovaPoints(props: INovaPointsProps) {
  const { accountPoint, groupTvl } = props;
  const [showTooltip, setShowTooltip] = useState(false);
  const [showTooltip2, setShowTooltip2] = useState(false);
  const [showTooltip3, setShowTooltip3] = useState(false);

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
          <span className="text-[2.5rem] font-[700]">
            {formatNumberWithUnit(
              (+accountPoint.novaPoint || 0) + (+accountPoint.referPoint || 0)
            )}
          </span>
          <Tooltip
            className="p-[1rem]"
            isOpen={showTooltip2}
            content={
              <p className="text-[1rem]">
                {getBooster(groupTvl) !== 0 &&
                  `Group Booster: ${getBooster(groupTvl)}x`}
                <br />
                Early Bird Booster: 2x <br />
                <br />
                <a
                  href="https://blog.zk.link/aggregation-parade-7997d31ca8e1"
                  target="_blank"
                  className="text-[#0bc48f]"
                >
                  Learn More
                </a>
              </p>
            }
          >
            <GreenTag
              className="py-[0.375rem] w-[5.625rem] text-[1rem]"
              onMouseEnter={() => setShowTooltip2(true)}
              onMouseLeave={() => setShowTooltip2(false)}
              onTouchStart={() => setShowTooltip2((prev) => !prev)}
            >
              {getBooster(groupTvl) + 2}x
            </GreenTag>
          </Tooltip>
        </div>
        {/* TODO Est. in next epoch */}
        {/* <p className="w-full text-[1rem] font-[700] text-[1rem] leading-[1.5rem] tracking-[0.06rem]">
          +{accountPoint.referPoint}
        </p>
        <p className="text-[1rem] text-[#919192] font-[400]">
          Est. in next epoch
        </p> */}

        <p className="flex justify-between items-center mt-[3rem] font-[400] text-[1rem] leading-[1.5rem] tracking-[0.06rem] text-[#919192]">
          <div className="flex items-center gap-[0.5rem]">
            <span>Earned By Your Deposit</span>

            <Tooltip
              className="p-[1rem]"
              isOpen={showTooltip}
              content={
                <p className="text-[1rem] max-w-[25rem] gap-[0.5rem]">
                  This includes the initial deposit rewards as well as the
                  ongoing rewards for holding (snapshot every 8 hours).
                </p>
              }
            >
              <img
                src="/img/icon-info.svg"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onTouchStart={() => setShowTooltip((prev) => !prev)}
                className="w-[0.875rem] h-[0.875rem] opacity-40"
              />
            </Tooltip>
          </div>
          <span>{formatNumberWithUnit(accountPoint.novaPoint)}</span>
        </p>
        <p className="flex justify-between items-center mt-[1rem] font-[400] text-[1rem] leading-[1.5rem] tracking-[0.06rem] text-[#919192]">
          <div className="flex items-center gap-[0.5rem]">
            <span>Earned By Referring Friends</span>

            <Tooltip
              className="p-[1rem]"
              isOpen={showTooltip3}
              content={
                <p className="text-[1rem] max-w-[25rem] gap-[0.5rem]">
                  The referral rewards will be updated every 8 hours along with
                  the deposit rewards.
                </p>
              }
            >
              <img
                onMouseEnter={() => setShowTooltip3(true)}
                onMouseLeave={() => setShowTooltip3(false)}
                onTouchStart={() => setShowTooltip3((prev) => !prev)}
                src="/img/icon-info.svg"
                className="w-[0.875rem] h-[0.875rem] opacity-40"
              />
            </Tooltip>
          </div>
          <span>{formatNumberWithUnit(accountPoint.referPoint)}</span>
        </p>
      </CardBox>
    </>
  );
}
