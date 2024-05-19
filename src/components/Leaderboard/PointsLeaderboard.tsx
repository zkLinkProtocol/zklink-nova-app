import { getAccountRank, getAccountsRank } from "@/api";
import useNovaPoints from "@/hooks/useNovaPoints";
import { TableColumnItem } from "@/types";
import { formatNumberWithUnit } from "@/utils";
import {
  Button,
  Spinner,
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
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const limit = 50;

  const { address } = useAccount();

  const getAccountsRankFunc = async (isLoadMore = false) => {
    if (isLoadMore) {
      setIsLoadMoreLoading(isLoadMore);
    } else {
      setIsLoading(true);
    }

    const nextPage = !isLoadMore ? 1 : page;

    let arr: DataItem[] = [];

    try {
      const res = await getAccountsRank({
        limit,
        page: nextPage,
      });
      if (res?.result && Array.isArray(res.result) && res.result.length > 0) {
        arr = res.result;
        setPage(nextPage + 1);
      }

      if (arr.length < limit) {
        setHasMore(false);
      }

      if (address && nextPage === 1) {
        const { result } = await getAccountRank(address);

        if (result) {
          arr.unshift({
            ...result,
          });
        }
      }

      if (isLoadMore) {
        arr = data.concat(arr);
      }

      setData(arr);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsLoadMoreLoading(false);
    }
  };

  const showAccount = (acc: any) => {
    if (!acc) return;
    return `${acc.substr(0, 8)}...${acc.substr(-8)}`;
  };

  useEffect(() => {
    setPage(1);
    getAccountsRankFunc();
  }, [address]);

  const { totalNovaPoints } = useNovaPoints();
  useEffect(() => {
    console.log("totalNovaPoints", totalNovaPoints);
  }, [totalNovaPoints]);

  return (
    <>
      <p className="py-2 mb-[1rem] text-[14px] text-[#C6D3DD] font-[400]">
        Please note that the leaderboard currently displays only the Nova Points
        earned through deposits and holdings. It does not yet include Nova
        Points earned from interacting with eco dapps, invite boxes, and other
        activities. Don't worry—you won't lose these points. They will be shown
        on the leaderboard soon.
      </p>
      <Table
        removeWrapper
        className="table min-h-[30rem]"
        classNames={{ thead: "table-header", tbody: "table-tbody" }}
        bottomContent={
          hasMore && !isLoading ? (
            <div className="flex w-full justify-center">
              <Button
                isDisabled={isLoadMoreLoading}
                variant="flat"
                onPress={() => getAccountsRankFunc(true)}
              >
                {isLoadMoreLoading && <Spinner color="white" size="sm" />}
                Load More
              </Button>
            </div>
          ) : null
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>

        <TableBody
          items={data}
          isLoading={isLoading}
          loadingContent={<Spinner label="Loading..." />}
        >
          {data.map((item: any, index: number) =>
            index === 0 &&
            item?.address?.toLowerCase() === address?.toLowerCase() ? (
              <TableRow
                key={index}
                className="self-data border-b-1 border-slate-600"
              >
                <TableCell>{item.rank}</TableCell>
                <TableCell>
                  {showAccount(item.address)}{" "}
                  <span className="ml-[0.5rem]">(Your Address)</span>
                </TableCell>
                <TableCell>{showAccount(item.inviteBy)}</TableCell>
                <TableCell>{formatNumberWithUnit(totalNovaPoints)}</TableCell>
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
    </>
  );
}
