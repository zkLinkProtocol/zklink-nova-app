import {
  PRIMARY_CHAIN_KEY,
  nexusGoerliNode,
  nexusNode,
  // wagmiConfig,
  config,
} from "../constants/networks";
import { BigNumber, utils, BigNumberish, ethers, VoidSigner } from "ethers";
import { usePublicClient, useWalletClient } from "wagmi";
import type {
  Abi,
  Address,
  WriteContractParameters,
  Hash,
  TransactionRequest,
} from "viem";
import IZkSync from "../constants/abi/IZkSync.json";
import IL1Bridge from "../constants/abi/IL1Bridge.json";
import WrappedMNTAbi from "../constants/abi/WrappedMNT.json";
import IERC20 from "../constants/abi/IERC20.json";
import secondaryAbi from "../constants/abi/ZkLink.json";
import primaryGetterAbi from "../constants/abi/GettersFacet.json";
import { useAccount } from "wagmi";
import { useCallback, useState, useMemo } from "react";
import { Provider } from "zksync-web3";
import { l1EthDepositAbi } from "./abi";
import { Interface } from "ethers/lib/utils";
import {
  getERC20BridgeCalldata,
  applyL1ToL2Alias,
  isETH,
  scaleGasLimit,
  sleep,
} from "@/utils";
import { WalletClient, decodeEventLog } from "viem";
import { getPublicClient } from "@wagmi/core";

import { useBridgeNetworkStore } from "./useNetwork";
import { ForwardL2Request, FullDepositFee } from "@/types";
import { suggestMaxPriorityFee } from "@rainbow-me/fee-suggestions";
import { WRAPPED_MNT } from "@/constants";

import { zkSyncProvider, LineaProvider } from "./zksyncProviders";
import BigNum from "bignumber.js";
import { IL1BridgeFactory } from "@/constants/typechain";
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

  const provider = useMemo(() => {
    if (!networkKey) return;
    return new Provider(eraNetwork.rpcUrl);
  }, [eraNetwork.rpcUrl, networkKey]);

  const getDefaultBridgeAddresses = useCallback(async () => {
    return {
      erc20L1: eraNetwork.erc20BridgeL1,
      erc20L2: eraNetwork.erc20BridgeL2,
    };
  }, [eraNetwork.erc20BridgeL1, eraNetwork.erc20BridgeL2]);
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
  const { chainId } = useAccount();
  const networkKey = useBridgeNetworkStore.getState().networkKey;
  console.log("networkKey: ", networkKey);
  const publicClient = usePublicClient({ config, chainId });
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [loading, setLoading] = useState(false);
  const { provider: providerL2, getDefaultBridgeAddresses } =
    useZksyncProvider();

  const isZkSyncChain = useMemo(() => {
    return networkKey === "zksync";
  }, [networkKey]);

  const isLineaChain = useMemo(() => {
    return networkKey === PRIMARY_CHAIN_KEY;
  }, [networkKey]);

  const isArbitrum = useMemo(() => {
    return networkKey === "arbitrum";
  }, [networkKey]);

  const isManta = useMemo(() => {
    return networkKey === "manta";
  }, [networkKey]);

  const isBlast = useMemo(() => {
    return networkKey === "blast";
  }, [networkKey]);

  const isMantle = useMemo(() => {
    return networkKey === "mantle";
  }, [networkKey]);

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
    isMergeSelected?: boolean,
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
        provider1,
        isMergeSelected
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
    console.log("publicClient: ", publicClient, result);

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
      return Promise.reject(e);
    }
  };

  const sendDepositTx = async (
    token: Address,
    amount: BigNumberish,
    nativeBalance: BigNumberish,
    isMergeSelected?: boolean
  ) => {
    const network = nodeConfig.find((item) => item.key === networkKey);
    if (!address || !network) {
      return;
    }
    try {
      setLoading(true);

      // const l2GasLimit = await estimateDefaultBridgeDepositL2Gas(
      //   token,
      //   amount,
      //   address
      // );
      // const baseCost = await getBaseCost(l2GasLimit);
      // console.log("l2GasLimit: ", l2GasLimit.toString());
      const fee = await getEstimateFee(token);
      const baseCost = fee?.baseCost;
      const l2GasLimit = fee?.l2GasLimit;
      const overrides =
        networkKey === "ethereum"
          ? { gasPrice: fee?.gasPrice, gasLimit: fee?.l1GasLimit }
          : {
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
            functionName: isMergeSelected ? "depositToMerge" : "deposit",
            args: [
              address,
              WRAPPED_MNT,
              amount,
              l2GasLimit,
              REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT,
              address,
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
              "0x",
              l2GasLimit,
              REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT,
              [],
              address,
            ],
          };
          tx.value = BigNumber.from(baseCost).add(amount).toBigInt();
          // handle gas for linea and arb
          const face = new Interface(IZkSync.abi);
          const txData = face.encodeFunctionData("requestL2Transaction", [
            address,
            amount,
            "0x",
            l2GasLimit,
            REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT,
            [],
            address,
          ]) as `0x${string}`;
          if (isZkSyncChain) {
            const fee = await zkSyncProvider.attachEstimateFee()({
              from: address,
              to: network.mainContract!,
              value: BigNumber.from(tx.value).toHexString(),
              data: txData,
            });
            console.log("zksync chain fee for ETH", fee);

            overrides.maxFeePerGas = fee.maxFeePerGas;
            overrides.maxPriorityFeePerGas = fee.maxPriorityFeePerGas;
            overrides.gasLimit = fee.gasLimit;
          }

          if (isArbitrum || isManta || isMantle || isBlast) {
            const provider = walletClientToProvider(walletClient!);
            const gasPrice = await provider.getGasPrice();
            overrides.gasPrice = gasPrice;
            delete overrides.maxFeePerGas;
            delete overrides.maxPriorityFeePerGas;
          }
        }
      } else {
        const bridgeContract = network.erc20BridgeL1;
        tx = {
          address: bridgeContract!,
          abi: IL1Bridge.abi as Abi,
          functionName: isMergeSelected ? "depositToMerge" : "deposit",
          args: [
            address,
            token,
            amount,
            l2GasLimit,
            REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT,
            address,
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
        //handle zksync and linea gas
        const face = new Interface(IL1Bridge.abi);
        const txData = face.encodeFunctionData(
          isMergeSelected ? "depositToMerge" : "deposit",
          [
            address,
            token,
            amount,
            l2GasLimit,
            REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT,
            address,
          ]
        ) as `0x${string}`;
        if (isZkSyncChain) {
          const fee = await zkSyncProvider.attachEstimateFee()({
            from: address,
            to: bridgeContract,
            value: BigNumber.from(tx.value).toHexString(),
            data: txData,
          });
          console.log("zksync chain fee for ERC20", fee);

          overrides.maxFeePerGas = fee.maxFeePerGas;
          overrides.maxPriorityFeePerGas = fee.maxPriorityFeePerGas;
          overrides.gasLimit = fee.gasLimit;
        }

        // if (isLineaChain) {
        //   const fee = await LineaProvider.attachEstimateFee()({
        //     from: address,
        //     to: bridgeContract,
        //     value: BigNumber.from(tx.value).toHexString(),
        //     data: txData,
        //   });
        //   console.log("linea fee for ERC20", fee);
        //   // TODO will use the gas price data from @rainbow-me/fee-suggestions
        //   overrides.gasLimit = fee.gasLimit.mul(110).div(100);
        //   delete overrides.maxFeePerGas;
        //   delete overrides.maxPriorityFeePerGas;
        // }
        if (isArbitrum) {
          const provider = walletClientToProvider(walletClient!);
          const gasPrice = await provider.getGasPrice();
          overrides.gasPrice = gasPrice;
          delete overrides.maxFeePerGas;
          delete overrides.maxPriorityFeePerGas;
        }
      }
      if (overrides.maxFeePerGas && overrides.maxPriorityFeePerGas) {
        tx.maxFeePerGas = overrides.maxFeePerGas;
        tx.maxPriorityFeePerGas = overrides.maxPriorityFeePerGas;
        tx.gas = overrides.gasLimit.mul(150).div(100);
      } else if (overrides.gasPrice) {
        tx.gasPrice = overrides.gasPrice;
      } else {
        tx.gas = overrides.gasLimit;
      }
      if (new BigNum(tx.value.toString()).gt(nativeBalance.toString())) {
        return Promise.reject(
          new Error(
            `"Insufficient Gas Token Balance. Tx value: ${tx.value.toString()}, base cost: ${baseCost.toString()},  gas balance: ${nativeBalance.toString()}`
          )
        );
      }
      const hash = (await walletClient?.writeContract(tx)) as `0x${string}`;
      console.log("tx hash: ", hash);
      //set a timeout
      await sleep(1000);
      try {
        const res = await publicClient?.waitForTransactionReceipt({ hash });
        console.log("tx res: ", res);
      } catch (e) {
        // maybe not found. But tx is sent and will succeed
        console.error("tx errpr: ", e);
      }

      return hash;
    } catch (e) {
      console.log(e);
      return Promise.reject(e);
    } finally {
      setLoading(false);
    }
  };

  const getDepositL2TransactionHash = useCallback(
    async (l1TransactionHash: string) => {
      const transaction = await publicClient?.waitForTransactionReceipt({
        hash: l1TransactionHash as Hash,
      });
      for (const log of transaction?.logs ?? []) {
        try {
          const { args, eventName } = decodeEventLog({
            abi: IZkSync.abi,
            data: log.data,
            topics: log.topics,
          });
          if (eventName === "NewPriorityRequest") {
            return (args as unknown as { txHash: Hash }).txHash;
          }
        } catch {
          // ignore failed decoding
        }
      }
      throw new Error("No L2 transaction hash found");
    },
    [publicClient]
  );

  const getCanonicalTxHash = useCallback(
    async (forwardHash: Hash): Promise<Hash | undefined> => {
      const primaryNetwork = nodeConfig.find(
        (item) => item.key === PRIMARY_CHAIN_KEY
      );
      const web3Provider = new ethers.providers.Web3Provider(
        getPublicClient(config, {
          chainId: primaryNetwork!.l1Network?.id,
        }) as any,
        "any"
      );
      const voidSigner = new VoidSigner(address || ETH_ADDRESS, web3Provider);

      // const l2Provider = new Provider(primaryNetwork!.rpcUrl);
      const l1Provider = voidSigner.provider;
      const contractAddress = primaryNetwork!.mainContract;
      const iface = new Interface(primaryGetterAbi.abi);
      const tx: ethers.providers.TransactionRequest = {
        to: contractAddress,
        data: iface.encodeFunctionData("getCanonicalTxHash", [forwardHash]),
      };
      const ctx = (await l1Provider!.call(tx)) as Hash;

      if (
        ctx ==
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      ) {
        return undefined;
      }
      return ctx;
    },
    [address]
  );

  const getDepositL2TransactionHashForSecondary = useCallback(
    async (l1TransactionHash: string): Promise<Hash> => {
      const transaction = await publicClient?.waitForTransactionReceipt({
        hash: l1TransactionHash as Hash,
      });
      console.log("getDepositL2TransactionHashForSecondary", l1TransactionHash);
      let forwardL2Request: ForwardL2Request | undefined;
      for (const log of transaction?.logs ?? []) {
        try {
          const { args, eventName } = decodeEventLog({
            abi: secondaryAbi.abi,
            data: log.data,
            topics: log.topics,
          });
          if (eventName === "NewPriorityRequest") {
            forwardL2Request = (
              args as unknown as { l2Request: ForwardL2Request }
            ).l2Request;
          }
        } catch {
          // ignore failed decoding
        }
      }

      if (!forwardL2Request) {
        throw new Error("No L2 transaction hash found");
      }

      const abicoder = new ethers.utils.AbiCoder();
      const encodedata = abicoder.encode(
        [
          "(bytes32,address,bool,address,uint256,address,uint256,bytes32,uint256,uint256,bytes32,address)",
        ],
        [
          [
            "0xe0aaca1722ef50bb0c9b032e5b16ce2b79fa9f23638835456b27fd6894f8292c",
            forwardL2Request.gateway,
            forwardL2Request.isContractCall,
            forwardL2Request.sender,
            forwardL2Request.txId,
            forwardL2Request.contractAddressL2,
            forwardL2Request.l2Value,
            ethers.utils.keccak256(forwardL2Request.l2CallData),
            forwardL2Request.l2GasLimit,
            forwardL2Request.l2GasPricePerPubdata,
            ethers.utils.keccak256(
              abicoder.encode(["bytes[]"], [forwardL2Request.factoryDeps])
            ),
            forwardL2Request.refundRecipient,
          ],
        ]
      );
      const forwardHash = ethers.utils.keccak256(encodedata) as Hash;
      console.log(forwardHash);
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const canonicalTxHash = await getCanonicalTxHash(forwardHash);
        if (canonicalTxHash) return canonicalTxHash;
        await sleep(5000);
      }
    },
    [getCanonicalTxHash, publicClient]
  );

  const getDepositL2TxHash = useCallback(
    async (l1TransactionHash: Hash) => {
      if (networkKey === PRIMARY_CHAIN_KEY) {
        return getDepositL2TransactionHash(l1TransactionHash);
      } else {
        return getDepositL2TransactionHashForSecondary(l1TransactionHash);
      }
    },
    [
      getDepositL2TransactionHash,
      getDepositL2TransactionHashForSecondary,
      networkKey,
    ]
  );

  return {
    sendDepositTx,
    loading,
    getDepositL2TransactionHash,
    getDepositL2TransactionHashForSecondary,
    getDepositL2TxHash,
  };
};
