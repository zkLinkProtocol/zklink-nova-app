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

import moment from "moment";

type TopInviteAndRandomRes = {
  address: string;
  invitenNumber: number;
  createdAt: string;
};

type TopInviteAndRandom = TopInviteAndRandomRes & {
  rank: number;
  rewardType: string;
};

export default function NFTLuckWinner() {
  const [epochTime, setEpochTime] = useState(0);
  const [lastEpochTime, setLastEpochTime] = useState(0);
  const [dateParams, setDateParams] = useState("");

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

  const [inviteAndRandomList, setInviteAndRandomList] = useState<
    TopInviteAndRandom[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const getTopInviteAndRandomFunc = async (date?: string) => {
    setIsLoading(true);
    try {
      const { result } = await getTopInviteAndRandom(date);
      console.log("getTopInviteAndRandom", result);

      let top100Arr: TopInviteAndRandom[] = [];
      let random100Arr: TopInviteAndRandom[] = [];

      if (result && result?.top100 && Array.isArray(result.top100)) {
        const { top100 } = result;

        const arr = top100.map(
          (item: TopInviteAndRandomRes, index: number) => ({
            ...item,
            rewardType: "Top 100 Referrer",
            rank: index + 1,
          })
        );
        top100Arr = arr;
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
        random100Arr = arr;
      }

      const all = top100Arr.concat(random100Arr);
      if (!date && all.length > 0) {
        const ts = new Date(all[0].createdAt).getTime();
        setEpochTime(ts);
        setLastEpochTime(ts);
      }

      setInviteAndRandomList(all);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  //   const inviteAndRandomList = useMemo(() => {
  //     return top100.concat(random100);
  //   }, [top100, random100]);

  const getUtcTime = (ts: number) => {
    return moment(ts).utc().format("DD/MM/YYYY hh:mm:ss");
  };

  const handlePrevDate = (ts: number) => {
    if (!ts) return;
    const prevTs = ts - 86400000;
    const prevDate = moment(prevTs).format("YYYY-MM-DD");

    setEpochTime(prevTs);
    setDateParams(prevDate);
    console.log(prevDate);

    getTopInviteAndRandomFunc(prevDate);
  };

  const isLast = useMemo(() => {
    if (epochTime >= lastEpochTime) {
      return true;
    } else {
      return false;
    }
  }, [epochTime, lastEpochTime]);

  const handleNextDate = (ts: number) => {
    if (!ts || isLast) return;
    const prevTs = ts + 86400000;
    const prevDate = moment(prevTs).format("YYYY-MM-DD");

    setEpochTime(prevTs);
    setDateParams(prevDate);
    console.log(prevDate);

    getTopInviteAndRandomFunc(prevDate);
  };

  //   useEffect(() => {
  //     if (inviteAndRandomList && inviteAndRandomList.length > 0) {
  //       const timestr = new Date(inviteAndRandomList[0].createdAt).getTime();
  //       setEpochTime(timestr);
  //     } else {
  //       setEpochTime(0);
  //     }
  //   }, [inviteAndRandomList, epochTime]);

  useEffect(() => {
    getTopInviteAndRandomFunc();
  }, []);

  return (
    <div className="relative z-1">
      {Boolean(epochTime) && (
        <div className="flex justify-end items-center py-4 px-2">
          <span className="text-[16px]">Epoch</span>

          <div className="flex items-center gap-2 text-[16px]">
            <span
              className="px-4 cursor-pointer"
              onClick={() => handlePrevDate(epochTime)}
            >
              <AiFillCaretLeft />
            </span>
            <span>
              from {getUtcTime(epochTime - 86400000)} UTC to{" "}
              {getUtcTime(epochTime)} UTC
            </span>
            <span
              className={`px-4 cursor-pointer ${
                isLast ? "cursor-not-allowed opacity-40" : ""
              }`}
              onClick={() => handleNextDate(epochTime)}
            >
              <AiFillCaretRight />
            </span>
          </div>
        </div>
      )}

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
          {inviteAndRandomList.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.address}</TableCell>
              <TableCell>{item.invitenNumber}</TableCell>
              <TableCell>{item.rewardType}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
