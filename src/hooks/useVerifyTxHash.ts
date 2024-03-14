import { Hash, decodeEventLog } from "viem";
import { providers } from "ethers";
import { abi as DepositAbi } from "@/constants/depositAbi";
import {
  getNetworkKeyByMainContract,
  getPrimaryChainMainContract,
  getNetworkKeyByL1Erc20Bridge,
} from "./utils";
import { ForwardL2Request } from "@/constants/DepositEventTypes";
import { ETH_ADDRESS } from "@/constants";
export interface DepositTx {
  from: string;
  token: string;
  amount: bigint;
}
const useVerifyTxHash = () => {
  const secondaryNewPriorityRequestHandler = (
    args: any[any],
    address: string
  ): DepositTx | null => {
    if (getNetworkKeyByMainContract(address)) {
      const forwardL2Request = args["l2Request"] as ForwardL2Request;
      if (BigInt(forwardL2Request.l2Value as string) === 0n) {
        return null;
      }
      return {
        from: forwardL2Request.sender, // maybe erc20 bridge
        token: ETH_ADDRESS,
        amount: BigInt(forwardL2Request.l2Value as string),
      };
    }
    return null;
  };
  const primaryNewPriorityRequestHandler = (
    args: any[any],
    address: string
  ): DepositTx | null => {
    if (
      address.toLowerCase() === getPrimaryChainMainContract()?.toLowerCase()
    ) {
      const transaction: {
        value: string;
        to: bigint;
      } = args["transaction"];
      if (BigInt(transaction.value) === 0n) {
        return null;
      }
      return {
        from: transaction.to.toString(16),
        token: ETH_ADDRESS,
        amount: BigInt(transaction.value),
      };
    }
    return null;
  };

  const DepositInitiatedHandler = (
    args: any[any],
    address: string
  ): DepositTx | null => {
    if (getNetworkKeyByL1Erc20Bridge(address)) {
      return {
        from: args["to"],
        token: args["l1Token"],
        amount: args["amount"],
      };
    }
    return null;
  };

  const verifyTxhash = async (
    rpcUrl: string,
    txHash: string
  ): Promise<DepositTx> => {
    const provider = new providers.JsonRpcProvider(rpcUrl);

    const txReceipt = await provider.getTransactionReceipt(txHash);

    if (!txReceipt) {
      throw new Error("tx hash not found"); //TODO should use enum
    }
    const depositTxs: DepositTx[] = [];
    for (const log of txReceipt.logs) {
      // log.address
      try {
        const { args, eventName } = decodeEventLog({
          abi: DepositAbi,
          data: log.data as Hash,
          topics: log.topics as [Hash], //,
          strict: true,
        });
        if (eventName === "NewPriorityRequest") {
          let res;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const args2 = args as any[];
          if (args && args2["l2Request"]) {
            //secondary deposit
            res = secondaryNewPriorityRequestHandler(args, log.address);
          } else if (args && args2["transaction"]) {
            //primary deposit
            res = primaryNewPriorityRequestHandler(args, log.address);
          }
          if (res) {
            depositTxs.push(res);
          }
        }

        if (eventName === "DepositInitiated") {
          //ERC20 deposit
          const res = DepositInitiatedHandler(args as any[], log.address);
          if (res) {
            depositTxs.push(res);
          }
        }
      } catch {}
    }
    if (depositTxs.length === 0) {
      throw new Error("deposit not found");
    }
    return depositTxs[0];
  };

  return {
    verifyTxhash,
  };
};
export default useVerifyTxHash;
