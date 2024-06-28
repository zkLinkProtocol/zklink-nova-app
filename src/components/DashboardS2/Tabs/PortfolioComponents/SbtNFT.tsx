import useNovaNFT, { NOVA_NFT_TYPE } from "@/hooks/useNFT";
import styled from "styled-components";
import { useState, useEffect, useMemo } from "react";
import { useAccount } from "wagmi";
import { Abi } from "viem";
import useNovaDrawNFT, {
  MysteryboxOpenParams,
  TrademarkMintParams,
} from "@/hooks/useNovaNFT";
import { useMintStatus } from "@/hooks/useMintStatus";
import { Button } from "@nextui-org/react";

export const NftContainer = styled.div`
  flex: 1;
  border-radius: 24px;
  border: 2px solid #635f5f;
  background: var(--Background, #000811);
  height: 180px;
  display: flex;
  padding: 14px 16px;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  .nft-image {
    width: 242px;
    height: 152px;
    display: flex;
    align-items: center;
    & > img {
      object-fit: contain;
      height: 100%;
      width: 100%;
    }
  }

  .btn-mint {
    border-radius: 64px;
    background: #1d4138;
    box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.15),
      0px 0px 12px 0px rgba(255, 255, 255, 0.75) inset;
    display: flex;
    width: 280px;
    height: 47px;
    padding: 7.5px 58px;
    justify-content: center;
    align-items: center;
  }
`;

export default function SbtNFT() {
  const { nft, loading: mintLoading, sendMintTx, fetchLoading } = useNovaNFT();
  const [lynksBalance, setLynksBalance] = useState(0);
  const [checkingTrademarkUpgradable, setCheckingTrademarkUpgradable] =
    useState(false);
  const [upgradable, setUpgradable] = useState(false);
  const [update, setUpdate] = useState(0);
  const { refreshBalanceId, updateRefreshBalanceId } = useMintStatus();

  const { address, chainId } = useAccount();
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
    <NftContainer>
      <div className="nft-image">
        <img src={nftImage} alt="" />
      </div>
      <div className="flex flex-col flex-1 h-full">
        <p className="font-bold text-lg">Nova SBT</p>
        <div className="divide my-1"></div>
        <p className="text-sm text-[#FBFBFB]/[0.6]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor
        </p>
        <Button className="btn-mint mt-auto">
          <img src="img/icon-wallet-white-2.svg" alt="" />
          <span>Mint Now</span>
        </Button>
      </div>
    </NftContainer>
  );
}
