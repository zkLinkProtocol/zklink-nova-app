import { Button } from "@nextui-org/react";
import SBTUpGrade from "./SBTUpGrade";

export default function LeftSide() {
    return (
        <>
            <div className='mb-5'>
                <div className='mb-5'>Your Nova Char</div>
                <SBTUpGrade />
            </div>

            <div className='py-5 px-3 mb-5 border border-white rounded'>
                <div>zkLink Points</div>
                <div className='text-3xl mt-2'>100</div>

                <div className='flex mt-3'>
                    <div className='w-1/2'>
                        <div className='text-xs'>Earn by</div>
                        <div className='text-xs mt-2'>Your Deposit</div>
                        <div className='text-xl mt-2'>100</div>
                    </div>

                    <div className='w-1/2'>
                        <div className='text-xs'>Earn by</div>
                        <div className='text-xs mt-2'>Referring Friends</div>
                        <div className='text-xl mt-2'>10</div>
                    </div>
                </div>
            </div>

            <div className='py-5 px-3 mb-5 border border-white rounded'>
                <div className="flex items-center">
                    <span>Your Staking Value</span>
                    <Button>Switch to ETH/USD</Button>
                </div>
                <div className='text-xl mt-3'>$200,000</div>
                <div className='mt-5'>
                    <Button
                        className='font-bold bg-green-600 w-full text-2xl'
                        size='lg'>
                        Bridge More
                    </Button>
                </div>
            </div>
        </>
    )
}
