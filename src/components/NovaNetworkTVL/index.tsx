import { GradientBox } from "@/styles/common";
import TotalTvlCard from "../TotalTvlCard";
import SocialMedia from "../SocialMedia";
import styled from "styled-components";

const DescText = styled.div`
  margin: 0 auto 46px;
  text-align: center;
  width: 352px;
  color: var(--Neutral-2, rgba(251, 251, 251, 0.6));
  text-align: center;
  font-family: Satoshi;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 22.4px */
`;

export default function NovaNetworkTVL({
  name = "zkLink Nova Network TVL",
}: {
  name?: string;
}) {
  return (
    <div className="mt-[64px] md:mt-[112px] md:pb-[90px]">
      <div className="flex justify-center">
        <GradientBox className="px-[28px] py-[12px] rounded-[48px] text-[16px]">
          {name}
        </GradientBox>
      </div>
      <div className="my-[32px] flex justify-center">
        <TotalTvlCard />
      </div>
      <DescText className="block md:hidden">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore .
      </DescText>
      <div className="flex justify-center">
        <SocialMedia />
      </div>
    </div>
  );
}
