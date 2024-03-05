import { useAccount } from 'wagmi'
import Landing from './Landing'
import SoftKYC from './SoftKYC'
import { useSelector } from 'react-redux'

export default function Airdrop() {
    const { isConnected } = useAccount()
    const { inviteCode } = useSelector((store: any) => store.airdrop)

    return <>{inviteCode || isConnected ? <SoftKYC /> : <Landing />}</>
}
