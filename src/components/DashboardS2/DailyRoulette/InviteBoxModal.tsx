import { drawTrademarkNFT } from "@/api";
import { getPointsRewardsTooltips } from "@/components/Dashboard/PointsRewardsTooltips";
import DrawAnimation from "@/components/DrawAnimation";
import {
  LYNKS_NFT_MARKET_URL,
  MintStatus,
  NOVA_CHAIN_ID,
  TRADEMARK_NFT_MARKET_URL,
} from "@/constants";
import { config } from "@/constants/networks";
import { useMintStatus } from "@/hooks/useMintStatus";
import useNovaNFT from "@/hooks/useNFT";
import useNovaDrawNFT, { TrademarkMintParams } from "@/hooks/useNovaNFT";
import { formatBalance, sleep } from "@/utils";
import { eventBus } from "@/utils/event-bus";
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
import { UseDisclosureReturn } from "@nextui-org/use-disclosure";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import { useAccount, useBalance, useSwitchChain } from "wagmi";

const TRADEMARK_TOKEN_ID_MAP: Record<number, string> = {
  8: "+10 Nova points",
  9: "+50 Nova points",
};

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

interface IProps {
  modalInstance: UseDisclosureReturn;
  remainDrawCount: number;
  drawedNftId: number | undefined;
  setDrawedNftId: Dispatch<SetStateAction<number | undefined>>;
  setUpdate: Dispatch<SetStateAction<number>>;
}
const InviteBoxModal = (props: IProps) => {
  const {
    modalInstance,
    remainDrawCount,
    drawedNftId,
    setDrawedNftId,
    setUpdate,
  } = props;
  const trademarkMintModal = useDisclosure();

  const { address, chainId } = useAccount();
  const { nft, loading: mintLoading, sendMintTx, fetchLoading } = useNovaNFT();
  const drawRef = useRef<{ start: (target: number) => void }>();
  const [drawing, setDrawing] = useState(false);
  const [trademarkMintStatus, setTrademarkMintStatus] = useState<
    MintStatus | undefined
  >();
  const [mintResult, setMintResult] = useState<{ name: string; img: string }>();

  const [trademarkMintParams, setTrademarkMintParams] = useState<{
    tokenId: number;
    nonce: number;
    signature: string;
    expiry: number;
  }>();

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
  const [failMessage, setFailMessage] = useState("");

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

  const getDrawIndexWithPrizeTokenId = (tokenId: number) => {
    return Object.keys(TRADEMARK_TOKEN_ID_MAP).findIndex(
      (key) => Number(key) === tokenId
    );
  };

  const { switchChain } = useSwitchChain();

  const lynksNFTImg = useMemo(() => {
    console.log("nft", nft);

    if (nft) {
      return `/img/img-mystery-box-lynks-${nft.name}.png`;
    } else {
      return `/img/img-mystery-box-lynks-ENTP.png`;
    }
  }, [nft]);

  const handleDrawAndMint = useCallback(async () => {
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
          modalInstance.onClose();
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
      modalInstance.onClose();
    }

    setUpdate((update) => update + 1);
  }, [
    address,
    modalInstance,
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

  const mintPointsTips = useMemo(() => {
    const isNovaPoints =
      mintResult?.name && mintResult.name.toLowerCase().includes("nova points");

    if (isNovaPoints) {
      let match = mintResult.name.match(/\d+/);
      let key = match ? parseInt(match[0]) : 0;

      return getPointsRewardsTooltips(key);
    }
  }, [mintResult]);

  return (
    <>
      <Modal
        isDismissable={false}
        classNames={{ closeButton: "text-[1.5rem]" }}
        style={{ minHeight: "300px", backgroundColor: "#000811" }}
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
                    {mintResult?.name.toLowerCase().includes("nova points")
                      ? "You have received"
                      : "You have successfully minted"}
                  </p>
                  <img
                    src={mintResult?.img}
                    alt=""
                    className="w-[10rem] h-[10rem] rounded-xl my-4 bg-[#3C4550]"
                  />

                  <p className="text-[24px] font-inter font-normal">
                    {mintResult?.name}
                  </p>

                  {mintResult?.name.toLowerCase().includes("nova points") &&
                    !!mintPointsTips && (
                      <p className="my-2 text-[14px] text-center text-[#C0C0C0]">
                        {mintPointsTips}
                      </p>
                    )}
                </div>
              )}
              {trademarkMintStatus === MintStatus.Success && (
                <div className="mt-6">
                  {mintResult?.name.toLowerCase().includes("nova points") ? (
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
                      Trade
                    </Button>
                  )}
                </div>
              )}
            </TxResult>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isDismissable={false}
        classNames={{ closeButton: "text-[1.5rem]" }}
        size="md"
        isOpen={modalInstance.isOpen}
        onOpenChange={modalInstance.onOpenChange}
      >
        <ModalContent className="mb-[5.75rem]">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Open your Invite Box
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center">
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

                  <p className="text-white font-chakra text-[14px] mt-4 text-center">
                    With each referral, you'll have the chance to randomly draw
                    one of the invite rewards. Please notice that Hodling points
                    rewards are not NFT, they'll be added directly to your
                    Hodling Points.
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="flex flex-col w-full">
                  <Button
                    className="w-full gradient-btn mb-3"
                    isDisabled={
                      !isInvaidChain &&
                      (novaBalance === 0 || remainDrawCount === 0)
                    }
                    isLoading={mintLoading || drawing}
                    onClick={handleDrawAndMint}
                  >
                    {isInvaidChain && "Switch to Nova network to draw"}
                    {!isInvaidChain &&
                      (!drawedNftId || drawedNftId === 5 || drawing) &&
                      `Draw ( ${remainDrawCount} )`}
                    {!isInvaidChain &&
                      !!drawedNftId &&
                      drawedNftId !== 5 &&
                      !drawing &&
                      "Mint"}
                  </Button>
                  <Button className="w-full " onClick={onClose}>
                    Invite More
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default InviteBoxModal;
