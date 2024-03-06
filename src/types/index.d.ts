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
  key: string
  label: string
  align?: 'start' | 'center' | 'end'
}

export type Twitter = {
  id: string
  name: string
  username: string // twitter handle
}