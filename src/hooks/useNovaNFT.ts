import {
  TRADEMARK_NFT_CONTRACT,
  NOVA_CHAIN_ID,
  MYSTERY_BOX_CONTRACT,
  BOOSTER_NFT_CONTRACT,
  LYNKS_NFT_CONTRACT,
  IS_MAINNET,
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
import { BigNumber, ethers } from "ethers";
import { zkSyncProvider } from "./zksyncProviders";
import {
  Hash,
  getContract,
  GetContractReturnType,
  WriteContractParameters,
  encodeFunctionData,
} from "viem";
import { sleep } from "@/utils";
/**
 * fro trademark nft and mytestory box nft(booster and lynks nft)
 */
export type TrademarkMintParams = {
  tokenId: number;
  nonce: number;
  signature: string;
  expiry: number;
};
export type MysteryboxMintParams = {
  tokenId?: number;
  nonce: number;
  signature: string;
  expiry: number;
};
const useNovaDrawNFT = () => {
  const { chainId } = useAccount();
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);

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
    });
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

  const getLynksNFT = useCallback(
    async (address: string) => {
      if (!lynksNFT) return;
      const balance = await lynksNFT.read.balanceOf([address]);
      if (BigNumber.from(balance).eq(0)) {
        return;
      }

      const tokenIds = await Promise.all(
        new Array(balance)
          .fill(undefined)
          .map((_, index) =>
            lynksNFT.read.tokenOfOwnerByIndex([address, index])
          )
      );
      console.log("tokenIds: ", tokenIds);
      const uris = (await Promise.all(
        new Array(tokenIds.length)
          .fill(undefined)
          .map((_, index) => lynksNFT.read.tokenURI([tokenIds[index]]))
      )) as string[];
      console.log("token uris: ", uris);
      const nfts = uris.map((item: string) =>
        item.substring(item.lastIndexOf("/"))
      );
      return nfts;
    },
    [lynksNFT]
  );

  const sendTrademarkMintTx = async (params: TrademarkMintParams) => {
    if (!address) return;
    try {
      setLoading(true);
      const tx: WriteContractParameters = {
        address: TRADEMARK_NFT_CONTRACT,
        abi: NovaTrademarkNFT,
        functionName: "safeMint",
        args: [
          address,
          params.nonce,
          params.tokenId,
          1,
          params.expiry,
          params.signature,
        ],
      };
      const txData = encodeFunctionData({
        abi: NovaTrademarkNFT,
        functionName: tx.functionName,
        args: tx.args,
      });
      const fee = await zkSyncProvider.attachEstimateFee(
        IS_MAINNET ? "https://rpc.zklink.io" : "https://goerli.rpc.zklink.io"
      )({
        from: address as `0x${string}`,
        to: TRADEMARK_NFT_CONTRACT as `0x${string}`,
        value: "0x00",
        data: txData,
      });
      console.log("zksync chain fee for ETH", fee);

      tx.maxFeePerGas = fee.maxFeePerGas.toBigInt();
      tx.maxPriorityFeePerGas = fee.maxPriorityFeePerGas.toBigInt();
      tx.gas = fee.gasLimit.toBigInt();
      const hash = (await walletClient?.writeContract(tx)) as `0x${string}`;
      await sleep(1000); //wait to avoid waitForTransactionReceipt failed
      const res = await publicClient?.waitForTransactionReceipt({
        hash,
      });
      console.log(res);
    } catch (e) {
      console.error(e);
      return Promise.reject(e);
    } finally {
      setLoading(false);
    }
  };

  const sendMysteryMintTx = async (params: MysteryboxMintParams) => {
    if (!address) return;
    const isLynks = !params.tokenId;
    try {
      setLoading(true);
      const tx: WriteContractParameters = {
        address: (isLynks ? LYNKS_NFT_CONTRACT : BOOSTER_NFT_CONTRACT) as Hash,
        abi: isLynks ? NovaLynksNFT : NovaBoosterNFT,
        functionName: "safeMint",
        args: isLynks
          ? [address, params.nonce, params.expiry, params.signature]
          : [
              address,
              params.nonce,
              params.tokenId,
              1,
              params.expiry,
              params.signature,
            ],
      };
      const txData = encodeFunctionData({
        abi: tx.abi,
        functionName: tx.functionName,
        args: tx.args,
      });
      const fee = await zkSyncProvider.attachEstimateFee(
        IS_MAINNET ? "https://rpc.zklink.io" : "https://goerli.rpc.zklink.io"
      )({
        from: address as `0x${string}`,
        to: tx.address as `0x${string}`,
        value: "0x00",
        data: txData,
      });
      console.log("zksync chain fee for ETH", fee);

      tx.maxFeePerGas = fee.maxFeePerGas.toBigInt();
      tx.maxPriorityFeePerGas = fee.maxPriorityFeePerGas.toBigInt();
      tx.gas = fee.gasLimit.toBigInt();
      const hash = (await walletClient?.writeContract(tx)) as `0x${string}`;
      await sleep(1000); //wait to avoid waitForTransactionReceipt failed
      const res = await publicClient?.waitForTransactionReceipt({
        hash,
      });
      console.log(res);
    } catch (e) {
      console.error(e);
      return Promise.reject(e);
    } finally {
      setLoading(false);
    }
  };

  return {
    trademarkNFT,
    boosterNFT,
    lynksNFT,
    mysteryBoxNFT,
    publicClient,
    getLynksNFT,
    sendTrademarkMintTx,
    sendMysteryMintTx,
    loading,
  };
};

export default useNovaDrawNFT;
