import { GradientButton } from "@/styles/common";
import styled from "styled-components";

const NovaDropBox = styled.div`
  position: relative;
  margin-bottom: 32px;
  width: 434px;
  height: 232px;
  background: url("/img/bg-novadrop.png") 50% / cover no-repeat;
  border-radius: 16px;
  overflow: hidden;

  .content {
    position: relative;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.48) 0%,
      rgba(0, 0, 0, 0.84) 51.59%,
      rgba(0, 0, 0, 0.48) 100%
    );
  }

  .title-1 {
    color: #0bc48f;
    text-align: center;
    font-family: "Chakra Petch";
    font-size: 32px;
    font-style: normal;
    font-weight: 600;
    line-height: 150%; /* 48px */
  }

  .title-2 {
    color: #fff;
    font-family: "Chakra Petch";
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: 150%;
  }
`;

export default () => {
  return (
    <NovaDropBox>
      <div className="content flex flex-col justify-center items-center gap-[20px]">
        <div>
          <p className="title-1 text-center">Novadrop Round One</p>
          <p className="title-2 text-center">
            Genesis Wallet Checker is live Now
          </p>
        </div>

        <div>
          <GradientButton
            className="px-[32px] py-[16px] text-[16px]"
            onClick={() => window.open("https://zklink.io/novadrop/", "_blank")}
          >
            Check your $ZKL allocation!
          </GradientButton>
        </div>
      </div>
    </NovaDropBox>
  );
};
