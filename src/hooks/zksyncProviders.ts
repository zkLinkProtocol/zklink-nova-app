import { BigNumber, ethers } from "ethers";
import { TransactionRequest } from "viem";

/** Represents the transaction fee parameters. */
export interface Fee {
  /** The maximum amount of gas allowed for the transaction. */
  gasLimit: BigNumber;
  /** The maximum amount of gas the user is willing to pay for a single byte of pubdata. */
  gasPerPubdataLimit?: BigNumber;
  /** The EIP1559 tip per gas. */
  maxPriorityFeePerGas: BigNumber;
  /** The EIP1559 fee cap per gas. */
  maxFeePerGas: BigNumber;
  /** only for mantle and manta  */
  L1Fee: BigNumber;
}
export class zkSyncProvider {
  public provider: ethers.providers.Provider;
  constructor(provider: ethers.providers.Provider) {
    this.provider = provider;
  }

  static attachEstimateFee() {
    //TODO shoule be use config to get the provider
    const instance = new zkSyncProvider(new ethers.providers.JsonRpcProvider("https://mainnet.era.zksync.io"));
    return instance.estimateFee.bind(instance.provider);
  }

  async estimateFee(transaction: TransactionRequest): Promise<Fee> {
    const fee = await this.send("zks_estimateFee", [transaction]);
    return {
      gasLimit: BigNumber.from(fee.gas_limit),
      gasPerPubdataLimit: BigNumber.from(fee.gas_per_pubdata_limit),
      maxPriorityFeePerGas: BigNumber.from(fee.max_priority_fee_per_gas),
      maxFeePerGas: BigNumber.from(fee.max_fee_per_gas),
      L1Fee: BigNumber.from(0), //TODO no need to support L1Fee
    };
  }
}

export class LineaProvider {
  public provider: ethers.providers.Provider;
  constructor(provider: ethers.providers.Provider) {
    this.provider = provider;
  }

  static attachEstimateFee() {
    //TODO shoule be use config to get the provider
    const instance = new LineaProvider(new ethers.providers.JsonRpcProvider("https://rpc.linea.build"));
    return instance.estimateFee.bind(instance.provider);
  }

  async estimateFee(transaction: TransactionRequest): Promise<Fee> {
    const fee = await this.send("linea_estimateGas", [transaction]);
    const baseFeePerGas = BigNumber.from(fee.baseFeePerGas);
    const maxPriorityFeePerGas = BigNumber.from(fee.priorityFeePerGas);
    return {
      gasLimit: BigNumber.from(fee.gasLimit).mul(12).div(10),
      maxPriorityFeePerGas,
      maxFeePerGas: baseFeePerGas.mul(2).add(maxPriorityFeePerGas),
      L1Fee: BigNumber.from(0), //TODO no need to support L1Fee
    };
  }
}