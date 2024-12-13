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
import { useConnectModal } from "@rainbow-me/rainbowkit";

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
  filter: blur(0.125px);
  border: 4px solid transparent;
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;
  background-image: linear-gradient(to bottom, #282828, #000000),
    linear-gradient(
      175deg,
      #fb2450,
      #fbc82e,
      #6eee3f,
      #5889f3,
      #5095f1,
      #b10af4 80%
    );
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
    /* width: 420px; */
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
      /* width: 420px; */
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

const GradientText = styled.div`
  background: linear-gradient(90deg, #6276e7 23.64%, #e884fe 75.69%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  leading-trim: both;
  text-edge: cap;
  font-family: Satoshi;
  font-size: 26px;
  font-style: normal;
  font-weight: 700;
  line-height: 130%;
`;

const LoginLine = styled.div`
  height: 1.103px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(251, 251, 251, 0.6) 51.5%,
    rgba(255, 255, 255, 0) 100%
  );
`;

export default function Home() {
  const { openConnectModal } = useConnectModal();

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
          <div className="my-[24px] px-6">
            <h2 className="title text-center text-[1.8rem] md:text-[44px]">
              Aggregation Parade has successfully ended
            </h2>
          </div>
          <div>
            <div className="text-center text-[26px] text-[#fff] font-[500] leading-[130%]">
              We’ve celebrated amazing achievements together with you
            </div>
            <GradientText className="text-center">
              Our Amazing Community
            </GradientText>
            <div className="flex justify-center">
              <a
                href="https://discord.com/channels/839458691983605832/1104554827712827402/1314525507567485048"
                target="_blank"
                className="mt-[16px] flex items-center justify-center gap-[4px] opacity-50 hover:opacity-100"
              >
                <span className="text-[#fff] text-[14px] font-[700]">
                  Check announcement
                </span>
                <img
                  src="/img/arrow-check-announcement.svg"
                  alt=""
                  width={16}
                  height={16}
                />
              </a>
            </div>
          </div>
          {/* <div className="flex flexBox my-[50px]">
            <GradientBox className="box mr-0 rounded-[14px] w-[360px]">
              <div className="inner">1.2B TVL</div>
            </GradientBox>
          </div> */}
        </TitleBox>

        {/* Form: Invite code */}
        <CardBox className="mt-[50px] mx-auto px-[26px] py-[32px] w-[360px] md:min-w-[552px] min-h-[226px] rounded-[18px]">
          <TitleBox>
            <h4 className="title text-center text-[24px]">
              Aggregation Parade Season II
            </h4>
            <LoginLine className="w-full my-[26px]" />
          </TitleBox>

          <div className="text-center text-[14px] opacity-60 font-[700] md:whitespace-nowrap">
            You could still check your Nova Points in the Aggregation Parade
            Dashboard
          </div>

          <div className="mt-[26px] w-full">
            <SubmitButton
              className={`w-full h-[56px] flex items-center justify-center gap-[13px] text-center`}
              onClick={() => openConnectModal?.()}
            >
              <span className="btn-text">Connect Wallet</span>
            </SubmitButton>
          </div>
        </CardBox>
      </div>

      <NovaNetworkTVL />
    </BgBox>
  );
}
