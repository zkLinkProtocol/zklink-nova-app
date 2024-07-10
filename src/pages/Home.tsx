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
import { BlurBox } from "@/styles/common";
import NovaNetworkTVL from "@/components/NovaNetworkTVL";
import { useTranslation } from "react-i18next";

const BgBox = styled.div`
  width: 100%;
  /* min-height: 100vh; */
  min-height: 1212px;
  /* background-image: image-set(
    "/img/bg-home@0.5x.png" 0.5x,
    "/img/bg-home@1x.png" 1x,
    "/img/bg-home@2x.png" 2x
  ); */
  background-image: url("/img/bg-s2.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50%;
`;

const CardBox = styled.div`
  border-radius: 20px;
  border: 0.6px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
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
    width: 420px;
    height: 52px;
    border-radius: 8px;
    // background: rgba(0, 0, 0, 0.40);
    // backdrop-filter: blur(15.800000190734863px);
    overflow: hidden;
    /* padding: 2px 16px; */
    position: relative;

    border-radius: 16.986px;
    border: 0.679px solid rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(16.98630142211914px);
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
      width: 420px;
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
    // TODO: check invite code ?
    // const res = await checkInviteCode(otp);
    // if (!res?.result) {
    //   toast.error("Invalid invite code. Try another.", { duration: 3000 });
    //   return;
    // }

    dispatch(setInviteCode(otp));
    navigator("/aggregation-parade");
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

  const { t } = useTranslation();

  return (
    <BgBox className="relative pt-[92px] pb-[65px]">
      {isLoading && <Loading />}
      {/* Title */}
      <TitleBox className="text-left md:text-center">
        <div className="mt-[100px] flex justify-center">
          <BlurBox className="px-[16px] py-[14px]">
            {t("home.welcome_to_zklink_nova")}
          </BlurBox>
        </div>
        <div className="mt-[20px] flex justify-center px-6">
          <h2 className="title  text-[1.8rem] md:text-[56px] leading-10 md:leading-[50px]">
            The ONLY Aggregated L3 with added yield for
          </h2>
        </div>
        <div className="flex flexBox">
          <div className="box mr-0 mt-[32px]">
            <div className="move">
              <div className="inner">ETH</div>
              <div className="inner">Stablecoins</div>
              <div className="inner">LSTs</div>
              <div className="inner">LRTs</div>
              <div className="inner">L2 Native Assets</div>
            </div>
          </div>
        </div>
        <p className="sub-title my-[32px] pl-6 pr-6 lg:pr-8 text-[1rem] md:text-[26px] leading-[20px]">
          Bridge to earn Mega Yield and $ZKL on zkLink Nova
        </p>
      </TitleBox>

      {/* Form: Invite code */}
      <CardBox className="mx-6 py-[30px] px-[1.375rem] md:px-[50px] md:mx-auto  md:w-[546px] flex flex-col items-center text-center w-auto md:w-[26rem]">
        <TitleBox>
          <h4 className="title text-[26px] leading-[19px]">
            Enter Your Invite Code
          </h4>
          <p className="sub-title opacity-80 text-[1rem] mt-[16px] leading-[11px]">
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

        <div className="mt-[26px] text-[1rem] leading-[18px]">
          Join our{" "}
          <a
            href="https://discord.com/invite/zklink"
            className="text-[#03D498]"
            target="_blank"
          >
            Discord
          </a>{" "}
          or search{" "}
          <a
            href="https://twitter.com/search?q=%23zkLinkNovaAggParade&src=typeahead_click"
            className="text-[#03D498]"
            target="_blank"
          >
            #zkLinkNovaAggParade
          </a>{" "}
          on twitter for invite code
        </div>

        <div>
          <Button
            className={`submit-btn mt-[26px] text-center text-[16px] leading-[52px] w-[125px] h-[52px] bg-[#03D498] rounded-[100px] text-[#030D19] flex items-center gap-[10px] ${
              isSubmitDisabled ? "opacity-50" : ""
            }`}
            isDisabled={isSubmitDisabled}
            onClick={enterInviteCode}
          >
            <span>Submit</span>
            <img
              src="/img/icon-submit-arrow.svg"
              alt=""
              width={13}
              height={10}
            />
          </Button>
        </div>
      </CardBox>

      <NovaNetworkTVL />
    </BgBox>
  );
}
