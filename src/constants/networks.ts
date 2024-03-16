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
  mantaTestnet,
  arbitrum,
  mantle,
  zkSync,
  manta,
} from "@wagmi/core/chains";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { defineChain } from "viem";

const sourceId = 1; // mainnet

export const blast = /*#__PURE__*/ defineChain({
  id: 81457,
  name: "Blast",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["https://rpc.blast.io"] },
  },
  blockExplorers: {
    default: { name: "Blastscan", url: "https://blastscan.io" },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 212929,
    },
  },
  sourceId,
});

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
  mantle: {
    ...mantle,
    name: "Mantle Mainnet",
  },
  arbitrum: {
    ...arbitrum,
    name: "Arbitrum Mainnet",
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
  zkSync: {
    ...zkSync,
    name: "zkSync Mainnet",
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
  mantaGoerliTestnet: {
    ...mantaTestnet,
    name: "Manta Goerli Testnet",
  },
  manta: {
    ...manta,
    name: "Manta Mainnet",
  },
  blast: {
    ...blast,
    name: "Blast Mainnet",
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
  isEthGasToken: boolean;
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
    isEthGasToken: true,
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
    isEthGasToken: true,
    l1Network: l1Networks.linea,
  },
  {
    id: 810180,
    key: "zksync",
    name: "zkLink Nova",
    rpcUrl: "https://rpc.zklink.io",
    logoUrl: "/img/zksync.svg",
    blockExplorerUrl: "https://explorer.zklink.io",
    blockExplorerApi: "https://explorer-api.zklink.io",
    withdrawalFinalizerApi: "https://withdrawal-api.zklink.io",
    mainContract: "0xaFe8C7Cf33eD0fee179DFF20ae174C660883273A",
    erc20BridgeL1: "0xaB3DDB86072a35d74beD49AA0f9210098ebf2D08",
    erc20BridgeL2: "0x7187DB8AB8F65450a74dD40474bE778CF468C44a",
    l1Gateway: "0xeCD189e0f390826E137496a4e4a23ACf76c942Ab",
    isEthGasToken: true,
    l1Network: l1Networks.zkSync,
  },
  {
    id: 810180,
    key: "arbitrum",
    name: "zkLink Nova",
    rpcUrl: "https://rpc.zklink.io",
    logoUrl: "/img/arbitrum-arb-logo.svg",
    blockExplorerUrl: "https://explorer.zklink.io",
    blockExplorerApi: "https://explorer-api.zklink.io",
    withdrawalFinalizerApi: "https://withdrawal-api.zklink.io",
    mainContract: "0xFF73a1a1d27951A005eb23276dc99CB7F8d5420A",
    erc20BridgeL1: "0xfB0Ad0B3C2605A7CA33d6badd0C685E11b8F5585",
    erc20BridgeL2: "0x6B7551DBbaE2fb728cF851baee5c3A52DF6F60a4",
    l1Gateway: "0x273D59aed2d793167c162E64b9162154B07583C0",
    isEthGasToken: true,
    l1Network: l1Networks.arbitrum,
  },
  {
    id: 810180,
    key: "mantle",
    name: "zkLink Nova",
    rpcUrl: "https://rpc.zklink.io",
    logoUrl: "/img/mantle.svg",
    blockExplorerUrl: "https://explorer.zklink.io",
    blockExplorerApi: "https://explorer-api.zklink.io",
    withdrawalFinalizerApi: "https://withdrawal-api.zklink.io",
    mainContract: "0xD784d7128B46B60Ca7d8BdC17dCEC94917455657",
    erc20BridgeL1: "0x62351b47e060c61868Ab7E05920Cb42bD9A5f2B2",
    erc20BridgeL2: "0x321Ce902eDFC6466B224ce5D9A7Bc16858855272",
    l1Gateway: "0xdE1Ce751405Fe6D836349226EEdCDFFE1C3BE269",
    isEthGasToken: false,
    l1Network: l1Networks.mantle,
  },
  {
    id: 810180,
    key: "manta",
    name: "zkLink Nova",
    rpcUrl: "https://rpc.zklink.io",
    logoUrl: "/img/manta.jpg",
    blockExplorerUrl: "https://explorer.zklink.io",
    blockExplorerApi: "https://explorer-api.zklink.io",
    withdrawalFinalizerApi: "https://withdrawal-api.zklink.io",
    mainContract: "0xD784d7128B46B60Ca7d8BdC17dCEC94917455657",
    erc20BridgeL1: "0x44a65dc12865A1e5249b45b4868f32b0E37168FF",
    erc20BridgeL2: "0xa898E175CfDE9C6ABfCF5948eEfBA1B852eE5B09",
    l1Gateway: "0x649Dfa2c4d09D877419fA1eDC4005BfbEF7CD82D",
    isEthGasToken: true,
    l1Network: l1Networks.manta,
  },
  {
    id: 810180,
    key: "blast",
    name: "zkLink Nova",
    rpcUrl: "https://rpc.zklink.io",
    logoUrl: "/img/blast.svg",
    blockExplorerUrl: "https://explorer.zklink.io",
    blockExplorerApi: "https://explorer-api.zklink.io",
    withdrawalFinalizerApi: "https://withdrawal-api.zklink.io",
    mainContract: "0x29BA92Fe724beD5c5EBfd0099F2F64a6DC5078FD",
    erc20BridgeL1: "0x8Df0c2bA3916bF4789c50dEc5A79b2fc719F500b",
    erc20BridgeL2: "0x17887788E01A1192a26F636Cfcfc033c7Bb42348",
    l1Gateway: "0x41FaF46Ca4Dfd912B65B66D29BdD432782BB1158",
    isEthGasToken: true,
    l1Network: l1Networks.blast,
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
    isEthGasToken: true,
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
    isEthGasToken: true,
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
    isEthGasToken: false,
    //TODO
    l1Network: l1Networks.mantleGoerliTestnet,
  },
];

export const projectId = import.meta.env.VITE_PROJECT_ID;
if (!projectId) {
  throw new Error("VITE_PROJECT_ID is not set");
}
const createEraChain = (network: ZkSyncNetwork) => {
  return {
    id: network.id,
    name: network.name,
    network: network.key,
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: {
      default: { http: [network.rpcUrl] },
      public: { http: [network.rpcUrl] },
    },
    blockExplorers: { default: { url: network.blockExplorerUrl } },
  };
};

// Create wagmiConfig
const nodeType = import.meta.env.VITE_NODE_TYPE;

export const NetworkConfig =
  nodeType === "nexus-goerli" ? nexusGoerliNode : nexusNode;

export const wagmiConfig = defaultWagmiConfig({
  chains:
    nodeType === "nexus-goerli"
      ? [
          goerli,
          lineaTestnet,
          mantleTestnet,
          createEraChain(nexusGoerliNode[0]),
        ]
      : [
          mainnet,
          arbitrum,
          linea,
          zkSync,
          manta,
          mantle,
          createEraChain(nexusNode[0]),
          blast,
        ],
  projectId,
  metadata: {
    name: "zkLink Nova Portal",
    description:
      "zkLink Nova Portal - view balances, transfer and bridge tokens",
    url: "https://app.zklink.io/",
    icons: ["../public/img/icon.png"],
  },

  enableCoinbase: false,
});
