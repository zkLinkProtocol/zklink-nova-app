import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Avatar } from '@nextui-org/react'
import { Link, NavLink } from 'react-router-dom'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount, useDisconnect } from 'wagmi'
import styled from 'styled-components'
import { showAccount } from '@/utils'
import { useEffect } from 'react'
import { setSignature, setSignatureStatus } from '@/store/modules/airdrop'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import ErrorToast from './ErrorToast'
import { useSignMessage } from 'wagmi'
import { SIGN_MESSAGE } from '@/constants/sign'

const NavBox = styled.nav`
    a {
        color: #9ccbbd;
        font-family: Satoshi;
        font-size: 1rem;
        font-style: normal;
        font-weight: 500;
        line-height: 1.375rem; /* 137.5% */
        letter-spacing: -0.03125rem;
        &.active {
            color: #fff;
        }
    }
`

const LogoBox = styled.div`
    .logo-text {
        position: absolute;
        left: 2.94rem;
        top: 0.63rem;
        color: #fff;
        font-family: Satoshi;
        font-size: 2rem;
        font-style: normal;
        font-weight: 700;
        line-height: 1.375rem; /* 68.75% */
    }
`

const ButtonText = styled.span`
    color: #03d498;
    font-family: Heebo;
    font-size: 1rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.5rem; /* 150% */
`

export default function Header() {
    const web3Modal = useWeb3Modal()
    const { address, isConnected } = useAccount()
    const { signature } = useSelector((store: any) => store.airdrop)

    const { signMessage } = useSignMessage()
    const dispatch = useDispatch()
    const { disconnect } = useDisconnect()

    const handleSign = async () => {
        await signMessage(
            {
                message: SIGN_MESSAGE,
            },
            {
                onSuccess(data, variables, context) {
                    console.log(data, variables, context)
                    dispatch(setSignature(data))
                    dispatch(setSignatureStatus(1))
                },
                onError(error, variables, context) {
                    console.log(error, variables, context)
                    toast.error('Fail to connect')
                    disconnect()
                },
            }
        )
    }

    useEffect(() => {
        // console.log('isConnected', isConnected)
        // console.log('signature', signature)

        if (!isConnected) {
            console.log('clear signature')
            dispatch(setSignature(''))
        }
        if (isConnected && (!signature || signature === '')) {
            handleSign()
        }
    }, [isConnected, signature])

    return (
        <>
            <Navbar
                shouldHideOnScroll
                className='fixed px-[1.5rem] py-[0.75rem] bg-transparent'
                maxWidth='full'
                isBlurred={false}>
                <NavbarBrand className='flex items-end'>
                    {/* <Logo /> */}

                    <Link to='/'>
                        <LogoBox className='relative'>
                            <img
                                className='max-w-[145.431px] h-auto'
                                src='/img/logo-nova.svg'
                            />
                            {/* <span className='logo-text'>zk.Link</span> */}
                        </LogoBox>
                    </Link>

                    <NavBox className='ml-[3.5rem]'>
                        <NavbarContent
                            className='hidden sm:flex gap-[2.5rem]'
                            justify='center'>
                            <NavbarItem>
                                <NavLink
                                    to='/airdrop'
                                    className='nav-link'>
                                    Airdrop
                                </NavLink>
                            </NavbarItem>
                            <NavbarItem>
                                <NavLink to='/leaderboard'>Leaderboard</NavLink>
                            </NavbarItem>
                            <NavbarItem>
                                <NavLink to='/about'>About</NavLink>
                            </NavbarItem>
                            <NavbarItem>
                                <a
                                    href='https://goerli.portal.zklink.io/bridge/'
                                    target='_blank'>
                                    Bridge
                                </a>
                            </NavbarItem>
                        </NavbarContent>
                    </NavBox>
                </NavbarBrand>

                <NavbarContent justify='end'>
                    <NavbarItem className='hidden flex items-center gap-[1rem]'>
                        {/* if the user has completed the invitation */}
                        {false && (
                            <div className='flex items-center gap-[0.5rem]'>
                                <div className='text-right'>
                                    <div className='text-[1rem] text-[#7E7E7E]'>YOUR POINTS</div>
                                    <div className='text-[1rem] text-[#fff]'>2000</div>
                                </div>
                                <Avatar
                                    className='w-[2.5625rem] h-[2.5625rem]'
                                    src='/img/icon-avatar.svg'
                                />
                            </div>
                        )}
                        {/* <Button
                            className='bg-blue-950'
                            onClick={() => web3Modal.open({ view: 'Networks' })}>
                            Network
                        </Button> */}
                        <Button
                            className='bg-[#1D4138] text-[#03D498] px-4 flex justify-center items-center gap-[0.75rem]'
                            disableAnimation
                            onClick={() => web3Modal.open()}>
                            <img
                                width={20}
                                height={20}
                                src='/img/icon-wallet.svg'
                            />
                            <ButtonText>{isConnected ? showAccount(address) : 'Connect wallet'}</ButtonText>
                        </Button>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
            <ErrorToast />
        </>
    )
}
