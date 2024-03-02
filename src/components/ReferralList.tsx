export default function ReferralList() {
    return (
        <>
            <div className='flex justify-between py-6 text-sm'>
                <span>Name</span>
                <span>Staking Value</span>
            </div>
            <div className='flex justify-between py-1 text-lg'>
                <span>0x3125523...41323</span>
                <span>$1000</span>
            </div>
            {new Array(6).fill('').map((_, index) => (
                <div
                    className='flex justify-between py-1 text-lg'
                    key={index}>
                    <span>0x3125523...41323</span>
                    <span>1 ETH</span>
                </div>
            ))}
        </>
    )
}
