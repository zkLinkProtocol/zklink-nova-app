import { BigNumberish, BytesLike } from "ethers";

export type Address = string;
export type ForwardL2Request = {
  gateway: Address;
  isContractCall: boolean;
  sender: Address;
  txId: BigNumberish;
  contractAddressL2: Address;
  l2Value: BigNumberish;
  l2CallData: BytesLike;
  l2GasLimit: BigNumberish;
  l2GasPricePerPubdata: BigNumberish;
  factoryDeps: BytesLike[];
  refundRecipient: Address;
};
