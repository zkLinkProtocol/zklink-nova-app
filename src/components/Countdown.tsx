import { Fragment, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useStartTimerStore } from "@/hooks/useStartTimer";
import { NOVA_START_TIME } from "@/constants";
const CountdownBox = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  .part-time {
    border-radius: 66px;
    border: 1px solid #2b2868;
    background: #11102f;
    width: 72px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .split {
    color: #fff;
    text-align: center;
    font-family: Poppins;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 32px; /* 200% */
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
      <div className="part-time">{remainingTime?.days} Days</div>
      <div className="split">:</div>
      <div className="part-time">{remainingTime?.hours} Hours</div>
      <div className="split">:</div>
      <div className="part-time">{remainingTime?.minutes} Minuts</div>
      <div className="split">:</div>
      <div className="part-time">{remainingTime?.seconds} Seconds</div>
    </CountdownBox>
  );
};

Countdown.displayName = Countdown.name;
export default Countdown;
