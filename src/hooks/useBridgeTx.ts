import { nexusGoerliNode, nexusNode } from "../constants/networks";
import { BigNumber, utils, BigNumberish, ethers } from "ethers";
import { usePublicClient, useWalletClient } from "wagmi";
import type { Address } from "viem";
import IZkSync from "../constants/abi/IZkSync.json";
import IL1Bridge from "../constants/abi/IL1Bridge.json";
import IERC20 from "../constants/abi/IERC20.json";
import { useAccount } from "wagmi";
import { useState } from "react";
import { Provider } from "zksync-web3";
import { l1EthDepositAbi } from "./abi";
import { Interface } from "ethers/lib/utils";
import { getERC20BridgeCalldata, applyL1ToL2Alias } from "@/utils";
import { WalletClient } from "viem";
import { useBridgeNetworkStore } from "./useNetwork";
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

  const getDepositEstimateGasForUseFee = async (): Promise<BigNumber> => {
    if (!address) return BigNumber.from(0);
    const l2GasLimit = await providerL2.estimateL1ToL2Execute({
      contractAddress: address,
      gasPerPubdataByte: REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT,
      caller: address,
      calldata: "0x",
      l2Value: 0,
    });
    const dummyAmount = 0; // must be 0, cause some secondary chain does not support deposit GAS Token, suck as Mantle

    const baseCost = await getBaseCost();

    const face = new Interface([l1EthDepositAbi]);
    const contractAddress = nodeConfig.find(
      (item) => item.key === networkKey
    )?.mainContract;
    const baseGasLimit: BigNumber = await publicClient!.estimateGas({
      to: contractAddress,
      value: baseCost.add(dummyAmount).toString(),
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
    return baseGasLimit.mul(2);
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
    if (!publicClient) return;
    const { block, gasPrice } = await utils.resolveProperties({
      block: publicClient.getBlock(),
      gasPrice: publicClient.getGasPrice().catch((error) => {
        // @TODO: Why is this now failing on Calaveras?
        //console.log(error);
        return null;
      }),
    });
    let lastBaseFeePerGas = null,
      maxFeePerGas = null,
      maxPriorityFeePerGas = null;

    if (block && block.baseFeePerGas) {
      // We may want to compute this more accurately in the future,
      // using the formula "check if the base fee is correct".
      // See: https://eips.ethereum.org/EIPS/eip-1559
      lastBaseFeePerGas = block.baseFeePerGas;
      maxPriorityFeePerGas = BigNumber.from("1500000000");
      maxFeePerGas = BigNumber.from(block.baseFeePerGas)
        .mul(2)
        .add(maxPriorityFeePerGas);
    }

    return { lastBaseFeePerGas, maxFeePerGas, maxPriorityFeePerGas, gasPrice };
  };

  const sendDepositTx = async (token: Address, amount: BigNumberish) => {
    if (!address) {
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
      // const l1GasLimit = await getDepositEstimateGasForUseFee();
      let tx: unknown;
      if (token === ETH_ADDRESS) {
        tx = {
          address: nodeConfig.find((item) => item.key === networkKey)
            ?.mainContract,
          abi: IZkSync.abi,
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
        tx.value = BigNumber.from(baseCost).add(amount);
      } else {
        const bridgeContract = nodeConfig.find(
          (item) => item.key === networkKey
        )?.erc20BridgeL1;
        tx = {
          address: bridgeContract!,
          abi: IL1Bridge.abi,
          functionName: "deposit",
          args: [
            address,
            token,
            amount,
            l2GasLimit,
            REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT,
          ],
        };
        tx.value = baseCost;
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
      const hash = await walletClient?.writeContract(tx);
      const res = await publicClient?.waitForTransactionReceipt({ hash });
      console.log(res);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return {
    sendDepositTx,
    loading,
  };
};
