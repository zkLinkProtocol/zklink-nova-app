import { getAccountRank, getAccountsRank } from "@/api";
import { TableColumnItem } from "@/types";
import { formatNumberWithUnit } from "@/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

type DataItem = {
  novaPoint: number;
  referPoint: number;
  rank: number;
  inviteBy: string | null;
  address: string;
};

export default function PointsLeaderboard() {
  const columns: TableColumnItem[] = [
    {
      key: "rank",
      label: "Rank",
      align: "start",
    },
    {
      key: "name",
      label: "Address",
      align: "start",
    },
    {
      key: "invitedBy",
      label: "Referral Address",
      align: "start",
    },
    {
      key: "stakingPts",
      label: "Nova Points",
      align: "end",
    },
  ];

  const [data, setData] = useState<DataItem[]>([]);

  const { address } = useAccount();

  const getAccountsRankFunc = async () => {
    let arr: DataItem[] = [];
    const res = await getAccountsRank();
    if (res?.result) {
      arr = res.result;
    }

    if (address) {
      const accountRankRes = await getAccountRank(address);
      if (accountRankRes?.result) {
        arr.unshift(accountRankRes.result);
      }
    }
    setData(arr);
  };

  const showAccount = (acc: any) => {
    if (!acc) return;
    return `${acc.substr(0, 8)}...${acc.substr(-12)}`;
  };

  useEffect(() => {
    getAccountsRankFunc();
  }, [address]);

  return (
    <Table
      removeWrapper
      className="table min-h-[30rem]"
      classNames={{ thead: "table-header", tbody: "table-tbody" }}
    >
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>

      <TableBody items={data}>
        {data.map((item: any, index: number) =>
          index === 0 &&
          item?.address?.toLowerCase() === address?.toLowerCase() ? (
            <TableRow key={index} className="border-b-1 border-slate-600">
              <TableCell>{item.rank}</TableCell>
              <TableCell>{showAccount(item.address)} <span className="ml-[0.5rem]">(Your Address)</span></TableCell>
              <TableCell>{showAccount(item.inviteBy)}</TableCell>
              <TableCell>
                {formatNumberWithUnit(
                  (+item?.novaPoint || 0) + (+item?.referPoint || 0)
                )}
              </TableCell>
            </TableRow>
          ) : (
            <TableRow key={index}>
              <TableCell>{item.rank}</TableCell>
              <TableCell>{showAccount(item.address)}</TableCell>
              <TableCell>{showAccount(item.inviteBy)}</TableCell>
              <TableCell>
                {formatNumberWithUnit(
                  (+item?.novaPoint || 0) + (+item?.referPoint || 0)
                )}
              </TableCell>
            </TableRow>
          )
        )}
      </TableBody>
    </Table>
  );
}
