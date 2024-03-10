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
} from "@/utils";
import ReferralList from "@/components/ReferralList";
import { RootState } from "@/store";
import {
  getAccounTvl,
  getAccountPoint,
  getAccountRefferalsTVL,
  getAccountTvl,
  getGroupTvl,
  getReferralTvl,
  getReferrer,
  getSupportTokens,
  getTotalTvl,
  getTotalTvlByToken,
} from "@/api";
import { useAccount, useChainId, useBalance, useSwitchChain } from "wagmi";
import toast from "react-hot-toast";
import { ETH_ADDRESS, NOVA_CHAIN_ID } from "@/constants";
import useNovaNFT, { NOVA_NFT_TYPE } from "@/hooks/useNFT";
import classNames from "classnames";
import { useSelector } from "react-redux";
// import { AiFillQuestionCircle } from 'react-icons/ai'

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

    &.active,
    .active {
      border-radius: 0.5rem;
      background: linear-gradient(
        90deg,
        #48ecae 0%,
        #3e52fc 51.07%,
        #49ced7 100%
      );
      &:not(:last-child)::after {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        right: -1.5rem;
        width: 2rem;
        height: 0.5rem;
        border-radius: 0.5rem;
        background: #49ced7;
        z-index: 11;
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

export default function Dashboard() {
  const { invite } = useSelector((store: RootState) => store.airdrop);
  const { address } = useAccount();
  // const address = '0x01568BDFBFdDB3B3756b0c1C89F0A1d63354789D'

  const [tabsActive, setTabsActive] = useState(0);

  const [totalTvlList, setTotalTvlList] = useState([]);
  const [stakingValue, setStakingValue] = useState({
    usd: 0,
    eth: 0,
  });
  const [isStakingUsd, setIsStakingUsd] = useState(false);
  const [accountPoint, setAccountPoint] = useState({
    novaPoint: 0,
    referPoint: 0,
  });
  const [referrersTvlList, setReferrersTvl] = useState([]);
  const [bridgeToken, setBridgeToken] = useState("");
  const bridgeModal = useDisclosure();
  const mintModal = useDisclosure();
  const [accountTvlData, setAccountTvlData] = useState([]);
  const [groupTvl, setGroupTvl] = useState(0);
  const [totalTvl, setTotalTvl] = useState(0);
  const [referralTvl, setReferralTvl] = useState(0);
  const [supportTokens, setSupportTokens] = useState<any[]>([]);
  const chainId = useChainId();
  const { nft, loading: mintLoading, sendMintTx } = useNovaNFT();
  const [mintType, setMintType] = useState<NOVA_NFT_TYPE>("ISTP");
  const { switchChain } = useSwitchChain();

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
    setAccountTvlData(res?.result || []);

    if (res?.result?.length && Array.isArray(res.result)) {
      let usd = 0;
      let eth = 0;
      res.result.forEach((item) => {
        usd += +item?.tvl;
        eth += +item?.amount;
      });

      setStakingValue({
        usd,
        eth,
      });
    }
  };

  const getTotalTvlByTokenFunc = async () => {
    const res = await getTotalTvlByToken();

    console.log("total tvl", res);

    setTotalTvlList(res?.result || []);
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

  const [progressList, setProgressList] = useState<any[]>([]);

  useEffect(() => {
    let isShow = false;
    let isShowIndex = 0;

    let arr = BOOST_LIST.map((item, index) => {
      const isActive = +groupTvl > +item.value;
      if (!isActive && !isShow) {
        isShow = true;
        isShowIndex = index;
      }

      let obj = {
        ...item,
        isActive,
        showProgress: false,
        progress: +groupTvl !== 0 ? +groupTvl / item.value : 0,
      };

      return obj;
    });

    arr[isShowIndex].showProgress = true;

    setProgressList(arr);
  }, [groupTvl]);

  useEffect(() => {
    getSupportTokensFunc();
    getTotalTvlByTokenFunc();
    getAccountPointFunc();
    getAccountRefferalsTVLFunc();
    getAccounTvlFunc();
    getAccountTvlFunc();
    getGroupTvlFunc();
    getReferralTvlFunc();
    getTotalTvlFunc();
  }, []);

  const handleMintNow = useCallback(() => {
    if (nft) {
      return;
    } else {
      mintModal.onOpen();
    }
  }, [mintModal, nft]);

  const handleMint = useCallback(async () => {
    if (!address) return;
    if (isInvaidChain) {
      switchChain(
        { chainId: NOVA_CHAIN_ID },
        {
          onError: (e) => {
            console.log(e);
          },
        }
      );
      return;
    }
    try {
      await sendMintTx(address, mintType);
      mintModal.onClose();
      toast.success("Successfully minted SBT!");
    } catch (e) {
      console.log(e);
      toast.error("Mint SBT failed");
    }
  }, [address, isInvaidChain, switchChain, sendMintTx, mintType, mintModal]);

  return (
    <BgBox>
      <BgCoverImg />
      <div className="relative flex gap-[1.5rem] px-[4.75rem] z-[1]">
        <div className="w-[27.125rem]">
          <CardBox className="flex flex-col gap-[1.5rem] items-center p-[1.5rem]">
            <p className="w-full text-[1rem] font-[700] text-[1rem] leading-[1.5rem] tracking-[0.06rem]">
              Your Nova Character
            </p>
            <div className="w-[24rem] h-[18.75rem] bg-[#65E7E5] rounded-[1rem]">
              <img
                src={nft?.image ?? "/img/icon-nft-blue.svg"}
                className="text-center block mx-auto h-full"
              />
            </div>
            <GradientButton
              onClick={handleMintNow}
              className={classNames(
                "w-full py-[1rem] flex justify-center items-center gap-[0.38rem] text-[1.25rem] ",
                nft ? "opacity-40 " : "opacity-100",
                nft ? "cursor-default" : "cursor-pointer"
              )}
            >
              <span>{nft ? "Upgrade" : "Mint Now"}</span>
              <img
                src="/img/icon-info.svg"
                className="w-[0.875rem] h-[0.875rem]"
              />
            </GradientButton>
          </CardBox>

          <CardBox className="mt-[1.5rem] p-[1.5rem]">
            <p className="w-full text-[1rem] font-[700] text-[1rem] leading-[1.5rem] tracking-[0.06rem]">
              Nova Points
            </p>
            <div className="flex items-center gap-[1rem]">
              <span className="text-[2.5rem] font-[700]">
                {(+accountPoint.novaPoint || 0) +
                  (+accountPoint.referPoint || 0)}
              </span>
              <Tooltip
                className="p-[1rem]"
                content={
                  <p className="text-[1rem]">
                    {getBooster(groupTvl) !== "0x" &&
                      `Group Booster: ${getBooster(groupTvl)}`}{" "}
                    <br />
                    Early Bird Booster: 2x <br />
                    <br />
                    <a href="" className="text-[#0bc48f]">
                      Learn More
                    </a>
                  </p>
                }
              >
                <GreenTag className="py-[0.375rem] w-[5.625rem] text-[1rem]">
                  0x
                </GreenTag>
              </Tooltip>
            </div>
            {/* <p className="w-full text-[1rem] font-[700] text-[1rem] leading-[1.5rem] tracking-[0.06rem]">
              +{accountPoint.referPoint}
            </p>
            <p className="text-[1rem] text-[#919192] font-[400]">
              Est. in next epoch
            </p> */}

            <p className="flex justify-between items-center mt-[3rem] font-[400] text-[1rem] leading-[1.5rem] tracking-[0.06rem] text-[#919192]">
              <span>Earn By Your Deposit</span>
              <span>{accountPoint.novaPoint}</span>
            </p>
            <p className="flex justify-between items-center mt-[1rem] font-[400] text-[1rem] leading-[1.5rem] tracking-[0.06rem] text-[#919192]">
              <span>Earn By Referring Friends</span>
              <span>{accountPoint.referPoint}</span>
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
                Switch to {isStakingUsd ? "ETH" : "USD"}
              </Button>
            </p>
            <p className="w-full text-[2.5rem] font-[700]">
              {isStakingUsd
                ? `$${formatNumberWithUnit(stakingValue.usd)}`
                : `${formatNumberWithUnit(stakingValue.eth)} ETH`}
            </p>
            <GradientButton
              className="w-full mt-[1.5rem] py-[1rem] text-[1.25rem]"
              onClick={() => handleBridgeMore()}
            >
              Bridge More
            </GradientButton>
          </CardBox>
        </div>
        <div className="w-full">
          <div className="flex gap-[1.5rem]">
            <CardBox className="flex justify-around  py-[3rem] w-1/2">
              <div>
                <p className="text-[1.5rem] leading-[2rem] text-center">
                  ${formatNumberWithUnit(totalTvl)}
                </p>
                <p className="mt-[1rem] text-[1rem] leading-[rem] text-center text-[#7E7E7E]">
                  Nova Network TVL
                </p>
              </div>
              <div>
                <p className="text-[1.5rem] leading-[2rem] text-center">
                  {formatNumberWithUnit(groupTvl) || 0} ETH
                </p>
                <p className="mt-[1rem] text-[1rem] leading-[rem] text-center text-[#7E7E7E]">
                  Group TVL
                </p>
              </div>
              {/* <div>
                                <p className='text-[1.5rem] leading-[2rem] text-center'>{getBooster(groupTvl)}</p>
                                <p className='mt-[1rem] text-[1rem] leading-[rem] text-center text-[#7E7E7E] flex items-center gap-[0.25rem]'>
                                    <span>Group 24h Growth/Boost Rate</span>
                                    <Tooltip
                                        className='p-[1rem]'
                                        content={
                                            <p className='text-[1rem]'>
                                                Your group’s Growth Booster is dependent on your group’s cumulative TVL growth rate over the past 24
                                                hours.{' '}
                                                <a
                                                    href=''
                                                    className='text-[#0bc48f]'>
                                                    Learn more.
                                                </a>
                                            </p>
                                        }>
                                        <img
                                            src='/img/icon-info.svg'
                                            className='w-[0.875rem] h-[0.875rem] opacity-40'
                                        />
                                    </Tooltip>
                                </p>
                            </div> */}
            </CardBox>
            <CardBox className="flex justify-around py-[3rem] w-1/2">
              <div>
                <p className="text-[1.5rem] leading-[2rem] text-center">
                  {formatNumberWithUnit(referralTvl)} ETH
                </p>
                <p className="mt-[1rem] text-[1rem] leading-[rem] text-center text-[#7E7E7E]">
                  Referral TVL
                </p>
              </div>
              <div>
                <p
                  className="text-[1.5rem] leading-[2rem] text-center flex items-center gap-[0.38rem] cursor-pointer"
                  onClick={() => handleCopy()}
                >
                  <span>{invite?.code || "-"}</span>
                  <img
                    src="/img/icon-copy.svg"
                    className="w-[1.1875rem] h-[1.1875rem]"
                  />
                </p>
                <p className="mt-[1rem] text-[1rem] leading-[rem] text-center text-[#7E7E7E] flex items-center gap-[0.5rem]">
                  Your Invite Code (Remaining {invite?.canInviteNumber || 0})
                  <Tooltip
                    className="p-[1rem]"
                    content={
                      <p className="text-[1rem] max-w-[25rem]">
                        In the later phase, we might consider raising the spots
                        to the referral code; it is crucial to have the cap here
                        at the start to allow all participants an equal chance
                        of of growing their group's size.
                      </p>
                    }
                  >
                    <img
                      src="/img/icon-info.svg"
                      className="w-[0.875rem] h-[0.875rem] opacity-40"
                    />
                  </Tooltip>
                </p>
              </div>
            </CardBox>
          </div>

          <div className="mt-[2rem]">
            <div className="flex justify-between items-center leading-[2rem] font-[700]">
              <div className="flex items-center gap-[0.37rem]">
                <span className="text-[1.5rem]">Group Mile Stone</span>
                <Tooltip
                  className="px-[1rem] py-[1rem]"
                  content={
                    <p className="text-[1rem]">
                      You will get a higher group booster if your group unlocks
                      higher TVL milestones.{" "}
                      <a href="" className="text-[#0bc48f]">
                        Learn more.
                      </a>
                    </p>
                  }
                >
                  <img
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

            <CardBox className="mt-[2rem] py-[1.5rem] pl-[1.5rem] pr-[3rem]">
              <ProgressBar className="progress-bar flex w-full">
                <div className="title">Target/Boost</div>

                {progressList.map((item, index) => (
                  <div
                    className={`progress-item w-1/5 ${
                      groupTvl > item.value ? "active" : "not-active-1"
                    } `}
                    key={index}
                  >
                    {item.showProgress && (
                      <div
                        className="bar absolute left-0 top-0 buttom-0 h-full active"
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    )}
                    <div className="progress-points">
                      {/* <div>{groupTvl}  {item.value} {groupTvl / item.value}</div> */}
                      <div className="points-top">{item.booster}</div>
                      <div className="points-bottom">{item.value} ETH</div>
                    </div>
                  </div>
                ))}
              </ProgressBar>
            </CardBox>
          </div>

          <div className="mt-[2rem]">
            <TabsBox className="flex items-center gap-[1.5rem]">
              <span
                className={`tab-item ${tabsActive === 0 ? "active" : ""}`}
                onClick={() => setTabsActive(0)}
              >
                Assets
              </span>
              <span
                className={`tab-item ${tabsActive === 1 ? "active" : ""}`}
                onClick={() => setTabsActive(1)}
              >
                Trademark NFTs
              </span>

              <div
                className={`tab-item relative flex items-center gap-[0.5rem] ${
                  tabsActive === 2 ? "active" : ""
                }`}
                onClick={() => setTabsActive(2)}
              >
                <span>Referral</span>

                {/* <span
                                    className='referral-info'
                                    data-tooltip-id='referral-tooltip'
                                    data-tooltip-content='For every 3 referrals you made; you are eligible to mint a trademark NFT'>
                                    <AiFillQuestionCircle />
                                </span> */}
              </div>
            </TabsBox>

            {tabsActive === 0 && (
              <AssetsTable
                supportTokens={supportTokens}
                totalTvlList={totalTvlList}
                data={accountTvlData}
              />
            )}
            {tabsActive === 1 && (
              <CardBox className="flex flex-col justify-center items-center mt-[2rem] py-[10rem]">
                <p className="text-[1rem] text-center mb-[1rem] font-[700]">
                  Rarible Market Coming Soon
                </p>
                <img
                  src="/img/icon-placeholder.svg"
                  className="w-[9.375rem] h-[9.375rem]"
                />
              </CardBox>
            )}
            {tabsActive === 2 && (
              <CardBox className="mt-[2rem] min-h-[30rem]">
                <ReferralList data={referrersTvlList} />
              </CardBox>
            )}
          </div>
        </div>
      </div>
      <Modal
        style={{ minHeight: "600px" }}
        size="2xl"
        isOpen={bridgeModal.isOpen}
        onOpenChange={bridgeModal.onOpenChange}
      >
        <ModalContent className="mt-[2rem]">
          {(onClose) => (
            <>
              <ModalHeader>Bridge</ModalHeader>
              <ModalBody className="pb-8">
                <BridgeComponent
                  isFirstDeposit={false}
                  bridgeToken={bridgeToken}
                  onClose={onClose}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        size="4xl"
        isOpen={mintModal.isOpen}
        onOpenChange={mintModal.onOpenChange}
      >
        <ModalContent className="mt-[2rem] py-5 px-6">
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
                  className="w-[192px] h-[192px]"
                />
              </div>
            ))}
          </div>
          <p className="text-[#A0A5AD] text-xs my-6">
            Upon collecting your SBT, you can upgrade it into an ERC7221 NFT
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
