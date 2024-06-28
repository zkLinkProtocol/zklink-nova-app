import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import styled from "styled-components";
import Calendar from "./Calendar";

const Container = styled.div`
  .checkin-btn {
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
    background: none;
  }
`;

const PorgressBar = styled.div`
  position: relative;
  color: #fff;
  font-family: "Chakra Petch";
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  .progress-item {
    position: relative;
    width: 20%;

    &:last-child {
      .bar-content {
        display: none;
      }
    }

    &.active {
      .bar {
        .bar-node {
          background-color: #48e9b0;
        }
      }
    }

    .bar {
      position: relative;
      margin-top: 12px;
      margin-bottom: 20px;

      .bar-node {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: #3c9078;
      }

      .bar-content {
        position: absolute;
        top: 8px;
        left: 20px;
        right: -4px;
        /* width: 100%; */
        height: 8px;
        border-radius: 8px;
        background: #3c9078;

        .bar-inner {
          width: 0;
          height: 100%;
          border-radius: 8px;
          background-color: #48e9b0;
        }
      }
    }
  }
`;

export default () => {
  const checkinModal = useDisclosure();
  const progressList = [
    {
      points: "10 Points",
      days: "1 day",
      isActive: true,
      progress: "50%",
    },
    {
      points: "20 Points",
      days: "7 days",
    },
    {
      points: "40 Points",
      days: "14 days",
    },
    {
      points: "80 Points",
      days: "21 days",
    },
    {
      points: "120 Points",
      days: "28+ days",
    },
  ];

  return (
    <Container>
      <Button
        className="checkin-btn"
        variant="bordered"
        onClick={checkinModal.onOpen}
      >
        Check In
      </Button>
      <Modal
        size="3xl"
        isOpen={checkinModal.isOpen}
        onOpenChange={checkinModal.onOpenChange}
        hideCloseButton
      >
        <ModalContent className="mt-[2rem] py-[40px] px-[24px]">
          <ModalHeader className="px-0 pt-0 flex items-center justify-between">
            <span>Daily Check-in</span>
            <span>Earner Points: 100</span>
          </ModalHeader>

          <ModalBody className="px-0 py-0">
            <div>
              <p>
                Every day you check-in on zkLink Nova, you will receive 100
                Holding Points. The longer your consecutive check-in days, the
                more points you will receive.
              </p>
            </div>

            <PorgressBar className="flex items-center">
              <div className="bar-bg"></div>
              {progressList.map((item, index) => (
                <div
                  key={index}
                  className={`progress-item ${item.isActive ? "active" : ""}`}
                >
                  <div>{item.points}</div>
                  <div className="bar">
                    <div className="bar-node"></div>
                    <div className="bar-content">
                      <div
                        className="bar-inner"
                        style={{ width: item.progress }}
                      ></div>
                    </div>
                  </div>
                  <div>{item.days}</div>
                </div>
              ))}
            </PorgressBar>

            <div className="flex justify-center">
              <Calendar />
            </div>

            <div className="mt-[60px] flex items-center gap-[16px]">
              <Button
                className="secondary-btn w-full h-[48px] py-[0.5rem] font-[700] flex justify-center items-center gap-[0.38rem] text-[1rem] rounded-[6px]"
                onClick={() => checkinModal.onClose()}
              >
                Close
              </Button>
              <Button
                className="gradient-btn w-full h-[48px] py-[0.5rem] font-[700] flex justify-center items-center gap-[0.38rem] text-[1rem] rounded-[6px]"
                onClick={() => checkinModal.onClose()}
              >
                Check In
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};
