import { NftContainer } from "./SbtNFT";
import { Button, useDisclosure } from "@nextui-org/react";
import useNovaNFT, { MysteryboxMintParams } from "@/hooks/useNovaNFT";
import useNovaDrawNFT from "@/hooks/useNovaNFT";
import useSbtNft from "@/hooks/useNFT";
import { useAccount } from "wagmi";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Abi } from "viem";
import SbtUpgradeModal from "@/components/Dashboard/NovaCharacterComponents/SbtUpgradeModal";
export default function SbtNFT() {
  const { address } = useAccount();
  const [lynksBalance, setLynksBalance] = useState(0);
  const { trademarkNFT, lynksNFT, publicClient } = useNovaDrawNFT();
  const { getLynksNFT } = useNovaNFT();
  const { nft, loading: mintLoading, fetchLoading } = useSbtNft();

  const upgradeModal = useDisclosure();
  const [upgradable, setUpgradable] = useState(false);

  useEffect(() => {
    (async () => {
      if (address && trademarkNFT) {
        const lynksBalances = await getLynksNFT(address);
        if (lynksBalances) {
          const balance = lynksBalances.reduce(
            (acc, cur) => acc + cur.balance,
            0
          );
          setLynksBalance(balance);
        }
        const trademarkBalancesCall = await publicClient?.multicall({
          contracts: [1, 2, 3, 4].map((item) => ({
            address: trademarkNFT.address,
            abi: trademarkNFT.abi as Abi,
            functionName: "balanceOf",
            args: [address, item],
          })),
        });
        const trademarkBalances =
          trademarkBalancesCall?.map(
            (item) => Number(item.result?.toString()) ?? 0
          ) ?? [];
        console.log("trademarkBalances: ", trademarkBalances);
        if (
          // Number(lynksBalance) === 0 &&
          trademarkBalances[0] > 0 &&
          trademarkBalances[1] > 0 &&
          trademarkBalances[2] > 0 &&
          trademarkBalances[3] > 0
        ) {
          setUpgradable(true);
        } else {
          setUpgradable(false);
        }
      }
    })();
  }, [address, getLynksNFT, publicClient, trademarkNFT]);

  const handleMintNow = useCallback(() => {
    if (fetchLoading) {
      return;
    }
    if (upgradable) {
      upgradeModal.onOpen();
    }
  }, [fetchLoading, upgradable, upgradeModal]);
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
        <Button className="btn-mint mt-auto" onClick={handleMintNow}>
          <img src="img/icon-wallet-white-2.svg" alt="" />
          <span>Start Minting Now</span>
        </Button>
      </div>
      <SbtUpgradeModal
        nft={nft}
        mintLoading={mintLoading}
        upgradeModal={upgradeModal}
      />
    </NftContainer>
  );
}
