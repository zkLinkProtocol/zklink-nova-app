import { CardBox, GradientText } from "@/styles/common";
import styled from "styled-components";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useMemo, useState } from "react";
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
  name: string;
  handler: string;
  link: string;
  iconURL: string;
  booster: string;
  type: string;
  points: {
    name: string;
    value: string;
  }[];
  status: string;
  multiplier: string;
  description: string;
  earned: string;
}

export function EcoDAppsItem({ data }: { data: EcoDAppsProps }) {
  const warningModal = useDisclosure();
  const [recognize, setRecognize] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <>
      <div>
        <div className="px-[1.5rem] py-[1rem] flex items-center border-b-1 border-[#292A2A]">
          <Td className="flex items-center gap-[0.5rem]">
            <img src={data.iconURL} className="w-[2.25rem] h-[2.25rem]" />
            <div>
              <p
                className="text-[1rem] font-[700] flex items-center gap-1 cursor-pointer"
                onClick={() => warningModal.onOpen()}
              >
                <span>{data.name}</span>
                <img
                  src="/img/icon-open-in-new.svg"
                  className="w-[1rem] h-[1rem]"
                />
              </p>
              <p className="text-[0.625rem] text-[#0AC18D] font-[700]">
                {data.handler}
              </p>
            </div>
            <Tag className="px-[1rem] py-[0.12rem]">
              <span className="text text-[#0bc48f]">{data.booster} boost</span>
            </Tag>
          </Td>
          <Td>
            <p className="text-[1rem] font-[700]">{data.type}</p>
          </Td>
          <Td className="flex justify-between items-center">
            <div>
              <GradientText data-tooltip-id={data.name}>
                {data.earned}
              </GradientText>
              <ReactTooltip
                id={data.name}
                place="bottom"
                style={{
                  fontSize: "14px",
                  background: "#666",
                  borderRadius: "0.5rem",
                  width: "16.5rem",
                }}
                render={() => (
                  <div>
                    {data.points.map((item, index) => (
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
            <Tag
              className="px-[1rem] py-[0.12rem] flex items-center gap-1"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <span className="text text-[#fff] whitespace-nowrap cursor-pointer">
                How to Earn
              </span>
              {isCollapsed ? <AiFillCaretDown /> : <AiFillCaretUp />}
            </Tag>
          </Td>
        </div>

        {!isCollapsed && (
          <div className="px-[1.5rem] py-[1rem] flex justify-between border-b-1 border-[#292A2A]">
            <div>
              <SubTh>Status</SubTh>
              <p className="text-[0.875rem] ">{data.status}</p>
            </div>
            <div>
              <SubTh>Multiplier</SubTh>
              <p className="text-[0.875rem]">{data.multiplier}</p>
            </div>
            <div>
              <SubTh>Description</SubTh>
              <p className="max-w-[27.1875rem] text-[0.875rem] whitespace-wrap">
                {data.description}
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
        )}
      </div>

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
                  window.open(data.link, "_blank");
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

export default function EcoDApps({ data }: { data: EcoDAppsProps[] }) {
  return (
    <>
      <CardBox className="relative mt-[1.5rem] min-h-[30rem] overflow-auto">
        <div className="min-w-[820px]">
          <div className="px-[1.5rem] py-[0.5rem] rounded-[1rem] bg-[#081A23] flex items-center">
            {["Name", "Type", "Your Earned"].map((item, index) => (
              <Th key={index}>{item}</Th>
            ))}
          </div>
          {data.map((item, index) => (
            <EcoDAppsItem data={item} key={index} />
          ))}
        </div>

        <p className="px-[1rem] py-[3rem] w-full text-[#999] text-[1rem] text-center">
          More zkLink Nova ecosystem dApps will be supported soon, and all Nova
          Points earned prior to dApp support will be retained.
        </p>
      </CardBox>
    </>
  );
}
