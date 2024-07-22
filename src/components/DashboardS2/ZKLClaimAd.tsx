import { GradientBox } from "@/styles/common";
import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  position: fixed;
  top: 120px;
  right: 32px;
  background: #181d20;
  color: #fff;
  font-family: Satoshi;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  z-index: 999;
  transition: all 0.3s;

  .progress-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;

    @keyframes shrinkWidth {
      from {
        width: 100%;
      }
      to {
        width: 0%;
      }
    }

    .progress {
      height: 4px;
      background: var(
        --Button-Rainbow,
        linear-gradient(
          90deg,
          #4ba790 0%,
          rgba(251, 251, 251, 0.6) 50.31%,
          #9747ff 100%
        )
      );
      width: 100%;
      animation: shrinkWidth 30.3s linear;
    }
  }
`;

const DefaultButton = styled(Button)`
  border-radius: 8px;
  background: #282828;
  .btn-text {
    font-family: Satoshi;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    background: var(
      --Button-Rainbow,
      linear-gradient(
        90deg,
        #4ba790 0%,
        rgba(251, 251, 251, 0.6) 50.31%,
        #9747ff 100%
      )
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

export default function ZKLClaimAd() {
  const [isOpen, setIsOpen] = useState(true);

  // useEffect(() => {
  //   const premius_ts = localStorage.getItem("premius_ts");
  //   const now = new Date().getTime();

  //   console.log("premius_ts", premius_ts, now, now - Number(premius_ts));

  //   if (!premius_ts || now - Number(premius_ts) > 12 * 60 * 60 * 1000) {
  //     setIsOpen(true);
  //   }
  // }, []);

  // useEffect(() => {
  //   if (!isOpen) return;
  //   const timer = setTimeout(() => {
  //     setIsOpen(false);
  //   }, 30000);

  //   return () => clearTimeout(timer);
  // }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    // const now = new Date().getTime();
    // localStorage.setItem("premius_ts", now.toString());
  };

  const handleJump = () => {
    handleClose();
    window.open("https://zklink.io/novadrop/", "_blank");
  };

  return (
    <Container className={`${isOpen ? "block" : "hidden"}`}>
      <GradientBox
        className={`rounded-[16px] px-[20px] pt-[16px] pb-[20px] w-[392px] overflow-hidden relative`}
      >
        <div>
          <img
            src="/img/modal-close.svg"
            alt=""
            width={24}
            height={24}
            className="absolute top-[16px] right-[12px] cursor-pointer"
            onClick={handleClose}
          />
        </div>
        <div>
          <img
            src="/img/s2/zkl-claim.png"
            alt=""
            width={352}
            height={192}
            className="min-w-[352px] mx-auto"
            onClick={handleJump}
          />
        </div>

        <div className="mt-[16px]">
          <DefaultButton className="w-full" onClick={handleJump}>
            <span className="btn-text">Claim Now</span>
          </DefaultButton>
        </div>

        {/* {isOpen && (
          <div className="progress-bar">
            <div className="progress"></div>
          </div>
        )} */}
      </GradientBox>
    </Container>
  );
}
