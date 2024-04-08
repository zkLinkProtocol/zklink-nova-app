import { CardBox, GradientText } from "@/styles/common";
import styled from "styled-components";
import { AiFillCaretUp } from "react-icons/ai";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { formatNumberWithUnit } from "@/utils";

const Tag = styled.span`
  border-radius: 0.375rem;
  background: rgba(11, 196, 143, 0.24);
  .text {
    text-align: center;
    font-family: Satoshi;
    font-size: 0.75rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.5rem; /* 200% */
    letter-spacing: -0.00375rem;
    white-space: nowrap;
  }
`;

const Th = styled.div`
  color: #7e7e7e;
  font-family: Satoshi;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.5rem; /* 171.429% */
  letter-spacing: -0.00438rem;
  flex: 1 1 0px;
`;

const Td = styled.div`
  flex: 1 1 0px;
`;

const SubTh = styled.div`
  color: #7e7e7e;
  font-family: Satoshi;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.5rem; /* 171.429% */
  letter-spacing: -0.00438rem;
`;

interface EcoDAppsProps {
  lrtNovaPoints: number;
}

export default function EcoDApps({ lrtNovaPoints }: EcoDAppsProps) {
  const warningModal = useDisclosure();
  const [recognize, setRecognize] = useState(false);

  const [pointsList, setPointsList] = useState<
    {
      name: string;
      value: number | string;
    }[]
  >([
    {
      name: "Nova Points",
      value: 0,
    },
    {
      name: "LayerBank Points",
      value: "Comming soon",
    },
    {
      name: "Puffer Points",
      value: 0,
    },
    {
      name: "Eigenlayer Points",
      value: 0,
    },
  ]);

  useEffect(() => {
    setPointsList((prev) =>
      prev.map((item) => {
        if (item.name === "Nova Points") {
          return {
            ...item,
            value: formatNumberWithUnit(lrtNovaPoints),
          };
        }
        return item;
      })
    );
  }, [lrtNovaPoints]);

  return (
    <>
      <CardBox className="mt-[1.5rem] min-h-[30rem] min-w-[820px]">
        <div>
          <div className="px-[1.5rem] py-[0.5rem] rounded-[1rem] bg-[#081A23] flex items-center">
            {/* {["Name", "Type", "Your Earned"].map((item, index) => (
          <Th key={index}>{item}</Th>
        ))} */}

            <Th>Name</Th>
            <Th>Type</Th>
            <Th className="flex items-center gap-1">
              <span>Your Earned</span>

              {/* <
                data-tooltip-id="your-eraned"
                src="/img/icon-info.svg"
                className="w-[0.875rem] h-[0.875rem] opacity-40"
              /> */}
            </Th>
          </div>

          {/* <ReactTooltip
        id="your-eraned"
        place="top"
        style={{ fontSize: "14px", borderRadius: "16px" }}
        content="More points will be listed here soon."
      /> */}

          <div className="px-[1.5rem] py-[1rem] flex items-center border-b-1 border-[#292A2A]">
            <Td className="flex items-center gap-[0.5rem]">
              <img
                src="/img/icon-layerbank.svg"
                className="w-[2.25rem] h-[2.25rem]"
              />
              <div>
                <p
                  className="text-[1rem] font-[700] flex items-center gap-1 cursor-pointer"
                  onClick={() => warningModal.onOpen()}
                >
                  <span>LayerBank</span>
                  <img
                    src="/img/icon-open-in-new.svg"
                    className="w-[1rem] h-[1rem]"
                  />
                </p>
                <p className="text-[0.625rem] text-[#0AC18D] font-[700]">
                  @LayerBankFi
                </p>
              </div>
              <Tag className="px-[1rem] py-[0.12rem]">
                <span className="text text-[#0bc48f]">2x boost</span>
              </Tag>
            </Td>
            <Td>
              <p className="text-[1rem] font-[700]">Lending</p>
            </Td>
            <Td className="flex justify-between items-center">
              <div>
                <GradientText data-tooltip-id="layerbank-points">
                  {pointsList.length} Points
                </GradientText>
                <ReactTooltip
                  id="layerbank-points"
                  place="bottom"
                  style={{
                    fontSize: "14px",
                    background: "#666",
                    borderRadius: "0.5rem",
                    width: "16.5rem",
                  }}
                  render={() => (
                    <div>
                      {pointsList.map((item, index) => (
                        <p
                          key={index}
                          className="py-[0.25rem] flex justify-between items-center"
                        >
                          <span>{item.name}</span>
                          <span className="font-[700]">{item.value}</span>
                        </p>
                      ))}
                    </div>
                  )}
                />
              </div>
              <Tag className="px-[1rem] py-[0.12rem] flex items-center gap-1">
                <span className="text text-[#fff] whitespace-nowrap">
                  How to Earn
                </span>
                <AiFillCaretUp />
              </Tag>
            </Td>
          </div>
        </div>
        <div>
          <div className="px-[1.5rem] py-[1rem] flex justify-between items-center">
            <div>
              <SubTh>Status</SubTh>
              <p className="text-[0.875rem] ">Live</p>
            </div>
            <div>
              <SubTh>Multiplier</SubTh>
              <p className="text-[0.875rem]">2x Nova Points</p>
            </div>
            <div>
              <SubTh>Description</SubTh>
              <p className="max-w-[27.1875rem] text-[0.875rem] whitespace-wrap">
                For each block that liquidity is in a pool you earn points
                multiplied by the liquidity you provided
              </p>
            </div>
            <div className="text-right">
              <SubTh>Action</SubTh>
              <p
                className="text-[0.875rem] flex items-center gap-1 cursor-pointer"
                onClick={() => warningModal.onOpen()}
              >
                <span>Provide Liquidity</span>
                <img
                  src="/img/icon-open-in-new.svg"
                  className="w-[1rem] h-[1rem]"
                />
              </p>
            </div>
          </div>
        </div>
      </CardBox>

      <Modal
        classNames={{ closeButton: "text-[1.5rem]" }}
        className="bg-[#313841] max-w-[39rem] rounded-[1.5rem]"
        size="lg"
        isOpen={warningModal.isOpen}
        onOpenChange={warningModal.onOpenChange}
      >
        <ModalContent className="p-2 mb-20 md:mb-0">
          <ModalHeader>
            <div className="text-center w-full flex justify-center items-center gap-1">
              <img src="/img/icon-warning.svg" className="w-[2rem] h-[2rem]" />
              <span className="text-[1.5rem] font-[500]">WARNING</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <p className="text-[1.25rem] text-[#A0A5AD] font-[500] leading-[2rem]">
              You are about to access a third-party website. Please do your own
              research (DYOR) and avoid engaging in unfamiliar activities.
              Please note that zkLink and its affiliates are not liable for any
              losses, damages, or other consequences arising from your use of
              third-party websites.
            </p>
            <div className="mt-[1.88rem] flex items-center gap-2">
              <input
                type="checkbox"
                id="recognize"
                name="subscribe"
                value="newsletter"
                checked={recognize}
                onChange={(e) => setRecognize(e.target.checked)}
              />
              <label
                htmlFor="recognize"
                className="text-[#A0A5AD] text-[0.875rem] flex-1"
              >
                I recognize the risks and will take responsibility for actions
                on third-party websites.
              </label>
            </div>

            <div className="py-[1rem]">
              <Button
                className="gradient-btn w-full h-[2.1875rem] flex justify-center items-center gap-[0.38rem] text-[1rem] tracking-[0.0625rem] flex-1"
                disabled={!recognize}
                onClick={() => {
                  window.open("https://zklink.layerbank.finance/", "_blank");
                }}
              >
                Continue to Access
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}