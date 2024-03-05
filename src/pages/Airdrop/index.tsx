// import { useAccount } from 'wagmi'
import Landing from './Landing'
import SoftKYC from './SoftKYC'
import { useSelector } from 'react-redux'

export default function Airdrop() {
    // const { isConnected } = useAccount()
    // const { signature } = useSelector((store: any) => store.airdrop)

    const { inviteCode } = useSelector((store: any) => store.airdrop)
    const { isTeamCreator } = useSelector((store: any) => store.airdrop)

    return <>{inviteCode || isTeamCreator ? <SoftKYC /> : <Landing />}</>
}
