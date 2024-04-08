import { CardBox } from "@/styles/common";
import styled from "styled-components";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { AiFillCaretUp } from "react-icons/ai";

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

const SubTh = styled.div`
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
    <CardBox className="mt-[1.5rem] min-h-[30rem] min-w-[820px]">
      <div>
        <div className="px-[1.5rem] py-[0.5rem] rounded-[1rem] bg-[#081A23] flex items-center">
          {/* {["Name", "Type", "Your Earned"].map((item, index) => (
          <Th key={index}>{item}</Th>
        ))} */}

          <Th>Name</Th>
          <Th>Type</Th>
          <Th className="flex items-center gap-1">
            <span>Your Earned</span>

            <img
              data-tooltip-id="your-eraned"
              src="/img/icon-info.svg"
              className="w-[0.875rem] h-[0.875rem] opacity-40"
            ></img>
          </Th>
        </div>

        {/* <ReactTooltip
        id="your-eraned"
        place="top"
        style={{ fontSize: "14px", borderRadius: "16px" }}
        content="More points will be listed here soon."
      /> */}

        <div className="px-[1.5rem] py-[1rem] flex items-center border-b-1 border-[#292A2A]">
          <Td className="flex items-center gap-[0.5rem]">
            <img
              src="/img/icon-layerbank.svg"
              className="w-[2.25rem] h-[2.25rem]"
            />
            <div>
              <p className="text-[1rem] font-[700] flex items-center gap-1">
                <span>LayerBank</span>
                <img
                  src="/img/icon-open-in-new.svg"
                  className="w-[1rem] h-[1rem]"
                />
              </p>
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
                <span className="text-[#0BC48F] font-[700] whitespace-nowrap">
                  14.2
                </span>{" "}
                Nova Points
              </p>
              <p className="text-[1rem] whitespace-nowrap">
                <span className="text-[#0BC48F] font-[700]">14.2</span>{" "}
                LayerBank Points
              </p>
            </div>
            <Tag className="px-[1rem] py-[0.12rem] flex items-center gap-1">
              <span className="text text-[#fff] whitespace-nowrap">
                How to Earn
              </span>
              <AiFillCaretUp />
            </Tag>
          </Td>
        </div>
      </div>
      <div>
        <div className="px-[1.5rem] py-[1rem] flex justify-between items-center">
          <div>
            <SubTh>Status</SubTh>
            <p className="text-[0.875rem] ">Live</p>
          </div>
          <div>
            <SubTh>Multiplier</SubTh>
            <p className="text-[0.875rem]">2x Nova Points</p>
          </div>
          <div>
            <SubTh>Description</SubTh>
            <p className="max-w-[27.1875rem] text-[0.875rem] whitespace-wrap">
              For each block that liquidity is in a pool you earn points
              multiplied by the liquidity you provided
            </p>
          </div>
          <div className="text-right">
            <SubTh>Action</SubTh>
            <p className="text-[0.875rem] flex items-center gap-1 cursor-pointer">
              <span>Provide Liquidity</span>
              <img
                src="/img/icon-open-in-new.svg"
                className="w-[1rem] h-[1rem]"
              />
            </p>
          </div>
        </div>
      </div>
    </CardBox>
  );
}
