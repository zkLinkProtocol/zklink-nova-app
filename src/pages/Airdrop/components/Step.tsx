import { useEffect, useState } from 'react'
import { Button, Card, CardBody, Input } from '@nextui-org/react'
import { useSearchParams } from 'react-router-dom'
import qs from 'qs'
import { postData } from '@/utils'
import { useDispatch, useSelector } from 'react-redux'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount } from 'wagmi'
import { AiOutlineCheck } from 'react-icons/ai'
import { setInviteCode } from '@/store/modules/airdrop'
import styled from 'styled-components'
import Performance from './Performance'

const BgBox = styled.div`
    position: relative;
    padding-top: 7.5rem;
    padding-bottom: 7.5rem;
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(0deg, rgba(0, 178, 255, 0.23) 0%, rgba(12, 14, 17, 0.23) 100%);
`

const TitleText = styled.h4`
    color: #c2e2ff;
    text-align: center;
    font-family: Satoshi;
    font-size: 2.5rem;
    font-style: normal;
    font-weight: 900;
    line-height: 2.5rem; /* 100% */
    letter-spacing: -0.03125rem;
`
const SubTitleText = styled.p`
    color: #c6d3dd;
    text-align: center;
    font-family: Satoshi;
    font-size: 1rem;
    font-style: normal;
    font-weight: 900;
    line-height: 2.5rem; /* 250% */
    letter-spacing: -0.03125rem;
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

const ContentBox = styled.div`
    margin: 0 auto;
    width: 58.875rem;
`

const StepCard = styled.div`
    border-radius: 1rem;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(15.800000190734863px);
`

const StepNum = styled.div`
    width: 4.3125rem;
    height: 6.25rem;
    line-height: 6.25rem;
    color: #fff;
    font-family: Satoshi;
    font-size: 1rem;
    font-style: normal;
    font-weight: 900;
    letter-spacing: -0.03125rem;
    text-align: center;
`

const StepItem = styled.div`
    .step-title {
        color: #fff;
        font-family: Satoshi;
        font-size: 1rem;
        font-style: normal;
        font-weight: 900;
        line-height: 1.5rem; /* 150% */
        letter-spacing: -0.03125rem;
    }
    .step-sub-title {
        color: #c6d3dd;
        font-family: Satoshi;
        font-size: 1rem;
        font-style: normal;
        font-weight: 400;
        line-height: 1.5rem; /* 150% */
        letter-spacing: -0.03125rem;
    }
`

const GradientButton = styled.span`
    border-radius: 0.5rem;
    background: linear-gradient(90deg, #48ecae 0%, #3e52fc 51.07%, #49ced7 100%);
    color: #fff;
    font-family: Satoshi;
    font-size: 1rem;
    font-style: normal;
    font-weight: 900;
    line-height: 1.5rem; /* 150% */
    letter-spacing: -0.03125rem;
    cursor: pointer;
`

export default function Step() {
    const dispatch = useDispatch()
    const [searchParams, setSearchParams] = useSearchParams()
    const web3Modal = useWeb3Modal()
    const { isConnected } = useAccount()
    const { inviteCode } = useSelector((store: any) => store.airdrop)

    const [inviteCodeVal, setInviteCodeVal] = useState('')

    // const location = useLocation()

    const handleConnectTwitter = () => {
        // const url = 'https://twitter.com/i/oauth2/authorize?response_type=code&client_id=RTUyVmlpTzFjTFhWWVB4b2tyb0k6MTpjaQ&redirect_uri=http://localhost:3000/airdrop&scope=tweet.read%20users.read%20follows.read%20follows.write&state=state&code_challenge=challenge&code_challenge_method=plain'

        const params = {
            response_type: 'code',
            client_id: 'RTUyVmlpTzFjTFhWWVB4b2tyb0k6MTpjaQ',
            redirect_uri: 'http://localhost:3000/airdrop',
            scope: 'tweet.read%20users.read%20follows.read%20follows.write',
            state: 'state',
            code_challenge: 'challenge',
            code_challenge_method: 'plain',
        }
        const url = new URL(`https://twitter.com/i/oauth2/authorize`)
        // url.search = new URLSearchParams(params).toString()
        url.search = qs.stringify(params, { encode: false })

        window.location.href = url.href

        // const authClient = new auth.OAuth2User({
        //     client_id: 'RTUyVmlpTzFjTFhWWVB4b2tyb0k6MTpjaQ',
        //     callback: "http://localhost:3000/airdrop",
        //     scopes: ["tweet.read", "users.read", "offline.access"],
        //   });

        //   const client = new Client(authClient);

        //   console.log(client);
    }

    const getTwitterAccessToken = async (code: string) => {
        const res = await postData('/twitter/2/oauth2/token', {
            code,
            grant_type: 'authorization_code',
            client_id: 'RTUyVmlpTzFjTFhWWVB4b2tyb0k6MTpjaQ',
            redirect_uri: 'http://localhost:3000/airdrop',
            code_verifier: 'challenge',
        })

        let udpatedSearchParams = new URLSearchParams(searchParams.toString())
        const removeSearchParams = (key: string) => {
            udpatedSearchParams.delete(key)
            setSearchParams(udpatedSearchParams.toString())
        }
        removeSearchParams('code')
        removeSearchParams('state')

        console.log(res)

        const { access_token } = res

        console.log(access_token)
        if (access_token && access_token !== '') {
            fetch('/twitter/2/users/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${access_token}`,
                },
            }).then(async (res) => {
                let { data } = await res.json()
                console.log(data)
            })

            // console.log(res.json())
        }
    }

    useEffect(() => {
        const state = searchParams.get('state')
        const code = searchParams.get('code')

        if (state && code) {
            console.log(state, code)
            getTwitterAccessToken(code)
        }
    }, [searchParams])

    return (
        <BgBox>
            <ContentBg />
            <ContentBox>
                <div className='mt-[8rem]'>
                    <SubTitleText>YOU’RE ALMOST THERE</SubTitleText>
                    <TitleText>To join the zkLink Nova Campaign</TitleText>
                </div>
                <div className='mt-[3.56rem]'>
                    <div className='flex justify-center gap-[0.5rem]'>
                        <StepCard>
                            <StepNum>01</StepNum>
                        </StepCard>
                        <StepCard className='flex justify-between items-center p-[1.5rem] w-[40.125rem] h-[6.25rem]'>
                            <StepItem>
                                <p className='step-title'>Enter Invite Code</p>
                                <p className='step-sub-title mt-[0.25rem]'>You could modify it before bridge</p>
                            </StepItem>
                            <div>
                                <img
                                    src='/img/icon-right.svg'
                                    className='w-[1.5rem] h-[1.5rem]'
                                />
                            </div>
                        </StepCard>
                    </div>

                    <div className='flex justify-center gap-[0.5rem] mt-[1rem]'>
                        <StepCard>
                            <StepNum>02</StepNum>
                        </StepCard>
                        <StepCard className='flex justify-between items-center p-[1.5rem] w-[40.125rem] h-[6.25rem]'>
                            <StepItem>
                                <p className='step-title'>Connect Twitter</p>
                                <p className='step-sub-title mt-[0.25rem]'>Check if you’re real person</p>
                            </StepItem>
                            <div>
                                <GradientButton className='px-[1rem] py-[0.5rem]' onClick={handleConnectTwitter}>Connect Twitter/X</GradientButton>
                            </div>
                        </StepCard>
                    </div>

                    <div className='flex justify-center gap-[0.5rem] mt-[1rem]'>
                        <StepCard>
                            <StepNum>03</StepNum>
                        </StepCard>
                        <StepCard className='flex justify-between items-center p-[1.5rem] w-[40.125rem] h-[6.25rem]'>
                            <StepItem>
                                <p className='step-title'>Connect your wallet</p>
                                <p className='step-sub-title mt-[0.25rem]'>Connect to continue the process</p>
                            </StepItem>
                            <div>
                                {isConnected ? (
                                    <img
                                        src='/img/icon-right.svg'
                                        className='w-[1.5rem] h-[1.5rem]'
                                    />
                                ) : (
                                    <GradientButton
                                        className='px-[1rem] py-[0.5rem]'
                                        onClick={() => web3Modal.open()}>
                                        Connect Your Wallet
                                    </GradientButton>
                                )}
                            </div>
                        </StepCard>
                    </div>
                </div>
            </ContentBox>
            <div className='absolute bottom-[4.5rem] w-full'>
                <Performance />
            </div>
        </BgBox>
    )
}
