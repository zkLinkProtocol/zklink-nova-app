import { getTradeMarkRank } from "@/api";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@nextui-org/react";
import { result } from "lodash";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function NFTLeaderboard() {
  const columns = [
    {
      key: "id",
      label: "Rank",
    },
    {
      key: "address",
      label: "Name",
    },
    {
      key: "nftP1",
      label: "NFT_P_1",
    },
    {
      key: "nftP2",
      label: "NFT_P_2",
    },
    {
      key: "nftP3",
      label: "NFT_P_3",
    },
    {
      key: "nftP4",
      label: "NFT_P_4",
    },
    {
      key: "balance",
      label: "SUM",
    },
  ];

  //   const rows = [
  //     {
  //       key: "1",
  //       name: "0x1234567...12345",
  //       rank: 6400,
  //       nftP1: 123,
  //       nftP2: 123,
  //       nftP3: 123,
  //       nftP4: 123,
  //       sum: 123456,
  //     },
  //     {
  //       key: "2",
  //       name: "0x1234567...12345",
  //       rank: 1,
  //       nftP1: 123,
  //       nftP2: 123,
  //       nftP3: 123,
  //       nftP4: 123,
  //       sum: 123456,
  //     },
  //     {
  //       key: "3",
  //       name: "0x1234567...12345",
  //       rank: 2,
  //       nftP1: 123,
  //       nftP2: 123,
  //       nftP3: 123,
  //       nftP4: 123,
  //       sum: 123456,
  //     },
  //     {
  //       key: "4",
  //       name: "0x1234567...12345",
  //       rank: 3,
  //       nftP1: 123,
  //       nftP2: 123,
  //       nftP3: 123,
  //       nftP4: 123,
  //       sum: 123456,
  //     },
  //   ];

  const [data, setData] = useState<
    {
      address: string;
      id: number;
    }[]
  >([]);

  const { address } = useAccount();
  const getTradeMarkRankFunc = async () => {
    if (!address) return;
    const { result } = await getTradeMarkRank(address);

    console.log("getTradeMarkRankFunc", result);
    if (result && result?.ranks && Array.isArray(result.ranks)) {
      console.log("ranks", result.ranks);

      const arr = result.ranks.map((item: any) => {
        return {
          ...item,
          nftP1: item?.detailBalance[0] || 0,
          nftP2: item?.detailBalance[1] || 0,
          nftP3: item?.detailBalance[2] || 0,
          nftP4: item?.detailBalance[3] || 0,
        };
      });
      setData(arr);
    }
  };

  useEffect(() => {
    getTradeMarkRankFunc();
  }, [address]);

  return (
    <>
      <Table
        removeWrapper
        className="table min-h-[30rem]"
        classNames={{ thead: "table-header", tbody: "table-tbody" }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={data}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
