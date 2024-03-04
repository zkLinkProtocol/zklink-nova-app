import { Address } from "viem";
import type { Token } from "@/types";
import type { Chain } from "@wagmi/core/chains";
import {
  goerli,
  mainnet,
  sepolia,
  arbitrumSepolia,
  scrollSepolia,
  zkSyncSepoliaTestnet,
  lineaTestnet,
  linea,
  mantleTestnet,
} from "@wagmi/core/chains";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

export const l1Networks = {
  mainnet: {
    ...mainnet,
    name: "Ethereum",
    network: "mainnet",
  },
  goerli: {
    ...goerli,
    name: "Ethereum Goerli Testnet",
  },
  sepolia: {
    ...sepolia,
    name: "Ethereum Sepolia Testnet",
  },
  linea: {
    ...linea,
    name: "Linea Mainnet",
  },
  arbitrumSepolia: {
    ...arbitrumSepolia,
    name: "Arbitrum Sepolia Testnet",
    blockExplorers: {
      default: {
        name: "Arbiscan",
        url: "https://sepolia.arbiscan.io",
      },
    },
  },
  scrollSepolia: {
    ...scrollSepolia,
    name: "Scroll Sepolia Testnet",
  },
  zkSyncSepoliaTestnet: {
    ...zkSyncSepoliaTestnet,
    name: "zkSync Sepolia Testnet",
  },
  lineaGoerliTestnet: {
    ...lineaTestnet,
    name: "Linea Goerli Testnet",
  },
  mantleGoerliTestnet: {
    ...mantleTestnet,
    name: "Mantle Goerli Testnet",
  },
} as const;
export type L1Network = Chain;

export const PRIMARY_CHAIN_KEY = "primary";
export type ZkSyncNetwork = {
  id: number;
  key: string;
  name: string;
  rpcUrl: string;
  hidden?: boolean; // If set to true, the network will not be shown in the network selector
  l1Network?: L1Network;
  blockExplorerUrl?: string;
  blockExplorerApi?: string;
  withdrawalFinalizerApi?: string;
  logoUrl?: string;
  displaySettings?: {
    showPartnerLinks?: boolean;
  };
  mainContract?: Address;
  erc20BridgeL1?: Address;
  erc20BridgeL2?: Address;
  l1Gateway?: Address;
  getTokens?: () => Token[] | Promise<Token[]>; // If blockExplorerApi is specified, tokens will be fetched from there. Otherwise, this function will be used.
};
export const nexusNode: ZkSyncNetwork[] = [
  {
    id: 810180,
    key: "ethereum",
    name: "zkLink Nova",
    rpcUrl: "https://rpc.zklink.io",
    logoUrl: "/img/ethereum.svg",
    blockExplorerUrl: "https://explorer.zklink.io",
    blockExplorerApi: "https://explorer-api.zklink.io",
    withdrawalFinalizerApi: "https://withdrawal-api.zklink.io",
    mainContract: "0x5fD9F73286b7E8683Bab45019C94553b93e015Cf",
    erc20BridgeL1: "0xAd16eDCF7DEB7e90096A259c81269d811544B6B6",
    erc20BridgeL2: "0x36CaABbAbfB9C09B722d9C3697C3Cb4A93650ea7",
    l1Gateway: "0x83Bc7394738A7A084081aF22EEC0051908c0055c",
    //TODO
    l1Network: l1Networks.mainnet,
  },
  {
    id: 810180,
    key: PRIMARY_CHAIN_KEY, //"primary"
    name: "zkLink Nova",
    rpcUrl: "https://rpc.zklink.io",
    logoUrl: "/img/linea.svg",
    blockExplorerUrl: "https://explorer.zklink.io",
    blockExplorerApi: "https://explorer-api.zklink.io",
    withdrawalFinalizerApi: "https://withdrawal-api.zklink.io",
    mainContract: "0x5Cb18b6e4e6F3b46Ce646b0f4704D53724C5Df05",
    erc20BridgeL1: "0x62cE247f34dc316f93D3830e4Bf10959FCe630f8",
    erc20BridgeL2: "0x01c3f51294494e350AD69B999Db6B382b3B510b9",
    //TODO
    l1Network: l1Networks.linea,
  },
];

export const nexusGoerliNode: ZkSyncNetwork[] = [
  {
    id: 810182,
    key: "goerli",
    name: "zkLink Nova Testnet",
    rpcUrl: "https://goerli.rpc.zklink.io",
    logoUrl: "/img/ethereum.svg",
    blockExplorerUrl: "https://goerli.explorer.zklink.io",
    blockExplorerApi: "https://goerli.explorer-api.zklink.io",
    withdrawalFinalizerApi: "https://goerli.withdrawal-api.zklink.io",
    mainContract: "0x80e41d1801E5b7F9a9f4e55Fd37bF2F3e797aC64",
    erc20BridgeL1: "0xa403d1A5B552BC17132aAD864F90472794678712",
    erc20BridgeL2: "0x369181F0724D485c2F50E918b1beCEc078C7077C",
    l1Gateway: "0x00546F01728048Af108223C41C4FaD7b124a476f",
    //TODO
    l1Network: l1Networks.goerli,
  },
  {
    id: 810182,
    key: PRIMARY_CHAIN_KEY, //"primary"
    name: "zkLink Nova Testnet",
    rpcUrl: "https://goerli.rpc.zklink.io",
    logoUrl: "/img/linea.svg",
    blockExplorerUrl: "https://goerli.explorer.zklink.io",
    blockExplorerApi: "https://goerli.explorer-api.zklink.io",
    withdrawalFinalizerApi: "https://goerli.withdrawal-api.zklink.io",
    mainContract: "0xF51bdDCC3401572B193140B5326a9dEF03c56198",
    erc20BridgeL1: "0xF58Da74B65544C86F5E16A0c898Ff20718C1cb7d",
    erc20BridgeL2: "0x7cB4A4fCF09dfF32f7f6557b966a942e803C7FAD",
    //TODO
    l1Network: l1Networks.lineaGoerliTestnet,
  },
  {
    id: 810182,
    key: "mantle",
    name: "zkLink Nova Testnet",
    rpcUrl: "https://goerli.rpc.zklink.io",
    logoUrl: "/img/ethereum.svg",
    blockExplorerUrl: "https://goerli.explorer.zklink.io",
    blockExplorerApi: "https://goerli.explorer-api.zklink.io",
    withdrawalFinalizerApi: "https://goerli.withdrawal-api.zklink.io",
    mainContract: "0x8fC6d9dE787C4299684B7b307feF44AB3D317e20",
    erc20BridgeL1: "0x0857FDf217E54954c0f4A77B62c04b246ef504CD",
    erc20BridgeL2: "0xD1b7DD1B30b218901d035C951852ae0D97834b68",
    l1Gateway: "0x7bf83D15C8f5a491B36506652A26d4bA0b6cC289",
    //TODO
    l1Network: l1Networks.mantleGoerliTestnet,
  },
];

export const projectId = import.meta.env.VITE_PROJECT_ID;
if (!projectId) {
  throw new Error("VITE_PROJECT_ID is not set");
}
export const wagmiConfig = defaultWagmiConfig({
  chains: [goerli, mainnet, lineaTestnet],
  projectId,
  metadata: {
    name: "Web3Modal React Example",
    description: "Web3Modal React Example",
    url: "",
    icons: [],
  },
});
