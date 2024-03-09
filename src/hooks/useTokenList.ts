import { useMemo, useEffect, useState } from "react";
import { useAccount, useBalance, useReadContracts } from "wagmi";
import Tokens from "@/constants/tokens";
import { useBridgeNetworkStore } from "./useNetwork";
import FromList from "@/constants/fromChainList";
import IERC20 from "@/constants/abi/IERC20.json";
import ethIcon from "@/assets/img/eth.svg";
import mantleIcon from "@/assets/img/mantle.svg";
export type Token = {
  address: string;
  networkKey: string;
  symbol: string;
  networkName: string;
  decimals: number;
  icon: string;
  balance?: number | bigint;
  formatedBalance?: number | string;
  type: string;
  yieldType: string[];
  multiplier: number;
};
import { useQueryClient } from "@tanstack/react-query";
import { formatBalance } from "@/utils";
import { PRIMARY_CHAIN_KEY, wagmiConfig } from "@/constants/networks";
import { getSupportedTokens } from "@/api";
const nativeToken = {
  address: "0x0000000000000000000000000000000000000000",
  symbol: "ETH",
  decimals: 18,
  icon: ethIcon,
};
const nodeType = import.meta.env.VITE_NODE_TYPE;
const isSameNetwork = (networkKey: string, chain: string) => {
  if (
    nodeType === "nexus-goerli" &&
    networkKey === "goerli" &&
    chain === "Ethereum"
  ) {
    return true;
  } else if (networkKey === PRIMARY_CHAIN_KEY && chain === "Linear") {
    return true;
  } else if (networkKey.toLowerCase() === chain.toLowerCase()) {
    return true;
  } else {
    return false;
  }
};
export const useTokenBalanceList = () => {
  const [tokenSource, setTokenSource] = useState<Token[]>([]);
  const { networkKey } = useBridgeNetworkStore();
  const { address: walletAddress } = useAccount();

  useEffect(() => {
    (async () => {
      if (!networkKey) return;
      const supportedTokens = await getSupportedTokens();
      console.log("supportedTokens: ", supportedTokens);
      const tokens = [];
      for (const token of supportedTokens) {
        const index = token.address.find((item) =>
          isSameNetwork(networkKey, item.chain)
        );
        if(index > -1) {
          tokens.push({
            
          })
        }
      }
    })();
  }, [networkKey]);

  const queryClient = useQueryClient();

  const from = useMemo(() => {
    return FromList.find(
      (item) => item.networkKey === (networkKey || FromList[0].networkKey)
    );
  }, [networkKey]);

  const selectedChainId = useMemo(() => {
    return FromList.find(
      (item) => item.networkKey === (networkKey || FromList[0].networkKey)
    )?.chainId;
  }, [networkKey]);

  const tokens = useMemo(() => {
    return Tokens.filter(
      (item) => item.networkKey === (networkKey || FromList[0].networkKey)
    );
  }, [networkKey]);
  const { data: nativeTokenBalance } = useBalance({
    address: walletAddress as `0x${string}`,
    chainId: selectedChainId,
    token: undefined,
  });
  console.log("nativeBalance: ", selectedChainId, nativeTokenBalance);

  const erc20Contracts = useMemo(() => {
    return tokens.map(({ address }) => ({
      abi: IERC20.abi,
      functionName: "balanceOf",
      address: address as `0x${string}`,
      args: [walletAddress as `0x${string}`],
      chainId: selectedChainId,
      // chainId
    }));
  }, [tokens, walletAddress, selectedChainId]);

  const { data: erc20Balances } = useReadContracts({
    config: wagmiConfig,
    contracts: erc20Contracts,
    query: {
      queryClient,
      // select: (data) => data.map((item) => item.result),
    },
  });

  console.log("data: ", selectedChainId, erc20Balances);

  const tokenList = useMemo(() => {
    const erc20BalancesValue = erc20Balances?.map(
      (item) => item.result as bigint
    );
    const tokenList = [...tokens].map((token, index) => ({
      ...token,
      balance: erc20BalancesValue?.[index],
      formatedBalance: formatBalance(
        erc20BalancesValue?.[index] ?? 0n,
        token.decimals
      ),
    }));
    const native = {
      ...nativeToken,
      networkKey: networkKey!,
      networkName: from!.chainName,
      balance: nativeTokenBalance?.value ?? 0n,
      formatedBalance: formatBalance(nativeTokenBalance?.value ?? 0n, 18),
    };
    if (networkKey === "mantle") {
      //for mantle
      native.symbol = "MNT";
      native.icon = mantleIcon;
    }
    tokenList.unshift(native);
    return tokenList;
  }, [nativeTokenBalance, erc20Balances, from, tokens, networkKey]);

  const refreshTokenBalanceList = () => {
    queryClient.invalidateQueries();
  };

  return {
    loading: queryClient.isFetching,
    tokenList,
    refreshTokenBalanceList,
  };
};

export default useTokenBalanceList;
