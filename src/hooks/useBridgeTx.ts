import { nexusGoerliNode, nexusNode, wagmiConfig } from "../constants/networks";
import { BigNumber, utils, BigNumberish } from "ethers";
import { usePublicClient, useWalletClient } from "wagmi";
import { readContract } from "@wagmi/core";
import type { Address } from "viem";
import IZkSync from "../constants/abi/IZkSync.json";
import IL1Bridge from "../constants/abi/IL1Bridge.json";
import { useAccount } from "wagmi";
import { useState } from "react";

const networkKey: string = "goerli"; //TODO get from store
const nodeType = import.meta.env.VITE_NODE_TYPE;
const nodeConfig = nodeType === "nexus-goerli" ? nexusGoerliNode : nexusNode;

const ETH_ADDRESS = "0x0000000000000000000000000000000000000000";
export const REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT = 800;

const L2TxGasLimit = 500000; //TODO get from sdk
export const useBridgeTx = () => {
  const publicClient = usePublicClient();
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient({ chainId: 5 });
  const [loading, setLoading] = useState(false);
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
    try {
      setLoading(true);
      const feeData = await getFeeData();
      const gasPriceForEstimation = feeData?.maxFeePerGas || feeData?.gasPrice;
      const gasPrice =
        networkKey === "primary"
          ? BigNumber.from(await gasPriceForEstimation!).mul(2)
          : await getTxGasPrice();
      const zksyncContract = nodeConfig.find(
        (item) => item.key === networkKey
      )?.mainContract;
      const baseCost = (await readContract(wagmiConfig, {
        abi: IZkSync.abi,
        address: zksyncContract as `0x${string}`,
        functionName: "l2TransactionBaseCost",
        args: [
          gasPrice.toString(),
          L2TxGasLimit,
          REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT,
        ],
      })) as BigNumber;
      console.log("baseCost: ", baseCost);
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
            L2TxGasLimit,
            REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT,
            [],
            address,
          ],
        };
        tx.value = BigNumber.from(baseCost).add(amount);
      } else {
        tx = {
          address: nodeConfig.find((item) => item.key === networkKey)
            ?.erc20BridgeL1,
          abi: IL1Bridge.abi,
          functionName: "deposit",
          args: [
            address,
            token,
            amount,
            L2TxGasLimit,
            REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT,
          ],
        };
        tx.value = baseCost;
      }

      const hash = await walletClient?.writeContract(tx);
      const res = await publicClient?.waitForTransactionReceipt(hash);
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
