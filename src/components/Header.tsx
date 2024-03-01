import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from '@nextui-org/react'
import { NavLink } from 'react-router-dom'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount } from 'wagmi'
// import {AcmeLogo} from "./AcmeLogo.jsx";
import styled from 'styled-components'
import { showAccount } from '@/utils'

const NavBox = styled.nav`
    a {
        color: #999;
        &.active {
            color: #fff;
        }
    }
`

export default function Header() {
    const web3Modal = useWeb3Modal()
    const { address, isConnected } = useAccount()

    return (
        <Navbar
            maxWidth='full'
            isBlurred={false}
            isBordered>
            <NavbarBrand>
                {/* <AcmeLogo /> */}
                <p className='font-bold text-inherit'>zk.Link</p>

                <NavBox className='ml-10'>
                    <NavbarContent
                        className='hidden sm:flex gap-4'
                        justify='center'>
                        <NavbarItem>
                            <NavLink to='/airdrop'>AIRDROP</NavLink>
                        </NavbarItem>
                        <NavbarItem>
                            <NavLink to='/leaderboard'>LEADERBOARD</NavLink>
                        </NavbarItem>
                        <NavbarItem>
                            <NavLink to='/about'>ABOUT</NavLink>
                        </NavbarItem>
                        <NavbarItem>
                            <NavLink to='/bridge'>BRIDGE</NavLink>
                        </NavbarItem>
                    </NavbarContent>
                </NavBox>
            </NavbarBrand>

            <NavbarContent justify='end'>
                <NavbarItem className='hidden lg:flex'>
                    {/* <Button className='bg-blue-950' onClick={() => web3Modal.open({ view: 'Networks' })}>Network</Button> */}
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
