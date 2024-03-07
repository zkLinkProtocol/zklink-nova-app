import styled from 'styled-components'
import AssetsTable from '@/components/AssetsTable'
import { BgBox, BgCoverImg, CardBox } from '@/styles/common'
import { useEffect, useState } from 'react'
import { Modal, ModalBody, ModalContent, useDisclosure } from '@nextui-org/react'
import BridgeComponent from '@/components/Bridge'
import { BOOST_LIST } from '@/constants/boost'
import { getBooster, getNextMilestone } from '@/utils'
import ReferralList from '@/components/ReferralList'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { getAccounTvl, getAccountPoint, getReferrer } from '@/api'
import { useAccount } from 'wagmi'
// import { AiFillQuestionCircle } from 'react-icons/ai'

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
    position: relative;
    padding: 2rem 0;

    .title {
        position: absolute;
        left: 0;
        bottom: -0.1rem;
        color: #fff;
        font-family: Satoshi;
        font-size: 0.875rem;
        font-style: normal;
        font-weight: 700;
        line-height: 1; /* 157.143% */
    }

    .progress-item {
        position: relative;
        height: 0.5rem;
        background: #2a2a2a;
        border-radius: 0.5rem;
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
        .progress-points {
            position: absolute;
            top: 50%;
            right: -0.625rem;
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
        user-select: none;
        cursor: pointer;
        &.active,
        &:hover {
            color: #fff;
        }
    }
`

export default function Dashboard() {
    const { invite } = useSelector((store: RootState) => store.airdrop)
    const { address } = useAccount()

    const [tabsActive, setTabsActive] = useState(0)
    const [groupTvl] = useState(0)
    const [referralTvl] = useState(0)
    const [stakingValue] = useState(0)
    const [earnValue] = useState({
        earnByDeposit: 0,
        earnByReferring: 0,
    })
    const [accountPoint, setAccountPoint] = useState({
        novaPoint: 0,
        referPoint: 0,
    })
    const [referrerData, setReferrerData] = useState([])

    const [bridgeToken, setBridgeToken] = useState('')
    const bridgeModal = useDisclosure()

    const handleBridgeMore = (token: string) => {
        setBridgeToken(token)
        bridgeModal.onOpen()
    }

    const getAccountPointFunc = async () => {
        if (!address) return
        const res = await getAccountPoint(address)
        console.log('account point', res)
        if (res.result) {
            setAccountPoint(res.result)
        }
    }

    const getReferrerFunc = async () => {
        if (!address) return
        const res = await getReferrer(address)
        console.log('referrer', res)
        if (res.result) {
            setReferrerData(res.result)
        }
    }

    const getAccounTvlFunc = async () => {
        if (!address) return
        const res = await getAccounTvl(address)

        console.log('account tvl', res)
    }

    useEffect(() => {
        getAccountPointFunc()
        getReferrerFunc()
        getAccounTvlFunc()
    }, [])

    return (
        <BgBox>
            <BgCoverImg />
            <div className='relative flex gap-[1.5rem] px-[4.75rem] z-[1]'>
                <div className='w-[27.125rem]'>
                    <CardBox className='flex flex-col gap-[1.5rem] items-center p-[1.5rem]'>
                        <p className='w-full text-[1rem] font-[700] text-[1rem] leading-[1.5rem] tracking-[0.06rem]'>Your Nova Char</p>
                        <div className='w-[24rem] h-[18.75rem] bg-[#65E7E5] rounded-[1rem]'>
                            <img
                                src='/img/icon-nft-blue.svg'
                                className='text-center block mx-auto h-full'
                            />
                        </div>
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
                            <span className='text-[2.5rem] font-[700]'>{accountPoint.novaPoint}</span>
                            <GreenTag className='py-[0.375rem] w-[5.625rem] text-[1rem]'>{getBooster(accountPoint.novaPoint)}</GreenTag>
                        </div>
                        <p className='w-full text-[1rem] font-[700] text-[1rem] leading-[1.5rem] tracking-[0.06rem]'>+{accountPoint.referPoint}</p>
                        <p className='text-[1rem] text-[#919192] font-[400]'>Your Nova Char</p>

                        <p className='flex justify-between items-center mt-[3rem] font-[400] text-[1rem] leading-[1.5rem] tracking-[0.06rem] text-[#919192]'>
                            <span>Earn By Your Deposit</span>
                            <span>{earnValue.earnByDeposit}</span>
                        </p>
                        <p className='flex justify-between items-center mt-[1rem] font-[400] text-[1rem] leading-[1.5rem] tracking-[0.06rem] text-[#919192]'>
                            <span>Earn By Referring Friends</span>
                            <span>{earnValue.earnByReferring}</span>
                        </p>
                    </CardBox>

                    <CardBox className='flex flex-col items-center mt-[1.5rem] p-[1.5rem]'>
                        <p className='w-full text-[1rem] font-[700] text-[1rem] leading-[1.5rem] tracking-[0.06rem]'>Your Staking Value</p>
                        <p className='w-full text-[2.5rem] font-[700]'>{stakingValue}</p>
                        <GradientButton
                            className='w-full mt-[1.5rem] py-[1rem] text-[1.25rem]'
                            onClick={() => handleBridgeMore('0x1ac10940cc7f8b063731609AF1a55F2fa440dFD2')}>
                            Bridge More
                        </GradientButton>
                    </CardBox>
                </div>
                <div className='w-full'>
                    <div className='flex gap-[1.5rem]'>
                        <CardBox className='flex justify-around  py-[3rem] w-1/2'>
                            <div>
                                <p className='text-[1.5rem] leading-[2rem] text-center'>{groupTvl}</p>
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
                                <p className='text-[1.5rem] leading-[2rem] text-center'>{referralTvl}</p>
                                <p className='mt-[1rem] text-[1rem] leading-[rem] text-center text-[#7E7E7E]'>Referral TVL</p>
                            </div>
                            <div>
                                <p
                                    className='text-[1.5rem] leading-[2rem] text-center flex items-center gap-[0.38rem] cursor-pointer'
                                    onClick={() => invite?.code && navigator.clipboard.writeText(invite?.code)}>
                                    <span>{invite?.code || '-'}</span>
                                    <img
                                        src='/img/icon-copy.svg'
                                        className='w-[1.1875rem] h-[1.1875rem]'
                                    />
                                </p>
                                <p className='mt-[1rem] text-[1rem] leading-[rem] text-center text-[#7E7E7E]'>
                                    Your Invite Code ({invite?.canInviteNumber || 0}/10)
                                </p>
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
                                <GradientText className='ml-[0.5rem] text-[1rem]'>{getNextMilestone(groupTvl)} ETH</GradientText>

                                <img
                                    src='/img/icon-info.svg'
                                    className='ml-[0.38rem] w-[0.875rem] h-[0.875rem]'
                                />
                            </div>
                        </div>

                        <CardBox className='mt-[2rem] py-[1.5rem] pl-[1.5rem] pr-[3rem]'>
                            <ProgressBar className='flex w-full'>
                                <div className='title'>Target/Boost</div>

                                {BOOST_LIST.map((item, index) => (
                                    <div
                                        className={`progress-item w-1/5 ${groupTvl > item.value ? 'active' : ''} `}
                                        key={index}>
                                        <div className='progress-points'>
                                            <div className='points-top'>{item.booster}</div>
                                            <div className='points-bottom'>{item.value} ETH</div>
                                        </div>
                                    </div>
                                ))}
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

                            <div
                                className={`tab-item relative flex items-center gap-[0.5rem] ${tabsActive === 2 ? 'active' : ''}`}
                                onClick={() => setTabsActive(2)}>
                                <span>Referral</span>

                                {/* <span
                                    className='referral-info'
                                    data-tooltip-id='referral-tooltip'
                                    data-tooltip-content='For every 3 referrals you made; you are eligible to mint a trademark NFT'>
                                    <AiFillQuestionCircle />
                                </span> */}
                            </div>
                        </TabsBox>

                        {tabsActive === 0 && <AssetsTable />}
                        {tabsActive === 1 && (
                            <CardBox className='flex flex-col justify-center items-center mt-[2rem] py-[10rem]'>
                                <p className='text-[1rem] text-center mb-[1rem] font-[700]'>Rarible Market Coming Soon</p>
                                <img
                                    src='/img/icon-placeholder.svg'
                                    className='w-[9.375rem] h-[9.375rem]'
                                />
                            </CardBox>
                        )}
                        {tabsActive === 2 && (
                            <CardBox className='mt-[2rem] min-h-[30rem]'>
                                <ReferralList data={referrerData} />
                            </CardBox>
                        )}
                    </div>
                </div>
            </div>
            <Modal
                style={{ minHeight: '600px' }}
                size='2xl'
                isOpen={bridgeModal.isOpen}
                onOpenChange={bridgeModal.onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <ModalBody className='pb-8'>
                            <BridgeComponent
                                isFirstDeposit={false}
                                bridgeToken={bridgeToken}
                                onClose={onClose}
                            />
                        </ModalBody>
                    )}
                </ModalContent>
            </Modal>
        </BgBox>
    )
}
