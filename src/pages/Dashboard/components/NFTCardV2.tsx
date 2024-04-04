import {
  Button,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tooltip,
} from "@nextui-org/react";
import styled from "styled-components";
import { CardBox } from "@/styles/common";
import {
  TRADEMARK_NFT_MARKET_URL,
  MYSTERYBOX_NFT_MARKET_URL,
  NOVA_CHAIN_ID,
  MintStatus,
} from "@/constants";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import DrawAnimationV2 from "@/components/DrawAnimationV2";
import useSBTNFT from "@/hooks/useNFT";
import useNovaNFT, { MysteryboxMintParams } from "@/hooks/useNovaNFT";
import {
  getRemainMysteryboxDrawCountV2,
  mintMysteryboxNFTV2,
  openMysteryboxNFTV2,
  getRemainMysteryboxOpenableCountV2,
} from "@/api";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import toast from "react-hot-toast";
import { addNovaChain, getTweetShareTextForMysteryBox, sleep } from "@/utils";
import { TxResult } from "@/components/Dashboard/NovaCharacter";
import { useMintStatus } from "@/hooks/useMintStatus";
import classNames from "classnames";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const NftBox = styled.div`
  .nft-left {
    /* flex: 6;
      */
    padding: 24px;
    .nft-chip:nth-child(3n) {
      margin-right: 0;
    }
    .spin {
      animation: spin-animation 1s linear infinite;
    }
    @keyframes spin-animation {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    .nft-chip {
      border-radius: 16px;
      backdrop-filter: blur(15.800000190734863px);
    }
    .nft-info {
      width: 170px;
      flex-shrink: 0;

      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 16px;
      margin-bottom: 24px;
      .nft-name {
        text-align: center;
        font-family: Satoshi;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px; /* 157.143% */
        background: linear-gradient(90deg, #48ecae 0%, #49ced7 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 10px;
      }
      .nft-balance {
        color: #fff;
        font-family: Satoshi;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 24px; /* 150% */
        letter-spacing: 0.96px;
      }
    }
  }
  .nft-left,
  .nft-right {
    .nft-left-title {
      color: #fff;
      font-family: Satoshi;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: 24px; /* 150% */
      letter-spacing: 0.96px;
    }
    .nft-left-sub-title {
      color: #919192;
      font-family: Satoshi;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      letter-spacing: 0.96px;
    }
  }
  .nft-right {
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;
//prize id (tokenId) ---> img id of point booster NFT, 8 for lynks NFT
const PRIZE_ID_NFT_MAP: Record<number, number> = {
  3: 1,
  4: 2,
  100: 3,
  300: 4,
  500: 5,
  1000: 6,
  2000: 7,
};

const PRIZE_ID_NFT_MAP_V2: Record<number, number> = {
  1: 1,
  50: 2,
  100: 3,
  200: 4,
  500: 5,
  1000: 6,
};

const ALL_NFTS = [
  { img: "trademark-1.png", name: "Oak Tree Roots", balance: 0 },
  { img: "trademark-2.png", name: "Magnifying Glass", balance: 0 },
  { img: "trademark-3.png", name: "Chess Knight", balance: 0 },
  { img: "trademark-4.png", name: "Binary Code Metrix Cube", balance: 0 },

  { img: "ENTP-LYNK.png", type: "ENTP", name: "ENTP-LYNK", balance: 0 },
  { img: "ISTP-LYNK.png", type: "ISTP", name: "ISTP-LYNK", balance: 0 },
  { img: "INFJ-LYNK.png", type: "INFJ", name: "INFJ-LYNK", balance: 0 },
  { img: "ESFJ-LYNK.png", type: "ESFJ", name: "ESFJ-LYNK", balance: 0 },

  { img: "point-booster-v2-1.png", name: "Nova +50 Booster", balance: 0 },
  { img: "point-booster-v2-2.png", name: "Nova +100 Booster", balance: 0 },
  { img: "point-booster-v2-3.png", name: "Nova +200 Booster", balance: 0 },
  { img: "point-booster-v2-4.png", name: "Nova +500 Booster", balance: 0 },
  { img: "point-booster-v2-5.png", name: "Nova +1000 Booster", balance: 0 },

  { img: "point-booster-1.png", name: "Nova x3 Booster", balance: 0 },
  { img: "point-booster-2.png", name: "Nova x4 Booster", balance: 0 },
  { img: "point-booster-3.png", name: "Nova +100 Booster", balance: 0 },
  { img: "point-booster-4.png", name: "Nova +300 Booster", balance: 0 },
  { img: "point-booster-5.png", name: "Nova +500 Booster", balance: 0 },
  { img: "point-booster-6.png", name: "Nova +1000 Booster", balance: 0 },
  { img: "point-booster-7.png", name: "Nova +2000 Booster", balance: 0 },
];

interface NFTCardV2Props {
  switchPhase: (version: number) => void;
}
export default function NFTCardV2({ switchPhase }: NFTCardV2Props) {
  const openBoxModal = useDisclosure();
  const mintBoxModal = useDisclosure();
  const mintResultModal = useDisclosure();
  const [remainMintCount, setRemainMintCount] = useState(0);
  const [minting, setMinting] = useState(false);
  const [opening, setOpening] = useState(false);
  const [boxId, setBoxId] = useState<number | null>(null);
  const drawRef = useRef<{ start: (target: number) => void }>();
  const [drawing, setDrawing] = useState(false);
  const [update, setUpdate] = useState(0);
  const [boxCount, setBoxCount] = useState(0);
  // const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [mintStatus, setMintStatus] = useState<MintStatus | undefined>();
  const [failMessage, setFailMessage] = useState("");
  const { nft: sbtNFT } = useSBTNFT();
  const {
    trademarkNFT,
    boosterNFT,
    boosterNFTV2,
    lynksNFT,
    mysteryBoxNFTV2,
    getLynksNFT,
    sendMysteryOpenMintTxV2,
    sendMysteryMintTxV2,
    loading: mintLoading,
    novaETHBalance,
    getMysteryboxNFTV2,
  } = useNovaNFT();
  const { address, chainId } = useAccount();
  const [allNFTs, setAllNFTs] =
    useState<{ img: string; name: string; balance: number }[]>(ALL_NFTS);
  const [mintableCount, setMintableCount] = useState(0);
  const [boxTokenIds, setBoxTokenIds] = useState<number[]>([]);
  const [mintParams, setMintParams] = useState<MysteryboxMintParams>();
  const [drawPrizeId, setDrawPrizeId] = useState<number>();
  const { updateRefreshBalanceId, refreshBalanceId } = useMintStatus();
  const [refreshing, setRefreshing] = useState(false);
  const [mintResult, setMintResult] = useState<{ name: string; img: string }>();
  const { invite } = useSelector((store: RootState) => store.airdrop);

  const onOpen = () => {
    openBoxModal.onOpen();
  };
  const onMint = () => {
    mintBoxModal.onOpen();
  };

  const lynksNFTImg = useMemo(() => {
    if (sbtNFT) {
      return `/img/img-mystery-box-lynks-${sbtNFT.name}.png`;
    }
  }, [sbtNFT]);

  const isInvaidChain = useMemo(() => {
    return chainId !== NOVA_CHAIN_ID;
  }, [chainId]);

  useEffect(() => {
    //fetch box count remain
    if (address) {
      getRemainMysteryboxDrawCountV2(address).then((res) => {
        const remainNumber = res.result;
        setRemainMintCount(remainNumber);
      });
      //TODO get mystery box balance

      getMysteryboxNFTV2(address).then((res) => {
        setBoxTokenIds(res ?? []);
        setBoxCount(res?.length ?? 0);
      });
      //TODO get mintabel count
      getRemainMysteryboxOpenableCountV2(address).then((res) => {
        console.log("getRemainMysteryboxOpenableCountV2: ", res);
        setMintableCount(res.result);
        if (res.result > 0) {
          openMysteryboxNFTV2(address).then((res) => {
            const { tokenId, nonce, signature, expiry } = res.result;
            setMintParams({ tokenId, nonce, signature, expiry });
            setDrawPrizeId(tokenId ? PRIZE_ID_NFT_MAP[tokenId] - 1 : 7); // should use index for active in DrawAnimation component
          });
        }
      });
    }
  }, [address, getMysteryboxNFTV2, update]);

  // useEffect(() => {
  //   if (remainMintCount > 0 && !initied && !mintBoxModal.isOpen) {
  //     setInitied(true);
  //     mintBoxModal.onOpen();
  //   }
  //   return () => {};
  // }, [initied, remainMintCount, mintBoxModal]);

  useEffect(() => {
    (async () => {
      if (
        !address ||
        !trademarkNFT ||
        !boosterNFT ||
        !boosterNFTV2 ||
        !lynksNFT
      ) {
        return;
      }
      try {
        setRefreshing(true);
        const nfts = [];
        const trademarkBalances = await Promise.all(
          [1, 2, 3, 4].map((item) =>
            trademarkNFT.read.balanceOf([address, item])
          )
        );
        console.log("trademarkBalances: ", trademarkBalances);
        for (let i = 0; i < 4; i++) {
          nfts.push({ ...ALL_NFTS[i], balance: Number(trademarkBalances[i]) });
        }

        const lynksBalances = await getLynksNFT(address);
        console.log("lynksBalances: ", lynksBalances);
        for (let i = 0; i < 4; i++) {
          const nft = lynksBalances?.find((item) =>
            item.name.includes(ALL_NFTS[i + 4].type!)
          );
          nfts.push({ ...ALL_NFTS[i + 4], balance: nft?.balance ?? 0 });
        }

        // TODO: new nova points booster NFTs
        const boosterBalancesV2 = await Promise.all(
          Object.keys(PRIZE_ID_NFT_MAP_V2).map((item) =>
            boosterNFT.read.balanceOf([address, item])
          )
        );
        for (let i = 0; i < 5; i++) {
          nfts.push({
            ...ALL_NFTS[i + 8],
            balance: Number(boosterBalancesV2[i]),
          });
        }

        const boosterBalances = await Promise.all(
          Object.keys(PRIZE_ID_NFT_MAP).map((item) =>
            boosterNFT.read.balanceOf([address, item])
          )
        );
        console.log("boosterBalances: ", boosterBalances);
        for (let i = 0; i < 7; i++) {
          nfts.push({
            ...ALL_NFTS[i + 13],
            balance: Number(boosterBalances[i]),
          });
        }

        setAllNFTs(nfts);
      } catch (e) {
        console.error(e);
      } finally {
        setRefreshing(false);
      }
    })();
  }, [
    address,
    boosterNFT,
    boosterNFTV2,
    lynksNFT,
    trademarkNFT,
    getLynksNFT,
    update,
    refreshBalanceId,
  ]);

  const onMintSubmit = async () => {
    if (!address) return;
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
    if (novaETHBalance === 0) {
      toast.error("Insuffcient gas for mint transaction.");
      return;
    }
    try {
      setMinting(true);
      setMintStatus(MintStatus.Minting);
      mintResultModal.onOpen();
      const res = await mintMysteryboxNFTV2(address);
      await sendMysteryMintTxV2(res.result);
      setUpdate((update) => update + 1);
      setMintStatus(MintStatus.Success);
      setMintResult({
        name: "Mystery Box",
        img: "/img/img-mystery-box.png",
      });
    } catch (e) {
      setMintStatus(MintStatus.Failed);
      console.error(e);
      if (e.message) {
        if (e.message.includes("rejected the request")) {
          setFailMessage("User rejected the request");
        }
      }
    } finally {
      setMinting(false);
    }
  };

  /** Open process:
   * 1. burn mystery box nft;
   * 2. call api to get prize and params;
   * 3. call booster/lynx contract to mint
   * we burn box here
   *  */
  const onOpenSubmit = useCallback(async () => {
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
    if (!mysteryBoxNFTV2 || !address || boxTokenIds.length === 0) return;
    try {
      setOpening(true);
      await mysteryBoxNFTV2.write.burn([boxTokenIds[0]]); // burn first
      const res = await openMysteryboxNFTV2(address); // draw prize
      if (res && res.result) {
        const { tokenId, nonce, signature, expiry } = res.result;
        setMintParams({ tokenId, nonce, signature, expiry });
        //do the draw animation. tokenId means prize is bootster; no tokenId means prize is lynks,use 8 to make draw animation works
        await drawRef?.current?.start(
          tokenId ? PRIZE_ID_NFT_MAP[tokenId] - 1 : 7
        ); // use index of img for active
      }
      getRemainMysteryboxOpenableCountV2(address).then((res) => {
        console.log("getRemainMysteryboxOpenableCountV2: ", res);
        setMintableCount(res.result);
      });
      setUpdate(() => update + 1);
      const boxTokenIdRes = await getMysteryboxNFTV2(address);
      setBoxTokenIds(boxTokenIdRes ?? []);
      setBoxCount(boxTokenIdRes?.length ?? 0);
      setOpening(false);
    } catch (e) {
      console.error(e);
    } finally {
      setOpening(false);
    }
  }, [
    address,
    boxTokenIds,
    getMysteryboxNFTV2,
    isInvaidChain,
    mysteryBoxNFTV2,
    switchChain,
    update,
  ]);

  /**
   * Open process:
   * draw and mint
   */
  const onDrawMintSubmit = useCallback(async () => {
    if (!address || drawing || mintStatus === MintStatus.Minting) return;
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
    if (novaETHBalance === 0) {
      toast.error("Insuffcient gas for mint transaction.");
      return;
    }
    let params;
    try {
      mintResultModal.onOpen();
      setMintStatus(MintStatus.Minting);
      setDrawing(true);
      if (!mintParams) {
        const res = await openMysteryboxNFTV2(address);
        if (res && res.result) {
          const { tokenId, nonce, signature, expiry } = res.result;
          setMintParams({ tokenId, nonce, signature, expiry });
          //do the draw animation. tokenId means prize is bootster; no tokenId means prize is lynks,use 8 to make draw animation works
          // await drawRef?.current?.start(
          //   tokenId ? PRIZE_ID_NFT_MAP[tokenId] - 1 : 7
          // ); // use index of img for active
          // await sleep(3000); //show prize for 3s
          setDrawPrizeId(tokenId ? PRIZE_ID_NFT_MAP[tokenId] - 1 : 7); // should use index for active in DrawAnimation component
          params = res.result;
        }
      } else {
        params = { ...mintParams };
      }
      if (!params) {
        toast.error("No mint oppertunities left.");
        return;
      }

      await sendMysteryOpenMintTxV2(params);
      setMintStatus(MintStatus.Success);
      setUpdate((update) => update + 1);
      setDrawPrizeId(-1);
      let resultName = "",
        resultImg = "";
      if (mintBoxModal.isOpen) {
        resultName = "Mystery Box";
        resultImg = "/img/img-mystery-box.png";
      } else if (openBoxModal.isOpen && params?.tokenId) {
        resultName = "Point Booster";
        resultImg = `/img/img-point-booster-${
          PRIZE_ID_NFT_MAP[params.tokenId]
        }.png`;
      } else if (openBoxModal.isOpen && !params?.tokenId) {
        resultName = "Lynks NFT";
        resultImg = lynksNFTImg ?? "";
      }
      setMintResult({
        name: resultName,
        img: resultImg,
      });
    } catch (e) {
      console.error(e);
      setMintStatus(MintStatus.Failed);
      if (e.message) {
        if (e.message.includes("rejected the request")) {
          setFailMessage("User rejected the request");
        } else {
          setFailMessage(e.message);
        }
      }
    } finally {
      setDrawing(false);
    }
  }, [
    address,
    drawing,
    isInvaidChain,
    lynksNFTImg,
    mintBoxModal.isOpen,
    mintParams,
    mintResultModal,
    mintStatus,
    novaETHBalance,
    openBoxModal.isOpen,
    sendMysteryOpenMintTxV2,
    switchChain,
  ]);

  return (
    <>
      <NftBox className="flex justify-between flex-wrap rounded-lg mt-8">
        <CardBox className="nft-left grow mb-5">
          <div className="flex justify-between">
            <div>
              <p className="nft-left-title">Nova NFTs</p>
              <p className="nft-left-sub-title">
                Invite to earn more Trademark NFTs and Lynks
              </p>
            </div>
            <div className="flex items-center">
              <Tooltip
                content={
                  "If your NFT aren't showing up on the list, simply click this button. "
                }
              >
                <img
                  src="/img/icon-refresh.svg"
                  alt=""
                  className={classNames(
                    "cursor-pointer w-6 h-6 mr-6",
                    refreshing ? "spin" : ""
                  )}
                  onClick={() => updateRefreshBalanceId()}
                />
              </Tooltip>
              <Button
                className="gradient-btn"
                onClick={() => window.open(TRADEMARK_NFT_MARKET_URL, "_blank")}
              >
                Buy
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {allNFTs.map((item, index) => (
              <div
                className="nft-chip relative  w-[150px] md:w-[170px] "
                key={index}
                style={{ opacity: item.balance > 0 ? "100%" : "40%" }}
              >
                <img
                  src={`/img/img-${item.img}`}
                  alt=""
                  className="w-[85%] mx-auto"
                />
                {/* <div className='relative bg-slate-50 h-24 w-8/12 m-auto'> */}
                <div className="nft-info">
                  <span className="nft-name">{item.name}</span>
                  <span className="nft-balance">x{item.balance}</span>
                </div>
              </div>
            ))}
          </div>
        </CardBox>

        <CardBox className="nft-right mt-6 mb-5 md:mt-0 md:ml-10">
          <div className="w-full flex justify-between items-center">
            <div>
              <div className="flex items-center ">
                <span className="nft-left-title">Mystery Box - Phase II</span>
              </div>
              <p className="nft-left-sub-title">
                Invite more to win Mystery Box!
              </p>
            </div>
            <Button
              className="gradient-btn"
              onClick={() => window.open(MYSTERYBOX_NFT_MARKET_URL, "_blank")}
            >
              Buy
            </Button>
          </div>
          <div className=" md:w-[384px] md:h-[300px] mb-8">
            <img
              src="/img/img-mystery-box-v2.png"
              className="h-[100%] mx-auto object-contain"
            />
          </div>
          <Button
            className="gradient-btn mb-2 w-full"
            onClick={onMint}
            disabled={remainMintCount === 0}
          >
            Mint Your Box {remainMintCount > 0 ? `(${remainMintCount})` : ""}
          </Button>
          <Button
            className="gradient-btn mb-2 w-full"
            onClick={onOpen}
            // disabled={mintableCount === 0}
          >
            Open Your Box ({boxCount})
          </Button>

          <Button
            className="gradient-btn mb-2 w-full"
            onClick={() => switchPhase(1)}
          >
            Back to Mystery Box Phase I
          </Button>
        </CardBox>
      </NftBox>

      <Modal
        isDismissable={false}
        classNames={{ closeButton: "text-[1.5rem]" }}
        size="xl"
        isOpen={openBoxModal.isOpen}
        onOpenChange={openBoxModal.onOpenChange}
      >
        <ModalContent className="h-[100vh] overflow-auto md:h-auto">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Open the Mystery box
              </ModalHeader>
              <ModalBody className="px-0 ">
                <div className="flex flex-col items-center ">
                  <DrawAnimationV2
                    type="MysteryBox"
                    ref={drawRef}
                    onDrawEnd={() => {
                      setDrawing(false);
                    }}
                    sbtNFT={sbtNFT}
                    targetImageIndex={drawPrizeId}
                  />

                  <p className="text-left text-[#C0C0C0] mt-4 mb-2 px-6 font-satoshi font-normal">
                    After opening your Mystery Box (which is then burned),
                    you'll have the chance to randomly mint a booster NFT.
                    However, you must mint your booster NFT before opening
                    another Mystery Box..{" "}
                    <span className="font-bold">
                      {" "}
                      Please be aware that the booster NFT is non-tradable.
                    </span>
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="w-full">
                  <div className="w-full flex items-center justify-between gap-4">
                    <Button
                      className="gradient-btn w-full h-[48px] py-[1rem] flex justify-center items-center gap-[0.38rem] text-[1.25rem]  mb-4"
                      onClick={onOpenSubmit}
                      isLoading={opening}
                      isDisabled={
                        !isInvaidChain && (boxCount === 0 || mintableCount > 0)
                      }
                    >
                      {isInvaidChain && "Switch Network"}
                      {!isInvaidChain && opening && "Opening"}
                      {!isInvaidChain && !opening && `Open Box (${boxCount})`}
                    </Button>
                    <Button
                      className="gradient-btn w-full h-[48px] py-[1rem] flex justify-center items-center gap-[0.38rem] text-[1.25rem]  mb-4"
                      onClick={onDrawMintSubmit}
                      isLoading={drawing}
                      isDisabled={!isInvaidChain && mintableCount === 0}
                    >
                      {isInvaidChain && "Switch Network"}
                      {!isInvaidChain && drawing && "Minting"}
                      {!isInvaidChain && !drawing && "Mint Booster"}
                    </Button>
                  </div>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        isDismissable={false}
        classNames={{ closeButton: "text-[1.5rem]" }}
        size="md"
        isOpen={mintBoxModal.isOpen}
        onOpenChange={mintBoxModal.onOpenChange}
      >
        <ModalContent className="mb-[5.75rem]">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Mint the Mystery box
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center ">
                  <img
                    src="/img/img-mystery-box.png"
                    className="w-[240px] h-[240px] mb-6"
                  />
                  <p className="font-inter text-[24px] mb-3">
                    Nova Mystery Box
                  </p>
                  <p className="text-green text-[16px] font-normal">
                    Congratulation, now you can mint Mystery Box{" "}
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="w-full">
                  <Button
                    className="w-full gradient-btn"
                    onClick={onMintSubmit}
                    isLoading={mintLoading}
                  >
                    {isInvaidChain && "Switch to Nova network to mint"}
                    {!isInvaidChain && mintLoading && "Minting"}
                    {!isInvaidChain &&
                      !mintLoading &&
                      `Mint (${remainMintCount})`}
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isDismissable={false}
        classNames={{ closeButton: "text-[1.5rem]" }}
        style={{ minHeight: "300px", backgroundColor: "rgb(38, 43, 51)" }}
        isOpen={mintResultModal.isOpen}
        onOpenChange={mintResultModal.onOpenChange}
        className="trans"
      >
        <ModalContent className="mt-[2rem] py-5 px-6 mb-[5.75rem]">
          <ModalHeader className="px-0 pt-0 flex flex-col text-xl font-normal text-center">
            {mintStatus === MintStatus.Minting && <span>Minting</span>}
            {mintStatus === MintStatus.Success && <span>Congratulations</span>}
            {mintStatus === MintStatus.Failed && (
              <span>Transaction Failed</span>
            )}
          </ModalHeader>
          <ModalBody className="pb-8">
            <TxResult>
              {mintStatus === MintStatus.Minting && (
                <div className="flex flex-col items-center">
                  <Button
                    className="statusBtn"
                    disableAnimation
                    size="lg"
                    isLoading={mintStatus === MintStatus.Minting}
                  ></Button>
                  <p className="text-[#C0C0C0] font-normal text-lg">
                    Please sign the transaction in your wallet.
                  </p>
                </div>
              )}
              {mintStatus === MintStatus.Failed && (
                <div>
                  <img src="/img/transFail.png" alt="" className="statusImg" />
                  <div className="title">{failMessage}</div>
                  <div className="inner">
                    If you have any questions regarding this transaction, please{" "}
                    <a
                      href="https://discord.com/invite/zklink"
                      target="_blank"
                      className="view inline"
                      onClick={mintResultModal.onClose}
                    >
                      contact us
                    </a>{" "}
                    for help
                  </div>
                </div>
              )}
              {mintStatus === MintStatus.Success && (
                <div className="flex flex-col items-center">
                  <p className="text-[#C0C0C0]">You have successfully minted</p>
                  <img
                    src={mintResult?.img}
                    alt=""
                    className="w-[10rem] h-[10rem] rounded-xl my-4 bg-[#3C4550]"
                  />

                  <p className="text-[24px] font-inter font-normal">
                    {mintResult?.name}
                  </p>
                  {mintResult?.name === "Mystery Box" && (
                    <a
                      href={`https://twitter.com/intent/tweet?text=${getTweetShareTextForMysteryBox(
                        invite?.code ?? ""
                      )}`}
                      className="gradient-btn px-6 py-2 mt-4 hover:opacity-85"
                      data-show-count="false"
                      target="_blank"
                    >
                      Share on Twitter/X
                    </a>
                  )}
                  {mintResult?.name === "Mystery Box" && (
                    <Button
                      className="
                      gradient-btn mt-4 px-6"
                      onClick={() =>
                        window.open(MYSTERYBOX_NFT_MARKET_URL, "_blank")
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
    </>
  );
}
