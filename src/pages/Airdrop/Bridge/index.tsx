import { useState, useMemo, useCallback, useEffect } from "react";
import styled from "styled-components";
import OTPInput from "react-otp-input";
import "@/styles/otp-input.css";
import {
  Avatar,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import {
  AiOutlineCheck,
  AiOutlineDown,
  AiOutlineUp,
  AiOutlineSearch,
} from "react-icons/ai";
import lineaIcon from "@/assets/img/linea.svg";
import ethereumIcon from "@/assets/img/ethereum.svg";
import cionIcon from "@/assets/img/cion.png";
import ethIcon from "@/assets/img/eth.svg";
import mantleIcon from "@/assets/img/mantle.svg";
import { goerli, lineaTestnet } from "wagmi/chains";
import { useBridgeTx } from "@/hooks/useBridgeTx";
import { utils } from "ethers";
import { useBridgeNetworkStore } from "@/hooks/useNetwork";
import { PRIMARY_CHAIN_KEY } from "@/constants/networks";
import { STORAGE_NETWORK_KEY } from "@/constants";

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

const fromList = [
  {
    label: "Ethereum Goerli Testnet",
    icon: ethereumIcon,
    chainId: goerli.id,
    networkKey: "goerli",
  },
  {
    label: "Linea Goerli Testnet",
    icon: lineaIcon,
    chainId: lineaTestnet.id,
    networkKey: PRIMARY_CHAIN_KEY,
  },
  {
    label: "Mantle Goerli Testnet",
    icon: mantleIcon,
    chainId: lineaTestnet.id,
    networkKey: "mantle",
  },
];
// const toList = [{ label: 'zkLink Nova Testnet', value: '1' }]
const tokenList = [
  {
    label: "ETH",
    desc: "Ether",
    value: 0,
    icon: ethIcon,
    address: "0x0000000000000000000000000000000000000000",
    isNative: true,
  },
  {
    label: "MTK",
    desc: "MTK",
    address: "0xAbD167356cecaB549794A4a93a7E919b9B51f64E",
    decimal: 18,
  },
];

export default function Bridge() {
  const web3Modal = useWeb3Modal();
  const { isConnected } = useAccount();
  const fromModal = useDisclosure();
  const tokenModal = useDisclosure();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { sendDepositTx, loading } = useBridgeTx();
  const [amount, setAmount] = useState(0);
  const [{ otp, numInputs, separator, placeholder, inputType }, setConfig] =
    useState({
      otp: "",
      numInputs: 4,
      separator: "",
      placeholder: "",
      inputType: "text" as const,
    });
  const [fromActive, setFromActive] = useState(0);
  const [tokenActive, setTokenActive] = useState(0);
  // const { setNetworkKey } = useNetworkStore();
  const { setNetworkKey } = useBridgeNetworkStore();

  useEffect(() => {
    const network = localStorage.getItem(STORAGE_NETWORK_KEY);
    if (network) {
      setNetworkKey(network);
    } else if (!network) {
      setNetworkKey(fromList[0].networkKey);
    }
  }, [setNetworkKey]);

  const handleOTPChange = (otp: string) => {
    setConfig((prevConfig) => ({ ...prevConfig, otp }));
  };

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

  const btnText = useMemo(() => {
    if (invalidChain) {
      return "Switch Network";
    } else {
      return "Continue";
    }
  }, [invalidChain]);

  const handleAction = useCallback(async () => {
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
      tokenList[tokenActive].address as `0x${string}`,
      utils.parseEther(String(amount))
    );
  }, [invalidChain, fromActive, switchChain, amount, sendDepositTx]);

  return (
    <>
      <div className="block lg:flex md:py-24 py-12">
        <div className="px-8 md:px-16 lg:px-32 lg:w-1/2">
          <h2 className="text-3xl">
            Bridge to Earn Yield and token rewards on zkLink Nova.
          </h2>
          <div className="text-base mt-10">
            <p>
              You will earn one of the four Nova SBT once you bridge any amount
              of supported token into zkLink Nova.
            </p>
            <div className="py-4">
              <OTPInput
                inputStyle="inputStyle"
                numInputs={numInputs}
                onChange={handleOTPChange}
                renderSeparator={<span>{separator}</span>}
                value={otp}
                placeholder={placeholder}
                inputType={inputType}
                renderInput={(props) => <input {...props} />}
                shouldAutoFocus
              />
            </div>
            <p>
              Upon collecting your SBT, you can upgrade it into an ERC7221 NFT
              through collecting 4 different types of trademark NFT through our
              referral program.
            </p>
            <p>
              You will get a trademark NFT airdrop for each 3 referrals <br />
              Top 50 on the referral leader-board will be airdrop a Mystery Box.
            </p>
            <p className="mt-8">
              Once you upgrade your SBT into , here are the Utility
            </p>
          </div>

          <p className="font-bold">ZKL Airdrop</p>
          <p className="font-bold">ZKL swags</p>
          <p className="font-bold">Future NFT whitelist</p>
          <p className="font-bold">zkLinkers event access</p>
          <p className="font-blod">GAS rebates</p>
        </div>
        <div className="px-8 md:px-16 lg:px-32 lg:w-1/2">
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
                <Avatar src={tokenList[tokenActive].icon} size="sm" />
                <span>{tokenList[tokenActive].label}</span>
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
          <div className="mt-8">
            {isConnected ? (
              <Button
                className="w-full rounded-full"
                disableAnimation
                size="lg"
                onClick={handleAction}
                isLoading={loading}
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
                  <Avatar src={item.icon} className="w-12 h-12" />
                  <span className="text-xl ml-4">{item.label}</span>
                </div>

                <span>0</span>
              </ModalSelectItem>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
