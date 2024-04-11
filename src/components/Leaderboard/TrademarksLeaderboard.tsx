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
      key: "chessKnight",
      label: "Chess Knight",
    },
    {
      key: "binaryCodeMatrixCube",
      label: "Binary Code Matrix Cube",
    },
    {
      key: "oakTreeRoots",
      label: "Oak Tree Roots",
    },
    {
      key: "magnifyingGlass",
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
      chessKnight: number;
      binaryCodeMatrixCube: number;
      oakTreeRoots: number;
      magnifyingGlass: number;
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
              oakTreeRoots: Number(item?.detailBalance[0]) || 0,
              magnifyingGlass: Number(item?.detailBalance[1]) || 0,
              chessKnight: Number(item?.detailBalance[2]) || 0,
              binaryCodeMatrixCube: Number(item?.detailBalance[3]) || 0,
            };
          }
        );
      }

      if (address) {
        const { selfBalance } = result;
        const selfData = {
          address: address,
          rank: result?.selfRank,
          oakTreeRoots: Number(selfBalance[0]) || 0,
          magnifyingGlass: Number(selfBalance[1]) || 0,
          chessKnight: Number(selfBalance[2]) || 0,
          binaryCodeMatrixCube: Number(selfBalance[3]) || 0,
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
                <TableCell>{item.chessKnight}</TableCell>
                <TableCell>{item.binaryCodeMatrixCube}</TableCell>
                <TableCell>{item.oakTreeRoots}</TableCell>
                <TableCell>{item.magnifyingGlass}</TableCell>
                <TableCell>{item.balance}</TableCell>
              </TableRow>
            ) : (
              <TableRow key={index}>
                <TableCell>{item.rank}</TableCell>
                <TableCell>{item.address}</TableCell>
                <TableCell>{item.chessKnight}</TableCell>
                <TableCell>{item.binaryCodeMatrixCube}</TableCell>
                <TableCell>{item.oakTreeRoots}</TableCell>
                <TableCell>{item.magnifyingGlass}</TableCell>
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
