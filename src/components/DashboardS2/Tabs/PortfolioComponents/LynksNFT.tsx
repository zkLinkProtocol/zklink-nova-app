import { NftContainer } from "./SbtNFT";
import { Button, useDisclosure } from "@nextui-org/react";
import useNovaNFT from "@/hooks/useNovaNFT";
import useSbtNft from "@/hooks/useNFT";
import { useAccount } from "wagmi";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Abi } from "viem";
import SbtUpgradeModal from "@/components/Dashboard/NovaCharacterComponents/SbtUpgradeModal";
import { useUpdateNftBalanceStore } from "@/hooks/useUpdateNftBalanceStore";

export default function SbtNFT() {
  const { address } = useAccount();
  const [lynksBalance, setLynksBalance] = useState(0);
  const { publicClient, trademarkNFT } = useNovaNFT();
  const { getLynksNFT } = useNovaNFT();
  const { nft, loading: mintLoading, fetchLoading } = useSbtNft();
  const upgradeModal = useDisclosure();
  const [upgradable, setUpgradable] = useState(false);
  const { factor, updateFactor } = useUpdateNftBalanceStore();

  useEffect(() => {
    (async () => {
      if (address && trademarkNFT && publicClient) {
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
  }, [address, getLynksNFT, publicClient, trademarkNFT, factor]);

  useEffect(() => {
    (async () => {
      if (!address) {
        return;
      }
      const lynksBalances = await getLynksNFT(address);
      if (lynksBalances) {
        const balance = lynksBalances.reduce(
          (acc, cur) => acc + cur.balance,
          0
        );
        setLynksBalance(balance);
      }
    })();
  }, [address, getLynksNFT, factor]);

  const handleMintNow = useCallback(() => {
    if (fetchLoading) {
      return;
    }
    if (upgradable) {
      upgradeModal.onOpen();
    }
  }, [fetchLoading, upgradable, upgradeModal]);

  const nftImage = useMemo(() => {
    if (nft && lynksBalance > 0) {
      return `/img/img-${nft?.name}-LYNK.png`;
    } else {
      return "/img/img-ENTP-LYNK.png";
    }
  }, [lynksBalance, nft]);

  return (
    <NftContainer>
      <div className="nft-image">
        <img src={nftImage} alt="" />
      </div>
      <div className="flex flex-col flex-1 h-full">
        <p className="font-bold text-lg">
          Nova Lynks{lynksBalance > 0 ? ` (${lynksBalance})` : ""}
        </p>
        <div className="divide my-1"></div>
        <p className="text-sm text-[#FBFBFB]/[0.6]">
          Collect ONE OF EACH of the four different types of Trademark NFTs to
          upgrade your SBT to Lynks.
        </p>
        <Button
          className="btn-mint mt-auto"
          onClick={handleMintNow}
          isLoading={fetchLoading}
          isDisabled={!upgradable}
        >
          <img src="img/icon-wallet-white-2.svg" alt="" />
          <span>Mint Now</span>
        </Button>
      </div>
      <SbtUpgradeModal
        nft={nft}
        mintLoading={mintLoading}
        upgradeModal={upgradeModal}
        onUpgraded={() => {
          updateFactor();
        }}
      />
    </NftContainer>
  );
}
