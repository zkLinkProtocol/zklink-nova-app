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
import { useRef, useState } from "react";
import { dailyOpen } from "@/api";
import { sleep } from "@/utils";
import useNovaNFT, { MysteryboxMintParams } from "@/hooks/useNovaNFT";
import { MintStatus, TRADEMARK_NFT_MARKET_URL } from "@/constants";
import { TxResult } from "@/components/Dashboard/NovaCharacter";

interface IProps {
  modalInstance: UseDisclosureReturn;
  onDrawed: () => void;
}
export const PrizeItems = [
  {
    name: "Nova +1 Booster",
    img: "/img/img-point-plus-1.png",
  },
  {
    name: "Nova +50 Booster",
    img: "/img/img-point-plus-10.png",
  },
  {
    name: "Nova +50 Booster",
    img: "/img/img-point-plus-50.png",
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
  8: 1,
  9: 2,
};
const DailyDrawModal: React.FC<IProps> = (props: IProps) => {
  const [spinging, setSpinging] = useState(false);
  const [minting, setMinting] = useState(false);
  const [mintStatus, setMintStatus] = useState<MintStatus | undefined>();
  const [failMessage, setFailMessage] = useState("");

  const { sendTrademarkMintTx } = useNovaNFT();
  const { modalInstance, onDrawed } = props;
  const drawRef = useRef<{ start: (target: number) => void }>();
  const [mintResult, setMintResult] = useState<{ name: string; img: string }>();
  const mintResultModal = useDisclosure();
  const handleDrawEnd = () => {};

  const handleSpin = async () => {
    //TODO call api
    const res = await dailyOpen();
    const tokenId = res.result.tokenId as number;
    const prizeId = PRIZE_MAP[tokenId];
    setSpinging(true);
    await drawRef.current?.start(prizeId);
    const prize = PrizeItems[PRIZE_MAP[tokenId]];
    setMintResult({
      name: prize.name,
      img: prize.img,
    });
    if ([1, 2, 3, 4].includes(tokenId)) {
      await sleep(2000); // show nft
      setMinting(true);
      const { tokenId, nonce, signature, expiry } = res.result;
      const mintParams = { tokenId, nonce, signature, expiry };

      try {
        await sendTrademarkMintTx(mintParams);
        setMintStatus(MintStatus.Success);
        mintResultModal.onOpen();
      } catch (e) {
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
        setSpinging(false);
      }
    } else {
      setMintStatus(MintStatus.Success);
      mintResultModal.onOpen();
      setSpinging(false);
    }
    onDrawed();
  };

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
                />
                <SpinPointer>
                  <img src="/img/s2/icon-daily-spin-pointer.png" alt="" />
                </SpinPointer>
              </ModalBody>
              <ModalFooter>
                <div className="flex flex-col w-full">
                  <SpinButton
                    onClick={handleSpin}
                    isLoading={spinging}
                    disabled={minting || spinging}
                  >
                    <img
                      src={
                        minting
                          ? "/img/s2/icon-daily-mint.svg"
                          : "/img/s2/icon-spin.svg"
                      }
                      alt=""
                    />
                    <span>
                      {minting ? "Start Minting" : "Spin Your Daily Roulette"}
                    </span>
                  </SpinButton>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </ModalContainer>
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

                  <Button
                    className="
                    gradient-btn mt-4 px-6"
                    onClick={() =>
                      window.open(TRADEMARK_NFT_MARKET_URL, "_blank")
                    }
                  >
                    Trade on OKX NFT Marketplace
                  </Button>
                </div>
              )}
            </TxResult>
          </ModalBody>
        </ModalContent>
      </Modal>
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
`;
export default DailyDrawModal;
