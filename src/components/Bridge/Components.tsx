import styled from "styled-components";
import { Button } from "@nextui-org/react";
export const ModalSelectItem = styled.div`
  &:hover {
    background-color: rgb(61, 66, 77);
    border-radius: 8px;
  }
`;

export const Trans = styled.div`
  .statusImg {
    width: 128px;
    margin-top: 20px;
    margin-left: calc(50% - 64px);
    margin-bottom: 23px;
  }
  .statusBut {
    transform: scale(3.5);
    background: transparent;
    margin-top: 50px;
    margin-left: calc(50% - 48px);
    margin-bottom: 50px;
  }
  .title {
    color: #fff;
    text-align: center;
    font-family: Satoshi;
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
    line-height: 32px; /* 133.333% */
    letter-spacing: -0.5px;
    margin-bottom: 23px;
  }
  .inner {
    color: #a0a5ad;
    text-align: center;
    font-family: Satoshi;
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
    line-height: 32px; /* 133.333% */
    letter-spacing: -0.5px;
    margin-bottom: 23px;
  }
  .button {
    height: 56px;
    width: 100%;
    border-radius: 8px;
    background: linear-gradient(
      90deg,
      #48ecae 0%,
      #3e52fc 51.07%,
      #49ced7 100%
    );
    color: #fff;
    text-align: center;
    font-family: Satoshi;
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
    line-height: 56px;
    letter-spacing: -0.5px;
    margin-bottom: 24px;
    cursor: pointer;
  }
  .view {
    color: #48ecae;
    background: transparent;
    text-align: center;
    font-family: Satoshi;
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
    line-height: 32px; /* 133.333% */
    letter-spacing: -0.5px;
    cursor: pointer;
  }
  .inline {
    display: inline;
  }
`;

export const Container = styled.div`
  border-radius: 20px;
  border: 0.6px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(30px);
  padding: 26px;
  color: #fff;
  .tabs {
    border-radius: 12px;
    border: 0.6px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.06);
    padding: 5px;
    display: inline-flex;
    margin: 0 auto;
    align-items: center;
    margin-bottom: 20px;
    position: relative;
    box-sizing: border-box;
    margin-left: auto;
    margin-right: auto;
    transform: translateX(-50%);
    left: 50%;
    & > .tab-item {
      width: 150px;
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      text-align: center;
      leading-trim: both;
      text-edge: cap;
      font-family: Satoshi;
      font-size: 18px;
      font-style: normal;
      font-weight: 700;
      line-height: 26px; /* 144.444% */
      text-transform: uppercase;
      cursor: pointer;
    }
    & > .tab-active {
      border-radius: 8px;
      background: var(--Green, #03d498);
      box-shadow: 0px 4px 16px 0px rgba(41, 218, 167, 0.3);
      color: #030d19;
    }
  }
  .mask-layer {
    position: absolute;
    top: 1rem;
    left: 1rem;
    bottom: 1rem;
    right: 1rem;
    z-index: 1;
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.8);
    /* display: flex; */
  }
  .green-btn {
    border-radius: 100px;
    background: var(--Green, #03d498);
    display: flex;
    width: 100%;
    height: 52px;
    padding: 20px 24px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    color: var(--Black-1, var(--Black, #030d19));
    text-align: center;
    font-family: Satoshi;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 26px; /* 162.5% */
  }
`;
export const SelectBox = styled.div`
  & {
    border-radius: 16px;
    border: 2.205px solid #635f5f;
    background: #151923;
  }
  .label {
    font-size: 14px;
    font-weight: 400;
    line-height: 26px; /* 185.714% */
    opacity: 0.8;
  }
  .balance {
    font-size: 20px;
    font-weight: 700;
    line-height: 26px; /* 130% */
  }
  .divider {
    width: 100%;
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
  }
  .selector {
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.12);
    height: 40px;
    &:hover {
      background-color: rgb(85 90 102);
    }
  }
  .points-box {
    color: #a0a5ad;
    font-size: 16px;
    font-weight: 400;
    .input-wrapper {
      padding-top: 0;
      padding-bottom: 0;
      height: 38px;
    }
  }
  .title {
    color: #a0a5ad;
    font-family: Satoshi;
    font-size: 1rem;
    font-style: normal;
    font-weight: 500;
    line-height: 24px; /* 200% */
    letter-spacing: -0.5px;
  }
`;

export const TokenYieldBox = styled.div`
  & .token-yield {
    display: flex;
    padding: 2px 8px;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    color: #fff;
    text-align: center;
    font-family: Satoshi;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px; /* 200% */
    letter-spacing: -0.06px;
    margin-right: 6px;
    white-space: nowrap;
  }
  & .token-yield-1 {
    background: linear-gradient(90deg, #64b3ec -0.39%, #1e1a6a 99.76%);
  }
  & .token-yield-2 {
    background: linear-gradient(90deg, #874fff -0.39%, #41ff54 99.76%);
  }
  & .token-yield-3 {
    background: linear-gradient(90deg, #ddf3fd 0%, #7c3dc8 0.01%, #0f002b 100%);
  }
  & .token-yield-4 {
    background: linear-gradient(90deg, #0bc48f 0%, #00192b 107.78%);
  }
  & .token-yield-5 {
    background: linear-gradient(90deg, #ace730 -0.39%, #324900 99.76%);
  }
  & .token-yield-6 {
    background: linear-gradient(90deg, #3e9d8f -0.39%, #205049 99.76%);
  }
  & .token-yield-7 {
    background: linear-gradient(90deg, #2e2758 -0.39%, #1e1839 99.76%);
  }
  & .token-yield-8 {
    background: linear-gradient(90deg, #075a5a -0.39%, #000404 99.76%);
  }
`;

export const LoyaltyBoostBox = styled.div`
  background: linear-gradient(90deg, #48ecae 0%, #3e52fc 51.07%, #49ced7 100%);
  width: 100px;
  height: 28px;
  border-radius: 8px;
  color: #ffffff;
  text-align: center;
  margin-left: 6px;
  font-size: 12px;
  line-height: 28px;
`;

export const LoyaltyBoostTooltipContent = styled.div`
  /* background: #666666; */
  /* padding: 12px 16px; */
  border-radius: 8px;
  font-weight: 400;
  font-size: 16px;
  /* font-family: "Space Mono"; */
`;

export const Line = styled.div`
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(251, 251, 251, 0.6) 51.5%,
    rgba(255, 255, 255, 0) 100%
  );
`;

export const DefaultBtn = styled(Button)`
  border-radius: 48px;
  background: linear-gradient(180deg, #3a3a3a 0%, #282828 100%);

  .btn-text {
    text-align: center;
    font-family: Satoshi;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
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
`;

export const AssetTypes = [
  { label: "ALL", value: "ALL" },
  {
    label: "Native",
    value: "NATIVE",
  },
  {
    label: "Stable",
    value: "Stablecoin",
  },
  {
    label: "Synthetic",
    value: "Synthetic",
  },
  {
    label: "RWA",
    value: "RWA",
  },
  {
    label: "LST",
    value: "LST",
  },
  {
    label: "LRT",
    value: "LRT",
  },
];

export const ContentForMNTDeposit =
  "When deposit MNT, we will transfer MNT to wMNT and then deposit wMNT for you.";

export const ContainerCover = ({ loading }: { loading: boolean }) => {
  return (
    <div className="mask-layer flex flex-col items-center justify-center p-[1.5rem]">
      <p className="text-center text-[1rem]">
        The deposit function on this page is currently undergoing an upgrade
      </p>
      <p className="mt-2 text-[1rem] text-[#999] text-center">
        You can still participate the parade by deposit through the zkLink Nova
        Portal and copy your deposit hash to pass verification.
      </p>
      <a href="https://portal.zklink.io/bridge/" target="_blank">
        <Button
          className="mt-4 gradient-btn w-full rounded-full "
          style={{ display: "flex", alignItems: "center" }}
          disableAnimation
          size="lg"
          // onClick={handleAction}
          isLoading={loading}
          // disabled={actionBtnDisabled}
        >
          Deposit through zkLink Nova Portal now
        </Button>
      </a>
    </div>
  );
};

export const EstimateArrivalTime = ({
  minutes,
  isMobile = false,
}: {
  minutes: number;
  isMobile?: boolean;
}) => {
  const Container = styled.div`
    background: var(--G, linear-gradient(180deg, #10f3b2 0%, #00b581 100%));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-align: center;
    font-family: Satoshi;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 26px; /* 162.5% */
    text-transform: capitalize;
  `;
  return (
    <Container>
      ~{minutes} {isMobile ? "mins" : "minutes"}
    </Container>
  );
};
