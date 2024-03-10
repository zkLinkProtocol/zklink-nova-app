import { NOVA_NFT_CONTRACT } from "@/constants";
import { WalletClient } from "viem";
import { usePublicClient, useWalletClient, useAccount } from "wagmi";
import { useState } from "react";
import NovaNFT from '@/constants/abi/NovaNFT.json'
const useNovaNFT = () => {
  const publicClient = usePublicClient();
  const { address } = useAccount();
  const [nft, set] = useState();

  const getNFTBalance = async(address: string)=> {
    const balance = await publicClient?.readContract({
        abi: NovaNFT.abi,
        address: NOVA_NFT_CONTRACT as `0x${string}`,
        functionName: 'balanceOf',
        args: [address]
    })
    console.log('nft balance: ', balance)
    return balance;
  }

  const getNFT = async (address: string) => {
    const balance = await getNFTBalance()
  }

  return {
    getNFTBalance
  }
};

export default useNovaNFT;
