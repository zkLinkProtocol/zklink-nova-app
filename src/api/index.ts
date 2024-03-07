import http from "@/utils/http";

type Response = {
    result: any
    status: string
    messag: string
}

export const getInviteByAddress = (account: string): Promise<Response> => http.get(`/api/invite/${account}`)

export const getAccounTvl = (address: string) => http.get(`/points/addressTokenTvl/getAccounTvl`, {
    params: { address }
})