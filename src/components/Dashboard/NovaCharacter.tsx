import {
  TRADEMARK_NFT_MARKET_URL,
  LYNKS_NFT_MARKET_URL,
  NOVA_CHAIN_ID,
  MintStatus,
} from "@/constants";
import useNovaNFT, { NOVA_NFT_TYPE } from "@/hooks/useNFT";
import { CardBox } from "@/styles/common";
import { addNovaChain, formatBalance, sleep } from "@/utils";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import classNames from "classnames";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import toast from "react-hot-toast";
import {
  useAccount,
  useBalance,
  useCall,
  useChainId,
  useSwitchChain,
} from "wagmi";
import { config } from "@/constants/networks";
import { getRemainDrawCount, drawTrademarkNFT, postNFTLashin } from "@/api";
import styled from "styled-components";
import DrawAnimation from "../DrawAnimation";
import OldestFriendsDrawAnimation from "../DrawAnimation/OldestFriends";
import useNovaDrawNFT, { TrademarkMintParams } from "@/hooks/useNovaNFT";
import { useMintStatus } from "@/hooks/useMintStatus";
import { eventBus } from "@/utils/event-bus";
import { Abi } from "viem";
import useOldestFriendsStatus from "@/hooks/useOldestFriendsStatus";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { getPointsRewardsTooltips } from "./PointsRewardsTooltips";

export const TxResult = styled.div`
  .statusImg {
    width: 128px;
    margin-top: 20px;
    margin-left: calc(50% - 64px);
    margin-bottom: 23px;
  }
  .statusBtn {
    transform: scale(3.5);
    background: transparent;
    margin-top: 50px;

    margin-bottom: 50px;
  }
  .inner {
    color: #a0a5ad;
    text-align: center;
    font-family: Satoshi;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 32px; /* 133.333% */
    letter-spacing: -0.5px;
    margin-bottom: 23px;
  }
  .view {
    color: #48ecae;
    background: transparent;
    text-align: center;
    font-family: Satoshi;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 32px; /* 133.333% */
    letter-spacing: -0.5px;
    cursor: pointer;
  }
  .inline {
    display: inline;
  }
  .title {
    color: #fff;
    text-align: center;
    font-family: Satoshi;
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    letter-spacing: -0.5px;
    margin-bottom: 16px;
  }
`;
//tokenId from api => image id of frontend
const TRADEMARK_TOKEN_ID_MAP: Record<number, string> = {
  1: "Oak Tree Roots",
  2: "Magnifying Glass",
  3: "Chess Knight",
  4: "Binary Code Metrix Cube",
  6: "+1 Nova points",
  7: "+5 Nova points",
  8: "+10 Nova points",
  9: "+50 Nova points",
  88: "Lynks",
};

const OLDEST_FRIENDS_TOKEN_ID_MAP: Record<number, string> = {
  1: "Oak Tree Roots",
  2: "Magnifying Glass",
  3: "Chess Knight",
  4: "Binary Code Metrix Cube",
  9: "+50 Nova points",
  10: "+100 Nova points",
  88: "Lynks",
};

const getDrawIndexWithPrizeTokenId = (tokenId: number) => {
  return Object.keys(TRADEMARK_TOKEN_ID_MAP).findIndex(
    (key) => Number(key) === tokenId
  );
};

const getOldestFriendsDrawIndexWithPrizeTokenId = (tokenId: number) => {
  return Object.keys(OLDEST_FRIENDS_TOKEN_ID_MAP).findIndex(
    (key) => Number(key) === tokenId
  );
};

export default function NovaCharacter() {
  const mintModal = useDisclosure();
  const drawModal = useDisclosure();
  const trademarkMintModal = useDisclosure();
  const upgradeModal = useDisclosure();
  const oldestFriendsRewardsModal = useDisclosure();
  const { address, chainId } = useAccount();
  // const chainId = useChainId({ config });
  const { switchChain } = useSwitchChain();
  const {
    trademarkNFT,
    sendTrademarkMintTx,
    sendOldestFriendsTrademarkMintTx,
    lynksNFT,
    isTrademarkApproved,
    sendTrademarkApproveTx,
    sendUpgradeSBTTx,
    isApproving,
    publicClient,
  } = useNovaDrawNFT();

  const { refreshBalanceId, updateRefreshBalanceId } = useMintStatus();

  const { nft, loading: mintLoading, sendMintTx, fetchLoading } = useNovaNFT();

  const [mintType, setMintType] = useState<NOVA_NFT_TYPE>("ISTP");
  const [remainDrawCount, setRemainDrawCount] = useState<number>(0);
  const [update, setUpdate] = useState(0);
  const [trademarkMintStatus, setTrademarkMintStatus] = useState<
    MintStatus | undefined
  >();
  const [drawedNftId, setDrawedNftId] = useState<number>();
  const [oldestFriendsDrawedNftId, setOldestFriendsDrawedNftId] =
    useState<number>();
  const [trademarkMintParams, setTrademarkMintParams] = useState<{
    tokenId: number;
    nonce: number;
    signature: string;
    expiry: number;
  }>();
  const [
    oldestFriendsTrademarkMintParams,
    setOldestFriendsTrademarkMintParams,
  ] = useState<{
    tokenId: number;
    nonce: number;
    signature: string;
    expiry: number;
    mintType?: number;
  }>();
  const [drawing, setDrawing] = useState(false);
  const [oldestFriendsDrawing, setOldestFriendsDrawing] = useState(false);
  const drawRef = useRef<{ start: (target: number) => void }>();
  const oldestFriendsDrawRef = useRef<{ start: (target: number) => void }>();
  const [failMessage, setFailMessage] = useState("");
  const [upgradable, setUpgradable] = useState(false);
  const [mintResult, setMintResult] = useState<{ name: string; img: string }>();
  const [lynksBalance, setLynksBalance] = useState(0);
  const [checkingTrademarkUpgradable, setCheckingTrademarkUpgradable] =
    useState(false);
  useEffect(() => {
    console.log("nft: ", nft);
    console.log("upgradable: ", upgradable);
  }, [nft, upgradable]);

  useEffect(() => {
    if (address) {
      getRemainDrawCount(address).then((res) => {
        console.log("remain draw count: ", res);
        const { remainNumber, tokenId } = res.result;
        tokenId && setDrawedNftId(Number(tokenId));
        setRemainDrawCount(remainNumber);
      });
    }
  }, [address, update]);

  const {
    mintable,
    minted,
    getOldestFriendsStatus,
    nftId: oldFriendNftId,
  } = useOldestFriendsStatus();

  useEffect(() => {
    oldFriendNftId && setOldestFriendsDrawedNftId(oldFriendNftId);
  }, [address, oldFriendNftId]);

  useEffect(() => {
    (async () => {
      if (address && trademarkNFT && lynksNFT) {
        const lynksBalance = (await lynksNFT.read.balanceOf([
          address,
        ])) as bigint;
        setLynksBalance(Number(lynksBalance));
        // const trademarkBalances = (await Promise.all(
        //   [1, 2, 3, 4].map((item) =>
        //     trademarkNFT.read.balanceOf([address, item])
        //   )
        // )) as bigint[];
        setCheckingTrademarkUpgradable(true);
        const trademarkBalancesCall = await publicClient?.multicall({
          contracts: [1, 2, 3, 4].map((item) => ({
            address: trademarkNFT.address,
            abi: trademarkNFT.abi as Abi,
            functionName: "balanceOf",
            args: [address, item],
          })),
        });
        const trademarkBalances =
          trademarkBalancesCall?.map(
            (item) => Number(item.result?.toString()) ?? 0
          ) ?? [];
        console.log("trademarkBalances: ", trademarkBalances);
        if (
          // Number(lynksBalance) === 0 &&
          trademarkBalances[0] > 0 &&
          trademarkBalances[1] > 0 &&
          trademarkBalances[2] > 0 &&
          trademarkBalances[3] > 0
        ) {
          setUpgradable(true);
        } else {
          setUpgradable(false);
        }
        setCheckingTrademarkUpgradable(false);
      }
    })();
  }, [address, trademarkNFT, lynksNFT, update, publicClient, refreshBalanceId]);

  const [showTooltip1, setShowTooltip1] = useState(false);

  const isInvaidChain = useMemo(() => {
    return chainId !== NOVA_CHAIN_ID;
  }, [chainId]);

  const { data: nativeTokenBalance } = useBalance({
    config,
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

  const lynksNFTImg = useMemo(() => {
    console.log("nft", nft);

    if (nft) {
      return `/img/img-mystery-box-lynks-${nft.name}.png`;
    } else {
      return `/img/img-mystery-box-lynks-ENTP.png`;
    }
  }, [nft]);

  const handleMintTrademark = useCallback(async () => {
    if (remainDrawCount > 0) {
      drawModal.onOpen(); // for test only
    }
  }, [drawModal, remainDrawCount]);

  const handleDrawAndMint = useCallback(async () => {
    if (!address || remainDrawCount === 0) return;
    if (isInvaidChain) {
      switchChain(
        { chainId: NOVA_CHAIN_ID },
        {
          onError: (e) => {
            console.log(e);
            // addNovaChain().then(() => switchChain({ chainId: NOVA_CHAIN_ID }));
          },
        }
      );
      return;
    }
    if (novaBalance === 0) {
      toast.error("Insuffcient gas for mint transaction.");
      return;
    }

    // 5 - 1 = 4, 5 means no prize. Draw again
    if (!drawedNftId || drawedNftId === 5) {
      setDrawing(true);
      const res = await drawTrademarkNFT(address);
      if (res && res.result) {
        const { tokenId, nonce, signature, expiry } = res.result;
        setTrademarkMintParams({ tokenId, nonce, signature, expiry });
        await drawRef?.current?.start(getDrawIndexWithPrizeTokenId(tokenId)); //do the draw animation; use index of image for active
        // await sleep(2000);
        if (tokenId === 5) {
          // 5 means no prize
          setUpdate((update) => update + 1);
          // return;
        } else if ([6, 7, 8, 9].includes(tokenId)) {
          await sleep(2000);
          setDrawedNftId(undefined);
          //not actual nft. Just points.
          setTrademarkMintStatus(MintStatus.Success);
          setMintResult({
            name: TRADEMARK_TOKEN_ID_MAP[tokenId!],
            img:
              tokenId === 88
                ? lynksNFTImg!
                : `/img/img-trademark-${tokenId}.png`,
          });
          trademarkMintModal.onOpen();
          drawModal.onClose();
          eventBus.emit("getInvite");
        } else {
          setDrawedNftId(tokenId);
        }
      }
      setUpdate((update) => update + 1);
      return; // draw first and then mint as step2.
    }
    let mintParams = { ...trademarkMintParams };

    try {
      //TODO call contract
      trademarkMintModal.onOpen();
      setTrademarkMintStatus(MintStatus.Minting);
      if (!trademarkMintParams) {
        const res = await drawTrademarkNFT(address);
        if (res && res.result) {
          const { tokenId, nonce, signature, expiry } = res.result;
          setTrademarkMintParams({ tokenId, nonce, signature, expiry });
          mintParams = { tokenId, nonce, signature, expiry };
        }
      }
      await sendTrademarkMintTx(mintParams as TrademarkMintParams);
      setTrademarkMintStatus(MintStatus.Success);
      setMintResult({
        name: TRADEMARK_TOKEN_ID_MAP[mintParams.tokenId!],
        img:
          mintParams.tokenId === 88
            ? lynksNFTImg!
            : `/img/img-trademark-${mintParams.tokenId}.png`,
      });
      updateRefreshBalanceId();
    } catch (e: any) {
      console.error(e);
      setTrademarkMintStatus(MintStatus.Failed);
      if (e.message) {
        if (e.message.includes("rejected the request")) {
          setFailMessage("User rejected the request");
        } else {
          setFailMessage(e.message);
        }
      }
    } finally {
      setDrawing(false);
      setDrawedNftId(undefined);
      oldestFriendsRewardsModal.onClose();
    }

    setUpdate((update) => update + 1);
  }, [
    address,
    drawModal,
    drawedNftId,
    isInvaidChain,
    lynksNFTImg,
    novaBalance,
    remainDrawCount,
    sendTrademarkMintTx,
    switchChain,
    trademarkMintModal,
    trademarkMintParams,
    updateRefreshBalanceId,
  ]);

  const handleMintNow = useCallback(() => {
    if (fetchLoading) {
      return;
    } else if (!nft) {
      mintModal.onOpen();
    } else if (upgradable) {
      upgradeModal.onOpen();
    }
  }, [mintModal, nft, fetchLoading, upgradable, upgradeModal]);

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

  const handleUpgrade = useCallback(async () => {
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
      trademarkMintModal.onOpen();
      setTrademarkMintStatus(MintStatus.Minting);
      if (!isTrademarkApproved) {
        await sendTrademarkApproveTx(address);
        toast.success("Congrats! Approve completed!");
      }
      await sendUpgradeSBTTx(address);
      setTrademarkMintStatus(MintStatus.Success);
      setMintResult({
        name: `Lynks - ${nft?.name}`,
        img: `/img/img-${nft?.name}-LYNK.png`,
      });
      updateRefreshBalanceId();
      setUpdate((update) => update + 1);
    } catch (e: any) {
      console.log(e);
      setTrademarkMintStatus(MintStatus.Failed);

      if (e.message) {
        if (e.message.includes("User rejected the request")) {
          setFailMessage("User rejected the request");
        } else {
          setFailMessage(e.message);
        }
      } else {
        toast.error("Upgrade SBT failed");
      }
    } finally {
      upgradeModal.onClose();
    }
  }, [
    address,
    isInvaidChain,
    isTrademarkApproved,
    nft?.name,
    sendTrademarkApproveTx,
    sendUpgradeSBTTx,
    switchChain,
    trademarkMintModal,
    upgradeModal,
    updateRefreshBalanceId,
  ]);

  const nftImage = useMemo(() => {
    if (!nft) {
      return "/img/img-mint-example.png";
    } else if (lynksBalance > 0) {
      return `/img/img-${nft?.name}-LYNK.png`;
    } else {
      return nft.image;
    }
  }, [nft, lynksBalance]);

  const handleOpenOldestFriendsRewards = useCallback(() => {
    oldestFriendsRewardsModal.onOpen();
  }, [oldestFriendsRewardsModal]);

  const handleOldestFriendsRewardsDrawAndMint = useCallback(async () => {
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

    if (novaBalance === 0) {
      toast.error("Insuffcient gas for mint transaction.");
      return;
    }

    // 5 - 1 = 4, 5 means no prize. Draw again
    if (!oldestFriendsDrawedNftId) {
      setOldestFriendsDrawing(true);

      const res = await postNFTLashin(address);
      if (res && res.result) {
        const { tokenId, nonce, signature, expiry, mintType } = res.result;
        setOldestFriendsTrademarkMintParams({
          tokenId,
          nonce,
          signature,
          expiry,
          mintType,
        });
        await oldestFriendsDrawRef?.current?.start(
          getOldestFriendsDrawIndexWithPrizeTokenId(tokenId)
        ); //do the draw animation; use index of image for active
        // await sleep(2000);
        if ([9, 10].includes(tokenId)) {
          await sleep(2000);
          setOldestFriendsDrawedNftId(undefined);
          //not actual nft. Just points.
          setTrademarkMintStatus(MintStatus.Success);
          setMintResult({
            name: OLDEST_FRIENDS_TOKEN_ID_MAP[tokenId!],
            img:
              tokenId === 88
                ? lynksNFTImg!
                : `/img/img-trademark-${tokenId}.png`,
          });
          trademarkMintModal.onOpen();
          oldestFriendsRewardsModal.onClose();
          getOldestFriendsStatus();
          eventBus.emit("getInvite");
        } else {
          setOldestFriendsDrawedNftId(tokenId);
        }

        setUpdate((update) => update + 1);
        return; // draw first and then mint as step2.
      }
    }

    let mintParams = { ...oldestFriendsTrademarkMintParams };

    try {
      //TODO call contract
      trademarkMintModal.onOpen();
      setTrademarkMintStatus(MintStatus.Minting);
      if (!oldestFriendsTrademarkMintParams) {
        const res = await postNFTLashin(address);
        if (res && res.result) {
          const { tokenId, nonce, signature, expiry, mintType } = res.result;
          setOldestFriendsTrademarkMintParams({
            tokenId,
            nonce,
            signature,
            expiry,
            mintType,
          });
          mintParams = { tokenId, nonce, signature, expiry, mintType };
        }
      }
      await sendOldestFriendsTrademarkMintTx(mintParams as TrademarkMintParams);
      setTrademarkMintStatus(MintStatus.Success);
      setMintResult({
        name: OLDEST_FRIENDS_TOKEN_ID_MAP[mintParams.tokenId!],
        img:
          mintParams.tokenId === 88
            ? lynksNFTImg!
            : `/img/img-trademark-${mintParams!.tokenId}.png`,
      });
      updateRefreshBalanceId();
      setOldestFriendsDrawedNftId(undefined);
    } catch (e: any) {
      console.error(e);
      setTrademarkMintStatus(MintStatus.Failed);
      if (e.message) {
        if (e.message.includes("rejected the request")) {
          setFailMessage("User rejected the request");
        } else {
          setFailMessage(e.message);
        }
      }
    } finally {
      getOldestFriendsStatus();
      setOldestFriendsDrawing(false);
    }

    setUpdate((update) => update + 1);
  }, [
    address,
    oldestFriendsRewardsModal,
    oldestFriendsDrawedNftId,
    isInvaidChain,
    lynksNFTImg,
    novaBalance,
    sendOldestFriendsTrademarkMintTx,
    switchChain,
    trademarkMintModal,
    trademarkMintParams,
    updateRefreshBalanceId,
  ]);

  const mintPointsTips = useMemo(() => {
    const isNovaPoints =
      mintResult?.name && mintResult.name.includes("Nova points");

    if (isNovaPoints) {
      let match = mintResult.name.match(/\d+/);
      let key = match ? parseInt(match[0]) : 0;

      return getPointsRewardsTooltips(key);
    }
  }, [mintResult]);

  return (
    <>
      <CardBox className="flex flex-col gap-[1.5rem] items-center p-[1.5rem]">
        <p className="w-full text-[1rem] font-[700] text-[1rem] leading-[1.5rem] tracking-[0.06rem]">
          Your Nova Character
        </p>
        <div className="md:w-[24rem] bg-[#65E7E5] rounded-[1rem]">
          <img
            src={nftImage}
            className="text-center block mx-auto h-auto rounded-[1rem]"
          />
        </div>
        <div className="flex items-center w-full">
          <Tooltip
            content={
              <div className="flex flex-col py-2">
                <p>
                  With each referral, you'll get a chance to open an invite box.
                </p>
              </div>
            }
          >
            <div className="grow mr-4">
              <Button
                className="gradient-btn flex-1 py-[1rem] flex justify-center items-center gap-[0.38rem] text-[1.25rem] w-full"
                onClick={handleMintTrademark}
                isDisabled={remainDrawCount === 0}
              >
                Open Invite Box ({remainDrawCount})
              </Button>
            </div>
          </Tooltip>
          <Tooltip
            content={
              <div className="flex flex-col py-2">
                <p>
                  You can instantly mint your SBT, and if you wish to upgrade
                  SBT to Lynks, you'll need to collect all 4 trademark NFTs.
                </p>
              </div>
            }
          >
            <div className="grow">
              <Button
                onClick={handleMintNow}
                isLoading={
                  fetchLoading || mintLoading || checkingTrademarkUpgradable
                }
                isDisabled={!!nft && !upgradable}
                className={classNames(
                  "w-full gradient-btn flex-1  py-[1rem] flex justify-center items-center gap-[0.38rem] text-[1.25rem] "
                )}
              >
                <span>{nft ? "Upgrade" : "Mint SBT"}</span>
                {nft ? (
                  <img
                    src="/img/icon-info.svg"
                    className="w-[0.875rem] h-[0.875rem]"
                  />
                ) : (
                  ""
                )}
              </Button>
            </div>
          </Tooltip>
        </div>
        {mintable && (
          <div className="w-full">
            <Button
              className="gradient-btn py-[1rem] flex justify-center items-center gap-[0.38rem] text-[1.25rem] w-full"
              onClick={handleOpenOldestFriendsRewards}
              disabled={minted || !nft}
              data-tooltip-id={!nft ? "oldest-firends-tooltip" : undefined}
            >
              Open zkLink's Oldest Friends Rewards
            </Button>

            <ReactTooltip
              id="oldest-firends-tooltip"
              place="top"
              style={{
                maxWidth: "25rem",
                fontSize: "0.875rem",
                lineHeight: "1.375rem",
                borderRadius: "0.5rem",
                background: "#666",
                fontFamily: "Satoshi",
                fontWeight: "400",
              }}
              content="Kindly mint your SBT tokens before accessing your Oldest Friends
              Rewards."
            />
          </div>
        )}
      </CardBox>
      <Modal
        classNames={{ closeButton: "text-[1.5rem]" }}
        size="4xl"
        isOpen={mintModal.isOpen}
        onOpenChange={mintModal.onOpenChange}
      >
        <ModalContent className="mt-[2rem] py-5 px-6 mb-[3.75rem]">
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
            through collecting different types of 4 trademark NFTs with our
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
      <Modal
        isDismissable={false}
        classNames={{ closeButton: "text-[1.5rem]" }}
        size="xl"
        isOpen={drawModal.isOpen}
        onOpenChange={drawModal.onOpenChange}
      >
        <ModalContent className="mt-[2rem] py-4 md:px-4 h-[100vh] overflow-auto md:h-auto">
          <ModalHeader className="px-0 pt-0 flex flex-col text-xl font-normal">
            Draw and Earn your invite rewards
          </ModalHeader>
          <DrawAnimation
            type="Trademark"
            ref={drawRef}
            targetImageIndex={
              drawedNftId
                ? getDrawIndexWithPrizeTokenId(drawedNftId)
                : undefined
            }
            onDrawEnd={() => {
              setDrawing(false);
            }}
            sbtNFT={nft}
          />
          <p className="text-left text-[#C0C0C0] mt-5 mb-4">
            With each referral, you'll have the chance to randomly draw one of
            the invite rewards.{" "}
            <span className="text-[#fff] font-[700]">
              Please notice that Nova points rewards are not NFT
            </span>
            , they'll be added directly to your Nova Points.
          </p>
          <Button
            onClick={handleDrawAndMint}
            isDisabled={
              !isInvaidChain && (novaBalance === 0 || remainDrawCount === 0)
            }
            isLoading={mintLoading || drawing}
            className="gradient-btn w-full h-[48px] py-[0.5rem] flex justify-center items-center gap-[0.38rem] text-[1.25rem]  mb-4"
          >
            <span>
              {isInvaidChain && "Switch to Nova network to draw"}
              {!isInvaidChain &&
                (!drawedNftId || drawedNftId === 5 || drawing) &&
                `Draw ( ${remainDrawCount} )`}
              {!isInvaidChain &&
                !!drawedNftId &&
                drawedNftId !== 5 &&
                !drawing &&
                "Mint"}
            </span>
          </Button>
          <Button
            className="secondary-btn w-full h-[48px] py-[0.5rem] flex justify-center items-center gap-[0.38rem] text-[1.25rem]"
            onClick={() => drawModal.onClose()}
          >
            Close
          </Button>
        </ModalContent>
      </Modal>

      <Modal
        isDismissable={false}
        classNames={{ closeButton: "text-[1.5rem]" }}
        size="xl"
        isOpen={oldestFriendsRewardsModal.isOpen}
        onOpenChange={oldestFriendsRewardsModal.onOpenChange}
      >
        <ModalContent className="mt-[2rem] py-4 md:px-4 h-[100vh] overflow-auto md:h-auto">
          <ModalHeader className="px-0 pt-0 flex flex-col text-xl font-normal">
            Receive your zkLink's Oldest Friends Rewards
          </ModalHeader>
          <OldestFriendsDrawAnimation
            type="OldestFriends"
            ref={oldestFriendsDrawRef}
            targetImageIndex={
              oldestFriendsDrawedNftId
                ? getOldestFriendsDrawIndexWithPrizeTokenId(
                    oldestFriendsDrawedNftId
                  )
                : undefined
            }
            onDrawEnd={() => {
              setOldestFriendsDrawing(false);
            }}
            sbtNFT={nft}
          />
          <p className="text-left text-[#C0C0C0] mt-5 mb-4">
            zkLink's oldest friends (previous campaign participants) taking part
            in the zkLink Aggregation Parade can randomly receive one of the Old
            Friends Rewards. Please notice that Nova points rewards are{" "}
            <b className="text-[#fff] font-[700]">not NFT</b>, they'll be added
            directly to your Nova Points.
          </p>
          <Button
            onClick={handleOldestFriendsRewardsDrawAndMint}
            className="gradient-btn w-full h-[48px] py-[0.5rem] flex justify-center items-center gap-[0.38rem] text-[1.25rem]  mb-4"
            isLoading={mintLoading || oldestFriendsDrawing}
            isDisabled={!isInvaidChain && minted}
          >
            <span>
              {isInvaidChain && "Switch to Nova network to draw"}
              {!isInvaidChain &&
                (!oldestFriendsDrawedNftId || oldestFriendsDrawing) &&
                "Draw"}
              {!isInvaidChain &&
                !!oldestFriendsDrawedNftId &&
                !oldestFriendsDrawing &&
                "Mint"}
            </span>
          </Button>
          <Button
            className="secondary-btn w-full h-[48px] py-[0.5rem] flex justify-center items-center gap-[0.38rem] text-[1rem] rounded-[6px]"
            onClick={() => oldestFriendsRewardsModal.onClose()}
          >
            Close
          </Button>
        </ModalContent>
      </Modal>

      <Modal
        isDismissable={false}
        classNames={{ closeButton: "text-[1.5rem]" }}
        style={{ minHeight: "300px", backgroundColor: "rgb(38, 43, 51)" }}
        isOpen={trademarkMintModal.isOpen}
        onOpenChange={trademarkMintModal.onOpenChange}
        className="trans"
      >
        <ModalContent className="mt-[2rem] py-4 px-4">
          <ModalHeader className="px-0 pt-0 flex flex-col text-xl font-normal text-center">
            {trademarkMintStatus === MintStatus.Minting && !isApproving && (
              <span>Minting</span>
            )}
            {trademarkMintStatus === MintStatus.Minting && isApproving && (
              <span>Approving</span>
            )}
            {trademarkMintStatus === MintStatus.Success && (
              <span>Congratulations</span>
            )}
            {trademarkMintStatus === MintStatus.Failed && (
              <span>Transaction Failed</span>
            )}
          </ModalHeader>
          <ModalBody className="">
            <TxResult>
              {trademarkMintStatus === MintStatus.Minting && (
                <div className="flex flex-col items-center">
                  <Button
                    className="statusBtn"
                    disableAnimation
                    size="lg"
                    isLoading={trademarkMintStatus === MintStatus.Minting}
                  ></Button>
                  <p className="text-[#C0C0C0] font-normal text-lg">
                    Please sign the transaction in your wallet.
                  </p>
                  {isApproving && (
                    <p className="text-[#C0C0C0] font-normal text-lg">
                      If you receive a warning about approving all your NFTs,
                      please don't panic. The Lynks contract requires approval
                      to burn your trademark NFTs in order to mint Lynks.
                    </p>
                  )}
                </div>
              )}
              {trademarkMintStatus === MintStatus.Failed && (
                <div>
                  <img src="/img/transFail.png" alt="" className="statusImg" />
                  <div className="title">{failMessage}</div>
                  <div className="inner">
                    If you have any questions regarding this transaction, please{" "}
                    <a
                      href="https://discord.com/invite/zklink"
                      target="_blank"
                      className="view inline"
                      onClick={trademarkMintModal.onClose}
                    >
                      contact us
                    </a>{" "}
                    for help
                  </div>
                </div>
              )}
              {trademarkMintStatus === MintStatus.Success && (
                <div className="flex flex-col items-center">
                  <p className="text-[#C0C0C0]">
                    {mintResult?.name.includes("Nova points")
                      ? "You have received"
                      : "You have successfully minted"}
                  </p>
                  <img
                    src={mintResult?.img}
                    alt=""
                    className="w-[10rem] h-[10rem] rounded-xl my-4 bg-[#3C4550]"
                  />

                  {mintResult?.name.includes("Nova points") &&
                    !!mintPointsTips && (
                      <p className="my-2 text-[16px] text-center">
                        {getPointsRewardsTooltips(Number())}
                      </p>
                    )}
                  <p className="text-[24px] font-inter font-normal">
                    {mintResult?.name}
                  </p>

                  {mintResult?.name.includes("Nova points") &&
                    !!mintPointsTips && (
                      <p className="my-2 text-[14px] text-center text-[#C0C0C0]">
                        {mintPointsTips}
                      </p>
                    )}
                </div>
              )}
              {trademarkMintStatus === MintStatus.Success && (
                <div className="mt-6">
                  {mintResult?.name.includes("Nova points") ? (
                    <Button
                      className="w-full gradient-btn"
                      onClick={() => trademarkMintModal.onClose()}
                    >
                      Confirm
                    </Button>
                  ) : (
                    <Button
                      className="w-full gradient-btn"
                      onClick={() =>
                        window.open(
                          mintResult?.name.includes("Lynks")
                            ? LYNKS_NFT_MARKET_URL
                            : TRADEMARK_NFT_MARKET_URL,
                          "_blank"
                        )
                      }
                    >
                      Trade in Alienswap
                    </Button>
                  )}
                </div>
              )}
            </TxResult>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        classNames={{ closeButton: "text-[1.5rem]" }}
        size="3xl"
        isOpen={upgradeModal.isOpen}
        onOpenChange={upgradeModal.onOpenChange}
      >
        <ModalContent className="mt-[2rem] py-4 px-4">
          <ModalHeader className="px-0 pt-0 flex flex-col text-xl font-normal">
            Upgrade your Nova SBT
          </ModalHeader>
          <div className="flex items-center justify-center">
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <img
                  key={item}
                  src={`/img/img-trademark-${item}.png`}
                  alt=""
                  className="w-[80px] md:h-[80px] rounded-xl bg-[#3C4550]"
                />
              ))}
            </div>
            <img src="/img/icon-plus.svg" alt="" className="w-6 h-6 mx-4" />
            <img
              src={nft?.image}
              alt=""
              className="w-[180px] h-[180px] object-cover"
            />
            <img src="/img/icon-equal.svg" alt="" className="w-6 h-6 mx-4" />
            <img
              src={`/img/img-${nft?.name}-LYNK.png`}
              alt=""
              className="w-[180px] h-[180px] object-cover"
            />
          </div>

          <div className="text-[#A0A5AD] text-xs my-6">
            <p>
              You will have to collect all 4 different types of trademark NFT to
              upgrade your nova SBT, you can receive trademark NFT in the
              following way.
            </p>
            <p className="">
              1. Mint a trademark NFT by for every 3 successful referrals
            </p>
            <p className="">
              2. Go to NFT Marketplace to purchase Trademark NFTs
            </p>
          </div>

          <Button
            onClick={handleUpgrade}
            // isDisabled={!isInvaidChain}
            isLoading={mintLoading}
            className="gradient-btn w-full h-[58px] py-[1rem] flex justify-center items-center gap-[0.38rem] text-[1.25rem]  "
          >
            <span>
              {isInvaidChain && "Switch to Nova network to mint"}
              {!isInvaidChain && !isTrademarkApproved && "Approve & Mint"}
              {!isInvaidChain && isTrademarkApproved && "Mint"}
            </span>
          </Button>
        </ModalContent>
      </Modal>
    </>
  );
}
