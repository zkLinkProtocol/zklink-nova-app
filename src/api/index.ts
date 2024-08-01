import http from "@/utils/http";
import { user } from "@nextui-org/react";
import axios, { AxiosResponse } from "axios";
import qs from "qs";

const isProd = import.meta.env.PROD;
const apiBaseURL = import.meta.env.VITE_API_BASE_URL;

export const BASE_URL = isProd ? apiBaseURL : "/app-api";
export const BASE_URL_API = `${BASE_URL}/api`;
export const BASE_URL_POINTS = `${BASE_URL}/points`;
export const BASE_URL_TOKENS = `${BASE_URL}/tokens`;
export const BASE_URL_TWITTER = `${BASE_URL}/twitter`;
export const BASE_URL_LRT_POINTS = `${BASE_URL}/lrt-points`;
export const BASE_URL_QUEST = `${BASE_URL}/quest-api`;

export interface APIResponse<T = any> {
  status: string;
  message: string;
  result?: T;
  error?: any;
  data?: T;
  statusCode?: number;
}

export type BindInviteCodeWithAddressParams = {
  address: string;
  code?: string | null;
  siganture: string;
  accessToken: string;
};
export const bindInviteCodeWithAddress = (
  data: BindInviteCodeWithAddressParams
): Promise<APIResponse> => {
  console.log(data);
  if (!data.code) {
    delete data.code;
  }
  return http.post(`${BASE_URL_API}/invite/bind/twitter`, {
    ...data,
  });
};

export const checkInviteCode = (code: string): Promise<APIResponse> => {
  return http.get(`${BASE_URL_API}/invite/validCode`, {
    params: {
      code,
    },
  });
};

export const getRemainDrawCount = (address: string): Promise<APIResponse> => {
  return http.get(`${BASE_URL_API}/invite/draw/nft/remain`, {
    params: { address },
  });
};

export const drawTrademarkNFT = (address: string): Promise<APIResponse> => {
  return http.post(`${BASE_URL_API}/invite/draw/nft`, {
    address,
  });
};

export const getRemainMysteryboxDrawCount = (
  address: string
): Promise<APIResponse> => {
  return http.get(`${BASE_URL_API}/invite/draw/mysterybox/remain`, {
    params: { address },
  });
};

export const getRemainMysteryboxDrawCountV2 = (
  address: string
): Promise<APIResponse> => {
  return http.get(`${BASE_URL_API}/invite/draw/mysterybox/v2/remain`, {
    params: { address },
  });
};

// for mint box params
export const mintMysteryboxNFT = (address: string): Promise<APIResponse> => {
  return http.post(`${BASE_URL_API}/invite/mint/mysterybox`, {
    address,
  });
};

export const mintMysteryboxNFTV2 = (address: string): Promise<APIResponse> => {
  return http.post(`${BASE_URL_API}/invite/mint/mysterybox/v2`, {
    address,
  });
};

export const openMysteryboxNFT = (address: string): Promise<APIResponse> => {
  return http.post(`${BASE_URL_API}/invite/open/mysterybox`, {
    address,
  });
};

export const openMysteryboxNFTV2 = (address: string): Promise<APIResponse> => {
  return http.post(`${BASE_URL_API}/invite/open/mysterybox/v2`, {
    address,
  });
};

export const getRemainMysteryboxOpenableCount = (
  address: string
): Promise<APIResponse> => {
  return http.get(`${BASE_URL_API}/invite/open/mysterybox/remain`, {
    params: { address },
  });
};

export const getRemainMysteryboxOpenableCountV2 = (
  address: string
): Promise<APIResponse> => {
  return http.get(`${BASE_URL_API}/invite/open/mysterybox/v2/remain`, {
    params: { address },
  });
};

export const getMintSignature = (address: string): Promise<APIResponse> => {
  return http.get(`${BASE_URL_API}/invite/validate/nft`, {
    params: { address, projectId: "NOVA-SBT-1" },
  });
};
export const getInvite = (address: string): Promise<APIResponse> =>
  http.get(`${BASE_URL_API}/invite/${address}`);

export const getReferrer = (address: string): Promise<APIResponse> =>
  http.get(`${BASE_URL_API}/referrer/${address}`);

export const getDepositETHThreshold = (): Promise<{ ethAmount: number }> =>
  http.get(`${BASE_URL_POINTS}/addressTokenTvl/getDepositEthThreshold`);

export const getAccounTvl = (address: string): Promise<APIResponse> =>
  http.get(`${BASE_URL_POINTS}/addressTokenTvl/getAccounTvl`, {
    params: { address },
  });

export const getAccountPoint = (address: string): Promise<APIResponse> =>
  http.get(`${BASE_URL_POINTS}/addressTokenTvl/getAccountPoint`, {
    params: { address },
  });

export const getTotalTvl = (): Promise<APIResponse> =>
  http.get(`${BASE_URL_POINTS}/addressTokenTvl/getTotalTvl`);
export const getActiveAccounts = (): Promise<APIResponse> =>
  http.get(`${BASE_URL_API}/invite/getActiveAccounts`);

export const getAccountTvl = (address: string): Promise<APIResponse> =>
  http.get(`${BASE_URL_POINTS}/addressTokenTvl/getAccounTvl`, {
    params: {
      address,
    },
  });

export const getGroupTvl = (address: string): Promise<APIResponse> =>
  http.get(`${BASE_URL_POINTS}/addressTokenTvl/getGroupTvl`, {
    params: {
      address,
    },
  });

export const getTotalTvlByToken = (): Promise<APIResponse> =>
  http.get(`${BASE_URL_POINTS}/addressTokenTvl/getTotalTvlByToken`);

export const getReferralTvl = (address: string): Promise<APIResponse> =>
  http.get(`${BASE_URL_POINTS}/addressTokenTvl/getReferralTvl`, {
    params: { address },
  });

export const getAccountTwitter = (params: any): Promise<APIResponse> =>
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
  multipliers: { multiplier: number; timestamp: number }[];
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

export const getAccountRefferalsTVL = (
  address: string,
  page = 1,
  limit = 100
): Promise<APIResponse> =>
  http.get(`${BASE_URL_POINTS}/addressTokenTvl/getAccountRefferalsTVL`, {
    params: { address, page, limit },
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

export const getAccountsRank = (params?: PageParams): Promise<APIResponse> =>
  http.get(`${BASE_URL_POINTS}/addressTokenTvl/getAccountsRank`, {
    params,
  });

export const getAccountRank = (address: string): Promise<APIResponse> =>
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
): Promise<APIResponse> => {
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
): Promise<APIResponse> => {
  console.log(data);
  if (!data.code) {
    delete data.code;
  }
  return http.post(`${BASE_URL_API}/invite/register/account`, {
    ...data,
  });
};

export const registerAccountByBridge = (data: {
  address: string;
  code: string;
  siganture: string;
}): Promise<APIResponse> =>
  http.post(`${BASE_URL_API}/invite/register/account/byBridge`, { ...data });

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

export const checkOkx = (address: string): Promise<APIResponse> =>
  http.get(`${BASE_URL_API}/invite/check/okx`, {
    params: { addressList: [address] },
  });

export const visitReward = (address: string): Promise<APIResponse> =>
  http.get(`${BASE_URL_API}/invite/visit/reward`, {
    params: { address },
  });

export const okxVisitTask = (address: string): Promise<APIResponse> =>
  http.get(`${BASE_URL_API}/task/okx/visit/task`, { params: { address } });

export const getEigenlayerPoints = (address: string) =>
  http.get(`${BASE_URL_LRT_POINTS}/points/forward/puffer/zklink_point`, {
    params: { address },
    headers: {
      "client-id": "08879426f59a4b038b7755b274bc19dc",
    },
  });

export const getPufferPoints = (address: string) =>
  http.get(`${BASE_URL_LRT_POINTS}/points/${address}/pufferpoints`);

export interface MagPieResponse {
  errno: number;
  errmsg: string;
  data: [
    {
      address: string;
      tokenAddress: string;
      points: {
        eigenpiePoints: number;
        eigenLayerPoints: number;
      };
      updatedAt: number;
    }
  ];
}

export const getMagPiePoints = (address: string): Promise<MagPieResponse> =>
  http.get(`${BASE_URL_LRT_POINTS}/magpie/points`, {
    params: { address },
  });

export interface RenzoResponse {
  errno: number;
  errmsg: string;
  data: [
    {
      address: string;
      tokenAddress: string;
      points: {
        renzoPoints: number;
        eigenLayerPoints: number;
      };
      updatedAt: number;
    }
  ];
}
export const getRenzoPoints = (address: string): Promise<RenzoResponse> =>
  http.get(`${BASE_URL_LRT_POINTS}/renzo/points`, {
    params: { address },
  });

export const getTradeMarkRank = (address: string): Promise<APIResponse> =>
  http.get(`${BASE_URL_API}/referrer/tradeMark/balance/rank`, {
    params: { address },
  });

export const getTopInviteAndRandom = (date?: string): Promise<APIResponse> =>
  http.get(`${BASE_URL_API}/referrer/daily/topInviteAndRandom`, {
    params: { date },
  });

export interface LrtNovaPointsData {
  address: string;
  points: string;
  realPoints: number;
  balance: string;
  tokenAddress: string;
  updated_at: number;
}

export interface LrtNovaPoints {
  errno: number;
  errmsg: string;
  total_points: string;
  data: LrtNovaPointsData[];
}

export const getLayerbankNovaPoints = (
  address: string
): Promise<LrtNovaPoints> =>
  http.get(`${BASE_URL_LRT_POINTS}/nova/points`, { params: { address } });

export const getLayerbankPufferPoints = (
  address: string,
  tokenAddress: string
): Promise<LrtNovaPoints> =>
  http.get(`${BASE_URL_LRT_POINTS}/nova/points/puffer`, {
    params: { address, tokenAddress },
  });

export interface LinkswapNovaPoints {
  code: number;
  message: string;
  data: {
    address: string;
    pairs: {
      novaPoint: string;
      pair: string;
      totalPoint: string;
    }[];
  };
}
export const getLinkswapNovaPoints = (
  address: string
): Promise<LinkswapNovaPoints> =>
  http.get("https://api.linkswap.finance/api/Zklink/AddressPoint", {
    params: { address },
  });

export const getRoyaltyBooster = (address: string): Promise<APIResponse> =>
  http.get(`${BASE_URL_POINTS}/addressTokenTvl/getAccountLoyaltyBooster`, {
    params: { address },
  });

export const getNFTLashin = (address: string): Promise<APIResponse> =>
  http.get(`${BASE_URL_API}/nft/user/recruitment`, { params: { address } });

export const postNFTLashin = (address: string): Promise<APIResponse> =>
  http.post(`${BASE_URL_API}/nft/user/recruitment?address=${address}`);

export interface RsethPointsResponse {
  errno: number;
  errmsg: string;
  points: {
    elPoints: string;
    kelpMiles: string;
  };
  data: {
    address: string;
    tokenAddress: string;
    balance: string;
    points: {
      elPoints: string;
      kelpMiles: string;
    };
    updated_at: number;
  }[];
}

export const getRsethPoints = (address: string): Promise<RsethPointsResponse> =>
  http.get(`${BASE_URL_LRT_POINTS}/rseth/points`, {
    params: { address },
  });

export const getUserTvl = (address: string): Promise<APIResponse> =>
  http.get(`${BASE_URL_API}/invite/user/tvl`, {
    params: { address },
  });

export const bindTwitter = (
  address: string,
  accessToken: string
): Promise<APIResponse> => {
  return http.post(`${BASE_URL_API}/invite/bind/twitter`, {
    address,
    accessToken,
  });
};
export interface NovaProjectPoints {
  errno: number;
  errmsg: string;
  data: {
    address: string;
    poolAddress: string;
    points: string;
  }[];
}
export const getNovaProjectPoints = (
  address: string,
  project: string
): Promise<NovaProjectPoints> =>
  http.get(`${BASE_URL_LRT_POINTS}/nova/points/project`, {
    params: { address, project },
  });

export const checkBridge = async (address: string): Promise<APIResponse> =>
  http.get(`${BASE_URL_API}/invite/check/bridge`, { params: { address } });

export interface BridgePoints {
  errno: number;
  errmsg: string;
  data: number;
}
export const getBridgePoints = (name: string): Promise<BridgePoints> =>
  http.get(`${BASE_URL_LRT_POINTS}/cache/bridge/latest/points`, {
    params: { name },
  });

export const checkWinnerAddress = (address: string): Promise<APIResponse> =>
  http.get(`${BASE_URL_API}/referrer/checkWinnerAddress`, {
    params: { address },
  });

export const getEcoRamain = (address: string): Promise<APIResponse> =>
  http.get(`${BASE_URL_API}/nft/ecology/nft/remain`, {
    params: { address },
  });

export const getEcoRank = (): Promise<APIResponse> =>
  http.get(`${BASE_URL_API}/nft/ecology/rank`);

export const postEcoDraw = (address: string): Promise<APIResponse> =>
  http.post(`${BASE_URL_API}/nft/ecology/nft/draw?address=${address}`);

export const getMemeMysteryboxReward = (
  address: string
): Promise<APIResponse> =>
  http.get(`${BASE_URL_API}/meme/meme/mysterybox/reward`, {
    params: { address },
  });

export const authLogin = (data: {
  address: string;
  signature: string;
}): Promise<APIResponse> =>
  http.post(`${BASE_URL_API}/auth/login`, {
    ...data,
  });

export const getPointsDetail = (): Promise<APIResponse> =>
  http.get(`${BASE_URL_API}/referrer/points/detail`);

export const getMystery3Reamin = (address: string): Promise<APIResponse> =>
  http.get(`${BASE_URL_API}/nft/mystery3/remain`, { params: { address } });

export const drawMystery3 = (address: string): Promise<APIResponse> =>
  http.post(`${BASE_URL_API}/nft/mystery3/draw?address=${address}`);

export interface NovaCategoryUserPoints {
  category:
    | "spotdex"
    | "nativeboost"
    | "perpdex"
    | "lending"
    | "gamefi"
    | "other";
  project: string;
  holdingPoints: number;
  refPoints: number;
}

interface NovaCategoryUserResponse {
  errno: number;
  errmsg: string;
  data: NovaCategoryUserPoints[];
}

export const getNovaCategoryUserPoints = (params: {
  address: string;
  season: number;
}): Promise<NovaCategoryUserResponse> =>
  http.get(`${BASE_URL_LRT_POINTS}/nova/category/user/points`, {
    params,
  });

export interface NovaCategoryPoints {
  category:
    | "holding"
    | "spotdex"
    | "nativeboost"
    | "perpdex"
    | "lending"
    | "gamefi"
    | "other";
  referralPoints: number;
  ecoPoints: number;
  otherPoints?: number;
}

interface NovaCategoryResponse {
  errno: number;
  errmsg: string;
  data: NovaCategoryPoints[];
}

export const getNovaCategoryPoints = (params: {
  season: number;
}): Promise<NovaCategoryResponse> =>
  http.get(`${BASE_URL_LRT_POINTS}/nova/category/points`, {
    params,
  });

export interface NovaCategoryUserPointsTotal {
  category:
    | "holding"
    | "spotdex"
    | "nativeboost"
    | "perpdex"
    | "lending"
    | "gamefi"
    | "other";
  ecoPoints: number;
  referralPoints: number;
  otherPoints: number;
}

interface NovaCategoryUserPointsTotalResponse {
  errno: number;
  errmsg: string;
  data: NovaCategoryUserPointsTotal[];
}

export const getNovaCategoryUserPointsTotal = (params: {
  address: string;
  season: number;
}): Promise<NovaCategoryUserPointsTotalResponse> =>
  http.get(`${BASE_URL_LRT_POINTS}/nova/category/user/points/total`, {
    params,
  });

export interface TvlCategory {
  name: string;
  tvl: string;
}

interface TvlCategoryResponse {
  errno: number;
  errmsg: string;
  data: TvlCategory[];
}

export const getTvlCategory = (): Promise<TvlCategoryResponse> =>
  http.get(`${BASE_URL_LRT_POINTS}/tvl/category`);

export interface TvlCategoryMilestone {
  name: string;
  data: string;
  type: string;
}

interface TvlCategoryMilestoneResponse {
  errno: number;
  errmsg: string;
  data: TvlCategoryMilestone[];
}

export const getTvlCategoryMilestone =
  (): Promise<TvlCategoryMilestoneResponse> =>
    http.get(`${BASE_URL_LRT_POINTS}/tvl/category/milestone`);

export const modifyUsername = (userName: string): Promise<APIResponse> =>
  http.post(`${BASE_URL_API}/invite/modify/username`, { userName });

export interface CategoryListItem {
  username: string;
  address: string;
  totalPoints: string;
}

interface CategoryListResponse {
  errno: number;
  errmsg: string;
  data: {
    current?: {
      address: string;
      totalPoints: string;
      userIndex: number;
      username: string;
    };
    list: CategoryListItem[];
  };
}

export const getCategoryList = (
  category: string,
  params: {
    season: number;
    address?: string;
  }
): Promise<CategoryListResponse> =>
  http.get(
    `${BASE_URL_LRT_POINTS}/nova/category/${category}/list?page=1&limit=100`,
    {
      params,
    }
  );

export const dailyOpen = (): Promise<APIResponse> =>
  http.post(`${BASE_URL_API}/invite/checkin/open`);

export const dailySkipMint = (): Promise<Response> =>
  http.post(`${BASE_URL_API}/invite/skip`);

export const protocolSkipMint = (projectName: string): Promise<Response> =>
  http.post(`${BASE_URL_API}/invite/project/skip?projectName=${projectName}`);

export interface DailyCheckinHistoryData {
  date: string;
  expired: boolean;
  maxDraw: number;
  remainNum: number;
}
type PromiseResponse<T> = {
  result: T;
};
export const getDailyCheckinHistory = (): Promise<
  PromiseResponse<DailyCheckinHistoryData[]>
> => http.get(`${BASE_URL_API}/invite/checkin/history`);

export interface DailyCheckinHistoryData {
  date: string;
  expired: boolean;
  maxDraw: number;
  remainNum: number;
}

export interface ReferralPointsListItem {
  address: string;
  username: string;
  points: {
    category: string;
    point: number;
  }[];
}

interface ReferralPointsListResponse {
  errno: number;
  errmsg: string;
  data: ReferralPointsListItem[];
}

export const getReferralPointsList = (
  address: string
): Promise<ReferralPointsListResponse> => {
  return http.get(`${BASE_URL_LRT_POINTS}/nova/${address}/referrer`);
};

interface HoldpointResponse {
  errno: number;
  errmsg: string;
  data: number;
}
export const getHoldpoint = (address: string): Promise<HoldpointResponse> => {
  return http.get(`${BASE_URL_LRT_POINTS}/nova/${address}/holdpoint`);
};

export interface NovaProjectTotalPoints {
  project: string;
  ecoPoints: number;
  referralPoints: number;
}
interface NovaProjectTotalPointsResponse {
  errno: number;
  errmsg: string;
  data: NovaProjectTotalPoints[];
}

export const getNovaProjectTotalPoints =
  (): Promise<NovaProjectTotalPointsResponse> => {
    return http.get(`${BASE_URL_LRT_POINTS}/nova/project/points`);
  };

export interface CategoryZKLItem {
  name: string;
  data: string;
  type: string;
  zkl: number;
}
interface CategoryZKLResponse {
  errno: number;
  errmsg: string;
  data: CategoryZKLItem[];
}

export const getCategoryZKL = (): Promise<CategoryZKLResponse> => {
  return http.get(`${BASE_URL_LRT_POINTS}/tvl/category/milestone/s2-1`);
};

export interface PortocolSpinItem {
  projectName: string;
  remainSpinNum: number;
}

export const getProtocolSpin = (): Promise<APIResponse<PortocolSpinItem[]>> =>
  http.get(`${BASE_URL_API}/invite/protocol/spin`);

export const openProtocolSpin = (projectName: string): Promise<APIResponse> =>
  http.post(`${BASE_URL_API}/invite/protocol/open?projectName=${projectName}`);
