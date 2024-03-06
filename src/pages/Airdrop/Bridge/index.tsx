import { useState, useMemo, useCallback, useEffect } from "react";

import OTPInput from "react-otp-input";
import "@/styles/otp-input.css";
import BridgeComponent from "@/components/Bridge";

export default function Bridge() {
  const [{ otp, numInputs, separator, placeholder, inputType }, setConfig] =
    useState({
      otp: "",
      numInputs: 4,
      separator: "",
      placeholder: "",
      inputType: "text" as const,
    });

  const handleOTPChange = (otp: string) => {
    setConfig((prevConfig) => ({ ...prevConfig, otp }));
  };

  return (
    <>
      <div className="block lg:flex md:py-24 py-12">
        <div className="px-8 md:px-16 lg:px-32 lg:w-1/2">
          <h2 className="text-3xl">
            Bridge to Earn Yield and token rewards on zkLink Nova.
          </h2>
          <div className="text-base mt-10">
            <p>
              You will earn one of the four Nova SBT once you bridge any amount
              of supported token into zkLink Nova.
            </p>
            <div className="py-4">
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

          <p className="font-bold">ZKL Airdrop</p>
          <p className="font-bold">ZKL swags</p>
          <p className="font-bold">Future NFT whitelist</p>
          <p className="font-bold">zkLinkers event access</p>
          <p className="font-blod">GAS rebates</p>
        </div>
        <div className="px-8 md:px-16 lg:px-32 lg:w-1/2">
          <BridgeComponent isFirstDeposit={true} />
        </div>
      </div>
    </>
  );
}
