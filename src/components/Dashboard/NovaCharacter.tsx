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
import {
  getRemainDrawCount,
  drawTrademarkNFT,
  postNFTLashin,
  getEcoRamain,
  postEcoDraw,
} from "@/api";
import styled from "styled-components";
import DrawAnimation from "../DrawAnimation";
import OldestFriendsDrawAnimation from "../DrawAnimation/OldestFriends";
import useNovaDrawNFT, {
  MysteryboxOpenParams,
  TrademarkMintParams,
} from "@/hooks/useNovaNFT";
import { useMintStatus } from "@/hooks/useMintStatus";
import { eventBus } from "@/utils/event-bus";
import { Abi } from "viem";
import useOldestFriendsStatus from "@/hooks/useOldestFriendsStatus";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { getPointsRewardsTooltips } from "./PointsRewardsTooltips";
import EcoBoxDrawAnimation from "../EcoBoxDrawAnimation";
import NovaTrademarkNFT from "@/constants/abi/NovaTrademarkNFT.json";
import SbtMintModal from "./NovaCharacterComponents/SbtMintModal";
import SbtUpgradeModal, {
  TxResult,
} from "./NovaCharacterComponents/SbtUpgradeModal";

export { TxResult };

//tokenId from api => image id of frontend
const TRADEMARK_TOKEN_ID_MAP: Record<number, string> = {
  8: "+10 Nova points",
  9: "+50 Nova points",
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

const PRIZE_ID_NFT_MAP_V2_MAP: Record<number, string> = {
  50: "+50 Nova points",
  100: "+100 Nova points",
  200: "+200 Nova points",
  500: "+500 Nova points",
  1000: "+1000 Nova points",
  1: "Oak Tree Roots",
  2: "Magnifying Glass",
  3: "Chess Knight",
  4: "Binary Code Metrix Cube",
  88: "Lynks",
};

const PRIZE_ID_NFT_MAP_V2: Record<number, number> = {
  50: 0,
  100: 1,
  200: 2,
  500: 3,
  1000: 4,
  1: 5,
  2: 6,
  3: 7,
  4: 8,
  88: 9,
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
    sendEcoBoxMintTx,
    lynksNFT,
    isTrademarkApproved,
    sendTrademarkApproveTx,
    sendUpgradeSBTTx,
    isApproving,
    publicClient,
    sendMysteryOpenMintTxV2,
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
      mintResult?.name && mintResult.name.toLowerCase().includes("nova points");

    if (isNovaPoints) {
      let match = mintResult.name.match(/\d+/);
      let key = match ? parseInt(match[0]) : 0;

      return getPointsRewardsTooltips(key);
    }
  }, [mintResult]);

  const [ecoBoxCount, setEcoBoxCount] = useState(0); // TODO: get from api
  const ecoBoxModal = useDisclosure();
  const [ecoBoxDrawNftId, setEcoBoxDrawNftId] = useState<number>();
  const [ecoBoxDrawing, setEcoBoxDrawing] = useState(false);
  const [ecoBoxOpening, setEcoBoxOpening] = useState(false);

  const [ecoBoxMintParams, setEcoBoxMintParams] = useState<{
    tokenId: number;
    nonce: number;
    signature: string;
    expiry: number;
    mintType?: number;
  }>();

  const handleOpenEcoBox = useCallback(() => {
    ecoBoxModal.onOpen();
  }, [ecoBoxModal]);

  const ecoBoxDrawRef = useRef<{ start: (target: number) => void }>();

  const handleDrawEcoBox = useCallback(async () => {
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

    if (!ecoBoxDrawNftId) {
      setEcoBoxDrawing(true);
      const res = await postEcoDraw(address);

      if (res && res?.result) {
        const { tokenId, nonce, signature, expiry, mintType } = res.result;
        setEcoBoxMintParams({ tokenId, nonce, signature, expiry, mintType });
        await ecoBoxDrawRef?.current?.start(PRIZE_ID_NFT_MAP_V2[tokenId]);

        if ([50, 100, 200, 500, 1000].includes(tokenId)) {
          await sleep(2000);
          setEcoBoxDrawNftId(undefined);
          //not actual nft. Just points.
          setTrademarkMintStatus(MintStatus.Success);
          setMintResult({
            name: PRIZE_ID_NFT_MAP_V2_MAP[tokenId!],
            img:
              tokenId === 88
                ? lynksNFTImg!
                : `/img/img-point-booster-v2-${
                    PRIZE_ID_NFT_MAP_V2[tokenId!] + 1
                  }.png`,
          });
          trademarkMintModal.onOpen();
          ecoBoxModal.onClose();
          getEcoRemainCount();
          eventBus.emit("getInvite");
        } else {
          const drawPrizeId =
            Number(tokenId) === 88 ? 9 : PRIZE_ID_NFT_MAP_V2[tokenId];
          setEcoBoxDrawNftId(drawPrizeId);
        }

        setUpdate((update) => update + 1);
        return; // draw first and then mint as step2.
      }
    }
    let mintParams = { ...ecoBoxMintParams };

    try {
      //TODO call contract
      trademarkMintModal.onOpen();
      setTrademarkMintStatus(MintStatus.Minting);
      if (!ecoBoxMintParams) {
        const res = await postEcoDraw(address);
        if (res && res.result) {
          const { tokenId, nonce, signature, expiry, mintType } = res.result;
          setEcoBoxMintParams({
            tokenId,
            nonce,
            signature,
            expiry,
            mintType,
          });
          mintParams = { tokenId, nonce, signature, expiry, mintType };
        }
      }
      await sendEcoBoxMintTx(mintParams as TrademarkMintParams);
      setTrademarkMintStatus(MintStatus.Success);
      setMintResult({
        name: PRIZE_ID_NFT_MAP_V2_MAP[mintParams.tokenId!],
        img:
          mintParams.tokenId === 88
            ? lynksNFTImg!
            : `/img/img-trademark-${mintParams!.tokenId}.png`,
      });
      updateRefreshBalanceId();
      setEcoBoxDrawNftId(undefined);
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
      getEcoRemainCount();
      setEcoBoxDrawing(false);
    }

    setUpdate((update) => update + 1);
  }, [
    address,
    ecoBoxModal,
    ecoBoxDrawNftId,
    isInvaidChain,
    lynksNFTImg,
    novaBalance,
    sendOldestFriendsTrademarkMintTx,
    switchChain,
    trademarkMintModal,
    trademarkMintParams,
    updateRefreshBalanceId,
  ]);

  const getEcoRemainCount = async () => {
    if (!address) return;
    const res = await getEcoRamain(address);
    const { result } = res;

    if (result && result?.remainMintNum) {
      setEcoBoxCount(Number(result.remainMintNum) || 0);
    }
  };

  useEffect(() => {
    getEcoRemainCount();
  }, [address]);

  

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

        {mintable && !minted && (
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
      <SbtMintModal mintModal={mintModal} />
      <SbtUpgradeModal
        upgradeModal={upgradeModal}
        nft={nft}
        mintLoading={mintLoading}
      />
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
          <div>
            <Button
              onClick={handleOldestFriendsRewardsDrawAndMint}
              className="gradient-btn w-full h-[48px] py-[0.5rem] flex justify-center items-center gap-[0.38rem] text-[1.25rem]  mb-4"
              isLoading={mintLoading || oldestFriendsDrawing}
              isDisabled={minted}
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
          </div>
        </ModalContent>
      </Modal>

      <Modal
        isDismissable={false}
        classNames={{ closeButton: "text-[1.5rem]" }}
        size="2xl"
        isOpen={ecoBoxModal.isOpen}
        onOpenChange={ecoBoxModal.onOpenChange}
      >
        <ModalContent className="mt-[2rem] py-4 md:px-4 h-[100vh] overflow-auto md:h-auto">
          <ModalHeader className="flex flex-col gap-1">
            Open Eco Box
          </ModalHeader>
          <ModalBody className="px-0 ">
            <div className="flex flex-col items-center ">
              <EcoBoxDrawAnimation
                type="MysteryBox"
                ref={ecoBoxDrawRef}
                onDrawEnd={() => {
                  setEcoBoxDrawing(false);
                }}
                targetImageIndex={ecoBoxDrawNftId}
              />

              <p className="text-left text-[#C0C0C0] mt-4 mb-2 px-6 font-satoshi font-normal">
                Every day, the top 500 users who accumulate the most Nova Points
                by interacting with Nova ecosystem dApps have the opportunity to
                draw an Eco Box. Please notice that Nova points rewards are not
                NFT, they'll be added directly to your Nova Points.
              </p>
            </div>

            <div>
              <Button
                onClick={handleDrawEcoBox}
                className="gradient-btn w-full h-[48px] py-[0.5rem] flex justify-center items-center gap-[0.38rem] text-[1.25rem]  mb-4"
                isLoading={mintLoading || ecoBoxDrawing}
                isDisabled={ecoBoxCount === 0}
              >
                <span>
                  {isInvaidChain && "Switch to Nova network to draw"}
                  {!isInvaidChain &&
                    (!ecoBoxDrawNftId || ecoBoxDrawing) &&
                    "Draw"}
                  {!isInvaidChain &&
                    !!ecoBoxDrawNftId &&
                    !ecoBoxDrawing &&
                    "Mint"}
                </span>
              </Button>
              <Button
                className="secondary-btn w-full h-[48px] py-[0.5rem] flex justify-center items-center gap-[0.38rem] text-[1rem] rounded-[6px]"
                onClick={() => ecoBoxModal.onClose()}
              >
                Close
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
