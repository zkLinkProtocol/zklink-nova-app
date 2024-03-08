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
  twitterName: string;
  twitterHandler: string;
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

export const getInvite = (address: string): Promise<Response> =>
  http.get(`${BASE_URL_API}/invite/${address}`);

export const getReferrer = (address: string): Promise<Response> =>
  http.get(`${BASE_URL_API}/referrer/${address}`);

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

export const getAccountTwitter = (code: string): Promise<Response> =>
  http.post(`${BASE_URL_API}/invite/account/twitter`, {
    code,
  });

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

export const getSupportedTokens = (): Promise<SupportToken[]> =>
  http.get(`${BASE_URL_TOKENS}/getSupportTokens`);
