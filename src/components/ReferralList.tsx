import styled from 'styled-components'

const ListItem = styled.div`
    border-top: 0.0625rem solid #292a2a;
`

export default function ReferralList() {
    const referralData = [
        {
            address: '0x3125523...41323',
            value: 10,
        },
        {
            address: '0x3125523...41323',
            value: 10,
        },
        {
            address: '0x3125523...41323',
            value: 10,
        },
        {
            address: '0x3125523...41323',
            value: 10,
        },
        {
            address: '0x3125523...41323',
            value: 10,
        },
        {
            address: '0x3125523...41323',
            value: 10,
        },
    ]

    return (
        <>
            <div className='px-[1.5rem] py-[0.5rem] flex justify-between text-[#7E7E7E] text-[1rem] leading-[1.5rem]'>
                <span>Name</span>
                <span>Staking Value</span>
            </div>

            {referralData.map((item, index) => (
                <ListItem
                    className='px-[1.5rem] py-[1.5rem] flex justify-between text-[0.875rem] font-[700]'
                    key={index}>
                    <span>{item.address}</span>
                    <span>{item.value} ETH</span>
                </ListItem>
            ))}
        </>
    )
}
