import {
  Button,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import styled from "styled-components";
import { CardBox } from "@/styles/common";
import { NFT_MARKET_URL, NOVA_CHAIN_ID, MintStatus } from "@/constants";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import DrawAnimation from "@/components/DrawAnimation";
import useSBTNFT from "@/hooks/useNFT";
import useNovaNFT, { MysteryboxMintParams } from "@/hooks/useNovaNFT";
import {
  getRemainMysteryboxDrawCount,
  mintMysteryboxNFT,
  openMysteryboxNFT,
  getRemainMysteryboxOpenableCount,
} from "@/api";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import toast from "react-hot-toast";
import { addNovaChain, sleep } from "@/utils";
import { TxResult } from "@/components/Dashboard/NovaCharacter";
const NftBox = styled.div`
  .nft-left {
    width: 60%;
    padding: 24px;
    .nft-chip:nth-child(3n) {
      margin-right: 0;
    }
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
  .nft-right {
    width: 40%;
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

const ALL_NFTS = [
  { img: "trademark-1.png", name: "Trade mark", balance: 0 },
  { img: "trademark-2.png", name: "Trade mark", balance: 0 },
  { img: "trademark-3.png", name: "Trade mark", balance: 0 },
  { img: "trademark-4.png", name: "Trade mark", balance: 0 },

  { img: "point-booster-1.png", name: "Point Booster 1", balance: 0 },
  { img: "point-booster-2.png", name: "Point Booster 2", balance: 0 },
  { img: "point-booster-3.png", name: "Point Booster 3", balance: 0 },
  { img: "point-booster-4.png", name: "Point Booster 4", balance: 0 },
  { img: "point-booster-5.png", name: "Point Booster 5", balance: 0 },
  { img: "point-booster-6.png", name: "Point Booster 6", balance: 0 },
  { img: "point-booster-7.png", name: "Point Booster 7", balance: 0 },

  { img: "ENTP-LYNK.png", name: "ENTP-LYNK", balance: 0 },
  { img: "ISTP-LYNK.png", name: "LSTP-LYNK", balance: 0 },
  { img: "INFJ-LYNK.png", name: "INFJ-LYNK", balance: 0 },
  { img: "ESFJ-LYNK.png", name: "ESFJ-LYNK", balance: 0 },
];
export default function NFTCard() {
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
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [mintStatus, setMintStatus] = useState<MintStatus | undefined>();
  const [failMessage, setFailMessage] = useState("");
  const { nft: sbtNFT } = useSBTNFT();
  const {
    trademarkNFT,
    boosterNFT,
    lynksNFT,
    mysteryBoxNFT,
    getLynksNFT,
    sendMysteryOpenMintTx,
    sendMysteryMintTx,
    loading: mintLoading,
    novaETHBalance,
    getMysteryboxNFT,
  } = useNovaNFT();
  const { address } = useAccount();
  const [allNFTs, setAllNFTs] =
    useState<{ img: string; name: string; balance: number }[]>(ALL_NFTS);
  const [mintableCount, setMintableCount] = useState(0);
  const [boxTokenIds, setBoxTokenIds] = useState<number[]>([]);
  const [mintParams, setMintParams] = useState<MysteryboxMintParams>();
  const [drawPrizeId, setDrawPrizeId] = useState<number>();
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
      getRemainMysteryboxDrawCount(address).then((res) => {
        const remainNumber = res.result;
        setRemainMintCount(remainNumber);
      });
      //TODO get mystery box balance

      getMysteryboxNFT(address).then((res) => {
        setBoxTokenIds(res ?? []);
        setBoxCount(res?.length ?? 0);
      });
      //TODO get mintabel count
      getRemainMysteryboxOpenableCount(address).then((res) => {
        console.log("getRemainMysteryboxOpenableCount: ", res);
        setMintableCount(res.result);
      });
      openMysteryboxNFT(address).then((res) => {
        const { tokenId, nonce, signature, expiry } = res.result;
        setMintParams({ tokenId, nonce, signature, expiry });
        // setDrawPrizeId(tokenId ? PRIZE_ID_NFT_MAP[tokenId] - 1 : 7); // should use index for active in DrawAnimation component
      });
    }
  }, [address, getMysteryboxNFT, update]);

  useEffect(() => {
    (async () => {
      if (!address || !trademarkNFT || !boosterNFT || !lynksNFT) {
        return;
      }
      const nfts = [];
      const trademarkBalances = await Promise.all(
        [1, 2, 3, 4].map((item) => trademarkNFT.read.balanceOf([address, item]))
      );
      console.log("trademarkBalances: ", trademarkBalances);
      for (let i = 0; i < 4; i++) {
        nfts.push({ ...ALL_NFTS[i], balance: Number(trademarkBalances[i]) });
      }
      const boosterBalances = await Promise.all(
        Object.keys(PRIZE_ID_NFT_MAP).map((item) =>
          boosterNFT.read.balanceOf([address, item])
        )
      );
      console.log("boosterBalances: ", boosterBalances);
      for (let i = 0; i < 7; i++) {
        nfts.push({ ...ALL_NFTS[i + 4], balance: Number(boosterBalances[i]) });
      }
      const lynksBalances = await getLynksNFT(address);
      console.log("lynksBalances: ", lynksBalances);
      setAllNFTs(nfts);
      //TODO set lynks balance
    })();
  }, [address, boosterNFT, lynksNFT, trademarkNFT, getLynksNFT, update]);

  const onMintSubmit = async () => {
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
    if (novaETHBalance === 0) {
      toast.error("Insuffcient gas for mint transaction.");
      return;
    }
    try {
      setMinting(true);
      setMintStatus(MintStatus.Minting);
      mintResultModal.onOpen();
      const res = await mintMysteryboxNFT(address);
      await sendMysteryMintTx(res.result);
      setUpdate((update) => update + 1);
      setMintStatus(MintStatus.Success);
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
    if (!mysteryBoxNFT || !address || boxTokenIds.length === 0) return;
    try {
      setOpening(true);
      await mysteryBoxNFT.write.burn([boxTokenIds[0]]);
      getRemainMysteryboxOpenableCount(address).then((res) => {
        console.log("getRemainMysteryboxOpenableCount: ", res);
        setMintableCount(res.result);
      });
      setUpdate(() => update + 1);
      setOpening(false);
    } catch (e) {
      console.error(e);
    } finally {
      setOpening(false);
    }
  }, [address, boxTokenIds, mysteryBoxNFT, update]);

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
            addNovaChain().then(() => switchChain({ chainId: NOVA_CHAIN_ID }));
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
      setDrawing(true);
      if (!mintParams) {
        const res = await openMysteryboxNFT(address);
        if (res && res.result) {
          const { tokenId, nonce, signature, expiry } = res.result;
          setMintParams({ tokenId, nonce, signature, expiry });
          //do the draw animation. tokenId means prize is bootster; no tokenId means prize is lynks,use 8 to make draw animation works
          drawRef?.current?.start(tokenId ? PRIZE_ID_NFT_MAP[tokenId] - 1 : 7); // use index of img for active
          await sleep(5000); //wait for draw animation ends
          params = res.result;
        }
      } else {
        params = { ...mintParams };
        drawRef?.current?.start(
          mintParams.tokenId ? PRIZE_ID_NFT_MAP[mintParams.tokenId] - 1 : 7
        ); // use index of img for active
        await sleep(10000); //wait for draw animation ends
      }
      if (!params) {
        toast.error("No mint oppertunities left.");
        return;
      }
      setMintStatus(MintStatus.Minting);
      mintResultModal.onOpen();
      await sendMysteryOpenMintTx(params);
      setMintStatus(MintStatus.Success);
      setUpdate((update) => update + 1);
    } catch (e) {
      console.error(e);
      setMintStatus(MintStatus.Failed);
      if (e.message) {
        if (e.message.includes("rejected the request")) {
          setFailMessage("User rejected the request");
        }
      }
    } finally {
      setDrawing(false);
    }
  }, [
    address,
    drawing,
    isInvaidChain,
    mintParams,
    mintResultModal,
    mintStatus,
    novaETHBalance,
    sendMysteryOpenMintTx,
    switchChain,
  ]);

  return (
    <>
      <NftBox className="flex justify-between  rounded-lg mt-8">
        <CardBox className="nft-left">
          <div className="flex justify-between">
            <div>
              <p className="nft-left-title">Nova NFTs</p>
              <p className="nft-left-sub-title">
                Invite to earn more pieces and upgrade your Nova Char
              </p>
            </div>
            <Button className="gradient-btn">Buy</Button>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-8">
            {allNFTs.map((item, index) => (
              <div className="nft-chip relative   w-[170px] " key={index}>
                <img src={`/img/img-${item.img}`} alt="" />
                {/* <div className='relative bg-slate-50 h-24 w-8/12 m-auto'> */}
                <div className="nft-info">
                  <span className="nft-name">{item.name}</span>
                  <span className="nft-balance">x{item.balance}</span>
                </div>
              </div>
            ))}
          </div>
        </CardBox>

        <CardBox className="nft-right ml-10">
          <div className="text-xl flex items-center mb-8">
            <span>Mystery Box</span>
            <img
              src="/img/icon-tips-white.png"
              alt=""
              className="w-[14px] h-[14px] ml-1"
            />
          </div>
          <div className=" w-[384px] h-[300px] mb-8">
            <img
              src="/img/img-mystery-box.png"
              className="h-[100%] mx-auto object-contain"
            />
          </div>
          <Button
            className="gradient-btn mb-2 w-full"
            onClick={onOpen}
            disabled={boxCount === 0}
          >
            Open Your Box ({boxCount})
          </Button>
          <Button
            className="gradient-btn mb-2 w-full"
            onClick={onMint}
            disabled={remainMintCount === 0}
          >
            Mint Your Box ({remainMintCount})
          </Button>
          <Button
            className="gradient-btn  w-full"
            onClick={() => window.open(NFT_MARKET_URL, "_blank")}
          >
            Trade in Alienswap
          </Button>
        </CardBox>
      </NftBox>

      <Modal
        classNames={{ closeButton: "text-[1.5rem]" }}
        size="xl"
        isOpen={openBoxModal.isOpen}
        onOpenChange={openBoxModal.onOpenChange}
      >
        <ModalContent className="mb-[5.75rem]">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Open the Mystery box
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center ">
                  <DrawAnimation
                    type="MysteryBox"
                    ref={drawRef}
                    onDrawEnd={() => {
                      setDrawing(false);
                    }}
                    sbtNFT={sbtNFT}
                    targetImageIndex={drawPrizeId}
                  />
                  <p className="text-[#fff] text-[24px] font-normal my-2 text-center font-satoshi">
                    Mystery Box Left:{" "}
                    <span className="text-[#43E3B5]">{boxCount}</span>
                  </p>
                  <p className="text-center text-[#C0C0C0] mb-4">
                    You will have a chance to randomly mint some booster NFT.
                    However, you must mint your booster NFT before you can enter
                    another lucky draw.
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="w-full">
                  <div className="w-full flex items-center justify-between gap-4">
                    <Button
                      className="gradient-btn w-full h-[58px] py-[1rem] flex justify-center items-center gap-[0.38rem] text-[1.25rem]  mb-4"
                      onClick={onOpenSubmit}
                      isLoading={opening}
                      isDisabled={boxCount === 0}
                    >
                      {isInvaidChain && "Switch Network"}
                      {!isInvaidChain && opening ? "Opening" : "Open"}
                    </Button>
                    <Button
                      className="gradient-btn w-full h-[58px] py-[1rem] flex justify-center items-center gap-[0.38rem] text-[1.25rem]  mb-4"
                      onClick={onDrawMintSubmit}
                      isLoading={drawing}
                      isDisabled={mintableCount === 0}
                    >
                      {isInvaidChain && "Switch Network"}
                      {!isInvaidChain && drawing ? "Minting" : "Mint"}
                    </Button>
                  </div>

                  <Button
                    className="secondary-btn w-full h-[58px] py-[1rem] flex justify-center items-center gap-[0.38rem] text-[1.25rem]  "
                    onClick={() => {
                      window.open(NFT_MARKET_URL, "_blacnk");
                    }}
                  >
                    Buy from Alienswap
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
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
                    src="/img/img-mystery-box-temp.png"
                    className="w-[330px] h-[330px] mb-6"
                  />
                  <p className="text-[24px] font-satoshi ">
                    Minting oppertunities:{" "}
                    <span className="text-green">{remainMintCount}</span>
                  </p>
                  <p className="text-gray text-[16px] font-normal">
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
                    {!isInvaidChain && mintLoading ? "Minting" : "Mint"}
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        classNames={{ closeButton: "text-[1.5rem]" }}
        style={{ minHeight: "300px", backgroundColor: "rgb(38, 43, 51)" }}
        isOpen={mintResultModal.isOpen}
        onOpenChange={mintResultModal.onOpenChange}
        className="trans"
      >
        <ModalContent className="mt-[2rem] py-5 px-6 mb-[5.75rem]">
          <ModalHeader className="px-0 pt-0 flex flex-col text-xl font-normal">
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
                  <img
                    src={
                      mintBoxModal.isOpen
                        ? "/img/img-mystery-box.png"
                        : mintParams?.tokenId
                        ? `/img/img-point-booster-${
                            PRIZE_ID_NFT_MAP[mintParams.tokenId]
                          }.png`
                        : lynksNFTImg
                    }
                    alt=""
                    className="w-[10rem] h-[10rem] rounded-3xl mb-4"
                  />
                  <p className="text-[#C0C0C0]">You have successfully minted</p>
                  <p className="text-[#03D498]">
                    {mintBoxModal.isOpen && "Mystery Box"}
                    {openBoxModal.isOpen && mintParams?.tokenId
                      ? "Point Booster"
                      : "Lynks NFT"}
                  </p>
                </div>
              )}
              <div className="mt-6">
                {mintStatus === MintStatus.Success && (
                  <Button
                    className="w-full gradient-btn mb-6"
                    onClick={() => window.open(NFT_MARKET_URL, "_blank")}
                  >
                    Trade in Alienswap
                  </Button>
                )}
                <Button
                  className="w-full secondary-btn"
                  onClick={() => mintResultModal.onClose()}
                >
                  Close
                </Button>
              </div>
            </TxResult>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
