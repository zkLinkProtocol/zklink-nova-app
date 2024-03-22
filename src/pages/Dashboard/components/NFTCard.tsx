import {
  Button,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import styled from "styled-components";
import { CardBox } from "@/styles/common";
import { NFT_MARKET_URL } from "@/constants";
import { useState, useEffect } from "react";
const NftBox = styled.div`
  .nft-left {
    width: 60%;
    padding: 24px;
    .nft-chip:nth-child(3n) {
      margin-right: 0;
    }
    .nft-left-title {
      color: #fff;
      font-family: Satoshi;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: 24px; /* 150% */
      letter-spacing: 0.96px;
    }
    .nft-left-sub-title {
      color: #919192;
      font-family: Satoshi;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      letter-spacing: 0.96px;
    }
    .nft-chip {
      border-radius: 16px;
      backdrop-filter: blur(15.800000190734863px);
    }
    .nft-info {
      width: 170px;
      flex-shrink: 0;

      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 16px;
      margin-bottom: 24px;
      .nft-name {
        text-align: center;
        font-family: Satoshi;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px; /* 157.143% */
        background: linear-gradient(90deg, #48ecae 0%, #49ced7 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 10px;
      }
      .nft-balance {
        color: #fff;
        font-family: Satoshi;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 24px; /* 150% */
        letter-spacing: 0.96px;
      }
    }
  }
  .nft-right {
    width: 40%;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;
const ALL_NFTS = [
  { img: "trademark-1.png", name: "Trade mark", balance: 1 },
  { img: "trademark-2.png", name: "Trade mark", balance: 1 },
  { img: "trademark-3.png", name: "Trade mark", balance: 1 },
  { img: "trademark-4.png", name: "Trade mark", balance: 1 },

  { img: "mystery-box-1", name: "Mystery Box 1", balance: 1 },
  { img: "mystery-box-1", name: "Mystery Box 1", balance: 2 },
  { img: "mystery-box-1", name: "Mystery Box 1", balance: 3 },
  { img: "mystery-box-1", name: "Mystery Box 1", balance: 4 },
  { img: "mystery-box-1", name: "Mystery Box 1", balance: 5 },
  { img: "mystery-box-1", name: "Mystery Box 1", balance: 6 },
  { img: "mystery-box-1", name: "Mystery Box 1", balance: 7 },
  { img: "mystery-box-1", name: "Mystery Box 1", balance: 8 },
];
export default function NFTCard() {
  const openBoxModal = useDisclosure();
  const mintBoxModal = useDisclosure();
  const [remainMintCount, setRemainMintCount] = useState(0);

  const onOpen = () => {
    openBoxModal.onOpen();
  };
  const onMint = () => {
    mintBoxModal.onOpen();
  };

  return (
    <>
      <NftBox className="flex justify-between  rounded-lg mt-8">
        <CardBox className="nft-left">
          <div className="flex justify-between">
            <div>
              <p className="nft-left-title">Nova NFTs</p>
              <p className="nft-left-sub-title">
                Invite to earn more pieces and upgrade your Nova Char
              </p>
            </div>
            <Button className="gradient-btn">Buy</Button>
          </div>
          <div className="flex justify-between flex-wrap mt-8">
            {ALL_NFTS.map((item, index) => (
              <div
                className="nft-chip relative   w-[170px] mr-5 mb-16"
                key={index}
              >
                <img src={`/img/img-${item.img}`} alt="" />
                {/* <div className='relative bg-slate-50 h-24 w-8/12 m-auto'> */}
                <div className="nft-info">
                  <span className="nft-name">{item.name}</span>
                  <span className="nft-balance">x{item.balance}</span>
                </div>
              </div>
            ))}
          </div>
        </CardBox>

        <CardBox className="nft-right ml-10">
          <div className="text-xl flex items-center mb-8">
            <span>Mystery Box</span>
            <img
              src="/img/icon-tips-white.png"
              alt=""
              className="w-[14px] h-[14px] ml-1"
            />
          </div>
          <div className="mt-10 w-[384px] h-[300px] bg-slate-50 mb-8">
            <img src="/img/img-mystery-box.png" />
          </div>
          <Button className="gradient-btn mb-2 w-full" onPress={onOpen}>
            Open Your Box
          </Button>
          <Button className="gradient-btn mb-2 w-full" onPress={onMint}>
            Mint Your Box ({remainMintCount})
          </Button>
          <Button
            className="gradient-btn  w-full"
            onPress={() => window.open(NFT_MARKET_URL, "_blank")}
          >
            Trade in Alienswap
          </Button>
        </CardBox>
      </NftBox>

      <Modal
        classNames={{ closeButton: "text-[1.5rem]" }}
        size="md"
        isOpen={openBoxModal.isOpen}
        onOpenChange={openBoxModal.onOpenChange}
      >
        <ModalContent className="mb-[5.75rem]">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Open the Mystery box
              </ModalHeader>
              <ModalBody>
                <div className="flex justify-center items-center mx-auto w-48 h-48 bg-white text-black text-xl">
                  Mystery Box
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="w-full">
                  <Button
                    className="w-full block bg-emerald-600"
                    onPress={onClose}
                  >
                    Open
                  </Button>
                  <Button
                    className="mt-5 w-full block bg-transparent text-teal-500 border border-teal-500"
                    onPress={onClose}
                  >
                    Open All
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        classNames={{ closeButton: "text-[1.5rem]" }}
        size="md"
        isOpen={mintBoxModal.isOpen}
        onOpenChange={mintBoxModal.onOpenChange}
      >
        <ModalContent className="mb-[5.75rem]">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Mint the Mystery box
              </ModalHeader>
              <ModalBody>
                <div className="flex justify-center items-center mx-auto w-48 h-48 bg-white text-black text-xl">
                  Mystery Box
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="w-full">
                  <Button
                    className="w-full block bg-emerald-600"
                    onPress={onClose}
                  >
                    Open
                  </Button>
                  <Button
                    className="mt-5 w-full block bg-transparent text-teal-500 border border-teal-500"
                    onPress={onClose}
                  >
                    Open All
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
