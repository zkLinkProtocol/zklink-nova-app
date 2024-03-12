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

export const STATUS_CODE = {
  home: 0,
  landing: 1,
  softKYC: 2,
  deposit: 3,
  dashboard: 4,
};

export default function Airdrop() {
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
  useEffect(() => {
    console.log(
      "---viewStatus----",
      viewStatus,
      twitterAccessToken,
      inviteCode,
      isGroupLeader
    );
    const code = searchParams.get("code");

    let _status = STATUS_CODE.home;
    if (isConnected && invite?.code) {
      _status = STATUS_CODE.dashboard;
    } else if (
      isConnected &&
      signature &&
      (inviteCode || isGroupLeader) &&
      twitterAccessToken
    ) {
      _status = STATUS_CODE.deposit;
    } else if (inviteCode || isGroupLeader) {
      _status = STATUS_CODE.softKYC;
    }

    // if (isConnected) {
    //   if (!inviteCode || inviteCode === "") {
    //     dispatch(setIsGroupLeader(true));
    //   }
    // }

    if (!twitterAccessToken && code) {
      _status = STATUS_CODE.softKYC;
    }

    console.log("_status", _status, isConnected);
    dispatch(setViewStatus(_status));
  }, [
    inviteCode,
    isGroupLeader,
    twitterAccessToken,
    isConnected,
    address,
    signature,
    invite,
    searchParams,
  ]);

  // useEffect(() => {
  //   dispatch(setTwitterAccessToken(''));
  //   dispatch(setIsGroupLeader(false));
  // }, []);

  return (
    <>
      {viewStatus === STATUS_CODE.home && <Home />}
      {viewStatus === STATUS_CODE.landing && <Landing />}
      {viewStatus === STATUS_CODE.softKYC && <SoftKYC />}
      {viewStatus === STATUS_CODE.deposit && <Bridge />}
      {viewStatus === STATUS_CODE.dashboard && <Dashboard />}
    </>
  );
}
