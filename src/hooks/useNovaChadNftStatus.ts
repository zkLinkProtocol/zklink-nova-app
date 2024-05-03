import { getMemeMysteryboxReward } from "@/api";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default () => {
  const { address } = useAccount();
  const [isMemeMysteryboxReward, setIsMemeMysteryboxReward] = useState(false);
  const getMemeMysteryboxRewardFunc = async () => {
    if (!address) return;
    const res = await getMemeMysteryboxReward(address);
    if (res?.result) {
      setIsMemeMysteryboxReward(res.result);
    }
  };

  useEffect(() => {
    getMemeMysteryboxRewardFunc();
  }, [address]);

  return { isMemeMysteryboxReward, getMemeMysteryboxRewardFunc };
};
