import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { UseDisclosureReturn } from "@nextui-org/use-disclosure";
import classNames from "classnames";
import useNovaNFT, { NOVA_NFT_TYPE } from "@/hooks/useNFT";
import { useState, useCallback, useEffect, useMemo } from "react";
import { useAccount, useSwitchChain, useBalance } from "wagmi";
import {
  TRADEMARK_NFT_MARKET_URL,
  LYNKS_NFT_MARKET_URL,
  NOVA_CHAIN_ID,
  MintStatus,
} from "@/constants";
import { addNovaChain, formatBalance, sleep } from "@/utils";

import { config } from "@/constants/networks";
import toast from "react-hot-toast";

interface IProps {
  mintModal: UseDisclosureReturn;
  onMinted?: () => void;
}
const SbtMintModal = (props: IProps) => {
  const { address, chainId } = useAccount();
  const { mintModal, onMinted } = props;
  const [mintType, setMintType] = useState<NOVA_NFT_TYPE>("ISTP");
  const { nft, loading: mintLoading, sendMintTx, fetchLoading } = useNovaNFT();
  const { switchChain } = useSwitchChain();

  const { data: nativeTokenBalance } = useBalance({
    config,
    address: address as `0x${string}`,
    chainId: NOVA_CHAIN_ID,
    token: undefined,
  });

  const isInvaidChain = useMemo(() => {
    return chainId !== NOVA_CHAIN_ID;
  }, [chainId]);

  const novaBalance = useMemo(() => {
    if (nativeTokenBalance) {
      return formatBalance(nativeTokenBalance?.value ?? 0n, 18);
    }
    return 0;
  }, [nativeTokenBalance]);
  console.log("nativeTokenBalance: ", nativeTokenBalance);

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
      onMinted?.();
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
    onMinted,
  ]);
  return (
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
  );
};

export default SbtMintModal;
