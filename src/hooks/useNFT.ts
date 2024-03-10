import { NOVA_NFT_CONTRACT, NOVA_CHAIN_ID } from "@/constants";
import { WalletClient } from "viem";
import { usePublicClient, useWalletClient, useAccount } from "wagmi";
import { readContract } from "@wagmi/core";
import { useCallback, useEffect, useState } from "react";
import { getMintSignature } from "@/api";
import NovaNFT from "@/constants/abi/NovaNFT.json";
import { BigNumber } from "ethers";
import { wagmiConfig } from "@/constants/networks";
export type NOVA_NFT_TYPE = "ISTP" | "ESFJ" | "INFJ" | "ENTP";
export type NOVA_NFT = {
  name: string;
  description: string;
  image: string;
};
const useNovaNFT = () => {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [nft, setNFT] = useState<NOVA_NFT>();
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);

  const getNFTBalance = useCallback(async (address: string) => {
    const balance = await readContract(wagmiConfig, {
      abi: NovaNFT.abi,
      address: NOVA_NFT_CONTRACT as `0x${string}`,
      functionName: "balanceOf",
      args: [address],
      chainId: NOVA_CHAIN_ID,
    });
    console.log("nft balance: ", balance);
    return balance;
  }, []);

  const getTokenIdByIndex = useCallback(async (address: string) => {
    const tokenId = await readContract(wagmiConfig, {
      abi: NovaNFT.abi,
      address: NOVA_NFT_CONTRACT as `0x${string}`,
      functionName: "tokenOfOwnerByIndex",
      args: [address, 0],
      chainId: NOVA_CHAIN_ID,
    });
    console.log("tokenId: ", tokenId);
    return tokenId as number;
  }, []);
  const getTokenURIByTokenId = useCallback(async (tokenId: number) => {
    const tokenURI = await readContract(wagmiConfig, {
      abi: NovaNFT.abi,
      address: NOVA_NFT_CONTRACT as `0x${string}`,
      functionName: "tokenURI",
      args: [tokenId],
      chainId: NOVA_CHAIN_ID,
    });
    console.log("tokenURI: ", tokenURI);
    return tokenURI as string;
  }, []);

  //ipfs://QmYY5RWPzGEJEjRYhGvBhycYhZxRMxCSkHNTxtVrrjUzQf/ISTP
  const fetchMetadataByURI = async (uri: string) => {
    if (uri.startsWith("ipfs://")) {
      uri = uri.substring(7);
    }
    const res = await fetch(`https://ipfs.io/ipfs/${uri}`);
    const json = await res.json();
    const result = { ...json };
    if (json.image && json.image.startsWith("ipfs://")) {
      const type = uri.substr(-4);
      result.image = `/img/${type}.svg`;
      //   result.image = `https://ipfs.io/ipfs/${json.image.substring(7)}`;
    }
    return result;
  };

  const getNFT = useCallback(
    async (address: string): Promise<NOVA_NFT | undefined> => {
      const balance = await getNFTBalance(address);
      if (BigNumber.from(balance).eq(0)) {
        return;
      }
      const tokenId = await getTokenIdByIndex(address);
      const tokenURI = await getTokenURIByTokenId(tokenId);
      const nft = await fetchMetadataByURI(tokenURI);
      setNFT(nft);
      return nft as NOVA_NFT;
    },
    [getNFTBalance, getTokenIdByIndex, getTokenURIByTokenId]
  );

  const sendMintTx = async (address: string, type: NOVA_NFT_TYPE) => {
    if (!address) return;
    try {
      setLoading(true);
      const response = await getMintSignature(address);
      const signature = response.result?.signature;
      if (!signature)
        return Promise.reject(
          new Error("You are not authorized, please contact us for help.")
        );
      const tx = {
        address: NOVA_NFT_CONTRACT,
        abi: NovaNFT.abi,
        functionName: "safeMint",
        args: [type, signature],
      };
      const hash = (await walletClient?.writeContract(tx)) as `0x${string}`;
      const res = await publicClient?.waitForTransactionReceipt({ hash });
      console.log(res);
      await getNFT(address);
    } catch (e) {
      console.log(e);
      return Promise.reject(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (address) {
      getNFT(address);
    }
  }, [address, getNFT]);

  return {
    getNFTBalance,
    getNFT,
    sendMintTx,
    nft,
    loading,
  };
};

export default useNovaNFT;