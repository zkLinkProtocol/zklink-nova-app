import PointsLeaderboard from '@/components/PointsLeaderboard'
import NFTLeaderboard from './components/NFTLeaderboard'
import NFTLuckWinner from './components/NFTLuckWinner'
import styled from 'styled-components'
import { useState } from 'react'
import Performance from '@/components/Performance'

const BgBox = styled.div`
    position: relative;
    padding-top: 7.5rem;
    padding-bottom: 7.5rem;
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(0deg, rgba(0, 178, 255, 0.23) 0%, rgba(12, 14, 17, 0.23) 100%);
`

const ContentBg = styled.div`
    position: absolute;
    top: 7.5rem;
    left: 50%;
    transform: translate(-50%, 0);
    width: 58.875rem;
    height: calc(100vh - 7.5rem);
    border-radius: 58.875rem;
    background: rgba(0, 194, 255, 0.32);
    filter: blur(500px);
    z-index: 0;
`

const TabItem = styled.div`
    border-radius: 1rem;
    background: rgba(51, 51, 51, 0.4);
    backdrop-filter: blur(15.800000190734863px);
    color: #7b8ea0;
    font-family: Satoshi;
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 2rem; /* 200% */
    letter-spacing: -0.03125rem;
    cursor: pointer;
    &.active,
    &:hover {
        color: #fff;
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(15.800000190734863px);
    }
`

const TableBox = styled.div`
    .table {
        padding: 0 1.5rem;
        border-radius: 1rem;
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(15.800000190734863px);
    }
    .table-header {
        tr {
            border-bottom: 0.0625rem solid #546779;
        }
        th {
            padding: 1.5rem 0;
            background: none;
            color: #c6d3dd;
            font-family: Satoshi;
            font-size: 1rem;
            font-style: normal;
            font-weight: 900;
            line-height: 1.5rem; /* 150% */
        }
    }

    .table-tbody {
        tr:first-child td {
            padding: 1.5rem 0 0.75rem;
        }
        tr:last-child td {
            padding: 0.75rem 0 1.5rem;
        }
        td {
            padding: 0.75rem 0;
        }
    }
`

export default function Leaderboard() {
    const [tabsActive, setTabsActive] = useState(0)
    return (
        <>
            <BgBox>
                <ContentBg />
                <div className='px-[10.44rem] mt-[3rem]'>
                    <div className='flex items-center gap-[2rem]'>
                        <TabItem
                            className={`px-[2rem] py-[1rem] ${tabsActive === 0 ? 'active' : ''}`}
                            onClick={() => setTabsActive(0)}>
                            Points Leaderboard
                        </TabItem>
                        <TabItem
                            className={`px-[2rem] py-[1rem] ${tabsActive === 1 ? 'active' : ''}`}
                            onClick={() => setTabsActive(1)}>
                            NFT Leaderboard(daily)
                        </TabItem>
                        <TabItem
                            className={`px-[2rem] py-[1rem] ${tabsActive === 2 ? 'active' : ''}`}
                            onClick={() => setTabsActive(2)}>
                            NFT Luck Winner
                        </TabItem>
                    </div>

                    <TableBox className='mt-[2rem]'>
                        {tabsActive === 0 && <PointsLeaderboard />}
                        {tabsActive === 1 && <NFTLeaderboard />}
                        {tabsActive === 2 && <NFTLuckWinner />}
                    </TableBox>
                </div>
                <div className='absolute bottom-[4.5rem] w-full'>
                    <Performance />
                </div>
            </BgBox>
        </>
    )
}
