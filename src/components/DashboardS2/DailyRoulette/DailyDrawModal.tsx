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
import { UseDisclosureReturn } from "@nextui-org/use-disclosure";
import Marquee from "@/components/Marquee";
import { useRef, useState } from "react";
interface IProps {
  modalInstance: UseDisclosureReturn;
}

const DailyDrawModal: React.FC<IProps> = (props: IProps) => {
  const [spinging, setSpinging] = useState(false);
  const { modalInstance } = props;
  const drawRef = useRef<{ start: (target: number) => void }>();

  const handleDrawEnd = () => {};

  const handleSpin = async () => {
    //TODO call api
    setSpinging(true);
    await drawRef.current?.start(3);
    setSpinging(false);
  };

  return (
    <ModalContainer
      isDismissable={false}
      classNames={{ closeButton: "text-[1.5rem]" }}
      size="md"
      isOpen={modalInstance.isOpen}
      onOpenChange={modalInstance.onOpenChange}
    >
      <ModalContent className="mb-[5.75rem]">
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Daily Roulette
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col items-center">
                <Divide />
                <p className="text-neutral font-chakra text-[14px] mt-4 ">
                  On a daily basis, each user has x times of opportunity to
                  participate in a Roulette game on the campaign page. Users
                  have the probability to win trademarks and Lynks. The minimum
                  reward will be 1 Nova Points.
                </p>
              </div>
              <Marquee ref={drawRef} onDrawEnd={handleDrawEnd} />
              <SpinPointer>
                <img src="/img/s2/icon-daily-spin-pointer.png" alt="" />
              </SpinPointer>
            </ModalBody>
            <ModalFooter>
              <div className="flex flex-col w-full">
                <SpinButton onClick={handleSpin} isLoading={spinging}>
                  <img src="/img/s2/icon-spin.svg" alt="" />
                  <span>Spin Your Daily Roulette</span>
                </SpinButton>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </ModalContainer>
  );
};

const Divide = styled.div`
  opacity: 0.75;
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(251, 251, 251, 0.6) 51.5%,
    rgba(255, 255, 255, 0) 100%
  );
`;
const SpinButton = styled(Button)`
  border-radius: 73.785px;
  background: #1d4138;
  box-shadow: 0px 2.306px 18.446px 0px rgba(0, 0, 0, 0.15),
    0px 0px 13.835px 0px rgba(255, 255, 255, 0.75) inset;
  height: 54px;
  gap: 8px;
`;

const SpinPointer = styled.div`
  position: absolute;
  bottom: 0px;
  left: 50%;
  right: 0;
  transform: translateX(-50%);
  width: 100%;
  z-index: -1;
`;
const ModalContainer = styled(Modal)`
  background: url("img/s2/bg-spin-container.svg") no-repeat;
  background-size: cover;
  width: 400px;
`;
export default DailyDrawModal;
