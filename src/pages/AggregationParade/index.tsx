import SoftKYC from "./SoftKYC";
import Dashboard from "../Dashboard";
import { airdropState } from "@/store/modules/airdrop";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function AggregationParade() {
  const { isActiveUser } = useSelector(
    (store: { airdrop: airdropState }) => store.airdrop
  );

  // const [isLoading,setIsLoading] = useState(false)
  // useEffect(() => {
    
  // }, []) 

  return <>{isActiveUser ? <Dashboard /> : <SoftKYC />}</>;
}
