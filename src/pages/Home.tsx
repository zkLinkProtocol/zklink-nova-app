import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useState } from "react";
import OTPInput from "react-otp-input";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { setInviteCode } from "@/store/modules/airdrop";
import { FooterTvlText } from "@/styles/common";
import "@/styles/otp-input.css";
import TotalTvlCard from "@/components/TotalTvlCard";
import { RootState } from "@/store";
import { useStartTimerStore } from "@/hooks/useStartTimer";
import { useAccount } from "wagmi";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import Countdown from "@/components/Countdown";
const BgBox = styled.div`
  width: 100%;
  min-height: 100vh;
  background-image: image-set(
    "/img/bg-home@0.5x.png" 0.5x,
    "/img/bg-home@1x.png" 1x,
    "/img/bg-home@2x.png" 2x
  );
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50%;
`;

const CardBox = styled.div`
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(15.800000190734863px);
`;
const TitleBox = styled.div`
  // h2{
  //   margin-left: 120px;
  // }
  .headTitle {
    justify-content: center;
    margin-bottom: 20px;
  }
  .flexBox {
    justify-content: center;
  }
  .title {
    color: #c2e2ff;
    font-family: Satoshi;
    font-style: normal;
    font-weight: 900;
    letter-spacing: -0.03125rem;
  }
  .sub-title {
    color: #c6d3dd;
    font-family: Satoshi;
    font-style: normal;
    line-height: 2rem; /* 133.333% */
    letter-spacing: -0.03125rem;
  }
  @keyframes width {
    0% {
      width: 118px;
    }
    9% {
      width: 118px;
    }
    10% {
      width: 296px;
    }
    34% {
      width: 296px;
    }
    35% {
      width: 132px;
    }
    59% {
      width: 132px;
    }
    60% {
      width: 136px;
    }
    84% {
      width: 136px;
    }
    85% {
      width: 412px;
    }
    100% {
      width: 412px;
    }
  }
  .box {
    width: 500px;
    height: 52px;
    border-radius: 8px;
    // background: rgba(0, 0, 0, 0.40);
    // backdrop-filter: blur(15.800000190734863px);
    overflow: hidden;
    padding: 2px 16px;
    margin-left: 30px;
    position: relative;
    // animation-name: width;
    // animation-duration: 10s;
    // animation-iteration-count: infinite;
    @keyframes move {
      0% {
        top: 0;
      }
      10% {
        top: 0;
      }
      20% {
        top: -48px;
      }
      33% {
        top: -48px;
      }
      43% {
        top: -96px;
      }
      56% {
        top: -96px;
      }
      66% {
        top: -144px;
      }
      79% {
        top: -144px;
      }
      89% {
        top: -192px;
      }
      95% {
        top: -192px;
      }
      100% {
        top: 0px;
      }
    }
    .move {
      position: absolute;
      animation-name: move;
      animation-duration: 10s;
      animation-timing-function: ease;
      animation-iteration-count: infinite;
      top: 0;
    }

    @keyframes width1 {
      0% {
        width: 86px;
      }
      9% {
        width: 86px;
      }
      10% {
        width: 264px;
      }
      34% {
        width: 264px;
      }
      35% {
        width: 100px;
      }
      59% {
        width: 100px;
      }
      60% {
        width: 104px;
      }
      84% {
        width: 104px;
      }
      85% {
        width: 380px;
      }
      100% {
        width: 380px;
      }
    }
    .inner {
      width: 500px;
      font-family: Satoshi;
      font-size: 40px;
      font-style: normal;
      font-weight: 900;
      line-height: 48px; /* 140% */
      letter-spacing: 4px;
      background: linear-gradient(90deg, #48ecae 25%, #49ced7 75%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      // animation-name: width1;
      // animation-duration: 10s;
      // animation-iteration-count: infinite;
    }
  }
`;

const ConnectWalletText = styled.span`
  color: #c6ddda;
  text-align: center;
  font-family: Satoshi;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.5rem; /* 150% */
  letter-spacing: -0.03125rem;
`;

const FooterBox = styled.div`
  /* position: fixed; */
  /* bottom: 2rem; */
  /* left: 50%; */
  /* transform: translate(-50%, 0); */
`;

export default function Home() {
  const web3Modal = useWeb3Modal();
  const { isConnected } = useAccount();
  const { inviteCode } = useSelector((store: RootState) => store.airdrop);
  const { campaignStart } = useStartTimerStore();
  const [{ otp, numInputs, separator, placeholder, inputType }, setConfig] =
    useState({
      otp: inviteCode || "",
      numInputs: 6,
      separator: "",
      placeholder: "",
      inputType: "text" as const,
    });

  const navigator = useNavigate();
  const dispatch = useDispatch();
  const handleOTPChange = (otp: string) => {
    setConfig((prevConfig) => ({ ...prevConfig, otp }));
  };
  const arr = ["ETH", "Stablecoins", "LSTs", "LRTs", "L2 Native Assets"];
  const enterInviteCode = async () => {
    console.log("enter invite code", otp);
    if (!otp || otp.length !== 6 || !campaignStart) return;
    // TODO: check invite code ?
    // const res = await checkInviteCode(otp);
    // if (!res?.result) {
    //   toast.error("Invalid invite code. Try another.", { duration: 3000 });
    //   return;
    // }

    dispatch(setInviteCode(otp));
    navigator("/aggregation-parade");
  };

  return (
    <BgBox className="relative pt-[7.5rem] pb-[7.5rem]">
      {/* Title */}
      <TitleBox className="text-center">
        <div className="w-full flex items-center justify-center mt-10 mb-10">
          <img
            src={"/img/img-count-down.png"}
            className="w-[410px] h-[36px] mr-4"
            alt=""
          />
          <Countdown />
        </div>
        <div className="flex headTitle">
          <h2 className="title pl-[1.56rem] text-[2.5rem] leading-[3.5rem]">
            The ONLY Aggregated L3 with added yield for
          </h2>
        </div>
        <div className="flex flexBox">
          <div className="box">
            <div className="move">
              <div className="inner">ETH</div>
              <div className="inner">Stablecoins</div>
              <div className="inner">LSTs</div>
              <div className="inner">LRTs</div>
              <div className="inner">L2 Native Assets</div>
            </div>
          </div>
        </div>
        <p className="sub-title mt-4 pl-6 pr-8 text-[1.5rem] leading-8">
          Bridge to earn Mega Yield and $ZKL on zkLink Nova
        </p>
      </TitleBox>

      {/* Form: Invite code */}
      <CardBox className="mt-[2.5rem] py-8 px-[1rem] mx-auto flex flex-col items-center text-center w-[26rem]">
        <TitleBox>
          <h4 className="title text-[1.5rem] leading-[2rem]">
            Enter Your Invite Code
          </h4>
          <p className="sub-title mt-[0.75rem] text-[1rem] leading-[1.5rem]">
            To participate in the campaign
          </p>
        </TitleBox>

        <div className="mt-8">
          <OTPInput
            inputStyle="inputStyle"
            numInputs={numInputs}
            onChange={handleOTPChange}
            renderSeparator={<span>{separator}</span>}
            value={otp}
            placeholder={placeholder}
            inputType={inputType}
            renderInput={(props) => <input {...props} />}
            shouldAutoFocus
          />
        </div>

        <div>
          <Button
            className={`gradient-btn mt-[2rem] px-[2rem] h-[2.46875rem] text-center text-[1rem] leading-[2.46875rem] `}
            disabled={!otp || otp.length !== 6 || !campaignStart}
            onClick={enterInviteCode}
          >
            SUBMITE
          </Button>
        </div>

        {!isConnected && campaignStart && (
          <div className="mt-4">
            <ConnectWalletText
              className="cursor-pointer text-[1rem]"
              onClick={() => web3Modal.open()}
            >
              Connect Wallet
            </ConnectWalletText>
          </div>
        )}
      </CardBox>

      <FooterBox className="w-full fixed left-0 bottom-0 bg-black bg-opacity-75 flex items-center justify-between px-36 py-4">
        {/* Footer: total tvl data */}
        {/* <div className="flex flex-col items-center">
          <FooterTvlText className="mb-[0.5rem] text-center">TVL</FooterTvlText>
          <TotalTvlCard />
        </div> */}
        <TotalTvlCard />

        {/* Footer: nav links */}
        <div className=" right-[6rem] bottom-[1rem] flex justify-end items-end">
          <div className="flex items-center gap-[1.25rem]">
            <a href="https://blog.zk.link/">
              <img
                src="/img/icon-medium.svg"
                className="w-[1.5rem] h-[1.5rem]"
              />
            </a>
            <a href="https://discord.com/invite/zklink">
              <img src="/img/icon-dc.svg" className="w-[1.5rem] h-[1.5rem]" />
            </a>
            <a href="https://t.me/zkLinkorg">
              <img src="/img/icon-tg.svg" className="w-[1.5rem] h-[1.5rem]" />
            </a>
            <a href="https://twitter.com/zkLink_Official">
              <img
                src="/img/icon-twitter.svg"
                className="w-[1.25rem] h-[1.25rem]"
              />
            </a>
            <a href="https://github.com/zkLinkProtocol">
              <img
                src="/img/icon-github.svg"
                className="w-[1.5rem] h-[1.5rem]"
              />
            </a>
          </div>
        </div>
      </FooterBox>
    </BgBox>
  );
}
