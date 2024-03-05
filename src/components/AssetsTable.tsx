import { CardBox } from '@/styles/common'
import { Button, Checkbox, Skeleton, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import { useState } from 'react'
import styled from 'styled-components'

const TabsBar = styled.div`
    .tab-item {
        padding: 0.44rem 1.5rem;
        color: #a9a9a9;
        font-family: Poppins;
        font-size: 1rem;
        font-style: normal;
        font-weight: 400;
        line-height: 1.5rem; /* 150% */
        letter-spacing: -0.03125rem;
        cursor: pointer;
        user-select: none;

        &.hover,
        &.active {
            border-radius: 0.5rem;
            background: #fff;
            color: #000;
        }
    }
`

const TableItem = styled.div`
    .value {
        color: #fff;
        font-family: 'Space Mono';
        font-size: 0.875rem;
        font-style: normal;
        font-weight: 700;
        line-height: 1.375rem; /* 157.143% */
    }
    .sub-value {
        color: #8f9193;
        font-family: Satoshi;
        font-size: 0.875rem;
        font-style: normal;
        font-weight: 700;
        line-height: 1.375rem; /* 157.143% */
    }
    .tag {
        /* padding: 0.12rem 1rem; */
        text-align: center;
        font-family: Satoshi;
        font-size: 0.75rem;
        font-style: normal;
        font-weight: 500;
        line-height: 1.5rem; /* 200% */
        letter-spacing: -0.00375rem;

        &.tag-green {
            color: #0bc48f;
            border-radius: 0.375rem;
            background: rgba(11, 196, 143, 0.24);
        }

        &.tag-gradient-blue {
            color: #fff;
            border-radius: 0.375rem;
            background: linear-gradient(90deg, #64b3ec -0.39%, #1e1a6a 99.76%);
        }

        &.tag-gradient-purple {
            color: #fff;
            border-radius: 0.375rem;
            background: linear-gradient(90deg, #ddf3fd 0%, #7c3dc8 0.01%, #0f002b 100%);
        }
        &.tag-gradient-green {
            color: #fff;
            border-radius: 0.375rem;
            background: linear-gradient(90deg, #0bc48f 0%, #00192b 107.78%);
        }
    }
`

export const TableBox = styled.div`
    .table {
        padding: 0 1.5rem;
        border-radius: 1rem;
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(15.800000190734863px);
    }
    .table-header {
        tr {
            border-bottom: 0.0625rem solid #292a2a;
        }
        th {
            padding: 1.5rem 0;
            background: none;
            color: #7e7e7e;
            font-family: Satoshi;
            font-size: 1rem;
            font-style: normal;
            font-weight: 500;
            line-height: 1.5rem; /* 150% */
            letter-spacing: -0.005rem;
        }
    }

    .table-tbody {
        tr:first-child td {
            padding: 1.5rem 0 0.75rem;
        }
        tr:last-child td {
            padding: 0.75rem 0 1.5rem;
        }
        td {
            padding: 0.75rem 0;
        }
    }
`

export default function AssetsTable() {
    const [assetsTabsActive, setAssetsTabsActive] = useState(0)
    const [isSelected, setIsSelected] = useState(false)
    const assetList = [{ name: 'All' }, { name: 'Native' }, { name: 'Stablecoin' }, { name: 'RWA' }, { name: 'LST' }, { name: 'LRT' }]

    return (
        <>
            <CardBox className='mt-[2rem] p-[0.38rem] flex justify-between items-center'>
                <TabsBar className='flex items-center gap-[1.81rem]'>
                    {assetList.map((item, index) => (
                        <span
                            key={index}
                            className={`tab-item ${assetsTabsActive === index ? 'active' : ''}`}
                            onClick={() => setAssetsTabsActive(index)}>
                            {item.name}
                        </span>
                    ))}
                </TabsBar>
                <Checkbox
                    className='mr-[1.5rem] flex-row-reverse items-center gap-[0.5rem]'
                    isSelected={isSelected}
                    onValueChange={setIsSelected}>
                    My Holding
                </Checkbox>
            </CardBox>

            <TableBox>
                <Table
                    removeWrapper
                    className='table mt-[1.5rem]'
                    classNames={{ thead: 'table-header', tbody: 'table-tbody' }}>
                    <TableHeader>
                        <TableColumn>Name</TableColumn>
                        <TableColumn>TVL</TableColumn>
                        <TableColumn>Rewards</TableColumn>
                        <TableColumn>Your Deposit</TableColumn>
                        <TableColumn children={undefined}></TableColumn>
                    </TableHeader>
                    <TableBody>
                        {new Array(5).fill('').map((_, index) => {
                            return (
                                <TableRow
                                    key={index}
                                    className='py-5'>
                                    <TableCell>
                                        <TableItem className='flex items-center'>
                                            <Skeleton className='flex rounded-full w-[2.125rem] h-[2.125rem]' />
                                            <p className='value ml-[0.5rem]'>awstETH</p>
                                            <span className='tag tag-green ml-[0.44rem] px-[1rem] py-[0.12rem]'>2x boost</span>
                                        </TableItem>
                                    </TableCell>
                                    <TableCell>
                                        <TableItem>
                                            <div className='value'>200 awstETH</div>
                                            <div className='sub-value mt-[0.12rem]'>$1,000,000</div>
                                        </TableItem>
                                    </TableCell>
                                    <TableCell>
                                        <TableItem className='flex items-center gap-[0.44rem]'>
                                            <span className='tag tag-gradient-blue px-[1rem] py-[0.12rem]'>EL Points</span>
                                            <span className='tag tag-gradient-purple px-[1rem] py-[0.12rem]'>Kelp Miles</span>
                                            <span className='tag tag-gradient-green px-[1rem] py-[0.12rem]'>ZKL Points</span>
                                        </TableItem>
                                    </TableCell>
                                    <TableCell>
                                        <TableItem>
                                            <div className='value'>200 awstETH</div>
                                            <div className='sub-value mt-[0.12rem]'>$1,000,000</div>
                                        </TableItem>
                                    </TableCell>
                                    <TableCell>
                                        <Button className='bg-[#0BC48F] text-[#000] text-[1rem]'>Bridge More</Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableBox>
        </>
    )
}
