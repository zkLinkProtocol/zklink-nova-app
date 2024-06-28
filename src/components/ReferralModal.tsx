import styled from "styled-components";
import {
  Button,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tooltip,
} from "@nextui-org/react";
import { copyText } from "@/utils";
import { useState, useEffect } from "react";
import { SecondayButton, PrimaryButton } from "./ui/Button";
type ReferacData = {
  address: string;
  holding: number;
  spotDex: number;
  perpDex: number;
  lending: number;
  gameFi: number;
  other: number;
};
const ReferralModal = () => {
  const modal = useDisclosure();
  const [inviteCode, setInviteCode] = useState("AAV81");
  const [data, setData] = useState<ReferacData[]>([]);
  useEffect(() => {
    setData(
      new Array(6).fill({
        address: "0x12...3344",
        holding: 1200,
        spotDex: 1200,
        perpDex: 0,
        lending: 0,
        gameFi: 0,
        other: 1200,
      })
    );
  }, []);
  return (
    <>
      <ReferralButton variant="bordered" onClick={modal.onOpen}>
        Your Referral
      </ReferralButton>
      <ModalContainer
        isDismissable={false}
        classNames={{ closeButton: "hidden" }}
        size="md"
        isOpen={modal.isOpen}
        onOpenChange={modal.onOpenChange}
      >
        <ModalContent className="mb-[5.75rem]">
          {(onClose) => (
            <ModalContent>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex">Your Referrals (100/999)</div>
                  <div className="flex items-center gap-2">
                    <span>Your Invite Code</span>
                    <InviteCode>
                      <span>{inviteCode}</span>
                      <img
                        onClick={() => copyText(inviteCode)}
                        src="img/s2/icon-copy.svg"
                        alt=""
                        className="cursor-pointer hover:opacity-80"
                      />
                    </InviteCode>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <Divide />
                <TableHead>
                  {[
                    "Users",
                    "Holding",
                    "Spot DEX",
                    "Perp DEX",
                    "Lending",
                    "GameFi",
                    "Other",
                  ].map((item) => (
                    <div key={item}>{item}</div>
                  ))}
                </TableHead>
                {data.map((item) => (
                  <TableBodyRow key={item.address}>
                    <div>{item.address}</div>
                    <div>{item.holding}</div>
                    <div>{item.spotDex}</div>
                    <div>{item.perpDex}</div>
                    <div>{item.lending}</div>
                    <div>{item.gameFi}</div>
                    <div>{item.other}</div>
                  </TableBodyRow>
                ))}
                <Divide />
              </ModalBody>
              <ModalFooter>
                <div className="flex w-full gap-6">
                  <SecondayButton className="flex-1" onClick={onClose}>
                    Close
                  </SecondayButton>
                  <PrimaryButton className="flex-1">
                    <img src="img/s2/icon-twitter.svg" alt="" />
                    <span>Share your code on X to earn more</span>
                  </PrimaryButton>
                </div>
              </ModalFooter>
            </ModalContent>
          )}
        </ModalContent>
      </ModalContainer>
    </>
  );
};
const ModalContainer = styled(Modal)`
  max-width: 864px;
  width: 864px;
  border-radius: 12px;
  border: 1px solid #635f5f;
  background: var(--Background, #000811);
`;
const ReferralButton = styled(Button)`
  border-radius: 52px;
  border: 1px solid #03d498;
  color: #03d498;
  font-family: "Chakra Petch";
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px; /* 75% */
  height: 52px;
  padding-left: 18px;
  padding-right: 18px;
`;
const InviteCode = styled.div`
  border-radius: 24px;
  border: 1px solid rgba(51, 49, 49, 0);
  background: #10131c;
  filter: blur(0.125px);
  display: flex;
  padding: var(--Button-gap, 8px) 16px;
  justify-content: center;
  align-items: center;
  gap: var(--Button-gap, 8px);
  > span {
    color: #fbfbfb;
    text-align: right;
    leading-trim: both;
    text-edge: cap;
    font-family: Satoshi;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 110%; /* 22px */
    text-transform: capitalize;
  }
`;
const Divide = styled.div`
  opacity: 0.75;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(251, 251, 251, 0.6) 51.5%,
    rgba(255, 255, 255, 0) 100%
  );
  width: 100%;
  height: 1px;
`;
const TableHead = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  & > div {
    color: #999;
    font-family: "Chakra Petch";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px; /* 100% */
    letter-spacing: -0.5px;
    padding: 24px 0;
    flex: 1;
  }
  & > div:first-child {
    flex: 1.5;
  }
  & > div:last-child {
    text-align: center;
  }
`;
const TableBodyRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  & > div {
    color: #fff;
    font-family: "Chakra Petch";
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    flex: 1;
  }
  & > div:first-child {
    flex: 1.5;
  }
  & > div:last-child {
    text-align: center;
  }
`;
export default ReferralModal;
