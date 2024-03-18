import { BOOST_LIST } from "@/constants/boost";
import { useEffect, useState } from "react";
import styled from "styled-components";

const ProgressBarBox = styled.div`
  position: relative;
  padding: 2rem 0;

  .title {
    position: absolute;
    left: 0;
    bottom: -0.1rem;
    color: #fff;
    font-family: Satoshi;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 700;
    line-height: 1; /* 157.143% */
  }

  .progress-item {
    position: relative;
    height: 0.5rem;
    background: #2a2a2a;
    border-radius: 0.5rem;

    &.active {
      .inner-bar {
        width: 100%;
      }
      .progress-points {
        background-color: #46aae2;
        z-index: 12;
        .points-top {
          background: linear-gradient(90deg, #48ecae 0%, #49ced7 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .points-bottom {
          color: #fff;
        }
      }
    }

    .inner-bar {
      max-width: 100%;
      border-radius: 0.5rem;
      background: linear-gradient(
        90deg,
        #48ecae 0%,
        #3e52fc 51.07%,
        #49ced7 100%
      );
    }

    .progress-points {
      position: absolute;
      top: 50%;
      right: -0.625rem;
      transform: translate(0, -50%);
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 50%;
      background-color: #2a2a2a;
      z-index: 10;
      .points-top {
        position: absolute;
        top: -2rem;
        left: 50%;
        transform: translate(-50%, 0);
        color: #919192;
        text-align: center;
        font-family: Satoshi;
        font-size: 0.875rem;
        font-style: normal;
        font-weight: 700;
        line-height: 1.375rem; /* 157.143% */
        white-space: nowrap;
      }
      .points-bottom {
        position: absolute;
        bottom: -2rem;
        left: 50%;
        transform: translate(-50%, 0);
        color: #919192;
        text-align: center;
        font-family: Satoshi;
        font-size: 0.875rem;
        font-style: normal;
        font-weight: 700;
        line-height: 1.375rem; /* 157.143% */
        white-space: nowrap;
      }
    }
  }
`;

export type ProgressItem = {
  tier: number;
  value: number;
  booster: number;
  progress: number;
  isActive: boolean;
};

export default function ProgressBar(props: { groupTvl: number }) {
  const { groupTvl } = props;
  const [progressList, setProgressList] = useState<ProgressItem[]>([]);

  useEffect(() => {
    const num = Number(groupTvl);

    let arr = BOOST_LIST.map((item, index) => {
      let progress = 0;
      let prevValue = index === 0 ? 0 : BOOST_LIST[index - 1].value;
      if (num > prevValue) {
        progress = num / item.value;
        progress = progress > 1 ? 1 : progress;
      }
      let obj = {
        ...item,
        isActive: num > item.value,
        progress,
      };

      return obj;
    });

    console.log("progress list", arr);

    setProgressList(arr);
  }, [groupTvl]);

  return (
    <ProgressBarBox className="progress-bar flex w-[40rem] md:w-full">
      <div className="title">Target/Boost</div>

      {progressList.map((item, index) => (
        <div
          className={`progress-item w-1/5 ${item.isActive ? "active" : ""} `}
          key={index}
        >
          <div
            className="inner-bar absolute left-0 top-0 h-full"
            style={{ width: `${item.progress * 100}%` }}
          ></div>

          <div className="progress-points">
            <div className="points-top">{item.booster}x</div>
            <div className="points-bottom">{item.value} ETH</div>
          </div>
        </div>
      ))}
    </ProgressBarBox>
  );
}
