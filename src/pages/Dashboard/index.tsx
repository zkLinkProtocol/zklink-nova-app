import styled from "styled-components";
import AssetsTable from "@/components/AssetsTable";
import { BgBox, BgCoverImg, CardBox } from "@/styles/common";
import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Skeleton,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import BridgeComponent from "@/components/Bridge";
import { BOOST_LIST } from "@/constants/boost";
import {
  formatNumberWithUnit,
  getBooster,
  getNextMilestone,
  formatBalance,
  addNovaChain,
  getTweetShareText,
} from "@/utils";
import ReferralList from "@/components/ReferralList";
import { RootState } from "@/store";
import {
  SupportToken,
  getAccounTvl,
  getAccountPoint,
  getAccountRefferalsTVL,
  getAccountTvl,
  getExplorerTokenTvl,
  getGroupTvl,
  getReferralTvl,
  getSupportTokens,
  getTokenPrice,
  getTotalTvl,
  getTotalTvlByToken,
} from "@/api";
import { useAccount, useChainId, useBalance, useSwitchChain } from "wagmi";
import toast from "react-hot-toast";
import { NOVA_CHAIN_ID } from "@/constants";
import useNovaNFT, { NOVA_NFT_TYPE } from "@/hooks/useNFT";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loading from "@/components/Loading";

const GradientButton = styled.span`
  border-radius: 0.5rem;
  background: linear-gradient(90deg, #48ecae 0%, #3e52fc 51.07%, #49ced7 100%);
  color: #fff;
  text-align: center;
  font-family: Satoshi;
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.625rem; /* 144.444% */
  letter-spacing: 0.0625rem;
  user-select: none;
`;
const GreenTag = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.375rem;
  background: linear-gradient(90deg, #0bc48f 0%, #00192b 107.78%);
`;

const GradientText = styled.span`
  background: linear-gradient(90deg, #48ecae 0%, #49ced7 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ProgressBar = styled.div`
  position: relative;
  padding: 2rem 0;

  .title {
    position: absolute;
    left: 0;
    bottom: -0.1rem;
    color: #fff;
    font-family: Satoshi;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 700;
    line-height: 1; /* 157.143% */
  }

  .progress-item {
    position: relative;
    height: 0.5rem;
    background: #2a2a2a;
    border-radius: 0.5rem;

    &.active {
      .inner-bar {
        width: 100%;
      }
      .progress-points {
        background-color: #46aae2;
        z-index: 12;
        .points-top {
          background: linear-gradient(90deg, #48ecae 0%, #49ced7 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .points-bottom {
          color: #fff;
        }
      }
    }

    .inner-bar {
      max-width: 100%;
      border-radius: 0.5rem;
      background: linear-gradient(
        90deg,
        #48ecae 0%,
        #3e52fc 51.07%,
        #49ced7 100%
      );
    }

    .progress-points {
      position: absolute;
      top: 50%;
      right: -0.625rem;
      transform: translate(0, -50%);
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 50%;
      background-color: #2a2a2a;
      z-index: 10;
      .points-top {
        position: absolute;
        top: -2rem;
        left: 50%;
        transform: translate(-50%, 0);
        color: #919192;
        text-align: center;
        font-family: Satoshi;
        font-size: 0.875rem;
        font-style: normal;
        font-weight: 700;
        line-height: 1.375rem; /* 157.143% */
        white-space: nowrap;
      }
      .points-bottom {
        position: absolute;
        bottom: -2rem;
        left: 50%;
        transform: translate(-50%, 0);
        color: #919192;
        text-align: center;
        font-family: Satoshi;
        font-size: 0.875rem;
        font-style: normal;
        font-weight: 700;
        line-height: 1.375rem; /* 157.143% */
        white-space: nowrap;
      }
    }
  }
`;

const TabsBox = styled.div`
  .tab-item {
    color: #a9a9a9;
    font-family: Satoshi;
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 700;
    line-height: 2rem; /* 133.333% */
    letter-spacing: 0.09rem;
    user-select: none;
    cursor: pointer;
    &.active,
    &:hover {
      color: #fff;
    }
  }
`;

export type TotalTvlItem = {
  symbol: string;
  tokenAddress: string;
  amount: string;
  tvl: string;
  type: string;
  yieldType: string;
  iconURL: string | null;
};

export type AccountTvlItem = {
  tvl: string;
  amount: string;
  tokenAddress: string;
  symbol: string;
  iconURL: string | null;
};

export type ProgressItem = {
  tier: number;
  value: number;
  booster: number;
  progress: number;
  isActive: boolean;
};

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const { invite } = useSelector((store: RootState) => store.airdrop);
  // const address = "0xF50087B8663177Ea50e7C5428f7d0908cddB4f8F"; // mainnet account for test

  const [tabsActive, setTabsActive] = useState(0);
  const [totalTvlList, setTotalTvlList] = useState<TotalTvlItem[]>([]);
  const [stakingUsdValue, setStakingUsdValue] = useState(0);
  const [stakingEthValue, setStakingEthValue] = useState(0);
  const [isStakingUsd, setIsStakingUsd] = useState(false);
  const [accountPoint, setAccountPoint] = useState({
    novaPoint: 0,
    referPoint: 0,
  });
  const [progressList, setProgressList] = useState<ProgressItem[]>([]);
  const [referrersTvlList, setReferrersTvl] = useState([]);
  const [bridgeToken, setBridgeToken] = useState("");
  const bridgeModal = useDisclosure();
  const mintModal = useDisclosure();
  const [accountTvlData, setAccountTvlData] = useState<AccountTvlItem[]>([]);
  const [groupTvl, setGroupTvl] = useState(0);
  const [totalTvl, setTotalTvl] = useState(0);
  const [referralTvl, setReferralTvl] = useState(0);
  const [supportTokens, setSupportTokens] = useState<SupportToken[]>([]);
  const [ethUsdPrice, setEthUsdPrice] = useState(0);

  const chainId = useChainId();
  const { nft, loading: mintLoading, sendMintTx, fetchLoading } = useNovaNFT();
  const [mintType, setMintType] = useState<NOVA_NFT_TYPE>("ISTP");

  const { switchChain } = useSwitchChain();
  const navigatorTo = useNavigate();
  const dispatch = useDispatch();

  const { data: nativeTokenBalance } = useBalance({
    address: address as `0x${string}`,
    chainId: NOVA_CHAIN_ID,
    token: undefined,
  });
  const novaBalance = useMemo(() => {
    if (nativeTokenBalance) {
      return formatBalance(nativeTokenBalance?.value ?? 0n, 18);
    }
    return 0;
  }, [nativeTokenBalance]);
  console.log("nativeTokenBalance: ", nativeTokenBalance);
  const isInvaidChain = useMemo(() => {
    return chainId !== NOVA_CHAIN_ID;
  }, [chainId]);

  const handleCopy = () => {
    if (!invite?.code) return;
    navigator.clipboard.writeText(invite?.code);
    toast.success("Copied", { duration: 2000 });
  };

  const handleBridgeMore = (token?: string) => {
    token && setBridgeToken(token);
    bridgeModal.onOpen();
  };

  const getAccountPointFunc = async () => {
    if (!address) return;
    const res = await getAccountPoint(address);
    console.log("account point", res);
    if (res.result) {
      setAccountPoint(res.result);
    }
  };

  const getAccountRefferalsTVLFunc = async () => {
    if (!address) return;
    const res = await getAccountRefferalsTVL(address);
    console.log("referrer", res);
    if (res.result) {
      setReferrersTvl(res.result);
    }
  };

  const getAccounTvlFunc = async () => {
    if (!address) return;
    const res = await getAccounTvl(address);

    console.log("account tvl", res);
  };

  const getAccountTvlFunc = async () => {
    if (!address) return;

    const res = await getAccountTvl(address);
    console.log("account tvl", res);

    const { result } = res;
    let data = [];
    if (result && Array.isArray(result) && result.length > 0) {
      data = result;
    }
    setAccountTvlData(data);

    let usd = 0;
    data.forEach((item) => {
      usd += +item?.tvl;
    });

    setStakingUsdValue(usd);
  };

  const getTotalTvlByTokenFunc = async () => {
    const res = await getTotalTvlByToken();

    const { result } = res;
    let arr = [];
    if (result && Array.isArray(result) && result.length > 0) {
      arr = result;
    }
    setTotalTvlList(arr);
  };

  const getGroupTvlFunc = async () => {
    if (!address) return;
    const res = await getGroupTvl(address);
    setGroupTvl(res?.result || 0);
  };

  const getReferralTvlFunc = async () => {
    if (!address) return;
    const res = await getReferralTvl(address);
    setReferralTvl(res?.result || 0);
  };

  const getSupportTokensFunc = async () => {
    const res = await getSupportTokens();
    console.log("support tokens", res);
    if (res && Array.isArray(res)) {
      setSupportTokens(res);
    }
  };

  const getTotalTvlFunc = async () => {
    const res = await getTotalTvl();
    console.log("total tvl", res);

    setTotalTvl(res?.result || 0);
  };

  useEffect(() => {
    const num = Number(groupTvl);

    let arr = BOOST_LIST.map((item, index) => {
      let progress = 0;
      let prevValue = index === 0 ? 0 : BOOST_LIST[index - 1].value;
      if (num > prevValue) {
        progress = num / item.value;
        progress = progress > 1 ? 1 : progress;
      }
      let obj = {
        ...item,
        isActive: num > item.value,
        progress,
      };

      return obj;
    });

    console.log("progress list", arr);

    setProgressList(arr);
  }, [groupTvl]);

  const getEthUsdPrice = async () => {
    const tokenList = await getExplorerTokenTvl(true);

    const ethToken = tokenList.find((item) => item.symbol === "ETH");
    console.log("ethToken", ethToken);
    if (ethToken) {
      const res = await getTokenPrice(ethToken.l2Address);
      console.log("usdPrice", res.usdPrice);
      setEthUsdPrice(+res.usdPrice || 0);
    }
  };

  useEffect(() => {
    let ethValue =
      +stakingUsdValue !== 0 && +ethUsdPrice !== 0
        ? stakingUsdValue / ethUsdPrice
        : 0;

    if (
      accountTvlData.length === 1 &&
      accountTvlData[0].symbol.toLocaleUpperCase() === "ETH"
    ) {
      ethValue = +accountTvlData[0].amount;
    }

    // console.log("stakingEth", ethValue, stakingUsdValue, ethUsdPrice);
    setStakingEthValue(ethValue);
  }, [ethUsdPrice, stakingUsdValue, accountTvlData]);

  const handleMintNow = useCallback(() => {
    if (nft || fetchLoading) {
      return;
    } else {
      mintModal.onOpen();
    }
  }, [mintModal, nft, fetchLoading]);

  const handleMint = useCallback(async () => {
    if (!address) return;
    if (isInvaidChain) {
      switchChain(
        { chainId: NOVA_CHAIN_ID },
        {
          onError: (e) => {
            console.log(e);
            addNovaChain().then(() => switchChain({ chainId: NOVA_CHAIN_ID }));
          },
        }
      );
      return;
    }
    if (nft) {
      toast.error("You can mint SBT only once.");
      return;
    }
    try {
      await sendMintTx(address, mintType);
      mintModal.onClose();
      toast.success("Successfully minted SBT!");
    } catch (e: any) {
      console.log(e);
      if (e.message) {
        if (e.message.includes("User rejected the request")) {
          toast.error("User rejected the request");
        } else if (e.message.includes("You already have a character")) {
          toast.error("You can mint SBT only once.");
        } else {
          toast.error(e.message);
        }
      } else {
        toast.error("Mint SBT failed");
      }
    }
  }, [
    address,
    isInvaidChain,
    nft,
    switchChain,
    sendMintTx,
    mintType,
    mintModal,
  ]);

  /**
   * Init: Get data from server
   */
  useEffect(() => {
    getEthUsdPrice();
    getSupportTokensFunc();
    getTotalTvlByTokenFunc();
    getAccountPointFunc();
    getAccountRefferalsTVLFunc();
    getAccounTvlFunc();
    getAccountTvlFunc();
    getGroupTvlFunc();
    getReferralTvlFunc();
    getTotalTvlFunc();
  }, [address]);

  useEffect(() => {
    /**
     * return home page if not active
     */
    if (!isConnected || !invite?.twitterHandler) {
      navigatorTo("/");
    }
  }, [isConnected, invite]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showTooltip1, setShowTooltip1] = useState(false);
  const [showTooltip2, setShowTooltip2] = useState(false);
  const [showTooltip3, setShowTooltip3] = useState(false);
  const [showTooltip4, setShowTooltip4] = useState(false);
  const [showTooltip5, setShowTooltip5] = useState(false);
  const [showTooltip6, setShowTooltip6] = useState(false);
  return (
    <BgBox>
      <BgCoverImg />
      <a href={`https://explorer.zklink.io/address/${address}`} target="_blank">
        <div className="absolute md:w-full md:text-center top-[5rem] md:py-[0.5rem] py-[1rem] text-[1rem] bg-[#226959] z-10 md:px-[6.125rem] md:mx-0 px-[1rem] mx-3 rounded">
          <span className="text-[#03d498]">
            Balance and Nova Points may update later. Click here to check your
            balance.
          </span>
        </div>
      </a>

      {isLoading && <Loading />}

      <div className="relative md:flex gap-[1.5rem] md:px-[4.75rem] px-[1rem] z-[1] pt-[3rem]">
        {/* Left: nova points ... data */}
        <div className="md:w-[27.125rem]">
          <CardBox className="flex flex-col gap-[1.5rem] items-center p-[1.5rem]">
            <p className="w-full text-[1rem] font-[700] text-[1rem] leading-[1.5rem] tracking-[0.06rem]">
              Your Nova Character
            </p>
            <div className="md:w-[24rem] md:h-[18.75rem] bg-[#65E7E5] rounded-[1rem]">
              <img
                src={nft?.image ?? "/img/img-mint-example.png"}
                className="text-center block mx-auto h-auto rounded-[1rem]"
              />
            </div>
            <Tooltip content={nft ? "coming soon" : ""} isOpen={showTooltip1}>
              <Button
                onClick={handleMintNow}
                onMouseEnter={() => nft && setShowTooltip1(true)}
                onMouseLeave={() => nft && setShowTooltip1(false)}
                onTouchStart={() => nft && setShowTooltip1((prev) => !prev)}
                isLoading={fetchLoading || mintLoading}
                className={classNames(
                  "gradient-btn w-full py-[1rem] flex justify-center items-center gap-[0.38rem] text-[1.25rem] ",
                  nft ? "opacity-40 " : "opacity-100",
                  nft ? "cursor-default" : "cursor-pointer"
                )}
              >
                <span>{nft ? "Upgrade" : "Mint Now"}</span>
                {nft ? (
                  <img
                    src="/img/icon-info.svg"
                    className="w-[0.875rem] h-[0.875rem]"
                  />
                ) : (
                  ""
                )}
              </Button>
            </Tooltip>
          </CardBox>

          {/* // TODO update nova points style */}
          {/* <CardBox className="mt-[1.5rem] p-[1.5rem] bg">
              <p className="w-full text-[1rem] font-[700] text-[1rem] leading-[1.5rem] tracking-[0.06rem]">
                Nova Points
              </p>
              <div className="py-[0.7rem] ml-[4rem] text-[2.5rem] font-[700]">
                {formatNumberWithUnit(
                  (+accountPoint.novaPoint || 0) +
                    (+accountPoint.referPoint || 0)
                )}
              </div>
              <p className="text-[1rem] pr-4 opacity-60">
                Don't worry, we are synchronizing Nova Points. Your Nova Points
                will be updated after the syncing process has ended.
              </p>
            </CardBox> */}

          <CardBox className="mt-[1.5rem] p-[1.5rem]">
            <p className="w-full text-[1rem] font-[700] text-[1rem] leading-[1.5rem] tracking-[0.06rem]">
              Nova Points
            </p>

            <div className="flex items-center gap-[1rem]">
              <span className="text-[2.5rem] font-[700]">
                {formatNumberWithUnit(
                  (+accountPoint.novaPoint || 0) +
                    (+accountPoint.referPoint || 0)
                )}
              </span>
              <Tooltip
                className="p-[1rem]"
                isOpen={showTooltip2}
                content={
                  <p className="text-[1rem]">
                    {getBooster(groupTvl) !== 0 &&
                      `Group Booster: ${getBooster(groupTvl)}x`}
                    <br />
                    Early Bird Booster: 2x <br />
                    <br />
                    <a
                      href="https://blog.zk.link/aggregation-parade-7997d31ca8e1"
                      target="_blank"
                      className="text-[#0bc48f]"
                    >
                      Learn More
                    </a>
                  </p>
                }
              >
                <GreenTag
                  className="py-[0.375rem] w-[5.625rem] text-[1rem]"
                  onMouseEnter={() => setShowTooltip2(true)}
                  onMouseLeave={() => setShowTooltip2(false)}
                  onTouchStart={() => setShowTooltip2((prev) => !prev)}
                >
                  {getBooster(groupTvl) * 2}x
                </GreenTag>
              </Tooltip>
            </div>
            {/* TODO: Est. in next epoch */}
            {/* <p className="w-full text-[1rem] font-[700] text-[1rem] leading-[1.5rem] tracking-[0.06rem]">
                +{accountPoint.referPoint}
              </p>
              <p className="text-[1rem] text-[#919192] font-[400]">
                Est. in next epoch
              </p> */}

            <p className="flex justify-between items-center mt-[3rem] font-[400] text-[1rem] leading-[1.5rem] tracking-[0.06rem] text-[#919192]">
              <div className="flex items-center gap-[0.5rem]">
                <span>Earned By Your Deposit</span>

                <Tooltip
                  className="p-[1rem]"
                  isOpen={showTooltip}
                  content={
                    <p className="text-[1rem] max-w-[25rem] gap-[0.5rem]">
                      This includes the initial deposit rewards as well as the
                      ongoing rewards for holding (snapshot every 8 hours).
                    </p>
                  }
                >
                  <img
                    src="/img/icon-info.svg"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    onTouchStart={() => setShowTooltip((prev) => !prev)}
                    className="w-[0.875rem] h-[0.875rem] opacity-40"
                  />
                </Tooltip>
              </div>
              <span>{formatNumberWithUnit(accountPoint.novaPoint)}</span>
            </p>
            <p className="flex justify-between items-center mt-[1rem] font-[400] text-[1rem] leading-[1.5rem] tracking-[0.06rem] text-[#919192]">
              <div className="flex items-center gap-[0.5rem]">
                <span>Earned By Referring Friends</span>

                <Tooltip
                  className="p-[1rem]"
                  isOpen={showTooltip3}
                  content={
                    <p className="text-[1rem] max-w-[25rem] gap-[0.5rem]">
                      The referral rewards will be updated every 8 hours along
                      with the deposit rewards.
                    </p>
                  }
                >
                  <img
                    onMouseEnter={() => setShowTooltip3(true)}
                    onMouseLeave={() => setShowTooltip3(false)}
                    onTouchStart={() => setShowTooltip3((prev) => !prev)}
                    src="/img/icon-info.svg"
                    className="w-[0.875rem] h-[0.875rem] opacity-40"
                  />
                </Tooltip>
              </div>
              <span>{formatNumberWithUnit(accountPoint.referPoint)}</span>
            </p>
          </CardBox>

          <CardBox className="flex flex-col items-center mt-[1.5rem] p-[1.5rem]">
            <p className="w-full text-[1rem] font-[700] text-[1rem] leading-[1.5rem] tracking-[0.06rem] flex justify-between items-center">
              <span>Your Staking Value</span>
              <Button
                size="sm"
                className="bg-[#0BC48F] text-[#000] text-[1rem]"
                onClick={() => setIsStakingUsd(!isStakingUsd)}
              >
                Switch To {isStakingUsd ? "ETH" : "USD"}
              </Button>
            </p>
            <p className="w-full text-[2.5rem] font-[700]">
              {isStakingUsd
                ? `${formatNumberWithUnit(stakingUsdValue, "$")}`
                : `${formatNumberWithUnit(stakingEthValue, "ETH")}`}
            </p>
            <GradientButton
              className="w-full mt-[1.5rem] py-[1rem] text-[1.25rem] cursor-pointer"
              onClick={() => handleBridgeMore("ETH")}
            >
              Bridge More
            </GradientButton>
          </CardBox>
        </div>

        <div className="md:w-full maxWid">
          <div className="md:flex md:gap-[1.5rem]">
            <CardBox className="md:flex md:justify-around  md:py-[3rem] md:px-0 md:w-1/2 md:my-0 my-[1rem] p-3">
              <div className="mb-3  md:mb-0">
                <p className="text-[1.5rem] leading-[2rem] md:text-center text-left">
                  {formatNumberWithUnit(totalTvl, "$")}
                </p>
                <p className="mt-[1rem] text-[1rem] leading-[rem] md:text-center text-left text-[#7E7E7E]">
                  Nova Network TVL
                </p>
              </div>
              <div>
                <p className="text-[1.5rem] leading-[2rem] md:text-center text-left">
                  {formatNumberWithUnit(groupTvl, "ETH")}
                </p>
                <p className="mt-[1rem] text-[1rem] leading-[rem] md:text-center text-left text-[#7E7E7E]">
                  Group TVL
                </p>
              </div>
            </CardBox>
            <CardBox className="md:flex md:justify-around md:py-[3rem] md:px-0 md:w-1/2 md:my-0 my-[1rem] p-3">
              <div className="mb-3  md:mb-0">
                <p className="text-[1.5rem] leading-[2rem]  md:text-center text-left">
                  {formatNumberWithUnit(referralTvl, "ETH")}
                </p>
                <p className="mt-[1rem] text-[1rem] leading-[rem]  md:text-center text-left text-[#7E7E7E]">
                  Referral TVL
                </p>
              </div>
              <div>
                <p className="text-[1.5rem] leading-[2rem] text-center flex items-center gap-[0.38rem] ">
                  <span>{invite?.code || "-"}</span>
                  <img
                    src="/img/icon-copy.svg"
                    className="w-[1.1875rem] h-[1.1875rem] cursor-pointer"
                    onClick={() => handleCopy()}
                  />
                  <a
                    href={`https://twitter.com/intent/tweet?text=${getTweetShareText(
                      invite?.code ?? ""
                    )}`}
                    className="gradient-btn px-4 ml-6 hover:opacity-85"
                    data-show-count="false"
                    target="_blank"
                  >
                    Share on Twitter
                  </a>
                </p>
                <p className="mt-[1rem] text-[1rem] leading-[rem] text-center text-[#7E7E7E] flex items-center gap-[0.5rem]">
                  Your Invite Code (Remaining {invite?.canInviteNumber || 0})
                  <Tooltip
                    className="p-[1rem]"
                    isOpen={showTooltip4}
                    content={
                      <p className="text-[1rem] max-w-[25rem]">
                        In the later phase, we might consider raising the spots
                        to the referral code; it is crucial to have the cap here
                        at the start to allow all participants an equal chance
                        of growing their group's size.
                      </p>
                    }
                  >
                    <img
                      onMouseEnter={() => setShowTooltip4(true)}
                      onMouseLeave={() => setShowTooltip4(false)}
                      onTouchStart={() => setShowTooltip4((prev) => !prev)}
                      src="/img/icon-info.svg"
                      className="w-[0.875rem] h-[0.875rem] opacity-40"
                    />
                  </Tooltip>
                </p>
              </div>
            </CardBox>
          </div>

          {/* Group Milestone */}
          <div className="mt-[2rem]">
            <div className="md:flex md:justify-between items-center leading-[2rem] font-[700]">
              <div className="flex items-center gap-[0.37rem]">
                <span className="text-[1.5rem]">Group Milestone</span>
                <Tooltip
                  className="px-[1rem] py-[1rem]"
                  isOpen={showTooltip5}
                  content={
                    <p className="text-[1rem]">
                      You will get a higher group booster if your group unlocks
                      higher TVL milestones.{" "}
                      <a
                        href="https://blog.zk.link/aggregation-parade-7997d31ca8e1"
                        target="_blank"
                        className="text-[#0bc48f]"
                      >
                        Learn more.
                      </a>
                    </p>
                  }
                >
                  <img
                    onMouseEnter={() => setShowTooltip5(true)}
                    onMouseLeave={() => setShowTooltip5(false)}
                    onTouchStart={() => setShowTooltip5((prev) => !prev)}
                    src="/img/icon-info.svg"
                    className="w-[0.875rem] h-[0.875rem]"
                  />
                </Tooltip>
              </div>

              <div className="flex items-center">
                <span className="text-[1rem]">Next Milestone</span>
                <GradientText className="ml-[0.5rem] text-[1rem]">
                  {getNextMilestone(groupTvl)} ETH
                </GradientText>

                {/* <img
                                  src='/img/icon-info.svg'
                                  className='ml-[0.38rem] w-[0.875rem] h-[0.875rem]'
                              /> */}
              </div>
            </div>

            <CardBox className="mt-[2rem] py-[1.5rem] pl-[1.5rem] pr-[3rem] overflow-x-auto">
              <ProgressBar className="progress-bar flex w-[40rem] md:w-full">
                <div className="title">Target/Boost</div>

                {progressList.map((item, index) => (
                  <div
                    className={`progress-item w-1/5 ${
                      item.isActive ? "active" : ""
                    } `}
                    key={index}
                  >
                    <div
                      className="inner-bar absolute left-0 top-0 h-full"
                      style={{ width: `${item.progress * 100}%` }}
                    ></div>

                    <div className="progress-points">
                      <div className="points-top">{item.booster}x</div>
                      <div className="points-bottom">{item.value} ETH</div>
                    </div>
                  </div>
                ))}
              </ProgressBar>
            </CardBox>
          </div>

          <div className="mt-[2rem]">
            {/* Tabs btn: Assets | Trademark NFTs | Referral  */}
            <TabsBox className="flex items-center gap-[1.5rem] overflow-x-auto">
              <span
                className={`tab-item whitespace-nowrap ${
                  tabsActive === 0 ? "active" : ""
                }`}
                onClick={() => setTabsActive(0)}
              >
                Assets
              </span>
              <span
                className={`tab-item whitespace-nowrap ${
                  tabsActive === 1 ? "active" : ""
                }`}
                onClick={() => setTabsActive(1)}
              >
                Trademark NFTs
              </span>

              <div
                className={`tab-item whitespace-nowrap relative flex items-center gap-[0.5rem] ${
                  tabsActive === 2 ? "active" : ""
                }`}
                onClick={() => setTabsActive(2)}
              >
                <span>Referral</span>
              </div>
            </TabsBox>

            {/* Tabs view: Assets */}
            {tabsActive === 0 && (
              <AssetsTable
                supportTokens={supportTokens}
                totalTvlList={totalTvlList}
                accountTvlData={accountTvlData}
              />
            )}
            {/* Tabs view: Trademark NFTs */}
            {tabsActive === 1 && (
              <CardBox className="flex flex-col justify-center items-center mt-[2rem] py-[10rem]">
                <p className="text-[1rem] text-center mb-[1rem] font-[700]">
                  Coming Soon
                </p>
                <div className="flex">
                  <img
                    style={{ width: 80 }}
                    src="/img/logoAlien.svg"
                    className="w-[9.375rem] h-[9.375rem] mr-[2rem]"
                  />
                  <img
                    style={{ width: 80 }}
                    src="/img/icon-okx-web3.svg"
                    className="w-[9.375rem] h-[9.375rem]"
                  />
                </div>
              </CardBox>
            )}
            {/* Tabs view: Referral */}
            {tabsActive === 2 && (
              <CardBox className="mt-[2rem] min-h-[30rem]">
                <ReferralList
                  data={referrersTvlList}
                  ethUsdPrice={ethUsdPrice}
                />
              </CardBox>
            )}
          </div>
        </div>
      </div>
      <Modal
        classNames={{ closeButton: "text-[1.5rem]" }}
        style={{ minHeight: "600px" }}
        size="2xl"
        isOpen={bridgeModal.isOpen}
        onOpenChange={bridgeModal.onOpenChange}
      >
        <ModalContent className="mt-[2rem] mb-[5.75rem]">
          {(onClose) => (
            <>
              <ModalHeader>Bridge</ModalHeader>
              <ModalBody className="pb-8">
                <BridgeComponent bridgeToken={bridgeToken} onClose={onClose} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        classNames={{ closeButton: "text-[1.5rem]" }}
        size="4xl"
        isOpen={mintModal.isOpen}
        onOpenChange={mintModal.onOpenChange}
      >
        <ModalContent className="mt-[2rem] py-5 px-6 mb-[5.75rem]">
          <ModalHeader className="px-0 pt-0 flex flex-col text-xl font-normal">
            Select and mint your favorite SBT
          </ModalHeader>
          <div className="flex items-center justify-between gap-2 ">
            {["ISTP", "ESFJ", "INFJ", "ENTP"].map((item) => (
              <div
                key={item}
                className={classNames(
                  "cursor-pointer",
                  item === mintType ? "opacity-100" : "opacity-60"
                )}
                onClick={() => setMintType(item as NOVA_NFT_TYPE)}
              >
                <img
                  src={`/img/img-${item}.png`}
                  alt=""
                  className="w-[192px] md:h-[192px]"
                />
              </div>
            ))}
          </div>
          <p className="text-[#A0A5AD] text-xs my-6">
            Upon collecting your SBT, you can upgrade it into an ERC-721 NFT
            through collecting 4 different types of trademark NFT through our
            referral program.
          </p>
          <Button
            onClick={handleMint}
            isDisabled={!isInvaidChain && novaBalance === 0}
            isLoading={mintLoading}
            className="gradient-btn w-full h-[58px] py-[1rem] flex justify-center items-center gap-[0.38rem] text-[1.25rem]  "
          >
            <span>
              {isInvaidChain ? "Switch to Nova network to mint" : "Mint Now"}
            </span>
          </Button>
        </ModalContent>
      </Modal>
    </BgBox>
  );
}
