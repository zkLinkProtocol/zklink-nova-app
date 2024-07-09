import useNovaNFT, { NOVA_NFT_TYPE } from "@/hooks/useNFT";
import styled from "styled-components";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useAccount } from "wagmi";
import { Abi } from "viem";
import useNovaDrawNFT from "@/hooks/useNovaNFT";
import { useMintStatus } from "@/hooks/useMintStatus";
import { Button, useDisclosure } from "@nextui-org/react";
import SbtMintModal from "@/components/Dashboard/NovaCharacterComponents/SbtMintModal";
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
  const { nft, loading: mintLoading, fetchLoading, getNFT } = useNovaNFT();
  const [lynksBalance, setLynksBalance] = useState(0);

  const [update, setUpdate] = useState(0);
  const mintModal = useDisclosure();
  const { address, chainId } = useAccount();
  const { lynksNFT } = useNovaDrawNFT();

  useEffect(() => {
    (async () => {
      if (address && lynksNFT) {
        const lynksBalance = (await lynksNFT.read.balanceOf([
          address,
        ])) as bigint;
        setLynksBalance(Number(lynksBalance));
        getNFT(address);
      }
    })();
  }, [address, getNFT, lynksNFT, update]);

  const nftImage = useMemo(() => {
    if (!nft) {
      return "/img/img-mint-example.png";
    } else if (lynksBalance > 0) {
      return `/img/img-${nft?.name}-LYNK.png`;
    } else {
      return nft.image;
    }
  }, [nft, lynksBalance]);

  const handleMintNow = useCallback(() => {
    if (fetchLoading) {
      return;
    } else if (!nft) {
      mintModal.onOpen();
    }
  }, [mintModal, nft, fetchLoading]);

  return (
    <NftContainer>
      <div className="nft-image">
        <img src={nftImage} alt="" />
      </div>
      <div className="flex flex-col flex-1 h-full">
        <p className="font-bold text-lg">Nova SBT</p>
        <div className="divide my-1"></div>
        <p className="text-sm text-[#FBFBFB]/[0.6]">
          Users who deposit a minimum amount of 0.1 ETH or equivalent can mint a
          zkLink Nova SBT. 
        </p>
        {!nft && (
          <Button
            className="btn-mint mt-auto"
            isDisabled={!!nft}
            isLoading={fetchLoading || mintLoading}
            onClick={handleMintNow}
          >
            <img src="img/icon-wallet-white-2.svg" alt="" />
            <span>Mint Now</span>
          </Button>
        )}
      </div>
      <SbtMintModal
        mintModal={mintModal}
        onMinted={() => setUpdate((v) => v + 1)}
      />
    </NftContainer>
  );
}
