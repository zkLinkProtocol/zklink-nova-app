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
  inputRef2: React.RefObject<HTMLInputElement>;
  handleInputValue: (v: string) => void;
  setIsMergeSelected: (v: boolean) => void;
}

const BridgeCompMobile = (props: IProps) => {
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
    inputRef2,
    handleInputValue,
    setIsMergeSelected,
  } = props;
  return (
    <Container className="block md:hidden px-4 py-6 md:px-8 md:py-8 layer">
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
        <div className="flex items-center gap-4 mb-4">
          <span className="font-bold">From</span>
          <div
            className="selector h-14 flex items-center gap-2 px-4 py-2 rounded-2xl cursor-pointer"
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
        </div>
        <div className="mb-4">
          <p className="title mb-2">Assets</p>
          <div
            className="selector flex items-center gap-2 px-4 py-4 rounded-[1rem] cursor-pointer"
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

        <div className="mb-7">
          <div className="flex items-center justify-between mb-2 ">
            <div className="title">Amount</div>
            <div className="title flex items-center ml-auto">
              Balance:{" "}
              <span>{tokenFiltered[tokenActive]?.formatedBalance}</span>
            </div>
          </div>
          <div>
            <Input
              ref={inputRef2}
              classNames={{
                input: "text-4xl",
                inputWrapper: ["bg-inputColor", "h-14"],
              }}
              size="lg"
              // type="number"
              placeholder="0"
              variant="flat"
              radius="lg"
              value={String(amount)}
              onValueChange={handleInputValue}
              errorMessage={errorInputMsg}
            />
          </div>
        </div>
        <div className="flex items-center justify-between mb-4 points-box">
          <div className="flex items-center">
            <span className="title">Nova Points</span>

            <Tooltip
              showArrow={true}
              classNames={{
                content: "max-w-[300px] p-4",
              }}
              content="By depositing into zkLink Nova, the Nova Points you'll earn every 8 hours."
            >
              <img
                src={"/img/icon-tooltip.png"}
                className="w-[14px] cursor-pointer ml-1 mr-4"
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
            <span className="text-white">
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
          <div className="flex items-center justify-between mb-2 points-box">
            <span>Estimated Time of Arrival</span>
            <EstimateArrivalTime
              minutes={NexusEstimateArrivalTimes[networkKey]}
              isMobile={true}
            />
          </div>
        )}
        {/* <div className="flex items-center justify-between mb-2 points-box">
        <span>Est.fee</span>
        <span>0.002 ETH</span>
      </div> */}
        {mergeSupported && (
          <>
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
              </div>
              <span className="flex justify-end w-12 gap-[0.25rem]">
                <span className="text-white align-super">
                  {isMergeSelected ? "" : "Merge"}
                </span>
                <Switch
                  isSelected={isMergeSelected}
                  onValueChange={setIsMergeSelected}
                  classNames={{
                    base: cn("-mr-2"),
                    wrapper: "p-0 h-4 overflow-visible",
                    thumb: cn(
                      "w-6 h-6 shadow-lg bg-green",
                      //selected
                      "group-data-[selected=true]:ml-6",
                      "group-data-[selected=true]:bg-white",
                      // pressed
                      "group-data-[selected]:group-data-[pressed]:ml-10"
                    ),
                  }}
                ></Switch>
              </span>
            </div>
            {isMergeSelected && (
              <div className="flex">
                <div className="bg-[#1B4C4A] h-[28px] leading-[28px] px-4  rounded-md font-normal text-xs text-[#0BC48F]">
                  {mergeTokenBooster} Booster
                </div>
              </div>
            )}
          </>
        )}

        {isCheckWinner && (
          <div className="flex items-center justify-between gap-6 mb-2 points-box">
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
                  maxWidth: "80vw",
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#0BC48F] text-[14px] whitespace-nowrap">
                1 Mystery Box
              </span>
              <img src="/img/icon-old-fren-right.svg" width={16} height={16} />
            </div>
          </div>
        )}

        {isWhitelistWinner && (
          <div className="flex items-center justify-between gap-6 mb-2 points-box">
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
                  maxWidth: "80vw",
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
              <span className="text-[#0BC48F] text-[14px] whitespace-nowrap">
                +50 Nova Points
              </span>
              <img src="/img/icon-old-fren-right.svg" width={16} height={16} />
            </div>
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
              isLoading={loading}
              // disabled={actionBtnDisabled}
            >
              Deposit through zkLink Nova Portal now
            </Button>
          </a> */}
          </Tooltip>
        ) : (
          <Button
            className="gradient-btn  w-full rounded-full "
            size="lg"
            color="primary"
            disableAnimation
            onClick={() => openConnectModal?.()}
          >
            <img width={20} height={20} src="/img/icon-wallet2.svg" />
            <span>Connect Wallet</span>
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

export default BridgeCompMobile;
