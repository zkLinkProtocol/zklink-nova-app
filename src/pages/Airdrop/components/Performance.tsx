import React from 'react'
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
    return (
        <PerformanceBox className='performance-box flex justify-center align-center gap-[4rem]'>
            <span className='performance-item'>Current TVL: 193,321,432</span>
            <span className='ml-5 performance-item'>Activtive Users: 193,000</span>
        </PerformanceBox>
    )
}

export default Performance
