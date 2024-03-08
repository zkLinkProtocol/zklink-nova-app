// import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import Landing from './Landing'
import SoftKYC from './SoftKYC'
import { useDispatch, useSelector } from 'react-redux'
import { useAccount } from 'wagmi'
import Bridge from './Bridge'
import Dashboard from './Dashboard'
import { setInvite } from '@/store/modules/airdrop'
import { getInvite } from '@/api'
import { RootState } from '@/store'

const STATUS_CODE = {
    landing: 0,
    softKYC: 1,
    deposit: 2,
    dashboard: 3,
}

export default function Airdrop() {
    const { address, isConnected } = useAccount()
    const { inviteCode, isGroupLeader, signature, twitter, invite } = useSelector((store: RootState) => store.airdrop)
    const [status, setStatus] = useState(STATUS_CODE.landing)
    const dispatch = useDispatch()

    const getInviteFunc = async () => {
        if (!address) return
        try {
            const res = await getInvite(address)
            console.log('invite', res)
            if (res.result) {
                dispatch(setInvite(res.result))
                console.log('invite store', invite)
            }
        } catch (error) {
            console.log(error)
            // getInviteFunc()
        }
    }

    useEffect(() => {
        getInviteFunc()
    }, [address, isConnected])

    useEffect(() => {
        let _status = STATUS_CODE.landing

        console.log('airdrop', isConnected, invite)

        if (isConnected && invite?.code) {
            _status = STATUS_CODE.dashboard
        } else if ((inviteCode || isGroupLeader) && twitter && isConnected && signature) {
            _status = STATUS_CODE.deposit
        } else if (inviteCode || isGroupLeader) {
            _status = STATUS_CODE.softKYC
        }
        console.log('_status', _status)
        setStatus(_status)
    }, [inviteCode, isGroupLeader, twitter, isConnected, address, signature, invite])

    return (
        <>
            {status === STATUS_CODE.landing && <Landing />}
            {status === STATUS_CODE.softKYC && <SoftKYC />}
            {status === STATUS_CODE.deposit && <Bridge />}
            {status === STATUS_CODE.dashboard && <Dashboard />}
        </>
    )
}
