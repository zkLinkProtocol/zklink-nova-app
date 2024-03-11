import {
  PRIMARY_CHAIN_KEY,
  nexusGoerliNode,
  nexusNode,
} from "../constants/networks";
import { BigNumber, utils, BigNumberish, ethers } from "ethers";
import { usePublicClient, useWalletClient } from "wagmi";
import type { Abi, Address, WriteContractParameters } from "viem";
import IZkSync from "../constants/abi/IZkSync.json";
import IL1Bridge from "../constants/abi/IL1Bridge.json";
import WrappedMNTAbi from "../constants/abi/WrappedMNT.json";
import IERC20 from "../constants/abi/IERC20.json";
import { useAccount } from "wagmi";
import { useState } from "react";
import { Provider } from "zksync-web3";
import { l1EthDepositAbi } from "./abi";
import { Interface } from "ethers/lib/utils";
import {
  getERC20BridgeCalldata,
  applyL1ToL2Alias,
  isETH,
  scaleGasLimit,
} from "@/utils";
import { WalletClient } from "viem";
import { useBridgeNetworkStore } from "./useNetwork";
import { FullDepositFee } from "@/types";
import { suggestMaxPriorityFee } from "@rainbow-me/fee-suggestions";
import { WRAPPED_MNT } from "@/constants";

// const networkKey: string = "goerli"; //TODO get from store
const nodeType = import.meta.env.VITE_NODE_TYPE;
const nodeConfig = nodeType === "nexus-goerli" ? nexusGoerliNode : nexusNode;

const ETH_ADDRESS = "0x0000000000000000000000000000000000000000";
export const REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT = 800;

const defaultNetwork = nodeConfig[0];
export const useZksyncProvider = () => {
  // const { networkKey } = useNetworkStore();
  const networkKey = useBridgeNetworkStore.getState().networkKey;
  const eraNetwork =
    nodeConfig.find((item) => item.key === networkKey) ?? defaultNetwork;

  const provider = new Provider(eraNetwork.rpcUrl);
  //if provider.networkKey != eraNetwork.key
  // provider.setContractAddresses(eraNetwork.key, {
  //   mainContract: eraNetwork.mainContract,
  //   erc20BridgeL1: eraNetwork.erc20BridgeL1,
  //   erc20BridgeL2: eraNetwork.erc20BridgeL2,
  //   l1Gateway: eraNetwork.l1Gateway,
  // });
  // provider.setIsEthGasToken(eraNetwork.isEthGasToken ?? true);
  const getDefaultBridgeAddresses = async () => {
    return {
      erc20L1: eraNetwork.erc20BridgeL1,
      erc20L2: eraNetwork.erc20BridgeL2,
    };
  };
  return { provider, getDefaultBridgeAddresses };
};

export function walletClientToProvider(walletClient: WalletClient) {
  const { chain, transport } = walletClient;
  const network = {
    chainId: chain!.id,
    name: chain!.name,
    ensAddress: chain!.contracts?.ensRegistry?.address,
  };
  const provider = new ethers.providers.Web3Provider(transport, network);
  return provider;
}

export const useBridgeTx = () => {
  const networkKey = useBridgeNetworkStore.getState().networkKey;
  console.log("networkKey: ", networkKey);
  const publicClient = usePublicClient();
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [loading, setLoading] = useState(false);
  const { provider: providerL2, getDefaultBridgeAddresses } =
    useZksyncProvider();

  const getBaseCost = async (l2GasLimit: BigNumber) => {
    const feeData = await getFeeData();
    const gasPriceForEstimation = feeData?.maxFeePerGas || feeData?.gasPrice;
    const gasPrice =
      networkKey === "primary"
        ? BigNumber.from(await gasPriceForEstimation!).mul(2)
        : await getTxGasPrice();
    console.log("gasPrice: ", gasPrice);
    const zksyncContract = nodeConfig.find(
      (item) => item.key === networkKey
    )?.mainContract;
    const baseCost = await publicClient?.readContract({
      abi: IZkSync.abi,
      address: zksyncContract as `0x${string}`,
      functionName: "l2TransactionBaseCost",
      args: [
        gasPrice.toString(),
        l2GasLimit,
        REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT,
      ],
    });
    console.log("baseCost: ", baseCost);
    return BigNumber.from(baseCost);
  };

  const estimateDefaultBridgeDepositL2Gas = async (
    token: Address,
    amount: BigNumberish,
    to: Address,
    from?: Address
  ): Promise<BigNumber> => {
    // If the `from` address is not provided, we use a random address, because
    // due to storage slot aggregation, the gas estimation will depend on the address
    // and so estimation for the zero address may be smaller than for the sender.
    from ??= ethers.Wallet.createRandom().address as Address;
    if (!walletClient) {
      return BigNumber.from(0);
    }
    if (token == ETH_ADDRESS) {
      return await providerL2.estimateL1ToL2Execute({
        contractAddress: to,
        gasPerPubdataByte: REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT,
        caller: from,
        calldata: "0x",
        l2Value: amount,
      });
    } else {
      const l1ERC20BridgeAddresses = (await getDefaultBridgeAddresses())
        .erc20L1;
      const erc20BridgeAddress = (await getDefaultBridgeAddresses()).erc20L2;

      const provider1 = walletClientToProvider(walletClient);
      const calldata = await getERC20BridgeCalldata(
        token,
        from,
        to,
        amount,
        provider1
      );

      return await providerL2.estimateL1ToL2Execute({
        caller: applyL1ToL2Alias(l1ERC20BridgeAddresses!),
        contractAddress: erc20BridgeAddress!,
        gasPerPubdataByte: REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT,
        calldata: calldata,
      });
    }
  };

  const getDepositEstimateGasForUseFee = async (
    l2GasLimit: BigNumber,
    baseCost: BigNumber
  ): Promise<BigNumber> => {
    if (!address) return BigNumber.from(0);

    const dummyAmount = 0; // must be 0, cause some secondary chain does not support deposit GAS Token, suck as Mantle

    const face = new Interface([l1EthDepositAbi]);
    const contractAddress = nodeConfig.find(
      (item) => item.key === networkKey
    )?.mainContract;
    const l1Provider = walletClientToProvider(walletClient!);
    const baseGasLimit = await l1Provider!.estimateGas({
      from: address as `0x${string}`,
      to: contractAddress,
      value: baseCost.add(dummyAmount).toBigInt(),
      data: face.encodeFunctionData("requestL2Transaction", [
        address,
        dummyAmount,
        "0x",
        l2GasLimit,
        REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT,
        [],
        address,
      ]) as `0x${string}`,
    });
    return scaleGasLimit(baseGasLimit);
  };

  const getErc20Allowance = async (
    token: string,
    owner: string,
    spender: string
  ) => {
    const res = await publicClient?.readContract({
      address: token as `0x${string}`,
      abi: IERC20.abi,
      functionName: "allowance",
      args: [owner, spender],
    });
    return BigNumber.from(res);
  };

  const sendApproveErc20Tx = async (
    token: string,
    amount: BigNumberish,
    spender: string
  ) => {
    const tx = {
      address: token,
      abi: IERC20.abi,
      functionName: "approve",
      args: [spender, amount],
    };
    const hash = (await walletClient?.writeContract(tx)) as `0x${string}`;
    await publicClient?.waitForTransactionReceipt({ hash });
  };

  const depositMNT = async (amount: BigNumberish) => {
    const tx = {
      address: WRAPPED_MNT,
      abi: WrappedMNTAbi,
      functionName: "deposit",
      value: amount,
    };
    const hash = (await walletClient?.writeContract(tx)) as `0x${string}`;
    await publicClient?.waitForTransactionReceipt({ hash });
  };

  const getTxGasPrice = async () => {
    const contractAddress = nodeConfig.find(
      (item) => item.key === networkKey
    )?.mainContract;
    if (!contractAddress) {
      throw new Error("Invalid network key");
    }
    const result = (await publicClient?.call({
      to: contractAddress,
      data: "0x534ca054", //call txGasPrice returns uint256
    })) as unknown as string;
    return BigNumber.from(utils.hexValue(result.data));
  };

  const getFeeData = async () => {
    if (!walletClient) return;
    const provider = walletClientToProvider(walletClient);
    return provider.getFeeData();

    // return { lastBaseFeePerGas, maxFeePerGas, maxPriorityFeePerGas, gasPrice };
  };
  /// @dev This method checks if the overrides contain a gasPrice (or maxFeePerGas), if not it will insert
  /// the maxFeePerGas
  async function insertGasPrice(
    l1Provider: ethers.providers.Provider,
    overrides: ethers.PayableOverrides
  ) {
    if (!overrides.gasPrice && !overrides.maxFeePerGas) {
      const l1FeeData = await l1Provider.getFeeData();

      // Sometimes baseFeePerGas is not available, so we use gasPrice instead.
      const baseFee = l1FeeData.lastBaseFeePerGas || l1FeeData.gasPrice;

      if (l1FeeData.maxFeePerGas && l1FeeData.maxPriorityFeePerGas) {
        // ethers.js by default uses multiplcation by 2, but since the price for the L2 part
        // will depend on the L1 part, doubling base fee is typically too much.
        const maxFeePerGas = baseFee!.add(l1FeeData.maxPriorityFeePerGas || 0);
        // const maxFeePerGas = baseFee!.mul(3).div(2).add(l1FeeData.maxPriorityFeePerGas!);

        overrides.maxFeePerGas = maxFeePerGas;
        overrides.maxPriorityFeePerGas = l1FeeData.maxPriorityFeePerGas!;
      } else {
        overrides.gasPrice = baseFee!;
      }
    }
  }

  // Retrieves the full needed ETH fee for the deposit.
  // Returns the L1 fee and the L2 fee.
  const getFullRequiredDepositFee = async (transaction: {
    token: Address;
    to?: Address;
    // bridgeAddress?: Address;
    // gasPerPubdataByte?: BigNumberish;
    overrides?: ethers.PayableOverrides;
  }): Promise<FullDepositFee> => {
    // It is assumed that the L2 fee for the transaction does not depend on its value.
    // const dummyAmount = "1";

    const { ...tx } = transaction;
    // const zksyncContract = await this.getMainContract();

    tx.overrides ??= {};
    if (!walletClient || !address) return null;
    const provider = walletClientToProvider(walletClient);
    await insertGasPrice(provider, tx.overrides);

    const l2GasLimit = await providerL2.estimateL1ToL2Execute({
      contractAddress: address,
      gasPerPubdataByte: REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT,
      caller: address,
      calldata: "0x",
      l2Value: 0,
    });

    const baseCost = await getBaseCost(l2GasLimit);
    const selfBalanceETH = await publicClient?.getBalance({ address });
    if (baseCost.gte(selfBalanceETH ?? 0n)) {
      throw new Error(`Not enough balance for deposit`);
    }

    // Deleting the explicit gas limits in the fee estimation
    // in order to prevent the situation where the transaction
    // fails because the user does not have enough balance
    const estimationOverrides = { ...tx.overrides };
    delete estimationOverrides.gasPrice;
    delete estimationOverrides.maxFeePerGas;
    delete estimationOverrides.maxPriorityFeePerGas;

    let l1GasLimit;

    if (networkKey === "ethereum") {
      if (isETH(tx.token)) {
        l1GasLimit = BigNumber.from(180000);
      } else {
        l1GasLimit = BigNumber.from(300000); //TODO never access here
      }
    } else {
      l1GasLimit = await getDepositEstimateGasForUseFee(l2GasLimit, baseCost);
    }

    console.log("l1GasLimit", l1GasLimit.toString());

    const fullCost: FullDepositFee = {
      baseCost,
      l1GasLimit,
      l2GasLimit,
    };
    console.log("tx.overrides", tx.overrides);
    if (tx.overrides.gasPrice) {
      fullCost.gasPrice = BigNumber.from(await tx.overrides.gasPrice);
    } else {
      fullCost.maxFeePerGas = BigNumber.from(await tx.overrides.maxFeePerGas);
      fullCost.maxPriorityFeePerGas = BigNumber.from(
        await tx.overrides.maxPriorityFeePerGas
      );
    }

    return fullCost;
  };

  const getGasPrice = async () => {
    if (!publicClient) return 0;
    return BigNumber.from(await publicClient.getGasPrice())
      .mul(110)
      .div(100);
  };

  const getEstimateFee = async (token: Address) => {
    try {
      if (!address) return;
      const fee = await getFullRequiredDepositFee({
        token,
        to: address,
      });
      if (token !== ETH_ADDRESS && fee && fee.l1GasLimit) {
        //TODO this is a temp fix for mantel network;
        fee.l1GasLimit = fee.l1GasLimit.mul(2); //maybe mul(3).div(2) is better
        if (networkKey === "mantle") {
        } else {
        }
      }

      if (fee) {
        if (
          networkKey === PRIMARY_CHAIN_KEY &&
          fee.maxFeePerGas &&
          fee.maxPriorityFeePerGas
        ) {
          const lineaFeeSuggest = await suggestMaxPriorityFee(
            walletClientToProvider(walletClient!),
            "latest"
          );
          console.log(
            "linea feesuggest",
            lineaFeeSuggest.maxPriorityFeeSuggestions
          );
          fee.maxPriorityFeePerGas = BigNumber.from(
            lineaFeeSuggest.maxPriorityFeeSuggestions.fast
          );
          fee.maxFeePerGas = fee.maxPriorityFeePerGas;
        }
      }
      /* It can be either maxFeePerGas or gasPrice */
      if (fee && !fee.maxFeePerGas) {
        fee.gasPrice = await getGasPrice();
      }
      return fee;
    } catch (e) {
      console.log(e);
    }
  };

  const sendDepositTx = async (token: Address, amount: BigNumberish) => {
    const network = nodeConfig.find((item) => item.key === networkKey);
    if (!address || !network) {
      return;
    }
    try {
      setLoading(true);

      const l2GasLimit = await estimateDefaultBridgeDepositL2Gas(
        token,
        amount,
        address
      );
      const baseCost = await getBaseCost(l2GasLimit);
      console.log("l2GasLimit: ", l2GasLimit.toString());
      const fee = await getEstimateFee(token);
      const overrides = {
        gasPrice: fee?.gasPrice,
        gasLimit: fee?.l1GasLimit,
        maxFeePerGas: fee?.maxFeePerGas,
        maxPriorityFeePerGas: fee?.maxPriorityFeePerGas,
      };
      if (overrides.gasPrice && overrides.maxFeePerGas) {
        overrides.gasPrice = undefined;
      }

      // const l1GasLimit = await getDepositEstimateGasForUseFee();
      let tx: WriteContractParameters;
      if (token === ETH_ADDRESS) {
        if (networkKey === "mantle") {
          await depositMNT(amount);
          const bridgeContract = network.erc20BridgeL1;
          tx = {
            address: bridgeContract!,
            abi: IL1Bridge.abi as Abi,
            functionName: "deposit",
            args: [
              address,
              WRAPPED_MNT,
              amount,
              l2GasLimit,
              REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT,
            ],
          };
          tx.value = baseCost.toBigInt();
          // tx.gasLimit = l1GasLimit;
          const allowance = await getErc20Allowance(
            WRAPPED_MNT,
            address!,
            bridgeContract!
          );
          if (allowance.lt(amount)) {
            await sendApproveErc20Tx(WRAPPED_MNT, amount, bridgeContract!);
          }
        } else {
          tx = {
            address: network.mainContract!,
            abi: IZkSync.abi as Abi,
            functionName: "requestL2Transaction",
            args: [
              address,
              amount,
              "",
              l2GasLimit,
              REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT,
              [],
              address,
            ],
          };
          tx.value = BigNumber.from(baseCost).add(amount).toBigInt();
        }
      } else {
        const bridgeContract = network.erc20BridgeL1;
        tx = {
          address: bridgeContract!,
          abi: IL1Bridge.abi as Abi,
          functionName: "deposit",
          args: [
            address,
            token,
            amount,
            l2GasLimit,
            REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT,
          ],
        };
        tx.value = baseCost.toBigInt();
        // tx.gasLimit = l1GasLimit;
        const allowance = await getErc20Allowance(
          token,
          address!,
          bridgeContract!
        );
        if (allowance.lt(amount)) {
          await sendApproveErc20Tx(token, amount, bridgeContract!);
        }
      }
      if (overrides.maxFeePerGas && overrides.maxPriorityFeePerGas) {
        tx.maxFeePerGas = overrides.maxFeePerGas;
        tx.maxPriorityFeePerGas = overrides.maxPriorityFeePerGas;
      } else {
        tx.gas = overrides.gasLimit;
      }
      const hash = (await walletClient?.writeContract(tx)) as `0x${string}`;
      const res = await publicClient?.waitForTransactionReceipt({ hash });
      console.log(res);
      return hash;
    } catch (e) {
      console.log(e);
      return Promise.reject(e);
    } finally {
      setLoading(false);
    }
  };

  return {
    sendDepositTx,
    loading,
  };
};
