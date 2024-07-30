import styled from "styled-components";
import { useEffect, useMemo, useState } from "react";
import { GradientBox } from "@/styles/common";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import NovaNetworkTVL from "@/components/NovaNetworkTVL";
import { getCategoryList } from "@/api";
import { formatNumberWithUnit, getTweetShareTextForMysteryBox } from "@/utils";
import { useAccount } from "wagmi";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import toast from "react-hot-toast";
import { epochList } from "@/constants/epoch";
import { useTranslation } from "react-i18next";
// import { TableBoxs } from "@/styles/common";

const Container = styled.div`
  position: relative;
  padding-top: 92px;
  width: 100%;
  max-height: 100vh;
  /* max-height: 2310px; */
  overflow: auto;
  background-image: url("/img/s2/bg-s2-leaderboard.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top center;
`;

const Title = styled.div`
  font-family: Satoshi;
  font-size: 48px;
  font-style: normal;
  font-weight: 900;
  line-height: normal;
  background: linear-gradient(180deg, #fff 0%, #bababa 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Description = styled.p`
  color: #fff;
  font-family: Satoshi;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 28px; /* 175% */
`;

const EpochBox = styled.div`
  .epoch-btn {
    min-width: 44px;
    width: 44px;
    height: 52px;
    background: linear-gradient(
        180deg,
        rgba(40, 40, 40, 0.8) 0%,
        rgba(0, 0, 0, 0.8) 89.99%
      ),
      rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(20px);
    color: #fff;
    cursor: pointer;

    &.disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  .epoch-text {
    color: var(--Neutral-2, rgba(251, 251, 251, 0.6));
    text-align: center;
    font-family: Satoshi;
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 52px;
    border-left: 1px solid rgba(255, 255, 255, 0.2);
    border-right: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

const Tabs = styled.div`
  padding: 10px;
  border-radius: 20px;
  border: 0.6px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px);

  .tab-item {
    padding: 20px 24px;
    color: #fff;
    text-align: center;
    font-family: Satoshi;
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 26px; /* 144.444% */
    cursor: pointer;
    white-space: nowrap;

    &.active {
      border-radius: 10px;
      background: #03d498;
      box-shadow: 0px 4px 16px 0px rgba(41, 218, 167, 0.3);
      color: #030d19;
    }
  }
`;

const Table = styled.table`
  width: 100%;
  border-radius: 16px;
  overflow: hidden;

  background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.08) 0%,
      rgba(255, 255, 255, 0.08) 100%
    ),
    rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(20px);

  thead {
    tr {
      background: linear-gradient(
        180deg,
        rgba(16, 243, 178, 0.24) 0%,
        rgba(0, 181, 129, 0.24) 100%
      );
    }

    th {
      padding: 25px;
      color: #fff;
      text-align: left;
      font-family: Satoshi;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 26px; /* 185.714% */
      border-bottom: 0.6px solid rgba(255, 255, 255, 0.2);

      &.rank {
        width: 80px;
        color: #03d498;
        border-right: 0.6px solid rgba(255, 255, 255, 0.2);
        background: rgba(255, 255, 255, 0.04);
      }

      &.points {
        text-align: right;
      }
    }
  }

  .self {
    background: rgba(255, 255, 255, 0.12);
  }

  td {
    padding: 33px 25px;
    color: #fff;
    font-family: Satoshi;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 26px; /* 130% */
    border-bottom: 0.8px solid rgba(255, 255, 255, 0.1);
    /* background: rgba(255, 255, 255, 0.12); */
    white-space: nowrap;

    &.rank {
      width: 80px;
      color: #03d498;
      text-align: center;
      border-right: 0.8px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.04);
    }

    &.points {
      text-align: right;
    }
  }
`;

const GradientText = styled.div`
  text-align: center;
  font-family: Satoshi;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  background: linear-gradient(
    90deg,
    #4ba790 0%,
    rgba(251, 251, 251, 0.6) 50.31%,
    #9747ff 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

interface ListItem {
  username: string;
  address: string;
  totalPoints: string;
  rank: number;
}

const ContentBox = styled.div`
  .tab-item {
    /* margin-bottom: -24px; */
    padding: 12px 8px 30px;
    color: rgba(251, 251, 251, 0.6);
    text-align: center;
    font-family: Satoshi;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    border-radius: 8px 8px 0 0;
    border: 1px solid #635f5f;
    border-bottom: none;
    opacity: 0.6;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(45, 45, 45, 0.1) 40.05%,
      rgba(19, 19, 19, 0.1) 100%
    );
    cursor: pointer;
    white-space: nowrap;

    &.active {
      position: relative;
      padding: 24px 42px 40px;
      font-size: 18px;
      color: #fff;
      opacity: 1;
      /* background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.1) 0%,
        rgba(145, 145, 145, 0.1) 40.05%,
        rgba(19, 19, 19, 0.1) 100%
      ); */
      border-radius: 24px 24px 0 0;
      border: 2px solid transparent;
      border-bottom: 0;
      background-clip: padding-box, border-box;
      background-origin: padding-box, border-box;
      background-image: linear-gradient(to right, #282828, #282828),
        linear-gradient(
          100deg,
          #fb2450 1%,
          #fbc82e,
          #6eee3f,
          #5889f3,
          #5095f1,
          #b10af4
        );

      &::before {
        content: "";
        display: block;
        position: absolute;
        bottom: 12px;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        height: 1px;
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(251, 251, 251, 0.6) 51.5%,
          rgba(255, 255, 255, 0) 100%
        );
      }

      &::after {
        content: "";
        display: block;
        position: absolute;
        bottom: -2px;
        left: 0px;
        right: 0px;
        /* width: 100%; */
        background: #282828;
        height: 4px;
        z-index: 3;
      }
    }
  }

  .tab-container {
    position: relative;
    margin-top: -2px;
    min-height: 965.435px;
    border-radius: 24px;
    border: 2px solid transparent;
    background-clip: padding-box, border-box;
    background-origin: padding-box, border-box;
    background-image: linear-gradient(to bottom, #282828 5%, #000000),
      linear-gradient(
        100deg,
        #fb2450 1%,
        #fbc82e,
        #6eee3f,
        #5889f3,
        #5095f1,
        #b10af4
      );
    overflow: hidden;

    &::before {
      content: "";
      display: block;
      height: 1800px;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      background-image: url("/img/bg-s2-sectors.png");
      background-size: 100% 100%;
      max-height: 1800px;
      z-index: 0;
    }

    .tab-content {
      position: relative;
      min-width: 1240px;
      z-index: 2;

      .th-item {
        color: var(--Neutral-2, rgba(251, 251, 251, 0.6));
        font-family: Satoshi;
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
      }

      .item-rank {
        width: 15%;
        text-align: center;
      }
      .item-user {
        padding: 0 35px;
        width: 65%;
      }

      .item-points {
        padding: 0 50px;
        width: 20%;
        text-align: right;
      }

      .item-box {
        margin-top: 16px;
        padding: 22px 0;
        border-radius: 24px;
        border: 2px solid #635f5f;
        background: #151923;
      }

      .self-tag {
        padding: 6px 12px;
        color: #10f3b2;
        text-align: center;
        font-family: Satoshi;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 26px; /* 185.714% */
        border-radius: 100px;
        border: 0.6px solid rgba(255, 255, 255, 0.4);
        background: rgba(255, 255, 255, 0.06);
        backdrop-filter: blur(20px);
      }

      .td-item {
        &.item-rank {
          color: var(--Neutral-1, #fff);
          font-family: Satoshi;
          font-size: 32px;
          font-style: normal;
          font-weight: 900;
          line-height: normal;
        }
        &.item-user {
          color: var(--Neutral-1, #fff);
          font-family: Satoshi;
          font-size: 24px;
          font-style: normal;
          font-weight: 900;
          line-height: normal;
        }
        &.item-points {
          font-family: Satoshi;
          font-size: 26px;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
          background: linear-gradient(
            90deg,
            #4ba790 0%,
            rgba(251, 251, 251, 0.6) 50.31%,
            #9747ff 100%
          );
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
    }
  }
`;

const RowLine = styled.div`
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(251, 251, 251, 0.6) 51.5%,
    rgba(255, 255, 255, 0) 100%
  );
`;
const ColLine = styled.div`
  width: 1px;
  /* opacity: 0.3; */
  background: linear-gradient(
    rgba(255, 255, 255, 0) 0%,
    rgba(251, 251, 251, 0.6) 51.5%,
    rgba(255, 255, 255, 0) 100%
  );
`;

export default function Leaderboard() {
  const { t } = useTranslation();
  const tabs = [
    {
      name: t("dashboard.holding"),
      category: "holding",
      iconURL: "/img/icon-sector-1.svg",
    },
    {
      name: t("dashboard.boosted"),
      category: "nativeboost",
      iconURL: "/img/icon-sector-2.svg",
    },
    {
      name: t("dashboard.spot_dex"),
      category: "spotdex",
      iconURL: "/img/icon-sector-3.svg",
    },
    {
      name: t("dashboard.perp_dex"),
      category: "perpdex",
      iconURL: "/img/icon-sector-4.svg",
    },
    {
      name: t("dashboard.lending"),
      category: "lending",
      iconURL: "/img/icon-sector-5.svg",
    },
    { name: "GameFi", category: "gamefi" },
    { name: t("other"), category: "other", iconURL: "/img/icon-sector-7.svg" },
  ];

  const { address } = useAccount();
  const { invite } = useSelector((store: RootState) => store.airdrop);
  const [tabActive, setTabActive] = useState(0);
  const [epochActive, setEpochActive] = useState(1);
  const [selfData, setSelfData] = useState<ListItem | null>(null);
  const [categoryList, setCategoryList] = useState<ListItem[]>([]);

  const getCategoryListFunc = async (category: string) => {
    try {
      const { data } = await getCategoryList(category, {
        address,
        season: epochList[epochActive].season,
      });

      const arr = data.list.map((item, index) => {
        return {
          rank: index + 1,
          ...item,
        };
      });

      setCategoryList(arr);

      const { current } = data;

      const currentData: ListItem = {
        rank: current?.userIndex || 0,
        username: current?.username || invite?.userName || address || "",
        address: current?.address || address || "",
        totalPoints: current?.totalPoints || "0",
      };

      const self: ListItem | null = address ? currentData : null;
      setSelfData(self);
    } catch (error) {
      setCategoryList([]);
    }
  };

  const handleTabClick = (index: number) => {
    setTabActive(index);
    // setCategoryList([]);
  };

  const epochPrevDisabled = useMemo(() => {
    return epochActive === 0;
  }, [epochActive]);

  const epochNextDisabled = useMemo(() => {
    return epochActive === epochList.length - 1;
  }, [epochActive, epochList]);

  const handleEpochClick = (type: "prev" | "next") => {
    if (type === "prev" && epochActive !== 0) {
      setEpochActive((prev) => prev - 1);
    } else if (type === "next" && epochActive !== epochList.length - 1) {
      setEpochActive((prev) => prev + 1);
    }
  };
  const handleCopy = () => {
    if (!invite?.code) return;
    navigator.clipboard.writeText(invite?.code);
    toast.success("Copied", { duration: 2000 });
  };

  useEffect(() => {
    getCategoryListFunc(tabs[tabActive].category);
  }, [address, tabActive, epochActive]);

  return (
    <Container>
      <div className="mt-[80px] px-[16px] md:px-[70px] relative z-1">
        <div className="flex items-end flex-col md:flex-row gap-[46px]">
          <div>
            <div className="flex">
              <div className="px-[16px] py-[10px] rounded-[48px] bg-[#28282899]">
                <GradientText>{t("header.leaderboard")}</GradientText>
              </div>
            </div>
            <Title className="mt-[20px]">
              {t("leaderboard.points_leaderboard")}
            </Title>
            <Description className="mt-[30px]">
              {t("leaderboard.points_leaderboard_desc")}
            </Description>
          </div>

          <EpochBox className="flex flex-col items-center">
            <GradientBox className="max-w-[224px] rounded-[100px] overflow-hidden flex items-center justify-center whitespace-nowrap">
              <div
                className={`epoch-btn left flex items-center justify-center ${
                  epochPrevDisabled ? "disabled" : ""
                }`}
                onClick={() => handleEpochClick("prev")}
              >
                <AiFillCaretLeft />
              </div>
              <div className="w-full epoch-text px-[20px] flex items-center justify-center">
                {epochList[epochActive].name}
              </div>
              <div
                className={`epoch-btn right flex items-center justify-center ${
                  epochNextDisabled ? "disabled" : ""
                }`}
                onClick={() => handleEpochClick("next")}
              >
                <AiFillCaretRight />
              </div>
            </GradientBox>
            {epochList[epochActive]?.time && (
              <div className="mt-[14px] whitespace-nowrap text-[12px] text-[#999] text-center">
                {epochList[epochActive]?.time}
              </div>
            )}
          </EpochBox>
        </div>

        <ContentBox>
          <div className="tab-bar mt-[50px] max-w-[100%]">
            <div className="w-full flex justify-between items-start">
              <div className="flex items-end gap-[24px]">
                {tabs.map((tab, index) => (
                  <div
                    className={`tab-item flex justify-center items-center gap-[8px] ${
                      index === tabActive ? "active" : ""
                    }`}
                    onClick={() => handleTabClick(index)}
                    key={index}
                  >
                    <img
                      src={tab.iconURL}
                      alt=""
                      className="w-[24px] h-[24px] block"
                    />
                    <span>{tab.name}</span>
                  </div>
                ))}
              </div>
              <GradientBox className="px-[28px] h-[52px] rounded-[76px] flex items-center gap-[12px]">
                <span className="text-[#fff] text-[14px] font-[500] opacity-80">
                  Invite To Earn More
                </span>
                <ColLine className="h-[28px]" />
                <span className="font-[900] text-[30px] text-[#fff]">
                  {invite?.code}
                </span>
                <img
                  src="/img/icon-invite-copy.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="cursor-pointer"
                  onClick={handleCopy}
                />
                <img
                  src="/img/icon-invite-twitter.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="cursor-pointer"
                  onClick={() =>
                    window.open(
                      `https://twitter.com/intent/tweet?text=${getTweetShareTextForMysteryBox(
                        invite?.code ?? ""
                      )}`,
                      "_blank"
                    )
                  }
                />
              </GradientBox>
            </div>
          </div>
          <div
            className="tab-container mt-[26px] max-w-[100%] overflow-auto"
            style={{
              borderRadius: `${tabActive === 0 ? "0" : "24px"} ${
                tabActive === 99 ? "0" : "24px"
              } 24px 24px`,
            }}
          >
            <div className="tab-content px-[42px] py-[32px]">
              <div className="flex items-center justify-between">
                <span className="th-item item-rank">
                  {t("leaderboard.rank")}
                </span>
                <span className="th-item item-user">
                  {t("leaderboard.user")}
                </span>
                <span className="th-item item-points">
                  {tabs[tabActive].name} Points
                </span>
              </div>

              <RowLine className="my-[30px]" />

              {selfData && (
                <GradientBox className="mt-[16px] py-[22px] rounded-[24px] flex items-center justify-between">
                  <div className="td-item item-rank flex justify-center">
                    <GradientBox className="px-[24px] py-[8px] rounded-[100px]">
                      {selfData.rank || "-"}
                    </GradientBox>
                  </div>
                  <ColLine className="h-[44px] opacity-40" />
                  <span className="td-item item-user flex items-center gap-[16px]">
                    {selfData.username}
                    <span className="self-tag">You</span>
                  </span>
                  <ColLine className="h-[44px] opacity-40" />
                  <span className="td-item item-points">
                    {formatNumberWithUnit(selfData.totalPoints)}
                  </span>
                </GradientBox>
              )}

              {categoryList.map((item, index) => (
                <div
                  className="item-box flex items-center justify-between"
                  key={index}
                >
                  <span className="td-item item-rank">{item.rank}</span>
                  <ColLine className="h-[44px] opacity-40" />
                  <span className="td-item item-user">{item.username}</span>
                  <ColLine className="h-[44px] opacity-40" />
                  <span className="td-item item-points">
                    {formatNumberWithUnit(item.totalPoints)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ContentBox>
      </div>

      <NovaNetworkTVL />
    </Container>
  );
}
