
import { NftContainer } from "./SbtNFT";
import { Button } from "@nextui-org/react";
import useNovaNFT, { MysteryboxMintParams } from "@/hooks/useNovaNFT";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";

export default function SbtNFT() {
  const { address } = useAccount();
  const [lynksBalance, setLynksBalance] = useState(0);
  const { getLynksNFT } = useNovaNFT();

  useEffect(() => {
    (async () => {
      if (address) {
        const lynksBalances = await getLynksNFT(address);
        if (lynksBalances) {
          const balance = lynksBalances.reduce(
            (acc, cur) => acc + cur.balance,
            0
          );
          setLynksBalance(balance);
        }
      }
    })();
  }, [address, getLynksNFT]);
  return (
    <NftContainer>
      <div className="nft-image">
        <img src="/img/s2/img-lynks-nft-ESFJ.png" alt="" />
      </div>
      <div className="flex flex-col flex-1 h-full">
        <p className="font-bold text-lg">
          Nova Lynks{lynksBalance > 0 ? ` (${lynksBalance})` : ""}
        </p>
        <div className="divide my-1"></div>
        <p className="text-sm text-[#FBFBFB]/[0.6]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor
        </p>
        <Button className="btn-mint mt-auto">
          <img src="img/icon-wallet-white-2.svg" alt="" />
          <span>Start Minting Now</span>
        </Button>
      </div>
    </NftContainer>
  );
}
