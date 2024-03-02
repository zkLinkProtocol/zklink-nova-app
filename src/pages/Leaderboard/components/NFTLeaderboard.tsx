import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from '@nextui-org/react'

export default function NFTLeaderboard() {
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
            key: 'nftP1',
            label: 'NFT_P_1',
        },
        {
            key: 'nftP2',
            label: 'NFT_P_2',
        },
        {
            key: 'nftP3',
            label: 'NFT_P_3',
        },
        {
            key: 'nftP4',
            label: 'NFT_P_4',
        },
        {
            key: 'sum',
            label: 'SUM',
        },
    ]

    const rows = [
        {
            key: '1',
            name: '0x1234567...12345',
            rank: 6400,
            nftP1: 123,
            nftP2: 123,
            nftP3: 123,
            nftP4: 123,
            sum: 123456,
        },
        {
            key: '2',
            name: '0x1234567...12345',
            rank: 1,
            nftP1: 123,
            nftP2: 123,
            nftP3: 123,
            nftP4: 123,
            sum: 123456,
        },
        {
            key: '3',
            name: '0x1234567...12345',
            rank: 2,
            nftP1: 123,
            nftP2: 123,
            nftP3: 123,
            nftP4: 123,
            sum: 123456,
        },
        {
            key: '4',
            name: '0x1234567...12345',
            rank: 3,
            nftP1: 123,
            nftP2: 123,
            nftP3: 123,
            nftP4: 123,
            sum: 123456,
        },
    ]

    return (
        <>
            <Table aria-label='Example table with dynamic content'>
                <TableHeader columns={columns}>{(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}</TableHeader>
                <TableBody items={rows}>
                    {(item) => <TableRow key={item.key}>{(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}</TableRow>}
                </TableBody>
            </Table>
        </>
    )
}
