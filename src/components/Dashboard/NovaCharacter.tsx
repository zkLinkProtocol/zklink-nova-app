import { NFT_MARKET_URL, NOVA_CHAIN_ID, MintStatus } from "@/constants";
import useNovaNFT, { NOVA_NFT_TYPE } from "@/hooks/useNFT";
import { CardBox } from "@/styles/common";
import { addNovaChain, formatBalance, sleep } from "@/utils";
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
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import toast from "react-hot-toast";
import { useAccount, useBalance, useChainId, useSwitchChain } from "wagmi";
import { config } from "@/constants/networks";
import { getRemainDrawCount, drawTrademarkNFT } from "@/api";
import styled from "styled-components";
import DrawAnimation from "../DrawAnimation";
import useNovaDrawNFT, { TrademarkMintParams } from "@/hooks/useNovaNFT";
import { useMintStatus } from "@/hooks/useMintStatus";
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

const TRADEMARK_TOKEN_ID_MAP: Record<number, string> = {
  1: "Oak Tree Roots",
  2: "Magnifying Glass",
  3: "Chess Knight",
  4: "Binary Code Metrix Cube",
};
export default function NovaCharacter() {
  const mintModal = useDisclosure();
  const drawModal = useDisclosure();
  const trademarkMintModal = useDisclosure();
  const upgradeModal = useDisclosure();
  const { address, chainId } = useAccount();
  // const chainId = useChainId({ config });
  const { switchChain } = useSwitchChain();
  const {
    trademarkNFT,
    sendTrademarkMintTx,
    lynksNFT,
    isTrademarkApproved,
    sendTrademarkApproveTx,
    sendUpgradeSBTTx,
    isApproving,
  } = useNovaDrawNFT();

  const { updateRefreshBalanceId } = useMintStatus();

  const { nft, loading: mintLoading, sendMintTx, fetchLoading } = useNovaNFT();
  const [mintType, setMintType] = useState<NOVA_NFT_TYPE>("ISTP");
  const [remainDrawCount, setRemainDrawCount] = useState<number>(0);
  const [update, setUpdate] = useState(0);
  const [trademarkMintStatus, setTrademarkMintStatus] = useState<
    MintStatus | undefined
  >();
  const [drawedNftId, setDrawedNftId] = useState<number>();
  const [trademarkMintParams, setTrademarkMintParams] = useState<{
    tokenId: number;
    nonce: number;
    signature: string;
    expiry: number;
  }>();
  const [drawing, setDrawing] = useState(false);
  const drawRef = useRef<{ start: (target: number) => void }>();
  const [failMessage, setFailMessage] = useState("");
  const [upgradable, setUpgradable] = useState(false);
  const [mintResult, setMintResult] = useState<{ name: string; img: string }>();
  const [lynksBalance, setLynksBalance] = useState(0);
  useEffect(() => {
    if (address) {
      getRemainDrawCount(address).then((res) => {
        console.log("remain draw count: ", res);
        const { remainNumber, tokenId } = res.result;
        tokenId && setDrawedNftId(Number(tokenId));
        setRemainDrawCount(remainNumber);
      });
    }
  }, [address, update]);

  useEffect(() => {
    (async () => {
      if (address && trademarkNFT && lynksNFT) {
        const lynksBalance = (await lynksNFT.read.balanceOf([
          address,
        ])) as bigint;
        setLynksBalance(Number(lynksBalance));
        const trademarkBalances = (await Promise.all(
          [1, 2, 3, 4].map((item) =>
            trademarkNFT.read.balanceOf([address, item])
          )
        )) as bigint[];
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
      }
    })();
  }, [address, trademarkNFT, lynksNFT, update]);

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
      drawModal.onOpen(); // for test only
    }
  }, [drawModal, remainDrawCount]);

  const handleDrawAndMint = useCallback(async () => {
    if (!address || remainDrawCount === 0) return;
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
        await drawRef?.current?.start(tokenId - 1); //do the draw animation; use index of image for active
        // await sleep(2000);
        setDrawedNftId(Number(tokenId));
        if (tokenId === 5) {
          // 5 means no prize
          setUpdate((update) => update + 1);
          // return;
        }
      }
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
        img: `/img/img-trademark-${mintParams!.tokenId}.png`,
      });
      updateRefreshBalanceId();
    } catch (e) {
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
    }

    setUpdate((update) => update + 1);
  }, [
    address,
    drawedNftId,
    isInvaidChain,
    novaBalance,
    remainDrawCount,
    sendTrademarkMintTx,
    switchChain,
    trademarkMintModal,
    trademarkMintParams,
    updateRefreshBalanceId,
  ]);

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

  const handleUpgrade = useCallback(async () => {
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

  const nftImage = useMemo(() => {
    if (!nft) {
      return "/img/img-mint-example.png";
    } else if (lynksBalance > 0) {
      return `/img/img-${nft?.name}-LYNK.png`;
    } else {
      return nft.image;
    }
  }, [nft, lynksBalance]);

  return (
    <>
      <CardBox className="flex flex-col gap-[1.5rem] items-center p-[1.5rem]">
        <p className="w-full text-[1rem] font-[700] text-[1rem] leading-[1.5rem] tracking-[0.06rem]">
          Your Nova Character
        </p>
        <div className="md:w-[24rem] md:h-[18.75rem] bg-[#65E7E5] rounded-[1rem]">
          <img
            src={nftImage}
            className="text-center block mx-auto h-auto rounded-[1rem]"
          />
        </div>
        <div className="flex items-center w-full">
          <Tooltip
            content={
              <div className="flex flex-col py-2">
                <p>
                  For every three referrals, you'll get a chance to mint a
                  trademark NFT.
                </p>
              </div>
            }
          >
            <div className="grow mr-4">
              <Button
                className="gradient-btn flex-1 py-[1rem] flex justify-center items-center gap-[0.38rem] text-[1.25rem] w-full"
                onClick={handleMintTrademark}
                isDisabled={remainDrawCount === 0}
              >
                Mint trademark ({remainDrawCount})
              </Button>
            </div>
          </Tooltip>
          <Tooltip
            content={
              <div className="flex flex-col py-2">
                <p>
                  You can instantly mint your SBT, and if you wish to upgrade
                  SBT to Lynks, you'll need to collect all 4 trademark NFTs.
                </p>
              </div>
            }
          >
            <div className="grow">
              <Button
                onClick={handleMintNow}
                isLoading={fetchLoading || mintLoading}
                isDisabled={!!nft && !upgradable}
                className={classNames(
                  "w-full gradient-btn flex-1  py-[1rem] flex justify-center items-center gap-[0.38rem] text-[1.25rem] "
                )}
              >
                <span>{nft ? "Upgrade" : "Mint SBT"}</span>
                {nft ? (
                  <img
                    src="/img/icon-info.svg"
                    className="w-[0.875rem] h-[0.875rem]"
                  />
                ) : (
                  ""
                )}
              </Button>
            </div>
          </Tooltip>
        </div>
      </CardBox>
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
        isDismissable={false}
        classNames={{ closeButton: "text-[1.5rem]" }}
        size="xl"
        isOpen={drawModal.isOpen}
        onOpenChange={drawModal.onOpenChange}
      >
        <ModalContent className="mt-[2rem] py-4 px-4">
          <ModalHeader className="px-0 pt-0 flex flex-col text-xl font-normal">
            Draw and Mint your Trademark NFTs
          </ModalHeader>
          <DrawAnimation
            type="Trademark"
            ref={drawRef}
            targetImageIndex={drawedNftId ? drawedNftId - 1 : undefined}
            onDrawEnd={() => {
              setDrawing(false);
            }}
          />
          <p className="text-left text-[#C0C0C0] mt-5 mb-4">
            With every three referrals, you'll have the chance to randomly mint
            one of the four Trademarks. However, you must mint your Trademark
            before you can enter another lucky draw.
          </p>
          <Button
            onClick={handleDrawAndMint}
            isDisabled={
              !isInvaidChain && (novaBalance === 0 || remainDrawCount === 0)
            }
            isLoading={mintLoading || drawing}
            className="gradient-btn w-full h-[48px] py-[0.5rem] flex justify-center items-center gap-[0.38rem] text-[1.25rem]  mb-4"
          >
            <span>
              {isInvaidChain && "Switch to Nova network to mint"}
              {!isInvaidChain &&
                (!drawedNftId || drawedNftId === 5 || drawing) &&
                `Draw & Mint ( ${remainDrawCount} )`}
              {!isInvaidChain &&
                !!drawedNftId &&
                drawedNftId !== 5 &&
                !drawing &&
                "Mint"}
            </span>
          </Button>
          <Button
            className="secondary-btn w-full h-[48px] py-[0.5rem] flex justify-center items-center gap-[0.38rem] text-[1.25rem] "
            onClick={() => mintModal.onClose()}
          >
            Close
          </Button>
          {/* <Button
            onClick={() => window.open(NFT_MARKET_URL, "_blank")}
            isDisabled={!isInvaidChain && novaBalance === 0}
            isLoading={mintLoading}
            className="secondary-btn w-full h-[58px] py-[1rem] flex justify-center items-center gap-[0.38rem] text-[1.25rem]  "
          >
            <span>Trade in Alienswap</span>
          </Button> */}
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
                  <p className="text-[#C0C0C0]">You have successfully minted</p>
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
              <div className="mt-6">
                {trademarkMintStatus === MintStatus.Success && (
                  <Tooltip content="Comming Soon">
                    <span>
                      <Button
                        className="w-full gradient-btn"
                        onClick={() => window.open(NFT_MARKET_URL, "_blank")}
                        isDisabled={true}
                      >
                        Trade in Alienswap
                      </Button>
                    </span>
                  </Tooltip>
                )}
                {/* <Button
                  className="w-full default-btn"
                  onClick={() => trademarkMintModal.onClose()}
                >
                  Close
                </Button> */}
              </div>
            </TxResult>
          </ModalBody>
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
    </>
  );
}
