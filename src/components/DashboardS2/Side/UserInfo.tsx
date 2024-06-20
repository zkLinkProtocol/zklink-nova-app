import { GradientButton2 } from "@/styles/common";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import styled from "styled-components";

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

export default () => {
  const editUsernameModal = useDisclosure();

  return (
    <>
      <Container>
        <div className="mt-[24px] flex gap-[16px]">
          <div className="relative h-[96px]">
            <img
              src="/img/img-INFJ-LYNK.png"
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

              <div className="check-in">Check In</div>
            </div>

            <div className="mt-[20px]">
              <GradientButton2 className="upgrade-btn py-[8px] w-full block text-center disabled">
                Upgrade
              </GradientButton2>
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
    </>
  );
};
