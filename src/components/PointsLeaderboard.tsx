import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from '@nextui-org/react'

export default function PointsLeaderboard() {
    const columns = [
        {
            key: 'rank',
            label: 'Rank',
        },
        {
            key: 'name',
            label: 'Name',
        },
        {
            key: 'invitedBy',
            label: 'Invited by',
        },
        {
            key: 'stakingPts',
            label: 'Staking Pts',
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

    return (
        <Table
            removeWrapper
            className='table'
            classNames={{ thead: 'table-header', tbody: 'table-tbody' }}>
            <TableHeader columns={columns}>{(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}</TableHeader>
            <TableBody items={rows}>
                {(item) => <TableRow key={item.key}>{(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}</TableRow>}
            </TableBody>
        </Table>
    )
}
