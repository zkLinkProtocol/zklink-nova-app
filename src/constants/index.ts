import { PRIMARY_CHAIN_KEY } from "./networks";
export const STORAGE_NETWORK_KEY = "STORAGE_NETWORK_KEY";

export const STORAGE_VERIFY_TX_KEY = "STORAGE_VERIFY_TX_KEY";

export const ETH_ADDRESS = "0x0000000000000000000000000000000000000000";

export const L2_ETH_TOKEN_ADDRESS =
  "0x000000000000000000000000000000000000800a";
const nodeType = import.meta.env.VITE_NODE_TYPE;

export const WRAPPED_MNT =
  nodeType === "nexus-goerli"
    ? "0xEa12Be2389c2254bAaD383c6eD1fa1e15202b52A"
    : "0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8";

export const NOVA_CHAIN_ID = nodeType === "nexus-goerli" ? 810182 : 810180;

export const NOVA_NFT_CONTRACT =
  nodeType === "nexus-goerli"
    ? "0xF2fe005206cF81C149EbB2D40A294F5Ac59D9E6D"
    : "0xE310c6595205252C73e9044f6740BA8775bf0Da0";

export const TRADEMARK_NFT_CONTRACT =
  nodeType === "nexus-goerli"
    ? "0x34101952B0aa46bDe9E87617D2A4610907915e04"
    : "";
export const NOVA_START_TIME = 1710410400000; //1710410400000;

export const NexusEstimateArrivalTimes: Record<string, number> = {
  ethereum: 12.8,
  [PRIMARY_CHAIN_KEY]: 1,
  arbitrum: 1,
  zksync: 1,
  manta: 1,
  mantle: 1,
  blast: 1,
};

export const NexusGoerliEstimateArrivalTimes = {};

export const IS_MAINNET = nodeType === "nexus";

export const TWEET_SHARE_TEXT = "ZkLink Nova Campaign blablablablabla";
