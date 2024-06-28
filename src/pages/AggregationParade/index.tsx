import SoftKYC from "./SoftKYC";
import Dashboard from "../DashboardS2/index2";
import { airdropState } from "@/store/modules/airdrop";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function AggregationParade() {
  const { isActiveUser } = useSelector(
    (store: { airdrop: airdropState }) => store.airdrop
  );

  // const [isLoading,setIsLoading] = useState(false)
  useEffect(() => {
    console.log("isActiveUserisActiveUserisActiveUser", isActiveUser);
  }, [isActiveUser]);

  return <>{isActiveUser ? <Dashboard /> : <SoftKYC />}</>;
}
