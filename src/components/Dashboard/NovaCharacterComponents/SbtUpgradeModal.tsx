import { UseDisclosureReturn } from "@nextui-org/use-disclosure";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { NOVA_NFT } from "@/hooks/useNFT";
import useNovaDrawNFT from "@/hooks/useNovaNFT";
import { useState, useCallback, useMemo } from "react";
import {
  NOVA_CHAIN_ID,
  MintStatus,
  TRADEMARK_NFT_MARKET_URL,
  LYNKS_NFT_MARKET_URL,
} from "@/constants";
import { useAccount, useSwitchChain } from "wagmi";
import toast from "react-hot-toast";
import { useMintStatus } from "@/hooks/useMintStatus";
import { getPointsRewardsTooltips } from "@/components/Dashboard/PointsRewardsTooltips";
import styled from "styled-components";

interface IProps {
  upgradeModal: UseDisclosureReturn;
  nft: NOVA_NFT | undefined;
  mintLoading: boolean;
  onUpgraded?: () => void;
}

const SbtUpgradeModal = (props: IProps) => {
  const { upgradeModal, nft, mintLoading, onUpgraded } = props;
  const trademarkMintModal = useDisclosure();
  const [trademarkMintStatus, setTrademarkMintStatus] = useState<
    MintStatus | undefined
  >();
  const { address, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const [mintResult, setMintResult] = useState<{ name: string; img: string }>();
  const { updateRefreshBalanceId } = useMintStatus();
  const [update, setUpdate] = useState(0);
  const [failMessage, setFailMessage] = useState("");

  const isInvaidChain = useMemo(() => {
    return chainId !== NOVA_CHAIN_ID;
  }, [chainId]);

  const {
    isTrademarkApproved,
    sendTrademarkApproveTx,
    sendUpgradeSBTTx,
    isApproving,
  } = useNovaDrawNFT();
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
      onUpgraded?.();
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
    switchChain,
    trademarkMintModal,
    isTrademarkApproved,
    sendUpgradeSBTTx,
    nft?.name,
    updateRefreshBalanceId,
    onUpgraded,
    sendTrademarkApproveTx,
    upgradeModal,
  ]);

  const mintPointsTips = useMemo(() => {
    const isNovaPoints =
      mintResult?.name && mintResult.name.toLowerCase().includes("nova points");

    if (isNovaPoints) {
      const match = mintResult.name.match(/\d+/);
      const key = match ? parseInt(match[0]) : 0;

      return getPointsRewardsTooltips(key);
    }
  }, [mintResult]);

  return (
    <>
      <Modal
        classNames={{ closeButton: "text-[1.5rem]" }}
        size="3xl"
        isOpen={upgradeModal.isOpen}
        onOpenChange={upgradeModal.onOpenChange}
      >
        <ModalContent className="mt-[2rem] py-4 px-4">
          <ModalHeader className="px-0 pt-0 flex flex-col text-xl font-normal">
            Upgrade your Nova SBT
          </ModalHeader>
          <div className="flex items-center justify-center">
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <img
                  key={item}
                  src={`/img/img-trademark-${item}.png`}
                  alt=""
                  className="w-[80px] md:h-[80px] rounded-xl bg-[#3C4550]"
                />
              ))}
            </div>
            <img src="/img/icon-plus.svg" alt="" className="w-6 h-6 mx-4" />
            <img
              src={nft?.image}
              alt=""
              className="w-[180px] h-[180px] object-cover"
            />
            <img src="/img/icon-equal.svg" alt="" className="w-6 h-6 mx-4" />
            <img
              src={`/img/img-${nft?.name}-LYNK.png`}
              alt=""
              className="w-[180px] h-[180px] object-cover"
            />
          </div>

          <div className="text-[#A0A5AD] text-xs my-6">
            <p>
              You will have to collect all 4 different types of trademark NFT to
              upgrade your nova SBT, you can receive trademark NFT in the
              following way.
            </p>
            <p className="">
              1. Mint a trademark NFT by for every 3 successful referrals
            </p>
            <p className="">
              2. Go to NFT Marketplace to purchase Trademark NFTs
            </p>
          </div>

          <Button
            onClick={handleUpgrade}
            // isDisabled={!isInvaidChain}
            isLoading={mintLoading}
            className="gradient-btn w-full h-[58px] py-[1rem] flex justify-center items-center gap-[0.38rem] text-[1.25rem]  "
          >
            <span>
              {isInvaidChain && "Switch to Nova network to mint"}
              {!isInvaidChain && !isTrademarkApproved && "Approve & Mint"}
              {!isInvaidChain && isTrademarkApproved && "Mint"}
            </span>
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
                  <Button
                    className="w-full gradient-btn"
                    onClick={() => trademarkMintModal.onClose()}
                  >
                    Confirm
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

export default SbtUpgradeModal;
