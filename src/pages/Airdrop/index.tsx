import { useEffect } from "react";
import Landing from "./Landing";
import SoftKYC from "./SoftKYC";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";
import Bridge from "./Bridge";
import Dashboard from "./Dashboard";
import {
  setInvite,
  setInviteCode,
  setIsGroupLeader,
  setTwitter,
  setTwitterAccessToken,
  setViewStatus,
} from "@/store/modules/airdrop";
import { getInvite } from "@/api";
import { RootState } from "@/store";
import Home from "./Home";
import { useSearchParams } from "react-router-dom";

import { useStartTimerStore } from "@/hooks/useStartTimer";
import { code } from "@nextui-org/react";
export const STATUS_CODE = {
  home: 0,
  landing: 1,
  softKYC: 2,
  deposit: 3,
  dashboard: 4,
};

export default function Airdrop() {
  const { campaignStart } = useStartTimerStore();
  const { address, isConnected } = useAccount();
  const {
    viewStatus,
    inviteCode,
    isGroupLeader,
    signature,
    twitterAccessToken,
    invite,
  } = useSelector((store: RootState) => store.airdrop);
  // const [status, setStatus] = useState(STATUS_CODE.landing)
  const dispatch = useDispatch();

  const getInviteFunc = async () => {
    if (!address) return;
    try {
      const res = await getInvite(address);
      console.log("invite", res);
      if (res.result) {
        dispatch(setInvite(res.result));
        console.log("invite store", invite);
      }
    } catch (error) {
      console.log(error);
      // getInviteFunc()
    }
  };

  useEffect(() => {
    getInviteFunc();
  }, [address, isConnected]);

  const [searchParams, setSearchParams] = useSearchParams();

  // useEffect(() => {
  //   let _status = STATUS_CODE.home;
  //   const code = searchParams.get("code");
  //   if (isConnected && address && invite?.code) {
  //     _status = STATUS_CODE.dashboard;
  //   } else if (
  //     (inviteCode || isGroupLeader) &&
  //     isConnected &&
  //     address &&
  //     signature &&
  //     twitterAccessToken
  //   ) {
  //     _status = STATUS_CODE.deposit;
  //   } else if ((code && !invite?.code) || isConnected) {
  //     _status = STATUS_CODE.softKYC;
  //   }

  //   dispatch(setViewStatus(_status));
  // }, [
  //   address,
  //   isConnected,
  //   signature,
  //   invite,
  //   inviteCode,
  //   isGroupLeader,
  //   twitterAccessToken,
  //   searchParams,
  // ]);

  return (
    <>
      {(viewStatus === STATUS_CODE.home || !campaignStart) && <Home />}
      {viewStatus === STATUS_CODE.landing && <Landing />}
      {viewStatus === STATUS_CODE.softKYC && <SoftKYC />}
      {viewStatus === STATUS_CODE.deposit && <Bridge />}
      {viewStatus === STATUS_CODE.dashboard && <Dashboard />}
    </>
  );
}
