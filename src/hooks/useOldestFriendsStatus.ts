import { getNFTLashin } from "@/api";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default () => {
  const { address } = useAccount();
  const [mintable, setMintable] = useState(false);
  const [minted, setMinted] = useState(false);

  const getOldestFriendsStatus = async () => {
    if (!address) return;
    const { result } = await getNFTLashin(address);
    setMintable(result?.mintable);
    setMinted(result?.minted);
  };

  useEffect(() => {
    getOldestFriendsStatus();
  }, [address]);

  return {
    mintable,
    minted,
    getOldestFriendsStatus,
  };
};
