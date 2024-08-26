import { useState, useMemo, useCallback, useEffect, useRef } from "react";
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
  Tooltip,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { useAccount, useSwitchChain } from "wagmi";
import { AiOutlineCheck } from "react-icons/ai";
import toast from "react-hot-toast";
import { debounce } from "lodash";
import { useBridgeTx } from "@/hooks/useBridgeTx";
import BigNumber from "bignumber.js";
import { useBridgeNetworkStore } from "@/hooks/useNetwork";
import { STORAGE_NETWORK_KEY } from "@/constants";
import fromList from "@/constants/fromChainList";
import useTokenBalanceList from "@/hooks/useTokenList";
import { ETH_ADDRESS } from "zksync-web3/build/src/utils";
import { useDispatch, useSelector } from "react-redux";
import { checkWinnerAddress, getDepositETHThreshold } from "@/api";
import { RootState } from "@/store";
import { setDepositL1TxHash } from "@/store/modules/airdrop";
import { parseUnits } from "viem";
import { Token } from "@/hooks/useTokenList";
import { formatTxHash, getTxHashExplorerLink, isSameAddress } from "@/utils";
import CopyIcon from "../CopyIcon";
import { useVerifyStore } from "@/hooks/useVerifyTxHashSotre";
import FromList from "@/constants/fromChainList";
import { Link } from "react-router-dom";
import { AiOutlineRight } from "react-icons/ai";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useConnections } from "wagmi";
import { SourceTokenInfo, useMergeToken } from "@/hooks/useMergeToken";
import useOldestFriendsStatus from "@/hooks/useOldestFriendsStatus";
import useNovaChadNftStatus from "@/hooks/useNovaChadNftStatus";
import BridgeCompPc from "./BridgeCompPc";

import {
  ModalSelectItem,
  AssetTypes,
  TokenYieldBox,
  Trans,
} from "./Components";
import { useTranslation } from "react-i18next";

export interface IBridgeComponentProps {
  onClose?: () => void;
  bridgeToken?: string;
}
export default function Bridge(props: IBridgeComponentProps) {
  const { onClose, bridgeToken } = props;
  // const web3Modal = useWeb3Modal();
  const { openConnectModal } = useConnectModal();

  const { isConnected, address, chainId } = useAccount();
  const fromModal = useDisclosure();
  const tokenModal = useDisclosure();
  const transLoadModal = useDisclosure();
  const transSuccModal = useDisclosure();
  const transFailModal = useDisclosure();
  const [failMessage, setFailMessage] = useState("");
  // const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
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
  const [openTooltip, setOpenTooltip] = useState(false);
  const connections = useConnections();
  const [connectorName, setConnectorName] = useState("");
  const [switchLoading, setSwitchLoading] = useState(false);
  const [switchChainError, setSwitchChainError] = useState("");
  const dispatch = useDispatch();

  const { addTxHash, txhashes } = useVerifyStore();

  const inputRef1 = useRef<HTMLInputElement>(null);
  const inputRef2 = useRef<HTMLInputElement>(null);
  const [isMergeSelected, setIsMergeSelected] = useState(true);
  const [mergeTokenInfo, setMergeTokenInfo] = useState<SourceTokenInfo>();

  const { fetchMergeTokenInfo } = useMergeToken();

  useEffect(() => {
    //https://github.com/ant-design/ant-design-mobile/issues/5174
    inputRef1.current?.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
      },
      { passive: false }
    );
    inputRef2.current?.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
      },
      { passive: false }
    );
  }, []);

  useEffect(() => {
    // const timer = setInterval(() => {
    //   refreshTokenBalanceList();
    // }, 5000);
    // return () => clearInterval(timer);
  }, [refreshTokenBalanceList]);

  // useEffect(() => {
  //   (async () => {
  //     const token = tokenFiltered[tokenActive];
  //     if (token && token.l2Address) {
  //       const info = await fetchMergeTokenInfo(token.l2Address);
  //       console.log("mergeInfo: ", info);
  //       setMergeTokenInfo(info);
  //     } else {
  //       setMergeTokenInfo(undefined);
  //     }
  //   })();
  // }, [fetchMergeTokenInfo, tokenActive, tokenFiltered]);

  useEffect(() => {
    (async () => {
      const token = tokenFiltered[tokenActive];
      if (token && token.l2Address) {
        const info = await fetchMergeTokenInfo(token.l2Address);
        console.log("mergeInfo: ", info);
        setMergeTokenInfo(info);
      } else {
        setMergeTokenInfo(undefined);
      }
    })();
  }, [fetchMergeTokenInfo, tokenActive, tokenFiltered]);

  const mergeSupported = useMemo(() => {
    return mergeTokenInfo?.isSupported && !mergeTokenInfo?.isLocked;
    return false;
  }, [mergeTokenInfo]);

  const mergeLimitExceeds = useMemo(() => {
    if (!amount) return false;
    const amountVal = parseUnits(
      String(amount),
      tokenFiltered[tokenActive]?.decimals
    );
    const exceeds = new BigNumber(amountVal.toString())
      .plus(mergeTokenInfo?.balance.toString() ?? 0)
      .gt(mergeTokenInfo?.depositLimit.toString() ?? 0);
    console.log("exceeds: ", exceeds);
    return mergeSupported && isMergeSelected && exceeds;
  }, [
    amount,
    tokenFiltered,
    tokenActive,
    mergeTokenInfo?.balance,
    mergeTokenInfo?.depositLimit,
    mergeSupported,
    isMergeSelected,
  ]);

  useEffect(() => {
    (async () => {
      if (address) {
        //TODO call api to get loyal points
        // setLoyalPoints(300);
        console.log("connections: ", connections);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (connections?.[0]?.connector.name === "GateWallet") {
          setConnectorName("GateWallet");
        } else {
          const provider: any = await connections?.[0]?.connector.getProvider();

          const walletName = provider?.session?.peer?.metadata.name;
          console.log("connection provider name : ", walletName);
          setConnectorName(walletName);
        }
      } else {
        setConnectorName("");
      }
    })();
  }, [address, connections]);

  const unsupportedChainWithConnector = useMemo(() => {
    if (connectorName && fromList[fromActive]) {
      if (
        connectorName.toLowerCase().includes("binance") &&
        fromList[fromActive].networkKey === "mantle"
      ) {
        return "Binance wallet may not support Mantle Network.";
      } else if (
        connectorName.toLowerCase().includes("gate") &&
        !["ethereum", "arbitrum", "zksync", "optimism"].includes(
          fromList[fromActive].networkKey
        )
      ) {
        return `Gate wallet may not support ${fromList[fromActive].chainName} Network.`;
      }
    }
    return "";
  }, [fromActive, connectorName]);

  const mergeTokenBooster = useMemo(() => {
    return "Extra";
  }, []);

  useEffect(() => {
    console.log("tokenList=====", tokenList);
    if (category === "ALL") {
      let arr = [...tokenList];

      const ezEthIndex = arr.findIndex((item) => item.symbol === "ezETH");
      const ezEthItem = arr.splice(ezEthIndex, 1);
      arr.splice(4, 0, ezEthItem[0]);

      setTokenFiltered(arr);
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

  const errorInputMsg = useMemo(() => {
    if (mergeLimitExceeds) {
      return "Input amount exceeds the merge limit.";
    }
    const token = tokenFiltered[tokenActive];
    const [_, decimals] = amount.split(".");
    if (token && decimals && decimals.length > token.decimals) {
      return `Max decimal length for ${token.symbol} is ${token.decimals}`;
    }
    return "";
  }, [tokenActive, tokenFiltered, amount, mergeLimitExceeds]);

  console.log("errorInputMsg: ", errorInputMsg);

  const computePoints = debounce(() => {
    if (!amount || !tokenFiltered[tokenActive]) {
      setShowNoPointsTip(false);
      setPoints(0);
      return;
    }
    if (tokenFiltered[tokenActive]?.address === ETH_ADDRESS) {
      if (Number(amount) < minDepositValue && isFirstDeposit) {
        setShowNoPointsTip(true);
      } else {
        setShowNoPointsTip(false);
      }
    }
    try {
      const priceInfo = allTokens.find(
        (item) =>
          item.symbol.toLowerCase() ===
            tokenFiltered[tokenActive].symbol.toLowerCase() &&
          item.networkKey === fromList[fromActive].networkKey
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
        if (ethValue < minDepositValue && isFirstDeposit) {
          setShowNoPointsTip(true);
        } else {
          setShowNoPointsTip(false);
        }
        // NOVA Points =  Token multiplier* Deposit Amount * Token Price/ETH price
        const points = new BigNumber(priceInfo.usdPrice)
          .multipliedBy(tokenFiltered[tokenActive].multiplier)
          .multipliedBy(amount)
          .div(ethPriceInfo.usdPrice)
          .toNumber();
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
    if (bridgeToken && !bridgeTokenInited) {
      const token = tokenFiltered.find((item) =>
        bridgeToken.indexOf("0x") > -1
          ? isSameAddress(item.address, bridgeToken)
          : item.symbol === bridgeToken
      );
      if (token) {
        // const _tokenList = tokenList.filter(
        //   (item) => item.networkKey === token.networkKey
        // );
        let index = 0;
        let fromIndex = fromList.findIndex(
          (item) => item.networkKey === token.networkKey
        );
        if (fromIndex < 0) {
          fromIndex = 0;
        }
        const from = fromList[fromIndex];
        if (token.address !== ETH_ADDRESS) {
          index = tokenFiltered.findIndex(
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
      if (tokenFiltered.length > 1) {
        setBridgeTokenInited(true);
      }
    } else {
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
    }
  }, [
    setNetworkKey,
    isFirstDeposit,
    bridgeToken,
    tokenFiltered,
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
    if (!invalidChain && mergeLimitExceeds) {
      return true;
    } else if (
      !invalidChain &&
      (!nativeTokenBalance ||
        new BigNumber(nativeTokenBalance.toString()).eq(0))
    ) {
      return true;
    } else if (unsupportedChainWithConnector) {
      return true;
    } else if (
      !invalidChain &&
      tokenFiltered[tokenActive] &&
      (!tokenFiltered[tokenActive].balance ||
        tokenFiltered[tokenActive].balance! <= 0 ||
        Number(tokenFiltered[tokenActive].formatedBalance) < Number(amount) ||
        Number(amount) <= 0 ||
        errorInputMsg)
    ) {
      return true;
    }
    return false;
  }, [
    nativeTokenBalance,
    unsupportedChainWithConnector,
    invalidChain,
    tokenFiltered,
    tokenActive,
    amount,
    errorInputMsg,
    mergeLimitExceeds,
  ]);

  const isDepositErc20 = useMemo(() => {
    return (
      tokenFiltered[tokenActive] &&
      tokenFiltered[tokenActive].address !== ETH_ADDRESS
    );
  }, [tokenActive, tokenFiltered]);
  const { t } = useTranslation();
  const btnText = useMemo(() => {
    if (invalidChain) {
      return t("common.switch_network");
    } else if (
      amount &&
      tokenFiltered[tokenActive] &&
      tokenFiltered[tokenActive].formatedBalance
    ) {
      if (Number(amount) > Number(tokenFiltered[tokenActive].formatedBalance)) {
        return "Insufficient balance";
      }
    } else if (isDepositErc20) {
      return "Approve and Deposit";
    }
    return "Continue";
  }, [invalidChain, amount, tokenActive, tokenFiltered, isDepositErc20]);

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

  useEffect(() => {
    setSwitchChainError("");
  }, [fromActive]);

  const handleAction = useCallback(async () => {
    if (!address) return;
    if (invalidChain) {
      try {
        setSwitchLoading(true);
        await switchChainAsync({ chainId: fromList[fromActive].chainId });
        setSwitchChainError("");
        return;
      } catch (e: any) {
        console.log(e);
        if (e.message && e.message.includes("the method now not support")) {
          // imported wallet in binance not support some chain
          setSwitchChainError(
            `The Binance Web3 wallet may not be support ${fromList[fromActive].chainName} if you're using an imported wallet.`
          );
          return;
        }
        setSwitchChainError(
          "Switch network failed. Please refresh page and try again."
        );
      } finally {
        setSwitchLoading(false);
      }
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
        nativeTokenBalance!,
        mergeSupported && isMergeSelected
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
      // dispatch(setDepositStatus("pending"));
      transSuccModal.onOpen();
      setTimeout(() => {
        transSuccModal.onClose();
      }, 5000);
    } catch (e: any) {
      transLoadModal.onClose();
      // dispatch(setDepositStatus(""));

      if (e.message) {
        if (e.message.includes("Insufficient Gas Token Balance")) {
          setFailMessage(e.message);
        } else if (
          e.message.includes(
            "User rejected the request" ||
              e.message.includes("OKX Wallet Reject")
          )
        ) {
          setFailMessage("User rejected the request");
        } else if (e.message.includes("Internal JSON-RPC error ")) {
          setFailMessage("Internal JSON-RPC error. Please try again");
        } else {
          setFailMessage(e.message);
        }
      }

      transFailModal.onOpen();
      setTimeout(() => {
        transFailModal.onClose();
      }, 10000);
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
    switchChainAsync,
    fromActive,
    sendDepositTx,
    tokenFiltered,
    tokenActive,
    nativeTokenBalance,
    mergeSupported,
    isMergeSelected,
    addTxHash,
    dispatch,
    transSuccModal,
    networkKey,
    transFailModal,
  ]);

  const { mintable, minted } = useOldestFriendsStatus();

  const [isCheckWinner, setIsCheckWinner] = useState(false);
  const [isWhitelistWinner, setIsWhitelistWinner] = useState(false); // TODO: get from api

  const checkWinnerAddressFunc = async () => {
    if (!address) return;
    const { result } = await checkWinnerAddress(address);
    if (!!result) {
      setIsCheckWinner(result);
    }
  };

  useEffect(() => {
    checkWinnerAddressFunc();
  }, [address]);

  const { isMemeMysteryboxReward } = useNovaChadNftStatus();

  return (
    <>
      <BridgeCompPc
        {...{
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
        }}
      />

      {isFirstDeposit && address && txhashes[address]?.[0] && (
        <div>
          <Link
            to="/aggregation-parade?verifyTx=1"
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
      )}
      <Modal
        classNames={{ closeButton: "text-[1.5rem]" }}
        style={{ minHeight: "600px", backgroundColor: "rgb(38, 43, 51)" }}
        size="2xl"
        isOpen={fromModal.isOpen}
        onOpenChange={fromModal.onOpenChange}
        scrollBehavior="inside"
      >
        <ModalContent className="mb-[3.75rem]">
          <ModalHeader className="flex flex-col gap-1 text-[1.25rem] md:text-3xl">
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
                  <Avatar src={item.icon} className="w-8 h-8 md:w-12 md:h-12" />
                  <span className="text-xl ml-4">{item.label}</span>
                </div>

                {index === fromActive && <AiOutlineCheck size={14} />}
              </ModalSelectItem>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        classNames={{ closeButton: "text-[1.5rem]" }}
        style={{ minHeight: "600px", backgroundColor: "rgb(38, 43, 51)" }}
        size="2xl"
        isOpen={tokenModal.isOpen}
        onOpenChange={tokenModal.onOpenChange}
      >
        <ModalContent className="mb-[3.75rem]">
          <ModalHeader className="flex flex-col gap-1 text-[1.25rem] md:text-3xl">
            Choose Token
          </ModalHeader>
          <ModalBody className="pb-8">
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
            <div className="h-[370px] md:h-[500px] overflow-scroll">
              {tokenFiltered.map((item, index) => (
                <ModalSelectItem
                  className="flex items-center justify-between p-4 cursor-pointer"
                  key={index}
                  onClick={() => handeToken(index)}
                >
                  <div className="flex items-center">
                    <Avatar src={item?.icon} className="w-12 h-12" />
                    <div className="text-xl ml-4 ">
                      <span>{item?.symbol}</span>
                      {item.symbol === "pufETH" && (
                        <TokenYieldBox className="flex items-center ml-0 md:ml-2 md:hidden">
                          <span className={`token-yield token-yield-1`}>
                            EigenLayer Points
                          </span>
                          <span className={`token-yield token-yield-2`}>
                            Puffer Points
                          </span>
                        </TokenYieldBox>
                      )}
                      {item.symbol === "ezETH" && (
                        <TokenYieldBox className="flex items-center ml-0 md:ml-2 md:hidden">
                          <span className={`token-yield token-yield-1`}>
                            EigenLayer Points
                          </span>
                          <span className={`token-yield token-yield-5`}>
                            ezPoints
                          </span>
                        </TokenYieldBox>
                      )}

                      {(item.symbol === "mstETH" ||
                        item.symbol === "mswETH" ||
                        item.symbol === "mmETH" ||
                        item.symbol === "mwBETH") && (
                        <TokenYieldBox className="flex items-center ml-0 md:ml-2 md:hidden">
                          <span className={`token-yield token-yield-1`}>
                            EL Points
                          </span>
                          <span className={`token-yield token-yield-7`}>
                            Eigenpie Points
                          </span>
                        </TokenYieldBox>
                      )}

                      {item.symbol === "rsETH" && (
                        <TokenYieldBox className="flex items-center ml-0 md:ml-2 md:hidden">
                          <span className={`token-yield token-yield-1`}>
                            EigenLayer Points
                          </span>
                          <span className={`token-yield token-yield-8`}>
                            Kelp Miles
                          </span>
                        </TokenYieldBox>
                      )}
                    </div>
                    {item.symbol === "pufETH" && (
                      <TokenYieldBox className="hidden items-center md:flex md:items-center md:ml-2">
                        <span className={`token-yield token-yield-1`}>
                          EigenLayer Points
                        </span>
                        <span className={`token-yield token-yield-2`}>
                          Puffer Points
                        </span>
                      </TokenYieldBox>
                    )}

                    {item.symbol === "ezETH" && (
                      <TokenYieldBox className="hidden items-center md:flex md:items-center md:ml-2">
                        <span className={`token-yield token-yield-1`}>
                          EigenLayer Points
                        </span>
                        <span className={`token-yield token-yield-5`}>
                          ezPoints
                        </span>
                      </TokenYieldBox>
                    )}

                    {(item.symbol === "mstETH" ||
                      item.symbol === "mswETH" ||
                      item.symbol === "mmETH" ||
                      item.symbol === "mwBETH") && (
                      <TokenYieldBox className="hidden items-center md:flex md:items-center md:ml-2">
                        <span className={`token-yield token-yield-1`}>
                          EigenLayer Points
                        </span>
                        <span className={`token-yield token-yield-7`}>
                          Eigenpie Points
                        </span>
                      </TokenYieldBox>
                    )}

                    {item.symbol === "rsETH" && (
                      <TokenYieldBox className="hidden items-center md:flex md:items-center md:ml-2">
                        <span className={`token-yield token-yield-1`}>
                          EigenLayer Points
                        </span>
                        <span className={`token-yield token-yield-8`}>
                          Kelp Miles
                        </span>
                      </TokenYieldBox>
                    )}
                  </div>

                  <span className="text-base">{item?.formatedBalance}</span>
                </ModalSelectItem>
              ))}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        classNames={{ closeButton: "text-[1.5rem]" }}
        style={{ minHeight: "300px", backgroundColor: "rgb(38, 43, 51)" }}
        size="xl"
        isOpen={transLoadModal.isOpen}
        onOpenChange={transLoadModal.onOpenChange}
        className="trans"
      >
        <ModalContent className="mb-[3.75rem]">
          <ModalBody className="pb-8">
            <Trans>
              <Button
                className="statusBut"
                disableAnimation
                size="lg"
                isLoading={loading}
                disabled={actionBtnDisabled}
              ></Button>
              <div className="title">
                {!isDepositErc20 ? "Depositing" : "Sending Transaction"}
              </div>
              <div className="inner">
                <p>Please sign the transaction in your wallet.</p>
                <p className="mt-2">
                  If the transaction doesn't show up in your wallet after a
                  minute or if the deposit keeps pending, please refresh the
                  page and try again.
                </p>
              </div>
            </Trans>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        classNames={{ closeButton: "text-[1.5rem]" }}
        style={{ minHeight: "300px", backgroundColor: "rgb(38, 43, 51)" }}
        size="xl"
        isOpen={transSuccModal.isOpen}
        onOpenChange={transSuccModal.onOpenChange}
        className="trans"
      >
        <ModalContent className="mb-[3.75rem]">
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
        classNames={{ closeButton: "text-[1.5rem]" }}
        style={{ minHeight: "300px", backgroundColor: "rgb(38, 43, 51)" }}
        size="xl"
        isOpen={transFailModal.isOpen}
        onOpenChange={transFailModal.onOpenChange}
      >
        <ModalContent className="mb-[3.75rem]">
          <ModalBody className="pb-8">
            <Trans>
              <img src="/img/transFail.png" alt="" className="statusImg" />
              <div className="title">Transaction Failed</div>
              <div className="title">
                {failMessage
                  .toLowerCase()
                  .includes("missing or invalid parameters")
                  ? "User rejected signature"
                  : failMessage}
              </div>
              {failMessage.includes("Insufficient Gas Token Balance") && (
                <p className="inner">
                  If you do have enough gas tokens in your wallet, you could try
                  using a{" "}
                  <a
                    href="https://chainlist.org/"
                    target="_blank"
                    className="view inline"
                  >
                    VPN
                  </a>{" "}
                  or switching to a different RPC in your wallet.
                </p>
              )}
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
