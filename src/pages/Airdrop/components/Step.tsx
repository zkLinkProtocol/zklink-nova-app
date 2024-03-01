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
        <div className='flex justify-center py-36'>
            <div className='w-8/12'>
                <p className='text-base'>YOU’RE ALMOST THERE</p>
                <p className='text-2xl mt-2 font-bold'>To join the zkLink Nova Campaign</p>

                <div>
                    <Card className='mt-6'>
                        <CardBody>
                            <div className='flex justify-between align-center'>
                                <div className='flex align-center'>
                                    <div className='text-4xl font-bold'>01</div>

                                    <div className='ml-5'>
                                        <p className='text-base font-bold'>Enter Invite Code</p>
                                        <p className='text-sub-title text-sm'>
                                            Please Notice your are also joining the Group: <span className='text-green-400'>1234</span>
                                        </p>
                                    </div>
                                </div>
                                <div className='flex align-center'>
                                    {inviteCode ? (
                                        <Button
                                            className='bg-emerald-900 font-bold'
                                            radius='sm'>
                                            {inviteCode}
                                        </Button>
                                    ) : (
                                        <div className='flex items-center gap-2'>
                                            <Input
                                                size='sm'
                                                className='w-20 h-12'
                                                maxLength={6}
                                                onChange={(e) => setInviteCodeVal(e.target.value)}
                                            />
                                            <Button className='bg-emerald-500 font-bold' onClick={() => dispatch(setInviteCode(inviteCodeVal))}>Enter Code</Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className='mt-6'>
                        <CardBody>
                            <div className='flex justify-between align-center'>
                                <div className='flex align-center'>
                                    <div className='text-4xl font-bold'>02</div>

                                    <div className='ml-5'>
                                        <p className='text-base font-bold'>Connect Twitter</p>
                                        <p className='text-sub-title text-sm'>Check if you’re real person</p>
                                    </div>
                                </div>
                                <div className='flex align-center'>
                                    <Button
                                        className='bg-emerald-500 font-bold'
                                        onClick={handleConnectTwitter}>
                                        Connect Twitter/X
                                    </Button>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className='mt-6'>
                        <CardBody>
                            <div className='flex justify-between items-center'>
                                <div className='flex items-center'>
                                    <div className='text-4xl font-bold'>03</div>

                                    <div className='ml-5'>
                                        <p className='text-base font-bold'>Connect your wallet</p>
                                        <p className='text-sub-title text-sm'>Check how many zkLink Points you could earn </p>
                                    </div>
                                </div>
                                <div>
                                    {isConnected ? (
                                        <span className='text-green-500 text-3xl'>
                                            <AiOutlineCheck />
                                        </span>
                                    ) : (
                                        <Button
                                            className='bg-emerald-500 font-bold'
                                            onClick={() => web3Modal.open()}>
                                            Connect Your Wallet
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    )
}
