import { getAccountRank, getAccountsRank } from '@/api'
import { TableColumnItem } from '@/types'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

export default function PointsLeaderboard() {
    const columns: TableColumnItem[] = [
        {
            key: 'rank',
            label: 'Rank',
            align: 'start',
        },
        {
            key: 'name',
            label: 'Name',
            align: 'start',
        },
        {
            key: 'invitedBy',
            label: 'Invited by',
            align: 'start',
        },
        {
            key: 'stakingPts',
            label: 'Staking Pts',
            align: 'end',
        },
    ]

    const rows = [
        {
            key: '1',
            rank: 6400,
            name: '0x1234567...12345',
            invitedBy: '0x1234567...12345',
            stakingPts: '1,234',
        },
        {
            key: '2',
            rank: 1,
            name: '0x1234567...12345',
            invitedBy: '0x1234567...12345',
            stakingPts: '1,234',
        },
        {
            key: '3',
            rank: 2,
            name: '0x1234567...12345',
            invitedBy: '0x1234567...12345',
            stakingPts: '1,234',
        },
        {
            key: '4',
            rank: 3,
            name: '0x1234567...12345',
            invitedBy: '0x1234567...12345',
            stakingPts: '1,234',
        },
    ]

    const [data, setData] = useState<any[]>([])

    const getAccountsRankFunc = async () => {
        const res = await getAccountsRank()
        if (res?.result) {
            setData(res?.result)
        }
    }

    const { address } = useAccount()

    const getAccountRankFunc = async () => {
        if (!address) return
        const res = await getAccountRank(address)
        if (res?.result) {
            // setData(res?.result)
            let arr = [res?.result, ...data]

            setData(arr)
        }
    }

    useEffect(() => {
        getAccountsRankFunc()
        // getAccountRankFunc()
    }, [])

    return (
        <Table
            removeWrapper
            className='table min-h-[30rem]'
            classNames={{ thead: 'table-header', tbody: 'table-tbody' }}>
            <TableHeader columns={columns}>{(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}</TableHeader>
            <TableBody items={data}>
                {data.map((item: any, index: number) => {
                    return (
                        <TableRow
                            key={index}
                            className='py-5'>
                            <TableCell>{item.rank}</TableCell>
                            <TableCell>{item.address}</TableCell>
                            <TableCell>{item.inviteBy}</TableCell>
                            <TableCell>{item.novaPoint}</TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}
