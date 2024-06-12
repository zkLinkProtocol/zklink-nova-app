import {
  PRIMARY_CHAIN_KEY,
  nexusGoerliNode,
  nexusNode,
} from "@/constants/networks";
import lineaIcon from "../assets/img/linea.svg";
import ethereumIcon from "../assets/img/ethereum.svg";
import mantleIcon from "../assets/img/mantle.svg";
import mantaIcon from "../assets/img/manta.jpg";
import arbIcon from "../assets/img/arbitrum.svg";
import zkscyncIcon from "../assets/img/zksync.svg";
import blastIcon from "../assets/img/blast.svg";
import optimismIcon from "../assets/img/optimism.svg";
import baseIcon from "../assets/img/base.svg";
import scrollIcon from "../assets/img/scroll.svg";
import {
  sepolia,
  goerli,
  lineaSepolia,
  lineaTestnet,
  mantleTestnet,
  mantleSepoliaTestnet,
  mainnet,
  linea,
  zkSync,
  manta,
  mantle,
  arbitrum,
  optimism,
  base,
  scroll,
} from "@wagmi/core/chains";
import { blast } from "./networks";
const nodeType = import.meta.env.VITE_NODE_TYPE;

export const NOVA_NETWORK = {
  label: nexusNode[0].name,
  icon: "/img/nova.png",
  chainId: nexusNode[0].id,
  networkKey: "nova",
  isEthGasToken: true,
  chainName: nexusNode[0].name,
  explorerUrl: nexusNode[0].blockExplorerUrl,
  rpcUrl: nexusNode[0].rpcUrl,
};

export const NOVA_GOERLI_NETWORK = {
  label: nexusGoerliNode[0].name,
  icon: "/img/nova.png",
  chainId: nexusGoerliNode[0].id,
  networkKey: "nova",
  isEthGasToken: true,
  chainName: nexusGoerliNode[0].name,
  explorerUrl: nexusGoerliNode[0].blockExplorerUrl,
  rpcUrl: nexusGoerliNode[0].rpcUrl,
};

const FromListMainnet = [
  {
    label: "Ethereum",
    icon: ethereumIcon,
    chainId: mainnet.id,
    networkKey: "ethereum",
    isEthGasToken: true,
    chainName: "Ethereum",
    explorerUrl: mainnet.blockExplorers.default.url,
    rpcUrl: mainnet.rpcUrls.default.http[0],
  },
  {
    label: "Linea",
    icon: lineaIcon,
    chainId: linea.id,
    networkKey: PRIMARY_CHAIN_KEY,
    isEthGasToken: true,
    chainName: "Linea",
    explorerUrl: linea.blockExplorers.default.url,
    rpcUrl: linea.rpcUrls.default.http[0],
  },
  {
    label: "Arbitrum One",
    icon: arbIcon,
    chainId: arbitrum.id,
    networkKey: "arbitrum",
    isEthGasToken: true,
    chainName: "Arbitrum",
    explorerUrl: arbitrum.blockExplorers.default.url,
    rpcUrl: arbitrum.rpcUrls.default.http[0],
  },
  {
    label: "zkSync Era",
    icon: zkscyncIcon,
    chainId: zkSync.id,
    networkKey: "zksync",
    isEthGasToken: true,
    chainName: "ZkSync",
    explorerUrl: zkSync.blockExplorers.default.url,
    rpcUrl: zkSync.rpcUrls.default.http[0],
  },
  {
    label: "Manta Pacific",
    icon: mantaIcon,
    chainId: manta.id,
    networkKey: "manta",
    isEthGasToken: true,
    chainName: "Manta",
    explorerUrl: manta.blockExplorers.default.url,
    rpcUrl: manta.rpcUrls.default.http[0],
  },
  {
    label: "Mantle",
    icon: mantleIcon,
    chainId: mantle.id,
    networkKey: "mantle",
    isEthGasToken: true,
    chainName: "Mantle",
    explorerUrl: mantle.blockExplorers.default.url,
    rpcUrl: mantle.rpcUrls.default.http[0],
  },
  // {
  //   label: "Blast",
  //   icon: blastIcon,
  //   chainId: 81457,
  //   networkKey: "blast",
  //   isEthGasToken: true,
  //   chainName: "Blast",
  //   explorerUrl: blast.blockExplorers.default.url ?? "https://blastscan.io",
  //   rpcUrl: blast.rpcUrls.default.http[0] ?? "https://rpc.blast.io",
  // },
  {
    label: "Optimism",
    icon: optimismIcon,
    chainId: optimism.id,
    networkKey: "optimism",
    isEthGasToken: true,
    chainName: "Optimism",
    explorerUrl: optimism.blockExplorers.default.url,
    rpcUrl: optimism.rpcUrls.default.http[0],
  },
  {
    label: "Base",
    icon: baseIcon,
    chainId: base.id,
    networkKey: "base",
    isEthGasToken: true,
    chainName: "Base",
    explorerUrl: base.blockExplorers.default.url,
    rpcUrl: base.rpcUrls.default.http[0],
  },
  {
    label: "Scroll",
    icon: scrollIcon,
    chainId: scroll.id,
    networkKey: "scroll",
    isEthGasToken: true,
    chainName: "Scroll",
    explorerUrl: scroll.blockExplorers.default.url,
    rpcUrl: scroll.rpcUrls.default.http[0],
  },
];

const FromListGoerli = [
  {
    label: "Ethereum Sepolia Testnet",
    icon: ethereumIcon,
    chainId: sepolia.id,
    networkKey: "sepolia",
    isEthGasToken: true,
    chainName: "Sepolia",
    explorerUrl: sepolia.blockExplorers.default.url,
    rpcUrl: sepolia.rpcUrls.default.http[0],
  },
  {
    label: "Linea Sepolia Testnet",
    icon: lineaIcon,
    chainId: lineaSepolia.id,
    networkKey: PRIMARY_CHAIN_KEY,
    isEthGasToken: true,
    chainName: "Linea Sepolia",
    explorerUrl: lineaSepolia.blockExplorers.default.url,
    rpcUrl: lineaSepolia.rpcUrls.default.http[0],
  },
  {
    label: "Mantle Sepolia Testnet",
    icon: mantleIcon,
    chainId: mantleSepoliaTestnet.id,
    networkKey: "mantle",
    isEthGasToken: false,
    chainName: "Mantle Sepolia",
    explorerUrl: mantleSepoliaTestnet.blockExplorers.default.url,
    rpcUrl: mantleSepoliaTestnet.rpcUrls.default.http[0],
  },
];

const FromList = nodeType === "nexus-goerli" ? FromListGoerli : FromListMainnet;

export default FromList;
