import { Address, createClient } from "viem";

import type { Token } from "@/types";
import type { Chain } from "@wagmi/core/chains";
import {
  mainnet,
  sepolia,
  arbitrumSepolia,
  scrollSepolia,
  zkSyncSepoliaTestnet,
  lineaSepolia,
  linea,
  mantleTestnet,
  mantleSepoliaTestnet,
  mantaTestnet,
  arbitrum,
  mantle,
  zkSync,
  manta,
  optimism,
  base,
  scroll,
} from "viem/chains";

import { defineChain } from "viem";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { createConfig, http } from "@wagmi/core";
import { walletConnect, safe } from "@wagmi/connectors";
import { BinanceWallet } from "./wallet/binanceWallet";
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
  // goerli: {
  //   ...goerli,
  //   name: "Ethereum Goerli Testnet",
  // },
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
  lineaSepoliaTestnet: {
    ...lineaSepolia,
    name: "Linea Sepolia Testnet",
  },
  mantleGoerliTestnet: {
    ...mantleTestnet,
    name: "Mantle Sepolia Testnet",
  },
  mantaGoerliTestnet: {
    ...mantaTestnet,
    name: "Manta Goerli Testnet",
  },
  mantaSepoliaTestnet: {
    ...mantleSepoliaTestnet,
    name: "Manta Sepolia Testnet",
  },
  manta: {
    ...manta,
    name: "Manta Mainnet",
  },
  blast: {
    ...blast,
    name: "Blast Mainnet",
  },
  optimism: {
    ...optimism,
    name: "Optimism Mainnet",
  },
  base: {
    ...base,
    name: "Base Mainnet",
  },
  scroll: {
    ...scroll,
    name: "Scroll Mainnet",
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
  {
    id: 810180,
    key: "optimism",
    name: "zkLink Nova",
    rpcUrl: "https://rpc.zklink.io",
    logoUrl: "/img/optimism.svg",
    blockExplorerUrl: "https://explorer.zklink.io",
    blockExplorerApi: "https://explorer-api.zklink.io",
    withdrawalFinalizerApi: "https://withdrawal-api.zklink.io",
    mainContract: "0x46C8D02E93d5a03899dFa7Cf8A40A07589A3fA1b",
    erc20BridgeL1: "0x5Bd51296423A9079b931414C1De65e7057326EaA",
    erc20BridgeL2: "0x6aAdaA7Bf9F5283cAF3eb2E40573D1A4d02C8B15",
    l1Gateway: "0x668e8F67adB8219e1816C2E5bBEa055A78AF3026",
    isEthGasToken: true,
    l1Network: l1Networks.optimism,
  },
  {
    id: 810180,
    key: "base",
    name: "zkLink Nova",
    rpcUrl: "https://rpc.zklink.io",
    logoUrl: "/img/base.svg",
    blockExplorerUrl: "https://explorer.zklink.io",
    blockExplorerApi: "https://explorer-api.zklink.io",
    withdrawalFinalizerApi: "https://withdrawal-api.zklink.io",
    mainContract: "0xE473ce141b1416Fe526eb63Cf7433b7B8d7264Dd",
    erc20BridgeL1: "0x80d12A78EfE7604F00ed07aB2f16F643301674D5",
    erc20BridgeL2: "0xa03248B029b4e348F156f4b1d93CB433a4e1361e",
    l1Gateway: "0x4eEA93966AA5cd658225E0D43b665A5a491d2b7E",
    isEthGasToken: true,
    l1Network: l1Networks.base,
  },
  {
    id: 810180,
    key: "scroll",
    name: "zkLink Nova",
    rpcUrl: "https://rpc.zklink.io",
    logoUrl: "/img/scroll.svg",
    blockExplorerUrl: "https://explorer.zklink.io",
    blockExplorerApi: "https://explorer-api.zklink.io",
    withdrawalFinalizerApi: "https://withdrawal-api.zklink.io",
    mainContract: "0x119B9459D9119D07c23aD06778AeaBec804Fd1a2",
    erc20BridgeL1: "0x3C7c0ebFCD5786ef48df5ed127cdDEb806db976c",
    erc20BridgeL2: "0xC97c5E43c14D4F524347795410C299db1FA331b3",
    l1Gateway: "0x986c905087a663db3C81ad319b94c1E9dd388e92",
    isEthGasToken: true,
    l1Network: l1Networks.scroll,
  },
];

export const nexusGoerliNode: ZkSyncNetwork[] = [
  {
    id: 810181,
    key: "sepolia",
    name: "zkLink Nova Testnet",
    rpcUrl: "https://sepolia.rpc.zklink.io",
    logoUrl: "/img/ethereum.svg",
    blockExplorerUrl: "https://sepolia.explorer.zklink.io",
    blockExplorerApi: "https://sepolia.explorer-api.zklink.io",
    withdrawalFinalizerApi: "https://sepolia.withdrawal-api.zklink.io",
    mainContract: "0x9719cD314BBf84B18aAEDEF56DF88E2267aA01e3",
    erc20BridgeL1: "0x63e059BDEDeA829c22EfA31CbaDb9bea5E86c3Cd",
    erc20BridgeL2: "0xcc43208B28B1eC25F000EfC0D2c2aF044715F888",
    l1Gateway: "0xc6EbbD78E8f81626Bc62570f3C5949221F87b3Ee",
    isEthGasToken: true,
    l1Network: l1Networks.sepolia,
  },
  {
    id: 810181,
    key: PRIMARY_CHAIN_KEY, //"primary"
    name: "zkLink Nova Testnet",
    rpcUrl: "https://sepolia.rpc.zklink.io",
    logoUrl: "/img/linea.svg",
    blockExplorerUrl: "https://sepolia.explorer.zklink.io",
    blockExplorerApi: "https://sepolia.explorer-api.zklink.io",
    withdrawalFinalizerApi: "https://sepolia.withdrawal-api.zklink.io",
    mainContract: "0x16393A77e1d5C2D285BDad9079afC5942f255407",
    erc20BridgeL1: "0xea05Fad671D93aF9472D747866019991DF183F0f",
    erc20BridgeL2: "0x6336D1DfE362a84933e526588A0fa20dd87736aE",
    isEthGasToken: true,
    l1Network: l1Networks.lineaSepoliaTestnet,
  },
  {
    id: 810181,
    key: "zksync",
    name: "zkLink Nova Testnet",
    rpcUrl: "https://sepolia.rpc.zklink.io",
    logoUrl: "/img/zksync.svg",
    blockExplorerUrl: "https://sepolia.explorer.zklink.io",
    blockExplorerApi: "https://sepolia.explorer-api.zklink.io",
    withdrawalFinalizerApi: "https://sepolia.withdrawal-api.zklink.io",
    mainContract: "0x02627EFACfc2B000E77132fE9346C543eB980bAb",
    erc20BridgeL1: "0xBf145DfdE964213246A4fcB8003621E8b0F11ffc",
    erc20BridgeL2: "0xEbEAf62E4bCb4FdeC35100838c86c84B8134ADE0",
    l1Gateway: "0x67ba43eD3860D155D16f82D12cA93A7B2e77bF2F",
    isEthGasToken: true,
    l1Network: l1Networks.zkSyncSepoliaTestnet,
  },
  {
    id: 810181,
    key: "arbitrum",
    name: "zkLink Nova Testnet",
    rpcUrl: "https://sepolia.rpc.zklink.io",
    logoUrl: "/img/arbitrum-arb-logo.svg",
    blockExplorerUrl: "https://sepolia.explorer.zklink.io",
    blockExplorerApi: "https://sepolia.explorer-api.zklink.io",
    withdrawalFinalizerApi: "https://sepolia.withdrawal-api.zklink.io",
    mainContract: "0xaE1875112Ae010A9fe755418B206AfB33Ee0b1fA",
    erc20BridgeL1: "0xFC31fF38e24901052b813DcEBEF5A9A10EaF25Ec",
    erc20BridgeL2: "0x7e1B152f25D2ff0771026067B5c8B5A1C8457478",
    l1Gateway: "0xd75F08D0E513a072799C510d04D9AddC3a28Bd9A",
    isEthGasToken: true,
    l1Network: l1Networks.arbitrumSepolia,
  },
  {
    id: 810181,
    key: "optimism",
    name: "zkLink Nova Testnet",
    rpcUrl: "https://sepolia.rpc.zklink.io",
    logoUrl: "/img/optimism.svg",
    blockExplorerUrl: "https://sepolia.explorer.zklink.io",
    blockExplorerApi: "https://sepolia.explorer-api.zklink.io",
    withdrawalFinalizerApi: "https://sepolia.withdrawal-api.zklink.io",
    mainContract: "0xbaC8EF345C684B0871dF390f44273160Ba3E6bc1",
    erc20BridgeL1: "0x70194e2400eb89fA22E3bd0DaFa097CA09DAE76C",
    erc20BridgeL2: "0x07476D10A8B3c614DC92a698cCeC34Aa9B844B92",
    l1Gateway: "0x2f24331ddFB2D582079C200d1c233F168901a4e1",
    isEthGasToken: true,
    l1Network: l1Networks.optimismSepoliaTestnet,
  },
  {
    id: 810181,
    key: "base",
    name: "zkLink Nova Testnet",
    rpcUrl: "https://sepolia.rpc.zklink.io",
    logoUrl: "/img/base.svg",
    blockExplorerUrl: "https://sepolia.explorer.zklink.io",
    blockExplorerApi: "https://sepolia.explorer-api.zklink.io",
    withdrawalFinalizerApi: "https://sepolia.withdrawal-api.zklink.io",
    mainContract: "0x8c4b80A5D5374Ff2Dc07310EF9Fdbc44e487b6C2",
    erc20BridgeL1: "0xeA6232604C847d14638a30c1D261AF6C321AAB05",
    erc20BridgeL2: "0x7c3c5C8528D55Af0C641846fF4756200DEFDC513",
    l1Gateway: "0x4E2d5bAaF470028fE48a23bd5b680f4EC7A06f85",
    isEthGasToken: true,
    l1Network: l1Networks.baseSepoliaTestnet,
  },
  {
    id: 810181,
    key: "manta",
    name: "zkLink Nova Testnet",
    rpcUrl: "https://sepolia.rpc.zklink.io",
    logoUrl: "/img/manta.jpg",
    blockExplorerUrl: "https://sepolia.explorer.zklink.io",
    blockExplorerApi: "https://sepolia.explorer-api.zklink.io",
    withdrawalFinalizerApi: "https://sepolia.withdrawal-api.zklink.io",
    mainContract: "0xEe5aFbd53D661968d13315f6960BBb103C2a1eCc",
    erc20BridgeL1: "0x4C58CbF4e9594898e2cC66FdA3F435Cd3622Fe9f",
    erc20BridgeL2: "0x1F282e46d75622C5B26921094b4ebF7D58D83CE2",
    l1Gateway: "0xC8a31aA097c8D1dCF588C425415E4e5A0E250e67",
    isEthGasToken: true,
    l1Network: l1Networks.mantaSepoliaTestnet,
  },
  {
    id: 810181,
    key: "blast",
    name: "zkLink Nova Testnet",
    rpcUrl: "https://sepolia.rpc.zklink.io",
    logoUrl: "/img/blast.svg",
    blockExplorerUrl: "https://sepolia.explorer.zklink.io",
    blockExplorerApi: "https://sepolia.explorer-api.zklink.io",
    withdrawalFinalizerApi: "https://sepolia.withdrawal-api.zklink.io",
    mainContract: "0x27CBbE82447a0C188eBD7Bc5fd706d140c7B0642",
    erc20BridgeL1: "0xD74c6452Ec4c73E4E2050C6B3f4e675B96dFFC15",
    erc20BridgeL2: "0x4E5622E4A41985C29028d92e1Cc2EdF02012c82E",
    l1Gateway: "0x83d3f5Db3eea3dD7a30aAF71A32D244386d00C53",
    isEthGasToken: true,
    l1Network: l1Networks.blastSepoliaTestnet,
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
    blockExplorers: {
      default: { url: network.blockExplorerUrl, name: "zklink nova explorer" },
    },
    contracts: {
      multicall3: {
        address:
          nodeType === "nexus-goerli"
            ? "0x09d4800d1a84A13eadaf951CB0021D27211e0184"
            : "0x825267E0fA5CAe92F98540828a54198dcB3Eaeb5",
      },
    },
  };
};

// Create wagmiConfig
const nodeType = import.meta.env.VITE_NODE_TYPE;

export const NetworkConfig =
  nodeType === "nexus-goerli" ? nexusGoerliNode : nexusNode;
export const chains: readonly [Chain, ...Chain[]] =
  nodeType === "nexus-goerli"
    ? [
        sepolia,
        lineaSepolia,
        mantleSepoliaTestnet,
        createEraChain(nexusGoerliNode[0]) as Chain,
      ]
    : [
        mainnet,
        arbitrum,
        linea,
        zkSync,
        manta,
        mantle,
        createEraChain(nexusNode[0]) as Chain,
        blast,
        optimism,
        base,
        scroll,
      ];
// export const wagmiConfig = defaultWagmiConfig({
//   chains: chains,
//   projectId,
//   metadata: {
//     name: "zkLink Nova Portal",
//     description:
//       "zkLink Nova Portal - view balances, transfer and bridge tokens",
//     url: "https://app.zklink.io/",
//     icons: ["../public/img/icon.png"],
//   },

//   enableCoinbase: false,
//   enableWalletConnect: false,
//   enableEIP6963: true,
// });
const metadata = {
  name: "zkLink Nova App",
  description:
    "zkLink Nova App - Aggregated Layer 3 zkEVM network Aggregation Parade",
  url: "https://app.zklink.io",
  icons: ["../../public/img/favicon.png"],
};
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { gateWallet } from "./wallet/gateWallet";
import {
  rainbowWallet,
  walletConnectWallet,
  okxWallet,
  rabbyWallet,
  metaMaskWallet,
  injectedWallet,
  safeWallet,
} from "@rainbow-me/rainbowkit/wallets";
okxWallet({
  projectId,
  walletConnectParameters: {
    metadata,
  },
});
BinanceWallet({
  projectId,
  walletConnectParameters: {
    metadata,
  },
});
gateWallet({
  projectId,
  walletConnectParameters: {
    metadata,
  },
});
rabbyWallet();
injectedWallet();
metaMaskWallet({
  projectId,
});
walletConnectWallet({
  projectId,
  options: {
    metadata,
  },
});
safeWallet();
const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [
        injectedWallet,
        // rainbowWallet,
        gateWallet, // hide gate for now
        okxWallet,
        BinanceWallet,
        // rabbyWallet,
        metaMaskWallet,
        walletConnectWallet,
        safeWallet,
      ],
    },
    // {
    //   groupName: 'Others',
    //   wallets: [safeWallet],
    // },
  ],
  {
    appName: "zklink Nova App",
    projectId: projectId,
  }
);

export const config = getDefaultConfig({
  appName: "zklink Nova App",
  projectId: projectId,
  chains: chains,
  ssr: false, // If your dApp uses server side rendering (SSR)
});

export const wagmiDefaultConfig = createConfig({
  chains: chains,
  connectors: [
    ...connectors,
    walletConnect({
      projectId,
      metadata,
      showQrModal: true,
    }),
    safe({
      allowedDomains: [
        /app.safe.global$/,
        /safe.zklink.io$/,
        /safe.manta.network$/,
        /multisig.mantle.xyz$/,
        /safe.linea.build$/,
        /blast-safe.io$/,
      ],
      debug: true,
    }),
  ],
  multiInjectedProviderDiscovery: true,
  client: ({ chain }) => {
    return createClient({ chain, transport: http() });
  },
});
