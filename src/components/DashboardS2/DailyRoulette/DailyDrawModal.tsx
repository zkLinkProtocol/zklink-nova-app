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
    <Modal
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
              Open your Invite Box
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col items-center">
                <p>Daily Roulette</p>
                <p className="text-white font-chakra text-[14px] mt-4 text-center">
                  On a daily basis, each user has x times of opportunity to
                  participate in a Roulette game on the campaign page. Users
                  have the probability to win trademarks and Lynks. The minimum
                  reward will be 1 Nova Points.
                </p>
              </div>
              <Marquee ref={drawRef} onDrawEnd={handleDrawEnd} />
            </ModalBody>
            <ModalFooter>
              <div className="flex flex-col w-full">
                <Button
                  className="w-full gradient-btn mb-3"
                  onClick={handleSpin}
                  isLoading={spinging}
                >
                  Spin
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DailyDrawModal;
