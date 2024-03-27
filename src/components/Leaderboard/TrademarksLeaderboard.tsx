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
      label: "Sum",
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
      balance: number;
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

      if (address) {
        const { selfBalance } = result;
        const selfData = {
          address: address,
          rank: result?.selfRank,
          nftP1: Number(selfBalance[0]) || 0,
          nftP2: Number(selfBalance[1]) || 0,
          nftP3: Number(selfBalance[2]) || 0,
          nftP4: Number(selfBalance[3]) || 0,
          balance:
            Number(
              selfBalance?.reduce(
                (prev: number, item: number) => prev + Number(item),
                0
              )
            ) || 0,
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
      <p className="py-2 mb-[1rem] text-[14px] text-[#C6D3DD] font-[400]">
        Please note that we capture the previous day's data at 10:00 UTC and
        publish it an hour later. Therefore, you may not be able to view your
        data immediately..
      </p>
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
          {data.map((item, index) =>
            index === 0 && address === item.address ? (
              <TableRow
                key={index}
                className="self-data border-b-1 border-slate-600"
              >
                <TableCell>{item.rank}</TableCell>
                <TableCell>
                  {showAccount(item.address)}{" "}
                  <span className="ml-[0.5rem]">(Your Address)</span>
                </TableCell>
                <TableCell>{item.nftP1}</TableCell>
                <TableCell>{item.nftP2}</TableCell>
                <TableCell>{item.nftP3}</TableCell>
                <TableCell>{item.nftP4}</TableCell>
                <TableCell>{item.balance}</TableCell>
              </TableRow>
            ) : (
              <TableRow key={index}>
                <TableCell>{item.rank}</TableCell>
                <TableCell>{item.address}</TableCell>
                <TableCell>{item.nftP1}</TableCell>
                <TableCell>{item.nftP2}</TableCell>
                <TableCell>{item.nftP3}</TableCell>
                <TableCell>{item.nftP4}</TableCell>
                <TableCell>{item.balance}</TableCell>
              </TableRow>
            )
          )}
          {/* {(item) => (
            <TableRow key={item.rank}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )} */}
        </TableBody>
      </Table>
    </>
  );
}
