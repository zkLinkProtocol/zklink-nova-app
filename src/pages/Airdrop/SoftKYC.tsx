import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import qs from "qs";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { BgBox, BgCoverImg, CardBox, FooterTvlText } from "@/styles/common";
import {
  setInviteCode,
  setSignature,
  setTwitter,
  setTwitterAuthCode,
  setViewStatus,
} from "@/store/modules/airdrop";
import toast from "react-hot-toast";
import { useSignMessage } from "wagmi";
import { SIGN_MESSAGE } from "@/constants/sign";
import { Button, Input } from "@nextui-org/react";
import { checkInviteCode, getAccountTwitter } from "@/api";
import TotalTvlCard from "@/components/TotalTvlCard";
import { postData } from "@/utils";
import { STATUS_CODE } from ".";
import { PageStep } from "@/components/PageStep";
import { RootState } from "@/store";

const TitleText = styled.h4`
  color: #c2e2ff;
  text-align: center;
  font-family: Satoshi;
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 900;
  line-height: 2.5rem; /* 100% */
  letter-spacing: -0.03125rem;
`;
const SubTitleText = styled.p`
  color: #c6d3dd;
  text-align: center;
  font-family: Satoshi;
  font-size: 1rem;
  font-style: normal;
  font-weight: 900;
  line-height: 2.5rem; /* 250% */
  letter-spacing: -0.03125rem;
`;

const ContentBox = styled.div`
  position: relative;
  margin: 0 auto;
  width: 58.875rem;
  min-height: 40rem;
  z-index: 10;
`;

const StepNum = styled.div`
  width: 4.3125rem;
  height: 6.25rem;
  line-height: 6.25rem;
  color: #fff;
  font-family: Satoshi;
  font-size: 1rem;
  font-style: normal;
  font-weight: 900;
  letter-spacing: -0.03125rem;
  text-align: center;
`;

const StepItem = styled.div`
  .step-title {
    color: #fff;
    font-family: Satoshi;
    font-size: 1rem;
    font-style: normal;
    font-weight: 900;
    line-height: 1.5rem; /* 150% */
    letter-spacing: -0.03125rem;
  }
  .step-sub-title {
    color: #c6d3dd;
    font-family: Satoshi;
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.5rem; /* 150% */
    letter-spacing: -0.03125rem;
  }
`;

const InviteInput = styled.input`
  border-radius: 8px;
  border: 1px solid #7ba099;
  display: inline-flex;
  padding: 8px 12px 8px 12px;
  align-items: center;
  font-size: 1rem;
  color: #fff;
  font-family: Satoshi;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
  letter-spacing: -0.5px;
`;

export default function SoftKYC() {
  const [searchParams, setSearchParams] = useSearchParams();
  const web3Modal = useWeb3Modal();
  const { isConnected, isConnecting } = useAccount();
  const { inviteCode, isGroupLeader, signature, twitter } = useSelector(
    (store: RootState) => store.airdrop
  );
  const [inviteCodeValue, setInviteCodeValue] = useState(inviteCode || "");
  const [isInviteCodeLoading, setIsInviteCodeLoading] = useState(false);
  const [twitterLoading, setTwitterLoading] = useState(false);

  const dispatch = useDispatch();
  const { signMessage } = useSignMessage();

  const handleConnectTwitter = () => {
    setTwitterLoading(true);
    const params = {
      response_type: "code",
      client_id: import.meta.env.VITE_TWITTER_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_TWITTER_CALLBACK_URL,
      scope: "tweet.read%20users.read%20follows.read%20follows.write",
      state: "state",
      code_challenge: "challenge",
      code_challenge_method: "plain",
    };
    const url = new URL(`https://twitter.com/i/oauth2/authorize`);
    url.search = qs.stringify(params, { encode: false });

    window.location.href = url.href;
  };

  const getTwitterByCode = async (code: string) => {
    setSearchParams("");
    setTwitterLoading(true);
    const res = await getAccountTwitter({
      code,
      client_id: import.meta.env.VITE_TWITTER_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_TWITTER_CALLBACK_URL,
    });

    const { data } = res;
    if (data) {
      dispatch(setTwitterAuthCode(code));
      dispatch(setTwitter(data));
    } else {
      toast.error("Could not connect to Twitter. Try again.");
    }

    setTwitterLoading(false);
  };

  const getTwitterAPI = async (code: string) => {
    try {
      const res = await postData("/twitter/2/oauth2/token", {
        code,
        grant_type: "authorization_code",
        client_id: import.meta.env.VITE_TWITTER_CLIENT_ID,
        redirect_uri: import.meta.env.VITE_TWITTER_CALLBACK_URL,
        code_verifier: "challenge",
      });

      setSearchParams("");

      console.log(res);

      const { access_token } = res;

      console.log(access_token);
      if (access_token && access_token !== "") {
        fetch("/twitter/2/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        })
          .then(async (res) => {
            let { data } = await res.json();
            console.log(data);

            dispatch(setTwitter(data));
          })
          .catch(() => toast.error("Could not connect to Twitter. Try again."));

        // console.log(res.json())
      }
    } catch (error) {
      toast.error("Could not connect to Twitter. Try again.");
    }
  };

  const handleSign = async () => {
    await signMessage(
      {
        message: SIGN_MESSAGE,
      },
      {
        onSuccess(data, variables, context) {
          console.log(data, variables, context);
          dispatch(setSignature(data));
        },
        onError(error, variables, context) {
          console.log(error, variables, context);
          toast.error("User reject signature. Try again.");
        },
      }
    );
  };

  const handleConnectWallet = () => {
    if (isConnected && signature) return;
    if (isConnected) {
      handleSign();
    } else {
      web3Modal.open({ view: "Connect" });
    }
  };

  const handlePageStep = (type: "PREV" | "NEXT") => {
    if (type === "PREV") {
      dispatch(setViewStatus(STATUS_CODE.landing));
    }

    if (type === "NEXT") {
      //   dispatch(setIsGroupLeader(true));
      dispatch(setViewStatus(STATUS_CODE.deposit));
    }
  };

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      setSearchParams("");
      toast.error("Could not connect to Twitter. Try again.");
      return;
    }

    if (code) {
      getTwitterByCode(code);
    }
  }, [searchParams]);

  const [isNextDisabled, setIsNextDisabled] = useState(true);

  useEffect(() => {
    if ((inviteCode || isGroupLeader) && twitter && isConnected && signature) {
      setIsNextDisabled(false);
    }
  }, [inviteCode, isGroupLeader, isConnected, signature, twitter]);

  const validInviteCode = (code: string) => {
    return code && code.length === 6 ? true : false;
  };

  const enterInviteCode = async (code: string) => {
    if (!code || code.length !== 6) return;
    setIsInviteCodeLoading(true);
    const res = await checkInviteCode(code);
    setIsInviteCodeLoading(false);
    if (!res?.result) {
      toast.error("Invalid invite code. Try another.");
      return;
    }

    dispatch(setInviteCode(code));
  };

  return (
    <BgBox>
      <BgCoverImg />
      <ContentBox>
        <div className="mt-[4.5rem] px-[6.5rem]">
          <PageStep
            handlePageStep={handlePageStep}
            isNextDisabled={isNextDisabled}
          />
        </div>
        <div className="mt-[4rem]">
          <SubTitleText>YOU’RE ALMOST THERE</SubTitleText>
          <TitleText>To join the zkLink Aggregation Parade</TitleText>
        </div>
        <div className="mt-[3.56rem]">
          <div className="flex justify-center gap-[0.5rem]">
            <CardBox>
              <StepNum>01</StepNum>
            </CardBox>
            <CardBox className="flex justify-between items-center p-[1.5rem] w-[40.125rem] h-[6.25rem]">
              <StepItem>
                <p className="step-title">
                  Enter Invite Code or Create Your Team
                </p>
                <p className="step-sub-title mt-[0.25rem]">
                  You could modify it before bridge
                </p>
              </StepItem>

              <div className="flex items-center gap-[0.5rem]">
                <InviteInput
                  type="text"
                  placeholder="Invite Code"
                  value={inviteCodeValue}
                  className={`max-w-[120px] ${validInviteCode(inviteCode) ? 'bg-[#1D4138] cursor-not-allowed': 'bg-[rgba(0, 0, 0, 0.5)]'}`}
                  readOnly={validInviteCode(inviteCode)}
                  // disabled={validInviteCode(inviteCode)}
                  maxLength={6}
                  onChange={(e) => setInviteCodeValue(e.target.value)}
                />
                {validInviteCode(inviteCode) ? (
                  <img
                    src="/img/icon-right.svg"
                    className="w-[1.5rem] h-[1.5rem]"
                  />
                ) : (
                  <Button
                    className={`gradient-btn px-[1rem] py-[0.5rem] text-[1rem] ${
                      !validInviteCode(inviteCodeValue) ? "disabled" : ""
                    }`}
                    isLoading={isInviteCodeLoading}
                    disabled={!validInviteCode(inviteCodeValue)}
                    onClick={() => enterInviteCode(inviteCodeValue)}
                  >
                    <span className="ml-[0.5rem]">Confirm</span>
                  </Button>
                )}
              </div>
            </CardBox>
          </div>

          <div className="flex justify-center gap-[0.5rem] mt-[1rem]">
            <CardBox>
              <StepNum>02</StepNum>
            </CardBox>
            <CardBox className="flex justify-between items-center p-[1.5rem] w-[40.125rem] h-[6.25rem]">
              <StepItem>
                <p className="step-title">Connect Twitter</p>
                <p className="step-sub-title mt-[0.25rem]">
                  Check if you are a real person.
                </p>
              </StepItem>
              <div>
                {twitter ? (
                  <img
                    src="/img/icon-right.svg"
                    className="w-[1.5rem] h-[1.5rem]"
                  />
                ) : (
                  <Button
                    className="gradient-btn px-[1rem] py-[0.5rem] text-[1rem] flex items-center gap-[0.5rem]"
                    isLoading={twitterLoading}
                    onClick={handleConnectTwitter}
                  >
                    <span className="ml-[0.5rem]">Connect Twitter/X</span>
                  </Button>
                )}
              </div>
            </CardBox>
          </div>

          <div className="flex justify-center gap-[0.5rem] mt-[1rem]">
            <CardBox>
              <StepNum>03</StepNum>
            </CardBox>
            <CardBox className="flex justify-between items-center p-[1.5rem] w-[40.125rem] h-[6.25rem]">
              <StepItem>
                <p className="step-title">Connect your wallet</p>
                <p className="step-sub-title mt-[0.25rem]">
                  Connect your Web3 wallet to continue
                </p>
              </StepItem>
              <div>
                {isConnected && signature ? (
                  <img
                    src="/img/icon-right.svg"
                    className="w-[1.5rem] h-[1.5rem]"
                  />
                ) : (
                  <Button
                    className="gradient-btn px-[1rem] py-[0.5rem] text-[1rem]"
                    isLoading={isConnecting}
                    onClick={handleConnectWallet}
                  >
                    <span className="ml-[0.5rem]">Connect Your Wallet</span>
                  </Button>
                )}
              </div>
            </CardBox>
          </div>
        </div>
      </ContentBox>
      <div className="absolute bottom-[4.5rem] w-full flex flex-col items-center">
        <FooterTvlText className="mb-[0.5rem] text-center">TVL</FooterTvlText>
        <TotalTvlCard />
      </div>
    </BgBox>
  );
}
