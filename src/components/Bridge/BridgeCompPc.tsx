import { UseDisclosureReturn } from "@nextui-org/use-disclosure";
import { Token } from "@/hooks/useTokenList";
import { Avatar, Button, Input, Tooltip } from "@nextui-org/react";
import {
  Container,
  SelectBox,
  LoyaltyBoostTooltipContent,
  LoyaltyBoostBox,
  ContentForMNTDeposit,
  EstimateArrivalTime,
} from "./Components";
import fromList from "@/constants/fromChainList";
import { NexusEstimateArrivalTimes } from "@/constants";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { Switch, cn } from "@nextui-org/react";

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
  return (
    <Container className="hidden md:block px-4 py-6 md:px-8 md:py-8">
      {/* <ContainerCover /> */}
      <div className="tabs">
        <span className="tab-item tab-active">Deposit</span>
        <span
          className="tab-item"
          onClick={() =>
            window.open("https://portal.zklink.io/withdraw", "_blank")
          }
        >
          Withdraw
        </span>
      </div>
      <SelectBox className="px-6 py-6 md:px-6">
        <div className="flex items-center gap-4">
          <span className="label">From</span>
          <div
            className="selector flex items-center gap-2 pl-2 pr-4 py-2 rounded-2xl cursor-pointer"
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
          </div>
          <div className="ml-auto flex items-center">
            <span className="label mr-2">Balance: </span>
            <span className="balance">
              {tokenFiltered[tokenActive]?.formatedBalance}
            </span>
          </div>
        </div>
        <div className="divider my-5"></div>
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

          <div
            className="selector flex items-center gap-2 pl-2 pr-4 py-4 rounded-3xl cursor-pointer"
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
          </div>
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
              <img src="/img/icon-old-fren-right.svg" width={16} height={16} />
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
              <span className="text-[#0BC48F] text-[14px]">1 Mystery Box</span>
              <img src="/img/icon-old-fren-right.svg" width={16} height={16} />
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
                    Previous zkLink Coinlist whitelist users taking part in the
                    zkLink Aggregation Parade will receive 50 Nova Points,
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
              <img src="/img/icon-old-fren-right.svg" width={16} height={16} />
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
              <span className="text-[#0BC48F] text-[14px]">1 Mystery Box</span>
              <img src="/img/icon-old-fren-right.svg" width={16} height={16} />
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
                    different networks can be merged into a single merged token.
                    Holding or using merged token to engage with supported dApps
                    could receive higher multipliers.{" "}
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
            <Button
              className="green-btn w-full rounded-full "
              style={{ display: "flex", alignItems: "center" }}
              disableAnimation
              size="lg"
              onClick={handleAction}
              isLoading={loading}
              disabled={actionBtnDisabled}
            >
              {btnText}
            </Button>
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
          <Button
            className="w-full px-[24px] py-[20px] md:h-[52px] bg-[#03D498] rounded-[100px] flex justify-center items-center md:gap-[10px]"
            size="lg"
            color="primary"
            disableAnimation
            onClick={() => openConnectModal?.()}
          >
            <img width={20} height={20} src="/img/icon-wallet2.svg" />
            <span className="text-[#030D19] text-[16px]">Connect Wallet</span>
          </Button>
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
    </Container>
  );
};

export default BridgeCompPC;
