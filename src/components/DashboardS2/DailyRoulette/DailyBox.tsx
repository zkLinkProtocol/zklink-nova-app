import styled from "styled-components";
import { useCallback, useMemo } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import DailyDrawModal from "./DailyDrawModal";
import { useDisclosure } from "@nextui-org/react";
import { dailyOpen } from "@/api";
dayjs.extend(utc);
dayjs.extend(timezone);
export enum BoxType {
  Opend = "opened",
  Expired = "expired",
  Active = "active",
  Pending = "pending",
}
interface DailyBoxProps {
  type: BoxType;
  weekday: string;
  date: number;
  amount?: number;
  index: number;
  onDrawed?: () => void;
  remain?: number;
}

const DailyBox = (props: DailyBoxProps) => {
  const modal = useDisclosure();
  const { type, weekday, date, amount, index, remain, onDrawed } = props;
  const btnText = useMemo(() => {
    if (type === BoxType.Opend) {
      return "Box opened";
    } else if (type === BoxType.Expired) {
      return "Expired";
    } else if (type === BoxType.Active) {
      return "Claim Reward";
    }
  }, [type]);
  const pendingTime = useMemo(() => {
    if (index > 4) {
      const now = dayjs();
      // UTC 00:00
      const tomorrow10am = dayjs()
        .add(1, "day")
        .utc()
        .hour(0)
        .minute(0)
        .second(0);
      const timeDiff = tomorrow10am.diff(now);
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));

      return `Exactly in ${hours + (index - 5) * 24} Hours`;
    }
  }, [index]);
  const handleClaim = useCallback(async () => {
    if (type === BoxType.Active) {
      modal.onOpen();
    }
  }, [type, modal]);
  return (
    <Container>
      <p className="weekday">{weekday}</p>
      <div className={`box ${type} box-${index}`}>
        {index < 5 && (
          <>
            <div className="img-bg">
              <img src="/img/s2/img-daily-box.png" alt="" />
            </div>
            {amount && type !== BoxType.Expired && (
              <p>X{type === BoxType.Active ? remain : amount}</p>
            )}

            <div
              className={`mt-auto status status-${type}`}
              onClick={handleClaim}
            >
              {type === BoxType.Opend && (
                <img src="img/s2/icon-opened.svg" alt="" />
              )}
              {type === BoxType.Expired && (
                <img src="img/s2/icon-expired.svg" alt="" />
              )}
              {type === BoxType.Active && (
                <img src="img/s2/icon-daily-claim.svg" alt="" />
              )}
              <span>{btnText}</span>
            </div>
          </>
        )}
        {index >= 5 && (
          <div className="pending-content">
            <img src="/img/s2/icon-daily-info.svg" alt="" />
            <p className="font-[900]">Box will open in</p>
            <p className="text-[#FBFBFB]/[0.6] text-[13px]">{pendingTime}</p>
          </div>
        )}
      </div>
      <DailyDrawModal
        modalInstance={modal}
        onDrawed={onDrawed}
        remain={remain}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
  text-align: center;
  font-family: Satoshi;
  font-size: 16px;
  font-style: normal;
  .weekday {
    color: var(--Neutral-2, rgba(251, 251, 251, 0.6));
    text-align: center;
    font-family: Satoshi;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 110%; /* 15.4px */
    margin-bottom: 14px;
    color: var(--Neutral-2, rgba(251, 251, 251, 0.6));
    text-align: center;
    font-family: Satoshi;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 110%; /* 15.4px */
  }
  .pending-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    padding-top: 66px;
  }
  .status {
    border-radius: 24px;
    border: 1px solid rgba(51, 49, 49, 0);
    background: #10131c;
    filter: blur(0.125px);
    display: inline-flex;
    padding: 4px 16px 4px var(--Button-gap, 8px);
    justify-content: center;
    align-items: center;
    gap: var(--Button-gap, 8px);
    color: #fff;
    font-family: Satoshi;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 110%; /* 15.4px */
  }
  .status-opened {
    color: #fff;
    font-family: Satoshi;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 110%; /* 15.4px */
  }
  .status-active {
    border-radius: 44px;
    background: linear-gradient(180deg, #fff 0%, #bababa 100%);
    color: var(--Background, #000811);
    font-family: Satoshi;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 110%; /* 14.3px */
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
  .box {
    width: 160px;
    height: 212px;
    border-radius: 12px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 18px;
    & > img {
      width: 138px;
      height: 138px;
    }
  }
  .box-1 {
    background: url("/img/s2/bg-daily-box-1.png");
  }
  .box-2 {
    background: url("/img/s2/bg-daily-box-2.png");
  }
  .box-3 {
    background: url("/img/s2/bg-daily-box-3.png");
  }
  .box-4 {
    background: url("/img/s2/bg-daily-box-4.png");
  }
  .box-5 {
    background: url("/img/s2/bg-daily-box-5.png");
  }
  .box-6 {
    background: url("/img/s2/bg-daily-box-6.png");
  }
  .box-7 {
    background: url("/img/s2/bg-daily-box-7.png");
  }
  .opened {
    .img-bg {
      position: relative;
      width: 138px;
      height: 138px;
      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #d9d9d9;
        mix-blend-mode: hue;
      }
    }
  }
  .expired {
    .img-bg {
      position: relative;
      width: 138px;
      height: 138px;
      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #d9d9d9;
        mix-blend-mode: hue;
      }
    }
  }
  .active {
    .img-bg {
      position: relative;
      width: 138px;
      height: 138px;
      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #16755f;
        mix-blend-mode: hue;
      }
    }
  }
`;
export default DailyBox;
