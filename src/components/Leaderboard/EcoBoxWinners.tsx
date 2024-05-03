import { getEcoRank } from "@/api";
import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";

import moment from "moment";
import { useAccount } from "wagmi";
import { formatNumber2, formatNumberWithUnit } from "@/utils";

type EcoRankRes = {
  address: string;
  points: number;
  createdAt: string;
};

type TopInviteAndRandom = EcoRankRes & {
  rank: number;
  rewardType: string;
};

export default function EcoBoxWinners() {
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
      label: "Daily Eco Points",
    },
    {
      key: "rewardType",
      label: "Reward Type",
    },
  ];

  const oneDay = 86400000;
  const [isLoading, setIsLoading] = useState(false);
  const [ecoRankList, seEcoRankList] = useState<TopInviteAndRandom[]>([]);

  const [selectedEndTs, setSelectedEndTs] = useState(0);
  const selectedStartTs = useMemo(() => {
    return selectedEndTs - oneDay;
  }, [selectedEndTs]);

  const formatUtcDate = (ts: number, formatter = "MM/DD/YYYY") => {
    return moment(ts).format(formatter);
  };

  const getEcoRankFunc = async () => {
    setIsLoading(true);
    try {
      const { result } = await getEcoRank();
      console.log("eco rank", result);

      // let arr: TopInviteAndRandom[] = [];

      if (result && Array.isArray(result)) {
        const arr = result.map((item: EcoRankRes, index: number) => ({
          ...item,
          rewardType: "Top 500 Eco dApp User",
          rank: index + 1,
        }));
        const self = arr.find(
          (item) => item.address.toLowerCase() === walletAddress?.toLowerCase()
        );
        if (self) {
          arr.unshift(self);
        }

        seEcoRankList(arr);
      }
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

    getEcoRankFunc();
  }, []);

  return (
    <div className="relative z-1">
      <p className="py-2 text-[20px] font-satoshi text-[#B9C7D0] font-[700]">
        Every day, the top 500 users who accumulate the most Nova Points by
        interacting with Nova ecosystem dApps have the opportunity to draw an
        Eco Box, which contain Nova Points, Trademarks NFT and Lynks. In cases
        where multiple users have the same eco points ranking, we randomly
        select some users to ensure that the daily distribution of Eco Box
        remains at 500.
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
            items={ecoRankList}
            isLoading={isLoading}
            loadingContent={<Spinner label="Loading..." />}
          >
            {ecoRankList.map((item, index) => (
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
                <TableCell>{formatNumberWithUnit(item.points)}</TableCell>
                <TableCell>{item.rewardType}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {ecoRankList.length === 0 && (
          <div className="absolute top-0 left-0 px-4  w-full h-full bg-[rgba(0,0,0,.8)] flex justify-center items-center rounded-[1rem]">
            <div className="text-[#C6D3DD] text-[20px] text-[center] leading-[24px]">
              <p className="text-center">
                The Eco Box winner list for this period is still being
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
