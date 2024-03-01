import { Tab, Tabs } from '@nextui-org/react'
import styled from 'styled-components'
import LeftSide from './components/LeftSide'
import InvitesCard from './components/InvitesCard'
import AssetsList from './components/AssetsList'
import NFTCard from './components/NFTCard'
import ReferralList from './components/ReferralList'

const DashboardBox = styled.div`
    .left {
        width: 372px;
        min-height: 100vh;
        background-color: #1a1a1a;
    }
    .right {
        width: calc(100% - 372px);
        min-height: 100vh;
    }
`

export default function Dashboard() {
    return (
        <DashboardBox className='flex'>
            <div className='left px-5 py-5'>
                <LeftSide />
            </div>
            <div className='right px-10'>
                <InvitesCard />

                <div className='py-10'>
                    <Tabs
                        size='lg'
                        variant={'underlined'}
                        aria-label='Tabs variants'>
                        <Tab
                            key='1'
                            title='Your Assets'>
                            <AssetsList />
                        </Tab>
                        <Tab
                            key='2'
                            title='Your Trademark NFTs'>
                            <NFTCard />
                        </Tab>
                        <Tab
                            key='3'
                            title='Your Referral'>
                            <ReferralList />
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </DashboardBox>
    )
}
