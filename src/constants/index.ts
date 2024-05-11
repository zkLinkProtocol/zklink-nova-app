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

export const NOVA_CHAIN_ID = nodeType === "nexus-goerli" ? 810181 : 810180;

export const NOVA_NFT_CONTRACT =
  nodeType === "nexus-goerli"
    ? "0xc45BF72829450674976EA4bCF3A2B209fedca4fA"
    : "0xE310c6595205252C73e9044f6740BA8775bf0Da0";

export const TRADEMARK_NFT_CONTRACT =
  nodeType === "nexus-goerli"
    ? "0x1F2bCBf3005EB588091aF2C84160681d18a0D09D"
    : "0xDeEDf09C48E1284b59f8e7DC4e1fd45243002615";

export const BOOSTER_NFT_CONTRACT =
  nodeType === "nexus-goerli"
    ? "0x5FeaE081177904FC9E57b9E3754915f9Ee3738Cf"
    : "0xE9c53534808388aD8d9A1b8fC5812B5C2185EBfD";

export const BOOSTER_NFT_CONTRACT_V2 =
  nodeType === "nexus-goerli"
    ? "0x52afbAd42b66B95bE1b436011d4b2217c859071f"
    : "0xe8184919c7200EF09e7007DFaB89BA4a99CeDc98";

export const LYNKS_NFT_CONTRACT =
  nodeType === "nexus-goerli"
    ? "0xCbD3A13Af270Ec479ab4522d52f6a9C821B3F56D"
    : "0xd6d05CBdb8A70d3839166926f1b14d74d9953A08";
export const MYSTERY_BOX_CONTRACT =
  nodeType === "nexus-goerli"
    ? "0x6774B0692EC9B3f77Fc787aD3c3DD028BCf676F1"
    : "0x7fE8510dD408327806baCACaAFE2A445D9f3E9ee";

export const MYSTERY_BOX_CONTRACT_V2 =
  nodeType === "nexus-goerli"
    ? "0x13F2F50dD60A365bD547b07Cc41AB8Fa9666625a"
    : "0x831EeF41bf63c9cEF1ed53c226356eBF2D349cD6";

export const WETH_CONTRACT =
  nodeType === "nexus-goerli"
    ? ""
    : "0x8280a4e7D5B3B658ec4580d3Bc30f5e50454F169";

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

export const TRADEMARK_NFT_MARKET_URL =
  "https://alienswap.xyz/collection/zklink-nova/0xdeedf09c48e1284b59f8e7dc4e1fd45243002615";

export const LYNKS_NFT_MARKET_URL =
  "https://alienswap.xyz/collection/zklink-nova/nova-lynks-fe69";

export const MYSTERYBOX_NFT_MARKET_URL =
  "https://alienswap.xyz/collection/zklink-nova/nova-mystery-box-ac81";

export const enum MintStatus {
  Minting = "Minting",
  Failed = "Failed",
  Success = "Success",
}

export const LYNKS_METADATA_PREFIX =
  nodeType === "nexus-goerli"
    ? "https://zklink-nova-nft.s3.ap-northeast-1.amazonaws.com/lynknft-test"
    : "https://zklink-nova-nft.s3.ap-northeast-1.amazonaws.com/lynknft";

export const PUFFER_TOKEN_ADDRESS =
  "0xdd6105865380984716C6B2a1591F9643e6ED1C48";

const isProd = import.meta.env.PROD;

export const FUSION_DANCE_PARADE_URL = isProd
  ? "https://zklink.io/fusion-dance-parade"
  : "https://preview.zklink.io/fusion-dance-parade";
