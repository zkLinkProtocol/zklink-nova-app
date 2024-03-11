import qs from "qs";
import { IERC20MetadataFactory } from "@/constants/typechain";
import { ethers, BigNumberish, utils, BigNumber } from "ethers";
import { AbiCoder } from "ethers/lib/utils";
import { formatUnits } from "viem";
import bignumber from "bignumber.js";
import { ETH_ADDRESS, L2_ETH_TOKEN_ADDRESS } from "@/constants";
import { BOOST_LIST } from "@/constants/boost";
import numeral from "numeral";

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
  return new bignumber(
    new bignumber(formatUnits(balance ?? BigInt(0), decimals)).toFixed(fixed)
  ).toFixed();
}

export function getBooster(value: number): string {
  let booster = "0x";
  if (value > BOOST_LIST[0].value) {
    const arr = BOOST_LIST.filter((item) => value > item.value);
    booster = arr[arr.length - 1].booster;
  }
  return booster;
}

export function getNextMilestone(value: number): number {
  const arr = BOOST_LIST.filter((item) => value < item.value);
  const nextValue = arr[0].value;
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

export function random(min: number, max: number) {
  return Math.round(Math.random() * (max - min)) + min;
}

export function formatNumberWithUnit(value: number) {
  const num = Number(value);
  if (!num) return "0";
  return numeral(num).format("0.00a");
}

export function isSameAddress(a: string, b: string) {
  return a && b && a.toLowerCase() === b.toLowerCase();
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
