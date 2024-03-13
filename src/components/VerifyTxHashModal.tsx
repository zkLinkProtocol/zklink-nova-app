import { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
  Select,
  SelectItem,
  Button,
  Input,
  Avatar,
} from "@nextui-org/react";
import FromList from "@/constants/fromChainList";
import { useAccount } from "wagmi";
import { useVerifyStore } from "@/hooks/useVerifyTxHashSotre";
import useVerifyTxHash from "@/hooks/useVerifyTxHash";

export const enum VerifyResult {
  "SUCCESS" = "SUCCESS",
  "FAILED" = "FAILED",
  "PENDING" = "PENDING",
  "INVALID" = "INVALID",
}

interface IProps {
  onVerifyResult: (result: VerifyResult) => void;
}
const VerifyTxHashModal = (props: IProps) => {
  const { address } = useAccount();
  const modal = useDisclosure();
  const [selectedRpc, setSelectedRpc] = useState(FromList[0].rpcUrl);
  const { onVerifyResult } = props;
  const [txhash, setTxhash] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const { txhashes } = useVerifyStore();
  const { verifyTxhash } = useVerifyTxHash();
  const handleAction = async () => {
    try {
      setLoading(true);
      const tx = await verifyTxhash(selectedRpc, txhash);
      console.log("verify txhash: ", tx);
      onVerifyResult(VerifyResult.SUCCESS);
      modal.onClose();
    } catch (e) {
      console.error(e);
      if (
        e.messsage === "tx hash not found" ||
        e.message.includes("invalid hash")
      ) {
        setStatus(VerifyResult.INVALID);
      } else if (e.message === "deposit not found") {
        setStatus(VerifyResult.PENDING);
      }
    } finally {
      setLoading(false);
    }
  };

  const actionBtnDisabled = useMemo(() => {
    return !txhash || loading;
  }, [txhash, loading]);

  const btnText = useMemo(() => {
    return "Verify";
  }, []);

  useEffect(() => {
    if (!modal.isOpen) {
      setTxhash("");
      setStatus("");
    }
  }, [modal.isOpen]);

  useEffect(() => {
    if (modal.isOpen && address && txhashes[address]?.length > 0) {
      setTxhash(txhashes[address][0]?.txhash);
      // @ts-expect-error invalid rpcUrl
      setSelectedRpc(txhashes[address][0]?.rpcUrl);
    }
  }, [txhashes, modal.isOpen, address]);

  return (
    <>
      <Button onClick={() => modal.onOpen()}>Verify</Button>
      <Modal
        style={{ width: "600px", backgroundColor: "rgb(38, 43, 51)" }}
        size="2xl"
        isOpen={modal.isOpen}
        onOpenChange={modal.onOpenChange}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-lg font-normal">
            Verify you deposit
          </ModalHeader>
          <ModalBody className="pb-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                <Select
                  items={FromList}
                  classNames={{
                    trigger: "w-[140px] min-h-[56px] h-[56px] bg-[#313841]",
                  }}
                  className="max-w-xs w-[140px] h-[38px] mr-4"
                  value={selectedRpc}
                  onChange={(e) => {
                    setSelectedRpc(e.target.value);
                  }}
                  size="sm"
                  selectedKeys={[selectedRpc]}
                  renderValue={(items) => {
                    return items.map((item) => {
                      return (
                        <div key={item.key} className="flex items-center gap-2">
                          <Avatar
                            className="flex-shrink-0"
                            size="sm"
                            src={item.data.icon}
                          />
                          <span>{item.data.chainName}</span>
                        </div>
                      );
                    });
                  }}
                >
                  {(chain) => (
                    <SelectItem key={chain.rpcUrl} textValue={chain.chainName}>
                      <div className="flex gap-2 items-center">
                        <Avatar
                          alt={chain.chainName}
                          className="flex-shrink-0"
                          size="sm"
                          src={chain.icon}
                        />
                        <span className="text-small">{chain.chainName}</span>
                      </div>
                    </SelectItem>
                  )}
                </Select>
                <Input
                  classNames={{ input: "text-xl" }}
                  size="md"
                  placeholder="Please enter your tx hash"
                  variant={"underlined"}
                  value={String(txhash)}
                  onValueChange={setTxhash}
                  onWheel={(e) => e.preventDefault()}
                />
              </div>

              <Button
                className="gradient-btn w-full rounded-full mt-5 "
                style={{ display: "flex", alignItems: "center" }}
                disableAnimation
                size="md"
                onClick={handleAction}
                isLoading={loading}
                disabled={actionBtnDisabled}
              >
                {btnText}
              </Button>
            </div>
            <div className="text-lg font-normal">
              {status === VerifyResult.PENDING && (
                <p className="text-[#03D498]">
                  Your deposit is still being processed. The estimated remaining
                  wait time is approximately x minutes.
                </p>
              )}
              {status === VerifyResult.INVALID && (
                <p className="text-[#C57D10]">
                  Invalid transaction hash, please check the transaction hash
                  and network. Also, check the wallet you're connected to.
                </p>
              )}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default VerifyTxHashModal;
