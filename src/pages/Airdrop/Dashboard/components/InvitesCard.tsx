export default function InvitesCard() {
    return (
        <>
            <div>
                <div className='py-5 text-lg'>Invites</div>
                <div className='flex justify-between px-6 py-8 border border-white rounded-lg'>
                    <div>
                        <div>Number of Referrals</div>
                        <div className='text-2xl mt-2'>100</div>
                    </div>
                    <div>
                        <div>Staking Value of Referrals</div>
                        <div className='text-2xl mt-2'>$100</div>
                    </div>
                    <div>
                        <div>Invite by:</div>
                        <div className='text-lg mt-2'>0x123..321</div>
                    </div>
                    <div>
                        <div>Your Invite Code</div>
                        <div className='text-lg mt-2'>
                            https://zk.link/1QE2re <span className='text-green-500'>Copy</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
