import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useState } from 'react'
import OTPInput from 'react-otp-input'
import styled from 'styled-components'
import '@/styles/otp-input.css'
import { useDispatch } from 'react-redux'
import { setInviteCode } from '@/store/modules/airdrop'
import { useNavigate } from 'react-router-dom'

const BgBox = styled.div`
    width: 100%;
    min-height: 100%;
    background-image: image-set('/img/bg-home.png' 0.5x, '/img/bg-home.png' 1x, '/img/bg-home.png' 2x);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50%;
`

const CardBox = styled.div`
    border-radius: 1rem;
    background: rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(15.800000190734863px);
`
const TitleBox = styled.h4`
    color: #c2e2ff;
    font-family: Satoshi;
    font-style: normal;
    font-weight: 900;
    letter-spacing: -0.03125rem;
`
const SubTitleBox = styled.p`
    color: #c6d3dd;
    font-family: Satoshi;
    font-style: normal;
    line-height: 2rem; /* 133.333% */
    letter-spacing: -0.03125rem;
`

const ConnectWalletText = styled.span`
    color: #c6ddda;
    text-align: center;
    font-family: Satoshi;
    font-size: 1rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.5rem; /* 150% */
    letter-spacing: -0.03125rem;
`

const FooterText = styled.p`
    color: #c2e2ff;
    font-family: Satoshi;
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
`

export default function Home() {
    const web3Modal = useWeb3Modal()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [{ otp, numInputs, separator, placeholder, inputType }, setConfig] = useState({
        otp: '',
        numInputs: 5,
        separator: '',
        placeholder: '',
        inputType: 'text' as const,
    })

    const handleOTPChange = (otp: string) => {
        setConfig((prevConfig) => ({ ...prevConfig, otp }))
    }

    const enterInviteCode = () => {
        dispatch(setInviteCode(otp))
        navigate('/airdrop')
    }

    return (
        <BgBox className='relative pb-[13rem]'>
            <div className='flex justify-between pt-[9.5rem] pl-[6.5rem] pr-[6.88rem]'>
                <div>
                    <CardBox className='py-8 w-[30rem]'>
                        <TitleBox className='pl-[1.56rem] text-[2.5rem] leading-[3.5rem]'>
                            Bridge to Earn Yield and token rewards on zkLink Nova.
                        </TitleBox>
                        <SubTitleBox className='mt-4 px-6 text-[1.5rem] leading-8'>
                            The only Ethereum L2 with native yield for ETH and stablecoins. Airdrop now live.
                        </SubTitleBox>
                    </CardBox>
                    <div className='mt-4'>
                        <img
                            src='/img/btn-join-early-access.png'
                            className='cursor-pointer'
                            onClick={() => navigate('/airdrop')}
                        />
                    </div>
                </div>
                <div>
                    <CardBox className='py-8 w-[21.625rem] flex flex-col items-center text-center'>
                        <TitleBox className='text-[1.5rem] leading-[2rem]'>Enter Your Invite Code</TitleBox>
                        <SubTitleBox className='mt-[0.75rem] text-[1rem] leading-[1.5rem]'>
                            Enter Your Invite Code to participate the campaign
                        </SubTitleBox>

                        <div className='my-8'>
                            <OTPInput
                                inputStyle='inputStyle'
                                numInputs={numInputs}
                                onChange={handleOTPChange}
                                renderSeparator={<span>{separator}</span>}
                                value={otp}
                                placeholder={placeholder}
                                inputType={inputType}
                                renderInput={(props) => <input {...props} />}
                                shouldAutoFocus
                            />
                        </div>

                        <div>
                            <img
                                src='/img/btn-enter-invite-code.png'
                                className='cursor-pointer'
                                onClick={enterInviteCode}
                            />
                        </div>

                        <div className='mt-4'>
                            <ConnectWalletText
                                className='cursor-pointer text-[1rem]'
                                onClick={() => web3Modal.open()}>
                                Connect Wallet
                            </ConnectWalletText>
                        </div>
                    </CardBox>
                </div>
            </div>

            <div className='absolute bottom-0 py-[4.5rem] flex justify-between items-end pl-[6.5rem] pr-[8.94rem]  w-full'>
                <div>
                    <FooterText>TVL/$2,306,521,248</FooterText>
                    <FooterText className='mt-4'>TOTAL USERS / 173,933</FooterText>
                </div>
                <div className='flex items-center gap-[1.25rem]'>
                    <a href=''>
                        <img
                            src='/img/icon-medium.svg'
                            className='w-[1.5rem] h-[1.5rem]'
                        />
                    </a>
                    <a href=''>
                        <img
                            src='/img/icon-dc.svg'
                            className='w-[1.5rem] h-[1.5rem]'
                        />
                    </a>
                    <a href=''>
                        <img
                            src='/img/icon-tg.svg'
                            className='w-[1.5rem] h-[1.5rem]'
                        />
                    </a>
                    <a href=''>
                        <img
                            src='/img/icon-twitter.svg'
                            className='w-[1.25rem] h-[1.25rem]'
                        />
                    </a>
                    <a href=''>
                        <img
                            src='/img/icon-github.svg'
                            className='w-[1.5rem] h-[1.5rem]'
                        />
                    </a>
                </div>
            </div>
        </BgBox>
    )
}
