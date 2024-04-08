import { CardBox } from "@/styles/common";
import styled from "styled-components";

const Tag = styled.span`
  border-radius: 0.375rem;
  background: rgba(11, 196, 143, 0.24);
  .text {
    color: #0bc48f;
    text-align: center;
    font-family: Satoshi;
    font-size: 0.75rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.5rem; /* 200% */
    letter-spacing: -0.00375rem;
  }
`;

const Th = styled.div`
  color: #7e7e7e;
  font-family: Satoshi;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.5rem; /* 171.429% */
  letter-spacing: -0.00438rem;
`;

export default function EcoDApps() {
  return (
    <CardBox className="min-h-[30rem]">
      <div className="px-[1.5rem] py-[0.5rem] rounded-[1rem] bg-[#081A23] flex items-center">
        {["Name", "Type", "Your Earned"].map((item, index) => (
          <Th key={index}>{item}</Th>
        ))}
      </div>
      <div className="px-[1.5rem] flex">
        <div className="flex items-center gap-[0.5rem]">
          <img
            src="/img/icon-layerbank.svg"
            className="w-[2.25rem] h-[2.25rem]"
          />
          <div>
            <p className="text-[1rem] font-[700]">LayerBank</p>
            <p className="text-[0.625rem] text-[#0AC18D] font-[700]">
              @LayerBankFi
            </p>
          </div>
          <Tag className="px-[1rem] py-[0.12rem]">
            <span className="text">2x boost</span>
          </Tag>
        </div>
        <div></div>
        <div></div>
      </div>
    </CardBox>
  );
}
