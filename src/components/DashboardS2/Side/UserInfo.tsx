import { GradientButton2 } from "@/styles/common";
import styled from "styled-components";

const Container = styled.div`
  .nft-num {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    color: #fff;
    font-family: "Chakra Petch";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px; /* 100% */
    letter-spacing: -0.5px;
    background: linear-gradient(
        90deg,
        rgba(72, 236, 174, 0.5) 0%,
        rgba(62, 82, 252, 0.5) 51.07%,
        rgba(73, 206, 215, 0.5) 100%
      ),
      #282828;
  }

  .username {
    color: #fff;
    font-family: "Chakra Petch";
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px; /* 100% */
    letter-spacing: -0.5px;
  }

  .check-in {
    padding: 8px;
    border-radius: 8px;
    border: 1px solid #0bc48f;
    color: #0bc48f;
    text-align: center;
    font-family: "Chakra Petch";
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 16px; /* 100% */
    letter-spacing: -0.5px;
  }

  .upgrade-btn {
    color: #fff;
    text-align: center;
    font-family: "Chakra Petch";
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px; /* 100% */
    letter-spacing: -0.5px;
  }
`;

export default () => {
  return (
    <Container>
      <div className="mt-[24px] flex gap-[16px]">
        <div className="relative h-[96px]">
          <img
            src="/img/img-INFJ-LYNK.png"
            alt=""
            width={96}
            height={96}
            className="rounded-[16px] block min-w-[96px]"
          />
          <div className="nft-num">x1</div>
        </div>

        <div className="w-full">
          <div className="flex justify-between">
            <div className="flex items-center">
              <span className="username">User123456</span>
            </div>

            <div className="check-in">Check In</div>
          </div>

          <div className="mt-[20px]">
            <GradientButton2 className="upgrade-btn py-[8px] w-full block text-center disabled">
              Upgrade
            </GradientButton2>
          </div>
        </div>
      </div>
    </Container>
  );
};
