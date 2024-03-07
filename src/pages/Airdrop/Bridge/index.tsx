import { useState, useMemo, useCallback, useEffect } from "react";
import classnames from "classnames";
import OTPInput from "react-otp-input";
import "@/styles/otp-input.css";
import BridgeComponent from "@/components/Bridge";
import { Button } from "@nextui-org/react";
import styled from "styled-components";

const BgBox = styled.div`
  position: relative;
  padding-top: 5.5rem;
  padding-bottom: 2rem;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(
    360deg,
    rgba(0, 179, 255, 0.4) 0%,
    rgba(12, 14, 17, 0.4) 100%
  );

  overflow: auto;
`;
const ActiveTypes = [
  { label: "NOVA Points", value: "points" },
  { label: "NOVA NFT", value: "nft" },
];
const UtilityList = [
  "ZKL Airdrop",
  "IDO whitelist",
  "ZKL swags",
  "Future NFT whitelist",
  "zkLinkers event access",
  "GAS rebates",
];
export default function Bridge() {
  const [activeType, setActiveType] = useState(ActiveTypes[0].value);

  return (
    <BgBox>
      <div className="block lg:flex md:py-24 py-12">
        <div className="px-8 md:px-16 lg:px-32 lg:w-1/2">
          <h2 className="text-4xl mt-6">
            Bridge to Nova to Earn EXTRA YIELD and token rewards on zkLink Nova.
          </h2>
          <div className="flex items-center mt-10">
            {ActiveTypes.map((item) => (
              <Button
                onClick={() => setActiveType(item.value)}
                className={classnames(
                  activeType === item.value
                    ? "gradient-btn"
                    : "gradient-secondary-btn",
                  " px-[1rem] py-[0.5rem] text-[1rem] mr-4"
                )}
              >
                {item.label}
              </Button>
            ))}
          </div>
          <div className="text-base mt-10">
            <p>
              You will earn one of the four Nova SBT once you bridge any amount
              of supported token into zkLink Nova.
            </p>
            <div className="flex items-center mt-12 mb-12">
              {new Array(4).fill("").map((_, index) => (
                <img
                  className="w-20 h-20 mr-6"
                  src={"/img/sbt-nft.png"}
                  alt=""
                  key={index}
                />
              ))}
            </div>
            {/* <div className="py-4">
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
            </div> */}
            <p>
              Upon collecting your SBT, you can upgrade it into an ERC7221 NFT
              through collecting 4 different types of trademark NFT through our
              referral program.
            </p>
            <p>
              You will get a trademark NFT airdrop for each 3 referrals <br />
              Top 50 on the referral leader-board will be airdrop a Mystery Box.
            </p>
            <p className="mt-8">
              Once you upgrade your SBT into , here are the Utility
            </p>
          </div>
          <div
            className="p-6 rounded-[18px] mt-4"
            style={{ background: "rgba(0, 0, 0, 0.4)" }}
          >
            {UtilityList.map((item, index) => (
              <p
                className={classnames(
                  "font-semibold text-lg",
                  index === UtilityList.length - 1 ? "mb-0" : "mb-4"
                )}
                key={item}
              >
                {item}
              </p>
            ))}
          </div>
        </div>
        <div className="px-8 md:px-16 lg:px-32 lg:w-1/2">
          <BridgeComponent isFirstDeposit={true} />
        </div>
      </div>
    </BgBox>
  );
}
