import { Fragment, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useStartTimerStore } from "@/hooks/useStartTimer";
import { NOVA_START_TIME } from "@/constants";
const CountdownBox = styled.div`
  display: flex;
  align-items: center;

  .part-time {
    width: 64px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-family: Satoshi;
    font-size: 32px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px; /* 62.5% */
    letter-spacing: -0.5px;
  }
  .split {
    color: #fff;
    text-align: center;
    font-family: Poppins;
    font-size: 32px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px; /* 62.5% */
  }
`;

const Countdown = () => {
  const [remainingTime, setRemainingTime] = useState();
  const { setCampaignStart } = useStartTimerStore();
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime(calculateRemainingTime());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  function calculateRemainingTime() {
    const currentTime = new Date().getTime();
    const difference = NOVA_START_TIME - currentTime;

    if (difference <= 0) {
      setCampaignStart(true);
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    const seconds = Math.floor((difference / 1000) % 60);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    return {
      days,
      hours,
      minutes,
      seconds,
    };
  }

  return (
    <CountdownBox>
      {/* <div className="part-time">{remainingTime?.days} Days</div>
      <div className="split">:</div> */}
      <div className="part-time">
        {remainingTime?.hours < 10
          ? "0" + remainingTime?.hours
          : remainingTime?.hours}
      </div>
      <div className="split">:</div>
      <div className="part-time">
        {remainingTime?.minutes < 10
          ? "0" + remainingTime?.minutes
          : remainingTime?.minutes}
      </div>
      <div className="split">:</div>
      <div className="part-time">
        {remainingTime?.seconds < 10
          ? "0" + remainingTime?.seconds
          : remainingTime?.seconds}{" "}
      </div>
    </CountdownBox>
  );
};

Countdown.displayName = Countdown.name;
export default Countdown;
