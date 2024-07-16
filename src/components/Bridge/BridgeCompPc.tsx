import { UseDisclosureReturn } from "@nextui-org/use-disclosure";
import { Token } from "@/hooks/useTokenList";
import { Avatar, Button, Input, Tooltip } from "@nextui-org/react";
import {
  // Container,
  SelectBox,
  LoyaltyBoostTooltipContent,
  LoyaltyBoostBox,
  ContentForMNTDeposit,
  EstimateArrivalTime,
  Line,
  DefaultBtn,
} from "./Components";
import fromList from "@/constants/fromChainList";
import { NexusEstimateArrivalTimes } from "@/constants";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { Switch, cn } from "@nextui-org/react";
import styled from "styled-components";
import { useState } from "react";
import ThirdPartyBridge from "../ThirdPartyBridge";
import { GradientBox } from "@/styles/common";

const Container = styled.div`
  .tab-item {
    /* margin-bottom: -24px; */
    padding: 12px 34px 30px;
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
        linear-gradient(90deg, #fbc82e, #6eee3f, #5889f3, #5095f1);

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
    /* min-height: 965.435px; */
    border-radius: 24px;
    border: 2px solid transparent;
    background-clip: padding-box, border-box;
    background-origin: padding-box, border-box;
    background-image: linear-gradient(to bottom, #282828 5%, #000000),
      linear-gradient(165deg, #fbc82e, #6eee3f, #5889f3, #5095f1, #b10af4 60%);
    /* box-shadow: 0px -6.67px 136.718px 0px rgba(178, 10, 245, 0.3); */
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
      /* min-width: 1240px; */
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
          font-size: 14px;
          font-style: normal;
          font-weight: 900;
          line-height: normal;
        }
        &.item-user {
          color: var(--Neutral-1, #fff);
          font-family: Satoshi;
          font-size: 16px;
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

interface IProps {
  actionBtnDisabled: boolean;
  actionBtnTooltipForMantleDisabeld: boolean;
  amount: string;
  btnText: string;
  errorInputMsg: string;
  fromActive: number;
  fromModal: UseDisclosureReturn;
  handleAction: () => Promise<void>;
  isCheckWinner: boolean;
  isConnected: boolean;
  isFirstDeposit: boolean;
  isMemeMysteryboxReward: boolean;
  isMergeSelected: boolean;
  isWhitelistWinner: boolean;
  loading: boolean;
  loyalPoints: number;
  mergeSupported: boolean | undefined;
  mergeTokenBooster: string;
  minDepositValue: number;
  mintable: boolean;
  minted: boolean;
  networkKey: string | undefined;
  openConnectModal: (() => void) | undefined;
  points: number;
  showNoPointsTip: boolean;
  tokenActive: number;
  tokenFiltered: Token[];
  tokenModal: UseDisclosureReturn;
  unsupportedChainWithConnector: string;
  inputRef1: React.RefObject<HTMLInputElement>;
  handleInputValue: (v: string) => void;
  setIsMergeSelected: (v: boolean) => void;
}

const BridgeCompPC = (props: IProps) => {
  const {
    actionBtnDisabled,
    actionBtnTooltipForMantleDisabeld,
    amount,
    btnText,
    errorInputMsg,
    fromActive,
    fromModal,
    handleAction,
    isCheckWinner,
    isConnected,
    isFirstDeposit,
    isMemeMysteryboxReward,
    isMergeSelected,
    isWhitelistWinner,
    loading,
    loyalPoints,
    mergeSupported,
    mergeTokenBooster,
    minDepositValue,
    mintable,
    minted,
    networkKey,
    openConnectModal,
    points,
    showNoPointsTip,
    tokenActive,
    tokenFiltered,
    tokenModal,
    unsupportedChainWithConnector,
    inputRef1,
    handleInputValue,
    setIsMergeSelected,
  } = props;

  const tabs = [
    {
      name: "Deposit",
      iconURL: "/img/icon-bridge-deposit.svg",
    },
    {
      name: "Withdraw",
      link: "https://portal.zklink.io/withdraw",
      iconURL: "/img/icon-bridge-withdraw.svg",
    },
    {
      name: "Third Party Bridge",
      iconURL: "/img/icon-bridge-3rd.svg",
    },
  ];
  const [tabActive, setTabActive] = useState(0);

  const handleTabsClick = (index: number, link?: string) => {
    if (link) {
      window.open(link, "_blank");
      return;
    }
    setTabActive(index);
  };

  const DepositContent = () => {
    return (
      <>
        <SelectBox className="px-6 py-6 md:px-6">
          <div className="flex items-center gap-4">
            <span className="label">From</span>
            <GradientBox
              className="px-[16px] py-2 rounded-[100px] flex items-center gap-2 cursor-pointer"
              onClick={() => fromModal.onOpen()}
            >
              <img
                src={fromList[fromActive].icon}
                className="w-6 h-6 rounded-full"
              />
              <span>{fromList[fromActive].label}</span>
              <img
                src="/img/icon-arrow-down.svg"
                alt=""
                className={fromModal.isOpen ? "rotate-180" : ""}
              />
            </GradientBox>
            <div className="ml-auto flex items-center">
              <span className="label mr-2">Balance: </span>
              <span className="balance">
                {tokenFiltered[tokenActive]?.formatedBalance}
              </span>
            </div>
          </div>
          <Line className="my-[20px]" />
          <div className="flex items-center gap-4 ">
            <Input
              ref={inputRef1}
              classNames={{
                input: "text-4xl",
                inputWrapper: "border-transparent",
                base: "grow shrink basis-0",
              }}
              size="lg"
              // type="number"
              placeholder="0"
              variant={"underlined"}
              value={String(amount)}
              onValueChange={handleInputValue}
              errorMessage={errorInputMsg}
            />

            <GradientBox
              className="flex items-center gap-2 px-[16px] py-[8px] rounded-[100px] cursor-pointer"
              onClick={() => tokenModal.onOpen()}
            >
              <Avatar
                src={tokenFiltered[tokenActive]?.icon}
                style={{ width: 24, height: 24 }}
              />
              <span>{tokenFiltered[tokenActive]?.symbol}</span>
              <img
                src="/img/icon-arrow-down.svg"
                alt=""
                className={tokenModal.isOpen ? "rotate-180" : ""}
              />
            </GradientBox>
          </div>
        </SelectBox>

        <SelectBox className="mt-4 px-4 md:px-6 py-6">
          <div className="flex items-center justify-between mb-2 points-box">
            <div className="flex items-center">
              <span className="text-white text-lg font-bold">Nova Points</span>

              <Tooltip
                showArrow={true}
                classNames={{
                  content: "max-w-[300px] p-4",
                }}
                content="By depositing into zkLink Nova, the Nova Points you'll earn every 8 hours."
              >
                <img
                  src={"/img/icon-tooltip.svg"}
                  className="w-[20px] cursor-pointer ml-1 mr-4"
                />
              </Tooltip>
              {loyalPoints > 0 && (
                <Tooltip
                  showArrow={true}
                  classNames={{
                    content: "px-0 py-0 max-w-[400px]",
                  }}
                  content={
                    <LoyaltyBoostTooltipContent>
                      <p className="mb-8">
                        Thank you for your continued support of zkLink. As our
                        loyal user, we're delighted to offer you{" "}
                        <span className="text-[#03D498]">{loyalPoints}</span>{" "}
                        addtional Nova Points.{" "}
                      </p>
                      <a href="" target="_blank" className="text-[#03D498]">
                        Learn more.
                      </a>
                    </LoyaltyBoostTooltipContent>
                  }
                >
                  <LoyaltyBoostBox>Loyalty Boost</LoyaltyBoostBox>
                </Tooltip>
              )}
            </div>
            <div className="flex items-center">
              <span className="text-white text-lg font-bold">
                {showNoPointsTip
                  ? 0
                  : points < 0.01 && points > 0
                  ? "< 0.01"
                  : points.toFixed(2)}
              </span>
              {loyalPoints > 0 && (
                <div className="ml-1">
                  + <span className="text-[#03D498]">{loyalPoints}</span>{" "}
                </div>
              )}
            </div>
          </div>

          {networkKey && NexusEstimateArrivalTimes[networkKey] && (
            <div className="flex items-center justify-between points-box">
              <span>Estimated Time Of Arrival</span>

              <EstimateArrivalTime
                minutes={NexusEstimateArrivalTimes[networkKey]}
              />
            </div>
          )}

          {mintable && !minted && (
            <div className="flex items-center justify-between mb-2 points-box">
              <div className="flex items-center">
                <span>zkLink's Oldest Friends</span>

                <img
                  src={"/img/icon-tooltip.png"}
                  className="w-[14px] cursor-pointer ml-1 mr-4"
                  data-tooltip-id="old-fren"
                />

                <ReactTooltip
                  id="old-fren"
                  content="zkLink's oldest friends (previous campaign participants) taking part in the zkLink Aggregation Parade will have the opportunity to win one of the following rewards: point boosters, NFT trademarks, and Lynks."
                  style={{
                    fontSize: "14px",
                    background: "#666",
                    borderRadius: "0.5rem",
                    maxWidth: "32rem",
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#0BC48F] text-[14px]">1 Lucky Draw</span>
                <img
                  src="/img/icon-old-fren-right.svg"
                  width={16}
                  height={16}
                />
              </div>
            </div>
          )}

          {isCheckWinner && (
            <div className="flex items-center justify-between mb-2 points-box">
              <div className="flex items-center">
                <span>CoinList Participants' Rewards</span>

                <img
                  src={"/img/icon-tooltip.png"}
                  className="w-[14px] cursor-pointer ml-1 mr-4"
                  data-tooltip-id="coinlist-participants"
                />

                <ReactTooltip
                  id="coinlist-participants"
                  content="Previous zkLink Coinlist participants taking part in the zkLink Aggregation Parade will receive 1 mystery box, with chances to win rewards up to 1000 Nova Points, trademarks NFT, and Lynks."
                  style={{
                    fontSize: "14px",
                    background: "#666",
                    borderRadius: "0.5rem",
                    maxWidth: "30rem",
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#0BC48F] text-[14px]">
                  1 Mystery Box
                </span>
                <img
                  src="/img/icon-old-fren-right.svg"
                  width={16}
                  height={16}
                />
              </div>
            </div>
          )}

          {isWhitelistWinner && (
            <div className="flex items-center justify-between mb-2 points-box">
              <div className="flex items-center">
                <span>Coinlist Whitelist Users</span>

                <img
                  src={"/img/icon-tooltip.png"}
                  className="w-[14px] cursor-pointer ml-1 mr-4"
                  data-tooltip-id="coinlist-whitelist"
                />

                <ReactTooltip
                  id="coinlist-whitelist"
                  style={{
                    fontSize: "14px",
                    background: "#666",
                    borderRadius: "0.5rem",
                    maxWidth: "32rem",
                  }}
                  render={() => (
                    <p>
                      Previous zkLink Coinlist whitelist users taking part in
                      the zkLink Aggregation Parade will receive 50 Nova Points,
                      Equivalent to depositing{" "}
                      <b className="font-[700] text-[#fff]">
                        1 ETH into the Nova Network for 9 days.
                      </b>
                    </p>
                  )}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#0BC48F] text-[14px]">
                  +50 Nova Points
                </span>
                <img
                  src="/img/icon-old-fren-right.svg"
                  width={16}
                  height={16}
                />
              </div>
            </div>
          )}

          {isMemeMysteryboxReward && (
            <div className="flex items-center justify-between mb-2 points-box">
              <div className="flex items-center">
                <span>NovaChadNFT Holder</span>

                <img
                  src={"/img/icon-tooltip.png"}
                  className="w-[14px] cursor-pointer ml-1 mr-4"
                  data-tooltip-id="nova-chad-nft"
                />

                <ReactTooltip
                  id="nova-chad-nft"
                  style={{
                    fontSize: "14px",
                    background: "#666",
                    borderRadius: "0.5rem",
                    maxWidth: "20rem",
                  }}
                  render={() => (
                    <p>
                      NovaChadNFT holders will receive Mystery Box after joining
                      the Aggregation Parade.
                    </p>
                  )}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#0BC48F] text-[14px]">
                  1 Mystery Box
                </span>
                <img
                  src="/img/icon-old-fren-right.svg"
                  width={16}
                  height={16}
                />
              </div>
            </div>
          )}

          {/* <div className="flex items-center justify-between mb-2 points-box">
        <span>Est.fee</span>
        <span>0.002 ETH</span>
      </div> */}
          {mergeSupported && (
            <div className="flex items-center justify-between mb-2 points-box">
              <div className="flex items-center">
                <span>Merge Token</span>

                <Tooltip
                  showArrow={true}
                  classNames={{
                    content: "max-w-[300px] p-4",
                  }}
                  content={
                    <LoyaltyBoostTooltipContent>
                      All supported source tokens with the same entity from
                      different networks can be merged into a single merged
                      token. Holding or using merged token to engage with
                      supported dApps could receive higher multipliers.{" "}
                      <a
                        href="https://docs.zklink.io/how-it-works/token-merge"
                        target="_blank"
                        className="text-[#03D498]"
                      >
                        Learn more.
                      </a>
                    </LoyaltyBoostTooltipContent>
                  }
                >
                  <img
                    src={"/img/icon-tooltip.png"}
                    className="w-[14px] cursor-pointer ml-1 mr-4"
                  />
                </Tooltip>
                {isMergeSelected && (
                  <div className="flex items-center justify-center bg-[#1B4C4A] h-[28px] px-4  rounded-md font-normal text-xs text-[#0BC48F]">
                    {mergeTokenBooster} Booster
                  </div>
                )}
              </div>
              <span>
                <span className="text-white align-super">
                  {isMergeSelected ? "Merge" : ""}{" "}
                </span>
                <Switch
                  isSelected={isMergeSelected}
                  onValueChange={setIsMergeSelected}
                  classNames={{
                    base: cn("-mr-2"),
                    wrapper: "p-0 h-4 overflow-visible",
                    thumb: cn(
                      "w-6 h-6 shadow-lg bg-[#888C91]",
                      //selected
                      "group-data-[selected=true]:ml-6",
                      "group-data-[selected=true]:bg-green",
                      // pressed
                      "group-data-[pressed=true]:w-7",
                      "group-data-[selected]:group-data-[pressed]:ml-4"
                    ),
                  }}
                ></Switch>
              </span>
            </div>
          )}
        </SelectBox>
        <div className="mt-8">
          {isConnected ? (
            <Tooltip
              classNames={{
                content: "max-w-[300px] p-4",
              }}
              content={ContentForMNTDeposit}
              isDisabled={actionBtnTooltipForMantleDisabeld}
            >
              <DefaultBtn
                className="green-btn w-full rounded-full "
                style={{ display: "flex", alignItems: "center" }}
                disableAnimation
                size="lg"
                onClick={handleAction}
                isLoading={loading}
                disabled={actionBtnDisabled}
              >
                <span className="btn-text">{btnText}</span>
              </DefaultBtn>
              {/* <a href="https://portal.zklink.io/bridge/" target="_blank">
            <Button
              className="gradient-btn w-full rounded-full "
              style={{ display: "flex", alignItems: "center" }}
              disableAnimation
              size="lg"
              // onClick={handleAction}
              isLoading={loading}
              // disabled={actionBtnDisabled}
            >
              Deposit through zkLink Nova Portal now
            </Button>
          </a> */}
            </Tooltip>
          ) : (
            <DefaultBtn
              className="w-full px-[24px] py-[20px] md:h-[52px] bg-[#03D498] rounded-[100px] flex justify-center items-center md:gap-[10px]"
              size="lg"
              color="primary"
              disableAnimation
              onClick={() => openConnectModal?.()}
            >
              <img width={32} height={32} src="/img/icon-bridge-wallet.svg" />
              <span className="btn-text">Connect Wallet</span>
            </DefaultBtn>
          )}
          {unsupportedChainWithConnector && (
            <p className="mt-4 text-[#C57D10] text-[14px]">
              {unsupportedChainWithConnector}
            </p>
          )}
        </div>
        {isFirstDeposit && showNoPointsTip && (
          <div className="mt-8 px-6 py-4 border-solid border-1 border-[#C57D10] rounded-lg flex">
            <img
              src="/img/icon-no-points.png"
              alt=""
              className="w-[21px] h-[21px] mr-3"
            />
            <p className="text-[#C57D10] ">
              Should you wish to participate in the Aggregation Parade, the
              minimum deposit value in a{" "}
              <span className="font-bold">single transaction</span> should be{" "}
              {minDepositValue} ETH or equivalence. To participate OKX
              Cryptopedia, there is no minimum deposit value.
            </p>
          </div>
        )}
      </>
    );
  };

  return (
    <Container className="hidden md:block">
      {/* <ContainerCover /> */}
      <div className="tabs flex items-end justify-between gap-[24px]">
        {tabs.map((tab, index) => (
          <div
            className={`tab-item flex items-center gap-[16px] ${
              index === tabActive ? "active" : ""
            }`}
            onClick={() => handleTabsClick(index, tab?.link)}
          >
            <img src={tab.iconURL} alt="" className="w-[24px] h-[24px]" />
            <span>{tab.name}</span>
          </div>
        ))}
        {/* <span className="tab-item tab-active">Deposit</span>
        <span
          className="tab-item"
          onClick={() =>
            window.open("https://portal.zklink.io/withdraw", "_blank")
          }
        >
          Withdraw
        </span> */}
      </div>
      <div
        className="tab-container px-[16px] py-[20px] pb-[32px]"
        style={{
          borderRadius: `${tabActive === 0 ? "0" : "24px"} ${
            tabActive === tabs.length - 1 ? "0" : "24px"
          } 24px 24px`,
        }}
      >
        <div className="tab-content">
          {tabActive === 0 && <DepositContent />}
          {tabActive === 2 && <ThirdPartyBridge />}
        </div>
      </div>
    </Container>
  );
};

export default BridgeCompPC;
