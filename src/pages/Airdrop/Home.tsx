import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useState } from "react";
import OTPInput from "react-otp-input";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { setInviteCode, setViewStatus } from "@/store/modules/airdrop";
// import { useNavigate } from 'react-router-dom'
import { FooterTvlText, GradientButton } from "@/styles/common";
import "@/styles/otp-input.css";
import { checkInviteCode } from "@/api";
import toast from "react-hot-toast";
import { STATUS_CODE } from ".";
import TotalTvlCard from "@/components/TotalTvlCard";
import { RootState } from "@/store";

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

export default function Home() {
  const web3Modal = useWeb3Modal();
  const dispatch = useDispatch();
  // const navigate = useNavigate()
  // const [activeUsers, setActiveUsers] = useState(0)
  const { inviteCode } = useSelector((store: RootState) => store.airdrop);

  const [{ otp, numInputs, separator, placeholder, inputType }, setConfig] =
    useState({
      otp: inviteCode || "",
      numInputs: 6,
      separator: "",
      placeholder: "",
      inputType: "text" as const,
    });

  const handleOTPChange = (otp: string) => {
    setConfig((prevConfig) => ({ ...prevConfig, otp }));
  };

  const enterInviteCode = async () => {
    console.log("enter invite code", otp);
    if (!otp || otp.length !== 6) return;
    const res = await checkInviteCode(otp);
    if (!res?.result) {
      toast.error("Invalid invite code. Try another.", { duration: 3000 });
      return;
    }
    dispatch(setInviteCode(otp));
    dispatch(setViewStatus(STATUS_CODE.softKYC));
    // dispatch(set(otp))
    // navigate('/airdrop')
  };

  // const getActiveAccountsFunc = async () => {
  //     const res = await getActiveAccounts()
  //     console.log('active accounts', res)

  //     setActiveUsers(res?.result || 0)
  // }

  const goInviteCode = () => {
    dispatch(setViewStatus(STATUS_CODE.landing));
  };

  return (
    <BgBox className="relative pb-[13rem]">
      {/* <div className='absolute w-full h-full top-0 left-0 z-0 opacity-[0.16] bg-[#000]'></div> */}
      <div className="flex justify-between pt-[8.5rem] pl-[6.5rem] pr-[6.88rem]">
        <div>
          <CardBox className="py-8 w-[30rem]">
            <TitleBox>
              <h2 className="title pl-[1.56rem] text-[2.5rem] leading-[3.5rem]">
                Bridge to Mega Yield and token rewards on zkLink Nova.
              </h2>
              <p className="sub-title mt-4 px-6 text-[1.5rem] leading-8">
                The only Ethereum L3 with native yield for Eth and LSTs & LRTs. <br />
                Live NOW
              </p>
            </TitleBox>
          </CardBox>
          <div className="mt-4">
            {/* <img
                            src='/img/btn-join-early-access.png'
                            className='cursor-pointer'
                            onClick={() => navigate('/airdrop')}
                        /> */}

            <GradientButton
              className={`px-[2rem] h-[2.46875rem] text-center text-[1rem] leading-[2.46875rem] cursor-pointer`}
              onClick={() => goInviteCode()}
            >
              JOIN EARLY ACCESS
            </GradientButton>
          </div>
        </div>
        <div>
          <CardBox className="py-8 px-[1rem] flex flex-col items-center text-center">
            <TitleBox>
              <h4 className="title text-[1.5rem] leading-[2rem]">
                Enter Your Invite Code
              </h4>
              <p className="sub-title mt-[0.75rem] text-[1rem] leading-[1.5rem]">
                Enter your invite code to participate in the campaign.
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
              <GradientButton
                className={`mt-[2rem] px-[2rem] h-[2.46875rem] text-center text-[1rem] leading-[2.46875rem] ${
                  !otp || otp.length !== 6
                    ? "opacity-40 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onClick={enterInviteCode}
              >
                ENTER INVITE CODE
              </GradientButton>
              {/* <img
                                src='/img/btn-enter-invite-code.png'
                                className='cursor-pointer'
                                onClick={enterInviteCode}
                            /> */}
            </div>

            <div className="mt-4">
              <ConnectWalletText
                className="cursor-pointer text-[1rem]"
                onClick={() => web3Modal.open()}
              >
                Connect Wallet
              </ConnectWalletText>
            </div>
          </CardBox>
        </div>
      </div>

      <div className="absolute bottom-0 py-[4.5rem] flex justify-between items-end pl-[6.5rem] pr-[8.94rem]  w-full">
        <div>
          <FooterTvlText className="mb-[0.5rem]">TVL</FooterTvlText>
          <TotalTvlCard />
          {/* <FooterText className='mt-4'>TOTAL USERS / {activeUsers}</FooterText> */}
        </div>
        <div className="flex items-center gap-[1.25rem]">
          <a href="https://blog.zk.link/">
            <img src="/img/icon-medium.svg" className="w-[1.5rem] h-[1.5rem]" />
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
            <img src="/img/icon-github.svg" className="w-[1.5rem] h-[1.5rem]" />
          </a>
        </div>
      </div>
    </BgBox>
  );
}
