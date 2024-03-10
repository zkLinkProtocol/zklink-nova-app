import { NOVA_NFT_CONTRACT } from "@/constants";
import { WalletClient } from "viem";
import { usePublicClient, useWalletClient, useAccount } from "wagmi";
import { useState } from "react";

import NovaNFT from "@/constants/abi/NovaNFT.json";
const useNovaNFT = () => {
  const publicClient = usePublicClient();
  const { address } = useAccount();
  const [nft, set] = useState();

  const getNFTBalance = async (address: string) => {
    const balance = await publicClient?.readContract({
      abi: NovaNFT.abi,
      address: NOVA_NFT_CONTRACT as `0x${string}`,
      functionName: "balanceOf",
      args: [address],
    });
    console.log("nft balance: ", balance);
    return balance;
  };

  const getTokenIdByIndex = async (address: string) => {
    const tokenId = await publicClient?.readContract({
      abi: NovaNFT.abi,
      address: NOVA_NFT_CONTRACT as `0x${string}`,
      functionName: "tokenOfOwnerByIndex",
      args: [address, 0],
    });
    console.log("tokenId: ", tokenId);
    return tokenId as number;
  };
  const getTokenURIByTokenId = async (tokenId: number) => {
    const tokenURI = await publicClient?.readContract({
      abi: NovaNFT.abi,
      address: NOVA_NFT_CONTRACT as `0x${string}`,
      functionName: "tokenURI",
      args: [tokenId],
    });
    console.log("tokenURI: ", tokenURI);
    return tokenURI as string;
  };

  //ipfs://QmYY5RWPzGEJEjRYhGvBhycYhZxRMxCSkHNTxtVrrjUzQf/ISTP
  const fetchMetadataByURI = async (uri: string) => {
    if (uri.startsWith("ipfs://")) {
      uri = uri.substring(7);
    }
    const res = await fetch(`https://ipfs.io/ipfs/${uri}`);
    const json = await res.json();
    const result = { ...json };
    if (json.image && json.image.startsWith("ipfs://")) {
      result.image = json.image.substring(7);
    }
    return result;
  };

  const getNFT = async (address: string) => {
    const balance = await getNFTBalance(address);
    if (balance === 0) {
      return;
    }
    const tokenId = await getTokenIdByIndex(address);
    const tokenURI = await getTokenURIByTokenId(tokenId);
    const nft = await fetchMetadataByURI(tokenURI);
    return nft;
  };

  return {
    getNFTBalance,
    getNFT,
  };
};

export default useNovaNFT;
