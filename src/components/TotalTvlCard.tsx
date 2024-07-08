import { getExplorerTokenTvl, getTotalTvl } from "@/api";
import numeral from "numeral";
import { useEffect, useState } from "react";
import styled from "styled-components";

const TvlBox = styled.div`
  .tvl-num-item {
    border-radius: 20px;
    border: 0.6px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.14);
    backdrop-filter: blur(25px);

    color: #fff;
    font-family: Satoshi;
    font-style: normal;
    font-weight: 700;
    text-align: center;
    &.comma {
      width: auto;
      font-weight: 400;
      background: none;
      backdrop-filter: none;
      border: none;
    }

    &.dollar {
      color: #030d19;
      background: #03d498;
    }
  }
`;

export default function TotalTvlCard() {
  const [totalTvl, setTotalTvl] = useState(0);

  const [tvlArr, setTvlArr] = useState<string[]>([]);

  const getTotalTvlFunc = async () => {
    const res = await getExplorerTokenTvl(false);
    console.log("total tvl", res);

    let num = 0;
    if (res.length > 0) {
      num = +parseInt(res[0].tvl);
    }

    setTotalTvl(num);
  };

  const getTvlArr = (str: string) => {
    let arr = [];
    for (let i = 0; i < str.length; i++) {
      arr.push(str[i]);
    }
    return arr;
  };

  useEffect(() => {
    let arr = getTvlArr(numeral(totalTvl).format("0,0"));
    setTvlArr(arr);
  }, [totalTvl]);

  useEffect(() => {
    getTotalTvlFunc();
  }, []);

  return (
    <TvlBox className="flex items-center gap-[10px]">
      <span
        className={`tvl-num-item dollar w-[1.625rem] h-[2rem] leading-[2rem] md:w-[66px] md:h-[77px] md:leading-[77px] text-[1.5rem] md:text-[48px]`}
      >
        $
      </span>
      {tvlArr.map((item, index) => (
        <span
          key={index}
          className={`tvl-num-item w-[1.625rem] h-[2rem] leading-[2rem] md:w-[66px] md:h-[77px] md:leading-[77px] text-[1.5rem] md:text-[48px] ${
            item === "," ? "comma" : ""
          }`}
        >
          {item}
        </span>
      ))}
    </TvlBox>
  );
}
