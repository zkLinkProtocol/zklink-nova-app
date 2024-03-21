import { NOVA_CHAIN_ID } from "@/constants";
import useNovaNFT, { NOVA_NFT_TYPE } from "@/hooks/useNFT";
import { CardBox } from "@/styles/common";
import { addNovaChain, formatBalance } from "@/utils";
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
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useAccount, useBalance, useChainId, useSwitchChain } from "wagmi";
import { config } from "@/constants/networks";
import { getRemainDrawCount, getRemainMintCount } from "@/api";
import Marquee from "../Marquee";
import styled from "styled-components";

const TxResult = styled.div`
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
    margin-left: calc(50% - 48px);
    margin-bottom: 50px;
  }
`;

const enum MintStatus {
  Minting = "Minting",
  Failed = "Failed",
  Success = "Success",
}
export default function NovaCharacter() {
  const mintModal = useDisclosure();
  const drawModal = useDisclosure();
  const trademarkMintModal = useDisclosure();
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const { nft, loading: mintLoading, sendMintTx, fetchLoading } = useNovaNFT();
  const [mintType, setMintType] = useState<NOVA_NFT_TYPE>("ISTP");
  const [remainDrawCount, setRemainDrawCount] = useState<number>(0);
  const [remainMintCount, setRemainMintCount] = useState(0);
  const [update, setUpdate] = useState(0);
  const [trademarkMintStatus, setTrademarkMintStatus] = useState<
    MintStatus | undefined
  >();
  const [trademarkMinting, setTrademarkMinting] = useState(false);
  useEffect(() => {
    if (address) {
      getRemainDrawCount(address).then((res) => {
        console.log("remain draw count: ", res);
        setRemainDrawCount(res.result);
      });
      getRemainMintCount(address).then((res) => {
        console.log("remain mint count: ", res);
        setRemainMintCount(res.result);
      });
    }
  }, [address, update]);

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

  const handleMintTrademark = useCallback(async () => {
    if (remainDrawCount > 0) {
      drawModal.onOpen();
    }
  }, [drawModal, remainDrawCount]);

  const handleDrawAndMint = useCallback(async () => {
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
    setUpdate((update) => update + 1);
  }, []);

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

  return (
    <>
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
        <div className="flex items-center w-full">
          <Button
            className="gradient-btn flex-1 py-[1rem] flex justify-center items-center gap-[0.38rem] text-[1.25rem] mr-4"
            onClick={handleMintTrademark}
          >
            Mint trademark ({remainDrawCount})
          </Button>
          <Tooltip content={nft ? "coming soon" : ""} isOpen={showTooltip1}>
            <Button
              onClick={handleMintNow}
              onMouseEnter={() => nft && setShowTooltip1(true)}
              onMouseLeave={() => nft && setShowTooltip1(false)}
              onTouchStart={() => nft && setShowTooltip1((prev) => !prev)}
              isLoading={fetchLoading || mintLoading}
              className={classNames(
                "gradient-btn flex-1  py-[1rem] flex justify-center items-center gap-[0.38rem] text-[1.25rem] ",
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
        </div>
      </CardBox>
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
      <Modal
        classNames={{ closeButton: "text-[1.5rem]" }}
        isOpen={drawModal.isOpen}
        onOpenChange={drawModal.onOpenChange}
      >
        <ModalContent className="mt-[2rem] py-5 px-6 mb-[5.75rem]">
          <ModalHeader className="px-0 pt-0 flex flex-col text-xl font-normal">
            Draw and Mint your Trademark NFTs
          </ModalHeader>
          <Marquee />
          {/* <div className="grid grid-cols-2 place-content-center gap-4 w-auto mx-auto">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center justify-center">
                <img
                  src={`/img/img-trademark-temp-${item}.png`}
                  alt=""
                  className="w-[160px] h-[160px]"
                />
              </div>
            ))}
          </div> */}
          <p className="text-[#fff] text-[24px] font-normal text-xs my-4 text-center font-satoshi">
            Draw Oppertunities:{" "}
            <span className="text-[#43E3B5]">{remainDrawCount}</span>
          </p>
          <p className="text-center text-[#C0C0C0] mb-4">
            You will have a chance to randomly mint some mystery NFT if you are
            top 100 in the daily referral leaderboard (first come first in) or
            if you are lucky enough
          </p>
          <Button
            onClick={handleMint}
            isDisabled={!isInvaidChain && novaBalance === 0}
            isLoading={mintLoading}
            className="gradient-btn w-full h-[58px] py-[1rem] flex justify-center items-center gap-[0.38rem] text-[1.25rem]  mb-4"
          >
            <span>
              {isInvaidChain ? "Switch to Nova network to mint" : "Dray & Mint"}
            </span>
          </Button>
          <Button
            onClick={handleMint}
            isDisabled={!isInvaidChain && novaBalance === 0}
            isLoading={mintLoading}
            className="secondary-btn w-full h-[58px] py-[1rem] flex justify-center items-center gap-[0.38rem] text-[1.25rem]  "
          >
            <span>Trade in the market</span>
          </Button>
        </ModalContent>
      </Modal>

      <Modal
        classNames={{ closeButton: "text-[1.5rem]" }}
        style={{ minHeight: "300px", backgroundColor: "rgb(38, 43, 51)" }}
        size="xl"
        isOpen={trademarkMintModal.isOpen}
        onOpenChange={trademarkMintModal.onOpenChange}
        className="trans"
      >
        <ModalContent className="mb-[5.75rem]">
          <ModalHeader className="px-0 pt-0 flex flex-col text-xl font-normal">
            {trademarkMintStatus === MintStatus.Minting && <span>Minting</span>}
            {trademarkMintStatus === MintStatus.Success && (
              <span>Congratulations</span>
            )}
            {trademarkMintStatus === MintStatus.Failed && (
              <span>Transaction Failed</span>
            )}
          </ModalHeader>
          <ModalBody className="pb-8">
            <TxResult>
              {trademarkMintStatus === MintStatus.Minting && (
                <Button
                  className="statusBut"
                  disableAnimation
                  size="lg"
                  isLoading={trademarkMinting}
                ></Button>
              )}
              {trademarkMintStatus === MintStatus.Failed && (
                <img src="/img/transFail.png" alt="" className="statusImg" />
              )}
              {trademarkMintStatus === MintStatus.Success && (
                <div className="flex flex-col items-center">
                  <img
                    src="/img/img-trademark-temp-1.png"
                    alt=""
                    className="w-[10rem] h-[10rem] rounded-3xl mb-4"
                  />
                  <p className="text-[#C0C0C0]">You have successfully minted</p>
                  <p className="">Chess King #123</p>
                </div>
              )}
              <div>
                {trademarkMintStatus === MintStatus.Success && (
                  <Button className="w-full gradient-button">
                    Trade in Alienswap
                  </Button>
                )}
                <Button className="secondary-button">Close</Button>
              </div>
            </TxResult>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
