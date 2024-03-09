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
  canInviteNumber?: number;
  isLeader?: boolean;
  twitterName: string | null;
  twitterHandler: string | null;
  beInvited?: boolean;
};
