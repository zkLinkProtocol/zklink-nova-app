import { drawTrademarkNFT, getRemainDrawCount } from "@/api";
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
import { RootState } from "@/store";
import { formatBalance, getTweetShareText, sleep } from "@/utils";
import { eventBus } from "@/utils/event-bus";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { useAccount, useBalance, useSwitchChain } from "wagmi";

const TRADEMARK_TOKEN_ID_MAP: Record<number, string> = {
  8: "+10 Nova points",
  9: "+50 Nova points",
};

const Container = styled.div`
  padding: 20px 0;
  border-bottom: 1px solid #999;

  .sub-title {
    padding: 20px 0;
    color: #fff;
    font-family: "Chakra Petch";
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px; /* 100% */
    letter-spacing: -0.5px;
  }

  .referral-label {
    margin-bottom: 4px;
    color: #999;
    font-family: "Chakra Petch";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px; /* 100% */
    letter-spacing: -0.5px;
  }

  .referral-value {
    color: #fff;
    font-family: "Chakra Petch";
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px; /* 100% */
    letter-spacing: -0.5px;
    &.text-green,
    .text-green {
      color: #0aba89;
    }
    .more {
      color: #0aba89;
      font-size: 16px;
      font-weight: 400;
      line-height: 16px; /* 100% */
      cursor: pointer;
    }
  }

  .open-btn {
    padding: 14px 0;
    display: block;
  }
`;

const RefeffalList = styled.div`
  height: 300px;
  overflow-y: auto;
  color: #fff;
  font-family: "Chakra Petch";
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
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
  const drawModal = useDisclosure();
  const referralsModal = useDisclosure();
  const trademarkMintModal = useDisclosure();
  const drawRef = useRef<{ start: (target: number) => void }>();
  const { address, chainId } = useAccount();

  const [isOpen, setIsOpen] = useState(false);
  const [remainDrawCount, setRemainDrawCount] = useState<number>(0);
  const [drawedNftId, setDrawedNftId] = useState<number>();
  const [drawing, setDrawing] = useState(false);
  const [trademarkMintParams, setTrademarkMintParams] = useState<{
    tokenId: number;
    nonce: number;
    signature: string;
    expiry: number;
  }>();
  const [update, setUpdate] = useState(0);
  const [trademarkMintStatus, setTrademarkMintStatus] = useState<
    MintStatus | undefined
  >();
  const [mintResult, setMintResult] = useState<{ name: string; img: string }>();
  const [failMessage, setFailMessage] = useState("");

  const { updateRefreshBalanceId } = useMintStatus();

  const { invite } = useSelector((store: RootState) => store.airdrop);

  const { nft, loading: mintLoading } = useNovaNFT();

  const { sendTrademarkMintTx, isApproving } = useNovaDrawNFT();

  const lynksNFTImg = useMemo(() => {
    console.log("nft", nft);

    if (nft) {
      return `/img/img-mystery-box-lynks-${nft.name}.png`;
    } else {
      return `/img/img-mystery-box-lynks-ENTP.png`;
    }
  }, [nft]);

  const mintPointsTips = useMemo(() => {
    const isNovaPoints =
      mintResult?.name && mintResult.name.toLowerCase().includes("nova points");

    if (isNovaPoints) {
      let match = mintResult.name.match(/\d+/);
      let key = match ? parseInt(match[0]) : 0;

      return getPointsRewardsTooltips(key);
    }
  }, [mintResult]);

  const referralList = [
    {
      name: "user123",
      value: "100ETH",
    },
    {
      name: "user123",
      value: "100ETH",
    },
    {
      name: "user123",
      value: "100ETH",
    },
    {
      name: "user123",
      value: "100ETH",
    },
    {
      name: "user123",
      value: "100ETH",
    },
    {
      name: "user123",
      value: "100ETH",
    },
    {
      name: "user123",
      value: "100ETH",
    },
    {
      name: "user123",
      value: "100ETH",
    },
    {
      name: "user123",
      value: "100ETH",
    },
    {
      name: "user123",
      value: "100ETH",
    },
    {
      name: "user123",
      value: "100ETH",
    },
    {
      name: "user123",
      value: "100ETH",
    },
  ];

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

  const handleCopy = () => {
    if (!invite?.code) return;
    navigator.clipboard.writeText(invite?.code);
    toast.success("Copied", { duration: 2000 });
  };

  const handleMintTrademark = useCallback(async () => {
    if (remainDrawCount > 0) {
      drawModal.onOpen(); // for test only
    }
  }, [drawModal, remainDrawCount]);

  const getDrawIndexWithPrizeTokenId = (tokenId: number) => {
    return Object.keys(TRADEMARK_TOKEN_ID_MAP).findIndex(
      (key) => Number(key) === tokenId
    );
  };

  const handleDrawAndMint = useCallback(async () => {
    if (!address || remainDrawCount === 0) return;
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
          drawModal.onClose();
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
    }

    setUpdate((update) => update + 1);
  }, [
    address,
    drawModal,
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

  return (
    <>
      <Container>
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="sub-title">Referral</span>
          {isOpen ? (
            <BsChevronUp className="text-[20px]" />
          ) : (
            <BsChevronDown className="text-[20px]" />
          )}
        </div>

        {isOpen && (
          <div>
            <div>
              <div className="flex justify-between">
                <div>
                  <div className="referral-label">Your Invite Code</div>
                  <div className="referral-value flex items-center gap-[8px]">
                    <span className="text-green">{invite?.code}</span>
                    <img
                      src="/img/icon-copy2.svg"
                      className="w-[16px] h-[16px] cursor-pointer"
                      onClick={() => handleCopy()}
                    />

                    <a
                      href={`https://twitter.com/intent/tweet?text=${getTweetShareText(
                        invite?.code ?? ""
                      )}`}
                      data-show-count="false"
                      target="_blank"
                    >
                      <img
                        src="/img/icon-x.svg"
                        className="w-[16px] h-[16px] cursor-pointer"
                      />
                    </a>
                  </div>
                </div>
                <div>
                  <div className="referral-label text-right">Invited By</div>
                  <div className="referral-value text-right">@Janis</div>
                </div>
              </div>
            </div>

            <div className="mt-[24px]">
              <div className="flex justify-between">
                <div>
                  <div className="referral-label">Referrers</div>
                  <div className="referral-value">
                    User123{" "}
                    <span className="more" onClick={referralsModal.onOpen}>
                      More
                    </span>
                  </div>
                </div>
                <div>
                  <div className="referral-label text-right">Referral TVL</div>
                  <div className="referral-value text-right">16.60k ETH</div>
                </div>
              </div>
            </div>

            <div className="mt-[24px] pb-[20px]">
              <Button
                className="gradient-btn flex-1 py-[1rem] flex justify-center items-center gap-[0.38rem] text-[1.25rem] w-full"
                onClick={handleMintTrademark}
                isDisabled={remainDrawCount === 0}
              >
                Open Invite Box ({remainDrawCount})
              </Button>
            </div>
          </div>
        )}
      </Container>

      <Modal
        isDismissable={false}
        style={{
          minWidth: "480x",
          maxHeight: "600px",
          backgroundColor: "rgb(38, 43, 51)",
        }}
        isOpen={referralsModal.isOpen}
        onOpenChange={referralsModal.onOpenChange}
        className="trans"
        hideCloseButton
      >
        <ModalContent className="mt-[2rem] py-[32px]">
          <ModalHeader className="px-[32px] pt-0 flex flex-col text-xl text-left font-[700]">
            Your Referrals
          </ModalHeader>
          <ModalBody className="px-0">
            <div>
              <RefeffalList className="referral-list px-[32px] flex flex-col gap-[20px]">
                {referralList.map((referral, index) => (
                  <div
                    className="flex justify-between items-center"
                    key={index}
                  >
                    <span>{referral.name}</span>
                    <span>{referral.value}</span>
                  </div>
                ))}
              </RefeffalList>

              <div className="px-[32px]">
                <Button
                  className="secondary-btn mt-[24px] w-full h-[48px] py-[0.5rem] font-[700] flex justify-center items-center gap-[0.38rem] text-[1rem] rounded-[6px]"
                  onClick={() => referralsModal.onClose()}
                >
                  Close
                </Button>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isDismissable={false}
        classNames={{ closeButton: "text-[1.5rem]" }}
        size="xl"
        isOpen={drawModal.isOpen}
        onOpenChange={drawModal.onOpenChange}
      >
        <ModalContent className="mt-[2rem] py-4 md:px-4 h-[100vh] overflow-auto md:h-auto">
          <ModalHeader className="px-0 pt-0 flex flex-col text-xl font-normal">
            Draw and Earn your invite rewards
          </ModalHeader>
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
          <p className="text-left text-[#C0C0C0] mt-5 mb-4">
            With each referral, you'll have the chance to randomly draw one of
            the invite rewards.{" "}
            <span className="text-[#fff] font-[700]">
              Please notice that Nova points rewards are not NFT
            </span>
            , they'll be added directly to your Nova Points.
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
