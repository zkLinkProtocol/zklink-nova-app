import { bindInviteCodeWithAddress } from "./index";
import http from "@/utils/http";

type Response = {
  result: any;
  status: string;
  messag: string;
};

export const getInviteByAddress = (account: string): Promise<Response> =>
  http.get(`/invite/${account}`);

export type BindInviteCodeWithAddressParams = {
  address: string;
  code: string;
  signature: string;
  twitterName: string;
  twitterHandler: string;
};
export const bindInviteCodeWithAddress = (
  data: BindInviteCodeWithAddressParams
) => {
  return http.post("/invite/bind/twitter", data);
};
