import React from 'react'
import styled from 'styled-components'

const PerformanceBox = styled.div`
    .performance-item {
        color: #999;
    }
`
const Performance: React.FC = () => {
    return (
        <PerformanceBox>
            <div className='performance-box flex justify-center align-center text-base py-5 text-center w-full'>
                <span className='performance-item'>Current TVL: 193,321,432</span>
                <span className='ml-5 performance-item'>Activtive Users: 193,000</span>
            </div>
        </PerformanceBox>
    )
}

export default Performance
