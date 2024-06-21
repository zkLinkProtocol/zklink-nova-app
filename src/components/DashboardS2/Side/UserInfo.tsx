import useNovaNFT, { NOVA_NFT_TYPE } from "@/hooks/useNFT";
import useNovaDrawNFT from "@/hooks/useNovaNFT";
import { GradientButton2 } from "@/styles/common";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useAccount, useBalance, useSwitchChain } from "wagmi";
import { Abi } from "viem";
import { useMintStatus } from "@/hooks/useMintStatus";
import classNames from "classnames";
import toast from "react-hot-toast";
import {
  LYNKS_NFT_MARKET_URL,
  MintStatus,
  NOVA_CHAIN_ID,
  TRADEMARK_NFT_MARKET_URL,
} from "@/constants";
import { config } from "@/constants/networks";
import { formatBalance } from "@/utils";
import { getPointsRewardsTooltips } from "@/components/Dashboard/PointsRewardsTooltips";
import CheckinModal from "../CheckinModal";

const Container = styled.div`
  .nft-num {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    color: #fff;
    font-family: "Chakra Petch";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px; /* 100% */
    letter-spacing: -0.5px;
    background: linear-gradient(
        90deg,
        rgba(72, 236, 174, 0.5) 0%,
        rgba(62, 82, 252, 0.5) 51.07%,
        rgba(73, 206, 215, 0.5) 100%
      ),
      #282828;
  }

  .username {
    color: #fff;
    font-family: "Chakra Petch";
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px; /* 100% */
    letter-spacing: -0.5px;
  }

  .check-in {
    padding: 8px;
    border-radius: 8px;
    border: 1px solid #0bc48f;
    color: #0bc48f;
    text-align: center;
    font-family: "Chakra Petch";
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 16px; /* 100% */
    letter-spacing: -0.5px;
  }

  .upgrade-btn {
    color: #fff;
    text-align: center;
    font-family: "Chakra Petch";
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px; /* 100% */
    letter-spacing: -0.5px;
  }
`;

const Input = styled.input`
  padding: 14px 20px;
  height: 48px;
  color: #fff;
  font-family: "Chakra Petch";
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 100% */
  letter-spacing: -0.5px;
  border-radius: 4px;
  border: 1px solid #999;
  background: none;
`;

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

export default () => {
  const { address, chainId } = useAccount();
  const editUsernameModal = useDisclosure();
  const mintModal = useDisclosure();
  const upgradeModal = useDisclosure();
  const trademarkMintModal = useDisclosure();

  const [upgradable, setUpgradable] = useState(false);
  const [lynksBalance, setLynksBalance] = useState(0);
  const [checkingTrademarkUpgradable, setCheckingTrademarkUpgradable] =
    useState(false);
  const [update, setUpdate] = useState(0);
  const [mintType, setMintType] = useState<NOVA_NFT_TYPE>("ISTP");
  const [trademarkMintStatus, setTrademarkMintStatus] = useState<
    MintStatus | undefined
  >();
  const [mintResult, setMintResult] = useState<{ name: string; img: string }>();
  const [failMessage, setFailMessage] = useState("");

  const { refreshBalanceId, updateRefreshBalanceId } = useMintStatus();
  const { switchChain } = useSwitchChain();

  const { nft, loading: mintLoading, sendMintTx, fetchLoading } = useNovaNFT();
  const {
    trademarkNFT,
    lynksNFT,
    isTrademarkApproved,
    sendTrademarkApproveTx,
    sendUpgradeSBTTx,
    isApproving,
    publicClient,
  } = useNovaDrawNFT();

  const nftImage = useMemo(() => {
    if (!nft) {
      return "/img/img-mint-example.png";
    } else if (lynksBalance > 0) {
      return `/img/img-${nft?.name}-LYNK.png`;
    } else {
      return nft.image;
    }
  }, [nft, lynksBalance]);

  const isInvaidChain = useMemo(() => {
    return chainId !== NOVA_CHAIN_ID;
  }, [chainId]);

  const mintPointsTips = useMemo(() => {
    const isNovaPoints =
      mintResult?.name && mintResult.name.toLowerCase().includes("nova points");

    if (isNovaPoints) {
      let match = mintResult.name.match(/\d+/);
      let key = match ? parseInt(match[0]) : 0;

      return getPointsRewardsTooltips(key);
    }
  }, [mintResult]);

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

  const handleMintNow = useCallback(() => {
    if (fetchLoading) {
      return;
    } else if (!nft) {
      mintModal.onOpen();
    } else if (upgradable) {
      upgradeModal.onOpen();
    }
  }, [mintModal, nft, fetchLoading, upgradable, upgradeModal]);

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
    isTrademarkApproved,
    nft?.name,
    sendTrademarkApproveTx,
    sendUpgradeSBTTx,
    switchChain,
    trademarkMintModal,
    upgradeModal,
    updateRefreshBalanceId,
  ]);

  useEffect(() => {
    (async () => {
      if (address && trademarkNFT && lynksNFT) {
        const lynksBalance = (await lynksNFT.read.balanceOf([
          address,
        ])) as bigint;
        setLynksBalance(Number(lynksBalance));
        // const trademarkBalances = (await Promise.all(
        //   [1, 2, 3, 4].map((item) =>
        //     trademarkNFT.read.balanceOf([address, item])
        //   )
        // )) as bigint[];
        setCheckingTrademarkUpgradable(true);
        const trademarkBalancesCall = await publicClient?.multicall({
          contracts: [1, 2, 3, 4].map((item) => ({
            address: trademarkNFT.address,
            abi: trademarkNFT.abi as Abi,
            functionName: "balanceOf",
            args: [address, item],
          })),
        });
        const trademarkBalances =
          trademarkBalancesCall?.map(
            (item) => Number(item.result?.toString()) ?? 0
          ) ?? [];
        console.log("trademarkBalances: ", trademarkBalances);
        if (
          // Number(lynksBalance) === 0 &&
          trademarkBalances[0] > 0 &&
          trademarkBalances[1] > 0 &&
          trademarkBalances[2] > 0 &&
          trademarkBalances[3] > 0
        ) {
          setUpgradable(true);
        } else {
          setUpgradable(false);
        }
        setCheckingTrademarkUpgradable(false);
      }
    })();
  }, [address, trademarkNFT, lynksNFT, update, publicClient, refreshBalanceId]);

  return (
    <>
      <Container>
        <div className="mt-[24px] flex gap-[16px]">
          <div className="relative h-[96px]">
            <img
              src={nftImage}
              alt=""
              width={96}
              height={96}
              className="rounded-[16px] block min-w-[96px]"
            />
            <div className="nft-num">x1</div>
          </div>

          <div className="w-full">
            <div className="flex justify-between">
              <div className="flex items-center gap-[4px]">
                <span className="username">User123456</span>
                <img
                  src="/img/icon-edit.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="cursor-pointer"
                  onClick={editUsernameModal.onOpen}
                />
              </div>

              {/* <div className="check-in">Check In</div> */}
              <CheckinModal />
            </div>

            <div className="mt-[20px]">
              <Button
                onClick={handleMintNow}
                isLoading={
                  fetchLoading || mintLoading || checkingTrademarkUpgradable
                }
                isDisabled={!!nft && !upgradable}
                className={classNames(
                  "w-full gradient-btn flex-1  py-[1rem] flex justify-center items-center gap-[0.38rem] text-[1.25rem] "
                )}
              >
                {nft ? "Upgrade" : "Mint SBT"}
              </Button>
            </div>
          </div>
        </div>
      </Container>

      <Modal
        isDismissable={false}
        style={{
          minWidth: "600px",
          minHeight: "312px",
          backgroundColor: "rgb(38, 43, 51)",
        }}
        isOpen={editUsernameModal.isOpen}
        onOpenChange={editUsernameModal.onOpenChange}
        className="trans"
        hideCloseButton
      >
        <ModalContent className="mt-[2rem] p-[32px]">
          <ModalHeader className="px-0 pt-0 flex flex-col text-xl font-700 text-left">
            Edit User Name
          </ModalHeader>
          <ModalBody className="px-0">
            <div>
              <Input className="w-full" />
              <GradientButton2 className="mt-[24px] w-full h-[48px] leading-[48px] font-[700] text-[1rem] rounded-[6px]">
                Save
              </GradientButton2>
              <Button
                className="secondary-btn mt-[24px] w-full h-[48px] py-[0.5rem] font-[700] flex justify-center items-center gap-[0.38rem] text-[1rem] rounded-[6px]"
                onClick={() => editUsernameModal.onClose()}
              >
                Close
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

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
    </>
  );
};
