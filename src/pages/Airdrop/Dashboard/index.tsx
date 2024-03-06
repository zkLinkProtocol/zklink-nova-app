import styled from 'styled-components'
import AssetsTable from '@/components/AssetsTable'
import { BgBox, BgCoverImg, CardBox } from '@/styles/common'
import { useState } from 'react'

const GradientButton = styled.span`
    border-radius: 0.5rem;
    background: linear-gradient(90deg, #48ecae 0%, #3e52fc 51.07%, #49ced7 100%);
    color: #fff;
    text-align: center;
    font-family: Satoshi;
    font-size: 1.125rem;
    font-style: normal;
    font-weight: 700;
    line-height: 1.625rem; /* 144.444% */
    letter-spacing: 0.0625rem;
    cursor: pointer;
    user-select: none;
`
const GreenTag = styled.span`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.375rem;
    background: linear-gradient(90deg, #0bc48f 0%, #00192b 107.78%);
`

const GradientText = styled.span`
    background: linear-gradient(90deg, #48ecae 0%, #49ced7 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`

const ProgressBar = styled.div`
    padding: 3rem 0;

    .progress-item {
        position: relative;
        height: 0.5rem;
        background: #2a2a2a;
        .title {
            position: absolute;
            left: 0;
            top: 1.5rem;
            color: #fff;
            font-family: Satoshi;
            font-size: 0.875rem;
            font-style: normal;
            font-weight: 700;
            line-height: 1.375rem; /* 157.143% */
        }

        .progress-points {
            position: absolute;
            top: 50%;
            right: 0;
            transform: translate(0, -50%);
            width: 1.25rem;
            height: 1.25rem;
            border-radius: 50%;
            background-color: #2a2a2a;
            z-index: 10;

            .points-top {
                position: absolute;
                top: -2rem;
                left: 50%;
                transform: translate(-50%, 0);
                color: #919192;
                text-align: center;
                font-family: Satoshi;
                font-size: 0.875rem;
                font-style: normal;
                font-weight: 700;
                line-height: 1.375rem; /* 157.143% */
                white-space: nowrap;
            }
            .points-bottom {
                position: absolute;
                bottom: -2rem;
                left: 50%;
                transform: translate(-50%, 0);
                color: #919192;
                text-align: center;
                font-family: Satoshi;
                font-size: 0.875rem;
                font-style: normal;
                font-weight: 700;
                line-height: 1.375rem; /* 157.143% */
                white-space: nowrap;
            }
        }

        &.active {
            border-radius: 0.5rem;
            background: linear-gradient(90deg, #48ecae 0%, #3e52fc 51.07%, #49ced7 100%);
            &:not(:last-child)::after {
                content: '';
                display: block;
                position: absolute;
                top: 0;
                right: -1.5rem;
                width: 2rem;
                height: 0.5rem;
                border-radius: 0.5rem;
                background: #49ced7;
                z-index: 11;
            }
            .progress-points {
                background-color: #46aae2;
                z-index: 12;
                .points-top {
                    background: linear-gradient(90deg, #48ecae 0%, #49ced7 100%);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .points-bottom {
                    color: #fff;
                }
            }
        }
    }
`

const TabsBox = styled.div`
    .tab-item {
        color: #a9a9a9;
        font-family: Satoshi;
        font-size: 1.5rem;
        font-style: normal;
        font-weight: 700;
        line-height: 2rem; /* 133.333% */
        letter-spacing: 0.09rem;
        cursor: pointer;
        &.active,
        &:hover {
            color: #fff;
        }
    }
`

export default function Dashboard() {
    const [tabsActive, setTabsActive] = useState(0)

    return (
        <BgBox>
            <BgCoverImg />
            <div className='relative flex gap-[1.5rem] px-[4.75rem] z-[1]'>
                <div className='w-[27.125rem]'>
                    <CardBox className='flex flex-col gap-[1.5rem] items-center p-[1.5rem]'>
                        <p className='w-full text-[1rem] font-[700] text-[1rem] leading-[1.5rem] tracking-[0.06rem]'>Your Nova Char</p>
                        <div className='w-[24rem] h-[18.75rem] bg-[#65E7E5] rounded-[1rem]'></div>
                        <GradientButton className='w-full py-[1rem] flex justify-center items-center gap-[0.38rem] text-[1.25rem] opacity-40'>
                            <span>Upgrade</span>
                            <img
                                src='/img/icon-info.svg'
                                className='w-[0.875rem] h-[0.875rem]'
                            />
                        </GradientButton>
                    </CardBox>

                    <CardBox className='mt-[1.5rem] p-[1.5rem]'>
                        <p className='w-full text-[1rem] font-[700] text-[1rem] leading-[1.5rem] tracking-[0.06rem]'>Nova Points</p>
                        <div className='flex items-center gap-[1rem]'>
                            <span className='text-[2.5rem] font-[700]'>12344,075</span>
                            <GreenTag className='py-[0.375rem] w-[5.625rem] text-[1rem]'>0.1x</GreenTag>
                        </div>
                        <p className='w-full text-[1rem] font-[700] text-[1rem] leading-[1.5rem] tracking-[0.06rem]'>+100</p>
                        <p className='text-[1rem] text-[#919192] font-[400]'>Your Nova Char</p>

                        <p className='flex justify-between items-center mt-[3rem] font-[400] text-[1rem] leading-[1.5rem] tracking-[0.06rem] text-[#919192]'>
                            <span>Earn By Your Deposit</span>
                            <span>100</span>
                        </p>
                        <p className='flex justify-between items-center mt-[1rem] font-[400] text-[1rem] leading-[1.5rem] tracking-[0.06rem] text-[#919192]'>
                            <span>Earn By Referring Friends</span>
                            <span>100</span>
                        </p>
                    </CardBox>

                    <CardBox className='flex flex-col items-center mt-[1.5rem] p-[1.5rem]'>
                        <p className='w-full text-[1rem] font-[700] text-[1rem] leading-[1.5rem] tracking-[0.06rem]'>Your Staking Value</p>
                        <p className='w-full text-[2.5rem] font-[700]'>$20,000</p>
                        <GradientButton className='w-full mt-[1.5rem] py-[1rem] text-[1.25rem]'>Bridge More</GradientButton>
                    </CardBox>
                </div>
                <div className='w-full'>
                    <div className='flex gap-[1.5rem]'>
                        <CardBox className='flex justify-around  py-[3rem] w-1/2'>
                            <div>
                                <p className='text-[1.5rem] leading-[2rem] text-center'>$20,000</p>
                                <p className='mt-[1rem] text-[1rem] leading-[rem] text-center text-[#7E7E7E]'>Group TVL</p>
                            </div>
                            <div>
                                <p className='text-[1.5rem] leading-[2rem] text-center'>2x</p>
                                <p className='mt-[1rem] text-[1rem] leading-[rem] text-center text-[#7E7E7E] flex items-center gap-[0.25rem]'>
                                    <span>Group 24h Growth/Boost Rate</span>
                                    <img
                                        src='/img/icon-info.svg'
                                        className='w-[0.875rem] h-[0.875rem] opacity-40'
                                    />
                                </p>
                            </div>
                        </CardBox>
                        <CardBox className='flex justify-around py-[3rem] w-1/2'>
                            <div>
                                <p className='text-[1.5rem] leading-[2rem] text-center'>$20,000</p>
                                <p className='mt-[1rem] text-[1rem] leading-[rem] text-center text-[#7E7E7E]'>Referral TVL</p>
                            </div>
                            <div>
                                <p className='text-[1.5rem] leading-[2rem] text-center flex items-center gap-[0.38rem]'>
                                    <span>1QE2re</span>
                                    <img
                                        src='/img/icon-copy.svg'
                                        className='w-[1.1875rem] h-[1.1875rem]'
                                        onClick={() => navigator.clipboard.writeText('1QE2re')}
                                    />
                                </p>
                                <p className='mt-[1rem] text-[1rem] leading-[rem] text-center text-[#7E7E7E]'>Your Invite Code (0/10)</p>
                            </div>
                        </CardBox>
                    </div>

                    <div className='mt-[2rem]'>
                        <div className='flex justify-between items-center leading-[2rem] font-[700]'>
                            <div className='flex items-center gap-[0.37rem]'>
                                <span className='text-[1.5rem]'>Group Mile Stone</span>
                                <img
                                    src='/img/icon-info.svg'
                                    className='w-[0.875rem] h-[0.875rem]'
                                />
                            </div>

                            <div className='flex items-center'>
                                <span className='text-[1rem]'>Next Milestone</span>
                                <GradientText className='ml-[0.5rem] text-[1rem]'>100 ETH</GradientText>

                                <img
                                    src='/img/icon-info.svg'
                                    className='ml-[0.38rem] w-[0.875rem] h-[0.875rem]'
                                />
                            </div>
                        </div>

                        <CardBox className='mt-[2rem] py-[1.5rem] pl-[1.5rem] pr-[3rem]'>
                            <ProgressBar className='flex w-full'>
                                <div className='progress-item w-1/5 active'>
                                    <div className='title'>Target/Boost</div>
                                    <div className='progress-points'>
                                        <div className='points-top'>0.1x</div>
                                        <div className='points-bottom'>20 ETH</div>
                                    </div>
                                </div>
                                <div className='progress-item w-1/5'>
                                    <div className='progress-points'>
                                        <div className='points-top'>0.2x</div>
                                        <div className='points-bottom'>20 ETH</div>
                                    </div>
                                </div>
                                <div className='progress-item w-1/5'>
                                    <div className='progress-points'>
                                        <div className='points-top'>0.3x</div>
                                        <div className='points-bottom'>20 ETH</div>
                                    </div>
                                </div>
                                <div className='progress-item w-1/5'>
                                    <div className='progress-points'>
                                        <div className='points-top'>0.4x</div>
                                        <div className='points-bottom'>20 ETH</div>
                                    </div>
                                </div>
                                <div className='progress-item w-1/5'>
                                    <div className='progress-points'>
                                        <div className='points-top'>0.5x</div>
                                        <div className='points-bottom'>20 ETH</div>
                                    </div>
                                </div>
                            </ProgressBar>
                        </CardBox>
                    </div>

                    <div className='mt-[2rem]'>
                        <TabsBox className='flex items-center gap-[1.5rem]'>
                            <span
                                className={`tab-item ${tabsActive === 0 ? 'active' : ''}`}
                                onClick={() => setTabsActive(0)}>
                                Assets
                            </span>
                            <span
                                className={`tab-item ${tabsActive === 1 ? 'active' : ''}`}
                                onClick={() => setTabsActive(1)}>
                                Trademark NFTs
                            </span>
                            <span
                                className={`tab-item ${tabsActive === 2 ? 'active' : ''}`}
                                onClick={() => setTabsActive(2)}>
                                Referral
                            </span>
                        </TabsBox>

                        <AssetsTable />
                    </div>
                </div>
            </div>
        </BgBox>
    )
}
