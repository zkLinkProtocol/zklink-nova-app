import { RootState } from "@/store";
import { CardBox } from "@/styles/common";
import { formatNumberWithUnit, getTweetShareText } from "@/utils";
import { Tooltip } from "@nextui-org/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

interface ITvlSummaryProps {
  totalTvl: number;
  groupTvl: number;
  referralTvl: number;
}

export default function TvlSummary(props: ITvlSummaryProps) {
  const { totalTvl, groupTvl, referralTvl } = props;
  const { invite } = useSelector((store: RootState) => store.airdrop);
  const [showTooltip4, setShowTooltip4] = useState(false);

  const handleCopy = () => {
    if (!invite?.code) return;
    navigator.clipboard.writeText(invite?.code);
    toast.success("Copied", { duration: 2000 });
  };

  return (
    <div className="md:flex md:gap-[1.5rem]">
      <CardBox className="md:flex md:justify-around  md:py-[3rem] md:px-0 md:w-1/2 md:my-0 my-[1rem] p-3">
        <div className="mb-3  md:mb-0">
          <p className="text-[1.5rem] leading-[2rem] md:text-center text-left">
            {formatNumberWithUnit(totalTvl, "$")}
          </p>
          <p className="mt-[1rem] text-[1rem] leading-[rem] md:text-center text-left text-[#7E7E7E]">
            Nova Network TVL
          </p>
        </div>
        <div>
          <p className="text-[1.5rem] leading-[2rem] md:text-center text-left">
            {formatNumberWithUnit(groupTvl, "ETH")}
          </p>
          <p className="mt-[1rem] text-[1rem] leading-[rem] md:text-center text-left text-[#7E7E7E]">
            Group TVL
          </p>
        </div>
      </CardBox>
      <CardBox className="md:flex md:justify-around md:py-[3rem] md:px-0 md:w-1/2 md:my-0 my-[1rem] p-3">
        <div className="mb-3  md:mb-0">
          <p className="text-[1.5rem] leading-[2rem]  md:text-center text-left">
            {formatNumberWithUnit(referralTvl, "ETH")}
          </p>
          <p className="mt-[1rem] text-[1rem] leading-[rem]  md:text-center text-left text-[#7E7E7E]">
            Referral TVL
          </p>
        </div>
        <div>
          <p className="text-[1.5rem] leading-[2rem] text-center flex items-center gap-[0.38rem] ">
            <span>{invite?.code || "-"}</span>
            <img
              src="/img/icon-copy.svg"
              className="w-[1.1875rem] h-[1.1875rem] cursor-pointer"
              onClick={() => handleCopy()}
            />
            <a
              href={`https://twitter.com/intent/tweet?text=${getTweetShareText(
                invite?.code ?? ""
              )}`}
              className="gradient-btn px-4 ml-6 hover:opacity-85"
              data-show-count="false"
              target="_blank"
            >
              Share on Twitter
            </a>
          </p>
          <p className="mt-[1rem] text-[1rem] leading-[rem] text-center text-[#7E7E7E] flex items-center gap-[0.5rem]">
            Your Invite Code (Remaining {invite?.canInviteNumber || 0})
            <Tooltip
              className="p-[1rem]"
              isOpen={showTooltip4}
              content={
                <p className="text-[1rem] max-w-[25rem]">
                  For every 1 ETH or equivalent deposit, you'll receive an extra
                  invitation spot. The increase in invite spots will be updated
                  daily at 11:00 UTC.
                </p>
              }
            >
              <img
                onMouseEnter={() => setShowTooltip4(true)}
                onMouseLeave={() => setShowTooltip4(false)}
                onTouchStart={() => setShowTooltip4((prev) => !prev)}
                src="/img/icon-info.svg"
                className="w-[0.875rem] h-[0.875rem] opacity-40"
              />
            </Tooltip>
          </p>
        </div>
      </CardBox>
    </div>
  );
}
