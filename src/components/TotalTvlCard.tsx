import { getTotalTvl } from '@/api'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

const TvlBox = styled.div`
    .tvl-num-item {
        padding: 0 0.5rem;
        width: 3.125rem;
        height: 3.875rem;
        border-radius: 1rem;
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(15.800000190734863px);
        color: #fff;
        font-family: Satoshi;
        font-size: 3rem;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        text-align: center;
    }
`

export default function TotalTvlCard() {
    const [totalTvl, setTotalTvl] = useState(0)

    const [tvlArr, setTvlArr] = useState<string[]>([])

    const getTotalTvlFunc = async () => {
        const res = await getTotalTvl()
        console.log('total tvl', res)

        setTotalTvl(res?.result || 0)
    }

    const getTvlArr = (str: string) => {
        let arr = []
        for (let i = 0; i < str.length; i++) {
            arr.push(str[i])
        }
        return arr
    }

    useEffect(() => {
        let arr = getTvlArr('$' + totalTvl)
        setTvlArr(arr)
    }, [totalTvl])

    useEffect(() => {
        getTotalTvlFunc()
    }, [])

    return (
        <TvlBox className='flex items-center gap-[0.5rem]'>
            {tvlArr.map((item, index) => (
                <span
                    key={index}
                    className='tvl-num-item'>
                    {item}
                </span>
            ))}
        </TvlBox>
    )
}
