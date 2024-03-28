import qs from "qs";
import { IERC20MetadataFactory } from "@/constants/typechain";
import { ethers, BigNumberish, utils, BigNumber } from "ethers";
import { AbiCoder } from "ethers/lib/utils";
import { formatUnits } from "viem";
import bignumber from "bignumber.js";
import { ETH_ADDRESS, L2_ETH_TOKEN_ADDRESS } from "@/constants";
import { BOOST_LIST } from "@/constants/boost";
import numeral from "numeral";
import { nexusGoerliNode, nexusNode } from "@/constants/networks";
import FromList from "@/constants/fromChainList";
import { checkOkx } from "@/api";

export const L2_BRIDGE_ABI = new utils.Interface(
  (await import("../constants/abi/IL2Bridge.json")).abi
);

export const L1_TO_L2_ALIAS_OFFSET =
  "0x1111000000000000000000000000000000001111";

/**
 * fetch post request
 * @param url
 * @param data
 * @returns response
 */
export async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      // "Content-Type": "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: qs.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

/**
 * Foramt web3 account
 * @param acc
 * @returns
 */
export const showAccount = (acc: any) => {
  if (!acc) return;
  return `${acc.substr(0, 6)}...${acc.substr(-4)}`;
};
export type Deferrable<T> = {
  [K in keyof T]: T[K] | Promise<T[K]>;
};

type Result = { key: string; value: any };
export async function resolveProperties<T>(
  object: Readonly<Deferrable<T>>
): Promise<T> {
  const promises: Array<Promise<Result>> = Object.keys(object).map((key) => {
    const value = object[<keyof Deferrable<T>>key];
    return Promise.resolve(value).then((v) => ({ key: key, value: v }));
  });

  const results = await Promise.all(promises);

  return results.reduce((accum, result) => {
    accum[<keyof T>result.key] = result.value;
    return accum;
  }, <T>{});
}

/// Getters data used to correctly initialize the L1 token counterpart on L2
async function getERC20GettersData(
  l1TokenAddress: string,
  provider: ethers.providers.Provider
): Promise<string> {
  const token = IERC20MetadataFactory.connect(l1TokenAddress, provider);

  const name = await token.name();
  const symbol = await token.symbol();
  const decimals = await token.decimals();

  const coder = new AbiCoder();

  const nameBytes = coder.encode(["string"], [name]);
  const symbolBytes = coder.encode(["string"], [symbol]);
  const decimalsBytes = coder.encode(["uint256"], [decimals]);

  return coder.encode(
    ["bytes", "bytes", "bytes"],
    [nameBytes, symbolBytes, decimalsBytes]
  );
}

/// The method that returns the calldata that will be sent by an L1 ERC20 bridge to its L2 counterpart
/// during bridging of a token.
export async function getERC20BridgeCalldata(
  l1TokenAddress: string,
  l1Sender: string,
  l2Receiver: string,
  amount: BigNumberish,
  provider: ethers.providers.Provider
): Promise<string> {
  const gettersData = await getERC20GettersData(l1TokenAddress, provider);
  return L2_BRIDGE_ABI.encodeFunctionData("finalizeDeposit", [
    l1Sender,
    l2Receiver,
    l1TokenAddress,
    amount,
    gettersData,
  ]);
}
const ADDRESS_MODULO = BigNumber.from(2).pow(160);

export function applyL1ToL2Alias(address: string): string {
  return ethers.utils.hexlify(
    ethers.BigNumber.from(address)
      .add(L1_TO_L2_ALIAS_OFFSET)
      .mod(ADDRESS_MODULO)
  );
}

export function formatBalance(
  balance: bigint,
  decimals: number,
  fixed: number = 8
) {
  const v = new bignumber(
    new bignumber(formatUnits(balance ?? BigInt(0), decimals)).toFixed(fixed, 1)
  ).toNumber(); //use 1 to round_down
  return v;
}

export function getBooster(value: number): number {
  let booster = 0;
  if (value > BOOST_LIST[0].value) {
    const arr = BOOST_LIST.filter((item) => value > item.value);
    booster = arr[arr.length - 1].booster;
  }
  return booster;
}

export function getNextMilestone(value: number): number {
  const arr = BOOST_LIST.filter((item) => value < item.value);
  const nextValue = arr.length > 0 ? arr[0].value : 0;
  return nextValue;
}

export function isETH(token: string) {
  return (
    token.toLowerCase() == ETH_ADDRESS ||
    token.toLowerCase() == L2_ETH_TOKEN_ADDRESS
  );
}

export const L1_FEE_ESTIMATION_COEF_NUMERATOR = BigNumber.from(12);
export const L1_FEE_ESTIMATION_COEF_DENOMINATOR = BigNumber.from(10);
export function scaleGasLimit(gasLimit: BigNumber): BigNumber {
  return gasLimit
    .mul(L1_FEE_ESTIMATION_COEF_NUMERATOR)
    .div(L1_FEE_ESTIMATION_COEF_DENOMINATOR);
}

export function getRandomNumber(min: number, max: number) {
  return Math.round(Math.random() * (max - min)) + min;
}

export function formatNumber2(value: number) {
  let arr = String(value).split(".");
  if (arr.length === 2) {
    arr[1] = arr[1].substring(0, 2);

    return arr.join(".");
  }

  return value;
}

export function formatNumberWithUnit(value: number | string, symbol?: string) {
  if (+value > 0.01) {
    value = formatNumber2(Number(value));
  }

  let format = symbol === "$" ? "$0" : `0 ${symbol ? symbol : ""}`;

  if (+value && !isNaN(+value)) {
    if (+value < 0.01) {
      format = symbol === "$" ? "<$0.01" : `<0.01 ${symbol ? symbol : ""}`;
    } else {
      format =
        symbol === "$"
          ? `$${numeral(value).format("0.00a")}`
          : `${numeral(value).format("0.00a")} ${symbol ? symbol : ""}`;
    }
  }

  // console.log("formatNumberWithUnit", value, format);

  return format;
}

export function isSameAddress(a: string, b: string) {
  return a && b && a.toLowerCase() === b.toLowerCase();
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type AddEvmChainParams = {
  chainId: string;
  chainName: string;
  rpcUrls: string[];
  iconUrls: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrls: string[];
};
export async function addEvmChain(chain: AddEvmChainParams) {
  if (!window.ethereum) {
    throw new Error("No wallet installed");
  }
  await window.ethereum.request({
    method: "wallet_addEthereumChain",
    params: [chain],
  });
}
const nodeType = import.meta.env.VITE_NODE_TYPE;

export async function addNovaChain() {
  const network =
    nodeType === "nexus-goerli" ? nexusGoerliNode[0] : nexusNode[0];
  await addEvmChain({
    chainId: "0x" + network.id.toString(16),
    chainName: network.name,
    rpcUrls: [network.rpcUrl],
    iconUrls: [],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrls: [network.blockExplorerUrl ?? ""],
  });
}

export const formatNumber = (
  number: number,
  locales?: string,
  ops?: Intl.NumberFormatOptions
) => {
  const formatter = new Intl.NumberFormat(locales ?? "en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...ops,
  });
  return formatter.format(number);
};

export const copyText = (text: string) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.position = "fixed";
  textArea.style.clip = "rect(0 0 0 0)";
  textArea.style.top = "10px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const res = document.execCommand("copy");
    console.log("copy res;", res);
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
  } finally {
    document.body.removeChild(textArea);
  }
};

export const formatTxHash = (hash: string) => {
  if (hash) {
    return hash.substring(0, 12) + "..." + hash.substr(-12);
  }
  return "";
};

export const getTxHashExplorerLink = (rpcUrl: string, txhash: string) => {
  if (rpcUrl && txhash) {
    const network = FromList.find((item) => item.rpcUrl === rpcUrl);
    if (network) {
      return `${network.explorerUrl}/tx/${txhash}`;
    }
  }
};

const providers: Record<string, ethers.providers.JsonRpcProvider> = {};
export const getProviderWithRpcUrl = (rpcUrl: string) => {
  if (providers[rpcUrl]) {
    return providers[rpcUrl];
  }
  const provider = new ethers.providers.JsonRpcBatchProvider(rpcUrl);
  if (!providers[rpcUrl]) {
    providers[rpcUrl] = provider;
  }
  return provider;
};

export const getTweetShareText = (inviteCode: string) => {
  const text = `Join @zkLinkNova's 🎉Aggregation Parade🎉 the celebration to unlock "MEGA YIELD" for 🎯ETH, L2 Native token, Stables, LSTs and LRTs🎯%0A%0AUse my referral code https://app.zklink.io/aggregation-parade?inviteCode=${inviteCode} to join the @zkLink_Official's biggest campaign%0A%0A%23zkLinkNovaAggParade %23zkLink %23ZKL %23AggregatedL3`;
  return text;
};

export const getTweetShareTextForMysteryBox = (inviteCode: string) => {
  return `🌟 Can't contain my excitement! Just won a Nova Mystery Box!🎁 Ready to light up the %23zkLinkNovaAggParade event with my referral code https://app.zklink.io/aggregation-parade?inviteCode=${inviteCode} in this Mega Yield Journey on @zkLinkNova🚀`;
};

export const scrollToTop = () => {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};

export const getCheckOkxPoints = async (address: string) => {
  let points = 0;
  if (!address) return points;
  const res = await checkOkx(address);
  const { result } = res;
  if (result && Array.isArray(result) && result.length > 0) {
    points = 5;
  }
  return points;
};

export function findClosestMultiplier(
  arr: {
    multiplier: number;
    timestamp: number;
  }[]
) {
  const currentTime = Date.now();
  let closestMultiplier = null;
  let timeDiff = Infinity;

  for (let i = 0; i < arr.length; i++) {
    const { timestamp, multiplier } = arr[i];
    const diff = currentTime - timestamp * 1000;

    if (diff > 0 && diff < timeDiff) {
      timeDiff = diff;
      closestMultiplier = multiplier;
    }
  }

  return closestMultiplier;
}
