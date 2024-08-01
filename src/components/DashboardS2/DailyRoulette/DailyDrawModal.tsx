import styled from "styled-components";
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
import Marquee from "@/components/Marquee";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import {
  dailyOpen,
  openProtocolSpin,
  dailySkipMint,
  protocolSkipMint,
} from "@/api";
import { sleep } from "@/utils";
import useNovaNFT, {
  MysteryboxMintParams,
  TrademarkMintParams,
} from "@/hooks/useNovaNFT";
import {
  MintStatus,
  TRADEMARK_NFT_MARKET_URL,
  NOVA_CHAIN_ID,
} from "@/constants";
import { TxResult } from "@/components/Dashboard/NovaCharacter";
import { useAccount, useSwitchChain } from "wagmi";
import { useUpdateNftBalanceStore } from "@/hooks/useUpdateNftBalanceStore";

interface IProps {
  modalInstance: UseDisclosureReturn;
  onDrawed: () => void;
  remain?: number;
  type?: "daily" | "protocol";
  projectName?: string;
}
export const PrizeItems = [
  {
    name: "Nova +1 Booster",
    img: "/img/img-point-plus-1.png",
    points: 1,
    tooltip: "Equivalent to depositing 0.1 ETH into Nova for ~16 hours",
  },
  {
    name: "Nova +3 Booster",
    img: "/img/img-point-plus-3.png",
    points: 3,
    tooltip: "Equivalent to depositing 0.1 ETH into Nova for ~48 hours",
  },
  {
    name: "Nova +10 Booster",
    img: "/img/img-point-plus-10.png",
    points: 10,
    tooltip: "Equivalent to depositing 0.1 ETH into Nova for ~160 hours",
  },

  { name: "Binary Code Metrix Cube", img: "/img/img-trademark-4.png" },
  { name: "Chess Knight", img: "/img/img-trademark-3.png" },
  { name: "Magnifying Glass", img: "/img/img-trademark-2.png" },
  { name: "Oak Tree Roots", img: "/img/img-trademark-1.png" },
];
// PRIZE ID -> draw item index
const PRIZE_MAP: Record<number, number> = {
  1: 6,
  2: 5,
  3: 4,
  4: 3,
  6: 0,
  11: 1,
  8: 2,
};
const DailyDrawModal: React.FC<IProps> = (props: IProps) => {
  const { address, chainId } = useAccount();
  const [spinging, setSpinging] = useState(false);
  const [minting, setMinting] = useState(false);
  const [mintStatus, setMintStatus] = useState<MintStatus | undefined>();
  const [failMessage, setFailMessage] = useState("");
  const { switchChain } = useSwitchChain();
  const { updateFactor } = useUpdateNftBalanceStore();

  const { sendTrademarkMintTx } = useNovaNFT();
  const { modalInstance, onDrawed, remain, type, projectName } = props;
  const drawRef = useRef<{ start: (target: number) => void }>();
  const [mintResult, setMintResult] = useState<{
    name: string;
    img: string;
    points?: number;
    tooltip?: string;
  }>();
  const [mintParams, setMintParams] = useState<TrademarkMintParams>();
  const mintResultModal = useDisclosure();
  const handleDrawEnd = () => {};

  const isInvaidChain = useMemo(() => {
    return chainId !== NOVA_CHAIN_ID;
  }, [chainId]);

  const handleSpin = useCallback(async () => {
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
    if (!modalInstance.isOpen) {
      modalInstance.onOpen();
    }
    setSpinging(true);
    const res =
      type === "protocol" && projectName
        ? await openProtocolSpin(projectName)
        : await dailyOpen();
    const tokenId = res.result.tokenId as number;
    const prizeId = PRIZE_MAP[tokenId];
    onDrawed(); // update remain times
    await drawRef.current?.start(prizeId);
    const prize = PrizeItems[PRIZE_MAP[tokenId]];
    setMintResult({
      ...prize,
    });
    if (tokenId <= 4) {
      const { tokenId, nonce, signature, expiry, mintType } = res.result;
      const mintParams = {
        tokenId,
        nonce,
        signature,
        expiry,
        method: "safeMintCommon",
        mintType,
      };
      setMintParams(mintParams);
    } else {
      setMintStatus(MintStatus.Success);
      mintResultModal.onOpen();
    }
    setSpinging(false);
    if (!remain || remain <= 1) {
      modalInstance.onClose();
    }
  }, [
    address,
    isInvaidChain,
    mintResultModal,
    modalInstance,
    onDrawed,
    remain,
    switchChain,
  ]);

  const handleMint = useCallback(async () => {
    if (!mintParams) {
      return;
    }
    try {
      setMinting(true);
      await sendTrademarkMintTx(mintParams);
      setMintStatus(MintStatus.Success);
      mintResultModal.onOpen();
      onDrawed(); // update remain times after mint tx
      setMintParams(undefined);
      updateFactor();
    } catch (e: any) {
      console.log(e);
      setMintStatus(MintStatus.Failed);
      if (e.message) {
        if (e.message.includes("rejected the request")) {
          setFailMessage("User rejected the request");
        } else {
          setFailMessage(e.message);
        }
      }
    } finally {
      setMinting(false);
    }
  }, [
    mintParams,
    mintResultModal,
    onDrawed,
    sendTrademarkMintTx,
    updateFactor,
  ]);

  const handleSkip = async () => {
    type === "protocol" && projectName
      ? await protocolSkipMint(projectName)
      : await dailySkipMint();
    setMintParams(undefined);
    mintResultModal.onClose();
    onDrawed(); // update remain times after skip
  };

  useEffect(() => {
    if (!modalInstance.isOpen) {
      setMinting(false);
      setSpinging(false);
    }
  }, [modalInstance.isOpen]);

  const btnText = useMemo(() => {
    if (isInvaidChain) {
      return "Switch Network";
    } else if (minting) {
      return "Start Minting";
    } else {
      return `Spin Your Daily Roulette (${remain})`;
    }
  }, [isInvaidChain, minting, remain]);

  return (
    <>
      <ModalContainer
        isDismissable={false}
        classNames={{ closeButton: "text-[1.5rem]" }}
        size="md"
        isOpen={modalInstance.isOpen}
        onOpenChange={modalInstance.onOpenChange}
      >
        <ModalContent className="mb-[5.75rem]">
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Daily Roulette
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center">
                  <Divide />
                  <p className="text-neutral font-chakra text-[14px] mt-4 ">
                    On a daily basis, each user has x times of opportunity to
                    participate in a Roulette game on the campaign page. Users
                    have the probability to win trademarks and Lynks. The
                    minimum reward will be 1 Nova Points.
                  </p>
                </div>
                <Marquee
                  ref={drawRef}
                  onDrawEnd={handleDrawEnd}
                  PrizeItems={PrizeItems}
                  targetIndex={
                    mintParams ? PRIZE_MAP[mintParams.tokenId] : undefined
                  }
                />
                <SpinPointer>
                  <img src="/img/s2/icon-daily-spin-pointer.png" alt="" />
                </SpinPointer>
              </ModalBody>
              <ModalFooter>
                {!mintParams && (
                  <div className="flex flex-col w-full">
                    <SpinButton
                      onClick={handleSpin}
                      isLoading={spinging}
                      disabled={minting || spinging || !remain}
                    >
                      <img
                        src={
                          spinging
                            ? "/img/s2/icon-spin.svg"
                            : "/img/s2/icon-daily-mint.svg"
                        }
                        alt=""
                      />
                      <span>{btnText}</span>
                    </SpinButton>
                  </div>
                )}
                {mintParams && (
                  <div className="flex w-full gap-4 justify-between">
                    <SpinButton
                      onClick={handleSkip}
                      isLoading={spinging}
                      disabled={minting || spinging || !remain}
                    >
                      <span>Skip</span>
                    </SpinButton>
                    <SpinButton
                      onClick={handleMint}
                      isLoading={minting}
                      disabled={minting || spinging || !remain}
                    >
                      {!minting && (
                        <img src={"/img/s2/icon-daily-mint.svg"} alt="" />
                      )}
                      <span>Mint</span>
                    </SpinButton>
                  </div>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </ModalContainer>
      <ModalContainer
        isDismissable={false}
        classNames={{ closeButton: "text-[1.5rem]" }}
        style={{ minHeight: "300px", backgroundColor: "rgb(38, 43, 51)" }}
        isOpen={mintResultModal.isOpen}
        onOpenChange={mintResultModal.onOpenChange}
        className="trans"
      >
        <ModalContent className="mt-[2rem] py-5  mb-[5.75rem]">
          <ModalHeader className="px-5 pt-0 flex flex-col text-xl font-normal ">
            {mintStatus === MintStatus.Minting && <span>Minting</span>}
            {mintStatus === MintStatus.Success && (
              <span className="text-[#03D498] font-900 text-[24px]">
                Congratulations
              </span>
            )}
            {mintStatus === MintStatus.Failed && (
              <span>Transaction Failed</span>
            )}
          </ModalHeader>
          <ModalBody className="pb-8">
            <Divide />
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
                  {mintResult?.points && (
                    <p className="prize-text">
                      You’ve Receive{" "}
                      <span className="text-white">
                        {mintResult?.points} Holding Points
                      </span>{" "}
                      , Please note that it will be added directly to your
                      holding points.
                    </p>
                  )}
                  {mintResult?.img.includes("trademark") && (
                    <p className="prize-text">
                      You’ve Receive a{" "}
                      <span className="text-white">{mintResult?.name}</span>.
                      You can mint a Lynks after collecting all four Trademarks.
                    </p>
                  )}
                  <img
                    src={mintResult?.img}
                    alt=""
                    className="w-[10rem] h-[10rem] rounded-xl my-4"
                  />
                  {mintResult?.tooltip && (
                    <p className="prize-text-sub">{mintResult?.tooltip}</p>
                  )}
                  {mintResult?.img.includes("trademark") && (
                    <SpinButton
                      className="mt-3"
                      onClick={() =>
                        window.open(TRADEMARK_NFT_MARKET_URL, "_blank")
                      }
                    >
                      Trade on OKX
                    </SpinButton>
                  )}

                  {Number(remain) > 0 && (
                    <SpinButton
                      className="
                    spin-btn mt-4 px-6"
                      onClick={() => {
                        mintResultModal.onClose();
                        handleSpin();
                      }}
                    >
                      <img
                        src={
                          minting
                            ? "/img/s2/icon-daily-mint.svg"
                            : "/img/s2/icon-spin.svg"
                        }
                        alt=""
                      />
                      <span>Re-Spin</span>
                    </SpinButton>
                  )}
                  {!remain && (
                    <SpinButton
                      className="
                    spin-btn mt-4 px-6"
                      onClick={() => {
                        mintResultModal.onClose();
                        modalInstance.onClose();
                      }}
                    >
                      <span>Confirm</span>
                    </SpinButton>
                  )}
                </div>
              )}
            </TxResult>
          </ModalBody>
        </ModalContent>
      </ModalContainer>
    </>
  );
};

const Divide = styled.div`
  opacity: 0.75;
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(251, 251, 251, 0.6) 51.5%,
    rgba(255, 255, 255, 0) 100%
  );
`;
const SpinButton = styled(Button)`
  border-radius: 73.785px;
  background: #1d4138;
  box-shadow: 0px 2.306px 18.446px 0px rgba(0, 0, 0, 0.15),
    0px 0px 13.835px 0px rgba(255, 255, 255, 0.75) inset;
  height: 54px;
  gap: 8px;
  color: #fff;
  text-align: center;
  font-family: Satoshi;
  font-size: 18.446px;
  font-style: normal;
  font-weight: 900;
  line-height: normal;
  text-transform: capitalize;
  width: 100%;
`;

const SpinPointer = styled.div`
  position: absolute;
  bottom: 0px;
  left: 50%;
  right: 0;
  transform: translateX(-50%);
  width: 100%;
  z-index: -1;
`;
const ModalContainer = styled(Modal)`
  background: url("img/s2/bg-spin-container.svg") no-repeat;
  background-size: cover;
  width: 400px;
  .prize-text {
    color: var(--Neutral-2, rgba(251, 251, 251, 0.6));
    font-family: Satoshi;
    font-size: 16.14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  .prize-text-sub {
    color: var(--Neutral-2, rgba(251, 251, 251, 0.6));
    text-align: center;
    font-family: Satoshi;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
`;
export default DailyDrawModal;
