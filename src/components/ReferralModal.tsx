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
import { useState, useEffect } from "react";
import { SecondayButton, PrimaryButton } from "./ui/Button";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { ReferralPointsListItem, getReferralPointsList } from "@/api";
import { useAccount } from "wagmi";
import { formatNumberWithUnit, getTweetShareText } from "@/utils";
import { eventBus } from "@/utils/event-bus";
import { t } from "i18next";
type ReferacData = {
  username: string;
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
  const { invite } = useSelector((store: RootState) => store.airdrop);

  const [data, setData] = useState<ReferacData[]>([]);

  const { address } = useAccount();

  const getReferralPointsByCategory = (
    data: ReferralPointsListItem,
    category: string
  ) => {
    return data.points.find((point) => point.category === category)?.point || 0;
  };

  const getRefferralData = async () => {
    if (!address) return;
    const { data } = await getReferralPointsList(address);

    if (data) {
      const arr = data.map((item) => {
        const obj = {
          username: item.username,
          address: item.address,
          holding: getReferralPointsByCategory(item, "holding"),
          spotDex: getReferralPointsByCategory(item, "spotDex"),
          perpDex: getReferralPointsByCategory(item, "perpDex"),
          lending: getReferralPointsByCategory(item, "lending"),
          gameFi: getReferralPointsByCategory(item, "gameFi"),
          other: getReferralPointsByCategory(item, "other"),
        };
        return obj;
      });
      setData(arr);

      // setData(
      //   {
      //     address: res.data.address,
      //     holding: res.data.holding,
      //     spotDex: res.data.spotDex,
      //     perpDex: res.data.perpDex,
      //     lending: res.data.lending,
      //     gameFi: res.data.gameFi,
      //     other: res.data.other
      //   }
      // )
    }
  };

  useEffect(() => {
    getRefferralData();
  }, []);

  const handleCopy = () => {
    if (!invite?.code) return;
    navigator.clipboard.writeText(invite?.code);
    toast.success("Copied", { duration: 2000 });
  };

  const openRefeffalModal = () => {
    modal.onOpen();
  };

  useEffect(() => {
    eventBus.on("openRefeffalModal", openRefeffalModal);
    return () => {
      eventBus.remove("openRefeffalModal", openRefeffalModal);
    };
  }, []);

  return (
    <>
      <ReferralButton onClick={modal.onOpen}>
        <img
          src="/img/icon-invite-btn.png"
          alt=""
          className="absolute bottom-0 right-[48px] w-[37px]"
        />
        <span className="relative z-1">
          {t("header.ur_invite_code")}: {invite?.code}
        </span>
      </ReferralButton>
      <ModalContainer
        classNames={{ closeButton: "hidden" }}
        size="md"
        isOpen={modal.isOpen}
        onOpenChange={modal.onOpenChange}
      >
        <ModalContent className="mb-[5.75rem]">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex">
                    {t("header.ur_referrals")} ({data.length}/999)
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{t("header.ur_invite_code")}</span>
                    <InviteCode>
                      <span>{invite?.code}</span>
                      <img
                        onClick={handleCopy}
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
                    t("header.users"),
                    t("dashboard.holding"),
                    t("dashboard.spot_dex"),
                    t("dashboard.perp_dex"),
                    t("dashboard.lending"),
                    "GameFi",
                    t("dashboard.other"),
                  ].map((item) => (
                    <div key={item}>{item}</div>
                  ))}
                </TableHead>
                <div className="max-h-[400px] overflow-auto">
                  {data.map((item) => (
                    <TableBodyRow key={item.address}>
                      <div>{item.username}</div>
                      <div>{formatNumberWithUnit(item.holding)}</div>
                      <div>{formatNumberWithUnit(item.spotDex)}</div>
                      <div>{formatNumberWithUnit(item.perpDex)}</div>
                      <div>{formatNumberWithUnit(item.lending)}</div>
                      <div>{formatNumberWithUnit(item.gameFi)}</div>
                      <div>{formatNumberWithUnit(item.other)}</div>
                    </TableBodyRow>
                  ))}
                </div>

                <Divide />
              </ModalBody>
              <ModalFooter>
                <div className="flex w-full gap-6">
                  <SecondayButton className="flex-1" onClick={onClose}>
                    Close
                  </SecondayButton>
                  <PrimaryButton className="flex-1">
                    <img src="img/s2/icon-twitter.svg" alt="" />
                    <a
                      href={`https://twitter.com/intent/tweet?text=${getTweetShareText(
                        invite?.code ?? ""
                      )}`}
                      target="_blank"
                    >
                      Share your code on X to earn more
                    </a>
                  </PrimaryButton>
                </div>
              </ModalFooter>
            </>
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
  position: relative;
  padding: 12px 20px;
  border-radius: 24px;
  border: 1px solid rgba(51, 49, 49, 1);
  background: #10131c;
  filter: blur(0.125px);
  color: rgba(251, 251, 251, 0.6);
  text-align: right;
  font-family: Satoshi;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 110%; /* 17.6px */
  img.absolute {
    filter: grayscale(100%);
  }
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
