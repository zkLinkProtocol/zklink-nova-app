import { Button, Skeleton, Tab, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tabs } from '@nextui-org/react'

export default function AssetsTable() {
    return (
        <>
            <div className='bg-neutral-800 rounded'>
                <Tabs
                    size='md'
                    variant={'light'}
                    aria-label='Tabs variants'>
                    <Tab
                        key='1'
                        title='All'
                    />
                    <Tab
                        key='2'
                        title='Re-staking'
                    />
                    <Tab
                        key='3'
                        title='Native Assets'
                    />
                    <Tab
                        key='4'
                        title='Liquidity Staking'
                    />
                </Tabs>
            </div>

            <Table
                aria-label='Example static collection table'
                className='mt-5'>
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
                                    <div className='flex align-center'>
                                        <Skeleton className='flex rounded-full w-5 h-5 mr-1' />
                                        <span>awstETH</span>
                                        <div className='ml-2 px-2 bg-green-900 text-green-300 rounded'>2x boost</div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div>200 awstETH</div>
                                    <div className='text-sub-title'>$1,000,000</div>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        className='ml-2 bg-gradient-to-tr from-blue-500 to-black-500 text-white shadow-lg'
                                        size='sm'>
                                        EL Points
                                    </Button>
                                    <Button
                                        size='sm'
                                        className='ml-2 bg-gradient-to-tr from-purple-500 to-black-500 text-white shadow-lg'>
                                        EL Points
                                    </Button>
                                    <Button
                                        size='sm'
                                        className='ml-2 bg-gradient-to-tr from-green-500 to-black-500 text-white shadow-lg'>
                                        EL Points
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <div>200 awstETH</div>
                                    <div className='text-sub-title'>$1,000,000</div>
                                </TableCell>
                                <TableCell>
                                    <Button color='success'>Bridge More</Button>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </>
    )
}
