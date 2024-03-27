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
    ? "0x3E4E2F5f1AFce2b048C73bd2C17C361997066716"
    : "0xE310c6595205252C73e9044f6740BA8775bf0Da0";

export const TRADEMARK_NFT_CONTRACT =
  nodeType === "nexus-goerli"
    ? "0xA594bF8Ec851a7c58a348DF81Bb311cE0BCAD5C4"
    : "0xDeEDf09C48E1284b59f8e7DC4e1fd45243002615";

export const BOOSTER_NFT_CONTRACT =
  nodeType === "nexus-goerli"
    ? "0x11Daca615cdBbd4209a0B5E139a60caa6Bf7d874"
    : "0xE9c53534808388aD8d9A1b8fC5812B5C2185EBfD";

export const LYNKS_NFT_CONTRACT =
  nodeType === "nexus-goerli"
    ? "0xAFA859503D75E33553415bd8dC7b2702b2f73b65"
    : "0xd6d05CBdb8A70d3839166926f1b14d74d9953A08";
export const MYSTERY_BOX_CONTRACT =
  nodeType === "nexus-goerli"
    ? "0x8A9D6EF8350548CB3172d0cD9a83f57E860240eB"
    : "0x7fE8510dD408327806baCACaAFE2A445D9f3E9ee";

export const NOVA_START_TIME = 1710410400000; //1710410400000;

export const NexusEstimateArrivalTimes: Record<string, number> = {
  ethereum: 12.8,
  [PRIMARY_CHAIN_KEY]: 1,
  arbitrum: 1,
  zksync: 1,
  manta: 1,
  mantle: 1,
  blast: 1,
  optimism: 1,
  base: 1,
};

export const NexusGoerliEstimateArrivalTimes = {};

export const IS_MAINNET = nodeType === "nexus";

export const TWEET_SHARE_TEXT = "ZkLink Nova Campaign blablablablabla";

export const NFT_MARKET_URL = "";

export const enum MintStatus {
  Minting = "Minting",
  Failed = "Failed",
  Success = "Success",
}

export const LYNKS_METADATA_PREFIX =
  nodeType === "nexus-goerli"
    ? "https://zklink-nova-nft.s3.ap-northeast-1.amazonaws.com/lynknft-test"
    : "https://zklink-nova-nft.s3.ap-northeast-1.amazonaws.com/lynknft";
