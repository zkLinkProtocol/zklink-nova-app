import { Tab, Tabs } from '@nextui-org/react'
import PointsLeaderboard from '@/components/PointsLeaderboard'
import NFTLeaderboard from './components/NFTLeaderboard'
import NFTLuckWinner from './components/NFTLuckWinner'

export default function Leaderboard() {
    return (
        <div className='px-16 py-8'>
            <Tabs className='py-8'>
                <Tab
                    key='1'
                    title='Points Leaderboard'>
                    <PointsLeaderboard />
                </Tab>
                <Tab
                    key='2'
                    title='NFT Leaderboard(daily)'>
                    <NFTLeaderboard />
                </Tab>
                <Tab
                    key='3'
                    title='NFT Luck Winner'>
                    <NFTLuckWinner />
                </Tab>
            </Tabs>
        </div>
    )
}
