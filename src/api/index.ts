import http from "@/utils/http";

type Response = {
  status: string;
  message: string;
  result?: any;
  error?: any;
  data?: any;
};

export const BASE_URL_API = "/api";
export const BASE_URL_POINTS = "/points";
export const BASE_URL_TOKENS = "/tokens";

export type BindInviteCodeWithAddressParams = {
  address: string;
  code?: string | null;
  siganture: string;
  accessToken: string;
};
export const bindInviteCodeWithAddress = (
  data: BindInviteCodeWithAddressParams
): Promise<Response> => {
  console.log(data);
  if (!data.code) {
    delete data.code;
  }
  return http.post(`${BASE_URL_API}/invite/bind/twitter`, {
    ...data,
  });
};

export const checkInviteCode = (code: string): Promise<Response> => {
  return http.get(`${BASE_URL_API}/invite/validCode`, {
    params: {
      code,
    },
  });
};

export const getMintSignature = (address: string): Promise<Response> => {
  return http.get(`${BASE_URL_API}/invite/validate/nft`, {
    params: { address, projectId: "NOVA-SBT-1" },
  });
};
export const getInvite = (address: string): Promise<Response> =>
  http.get(`${BASE_URL_API}/invite/${address}`);

export const getReferrer = (address: string): Promise<Response> =>
  http.get(`${BASE_URL_API}/referrer/${address}`);

export const getDepositETHThreshold = (): Promise<{ ethAmount: number }> =>
  http.get(`${BASE_URL_POINTS}/addressTokenTvl/getDepositEthThreshold`);

export const getAccounTvl = (address: string): Promise<Response> =>
  http.get(`${BASE_URL_POINTS}/addressTokenTvl/getAccounTvl`, {
    params: { address },
  });

export const getAccountPoint = (address: string): Promise<Response> =>
  http.get(`${BASE_URL_POINTS}/addressTokenTvl/getAccountPoint`, {
    params: { address },
  });

export const getTotalTvl = (): Promise<Response> =>
  http.get(`${BASE_URL_POINTS}/addressTokenTvl/getTotalTvl`);
export const getActiveAccounts = (): Promise<Response> =>
  http.get(`${BASE_URL_API}/invite/getActiveAccounts`);

export const getAccountTvl = (address: string): Promise<Response> =>
  http.get(`${BASE_URL_POINTS}/addressTokenTvl/getAccounTvl`, {
    params: {
      address,
    },
  });

export const getGroupTvl = (address: string): Promise<Response> =>
  http.get(`${BASE_URL_POINTS}/addressTokenTvl/getGroupTvl`, {
    params: {
      address,
    },
  });

export const getTotalTvlByToken = (): Promise<Response> =>
  http.get(`${BASE_URL_POINTS}/addressTokenTvl/getTotalTvlByToken`);

export const getReferralTvl = (address: string): Promise<Response> =>
  http.get(`${BASE_URL_POINTS}/addressTokenTvl/getReferralTvl`, {
    params: { address },
  });

export const getAccountTwitter = (params: any): Promise<Response> =>
  http.post(`${BASE_URL_API}/invite/account/twitter`, params);

export type SupportToken = {
  address: {
    chain: string;
    l1Address: string;
    l2Address: string;
  }[];
  symbol: string;
  decimals: number;
  cgPriceId: string;
  type: string;
  yieldType: string[];
  multiplier: number;
};

export type TokenPriceInfo = {
  l2Address: string;
  l1Address: string;
  symbol: string;
  name: string;
  decimals: number;
  usdPrice: number;
  liquidity: number;
  iconURL: string;
};

export const getAccountRefferalsTVL = (address: string): Promise<Response> =>
  http.get(`${BASE_URL_POINTS}/addressTokenTvl/getAccountRefferalsTVL`, {
    params: { address },
  });

export const getSupportTokens = (): Promise<SupportToken[]> =>
  http.get(`${BASE_URL_POINTS}/tokens/getSupportTokens`);
export const getSupportedTokens = (): Promise<SupportToken[]> =>
  http.get(`${BASE_URL_POINTS}/tokens/getSupportTokens`);
export const getTokenPrice = (address: string): Promise<TokenPriceInfo> =>
  http.get(`${BASE_URL_POINTS}/tokens/${address}`);

export const getAccountsRank = (): Promise<Response> =>
  http.get(`${BASE_URL_POINTS}/addressTokenTvl/getAccountsRank`);

export const getAccountRank = (address: string): Promise<Response> =>
  http.get(`${BASE_URL_POINTS}/addressTokenTvl/getAccountRank`, {
    params: { address },
  });

export type TotalSupply = {
  type: string;
  hex: string;
};

export type ExplorerTvlItem = {
  l2Address: string;
  l1Address: string;
  networkKey: string;
  symbol: string;
  name: string;
  decimals: number;
  usdPrice: number;
  liquidity: number;
  iconURL: string;
  totalSupply: TotalSupply;
  tvl: string;
};

export const getExplorerTokenTvl = (
  isall: boolean
): Promise<ExplorerTvlItem[]> =>
  http.get(`https://explorer-api.zklink.io/tokens/tvl`, {
    params: { isall },
  });

export const validTwitter = (twitterHandler: string): Promise<Response> => {
  return http.get(`${BASE_URL_API}/invite/validTwitter`, {
    params: {
      twitterHandler,
    },
  });
};
