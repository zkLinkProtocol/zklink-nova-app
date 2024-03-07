import { getActiveAccounts, getTotalTvl } from '@/api'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const PerformanceBox = styled.div`
    .performance-item {
        color: #c2e2ff;
        font-family: Satoshi;
        font-size: 1rem;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
    }
`
const Performance: React.FC = () => {
    const [totalTvl, setTotalTvl] = useState(0)
    const [activeUsers, setActiveUsers] = useState(0)

    const getTotalTvlFunc = async () => {
        const res = await getTotalTvl()
        console.log('total tvl', res)

        setTotalTvl(res?.result || 0)
    }

    const getActiveAccountsFunc = async () => {
        const res = await getActiveAccounts()
        console.log('active accounts', res)

        setActiveUsers(res?.result || 0)
    }

    useEffect(() => {
        getTotalTvlFunc()
        getActiveAccountsFunc()
    }, [])

    return (
        <PerformanceBox className='performance-box flex justify-center align-center gap-[4rem]'>
            <span className='performance-item'>Current TVL: {totalTvl}</span>
            <span className='ml-5 performance-item'>Active Users: {activeUsers}</span>
        </PerformanceBox>
    )
}

export default Performance
