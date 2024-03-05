import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from '@nextui-org/react'
import { Link, NavLink } from 'react-router-dom'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount } from 'wagmi'
import styled from 'styled-components'
import { showAccount } from '@/utils'

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

    return (
        <>
            <Navbar
                className='fixed px-[1.5rem] py-[1.75rem] bg-transparent'
                maxWidth='full'
                isBlurred={false}>
                <NavbarBrand className='flex items-end'>
                    {/* <Logo /> */}

                    <Link to='/'>
                        <LogoBox className='relative'>
                            <img
                                className='w-[9rem] h-[2.41rem]'
                                src='/img/logo-zklink.svg'
                                alt='logo'
                            />
                            <span className='logo-text'>zk.Link</span>
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
                                <NavLink to='/bridge'>Bridge</NavLink>
                            </NavbarItem>
                        </NavbarContent>
                    </NavBox>
                </NavbarBrand>

                <NavbarContent justify='end'>
                    <NavbarItem className='hidden lg:flex'>
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
                                alt='icon'
                            />
                            <ButtonText>{isConnected ? showAccount(address) : 'Connect wallet'}</ButtonText>
                        </Button>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
        </>
    )
}
