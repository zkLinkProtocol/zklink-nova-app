import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  setInviteCode,
  setTwitterAccessToken,
  setViewStatus,
} from "@/store/modules/airdrop";
// import { useNavigate } from 'react-router-dom'
import { FooterTvlText } from "@/styles/common";
import "@/styles/otp-input.css";
import { checkInviteCode } from "@/api";
import toast from "react-hot-toast";
import { STATUS_CODE } from ".";
import TotalTvlCard from "@/components/TotalTvlCard";
import { RootState } from "@/store";
import { useStartTimerStore } from "@/hooks/useStartTimer";
import { useAccount } from "wagmi";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
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
  border-radius: 1rem;
  background: rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(15.800000190734863px);
`;
const TitleBox = styled.div`
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

const TotalTvlBox = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translate(-50%, 0);
`;

export default function Landing() {
  const web3Modal = useWeb3Modal();
  const dispatch = useDispatch();
  const { isConnected } = useAccount();
  // const navigate = useNavigate()
  // const [activeUsers, setActiveUsers] = useState(0)
  const { inviteCode, signature } = useSelector(
    (store: RootState) => store.airdrop
  );
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

  const handleOTPChange = (otp: string) => {
    setConfig((prevConfig) => ({ ...prevConfig, otp }));
  };

  const enterInviteCode = async () => {
    console.log("enter invite code", otp);
    if (!otp || otp.length !== 6 || !campaignStart) return;
    const res = await checkInviteCode(otp);
    if (!res?.result) {
      toast.error("Invalid invite code. Try another.", { duration: 3000 });
      return;
    }
    dispatch(setViewStatus(STATUS_CODE.softKYC))
    dispatch(setTwitterAccessToken(""));
    dispatch(setInviteCode(otp));
    dispatch(setViewStatus(STATUS_CODE.softKYC));
    navigator("/aggregation-parade");
  };

  // useEffect(() => {
  //   if (isConnected && signature) {
  //     navigator("/aggregation-parade");
  //   }
  // }, [isConnected]);

  return (
    <BgBox className="relative pt-[7.5rem] pb-[7.5rem]">
      <div className="">
        <TitleBox className="text-center">
          <h2 className="title pl-[1.56rem] text-[2.5rem] leading-[3.5rem]">
            Bridge to Mega Yield and token rewards on zkLink Nova
          </h2>
          <p className="sub-title mt-4 pl-6 pr-8 text-[1.5rem] leading-8">
            The only Ethereum L3 with native yield for ETH Stablecoins. The
            Aggreagation Parade is now live.
          </p>
        </TitleBox>
      </div>

      <div className="mt-[2.5rem]">
        <CardBox className="py-8 px-[1rem] mx-auto flex flex-col items-center text-center w-[26rem]">
          <TitleBox>
            <h4 className="title text-[1.5rem] leading-[2rem]">
              Enter Your Invite Code
            </h4>
            <p className="sub-title mt-[0.75rem] text-[1rem] leading-[1.5rem]">
              Enter your invite code to participate in the campaign
            </p>
          </TitleBox>

          <div className="my-8">
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
              ENTER INVITE CODE
            </Button>
          </div>

          {!isConnected && (
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
      </div>

      <TotalTvlBox className="w-full">
        <div className="flex flex-col items-center">
          <FooterTvlText className="mb-[0.1rem] text-center">TVL</FooterTvlText>
          <TotalTvlCard />
        </div>

        <div className="absolute right-[6rem] bottom-[1rem] flex justify-end items-end">
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
        {/* <FooterText className='mt-4'>TOTAL USERS / {activeUsers}</FooterText> */}
      </TotalTvlBox>
    </BgBox>
  );
}
