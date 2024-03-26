import { getTopInviteAndRandom } from "@/api";
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
import { useEffect, useMemo, useState } from "react";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";

type TopInviteAndRandomRes = {
  address: string;
  invitenNumber: number;
};

type TopInviteAndRandom = TopInviteAndRandomRes & {
  rank: number;
  rewardType: string;
};

export default function NFTLuckWinner() {
  const [epochTime, setEpochTime] = useState("03/18/2024 UTC 10:00");
  const columns = [
    {
      key: "rank",
      label: "Referral Rank",
    },
    {
      key: "address",
      label: "Name",
    },
    {
      key: "invitenNumber",
      label: "Daily Referral Amount",
    },
    {
      key: "rewardType",
      label: "Reward Type",
    },
  ];

  const rows = [
    {
      key: "1",
      name: "0x1234567...12345",
      rank: 6400,
      nftP1: 123,
      nftP2: 123,
      nftP3: 123,
      nftP4: 123,
      sum: 123456,
    },
    {
      key: "2",
      name: "0x1234567...12345",
      rank: 1,
      nftP1: 123,
      nftP2: 123,
      nftP3: 123,
      nftP4: 123,
      sum: 123456,
    },
    {
      key: "3",
      name: "0x1234567...12345",
      rank: 2,
      nftP1: 123,
      nftP2: 123,
      nftP3: 123,
      nftP4: 123,
      sum: 123456,
    },
    {
      key: "4",
      name: "0x1234567...12345",
      rank: 3,
      nftP1: 123,
      nftP2: 123,
      nftP3: 123,
      nftP4: 123,
      sum: 123456,
    },
  ];

  const [top100, setTop100] = useState<TopInviteAndRandom[]>([]);
  const [random100, setRandom100] = useState<TopInviteAndRandom[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getTopInviteAndRandomFunc = async () => {
    setIsLoading(true);
    try {
      const { result } = await getTopInviteAndRandom();
      console.log("getTopInviteAndRandom", result);

      if (result && result?.top100 && Array.isArray(result.top100)) {
        const { top100 } = result;

        const arr = top100.map(
          (item: TopInviteAndRandomRes, index: number) => ({
            ...item,
            rewardType: "Top 100 Referrer",
            rank: index + 1,
          })
        );
        setTop100(arr);
      }

      if (result && result?.top100 && Array.isArray(result.random100)) {
        const { random100 } = result;

        const arr = random100.map(
          (item: TopInviteAndRandomRes, index: number) => ({
            ...item,
            rewardType: "Lucky Lynks",
            rank: index + 1,
          })
        );
        setRandom100(arr);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const inviteAndRandomList = useMemo(() => {
    return top100.concat(random100);
  }, [top100, random100]);

  useEffect(() => {
    getTopInviteAndRandomFunc();
  }, []);

  return (
    <div className="relative z-1">
      <div className="flex justify-end items-center py-4 px-2">
        <span className="text-[16px]">Epoch</span>

        <div className="flex items-center gap-2 text-[16px]">
          <span className="px-4 cursor-pointer">
            <AiFillCaretLeft />
          </span>
          <span>from {epochTime}</span>
          <span className="px-4 cursor-pointer">
            <AiFillCaretRight />
          </span>
        </div>
      </div>
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
          items={inviteAndRandomList}
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
    </div>
  );
}
