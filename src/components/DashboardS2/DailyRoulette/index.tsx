import styled from "styled-components";
import DailyBox, { BoxType } from "./DailyBox";
import { Tooltip } from "@nextui-org/react";
import InviteBoxModal from "./InviteBoxModal";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { getDailyCheckinHistory } from "@/api";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
const Container = styled.div`
  border-radius: 12px;
  border: 2px solid #635f5f;
  background: linear-gradient(
    180deg,
    rgba(0, 8, 17, 0) 14.59%,
    #000811 33.31%,
    #000811 64.52%
  );
  margin: 24px auto;
  padding: 31px 33px;

  .title {
    color: var(--Neutral-1, #fff);
    text-align: center;
    font-family: Satoshi;
    font-size: 18px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
    margin-right: 12px;
  }
  .title-desc {
    border-radius: 24px;
    border: 1px solid rgba(51, 49, 49, 0);
    background: #10131c;
    filter: blur(0.125px);
    padding: 12px 16px;
    justify-content: center;
    align-items: center;
    gap: var(--Button-gap, 8px);
    color: var(--Neutral-2, rgba(251, 251, 251, 0.6));
    leading-trim: both;
    text-edge: cap;
    font-family: Satoshi;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 110%; /* 17.6px */
  }
  .invite-box {
    cursor: pointer;
    border-radius: 48px;
    background: rgba(40, 40, 40, 0.6);
    display: flex;
    height: 40px;
    padding: 7.5px 21.5px 8.5px 21.5px;
    justify-content: center;
    align-items: center;
    color: var(--Accent, #03d498);
    text-align: center;
    font-family: Satoshi;
    font-size: 16px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;

    .text {
      background: linear-gradient(
        90deg,
        #4ba790 0%,
        rgba(251, 251, 251, 0.6) 50.31%,
        #9747ff 100%
      );
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
`;
const BoxList = [
  {
    type: BoxType.Opend,
    weekday: "Mon",
    date: 1000000,
    amount: 1,
  },
  {
    type: BoxType.Expired,
    weekday: "Tue",
    date: 1000000,
    amount: 1,
  },
  {
    type: BoxType.Opend,
    weekday: "Wed",
    date: 1000000,
    amount: 1,
  },
  {
    type: BoxType.Active,
    weekday: "Thurs",
    date: 1000000,
    amount: 1,
  },
  {
    type: BoxType.Pending,
    weekday: "Fri",
    date: 1000000,
    amount: 1,
  },
  {
    type: BoxType.Pending,
    weekday: "Sat",
    date: 1000000,
    amount: 1,
  },
  {
    type: BoxType.Pending,
    weekday: "Sun",
    date: 1000000,
    amount: 1,
  },
];
export default function DailyRoulette() {
  const { address } = useAccount();
  const [update, setUpdate] = useState(0);

  const [dailyData, setDailyData] = useState<
    {
      type: BoxType;
      date: number;
      weekday: string;
      amount?: number;
      remain?: number;
    }[]
  >([]);

  const handleDrawed = () => {
    setUpdate((v) => v + 1);
  };

  useEffect(() => {
    if (address) {
      getDailyCheckinHistory().then((res) => {
        console.log("history: ", res);
        const data = [];
        for (let i = 0; i < res.result.length; i++) {
          const item = res.result[i];
          const weekday = dayjs
            .utc(item.date)
            .tz(dayjs.tz.guess())
            .format("ddd");
          let type = item.expired ? BoxType.Expired : BoxType.Opend;
          if (i === res.result.length - 1 && item.remainNum > 0) {
            type = BoxType.Active;
          }
          data.push({
            weekday,
            type,
            amount: item.maxDraw,
            remain: item.remainNum,
            date: dayjs(item.date).format("YYYY-MM-DD HH:mm:ss"),
          });
        }
        const today = res.result[res.result.length - 1].date;
        for (let i = 1; i < 4; i++) {
          data.push({
            weekday: dayjs(today).add(i, "day").format("ddd"),
            type: BoxType.Pending,
            date: dayjs(today).add(i, "day").unix(),
          });
        }
        setDailyData(data);
      });
    }
  }, [address, update]);

  return (
    <Container>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img src="img/s2/icon-roulette.svg" alt="" />
          <p className="title">Daily Roulette</p>
          <Tooltip
            className="px-[16px] py-[20px] max-w-[350px] bg-[#000811] text-[#FBFBFB99]"
            content={
              <div>
                Every day, all participants can spin the roulette to earn
                rewards.
                <br />
                <br />
                Users with 100+ $ZKL in their wallet can spin the roulette up to
                X times to win zkLink Nova Trademark NFTs and Holding Points.
                The value of X is determined by the number of consecutive days
                the user has logged in and spun the roulette, with a maximum of
                7.
                <br />
                <br />X = min(7, consecutive days of spinning)
              </div>
            }
          >
            <div className="title-desc hidden md:block">
              Determined by the consecutive days
            </div>
          </Tooltip>
        </div>
        <div className="hidden md:block">
          <InviteBoxModal />
        </div>
      </div>
      <div className="flex items-center justify-center md:justify-between mt-[30px] overflow-auto gap-[10px] md:gap-[0]">
        {dailyData.map((item, index) => (
          <DailyBox
            {...item}
            index={index + 1}
            key={index}
            onDrawed={handleDrawed}
          />
        ))}
      </div>

      <div className="mt-[30px] md:hidden block">
        <InviteBoxModal />
      </div>
    </Container>
  );
}
