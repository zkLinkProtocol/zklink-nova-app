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

interface IProps {
  modalInstance: UseDisclosureReturn;
}
const InviteBoxModal = (props: IProps) => {
  const { modalInstance } = props;
  return (
    <Modal
      isDismissable={false}
      classNames={{ closeButton: "text-[1.5rem]" }}
      size="md"
      isOpen={modalInstance.isOpen}
      onOpenChange={modalInstance.onOpenChange}
    >
      <ModalContent className="mb-[5.75rem]">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Open your Invite Box
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-full bg-[#23262C] py-4 px-4 ">
                      <img
                        src="/img/s2/img-points-10.png"
                        className="w-[128px] h-[128px]"
                      />
                    </div>

                    <p className="w-full bg-[#1B1D20] flex items-center justify-center text-white font-chakra text-[14px] h-8">
                      +1 Nova Points
                    </p>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-full bg-[#23262C] py-4 px-4 ">
                      <img
                        src="/img/s2/img-points-50.png"
                        className="w-[128px] h-[128px]"
                      />
                    </div>

                    <p className="w-full bg-[#1B1D20] flex items-center justify-center text-white font-chakra text-[14px] h-8">
                      +50 Nova Points
                    </p>
                  </div>
                </div>

                <p className="text-white font-chakra text-[14px] mt-4 text-center">
                  With each referral, you'll have the chance to randomly draw
                  one of the invite rewards. Please notice that Nova points
                  rewards are not NFT, they'll be added directly to your Nova
                  Points.
                </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <div className="flex flex-col w-full">
                <Button className="w-full gradient-btn mb-3">Draw</Button>
                <Button className="w-full " onClick={onClose}>
                  Close
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default InviteBoxModal;
