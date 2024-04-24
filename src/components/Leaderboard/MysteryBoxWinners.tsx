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
import { useAccount } from "wagmi";

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
  const { address: walletAddress } = useAccount();
  const columns = [
    {
      key: "rank",
      label: "Referral Rank",
    },
    {
      key: "address",
      label: "Address",
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

  const oneDay = 86400000;
  const [isLoading, setIsLoading] = useState(false);
  const [inviteAndRandomList, setInviteAndRandomList] = useState<
    TopInviteAndRandom[]
  >([]);

  const [selectedEndTs, setSelectedEndTs] = useState(0);
  const selectedStartTs = useMemo(() => {
    return selectedEndTs - oneDay;
  }, [selectedEndTs]);

  const isPrevDisabled = useMemo(() => {
    const firstEpochTs = 1711620000000;
    console.log("selectedEndTs", selectedEndTs);
    if (isLoading || selectedEndTs <= firstEpochTs) {
      return true;
    } else {
      return false;
    }
  }, [isLoading, selectedEndTs]);

  const isNextDisabled = useMemo(() => {
    const currentTs = new Date().getTime();
    if (
      isLoading ||
      (selectedEndTs > currentTs && inviteAndRandomList.length === 0)
    ) {
      return true;
    }
    return false;
  }, [isLoading, inviteAndRandomList]);

  const formatUtcDate = (ts: number, formatter = "MM/DD/YYYY") => {
    return moment(ts).format(formatter);
  };

  const handleSwitchDate = (type: "PREV" | "NEXT") => {
    let ts = 0;
    if (type === "PREV") {
      ts = selectedEndTs - oneDay;
    } else if (type === "NEXT") {
      ts = selectedEndTs + oneDay;
    }
    setSelectedEndTs(ts);
    getTopInviteAndRandomFunc(formatUtcDate(ts, "YYYY-MM-DD"));
  };

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
            rewardType: index > 899 ? "Community Wiinner" : "Lucky Lynks",
            rank: index + 1,
          })
        );
        random100Arr = arr;
      }

      const all = top100Arr
        .concat(random100Arr)
        .map((item, index) => ({ ...item, rank: index + 1 }));

      const self = all.find(
        (item) => item.address.toLowerCase() === walletAddress?.toLowerCase()
      );
      if (self) {
        all.unshift(self);
      }

      setInviteAndRandomList(all);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth() + 1;
    const date = now.getUTCDate();

    const todayReadyTime = new Date(
      `${year}-${month}-${date} 10:00 utc`
    ).getTime();
    const currentTs = now.getTime();
    const ts =
      currentTs < todayReadyTime ? todayReadyTime - oneDay : todayReadyTime;
    setSelectedEndTs(ts);

    getTopInviteAndRandomFunc(formatUtcDate(ts, "YYYY-MM-DD"));
  }, []);

  return (
    <div className="relative z-1">
      <p className="py-2 text-[20px] font-satoshi text-[#B9C7D0] font-[700]">
        Each day, top 100 referrers of previous day and 900 randomly{" "}
        <a
          href="https://app.galxe.com/quest/zkLink/GCy79thyeZ"
          target="_blank"
          className="text-green inline-flex items-center gap-1"
        >
          <span>Galxe Quest</span>
          <img src="/img/icon-open-in-new-green.svg" width={14} />
        </a>{" "}
        participants can mint a mystery box. Additionally, every 1 ETH deposit
        can earn you an extra referral spot. In cases where multiple users have
        the same referral ranking, we randomly select some users to ensure that
        the daily distribution of top referrers remains at 100.
      </p>
      <div className="flex items-center py-4 px-2">
        <div className="flex items-center gap-2 text-[16px]">
          {/* <span
            className={`px-2 ${
              isPrevDisabled
                ? "cursor-not-allowed opacity-40"
                : "cursor-pointer"
            }`}
            onClick={() => !isPrevDisabled && handleSwitchDate("PREV")}
          >
            <AiFillCaretLeft />
          </span> */}
          <span className="text-[#C6D3DD] font-[400]">from</span>
          <b className="font-[700]">
            {formatUtcDate(selectedStartTs)} 10:00 UTC
          </b>
          <span className="text-[#C6D3DD] font-[400]">to</span>
          <b className="font-[700]">{formatUtcDate(selectedEndTs)} 10:00 UTC</b>
          {/* <span
            className={`px-2 ${
              isNextDisabled
                ? "cursor-not-allowed opacity-40"
                : "cursor-pointer"
            }`}
            onClick={() => !isNextDisabled && handleSwitchDate("NEXT")}
          >
            <AiFillCaretRight />
          </span> */}
        </div>
      </div>

      <div className="relative">
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
              <TableRow
                key={index}
                className={`${
                  index === 0 &&
                  item?.address?.toLowerCase() === walletAddress?.toLowerCase()
                    ? "self-data border-b-1 border-slate-600"
                    : ""
                }`}
              >
                <TableCell>
                  {index === 0 &&
                  item?.address?.toLowerCase() ===
                    walletAddress?.toLowerCase() ? (
                    <img
                      src="/img/icon-self-winner.svg"
                      className="w-[24px] h-[24px]"
                    />
                  ) : (
                    item.rank
                  )}
                </TableCell>
                <TableCell>{item.address}</TableCell>
                <TableCell>{item.invitenNumber}</TableCell>
                <TableCell>{item.rewardType}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {inviteAndRandomList.length === 0 && (
          <div className="absolute top-0 left-0 px-4  w-full h-full bg-[rgba(0,0,0,.8)] flex justify-center items-center rounded-[1rem]">
            <div className="text-[#C6D3DD] text-[20px] text-[center] leading-[24px]">
              <p className="text-center">
                The Mystery Box winner list for this period is still being
                calculated.
              </p>
              <p className="text-center">
                The results will be published after 11:00 UTC on{" "}
                {formatUtcDate(selectedEndTs + oneDay, "MM/DD/YYYY")}.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
