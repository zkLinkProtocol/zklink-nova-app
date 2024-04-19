export type Token = {
  address: string;
  l1Address?: string;
  name?: string;
  symbol: string;
  decimals: number;
  iconUrl?: string;
  price?: TokenPrice;
  networkKey?: string;
};

export type Address = Hash;
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

export type TableColumnItem = {
  key: string;
  label: string;
  align?: "start" | "center" | "end";
};

export type Twitter = {
  id: string;
  name: string;
  username: string; // twitter handle
};

export interface FullDepositFee {
  maxFeePerGas?: BigNumber;
  maxPriorityFeePerGas?: BigNumber;
  gasPrice?: BigNumber;
  baseCost: BigNumber;
  l1GasLimit: BigNumber;
  l2GasLimit: BigNumber;
}
export type Invite = {
  address: string;
  code: string | null;
  canInviteNumber: number;
  maxInviteNumber: number;
  isLeader?: boolean;
  twitterName: string | null;
  twitterHandler: string | null;
  beInvited?: boolean;
  kolGroup?: boolean;
  points?: number;
  triplePoints?: boolean;
};
