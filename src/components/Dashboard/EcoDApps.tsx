import { CardBox } from "@/styles/common";
import styled from "styled-components";

const Tag = styled.span`
  border-radius: 0.375rem;
  background: rgba(11, 196, 143, 0.24);
  .text {
    text-align: center;
    font-family: Satoshi;
    font-size: 0.75rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.5rem; /* 200% */
    letter-spacing: -0.00375rem;
    white-space: nowrap;
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
  flex: 1 1 0px;
`;

const Td = styled.div`
  flex: 1 1 0px;
`;

export default function EcoDApps() {
  return (
    <CardBox className="mt-[1.5rem] min-h-[30rem] min-w-[820px]">
      <div className="px-[1.5rem] py-[0.5rem] rounded-[1rem] bg-[#081A23] flex items-center">
        {["Name", "Type", "Your Earned"].map((item, index) => (
          <Th key={index}>{item}</Th>
        ))}
      </div>
      <div className="px-[1.5rem] py-[1rem] flex items-center border-b-1 border-[#292A2A]">
        <Td className="flex items-center gap-[0.5rem]">
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
            <span className="text text-[#0bc48f]">2x boost</span>
          </Tag>
        </Td>
        <Td>
          <p className="text-[1rem] font-[700]">Lending</p>
        </Td>
        <Td className="flex justify-between items-center">
          <div>
            <p className="text-[1rem]">
              <span className="text-[#0BC48F] font-[700] whitespace-nowrap">14.2</span> Nova
              Points
            </p>
            <p className="text-[1rem] whitespace-nowrap">
              <span className="text-[#0BC48F] font-[700]">14.2</span> LayerBank
              Points
            </p>
          </div>
          <Tag className="px-[1rem] py-[0.12rem]">
            <span className="text text-[#fff] whitespace-nowrap">How to Earn</span>
          </Tag>
        </Td>
      </div>
    </CardBox>
  );
}
