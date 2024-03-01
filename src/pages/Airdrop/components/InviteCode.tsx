import React, { useState } from 'react'
import styled from 'styled-components'
import OTPInput from 'react-otp-input'
import { Button } from '@nextui-org/react'
import '@/styles/otp-input.css'
import { useDispatch } from 'react-redux'
import { setCurrentStatus, setInviteCode } from '@/store/modules/airdrop'

const InviteBox = styled.div`
    .sub-title {
        color: #999;
    }
`

const InviteCode: React.FC = () => {
    const dispatch = useDispatch()
    const [{ otp, numInputs, separator, placeholder, inputType }, setConfig] = useState({
        otp: '',
        numInputs: 6,
        separator: '',
        placeholder: '',
        inputType: 'text' as const,
    })

    const handleOTPChange = (otp: string) => {
        setConfig((prevConfig) => ({ ...prevConfig, otp }))
    }

    const enterInviteCode = () => {
        dispatch(setInviteCode(otp))
        dispatch(setCurrentStatus(1))
    }

    return (
        <>
            <InviteBox>
                <div className='flex justify-center items-center py-40'>
                    <div className='text-center'>
                        <p className='text-base text-white'>Enter Your Invite Code</p>
                        <p className='text-sm sub-title mt-5'>Enter Your Invite Code to participate the campaign</p>
                        {/* <div>
                            <OtpInput
                                value={otp}
                                onChange={setOtp}
                                numInputs={6}
                                renderSeparator={<span>-</span>}
                                renderInput={(props) => <input {...props} />}
                            />
                        </div> */}
                        <div className='mt-5'>
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
                        <div className='mt-10'>
                            <Button
                                color='success'
                                onClick={enterInviteCode}>
                                Enter Invite Code
                            </Button>
                        </div>
                        <p className='text-base text-white mt-5'>Already signed?</p>
                        <p className='text-sm sub-title mt-5'>Connect Wallet</p>
                    </div>
                </div>
            </InviteBox>
        </>
    )
}

export default InviteCode
