import { getExplorerTokenTvl, getTotalTvl } from "@/api";
import numeral from "numeral";
import { useEffect, useState } from "react";
import styled from "styled-components";

const TvlBox = styled.div`
  .tvl-num-item {
    // padding: 0 0.5rem;
    line-height: 3.875rem;
    border-radius: 1rem;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(15.800000190734863px);
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
    let arr = getTvlArr("$" + numeral(totalTvl).format("0,0"));
    setTvlArr(arr);
  }, [totalTvl]);

  useEffect(() => {
    getTotalTvlFunc();
  }, []);

  return (
    <TvlBox className="flex items-center gap-[0.5rem]">
      {tvlArr.map((item, index) => (
        <span
          key={index}
          className={`tvl-num-item w-[1.5rem] h-[1.5rem] md:w-[2.8rem] md:h-[3.875rem] text-[28px] md:text-[48px] ${
            item === "," ? "comma" : ""
          }`}
        >
          {item}
        </span>
      ))}
    </TvlBox>
  );
}
