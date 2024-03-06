import { useMemo } from "react";
import { useAccount, useBalance, useReadContracts } from "wagmi";
import Tokens from "@/constants/tokens";
import { useBridgeNetworkStore } from "./useNetwork";
import FromList from "@/constants/fromChainList";
import IERC20 from "@/constants/abi/IERC20.json";
import ethIcon from "@/assets/img/eth.svg";
export type Token = {
  address: string;
  networkKey: string;
  symbol: string;
  networkName: string;
  decimals: number;
  icon: string;
  balance?: number | bigint;
  formatedBalance?: number | string;
};
import { useQueryClient } from "@tanstack/react-query";
import { formatBalance } from "@/utils";
import { wagmiConfig } from "@/constants/networks";

const nativeToken = {
  address: "0x0000000000000000000000000000000000000000",
  //   networkKey: network!,
  symbol: "ETH",
  //   networkName: from!.chainName,
  decimals: 18,
  icon: ethIcon,
};
export const useTokenBalanceList = () => {
  //   const [tokenList, setTokenList] = useState<Token[]>([]);
  const { networkKey } = useBridgeNetworkStore();
  const { address: walletAddress } = useAccount();

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
      select: (data) => data.map((item) => item.result),
    },
  });

  console.log("data: ", selectedChainId, erc20Balances);

  const tokenList = useMemo(() => {
    const tokenList = [...tokens].map((token, index) => ({
      ...token,
      balance: erc20Balances?.[index],
      formatedBalance: formatBalance(erc20Balances?.[index], token.decimals),
    }));
    if (from?.isEthGasToken) {
      tokenList.unshift({
        ...nativeToken,
        balance: nativeTokenBalance?.value ?? 0n,
        formatedBalance: formatBalance(nativeTokenBalance?.value ?? 0n, 18),
      });
    }
    return tokenList;
  }, [nativeTokenBalance, erc20Balances, from, tokens]);

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
