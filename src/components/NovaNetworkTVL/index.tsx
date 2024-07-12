import { GradientBox } from "@/styles/common";
import TotalTvlCard from "../TotalTvlCard";
import SocialMedia from "../SocialMedia";

export default function NovaNetworkTVL({
  name = "zkLink Nova Network TVL",
}: {
  name?: string;
}) {
  return (
    <div className="mt-[112px] pb-[90px]">
      <div className="flex justify-center">
        <GradientBox className="px-[28px] py-[12px] rounded-[48px] text-[16px]">
          {name}
        </GradientBox>
      </div>
      <div className="my-[32px] flex justify-center">
        <TotalTvlCard />
      </div>
      <div className="flex justify-center">
        <SocialMedia />
      </div>
    </div>
  );
}
