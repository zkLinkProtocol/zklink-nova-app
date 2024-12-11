import SoftKYC from "./SoftKYC";
import Dashboard from "../DashboardS2/index-end";
import { airdropState } from "@/store/modules/airdrop";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AggregationParade() {
  const { isActiveUser } = useSelector(
    (store: { airdrop: airdropState }) => store.airdrop
  );

  const navigate = useNavigate();
  // const [isLoading,setIsLoading] = useState(false)
  useEffect(() => {
    console.log("isActive", isActiveUser);
    if (!isActiveUser) {
      navigate("/");
    }
  }, [isActiveUser]);

  return <Dashboard />;
}
