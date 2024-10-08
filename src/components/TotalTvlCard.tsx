import { getExplorerTokenTvl, getTotalTvl } from "@/api";
import numeral from "numeral";
import { useEffect, useState } from "react";
import styled from "styled-components";

const TvlBox = styled.div`
  .tvl-num-item {
    text-align: center;
    font-family: Satoshi;
    width: 54px;
    height: 112px;
    font-size: 78px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
    background: linear-gradient(180deg, #fff 0%, #bababa 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    @media screen and (max-width: 768px) {
      font-size: 46px;
      width: 32px;
      height: 50px;
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
    <TvlBox className="flex items-center md:gap-[24px]">
      <span
        className={`tvl-num-item dollar`}
      >
        $
      </span>
      {tvlArr.map((item, index) => (
        <span
          key={index}
          className={`tvl-num-item ${item === "," ? "comma" : ""}`}
        >
          {item}
        </span>
      ))}
    </TvlBox>
  );
}
