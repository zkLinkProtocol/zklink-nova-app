import { useEffect, useMemo, useState } from "react";
import OTPInput from "react-otp-input";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { setInviteCode } from "@/store/modules/airdrop";
import "@/styles/otp-input.css";
import { RootState } from "@/store";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import Loading from "@/components/Loading";
import { GradientBox } from "@/styles/common";
import NovaNetworkTVL from "@/components/NovaNetworkTVL";

const BgBox = styled.div`
  width: 100%;
  /* min-height: 100vh; */
  min-height: 1384px;
  /* background-image: image-set(
    "/img/bg-home@0.5x.png" 0.5x,
    "/img/bg-home@1x.png" 1x,
    "/img/bg-home@2x.png" 2x
  ); */
  background-image: url("/img/s2/bg-s2-home.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50%;
`;

const CardBox = styled.div`
  background-image: url("/img/s2/bg-home-invite-code.png");
  background-repeat: no-repeat;
  background-size: 1030px 651px;
  background-position: -194px -80px;
  box-shadow: 0px 57.333px 136.718px 0px rgba(178, 10, 245, 0.2);

  /* border-radius: 20px;
  border: 0.6px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px); */
`;
const TitleBox = styled.div`
  .flexBox {
    justify-content: center;
  }
  .title {
    color: #fff;
    font-family: Satoshi;
    font-style: normal;
    font-weight: 900;
    letter-spacing: -0.168px;
  }
  .sub-title {
    color: #fff;
    font-family: Satoshi;
    font-style: normal;
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
    position: relative;
    width: 420px;
    height: 60px;
    overflow: hidden;
    box-sizing: content-box;

    @keyframes move {
      0% {
        top: 0;
      }
      10% {
        top: 0;
      }
      20% {
        top: -60px;
      }
      33% {
        top: -60px;
      }
      43% {
        top: -120px;
      }
      56% {
        top: -120px;
      }
      66% {
        top: -180px;
      }
      79% {
        top: -180px;
      }
      89% {
        top: -240px;
      }
      95% {
        top: -240px;
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
      width: 420px;
      text-align: center;
      font-family: Satoshi;
      font-size: 36.249px;
      font-style: normal;
      font-weight: 900;
      line-height: 60px;
      background: linear-gradient(180deg, #fff 0%, #bababa 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  @media (max-width: 768px) {
    .box {
      margin-left: 0;
      .move {
        left: 50%;
        transform: translateX(-50%);
      }
      .inner {
        width: 100%;
        font-size: 30px;
        text-align: center;
      }
    }
  }
`;

const SubmitButton = styled(Button)`
  border-radius: 48px;
  background: linear-gradient(180deg, #3a3a3a 0%, #282828 100%);

  .btn-text {
    text-align: center;
    font-family: Satoshi;
    font-size: 16px;
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

export default function Home() {
  const { inviteCode, isActiveUser } = useSelector(
    (store: RootState) => store.airdrop
  );
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
  const enterInviteCode = async () => {
    console.log("enter invite code", otp);
    if (!otp || otp.length !== 6) return;

    dispatch(setInviteCode(otp));
    navigator(`/aggregation-parade`);
  };

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (isActiveUser) {
      setIsLoading(true);
      setTimeout(() => {
        navigator("/aggregation-parade");
      }, 1000);
    }
  }, [isActiveUser]);

  useEffect(() => {
    handleOTPChange(inviteCode);
  }, [inviteCode]);

  const isSubmitDisabled = useMemo(() => {
    return !otp || otp.length !== 6;
  }, [otp]);

  return (
    <BgBox className="relative pt-[92px] pb-[65px]">
      {isLoading && <Loading />}
      <div className="px-[16px]">
        {/* Title */}
        <TitleBox className="text-left md:text-center">
          <div className="mt-[50px] flex justify-center">
            <GradientBox className="px-[28px] py-[12px] rounded-[48px] text-[16px] text-[#fff]">
              Welcome To zkLink Nova
            </GradientBox>
          </div>
          <div className="my-[24px] flex justify-center px-6">
            <h2 className="title  text-[1.8rem] md:text-[44px]">
              The ONLY Aggregated L3 with added yield for
            </h2>
          </div>
          <div className="flex flexBox my-[50px]">
            <GradientBox className="box mr-0 rounded-[14px]">
              <div className="move">
                <div className="inner">ETH</div>
                <div className="inner">Stablecoins</div>
                <div className="inner">LSTs</div>
                <div className="inner">LRTs</div>
                <div className="inner">L2 Native Assets</div>
              </div>
            </GradientBox>
          </div>
          <p className="sub-title my-[50px] pl-6 pr-6 lg:pr-8 text-[1rem] md:text-[26px] leading-[20px]">
            Bridge to earn Mega Yield and $ZKL on zkLink Nova
          </p>
        </TitleBox>

        {/* Form: Invite code */}
        <CardBox className="mx-auto px-[26px] w-[360px] md:w-[680px] h-[376px] rounded-[18px] flex flex-col justify-center items-center text-center">
          <TitleBox>
            <h4 className="title text-[24px] leading-[normal]">
              Enter Your Invite Code
            </h4>
            <p className="sub-title opacity-60 text-[14px] mt-[16px] leading-[normal]">
              To participate in the campaign
            </p>
          </TitleBox>

          <div className="mt-[26px]">
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

          <div className="mt-[26px] text-[14px] leading-[normal] opacity-60">
            Join our{" "}
            <a
              href="https://discord.com/invite/zklink"
              // className="text-[#03D498]"
              target="_blank"
            >
              Discord
            </a>{" "}
            or search{" "}
            <a
              href="https://twitter.com/search?q=%23zkLinkNovaAggParade&src=typeahead_click"
              // className="text-[#03D498]"
              target="_blank"
            >
              #zkLinkNovaAggParade
            </a>{" "}
            on twitter for invite code
          </div>

          <div className="mt-[26px] w-full">
            <SubmitButton
              className={`w-full h-[56px] flex items-center justify-center gap-[13px] text-center ${
                isSubmitDisabled ? "opacity-50" : ""
              }`}
              isDisabled={isSubmitDisabled}
              onClick={enterInviteCode}
            >
              <img
                src="/img/s2/icon-submit.svg"
                alt=""
                width={22}
                height={22}
              />
              <span className="btn-text">Submit</span>
            </SubmitButton>
          </div>
        </CardBox>
      </div>

      <NovaNetworkTVL />
    </BgBox>
  );
}
