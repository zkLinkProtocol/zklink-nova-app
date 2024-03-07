import { useState, useMemo, useCallback, useEffect } from "react";
import styled from "styled-components";
import {
  Avatar,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
  Select,
  SelectItem,
  Tooltip,
} from "@nextui-org/react";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import {
  AiOutlineCheck,
  AiOutlineDown,
  AiOutlineUp,
  AiOutlineSearch,
} from "react-icons/ai";
import cionIcon from "@/assets/img/cion.png";

import { useBridgeTx } from "@/hooks/useBridgeTx";
import { utils } from "ethers";
import { useBridgeNetworkStore } from "@/hooks/useNetwork";
import Tokens from "@/constants/tokens";
import { STORAGE_NETWORK_KEY } from "@/constants";
import fromList from "@/constants/fromChainList";
import useTokenBalanceList from "@/hooks/useTokenList";
import { ETH_ADDRESS } from "zksync-web3/build/src/utils";
import { useDispatch, useSelector } from "react-redux";
import { bindInviteCodeWithAddress } from "@/api";
const ModalSelectItem = styled.div`
  &:hover {
    background-color: rgb(61, 66, 77);
    border-radius: 8px;
  }
`;

const SelectBox = styled.div`
  & {
    background-color: rgb(38 43 51);
  }
  .selector {
    background-color: rgb(61 66 77);
    &:hover {
      background-color: rgb(85 90 102);
    }
  }
`;

export interface IBridgeComponentProps {
  isFirstDeposit: boolean;
  onClose?: () => void;
  bridgeToken?: string;
}
const InviteCodeTypes = [
  { label: "Join Group", value: "join" },
  { label: "Create Group", value: "create" },
];
export default function Bridge(props: IBridgeComponentProps) {
  const { isFirstDeposit, onClose, bridgeToken } = props;
  const web3Modal = useWeb3Modal();
  const { isConnected, address } = useAccount();
  const fromModal = useDisclosure();
  const tokenModal = useDisclosure();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { sendDepositTx, loading } = useBridgeTx();
  const [amount, setAmount] = useState(0);
  const [inviteCodeType, setInviteCodeType] = useState(
    InviteCodeTypes[0].value
  );
  const { inviteCode, isGroupLeader, signature, twitter, invite } = useSelector(
    (store: RootState) => store.airdrop
  );

  const [inputInviteCode, setInputInviteCode] = useState("");

  const [fromActive, setFromActive] = useState(0);
  const [tokenActive, setTokenActive] = useState(0);
  // const { setNetworkKey } = useNetworkStore();
  const { setNetworkKey } = useBridgeNetworkStore();
  const { tokenList, refreshTokenBalanceList } = useTokenBalanceList();

  const [points, setPoints] = useState(0);
  const [showNoPointsTip, setShowNoPointsTip] = useState(false);
  const [minDepositValue, setMinDepositValue] = useState(0.1);

  useEffect(() => {
    if (inviteCode) {
      setInputInviteCode(inviteCode);
    }
  }, [inviteCode, setInputInviteCode]);

  useEffect(() => {
    if (isFirstDeposit) {
      const network = localStorage.getItem(STORAGE_NETWORK_KEY);
      if (network) {
        setNetworkKey(network);
        if (fromList[0].networkKey !== network) {
          const index = fromList.findIndex(
            (item) => item.networkKey === network
          );
          if (index > -1) {
            setFromActive(index);
          }
        }
      } else if (!network) {
        setNetworkKey(fromList[0].networkKey);
      }
    } else if (bridgeToken) {
      const token = Tokens.find((item) => item.address === bridgeToken);
      if (token) {
        const _tokenList = Tokens.filter(
          (item) => item.networkKey === token.networkKey
        );
        let index = 0;
        const fromIndex = fromList.findIndex(
          (item) => item.networkKey === token.networkKey
        );
        const from = fromList[fromIndex];
        if (token.address !== ETH_ADDRESS) {
          index = _tokenList.findIndex(
            (item) => item.address === token.address
          );
          if (from?.isEthGasToken) {
            index++;
          }
          setTokenActive(index);
        }
        setFromActive(fromIndex);
        setNetworkKey(from.networkKey);
      }
    }
  }, [setNetworkKey, isFirstDeposit, bridgeToken]);

  useEffect(() => {
    //TODO get points from api;
    //TODO get current min deposit value
    //TODO set if show no points tip
    setPoints(200);
  }, [amount, tokenActive]);

  const handleFrom = (index: number) => {
    setFromActive(index);
    setNetworkKey(fromList[index].networkKey);
    fromModal.onClose();
  };

  const handeToken = (index: number) => {
    setTokenActive(index);
    tokenModal.onClose();
  };

  const invalidChain = useMemo(() => {
    return chainId !== fromList[fromActive].chainId;
  }, [chainId, fromActive]);

  const actionBtnDisabled = useMemo(() => {
    if (
      !invalidChain &&
      tokenList[fromActive] &&
      (!tokenList[fromActive].balance || tokenList[fromActive].balance! < 0)
    ) {
      return true;
    }
    return false;
  }, [tokenList, fromActive, invalidChain]);

  const btnText = useMemo(() => {
    if (invalidChain) {
      return "Switch Network";
    } else {
      return "Continue";
    }
  }, [invalidChain]);

  const handleAction = useCallback(async () => {
    if (!address) return;
    if (invalidChain) {
      switchChain(
        { chainId: fromList[fromActive].chainId },
        {
          onError: (e) => {
            console.log(e);
          },
        }
      );
      return;
    }
    if (!amount) {
      return;
    }
    await sendDepositTx(
      tokenList[tokenActive]?.address as `0x${string}`,
      utils.parseEther(String(amount))
    );
    refreshTokenBalanceList();
    if (isFirstDeposit) {
      await bindInviteCodeWithAddress({
        address,
        code: inputInviteCode,
        signature,
        twitterHandler: twitter.username,
        twitterName: twitter.name,
      });
    }
    //TODO call api to save referel data
    onClose?.();
  }, [
    invalidChain,
    amount,
    sendDepositTx,
    tokenList,
    tokenActive,
    refreshTokenBalanceList,
    address,
    inputInviteCode,
    signature,
    onClose,
    switchChain,
    fromActive,
    twitter,
    isFirstDeposit,
  ]);

  return (
    <>
      <div className="">
        <h2 className="text-3xl">Bridge</h2>
        <SelectBox className="mt-8 px-8 py-8 bg-gray-700 rounded-3xl">
          <div className="flex items-center gap-4">
            <span className="font-bold">From</span>
            <div
              className="selector flex items-center gap-2 px-4 py-2 rounded-2xl cursor-pointer"
              onClick={() => fromModal.onOpen()}
            >
              <Avatar src={fromList[fromActive].icon} size="sm" />
              <span>{fromList[fromActive].label}</span>
              {fromModal.isOpen ? <AiOutlineUp /> : <AiOutlineDown />}
            </div>
          </div>
          <div className="flex items-center gap-4 mt-10">
            <Input
              classNames={{ input: "text-4xl" }}
              size="lg"
              type="number"
              placeholder="0"
              variant={"underlined"}
              value={String(amount)}
              onValueChange={setAmount}
            />

            <div
              className="selector flex items-center gap-2 px-4 py-4 rounded-3xl cursor-pointer"
              onClick={() => tokenModal.onOpen()}
            >
              <Avatar src={tokenList[tokenActive]?.icon} size="sm" />
              <span>{tokenList[tokenActive]?.symbol}</span>
            </div>
          </div>
        </SelectBox>
        <SelectBox className="flex items-center gap-4 mt-8 px-8 py-8 bg-gray-700 rounded-3xl">
          <span className="font-bold">To</span>
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl cursor-pointer">
            <Avatar src={cionIcon} size="sm" />
            <span>zkLink Nova Testnet</span>
          </div>
        </SelectBox>
        <div className="mt-8 px-8 py-8 bg-gray-700 rounded-3xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <span>Nova Points</span>
              <span>10x Boost</span>
              <Tooltip content="some tip about nova points">
                <img
                  src={"/img/icon-help.png"}
                  className="w-[16px] cursor-pointer ml-1"
                />
              </Tooltip>
            </div>
            <div className="flex items-center">
              <span>{points}</span>
              {showNoPointsTip && (
                <Tooltip content="some tip about 0 nova points">
                  <img
                    src={"/img/icon-help.png"}
                    className="w-[16px] cursor-pointer ml-1"
                  />
                </Tooltip>
              )}
            </div>
          </div>
          {isFirstDeposit && (
            <div className="flex items-center justify-between mb-2">
              <span>Invite Code</span>
              <div className="flex items-center">
                {inviteCodeType === "join" && (
                  <Input
                    className="w-[120px] mr-2"
                    size="sm"
                    value={inputInviteCode}
                    onValueChange={setInputInviteCode}
                    placeholder="Invite code"
                  />
                )}
                <Select
                  className="max-w-xs w-[140px]"
                  value={inviteCodeType}
                  onChange={(e) => {
                    setInviteCodeType(e.target.value);
                  }}
                  size="sm"
                  selectedKeys={[inviteCodeType]}
                >
                  {InviteCodeTypes.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between mb-2">
            <span>Est.fee</span>
            <span>0.002 ETH</span>
          </div>
        </div>
        <div className="mt-8">
          {isConnected ? (
            <Button
              className="w-full rounded-full"
              disableAnimation
              size="lg"
              onClick={handleAction}
              isLoading={loading}
              disabled={actionBtnDisabled}
            >
              {btnText}
            </Button>
          ) : (
            <Button
              className="w-full rounded-full"
              size="lg"
              color="primary"
              disableAnimation
              onClick={() => web3Modal.open()}
            >
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
      <Modal
        style={{ minHeight: "600px", backgroundColor: "rgb(38, 43, 51)" }}
        size="2xl"
        isOpen={fromModal.isOpen}
        onOpenChange={fromModal.onOpenChange}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-3xl">
            From
          </ModalHeader>
          <ModalBody className="pb-8">
            {fromList.map((item, index) => (
              <ModalSelectItem
                className="flex items-center justify-between p-4 cursor-pointer"
                key={index}
                onClick={() => handleFrom(index)}
              >
                <div className="flex items-center">
                  <Avatar src={item.icon} className="w-12 h-12" />
                  <span className="text-xl ml-4">{item.label}</span>
                </div>

                {index === fromActive && <AiOutlineCheck />}
              </ModalSelectItem>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        style={{ minHeight: "600px", backgroundColor: "rgb(38, 43, 51)" }}
        size="2xl"
        isOpen={tokenModal.isOpen}
        onOpenChange={tokenModal.onOpenChange}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-3xl">
            Choose Token
          </ModalHeader>
          <ModalBody className="pb-8">
            <div>
              <Input
                classNames={{ input: "text-xl" }}
                variant="bordered"
                radius="lg"
                size="lg"
                placeholder="Symbol or address"
                startContent={
                  <AiOutlineSearch className="text-2xl text-gray-400" />
                }
              />
            </div>

            {tokenList.map((item, index) => (
              <ModalSelectItem
                className="flex items-center justify-between p-4 cursor-pointer"
                key={index}
                onClick={() => handeToken(index)}
              >
                <div className="flex items-center">
                  <Avatar src={item?.icon} className="w-12 h-12" />
                  <span className="text-xl ml-4">{item?.symbol}</span>
                </div>

                <span>{item?.formatedBalance}</span>
              </ModalSelectItem>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
