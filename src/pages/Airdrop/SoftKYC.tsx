import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import qs from 'qs'
import { postData } from '@/utils'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount } from 'wagmi'
import styled from 'styled-components'
import Performance from '../../components/Performance'
import { useDispatch, useSelector } from 'react-redux'
import { BgBox, BgCoverImg, GradientButton, CardBox } from '@/styles/common'
import { setSignature, setTwitter } from '@/store/modules/airdrop'
import toast from 'react-hot-toast'
import { useSignMessage } from 'wagmi'
import { SIGN_MESSAGE } from '@/constants/sign'

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

const ContentBox = styled.div`
    position: relative;
    margin: 0 auto;
    width: 58.875rem;
    min-height: 36rem;
    z-index: 10;
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

export default function SoftKYC() {
    const [searchParams, setSearchParams] = useSearchParams()
    const web3Modal = useWeb3Modal()
    const { isConnected, isConnecting } = useAccount()
    const { signature } = useSelector((store: any) => store.airdrop)
    const { twitter } = useSelector((store: any) => store.airdrop)

    const dispatch = useDispatch()
    const { signMessage } = useSignMessage()
    // const { inviteCode } = useSelector((store: any) => store.airdrop)
    // const [inviteCodeVal, setInviteCodeVal] = useState('')

    // const location = useLocation()

    const handleConnectTwitter = () => {
        // const url = 'https://twitter.com/i/oauth2/authorize?response_type=code&client_id=RTUyVmlpTzFjTFhWWVB4b2tyb0k6MTpjaQ&redirect_uri=http://localhost:3000/airdrop&scope=tweet.read%20users.read%20follows.read%20follows.write&state=state&code_challenge=challenge&code_challenge_method=plain'

        const params = {
            response_type: 'code',
            client_id: import.meta.env.VITE_TWITTER_CLIENT_ID,
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
    // const removeSearchParams = (key: string) => {
    //     let udpatedSearchParams = new URLSearchParams(searchParams.toString())
    //     udpatedSearchParams.delete(key)
    // }

    const getTwitterAccessToken = async (code: string) => {
        const res = await postData('/twitter/2/oauth2/token', {
            code,
            grant_type: 'authorization_code',
            client_id: import.meta.env.VITE_TWITTER_CLIENT_ID,
            redirect_uri: 'http://localhost:3000/airdrop',
            code_verifier: 'challenge',
        })

        setSearchParams('')

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

                dispatch(setTwitter(data))
            })

            // console.log(res.json())
        }
    }

    const handleSign = async () => {
        await signMessage(
            {
                message: SIGN_MESSAGE,
            },
            {
                onSuccess(data, variables, context) {
                    console.log(data, variables, context)
                    dispatch(setSignature(data))
                },
                onError(error, variables, context) {
                    console.log(error, variables, context)
                    toast.error('User reject signature. Try again.')
                    // disconnect()
                },
            }
        )
    }

    const handleConnectWallet = () => {
        if (isConnected && signature) return
        if (isConnected) {
            handleSign()
        } else {
            web3Modal.open({ view: 'Connect' })
        }
    }

    useEffect(() => {
        // const state = searchParams.get('state')
        const code = searchParams.get('code')
        const error = searchParams.get('error')

        // console.log('searchParams', searchParams)
        // console.log(error)
        if (error) {
            setSearchParams('')
            toast.error('Could not connect to Twitter. Try again.')
            return
        }

        if (code) {
            console.log(code)
            getTwitterAccessToken(code)
        }
    }, [searchParams])

    return (
        <BgBox>
            <BgCoverImg />
            <ContentBox>
                <div className='mt-[8rem]'>
                    <SubTitleText>YOU’RE ALMOST THERE</SubTitleText>
                    <TitleText>To join the zkLink Aggregation Parade</TitleText>
                </div>
                <div className='mt-[3.56rem]'>
                    <div className='flex justify-center gap-[0.5rem]'>
                        <CardBox>
                            <StepNum>01</StepNum>
                        </CardBox>
                        <CardBox className='flex justify-between items-center p-[1.5rem] w-[40.125rem] h-[6.25rem]'>
                            <StepItem>
                                <p className='step-title'>Enter Invite Code</p>
                                <p className='step-sub-title mt-[0.25rem]'>You could modify it before bridge</p>
                            </StepItem>
                            <div>
                                {
                                    <img
                                        src='/img/icon-right.svg'
                                        className='w-[1.5rem] h-[1.5rem]'
                                    />
                                }
                            </div>
                        </CardBox>
                    </div>

                    <div className='flex justify-center gap-[0.5rem] mt-[1rem]'>
                        <CardBox>
                            <StepNum>02</StepNum>
                        </CardBox>
                        <CardBox className='flex justify-between items-center p-[1.5rem] w-[40.125rem] h-[6.25rem]'>
                            <StepItem>
                                <p className='step-title'>Connect Twitter or Create Your Team</p>
                                <p className='step-sub-title mt-[0.25rem]'>Check if you are a real person.</p>
                            </StepItem>
                            <div>
                                {twitter ? (
                                    <img
                                        src='/img/icon-right.svg'
                                        className='w-[1.5rem] h-[1.5rem]'
                                    />
                                ) : (
                                    <GradientButton
                                        className='px-[1rem] py-[0.5rem] text-[1rem]'
                                        onClick={handleConnectTwitter}>
                                        Connect Twitter/X
                                    </GradientButton>
                                )}
                            </div>
                        </CardBox>
                    </div>

                    <div className='flex justify-center gap-[0.5rem] mt-[1rem]'>
                        <CardBox>
                            <StepNum>03</StepNum>
                        </CardBox>
                        <CardBox className='flex justify-between items-center p-[1.5rem] w-[40.125rem] h-[6.25rem]'>
                            <StepItem>
                                <p className='step-title'>Connect your wallet</p>
                                <p className='step-sub-title mt-[0.25rem]'>Connect your Web3 wallet to continue</p>
                            </StepItem>
                            <div>
                                {isConnected && signature ? (
                                    <img
                                        src='/img/icon-right.svg'
                                        className='w-[1.5rem] h-[1.5rem]'
                                    />
                                ) : (
                                    <GradientButton
                                        className={`px-[1rem] py-[0.5rem] ${isConnecting ? 'disabled' : ''}`}
                                        onClick={() => handleConnectWallet()}>
                                        Connect Your Wallet
                                    </GradientButton>
                                )}
                            </div>
                        </CardBox>
                    </div>
                </div>
            </ContentBox>
            <div className='absolute bottom-[4.5rem] w-full'>
                <Performance />
            </div>
        </BgBox>
    )
}
