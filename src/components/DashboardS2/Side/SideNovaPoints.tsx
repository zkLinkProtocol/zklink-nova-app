import { useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import styled from "styled-components";

const Container = styled.div`
  padding: 20px 0;
  border-bottom: 1px solid #999;

  .sub-title {
    padding: 20px 0;
    color: #fff;
    font-family: "Chakra Petch";
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px; /* 100% */
    letter-spacing: -0.5px;
  }

  .label {
    color: #999;
    font-family: "Chakra Petch";
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 22px; /* 91.667% */
    letter-spacing: -0.5px;
  }

  .value {
    color: #fff;
    text-align: right;
    font-family: "Chakra Petch";
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px; /* 100% */
    letter-spacing: 1.44px;
  }
`;

export default () => {
  const [isOpen, setIsOpen] = useState(false);

  const list = [
    {
      label: "Holding",
      value: "0",
    },
    {
      label: "DEX",
      value: "20,000",
    },
    {
      label: "Perp",
      value: "20,000",
    },
    {
      label: "Lending",
      value: "0",
    },
    {
      label: "GameFi",
      value: "0",
    },
    {
      label: "Native Protocol",
      value: "0",
    },
    {
      label: "Other",
      value: "0",
    },
  ];

  return (
    <Container>
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="sub-title">Your Nova Points</span>
        {isOpen ? (
          <BsChevronUp className="text-[20px]" />
        ) : (
          <BsChevronDown width={24} height={24} className="text-[24px]" />
        )}
      </div>

      {isOpen && (
        <div>
          <div>
            {list.map((item, index) => (
              <div
                key={index}
                className="mb-[24px] flex justify-between items-center"
              >
                <div className="label">{item.label}</div>
                <div className="value">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
};
