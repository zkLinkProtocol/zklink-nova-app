import { RootState } from "@/store";
import Landing from "./Landing";
import SoftKYC from "./SoftKYC";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import {
  setInvite,
  setTwitterAccessToken,
  setViewStatus,
} from "@/store/modules/airdrop";
import { useNavigate, useSearchParams } from "react-router-dom";
import Bridge from "./Bridge";
import { getInvite } from "@/api";

export const STATUS_CODE = {
  softKYC: 1,
  deposit: 2,
  dashboard: 3,
};

export default function AggregationParade() {
  const [searchParams] = useSearchParams();
  const { isConnected, isDisconnected, address } = useAccount();
  const { viewStatus, inviteCode, twitterAccessToken, signature, invite } =
    useSelector((store: RootState) => store.airdrop);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("isDisconnected", isDisconnected);
  }, [isDisconnected]);

  useEffect(() => {
    const code = searchParams.get("code");
    if (code && invite?.code) {
      dispatch(setViewStatus(STATUS_CODE.softKYC));
      return;
    }

    if (isConnected && invite?.code) {
      dispatch(setViewStatus(STATUS_CODE.dashboard));
      return;
    }

    if (isConnected) {
      dispatch(setViewStatus(STATUS_CODE.softKYC));
      if (inviteCode && twitterAccessToken && signature) {
        dispatch(setViewStatus(STATUS_CODE.deposit));
      }
    }
  }, [
    searchParams,
    isConnected,
    twitterAccessToken,
    inviteCode,
    signature,
    invite,
  ]);

  useEffect(() => {
    console.log("viewStatus", viewStatus);

    // if (viewStatus === STATUS_CODE.landing) {
    //   dispatch(setTwitterAccessToken(""));
    // }
  }, [viewStatus]);

  const getInviteFunc = async () => {
    if(!address) return
    const res = await getInvite(address);
    if (res?.result) {
      dispatch(setInvite(res?.result));
    }
  };
  useEffect(() => {
    getInviteFunc();
  }, [address]);

  return (
    <>
      {/* {viewStatus === STATUS_CODE.landing && <Landing />} */}
      {viewStatus === STATUS_CODE.softKYC && <SoftKYC />}
      {viewStatus === STATUS_CODE.deposit && <Bridge />}
      {viewStatus === STATUS_CODE.dashboard && <>Dashboard</>}
    </>
  );
}
