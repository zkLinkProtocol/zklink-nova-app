import { NOVA_CHAIN_ID } from "@/constants";
import useNovaNFT, { NOVA_NFT_TYPE } from "@/hooks/useNFT";
import { CardBox } from "@/styles/common";
import { addNovaChain, formatBalance } from "@/utils";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import classNames from "classnames";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useAccount, useBalance, useChainId, useSwitchChain } from "wagmi";

export default function NovaCharacter() {
  const mintModal = useDisclosure();
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const { nft, loading: mintLoading, sendMintTx, fetchLoading } = useNovaNFT();
  const [mintType, setMintType] = useState<NOVA_NFT_TYPE>("ISTP");

  const [showTooltip1, setShowTooltip1] = useState(false);

  const isInvaidChain = useMemo(() => {
    return chainId !== NOVA_CHAIN_ID;
  }, [chainId]);

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
        <Tooltip content={nft ? "coming soon" : ""} isOpen={showTooltip1}>
          <Button
            onClick={handleMintNow}
            onMouseEnter={() => nft && setShowTooltip1(true)}
            onMouseLeave={() => nft && setShowTooltip1(false)}
            onTouchStart={() => nft && setShowTooltip1((prev) => !prev)}
            isLoading={fetchLoading || mintLoading}
            className={classNames(
              "gradient-btn w-full py-[1rem] flex justify-center items-center gap-[0.38rem] text-[1.25rem] ",
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
    </>
  );
}
