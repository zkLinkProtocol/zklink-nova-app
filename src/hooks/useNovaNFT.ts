import {
  TRADEMARK_NFT_CONTRACT,
  NOVA_CHAIN_ID,
  MYSTERY_BOX_CONTRACT,
  BOOSTER_NFT_CONTRACT,
  LYNKS_NFT_CONTRACT,
} from "@/constants";
import { usePublicClient, useWalletClient, useAccount } from "wagmi";
import { readContract } from "@wagmi/core";
import { useCallback, useEffect, useState, useMemo } from "react";
import NovaTrademarkNFT from "@/constants/abi/NovaTrademarkNFT.json";
import NovaBoosterNFT from "@/constants/abi/NovaBoosterNFT.json";
import NovaLynksNFT from "@/constants/abi/NovaLynksNFT.json";
import NovaMysteryBoxNFT from "@/constants/abi/NovaMysteryBoxNFT.json";
import IERC721 from "@/constants/abi/IERC721.json";
import { config } from "@/constants/networks";
import { ethers } from "ethers";
import { zkSyncProvider } from "./zksyncProviders";
import { Hash, getContract, GetContractReturnType } from "viem";
/**
 * fro trademark nft and mytestory box nft(booster and lynks nft)
 */
const useNovaDrawNFT = () => {
  const { chainId } = useAccount();
  const publicClient = usePublicClient({ config, chainId });
  const { data: walletClient } = useWalletClient();

  const trademarkNFT = useMemo(() => {
    if (!publicClient) return null;
    return getContract({
      address: TRADEMARK_NFT_CONTRACT as Hash,
      abi: NovaTrademarkNFT,
      client: {
        public: publicClient,
        wallet: walletClient,
      },
    }) as GetContractReturnType;
  }, [publicClient, walletClient]);

  const boosterNFT = useMemo(() => {
    if (!publicClient) return null;
    return getContract({
      address: BOOSTER_NFT_CONTRACT as Hash,
      abi: NovaBoosterNFT,
      client: {
        public: publicClient,
        wallet: walletClient,
      },
    });
  }, [publicClient, walletClient]);

  const lynksNFT = useMemo(() => {
    if (!publicClient) return null;
    return getContract({
      address: LYNKS_NFT_CONTRACT as Hash,
      abi: NovaLynksNFT,
      client: {
        public: publicClient,
        wallet: walletClient,
      },
    });
  }, [publicClient, walletClient]);

  const mysteryBoxNFT = useMemo(() => {
    if (!publicClient) return null;
    return getContract({
      address: MYSTERY_BOX_CONTRACT as Hash,
      abi: NovaMysteryBoxNFT,
      client: {
        public: publicClient,
        wallet: walletClient,
      },
    });
  }, [publicClient, walletClient]);

  return {
    trademarkNFT,
    boosterNFT,
    lynksNFT,
    mysteryBoxNFT,
    publicClient,
  };
};

export default useNovaDrawNFT;
