import InviteCode from './components/InviteCode'
import Performance from './components/Performance'
import Step from './components/Step'
import { useSelector } from 'react-redux'

export default function Airdrop() {
    const { currentStatus } = useSelector((store: any) => store.airdrop)

    return (
        <div className='relative px-6'>
            {currentStatus === 0 && <InviteCode />}
            {currentStatus === 1 && <Step />}
            <Performance />
        </div>
    )
}
