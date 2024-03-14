import { NetworkConfig, PRIMARY_CHAIN_KEY } from "@/constants/networks";
export const getNetworkKeyByMainContract = (address: string) => {
  const network = NetworkConfig.find((item) => item.mainContract === address);
  if (!network) {
    throw new Error("no networkKey for main contract " + address);
  }
  return network.key;
};

export const getNetworkKeyByL1Erc20Bridge = (address: string) => {
  const network = NetworkConfig.find((item) => item.erc20BridgeL1 === address);
  if (!network) {
    throw new Error("no networkKey for erc20BridgeL1 contract " + address);
  }
  return network.key;
};

export const getPrimaryChainMainContract = () => {
  return NetworkConfig.find((item) => item.key === PRIMARY_CHAIN_KEY)
    ?.mainContract;
};
