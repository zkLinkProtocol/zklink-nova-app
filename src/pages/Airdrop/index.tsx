// import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import Landing from './Landing'
import SoftKYC from './SoftKYC'
import { useDispatch, useSelector } from 'react-redux'
import { useAccount } from 'wagmi'
import Bridge from './Bridge'
import Dashboard from './Dashboard'
import axios from 'axios'
import { setInvitedUser } from '@/store/modules/airdrop'

const STATUS_CODE = {
    landing: 0,
    softKYC: 1,
    deposit: 2,
    dashboard: 3,
}

export default function Airdrop() {
    const { address, isConnected } = useAccount()
    const dispatch = useDispatch()
    const { inviteCode, isGroupLeader, signature, twitter, isInvitedUser } = useSelector((store: any) => store.airdrop)
    const [status, setStatus] = useState(STATUS_CODE.landing)

    const getInvite = async () => {
        const res = await axios.get(`/api/invite/${address}`)
        console.log(res)
        if (res.data && +res.data?.status === 0) {
            const { beInvited } = res.data?.result
            dispatch(setInvitedUser(beInvited))
        }
    }

    useEffect(() => {
        isConnected && getInvite()
    }, [isConnected])

    useEffect(() => {
        let _status = STATUS_CODE.landing

        if (isInvitedUser) {
            _status = STATUS_CODE.dashboard
        } else if ((inviteCode || isGroupLeader) && twitter && isConnected && signature) {
            _status = STATUS_CODE.deposit
        } else if (inviteCode || isGroupLeader) {
            _status = STATUS_CODE.softKYC
        }
        console.log('_status', _status)
        setStatus(_status)
    }, [inviteCode, isGroupLeader, twitter, isConnected, signature])

    return (
        <>
            {status === STATUS_CODE.landing && <Landing />}
            {status === STATUS_CODE.softKYC && <SoftKYC />}
            {status === STATUS_CODE.deposit && <Bridge />}
            {status === STATUS_CODE.dashboard && <Dashboard />}
        </>
    )
}
