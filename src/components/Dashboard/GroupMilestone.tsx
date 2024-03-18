import { CardBox, GradientText } from "@/styles/common";
import { getNextMilestone } from "@/utils";
import { Tooltip } from "@nextui-org/react";
import { useState } from "react";
import ProgressBar from "./ProgressBar";

export default function GroupMilestone(props: { groupTvl: number }) {
  const { groupTvl } = props;
  const [showTooltip5, setShowTooltip5] = useState(false);

  return (
    <>
      <div className="md:flex md:justify-between items-center leading-[2rem] font-[700]">
        <div className="flex items-center gap-[0.37rem]">
          <span className="text-[1.5rem]">Group Milestone</span>
          <Tooltip
            className="px-[1rem] py-[1rem]"
            isOpen={showTooltip5}
            content={
              <p className="text-[1rem]">
                You will get a higher group booster if your group unlocks higher
                TVL milestones.{" "}
                <a
                  href="https://blog.zk.link/aggregation-parade-7997d31ca8e1"
                  target="_blank"
                  className="text-[#0bc48f]"
                >
                  Learn more.
                </a>
              </p>
            }
          >
            <img
              onMouseEnter={() => setShowTooltip5(true)}
              onMouseLeave={() => setShowTooltip5(false)}
              onTouchStart={() => setShowTooltip5((prev) => !prev)}
              src="/img/icon-info.svg"
              className="w-[0.875rem] h-[0.875rem]"
            />
          </Tooltip>
        </div>

        <div className="flex items-center">
          <span className="text-[1rem]">Next Milestone</span>
          <GradientText className="ml-[0.5rem] text-[1rem]">
            {getNextMilestone(groupTvl)} ETH
          </GradientText>

          {/* <img
                                  src='/img/icon-info.svg'
                                  className='ml-[0.38rem] w-[0.875rem] h-[0.875rem]'
                              /> */}
        </div>
      </div>
      <CardBox className="mt-[2rem] py-[1.5rem] pl-[1.5rem] pr-[3rem] overflow-x-auto">
        <ProgressBar groupTvl={groupTvl} />
      </CardBox>
    </>
  );
}
