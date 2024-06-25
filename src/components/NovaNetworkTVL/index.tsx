import { BlurBox } from "@/styles/common";
import TotalTvlCard from "../TotalTvlCard";
import SocialMedia from "../SocialMedia";

export default function NovaNetworkTVL({
  name = "zkLink Nova Network TVL",
}: {
  name?: string;
}) {
  return (
    <div className="py-[60px]">
      <div className="flex justify-center">
        <BlurBox className="px-[16px] py-[14px]">{name}</BlurBox>
      </div>
      <div className="mt-[26px] flex justify-center">
        <TotalTvlCard />
      </div>
      <div className="mt-[60px] flex justify-center">
        <SocialMedia />
      </div>
    </div>
  );
}
