// import { useAccount } from 'wagmi'
import Landing from './Landing'
import SoftKYC from './SoftKYC'
import { useSelector } from 'react-redux'

export default function Airdrop() {
    // const { isConnected } = useAccount()
    // const { signature } = useSelector((store: any) => store.airdrop)

    const { inviteCode } = useSelector((store: any) => store.airdrop)
    const { isGroupLeader } = useSelector((store: any) => store.airdrop)

    return <>{inviteCode || isGroupLeader ? <SoftKYC /> : <Landing />}</>
}
