import { useState, useMemo, useCallback, useEffect } from "react";
import styled from "styled-components";
import {
  Avatar,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
  Select,
  SelectItem,
  Tooltip,
  Tabs,
  Tab,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import {
  AiOutlineCheck,
  AiOutlineDown,
  AiOutlineUp,
  AiOutlineCopy,
} from "react-icons/ai";
import toast from "react-hot-toast";
import { debounce, has } from "lodash";
import { useBridgeTx } from "@/hooks/useBridgeTx";
import BigNumber from "bignumber.js";
import { useBridgeNetworkStore } from "@/hooks/useNetwork";
import { STORAGE_NETWORK_KEY } from "@/constants";
import fromList from "@/constants/fromChainList";
import useTokenBalanceList from "@/hooks/useTokenList";
import { ETH_ADDRESS } from "zksync-web3/build/src/utils";
import { useDispatch, useSelector } from "react-redux";
import { getDepositETHThreshold } from "@/api";
import { RootState } from "@/store";
import {
  setInvite,
  setDepositStatus,
  setDepositL1TxHash,
} from "@/store/modules/airdrop";
import { parseUnits } from "viem";
import { Token } from "@/hooks/useTokenList";
import {
  copyText,
  formatTxHash,
  getTxHashExplorerLink,
  isSameAddress,
} from "@/utils";
import CopyIcon from "./CopyIcon";
import VerifyTxHashModal from "./VerifyTxHashModal";
import { useVerifyStore } from "@/hooks/useVerifyTxHashSotre";
import { NexusEstimateArrivalTimes } from "@/constants";
import FromList from "@/constants/fromChainList";
import { Link } from "react-router-dom";
import { AiOutlineRight } from "react-icons/ai";

const ModalSelectItem = styled.div`
  &:hover {
    background-color: rgb(61, 66, 77);
    border-radius: 8px;
  }
`;

const Trans = styled.div`
  .statusImg {
    width: 128px;
    margin-top: 20px;
    margin-left: calc(50% - 64px);
    margin-bottom: 23px;
  }
  .statusBut {
    transform: scale(3.5);
    background: transparent;
    margin-top: 50px;
    margin-left: calc(50% - 48px);
    margin-bottom: 50px;
  }
  .title {
    color: #fff;
    text-align: center;
    font-family: Satoshi;
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
    line-height: 32px; /* 133.333% */
    letter-spacing: -0.5px;
    margin-bottom: 23px;
  }
  .inner {
    color: #a0a5ad;
    text-align: center;
    font-family: Satoshi;
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
    line-height: 32px; /* 133.333% */
    letter-spacing: -0.5px;
    margin-bottom: 23px;
  }
  .button {
    height: 56px;
    width: 100%;
    border-radius: 8px;
    background: linear-gradient(
      90deg,
      #48ecae 0%,
      #3e52fc 51.07%,
      #49ced7 100%
    );
    color: #fff;
    text-align: center;
    font-family: Satoshi;
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
    line-height: 56px;
    letter-spacing: -0.5px;
    margin-bottom: 24px;
    cursor: pointer;
  }
  .view {
    color: #48ecae;
    background: transparent;
    text-align: center;
    font-family: Satoshi;
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
    line-height: 32px; /* 133.333% */
    letter-spacing: -0.5px;
    cursor: pointer;
  }
  .inline {
    display: inline;
  }
`;

const Container = styled.div`
  background: #313841;
  padding: 32px;
  border-radius: 12px;
`;
const SelectBox = styled.div`
  & {
    background: #23262d;
    border-radius: 16px;
  }
  .selector {
    background-color: #313841;
    height: 40px;
    &:hover {
      background-color: rgb(85 90 102);
    }
  }
  .points-box {
    color: #a0a5ad;
    font-size: 16px;
    font-weight: 400;
    .input-wrapper {
      padding-top: 0;
      padding-bottom: 0;
      height: 38px;
    }
  }
`;

const LoyaltyBoostBox = styled.div`
  background: linear-gradient(90deg, #48ecae 0%, #3e52fc 51.07%, #49ced7 100%);
  width: 100px;
  height: 28px;
  border-radius: 8px;
  color: #ffffff;
  text-align: center;
  margin-left: 6px;
  font-size: 12px;
  line-height: 28px;
`;

const LoyaltyBoostTooltipContent = styled.div`
  background: #666666;
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 400;
  font-size: 16px;
  font-family: "Space Mono";
`;

const AssetTypes = [
  { label: "ALL", value: "ALL" },
  {
    label: "Native",
    value: "NATIVE",
  },
  {
    label: "Stable",
    value: "Stablecoin",
  },
  {
    label: "Synthetic",
    value: "Synthetic",
  },
  {
    label: "RWA",
    value: "RWA",
  },
  {
    label: "LST",
    value: "LST",
  },
  {
    label: "LRT",
    value: "LRT",
  },
];
export interface IBridgeComponentProps {
  onClose?: () => void;
  bridgeToken?: string;
}

const ContentForMNTDeposit =
  "When deposit MNT, we will transfer MNT to wMNT and then deposit wMNT for you.";
export default function Bridge(props: IBridgeComponentProps) {
  const { onClose, bridgeToken } = props;
  const web3Modal = useWeb3Modal();
  const { isConnected, address } = useAccount();
  const fromModal = useDisclosure();
  const tokenModal = useDisclosure();
  const transLoadModal = useDisclosure();
  const transSuccModal = useDisclosure();
  const transFailModal = useDisclosure();
  const [failMessage, setFailMessage] = useState("");
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { sendDepositTx, loading } = useBridgeTx();
  const [amount, setAmount] = useState("");

  const [url, setUrl] = useState("");
  const { isActiveUser } = useSelector((store: RootState) => store.airdrop);

  const isFirstDeposit = useMemo(() => {
    return !isActiveUser;
  }, [isActiveUser]);

  const [fromActive, setFromActive] = useState(0);
  const [tokenActive, setTokenActive] = useState(0);
  const { setNetworkKey, networkKey } = useBridgeNetworkStore();
  const { tokenList, refreshTokenBalanceList, allTokens, nativeTokenBalance } =
    useTokenBalanceList();

  const [points, setPoints] = useState(0);
  const [showNoPointsTip, setShowNoPointsTip] = useState(false);
  const [minDepositValue, setMinDepositValue] = useState(0.1);
  const [loyalPoints, setLoyalPoints] = useState(0);
  const [category, setCategory] = useState(AssetTypes[0].value);
  const [tokenFiltered, setTokenFiltered] = useState<Token[]>([]);
  const [bridgeTokenInited, setBridgeTokenInited] = useState(false);

  const dispatch = useDispatch();

  const { addTxHash, txhashes } = useVerifyStore();

  useEffect(() => {
    const timer = setInterval(() => {
      refreshTokenBalanceList();
    }, 5000);
    return () => clearInterval(timer);
  }, [refreshTokenBalanceList]);

  useEffect(() => {
    (async () => {
      if (address) {
        //TODO call api to get loyal points
        // setLoyalPoints(300);
      }
    })();
  }, [address]);

  useEffect(() => {
    if (category === "ALL") {
      setTokenFiltered([...tokenList]);
    } else {
      const tokens = tokenList.filter(
        (item) => item.type?.toUpperCase() === category.toUpperCase()
      );
      setTokenFiltered(tokens);
    }
  }, [tokenList, category]);

  useEffect(() => {
    (async () => {
      const minDeposit = await getDepositETHThreshold();
      console.log("minDeposit: ", minDeposit);
      setMinDepositValue(minDeposit.ethAmount || 0.1);
    })();
  }, []);

  const computePoints = debounce(() => {
    if (!amount || !tokenFiltered[tokenActive]) {
      setShowNoPointsTip(false);
      setPoints(0);
      return;
    }
    if (tokenFiltered[tokenActive]?.address === ETH_ADDRESS) {
      if (Number(amount) < minDepositValue) {
        setShowNoPointsTip(true);
      } else {
        setShowNoPointsTip(false);
      }
    }
    try {
      const priceInfo = allTokens.find(
        (item) => item.symbol === tokenFiltered[tokenActive].symbol
      );
      const ethPriceInfo = allTokens.find((item) => item.symbol === "ETH");
      // const [priceInfo, ethPriceInfo] = await Promise.all([
      //   getTokenPrice(tokenFiltered[tokenActive]?.address),
      //   getTokenPrice(ETH_ADDRESS),
      // ]);
      if (priceInfo?.usdPrice && ethPriceInfo?.usdPrice) {
        const ethValue = new BigNumber(priceInfo.usdPrice)
          .multipliedBy(amount)
          .div(ethPriceInfo.usdPrice)
          .toNumber();
        if (ethValue < minDepositValue) {
          setShowNoPointsTip(true);
        } else {
          setShowNoPointsTip(false);
        }
        // NOVA Points = 10 * Token multiplier* Deposit Amount * Token Price/ETH price
        const points = new BigNumber(priceInfo.usdPrice)
          .multipliedBy(10)
          .multipliedBy(tokenFiltered[tokenActive].multiplier)
          .multipliedBy(amount)
          .div(ethPriceInfo.usdPrice)
          .toFixed(2);
        setPoints(Number(points));
      }
    } catch (e) {
      console.log(e);
    }
  }, 500);

  useEffect(() => {
    //TODO compute eth value, if less than minDepositValue, show 0 points
    computePoints();
  }, [
    tokenActive,
    tokenList,
    amount,
    minDepositValue,
    computePoints,
    allTokens,
  ]);

  useEffect(() => {
    if (isFirstDeposit) {
      const network = localStorage.getItem(STORAGE_NETWORK_KEY);
      if (network) {
        setNetworkKey(network);
        if (fromList[0].networkKey !== network) {
          const index = fromList.findIndex(
            (item) => item.networkKey === network
          );
          if (index > -1) {
            setFromActive(index);
          }
        }
      } else if (!network) {
        setNetworkKey(fromList[0].networkKey);
      }
    } else if (bridgeToken && !bridgeTokenInited) {
      const token = tokenList.find((item) =>
        bridgeToken.indexOf("0x") > -1
          ? isSameAddress(item.address, bridgeToken)
          : item.symbol === bridgeToken
      );
      if (token) {
        const _tokenList = tokenList.filter(
          (item) => item.networkKey === token.networkKey
        );
        let index = 0;
        const fromIndex = fromList.findIndex(
          (item) => item.networkKey === token.networkKey
        );
        const from = fromList[fromIndex];
        if (token.address !== ETH_ADDRESS) {
          index = _tokenList.findIndex(
            (item) => item.address === token.address
          );
          setTokenActive(index);
        }
        setFromActive(fromIndex);
        setNetworkKey(from.networkKey);
      } else {
        setFromActive(0);
        setTokenActive(0);
        setNetworkKey(fromList[0].networkKey);
      }
      if (tokenList.length > 1) {
        setBridgeTokenInited(true);
      }
    }
  }, [
    setNetworkKey,
    isFirstDeposit,
    bridgeToken,
    tokenList,
    bridgeTokenInited,
  ]);

  const actionBtnTooltipForMantleDisabeld = useMemo(() => {
    if (
      networkKey === "mantle" &&
      tokenFiltered[tokenActive]?.address === ETH_ADDRESS
    ) {
      return false;
    }
    return true;
  }, [networkKey, tokenActive, tokenFiltered]);

  const handleFrom = (index: number) => {
    setFromActive(index);
    setTokenActive(0);
    setNetworkKey(fromList[index].networkKey);
    fromModal.onClose();
  };

  const handeToken = (index: number) => {
    setTokenActive(index);
    tokenModal.onClose();
  };

  const invalidChain = useMemo(() => {
    return chainId !== fromList[fromActive].chainId;
  }, [chainId, fromActive]);

  const actionBtnDisabled = useMemo(() => {
    if (
      !invalidChain &&
      tokenFiltered[tokenActive] &&
      (!tokenFiltered[tokenActive].balance ||
        tokenFiltered[tokenActive].balance! <= 0 ||
        Number(tokenFiltered[tokenActive].formatedBalance) < Number(amount) ||
        Number(amount) <= 0)
    ) {
      return true;
    }
    return false;
  }, [tokenFiltered, tokenActive, invalidChain, amount]);
  console.log(
    "actionBtnDisabled: ",
    actionBtnDisabled,
    tokenFiltered[tokenActive]
  );
  const btnText = useMemo(() => {
    if (invalidChain) {
      return "Switch Network";
    } else if (
      amount &&
      tokenFiltered[tokenActive] &&
      tokenFiltered[tokenActive].formatedBalance
    ) {
      if (Number(amount) > Number(tokenFiltered[tokenActive].formatedBalance)) {
        return "Insufficient balance";
      }
    }
    return "Continue";
  }, [invalidChain, amount, tokenActive, tokenFiltered]);

  const handleInputValue = (v: string) => {
    if (!v) {
      setAmount(v);
    } else if (/^[0-9]*\.?[0-9]*$/.test(v)) {
      setAmount(v);
    }
  };

  const dismissToast = () => {
    setTimeout(() => {
      toast.dismiss();
    }, 3000);
  };

  const handleAction = useCallback(async () => {
    if (!address) return;
    if (invalidChain) {
      switchChain(
        { chainId: fromList[fromActive].chainId },
        {
          onError: (e) => {
            console.log(e);
          },
        }
      );
      return;
    }
    if (!amount) {
      return;
    }

    transLoadModal.onOpen();
    let time = setTimeout(() => {}, 100);
    for (let i = 0; i <= Number(time); i++) {
      clearTimeout(i);
    }
    try {
      const hash = await sendDepositTx(
        tokenFiltered[tokenActive]?.address as `0x${string}`,
        // utils.parseEther(String(amount))
        parseUnits(String(amount), tokenFiltered[tokenActive]?.decimals),
        nativeTokenBalance ?? 0
      );
      if (!hash) {
        return;
      }
      //save tx hash
      const rpcUrl = FromList.find(
        (item) => item.networkKey === networkKey
      )?.rpcUrl;
      addTxHash(address, hash, rpcUrl!);

      setUrl(`${fromList[fromActive].explorerUrl}/tx/${hash}`);
      dispatch(setDepositL1TxHash(hash!));
      transLoadModal.onClose();
      dispatch(setDepositStatus("pending"));
      transSuccModal.onOpen();
      setTimeout(() => {
        transSuccModal.onClose();
      }, 5000);
    } catch (e) {
      transLoadModal.onClose();
      dispatch(setDepositStatus(""));

      if (e.message) {
        if (e.message.includes("Insufficient balance")) {
          setFailMessage("Insufficient balance");
        } else if (e.message.includes("User rejected the request")) {
          setFailMessage("User rejected the request");
        } else {
          setFailMessage(e.message);
        }
      }

      transFailModal.onOpen();
      setTimeout(() => {
        transFailModal.onClose();
      }, 5000);
      return;
    }

    refreshTokenBalanceList();

    onClose?.();
  }, [
    address,
    invalidChain,
    amount,
    transLoadModal,
    refreshTokenBalanceList,
    onClose,
    switchChain,
    fromActive,
    sendDepositTx,
    tokenFiltered,
    tokenActive,
    nativeTokenBalance,
    addTxHash,
    dispatch,
    transSuccModal,
    networkKey,
    transFailModal,
  ]);

  return (
    <>
      <Container className="">
        <SelectBox className="px-6 py-6 ">
          <div className="flex items-center gap-4">
            <span className="font-bold">From</span>
            <div
              className="selector flex items-center gap-2 px-4 py-2 rounded-2xl cursor-pointer"
              onClick={() => fromModal.onOpen()}
            >
              <img
                src={fromList[fromActive].icon}
                className="w-6 h-6 rounded-full"
              />
              <span>{fromList[fromActive].label}</span>
              {fromModal.isOpen ? <AiOutlineUp /> : <AiOutlineDown />}
            </div>
            <div className="ml-auto">
              Balance:{" "}
              <span>{tokenFiltered[tokenActive]?.formatedBalance}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <Input
              classNames={{ input: "text-4xl" }}
              size="lg"
              // type="number"
              placeholder="0"
              variant={"underlined"}
              value={String(amount)}
              onValueChange={handleInputValue}
              onWheel={(e) => e.preventDefault()}
              errorMessage=""
            />

            <div
              className="selector flex items-center gap-2 px-4 py-4 rounded-3xl cursor-pointer"
              onClick={() => tokenModal.onOpen()}
            >
              <Avatar
                src={tokenFiltered[tokenActive]?.icon}
                style={{ width: 24, height: 24 }}
              />
              <span>{tokenFiltered[tokenActive]?.symbol}</span>
              {tokenModal.isOpen ? <AiOutlineUp /> : <AiOutlineDown />}
            </div>
          </div>
        </SelectBox>

        <SelectBox className="mt-4 px-6 py-6">
          <div className="flex items-center justify-between mb-2 points-box">
            <div className="flex items-center">
              <span>Nova Points</span>

              <Tooltip
                showArrow={true}
                classNames={{
                  content: "max-w-[300px] p-4",
                }}
                content=" Nova Points are distributed every 8 hours, and you will receive points equal to 10 distributions after a valid deposit."
              >
                <img
                  src={"/img/icon-tooltip.png"}
                  className="w-[14px] cursor-pointer ml-1 mr-4"
                />
              </Tooltip>
              <div className="flex items-center justify-center bg-green-800 h-[28px] px-4  rounded-md font-normal text-xs text-[#0BC48F]">
                10x Boost
              </div>
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
              <span className="text-white">{showNoPointsTip ? 0 : points}</span>
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
              <span className="text-white">
                ~ {NexusEstimateArrivalTimes[networkKey]} minutes
              </span>
            </div>
          )}
          {/* <div className="flex items-center justify-between mb-2 points-box">
            <span>Est.fee</span>
            <span>0.002 ETH</span>
          </div> */}
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
                className="gradient-btn w-full rounded-full "
                style={{ display: "flex", alignItems: "center" }}
                disableAnimation
                size="lg"
                onClick={handleAction}
                isLoading={loading}
                disabled={actionBtnDisabled}
              >
                {btnText}
              </Button>
            </Tooltip>
          ) : (
            <Button
              className="gradient-btn  w-full rounded-full "
              size="lg"
              color="primary"
              disableAnimation
              onClick={() => web3Modal.open()}
            >
              Connect Wallet
            </Button>
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
              minimum deposit value should be {minDepositValue} ETH.
            </p>
          </div>
        )}
      </Container>
      {isFirstDeposit && address && txhashes[address]?.[0] && (
        <div>
          <Link
            to="/aggregation-parade?flag=1"
            target="_blank"
            className="text-[1rem]"
          >
            <div className="mt-[1.5rem] px-[1.5rem] py-[1rem] flex items-center justify-between bg-[rgba(0,0,0,0.4)] rounded-[12px] border-1 border-[#03D498]">
              <span>Click to verify your transaction.</span>
              <AiOutlineRight />
            </div>
          </Link>

          <div className="mt-[1.5rem] text-[1rem] text-[#A0A5AD]">
            Latest tx hash
          </div>

          <div className="mt-[0.5rem] flex justify-between items-center">
            <div className="flex items-center gap-[0.25rem]">
              <img
                src={
                  FromList.find(
                    (item) => item.rpcUrl === txhashes[address][0]?.rpcUrl
                  )?.icon
                }
                className="w-6 h-6 mr-1 rounded-full"
              />
              <a
                href={getTxHashExplorerLink(
                  txhashes[address][0]?.rpcUrl,
                  txhashes[address][0]?.txhash
                )}
                target="_blank"
                className="hover:underline text-[1rem]"
              >
                {formatTxHash(txhashes[address][0]?.txhash)}
              </a>
            </div>

            <div className="flex items-center gap-[1rem]">
              <CopyIcon text={txhashes[address][0].txhash} />
            </div>
          </div>
        </div>
        // <div className="mt-8 flex flex-col text-lg bg-[#000000] bg-opacity-40 px-4 py-3 rounded-[16px]">
        //   <div className="flex items-center justify-between font-normal text-[14px] mb-2 text-[#A0A5AD]">
        //     <span>Latest tx hash:</span>
        //     <span>
        //       You can use this tx hash to verify in Aggregation Parade page
        //     </span>
        //   </div>
        //   <div className="flex items-center ">
        //     <img
        //       src={
        //         FromList.find(
        //           (item) => item.rpcUrl === txhashes[address][0]?.rpcUrl
        //         )?.icon
        //       }
        //       className="w-6 h-6 mr-1 rounded-full"
        //     />
        //     <span className="text-[12px] font-semibold">
        //       <a
        //         href={getTxHashExplorerLink(
        //           txhashes[address][0]?.rpcUrl,
        //           txhashes[address][0]?.txhash
        //         )}
        //         target="_blank"
        //         className="hover:underline"
        //       >
        //         {formatTxHash(txhashes[address][0]?.txhash)}
        //       </a>
        //     </span>
        //     <CopyIcon text={txhashes[address][0].txhash} />
        //   </div>
        // </div>
      )}
      <Modal
        style={{ minHeight: "600px", backgroundColor: "rgb(38, 43, 51)" }}
        size="2xl"
        isOpen={fromModal.isOpen}
        onOpenChange={fromModal.onOpenChange}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-3xl">
            From
          </ModalHeader>
          <ModalBody className="pb-8">
            {fromList.map((item, index) => (
              <ModalSelectItem
                className="flex items-center justify-between p-4 cursor-pointer"
                key={index}
                onClick={() => handleFrom(index)}
              >
                <div className="flex items-center">
                  <Avatar src={item.icon} className="w-12 h-12" />
                  <span className="text-xl ml-4">{item.label}</span>
                </div>

                {index === fromActive && <AiOutlineCheck size={14} />}
              </ModalSelectItem>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        style={{ minHeight: "600px", backgroundColor: "rgb(38, 43, 51)" }}
        size="2xl"
        isOpen={tokenModal.isOpen}
        onOpenChange={tokenModal.onOpenChange}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-3xl">
            Choose Token
          </ModalHeader>
          <ModalBody className="pb-8">
            {/* <div>
              <Input
                classNames={{ input: "text-xl" }}
                variant="bordered"
                radius="lg"
                size="lg"
                placeholder="Symbol or address"
                startContent={
                  <AiOutlineSearch className="text-2xl text-gray-400" />
                }
              />
            </div> */}
            <p>Category</p>
            <Tabs
              aria-label="Options"
              classNames={{ tabList: "w-full", tab: "w-auto" }}
              selectedKey={category}
              onSelectionChange={(key: React.Key) => setCategory(key as string)}
            >
              {AssetTypes.map((item) => (
                <Tab key={item.value} title={item.label}></Tab>
              ))}
            </Tabs>
            <div className="h-[500px] overflow-scroll">
              {tokenFiltered.map((item, index) => (
                <ModalSelectItem
                  className="flex items-center justify-between p-4 cursor-pointer"
                  key={index}
                  onClick={() => handeToken(index)}
                >
                  <div className="flex items-center">
                    <Avatar src={item?.icon} className="w-12 h-12" />
                    <span className="text-xl ml-4">{item?.symbol}</span>
                  </div>

                  <span className="text-base">{item?.formatedBalance}</span>
                </ModalSelectItem>
              ))}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        style={{ minHeight: "300px", backgroundColor: "rgb(38, 43, 51)" }}
        size="xl"
        isOpen={transLoadModal.isOpen}
        onOpenChange={transLoadModal.onOpenChange}
        className="trans"
      >
        <ModalContent>
          <ModalBody className="pb-8">
            <Trans>
              <Button
                className="statusBut"
                disableAnimation
                size="lg"
                isLoading={loading}
                disabled={actionBtnDisabled}
              ></Button>
              <div className="title">Depositing</div>
              <div className="inner">
                Please sign the transaction in your wallet.
              </div>
            </Trans>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        style={{ minHeight: "300px", backgroundColor: "rgb(38, 43, 51)" }}
        size="xl"
        isOpen={transSuccModal.isOpen}
        onOpenChange={transSuccModal.onOpenChange}
        className="trans"
      >
        <ModalContent>
          <ModalBody className="pb-8">
            <Trans>
              <img src="/img/transSuccess.png" alt="" className="statusImg" />
              <div className="title">Transaction Submitted</div>
              <div className="inner">
                Please allow a few minutes for your deposit to be confirmed on
                zkLink Nova.
              </div>
              <a
                href={url}
                target="_blank"
                className="view"
                onClick={transSuccModal.onClose}
              >
                View in explorer
              </a>
            </Trans>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        style={{ minHeight: "300px", backgroundColor: "rgb(38, 43, 51)" }}
        size="xl"
        isOpen={transFailModal.isOpen}
        onOpenChange={transFailModal.onOpenChange}
      >
        <ModalContent>
          <ModalBody className="pb-8">
            <Trans>
              <img src="/img/transFail.png" alt="" className="statusImg" />
              <div className="title">Transaction Failed</div>
              <div className="title">{failMessage}</div>
              <div className="inner">
                If you have any questions regarding this transaction, please{" "}
                <a
                  href="https://discord.com/invite/zklink"
                  target="_blank"
                  className="view inline"
                  onClick={transFailModal.onClose}
                >
                  contact us
                </a>{" "}
                for help
              </div>
            </Trans>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
