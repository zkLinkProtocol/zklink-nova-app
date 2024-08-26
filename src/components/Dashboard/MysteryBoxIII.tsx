import { drawMystery3, getMystery3Reamin } from "@/api";
import {
  MintStatus,
  NOVA_CHAIN_ID,
  TRADEMARK_NFT_MARKET_URL,
} from "@/constants";
import useNovaNFT from "@/hooks/useNFT";
import { GradientButton } from "@/styles/common";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { useAccount, useBalance, useSwitchChain } from "wagmi";
import DrawAnimationV3 from "../DrawAnimationV3";
import { formatBalance, sleep } from "@/utils";
import { config } from "@/constants/networks";
import toast from "react-hot-toast";
import useNovaDrawNFT, { TrademarkMintParams } from "@/hooks/useNovaNFT";
import { useMintStatus } from "@/hooks/useMintStatus";
import { TxResult } from "./NovaCharacter";

const Container = styled.div`
  border: 1px solid transparent;
  border-radius: 24px;
  position: relative;
  background-color: #09161c;
  background-clip: padding-box; /*important*/
  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: -1;
    margin: -1px;
    border-radius: inherit; /*important*/
    background: linear-gradient(
      175deg,
      #fb2450,
      #fbc82e,
      #6eee3f,
      #5889f3,
      #5095f1,
      #b10af4 60%
    );
  }
`;

const CustomButton = styled(GradientButton)`
  border-radius: 8px;
  background: var(
    --Button-Rainbow,
    linear-gradient(
      90deg,
      #4ba790 0%,
      rgba(251, 251, 251, 0.6) 50.31%,
      #9747ff 100%
    )
  );
  color: #fff;
  text-align: center;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 26px; /* 144.444% */
  letter-spacing: 1px;
`;

const TRADEMARK_TOKEN_ID_MAP: Record<number, string> = {
  1: "Oak Tree Roots",
  2: "Magnifying Glass",
  10: "+100 Nova points",
  12: "+300 Nova points",
};

const PRIZE_ID_NFT_MAP_V2: Record<number, number> = {
  1: 0,
  2: 1,
  10: 2,
  12: 3,
};

const getDrawIndexWithPrizeTokenId = (tokenId: number) => {
  return Object.keys(TRADEMARK_TOKEN_ID_MAP).findIndex(
    (key) => Number(key) === tokenId
  );
};

export default function MysteryBoxIII() {
  const { address, chainId } = useAccount();
  const drawModal = useDisclosure();
  const trademarkMintModal = useDisclosure();
  const drawRef = useRef<{ start: (target: number) => void }>();
  const { nft, loading: mintLoading, sendMintTx, fetchLoading } = useNovaNFT();

  const [drawedNftId, setDrawedNftId] = useState<number>();
  const [drawing, setDrawing] = useState(false);
  const [remainDrawCount, setRemainDrawCount] = useState<number>(0);
  const [update, setUpdate] = useState(0);
  const [trademarkMintStatus, setTrademarkMintStatus] = useState<
    MintStatus | undefined
  >();
  const [mintResult, setMintResult] = useState<{ name: string; img: string }>();
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

  const { switchChain } = useSwitchChain();

  const [trademarkMintParams, setTrademarkMintParams] = useState<{
    tokenId: number;
    nonce: number;
    signature: string;
    expiry: number;
    mintType: number;
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

  const handleDraw = useCallback(async () => {
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

    if (!drawedNftId || drawedNftId === 5) {
      setDrawing(true);
      const res = await drawMystery3(address);

      if (res && res?.result) {
        const { tokenId, nonce, signature, expiry, mintType } = res.result;
        setTrademarkMintParams({ tokenId, nonce, signature, expiry, mintType });
        await drawRef?.current?.start(PRIZE_ID_NFT_MAP_V2[tokenId]);

        if (tokenId === 5) {
          setUpdate((update) => update + 1);
        } else if ([10, 12].includes(tokenId)) {
          await sleep(2000);
          setDrawedNftId(undefined);
          setTrademarkMintStatus(MintStatus.Success);
          setMintResult({
            name: TRADEMARK_TOKEN_ID_MAP[tokenId!],
            img: `/img/m3box-id-${tokenId}.png`,
          });
          trademarkMintModal.onOpen();
          drawModal.onClose();
        } else {
          // const drawPrizeId = PRIZE_ID_NFT_MAP_V2[tokenId];
          setDrawedNftId(tokenId);
        }

        setUpdate((update) => update + 1);
        return; // draw first and then mint as step2.
      }
    }
    let mintParams = { ...trademarkMintParams };

    try {
      //TODO call contract
      trademarkMintModal.onOpen();
      setTrademarkMintStatus(MintStatus.Minting);
      if (!trademarkMintParams) {
        const res = await drawMystery3(address);
        if (res && res.result) {
          const { tokenId, nonce, signature, expiry, mintType } = res.result;
          setTrademarkMintParams({
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
        name: TRADEMARK_TOKEN_ID_MAP[mintParams.tokenId!],
        img: `/img/img-trademark-${mintParams!.tokenId}.png`,
      });
      updateRefreshBalanceId();
      setDrawedNftId(undefined);
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
      getRemainCount();
      setDrawing(false);
    }

    setUpdate((update) => update + 1);
  }, [
    address,
    drawModal,
    drawedNftId,
    isInvaidChain,
    novaBalance,
    sendOldestFriendsTrademarkMintTx,
    switchChain,
    trademarkMintModal,
    trademarkMintParams,
    updateRefreshBalanceId,
  ]);

  const getRemainCount = async () => {
    if (!address) return;
    const res = await getMystery3Reamin(address);
    const { result } = res;

    if (result && result?.remainMintNum) {
      setRemainDrawCount(Number(result.remainMintNum) || 0);
    }

    if (result?.unMintedRecord) {
      const { nftId } = result.unMintedRecord;
      setDrawedNftId(nftId);
    }
  };

  useEffect(() => {
    getRemainCount();
  }, [address, update]);

  return (
    <>
      {remainDrawCount > 0 && (
        <Container className="my-[32px] px-[20px] py-[16px] flex justify-between items-center">
          <div className="flex items-center gap-[12px]">
            <img
              src="/img/img-mystery-box-v2.png"
              alt=""
              width={56}
              height={56}
              className="rounded-[12px]"
            />
            <div className="text-[18px] font-[700] leading-[26px]">
              <p>Mystery Box III</p>
              <p className="mt-[4px]">x{remainDrawCount}</p>
            </div>
          </div>
          <div>
            <CustomButton
              className="px-[32px] py-[15px]"
              onClick={() => drawModal.onOpen()}
            >
              Open
            </CustomButton>
          </div>
        </Container>
      )}

      <Modal
        isDismissable={false}
        classNames={{ closeButton: "text-[1.5rem]" }}
        size="xl"
        isOpen={drawModal.isOpen}
        onOpenChange={drawModal.onOpenChange}
      >
        <ModalContent className="mt-[2rem] py-4 px-4 h-[100vh] overflow-auto h-auto">
          <ModalHeader className="px-0 pt-0 flex flex-col text-xl font-normal">
            Open the Mystery box
          </ModalHeader>
          <DrawAnimationV3
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
            You now have the chance o randomly draw one of the rewards. Please
            notice that Nova points rewards will be directly add to your holding
            points.
          </p>
          <Button
            onClick={handleDraw}
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
                        window.open(TRADEMARK_NFT_MARKET_URL, "_blank")
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
    </>
  );
}
