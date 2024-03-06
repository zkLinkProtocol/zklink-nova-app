import { PRIMARY_CHAIN_KEY } from "@/constants/networks";
import lineaIcon from "../assets/img/linea.svg";
import ethereumIcon from "../assets/img/ethereum.svg";
import mantleIcon from "../assets/img/mantle.svg";
import {
  goerli,
  lineaTestnet,
  mantleTestnet,
  mainnet,
  linea,
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
