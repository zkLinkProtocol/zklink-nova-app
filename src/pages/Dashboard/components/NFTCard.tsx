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

const NftBox = styled.div`
  .nft-left {
    width: 60%;
    .nft-chip:nth-child(4n) {
      margin-right: 0;
    }
  }
`;

export default function NFTCard() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <NftBox className="flex justify-between mt-2 py-8 px-12 bg-stone-900 border border-white rounded-lg">
        <div className="nft-left">
          <div className="flex justify-between">
            <div>
              <p className="text-xl">Trademark NFTs</p>
              <p className="mt-2 text-sub-title">
                Invite to earn more pieces and upgrade your Nova Char
              </p>
            </div>
            <Button>Buy</Button>
          </div>
          <div className="flex justify-between flex-wrap mt-8">
            {new Array(6).fill("").map((_, index) => (
              <div
                className="nft-chip relative bg-slate-50 h-32 w-32 mr-5 mb-16"
                key={index}
              >
                {/* <div className='relative bg-slate-50 h-24 w-8/12 m-auto'> */}
                <div className="flex justify-between absolute bottom-0 w-full bg-stone-600 text-sm">
                  <span>NFT_NAME</span>
                  <span>x2</span>
                </div>
                {/* </div> */}
              </div>
            ))}
            <div className="w-24 h-0"></div>
            <div className="w-24 h-0"></div>
            <div className="w-24 h-0"></div>
          </div>
        </div>

        <div className="nft-right ml-10">
          <div className="text-xl">Mystery Box (0)</div>
          <div className="mt-10 w-64 h-64 bg-slate-50"></div>
          <Button className="mt-5 w-full" onPress={onOpen}>
            Open Your Box
          </Button>
        </div>
      </NftBox>

      <Modal
        classNames={{ closeButton: "text-[1.5rem]" }}
        size="md"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent className="mb-[3.75rem]">
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
    </>
  );
}
