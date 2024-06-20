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
      iconURL: "/img/icon-puffer-points.png",
      pointsLabel: "Puffer Points",
      pointsValue: "0",
      elPointsLabel: "Eigenlayer Points (Puffer)",
      elPointsValue: "0",
    },
    {
      iconURL: "/img/icon-ezPoints.png",
      pointsLabel: "ezPoints",
      pointsValue: "0",
      elPointsLabel: "Eigenlayer Points (Renzo)",
      elPointsValue: "0",
    },
    {
      iconURL: "/img/icon-eigenpie.png",
      pointsLabel: "EigenPie Points",
      pointsValue: "0",
      elPointsLabel: "Eigenlayer Points (EigenPie)",
      elPointsValue: "0",
    },
    {
      iconURL: "/img/icon-kelp.png",
      pointsLabel: "Kelp Miles",
      pointsValue: "0",
      elPointsLabel: "Eigenlayer Points (KelpDao)",
      elPointsValue: "0",
    },
    {
      iconURL: "/img/icon-bedrock.svg",
      pointsLabel: "Bedrock Diamonds",
      pointsValue: "0",
      elPointsLabel: "Eigenlayer Points (Bedrock)",
      elPointsValue: "0",
    },
  ];

  return (
    <Container>
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="sub-title">Your Project Points</span>
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
              <div>
                <div
                  key={index}
                  className="flex justify-between items-center"
                >
                  <div className="label flex items-center gap-[8px]">
                    <img
                      src={item.iconURL}
                      alt=""
                      width={24}
                      height={24}
                      className="w-[24px] h-[24px] rounded-full"
                    />
                    <span>{item.pointsLabel}</span>
                  </div>
                  <div className="value">{item.pointsValue}</div>
                </div>
                <div
                  key={index}
                  className="mt-[8px] mb-[24px] ml-[32px] flex justify-between items-center"
                >
                  <div className="label">{item.elPointsLabel}</div>
                  <div className="value">{item.elPointsValue}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
};
