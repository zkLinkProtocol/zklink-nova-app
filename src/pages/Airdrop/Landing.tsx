import { useEffect, useState } from "react";
import styled from "styled-components";
import OTPInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import {
  setInviteCode,
  setIsGroupLeader,
  setViewStatus,
} from "@/store/modules/airdrop";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import toast from "react-hot-toast";
import "@/styles/otp-input.css";
import {
  GradientButton,
  CardBox,
  FooterTvlText,
  GradientBorder,
} from "@/styles/common";
import { useAccount } from "wagmi";
import { checkInviteCode } from "@/api";
import TotalTvlCard from "@/components/TotalTvlCard";
// import { BOOST_LIST } from '@/constants/boost'
import { STATUS_CODE } from ".";
import { PageStep } from "@/components/PageStep";
import { RootState } from "@/store";

const BgBox = styled.div`
  position: relative;
  padding-top: 7.5rem;
  padding-bottom: 7.5rem;
  width: 100%;
  min-height: 100vh;
  /* background-image: image-set('/img/bg-airdrop.png' 0.5x, '/img/bg-airdrop.png' 1x, '/img/bg-airdrop.png' 2x); */
  background-image: image-set(
    "/img/bg-mega-yield@1x.png" 1x,
    "/img/bg-mega-yield@2x.png" 2x
  );
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top;
`;

const CoverImgBox = styled.div`
  position: absolute;
  top: 4.69rem;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
  width: 40rem;
  height: calc(100% - 4.69rem);
  /* height: 61.3125rem; */
  background-image: url("/img/bg-airdrop-cover.png");
  background-repeat: no-repeat;
  background-size: cover;
  z-index: 0;
`;

const TabsItem = styled.span`
  display: inline-flex;
  padding: 1rem 0;
  justify-content: center;
  align-items: center;
  border-radius: 1rem;
  background: rgba(51, 51, 51, 0.4);
  backdrop-filter: blur(15.800000190734863px);
  color: #7b8ea0;
  font-family: Satoshi;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: 2rem; /* 133.333% */
  letter-spacing: -0.03125rem;
  user-select: none;
  cursor: pointer;
  &.active {
    color: #fff;
    background: rgba(0, 0, 0, 0.4);
  }
`;

const DescText = styled.p`
  color: #c6d3dd;
  text-align: center;
  font-family: Satoshi;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.5rem; /* 150% */
  letter-spacing: -0.03125rem;
`;

const GradientText = styled.span`
  background: linear-gradient(90deg, #48ecae 0%, #3a50ed 52.9%, #49cdd7 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  font-family: Satoshi;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.5rem; /* 150% */
  letter-spacing: -0.03125rem;
  user-select: none;
`;

export const TeamItem = styled.div`
  color: #fff;
  text-align: center;
  font-family: Satoshi;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.5rem; /* 150% */
  letter-spacing: -0.03125rem;
`;

export default function Landing() {
  const web3Modal = useWeb3Modal();
  const [tabsActive, setTabsActive] = useState(0);
  const { isConnected } = useAccount();
  const { inviteCode } = useSelector((store: RootState) => store.airdrop);
  const [{ otp, numInputs, separator, placeholder, inputType }, setConfig] =
    useState({
      otp: inviteCode || "",
      numInputs: 6,
      separator: "",
      placeholder: "",
      inputType: "text" as const,
    });

  const dispatch = useDispatch();

  const handleOTPChange = (otp: string) => {
    setConfig((prevConfig) => ({ ...prevConfig, otp }));
  };

  const enterInviteCode = async () => {
    if (!otp || otp.length !== 6) return;

    const res = await checkInviteCode(otp);
    if (!res?.result) {
      toast.error("Invalid invite code. Try another.");
      return;
    }
    dispatch(setInviteCode(otp));
    dispatch(setViewStatus(STATUS_CODE.softKYC));
  };

  const handlePageStep = (type: "PREV" | "NEXT") => {
    if (type === "PREV") {
      dispatch(setViewStatus(STATUS_CODE.home));
    }

    if (type === "NEXT") {
      if (!inviteCode || inviteCode?.length !== 6) {
        dispatch(setIsGroupLeader(true));
      }

      dispatch(setViewStatus(STATUS_CODE.softKYC));
    }
  };
  
  return (
    <BgBox>
      <CoverImgBox />

      <div className="relative mx-[auto] pl-[3.25rem] w-[41.5rem] min-h-[32rem] z-[2]">
        <div className="mt-[4.5rem]">
          <PageStep handlePageStep={handlePageStep} />
        </div>
        {/* <div className="flex justify-between gap-[1.5rem] mt-[4rem] none">
          <TabsItem
            className={`w-1/2 ${tabsActive === 0 ? "active" : ""}`}
            onClick={() => {
              setTabsActive(0);
            }}
          >
            Enter Invite Code
          </TabsItem>
          <TabsItem
            className={`w-1/2 ${tabsActive === 1 ? "active" : ""}`}
            onClick={() => {
              setTabsActive(1);
            }}
          >
            Create Your Group
          </TabsItem>
        </div> */}

        <CardBox className="flex flex-col items-center mt-6 py-8 w-[38.125rem]">
          {tabsActive === 0 && (
            <>
              <DescText className="mx-auto pl-[6.75rem] pr-[6.25rem] text-center">
                By joining an existing team, your could share the team boost
                when team tvl meet specific milestone.
              </DescText>

              <div className="mt-[1.94rem]">
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

              <GradientButton
                className={`mt-[2rem] px-[2rem] h-[2.46875rem] text-center text-[1rem] leading-[2.46875rem] ${
                  !otp || otp.length !== 6
                    ? "opacity-40 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onClick={enterInviteCode}
              >
                ENTER CODE
              </GradientButton>
            </>
          )}

          {tabsActive === 1 && (
            <>
              {/* <div className='mt-[1.5rem]'>
                                {BOOST_LIST.map((item, index) => (
                                    <TeamItem
                                        className='py-[0.5rem]'
                                        key={index}>
                                        {item.booster} Boost for {item.value} ETH equivalent TVL
                                    </TeamItem>
                                ))}
                            </div> */}

              <DescText className="mx-auto pl-[6.75rem] pr-[6.25rem] text-center">
                You can create your own team
              </DescText>

              <div className="mt-[1.5rem]">
                <GradientButton
                  className="px-[2rem] h-[2.46875rem] text-[1rem] leading-[2.46875rem] text-center"
                  onClick={() => dispatch(setIsGroupLeader(true))}
                >
                  Create Your Team
                </GradientButton>
              </div>
            </>
          )}

          {!isConnected && (
            <>
              <DescText className="mt-[1.03rem]">Already signed up?</DescText>
              <GradientBorder className="mt-[1rem] py-[0.375rem] px-[1rem]">
                <GradientText
                  className={`${
                    isConnected
                      ? "opacity-40 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  onClick={() =>
                    !isConnected && web3Modal.open({ view: "Connect" })
                  }
                >
                  Connect Wallet
                </GradientText>
              </GradientBorder>
            </>
          )}
        </CardBox>
      </div>

      <div className="absolute bottom-[4.5rem] w-full flex flex-col items-center">
        {/* <Performance /> */}
        <FooterTvlText className="mb-[0.5rem] text-center">TVL</FooterTvlText>
        <TotalTvlCard />
      </div>
    </BgBox>
  );
}
