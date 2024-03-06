import React, { useState } from 'react'
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
    const [performanceData] = useState({
        currentTvl: 0,
        activeUsers: 0,
    })

    return (
        <PerformanceBox className='performance-box flex justify-center align-center gap-[4rem]'>
            <span className='performance-item'>Current TVL: {performanceData.currentTvl}</span>
            <span className='ml-5 performance-item'>Active Users: {performanceData.activeUsers}</span>
        </PerformanceBox>
    )
}

export default Performance
