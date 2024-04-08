import { IS_MAINNET, NOVA_CHAIN_ID } from "./../constants/index";
import MergeTokenPortal from "@/constants/abi/MergeTokenPortal.json";
import { useCallback } from "react";
import { config } from "@/constants/networks";
import { usePublicClient } from "wagmi";

export type SourceTokenInfo = {
  isSupported: boolean;
  isLocked: boolean;
  mergeToken: string;
  balance: bigint;
  depositLimit: bigint;
};
const MERGE_TOKEN_PORTAL_ADDRESSES = IS_MAINNET
  ? "0x83FD59FD58C6A5E6eA449e5400D02803875e1104"
  : "0x83FD59FD58C6A5E6eA449e5400D02803875e1104";

export const useMergeToken = () => {
  const publicClient = usePublicClient({ config, chainId: NOVA_CHAIN_ID });

  const fetchMergeTokenInfo = useCallback(
    async (tokenL2Address: string) => {
      const info = (await publicClient!.readContract({
        address: MERGE_TOKEN_PORTAL_ADDRESSES,
        abi: MergeTokenPortal,
        functionName: "getSourceTokenInfos",
        args: [tokenL2Address],
      })) as SourceTokenInfo;
      return info;
    },
    [publicClient]
  );

  return {
    fetchMergeTokenInfo,
  };
};
