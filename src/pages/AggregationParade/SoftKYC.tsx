import { checkInviteCode, validTwitter } from "@/api";
import { SIGN_MESSAGE } from "@/constants/sign";
import { RootState } from "@/store";
import {
  setInviteCode,
  setSignature,
  setTwitterAccessToken,
} from "@/store/modules/airdrop";
import { CardBox } from "@/styles/common";
import { postData, showAccount } from "@/utils";
import { Button } from "@nextui-org/react";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import qs from "qs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { useAccount, useSignMessage } from "wagmi";

const BgBox = styled.div`
  position: relative;
  padding-top: 5.5rem;
  width: 100%;
  min-height: 100vh;
  background-image: image-set(
    "/img/bg-mega-yield@1x.png" 1x,
    "/img/bg-mega-yield@2x.png" 2x
  );
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top;
`;

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
  const { address, isConnected, isConnecting } = useAccount();
  const web3Modal = useWeb3Modal();
  const { signature, twitterAccessToken } = useSelector(
    (store: RootState) => store.airdrop
  );
  const [inviteCodeValue, setInviteCodeValue] = useState("");
  const [isInviteCodeLoading, setIsInviteCodeLoading] = useState(false);
  const [isInviteCodeChecked, setIsInviteCodeChecked] = useState(false);
  const [isSigned, setIsSigned] = useState(false);

  const [twitterLoading, setTwitterLoading] = useState(false);
  const dispatch = useDispatch();
  const { signMessage } = useSignMessage();
  const navigate = useNavigate();

  const validInviteCode = (code: string) => {
    return code && code.length === 6 ? true : false;
  };

  const enterInviteCode = async (code: string) => {
    if (!code || code.length !== 6) return;
    setIsInviteCodeLoading(true);
    const res = await checkInviteCode(code);
    setIsInviteCodeLoading(false);
    if (!res?.result) {
      setIsInviteCodeChecked(false);
      toast.error("Invalid invite code. Try another.");
      return;
    }

    setIsInviteCodeChecked(true);

    dispatch(setInviteCode(code));
  };

  const handleConnectTwitter = () => {
    setTwitterLoading(true);
    const params = {
      response_type: "code",
      client_id: import.meta.env.VITE_TWITTER_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_TWITTER_CALLBACK_URL,
      // client_id: "RTUyVmlpTzFjTFhWWVB4b2tyb0k6MTpjaQ",
      // redirect_uri: "http://localhost:3000/aggregation-parade",
      scope: "tweet.read%20users.read%20follows.read%20follows.write",
      state: "state",
      code_challenge: "challenge",
      code_challenge_method: "plain",
    };
    const url = new URL(`https://twitter.com/i/oauth2/authorize`);
    url.search = qs.stringify(params, { encode: false });

    window.location.href = url.href;
  };

  const handleSign = async () => {
    if (!isConnected) {
      web3Modal.open({ view: "Connect" });
      return;
    }
    await signMessage(
      {
        message: SIGN_MESSAGE,
      },
      {
        onSuccess(data, variables, context) {
          console.log(data, variables, context);
          dispatch(setSignature(data));
          setIsSigned(true);
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

  const toastTwitterError = (text?: string) => {
    toast.error(text || "Could not connect to Twitter. Try again.");
    setTwitterLoading(false);
  };

  const getTwitterAPI = async (code: string) => {
    setTwitterLoading(true);
    postData("/twitter/2/oauth2/token", {
      code,
      grant_type: "authorization_code",
      // client_id: "RTUyVmlpTzFjTFhWWVB4b2tyb0k6MTpjaQ",
      // redirect_uri: "http://localhost:3000/aggregation-parade",
      client_id: import.meta.env.VITE_TWITTER_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_TWITTER_CALLBACK_URL,
      code_verifier: "challenge",
    })
      .then((res) => {
        console.log(res);

        if (res?.error) {
          toastTwitterError();
          return;
        }

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
            .then(async (res: any) => {
              let { data } = await res.json();
              console.log(data);
              console.log(data.username);
              // dispatch(setTwitter(data));

              if (data?.username) {
                console.log(data?.username);
                const res = await validTwitter(data?.username, address);

                if (res.result) {
                  setTwitterLoading(false);
                  dispatch(setTwitterAccessToken(access_token));
                  console.log("twitter account", access_token);
                  // setSearchParams("");
                } else {
                  toastTwitterError(
                    "Sorry, this Twitter account has already been bound."
                  );
                }
              }
            })
            .catch(() => {
              toastTwitterError();
            });
        }
      })
      .catch((error) => {
        console.log(error);
        toastTwitterError;
      });
  };

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      toast.error("Could not connect to Twitter. Try again.");
      return;
    }

    if (code) {
      getTwitterAPI(code);
      setSearchParams("");
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isConnected) {
      setIsSigned(false);
      dispatch(setSignature(""));
    }
  }, [isConnected]);

  // const navigator = useNavigate();
  // useEffect(() => {
  //   console.log("isConnected", isConnected);
  //   if (isDisconnected) {
  //     navigator("/");
  //   }
  // }, [isConnected]);

  const onChangeInviteCode = (value: string) => {
    setInviteCodeValue(value);
    setIsInviteCodeChecked(false);
  };

  return (
    <BgBox>
      <div>
        <div className="mt-[1.5rem]">
          <SubTitleText>YOU’RE ALMOST THERE</SubTitleText>
          <TitleText>To join the zkLink Aggregation Parade</TitleText>
        </div>
        <div className="mt-[3.5rem]">
          <div className="flex justify-center gap-[0.5rem]">
            <CardBox className={`${isInviteCodeChecked ? "successed" : ""}`}>
              <StepNum>01</StepNum>
            </CardBox>
            <CardBox
              className={`flex justify-between items-center p-[1.5rem] w-[40.125rem] h-[6.25rem] ${
                isInviteCodeChecked ? "successed" : ""
              }`}
            >
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
                  className={`max-w-[120px] ${
                    isInviteCodeChecked
                      ? "bg-[#1D4138]"
                      : "bg-[rgba(0, 0, 0, 0.5)]"
                  }`}
                  // disabled={validInviteCode(inviteCode)}
                  maxLength={6}
                  onChange={(e) => onChangeInviteCode(e.target.value)}
                />

                <Button
                  className={`gradient-btn px-[1rem] py-[0.5rem] text-[1rem] ${
                    !validInviteCode(inviteCodeValue) ? "disabled" : ""
                  }`}
                  isLoading={isInviteCodeLoading}
                  disabled={!validInviteCode(inviteCodeValue)}
                  onClick={() => enterInviteCode(inviteCodeValue)}
                >
                  <span className="ml-[0.5rem]">Verify</span>
                </Button>

                {/* {isInviteCodeChecked && (
                  <img
                    src="/img/icon-right.svg"
                    className="w-[1.5rem] h-[1.5rem]"
                  />
                )} */}
              </div>
            </CardBox>
          </div>

          <div className="flex justify-center gap-[0.5rem] mt-[1rem]">
            <CardBox>
              <StepNum>02</StepNum>
            </CardBox>
            <CardBox className="flex justify-between items-center p-[1.5rem] w-[40.125rem] h-[6.25rem]">
              <StepItem>
                <p className="step-title">Bridge and Earn</p>
                <p className="step-sub-title mt-[0.25rem]">
                  {"Minimum deposit amount >= 0.1 ETH or equivalent"}
                </p>
              </StepItem>
              <div className="flex items-center gap-[0.5rem]">
                <Button
                  className="gradient-btn px-[1rem] py-[0.5rem] text-[1rem] flex items-center gap-[0.5rem]"
                  onClick={() => {
                    navigate("/bridge");
                  }}
                >
                  <span className="ml-[0.5rem]">Bridge</span>
                </Button>
                <Button className="gradient-btn px-[1rem] py-[0.5rem] text-[1rem] flex items-center gap-[0.5rem]">
                  <span className="ml-[0.5rem]">Verify</span>
                </Button>
              </div>
            </CardBox>
          </div>

          <div className="flex justify-center gap-[0.5rem] mt-[1rem]">
            <CardBox>
              <StepNum>03</StepNum>
            </CardBox>
            <CardBox className="flex justify-between items-center p-[1.5rem] w-[40.125rem] h-[6.25rem]">
              <StepItem>
                <p className="step-title">Connect Twitter</p>
                <p className="step-sub-title mt-[0.25rem]">
                  Check if you are a real person.
                </p>
              </StepItem>
              <div>
                {twitterAccessToken ? (
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
            <CardBox className={isSigned ? "successed" : ""}>
              <StepNum>04</StepNum>
            </CardBox>
            <CardBox
              className={`flex justify-between items-center p-[1.5rem] w-[40.125rem] h-[6.25rem] ${
                isSigned ? "successed" : ""
              }`}
            >
              <StepItem>
                <p className="step-title">Connect your wallet</p>
                <p className="step-sub-title mt-[0.25rem]">
                  Connect your Web3 wallet to continue
                </p>
              </StepItem>
              <div className="flex items-center gap-[0.5rem]">
                {isConnected && <span>{showAccount(address)}</span>}

                <Button
                  className="gradient-btn px-[1rem] py-[0.5rem] text-[1rem]"
                  onClick={handleSign}
                >
                  <span className="ml-[0.5rem]">Sign</span>
                </Button>
              </div>
            </CardBox>
          </div>

          <div className="flex justify-center">
            <CardBox className="mx-auto px-[8rem] py-[1.5rem] mt-[1rem] cursor-pointer">
              <StepItem>
                <p className="step-title">
                  Participate zkLink Aggregation Parade
                </p>
              </StepItem>
            </CardBox>
          </div>
        </div>
      </div>
    </BgBox>
  );
}
