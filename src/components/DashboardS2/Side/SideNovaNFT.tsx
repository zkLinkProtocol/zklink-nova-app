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

  .label {
    color: #999;
    font-family: "Chakra Petch";
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px; /* 100% */
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
    letter-spacing: -0.5px;
  }
`;

export default () => {
  const [isOpen, setIsOpen] = useState(false);

  const list = [
    {
      iconURL: "/img/img-trademark-1.png",
      label: "Oak Tree Roots",
      value: "x1",
    },
    {
      iconURL: "/img/img-trademark-4.png",
      label: "Binary Code Metrix Cube",
      value: "x1",
    },

    {
      iconURL: "/img/img-trademark-3.png",
      label: "Chess Knight",
      value: "x1",
    },
    {
      iconURL: "/img/img-trademark-2.png",
      label: "Magnifying Glass",
      value: "x1",
    },
  ];

  return (
    <Container>
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="sub-title">Your Nova NFT</span>
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
              <div key={index} className="mt-[24px] flex justify-between items-center">
                <div className="label flex items-center gap-[8px]">
                  <img
                    src={item.iconURL}
                    alt=""
                    width={48}
                    height={48}
                    className="w-[48px] h-[48px] rounded-[8px]"
                  />
                  <span>{item.label}</span>
                </div>
                <div className="value">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
};
