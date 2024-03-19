import http from "@/utils/http";
import qs from "qs";

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
export const BASE_URL_TWITTER = "/twitter";

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

export type PageParams = {
  page: number;
  limit: number;
};

export const getAccountsRank = (params?: PageParams): Promise<Response> =>
  http.get(`${BASE_URL_POINTS}/addressTokenTvl/getAccountsRank`, {
    params,
  });

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

export const validTwitter = (
  twitterHandler: string,
  address?: string
): Promise<Response> => {
  return http.get(`${BASE_URL_API}/invite/validTwitter2`, {
    params: {
      twitterHandler,
      address,
    },
  });
};

export type TxHashResponse = {
  isValid: boolean;
};

export type TxHashParams = {
  txHash: string;
  chainId: string;
  address?: string;
};
export const getTxByTxHash = (params: TxHashParams): Promise<TxHashResponse> =>
  http.get(`${BASE_URL_API}/invite/getTxByTxHash`, {
    params,
  });

export type RegisterAccountParams = {
  address: string;
  code?: string | null;
  siganture: string;
  accessToken?: string | null;
  chainId: string | number;
  txHash: string;
};

export const registerAccount = (
  data: RegisterAccountParams
): Promise<Response> => {
  console.log(data);
  if (!data.code) {
    delete data.code;
  }
  return http.post(`${BASE_URL_API}/invite/register/account`, {
    ...data,
  });
};

export type AccessTokenParams = {
  code: string;
  grant_type: string;
  client_id: string;
  redirect_uri: string;
  code_verifier: string;
};
export type AccessTokenResponse = {
  token_type: string;
  expires_in: number;
  access_token: string;
  scope: string;
};
export const getTwitterAccessToken = (
  params: AccessTokenParams
): Promise<AccessTokenResponse> =>
  http.post("/twitter/2/oauth2/token", qs.stringify({ ...params }), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

export type TwitterUserResponse = {
  data: {
    id: string;
    name: string;
    username: string;
  };
};
export const getTwitterUser = (
  accessToken: string
): Promise<TwitterUserResponse> =>
  http.get("/twitter/2/users/me", {
    headers: {
      // "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const checkOkx = (address: string): Promise<Response> =>
  http.get(`${BASE_URL_API}/invite/check/okx`, {
    params: { addressList: [address] },
  });

export const visitReward = (address: string): Promise<Response> =>
  http.get(`${BASE_URL_API}/invite/visit/reward`, {
    params: { address },
  });

export const getEigenlayerPoints = (address: string) =>
  http.get(
    "https://quest-api.puffer.fi/puffer-quest/third/query_zklink_point",
    {
      params: { address },
      headers: {
        "client-id": "08879426f59a4b038b7755b274bc19dc",
      },
    }
  );

export const getPufferPoints = (address: string): Promise<Response> =>
  http.get("", {
    params: { address },
  });
