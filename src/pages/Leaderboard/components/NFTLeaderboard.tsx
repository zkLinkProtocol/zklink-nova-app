import { getTradeMarkRank } from "@/api";
import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function NFTLeaderboard() {
  const { address } = useAccount();

  const columns = [
    {
      key: "rank",
      label: "Rank",
    },
    {
      key: "address",
      label: "Name",
    },
    {
      key: "nftP1",
      label: "Chess Knight",
    },
    {
      key: "nftP2",
      label: "Binary Code Matrix Cube",
    },
    {
      key: "nftP3",
      label: "Oak Tree Roots",
    },
    {
      key: "nftP4",
      label: "Magnifying Glass",
    },
    {
      key: "balance",
      label: "Summary",
    },
  ];

  const [data, setData] = useState<
    {
      address: string;
      rank: number;
      nftP1: number;
      nftP2: number;
      nftP3: number;
      nftP4: number;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const showAccount = (acc: any) => {
    if (!acc) return;
    return `${acc.substr(0, 6)}******${acc.substr(-4)}`;
  };

  const getTradeMarkRankFunc = async () => {
    if (!address) return;
    setIsLoading(true);

    try {
      const { result } = await getTradeMarkRank(address);
      console.log("getTradeMarkRankFunc", result);

      let arr = [];

      if (result && result?.ranks && Array.isArray(result.ranks)) {
        // console.log("ranks", result.ranks);

        arr = result.ranks.map(
          (
            item: { address: string; detailBalance: number[] },
            index: number
          ) => {
            return {
              ...item,
              rank: index + 1,
              nftP1: Number(item?.detailBalance[0]) || 0,
              nftP2: Number(item?.detailBalance[1]) || 0,
              nftP3: Number(item?.detailBalance[2]) || 0,
              nftP4: Number(item?.detailBalance[3]) || 0,
            };
          }
        );
      }

      if (address && result && result?.selfBalance) {
        const { selfBalance } = result;
        const selfData = {
          address: showAccount(address),
          rank: 0,
          nftP1: selfBalance[0],
          nftP2: selfBalance[1],
          nftP3: selfBalance[2],
          nftP4: selfBalance[3],
          balance: selfBalance?.reduce(
            (prev: number, item: number) => prev + Number(item),
            0
          ),
        };

        arr.unshift(selfData);
      }

      console.log("ranks", arr);

      setData(arr);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
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
        <TableBody
          items={data}
          isLoading={isLoading}
          loadingContent={<Spinner label="Loading..." />}
        >
          {(item) => (
            <TableRow key={item.rank}>
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
