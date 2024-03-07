import http from "@/utils/http";

type Response = {
    result: any
    status: string
    messag: string
}

export const getInvite = (address: string): Promise<Response> => http.get(`/api/invite/${address}`)

export const getReferrer = (address: string): Promise<Response> => http.get(`/api/referrer/${address}`)

export const getAccounTvl = (address: string): Promise<Response> => http.get(`/points/addressTokenTvl/getAccounTvl`, {
    params: { address }
})

export const getAccountPoint = (address: string): Promise<Response> => http.get(`/points/addressTokenTvl/getAccountPoint`, {
    params: { address }
})