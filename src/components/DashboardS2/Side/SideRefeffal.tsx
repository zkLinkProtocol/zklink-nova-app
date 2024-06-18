import { GradientButton2 } from "@/styles/common";
import { useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import styled from "styled-components";

const Container = styled.div`
  padding: 40px 0;
  border-bottom: 1px solid #999;

  .sub-title {
    color: #fff;
    font-family: "Chakra Petch";
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px; /* 100% */
    letter-spacing: -0.5px;
  }

  .referral-label {
    margin-bottom: 4px;
    color: #999;
    font-family: "Chakra Petch";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px; /* 100% */
    letter-spacing: -0.5px;
  }

  .referral-value {
    color: #fff;
    font-family: "Chakra Petch";
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px; /* 100% */
    letter-spacing: -0.5px;
    &.text-green {
      color: #0aba89;
    }
    .more {
      color: #0aba89;
      font-size: 16px;
      font-weight: 400;
      line-height: 16px; /* 100% */
    }
  }

  .open-btn {
    padding: 14px 0;
    display: block;
  }
`;

export default () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Container>
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="sub-title">Referral</span>
        {isOpen ? (
          <BsChevronUp className="text-[20px]" />
        ) : (
          <BsChevronDown width={24} height={24} className="text-[24px]" />
        )}
      </div>

      {isOpen && (
        <div>
          <div className="mt-[24px]">
            <div className="flex justify-between">
              <div>
                <div className="referral-label">Your Invite Code</div>
                <div className="referral-value text-green">AA33B8</div>
              </div>
              <div>
                <div className="referral-label text-right">Invited By</div>
                <div className="referral-value text-right">@Janis</div>
              </div>
            </div>
          </div>

          <div className="mt-[24px]">
            <div className="flex justify-between">
              <div>
                <div className="referral-label">Referrers</div>
                <div className="referral-value">
                  AA33B8 <span className="more">More</span>
                </div>
              </div>
              <div>
                <div className="referral-label text-right">Referral TVL</div>
                <div className="referral-value text-right">16.60k ETH</div>
              </div>
            </div>
          </div>

          <div className="mt-[24px]">
            <GradientButton2 className="open-btn disabled">
              Open Invite Box
            </GradientButton2>
          </div>
        </div>
      )}
    </Container>
  );
};
