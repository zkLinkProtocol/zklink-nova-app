import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from '@nextui-org/react'
import { Link, NavLink } from 'react-router-dom'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount } from 'wagmi'
// import { Logo } from './Logo'
import styled from 'styled-components'
import { showAccount } from '@/utils'

const NavBox = styled.nav`
    a {
        color: #9ccbbd;
        font-family: Satoshi;
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 22px; /* 137.5% */
        letter-spacing: -0.5px;
        &.active {
            color: #fff;
        }
    }
`

const LogoBox = styled.div`
    .logo-text {
        position: absolute;
        left: 47px;
        top: 10px;
        color: #fff;
        font-family: Satoshi;
        font-size: 32px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px; /* 68.75% */
    }
`

export default function Header() {
    const web3Modal = useWeb3Modal()
    const { address, isConnected } = useAccount()

    return (
        <Navbar
            className='fixed bg-transparent'
            maxWidth='full'
            isBlurred={false}>
            <NavbarBrand className='flex items-end'>
                {/* <Logo /> */}

                <Link to='/'>
                    <LogoBox className='relative'>
                        <img
                            src='/img/logo-zklink.svg'
                            alt='logo'
                        />
                        <span className='logo-text'>zk.Link</span>
                    </LogoBox>
                </Link>

                <NavBox className='ml-10'>
                    <NavbarContent
                        className='hidden sm:flex gap-4'
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
                        color='success'
                        onClick={() => web3Modal.open()}>
                        {isConnected ? showAccount(address) : 'Connect wallet'}
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    )
}
