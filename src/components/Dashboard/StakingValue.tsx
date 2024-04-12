import { CardBox } from "@/styles/common";
import { formatNumberWithUnit } from "@/utils";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
import styled from "styled-components";
import BridgeComponent from "@/components/Bridge";
import { Tooltip as ReactTooltip } from "react-tooltip";

const GradientButton = styled.span`
  border-radius: 0.5rem;
  background: linear-gradient(90deg, #48ecae 0%, #3e52fc 51.07%, #49ced7 100%);
  color: #fff;
  text-align: center;
  font-family: Satoshi;
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.625rem; /* 144.444% */
  letter-spacing: 0.0625rem;
  user-select: none;
`;

interface IStakingValueProps {
  stakingUsdValue: number;
  stakingEthValue: number;
}

export default function StakingValue(props: IStakingValueProps) {
  const { stakingUsdValue, stakingEthValue } = props;
  const [isStakingUsd, setIsStakingUsd] = useState(false);
  const [bridgeToken, setBridgeToken] = useState("");
  const bridgeModal = useDisclosure();

  const handleBridgeMore = (token?: string) => {
    token && setBridgeToken(token);
    bridgeModal.onOpen();
  };

  return (
    <>
      <CardBox className="flex flex-col items-center mt-[1.5rem] p-[1.5rem]">
        <p className="w-full text-[1rem] font-[700] text-[1rem] leading-[1.5rem] tracking-[0.06rem] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>Your Holding Value</span>
            <img
              src="/img/icon-info.svg"
              className="w-[0.875rem] h-[0.875rem]"
              data-tooltip-id="holding-value-tooltip"
            />
            <ReactTooltip
              id="holding-value-tooltip"
              place="top"
              style={{
                maxWidth: "25rem",
                fontSize: "0.875rem",
                lineHeight: "1.375rem",
                borderRadius: "0.5rem",
                background: "#666",
                fontFamily: "Satoshi",
                fontWeight: "400",
              }}
              content="The holding value only reflects the value of tokens supported by the Aggregation parade"
            />
          </div>
          <Button
            size="sm"
            className="bg-[#0BC48F] text-[#000] text-[1rem]"
            onClick={() => setIsStakingUsd(!isStakingUsd)}
          >
            Switch To {isStakingUsd ? "ETH" : "USD"}
          </Button>
        </p>
        <p className="w-full text-[2.5rem] font-[700]">
          {isStakingUsd
            ? `${formatNumberWithUnit(stakingUsdValue, "$")}`
            : `${formatNumberWithUnit(stakingEthValue, "ETH")}`}
        </p>
        <GradientButton
          className="w-full mt-[1.5rem] py-[1rem] text-[1.25rem] cursor-pointer"
          onClick={() => handleBridgeMore("ETH")}
        >
          Bridge More
        </GradientButton>
      </CardBox>
      <Modal
        classNames={{ closeButton: "text-[1.5rem]" }}
        style={{ minHeight: "600px" }}
        size="2xl"
        isOpen={bridgeModal.isOpen}
        onOpenChange={bridgeModal.onOpenChange}
      >
        <ModalContent className="mt-[2rem] mb-[3.75rem]">
          {(onClose) => (
            <>
              <ModalHeader>Bridge</ModalHeader>
              <ModalBody className="pb-8">
                <BridgeComponent bridgeToken={bridgeToken} onClose={onClose} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
