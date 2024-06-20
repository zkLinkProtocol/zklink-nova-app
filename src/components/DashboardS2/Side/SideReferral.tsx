import { GradientButton2 } from "@/styles/common";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import styled from "styled-components";

const Container = styled.div`
  padding: 40px 0;
  border-bottom: 1px solid #999;

  .sub-title {
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
    &.text-green {
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

export default () => {
  const [isOpen, setIsOpen] = useState(false);
  const referralsModal = useDisclosure();
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
            <BsChevronDown width={24} height={24} className="text-[24px]" />
          )}
        </div>

        {isOpen && (
          <div>
            <div className="mt-[24px]">
              <div className="flex justify-between">
                <div>
                  <div className="referral-label">Your Invite Code</div>
                  <div className="referral-value text-green">AA33B8</div>
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
                    AA33B8{" "}
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

            <div className="mt-[24px]">
              <GradientButton2 className="open-btn disabled">
                Open Invite Box
              </GradientButton2>
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
    </>
  );
};
