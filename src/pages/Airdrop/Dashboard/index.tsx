import { Tab, Tabs } from '@nextui-org/react'
import styled from 'styled-components'
import LeftSide from './components/LeftSide'
import InvitesCard from './components/InvitesCard'
import NFTCard from './components/NFTCard'
import ReferralList from '@/components/ReferralList'
import AssetsTable from '@/components/AssetsTable'

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
                            <AssetsTable />
                        </Tab>
                        <Tab
                            key='2'
                            title='Your Trademark NFTs'>
                            <NFTCard />
                        </Tab>
                        <Tab
                            key='3'
                            title='Your Referral'>
                            <div className='mt-2 px-8 py-4 min-h-96 bg-stone-900 border border-white rounded-lg'>
                                <ReferralList />
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </DashboardBox>
    )
}
