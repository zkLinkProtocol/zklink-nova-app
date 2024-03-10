import { CardBox } from '@/styles/common'
import {
    Avatar,
    Button,
    Checkbox,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tooltip,
    useDisclosure,
} from '@nextui-org/react'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import BridgeComponent from '@/components/Bridge'
import { symbol } from 'prop-types'
import { formatNumberWithUnit } from '@/utils'

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

        &.tag-gradient-1 {
            color: #fff;
            border-radius: 0.375rem;
            border-radius: 0.375rem;
            background: linear-gradient(90deg, #0AC08C -0.39%, #013038 99.76%);
        }
        &.tag-gradient-2 {
            color: #fff;
            border-radius: 0.375rem;
            border-radius: 0.375rem;
            background: linear-gradient(90deg, #793BC4 -0.39%, #150334 99.76%);
        }
        &.tag-gradient-3 {
            color: #fff;
            border-radius: 0.375rem;
            border-radius: 0.375rem;
            background: linear-gradient(90deg, #64B3EC -0.39%, #1E1A6A 99.76%);
        }
        &.tag-gradient-4 {
            color: #fff;
            border-radius: 0.375rem;
            border-radius: 0.375rem;
            background: linear-gradient(90deg, #075A5A -0.39%, #000404 99.76%);
        }
        &.tag-gradient-5 {
            color: #fff;
            border-radius: 0.375rem;
            border-radius: 0.375rem;
            background: linear-gradient(90deg, #874FFF -0.39%, #41FF54 99.76%);
        }
        &.tag-gradient-6 {
            color: #fff;
            border-radius: 0.375rem;
            border-radius: 0.375rem;
            background: linear-gradient(90deg, #ACE730 -0.39%, #324900 99.76%);
        }
        &.tag-gradient-7 {
            color: #fff;
            border-radius: 0.375rem;
            border-radius: 0.375rem;
            background: linear-gradient(90deg, #905EF0 -0.39%, #2CB8F9 99.76%);
        }
        &.tag-gradient-8 {
            color: #fff;
            border-radius: 0.375rem;
            border-radius: 0.375rem;
            background: linear-gradient(90deg, #2E64EB -0.39%, #00061B 99.76%);
        }
        &.tag-gradient-9 {
            color: #fff;
            border-radius: 0.375rem;
            border-radius: 0.375rem;
            background: linear-gradient(90deg, #91B3F0 -0.39%, #051635 99.76%);
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

export type AssetsListItem = {
    // acount tvl
    tvl: string,
    amount: string,
    tokenAddress: string,
    iconURL: string,
    // total tvl by token
    groupAmount: string,
    groupTvl: string,
    // support token
    symbol: string,
    address: string,
    decimals: number,
    cgPriceId: string,
    type: string,
    yieldType: string[],
    multiplier: string,
}

interface IAssetsTableProps {
    data: any[]
    totalTvlList: any[]
    supportTokens: any[]
}

export default function AssetsTable(props: IAssetsTableProps) {
    const { data, totalTvlList, supportTokens } = props
    const [assetsTabsActive, setAssetsTabsActive] = useState(0)
    const [assetTabList, setAssetTabList] = useState([{ name: 'All' }])
    const [tableList, setTableList] = useState<AssetsListItem[]>([])
    const [bridgeToken, setBridgeToken] = useState('')
    const [isMyHolding, setIsMyHolding] = useState(false)
    const bridgeModal = useDisclosure()

    const yieldsTypeList = ['NOVA Points', 'Native Yield', 'EL Pts', 'Kelp Miles', 'Puffer Pts', 'ezPoints', 'Loyalty Pts', 'Pearls', 'Shard']

    const getTotalTvl = (symbol: string) => {
        return totalTvlList.find((item: any) => item.symbol == symbol)
    }

    const handleBridgeMore = (token: string) => {
        setBridgeToken(token)
        bridgeModal.onOpen()
    }

    const getToken = (symbol: string) => {
        const obj = supportTokens.find((item) => item.symbol == symbol)
        return obj
    }
    useEffect(() => {
        let arr = [{ name: 'All' }]
        supportTokens.forEach((item) => {
            if (item?.type) {
                arr.push({ name: item?.type })
            }
        })

        console.log('assets list', arr)

        setAssetTabList(arr)
    }, [supportTokens])

    useEffect(() => {

        let arr:AssetsListItem[] = []
        
        if (isMyHolding) {
            arr = data.map((item: any) => {
                const tokenObj = getToken(item?.symbol)
                const totalTvlObj = getTotalTvl(item?.symbol)

                let obj = {
                    // acount tvl
                    tvl: formatNumberWithUnit(+item?.tvl),
                    amount: formatNumberWithUnit(+item?.amount),
                    tokenAddress: item?.tokenAddress,
                    iconURL: item?.iconURL,
                    // total tvl by token
                    groupAmount: formatNumberWithUnit(+totalTvlObj?.tvl),
                    groupTvl: formatNumberWithUnit(+totalTvlObj?.amount),
                    // support token
                    symbol: tokenObj?.symbol,
                    address: tokenObj?.address,
                    decimals: tokenObj?.decimals,
                    cgPriceId: tokenObj?.cgPriceId,
                    type: tokenObj?.type,
                    yieldType: tokenObj?.yieldType,
                    multiplier: tokenObj?.multiplier,
                }
                return obj
            })
    
           
            // if (isMyHolding) {
            //     arr = arr.filter((item) => +item.tvl !== 0)
            // }
    
        } else {
            arr = supportTokens.map(item => {
                const accountTvlObj = data.find(obj => obj?.symbol == item?.symbol)
                const totalTvlObj = getTotalTvl(item?.symbol)

                let obj = {
                    // acount tvl
                    tvl: formatNumberWithUnit(+accountTvlObj?.tvl),
                    amount: formatNumberWithUnit(+accountTvlObj?.amount),
                    tokenAddress: accountTvlObj?.tokenAddress,
                    iconURL: accountTvlObj?.iconURL,
                    // total tvl by token
                    groupAmount: formatNumberWithUnit(+totalTvlObj?.tvl),
                    groupTvl: formatNumberWithUnit(+totalTvlObj?.amount),
                    // support token
                    symbol: item?.symbol,
                    address: item?.address,
                    decimals: item?.decimals,
                    cgPriceId: item?.cgPriceId,
                    type: item?.type,
                    yieldType: item?.yieldType,
                    multiplier: item?.multiplier,
                }
                return obj
            })
        }

         if (assetsTabsActive !== 0) {
            const filterType = assetTabList[assetsTabsActive].name
            arr = arr.filter((item) => item?.type === filterType)
        }
      
        console.log('assets list--------', arr)
        setTableList(arr)
        // // const arr = data.filter(item => item.)
        // setTableList()
    }, [isMyHolding, assetsTabsActive, data, supportTokens])


    return (
        <>
            <CardBox className='mt-[2rem] p-[0.38rem] flex justify-between items-center'>
                <TabsBar className='flex items-center gap-[1.81rem]'>
                    {assetTabList.map((item, index) => (
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
                    isSelected={isMyHolding}
                    onValueChange={setIsMyHolding}>
                    My Holding
                </Checkbox>
            </CardBox>

            <TableBox>
                <Table
                    removeWrapper
                    className='table mt-[1.5rem] min-h-[30rem]'
                    classNames={{ thead: 'table-header', tbody: 'table-tbody' }}>
                    <TableHeader>
                        <TableColumn>Name</TableColumn>
                        <TableColumn>TVL</TableColumn>
                        <TableColumn>
                            <div className='flex gap-[0.5rem] items-center'>
                                <span>Yield Opportunity</span>
                                <Tooltip
                                    className='p-[1rem]'
                                    content={<p className='text-[1rem]'>Users will receive yields from all related parties.</p>}>
                                    <img
                                        src='/img/icon-info.svg'
                                        className='w-[0.875rem] h-[0.875rem] opacity-40'
                                    />
                                </Tooltip>
                            </div>
                        </TableColumn>
                        <TableColumn>Your Deposit</TableColumn>
                        <TableColumn children={undefined}></TableColumn>
                    </TableHeader>
                    <TableBody>
                        {tableList.map((item: AssetsListItem, index) => {
                            return (
                                <TableRow
                                    key={index}
                                    className='py-5'>
                                    <TableCell>
                                        <TableItem className='flex items-center'>
                                            <img src={item.iconURL} className='flex rounded-full w-[2.125rem] h-[2.125rem]' />
                                            <p className='value ml-[0.5rem]'>{item?.symbol}</p>
                                            <span className='tag tag-green ml-[0.44rem] px-[1rem] py-[0.12rem]'>{item?.multiplier}x boost</span>
                                        </TableItem>
                                    </TableCell>
                                    <TableCell>
                                        <TableItem>
                                            <div className='value'>
                                                {item.groupAmount}
                                            </div>
                                            <div className='sub-value mt-[0.12rem]'>${item.groupTvl}</div>
                                        </TableItem>
                                    </TableCell>
                                    <TableCell>
                                        <TableItem className='flex items-center gap-[0.44rem]'>
                                            {
                                                item?.yieldType && Array.isArray(item?.yieldType) && item?.yieldType.map((type, index) => (
                                                    <span key={index} className={`tag px-[1rem] py-[0.12rem] tag-gradient-${yieldsTypeList.indexOf(type) + 1}`}>{type}</span>

                                                ))
                                            }
                                            {/* <span className='tag tag-gradient-purple px-[1rem] py-[0.12rem]'>Kelp Miles</span> */}
                                            {/* <span className='tag tag-gradient-green px-[1rem] py-[0.12rem]'>ZKL Points</span> */}
                                        </TableItem>
                                    </TableCell>
                                    <TableCell>
                                        <TableItem>
                                            <div className='value'>
                                                {item.amount}
                                            </div>
                                            <div className='sub-value mt-[0.12rem]'>${item.tvl}</div>
                                        </TableItem>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            className='bg-[#0BC48F] text-[#000] text-[1rem]'
                                            onClick={() => {
                                                console.log('item: ', item)
                                                handleBridgeMore(item.tokenAddress)
                                            }}>
                                            Bridge More
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableBox>

            <Modal
                style={{ minHeight: '600px' }}
                size='2xl'
                isOpen={bridgeModal.isOpen}
                onOpenChange={bridgeModal.onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Bridge</ModalHeader>
                            <ModalBody className='pb-8'>
                                <BridgeComponent
                                    isFirstDeposit={false}
                                    bridgeToken={bridgeToken}
                                    onClose={onClose}
                                />
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}
