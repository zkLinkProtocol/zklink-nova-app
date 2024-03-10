import { PRIMARY_CHAIN_KEY } from "@/constants/networks";
import lineaIcon from "../assets/img/linea.svg";
import ethereumIcon from "../assets/img/ethereum.svg";
import mantleIcon from "../assets/img/mantle.svg";
import mantaIcon from '../assets/img/manta.jpg'
import arbIcon from '../assets/img/arbitrum.svg'
import zkscyncIcon from '../assets/img/zksync.svg'
import {
  goerli,
  lineaTestnet,
  mantleTestnet,
  mainnet,
  linea,
  zkSync,
  manta,
  mantle,
  arbitrum
} from "wagmi/chains";
const nodeType = import.meta.env.VITE_NODE_TYPE;

const FromListMainnet = [
  {
    label: "Ethereum",
    icon: ethereumIcon,
    chainId: mainnet.id,
    networkKey: "ethereum",
    isEthGasToken: true,
    chainName: "Ethereum",
  },
  {
    label: "Linea",
    icon: lineaIcon,
    chainId: linea.id,
    networkKey: PRIMARY_CHAIN_KEY,
    isEthGasToken: true,
    chainName: "Linea",
  },
  {
    label: "Arbitrum",
    icon: arbIcon,
    chainId: arbitrum.id,
    networkKey: 'arbitrum',
    isEthGasToken: true,
    chainName: "Arbitrum",
  },
  {
    label: "zkSync",
    icon: zkscyncIcon,
    chainId: zkSync.id,
    networkKey: 'zksync',
    isEthGasToken: true,
    chainName: "ZkSync",
  },
  {
    label: "Manta",
    icon: mantaIcon,
    chainId: manta.id,
    networkKey: 'manta',
    isEthGasToken: true,
    chainName: "Manta",
  },
  {
    label: "Mantle",
    icon: mantleIcon,
    chainId: mantle.id,
    networkKey: 'mantle',
    isEthGasToken: true,
    chainName: "Mantle",
  },
];

const FromListGoerli = [
  {
    label: "Ethereum Goerli Testnet",
    icon: ethereumIcon,
    chainId: goerli.id,
    networkKey: "goerli",
    isEthGasToken: true,
    chainName: "Goerli",
  },
  {
    label: "Linea Goerli Testnet",
    icon: lineaIcon,
    chainId: lineaTestnet.id,
    networkKey: PRIMARY_CHAIN_KEY,
    isEthGasToken: true,
    chainName: "Linea Goerli",
  },
  {
    label: "Mantle Goerli Testnet",
    icon: mantleIcon,
    chainId: mantleTestnet.id,
    networkKey: "mantle",
    isEthGasToken: false,
    chainName: "Mantle Goerli",
  },
];

const FromList = nodeType === "nexus-goerli" ? FromListGoerli : FromListMainnet;

export default FromList;
