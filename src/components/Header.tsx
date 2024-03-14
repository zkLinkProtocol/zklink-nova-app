import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Avatar,
  Tooltip,
} from "@nextui-org/react";
import { Link, NavLink, useSearchParams } from "react-router-dom";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import styled from "styled-components";
import { showAccount } from "@/utils";
import { useCallback, useEffect, useState } from "react";
import {
  setInvite,
  setSignature,
  setDepositStatus,
  airdropState,
  setDepositL1TxHash,
  setTwitterAccessToken,
  setInviteCode,
  setIsActiveUser,
  setDepositTx,
} from "@/store/modules/airdrop";
import { useDispatch, useSelector } from "react-redux";
import { useBridgeTx } from "@/hooks/useBridgeTx";
import { getInvite } from "@/api";
const nodeType = import.meta.env.VITE_NODE_TYPE;

const NavNet = styled.div`
  background: #313841;
  border-radius: 5px;
  margin-left: 10px;
  div {
    width: 79px;
    height: 22px;
    flex-shrink: 0;
    font-family: Satoshi;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 22px;
    letter-spacing: -0.5px;
    background: linear-gradient(
      90deg,
      #48ecae 0%,
      #606ff2 51.07%,
      #49ced7 100%
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-align: center;
  }
`;
const NavBox = styled.nav`
  a {
    color: #9ccbbd;
    font-family: Satoshi;
    font-size: 1rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.375rem; /* 137.5% */
    letter-spacing: -0.03125rem;
    &.active {
      color: #fff;
    }
  }
`;

const LogoBox = styled.div`
  .logo-text {
    position: absolute;
    left: 2.94rem;
    top: 0.63rem;
    color: #fff;
    font-family: Satoshi;
    font-size: 2rem;
    font-style: normal;
    font-weight: 700;
    line-height: 1.375rem; /* 68.75% */
  }
`;

const ButtonText = styled.span`
  color: #03d498;
  font-family: Heebo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.5rem; /* 150% */
`;

export default function Header() {
  const web3Modal = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { depositStatus, depositL1TxHash, invite, isActiveUser } = useSelector(
    (store: { airdrop: airdropState }) => store.airdrop
  );
  const { getDepositL2TxHash } = useBridgeTx();
  const dispatch = useDispatch();
  console.log("depositL1TxHash: ", depositL1TxHash);
  const [searchParams] = useSearchParams();

  const isActive = useCallback(() => {
    return isConnected && Boolean(invite?.twitterHandler);
  }, [isConnected, invite]);

  useEffect(() => {
    const inviteCode = searchParams.get("inviteCode");
    console.log("inviteCode", inviteCode);
    if (inviteCode && inviteCode.length === 6) {
      dispatch(setInviteCode(inviteCode));
    }
  }, [searchParams]);

  useEffect(() => {
    (async () => {
      if (!depositL1TxHash) {
        // dispatch(setDepositStatus(""));
        return;
      } else {
        dispatch(setDepositStatus("pending"));
        const l2hash = await getDepositL2TxHash(
          depositL1TxHash as `0x${string}`
        );
        if (l2hash) {
          dispatch(setDepositL1TxHash(""));
          dispatch(setDepositStatus("success"));
          setTimeout(() => {
            dispatch(setDepositStatus(""));
          }, 5000);
        }
      }
    })();
  }, [depositL1TxHash, getDepositL2TxHash, dispatch]);

  const [isHeaderTop, setIsHeaderTop] = useState(true);

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setIsHeaderTop(false);
    } else {
      setIsHeaderTop(true);
    }
  };
  const getInviteFunc = async () => {
    if (!address) return;
    const res = await getInvite(address);
    if (res?.result) {
      dispatch(setInvite(res?.result));
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    getInviteFunc();
    dispatch(setSignature(""));
  }, [address, isConnected]);

  useEffect(() => {
    if (!isConnected) {
      dispatch(setSignature(""));
      dispatch(setDepositTx(""));
      // dispatch(setTwitterAccessToken(''));
      dispatch(setInvite(null));
    }
  }, [isConnected]);

  useEffect(() => {
    console.log(
      "testt=----------",
      isConnected,
      invite,
      invite?.twitterHandler,
      Boolean(invite?.twitterHandler)
    );
    if (isConnected && Boolean(invite?.twitterHandler)) {
      dispatch(setIsActiveUser(true));
    } else {
      // dispatch(setInvite(null));
      dispatch(setIsActiveUser(false));
    }
  }, [invite, isConnected, address]);

  useEffect(() => {
    console.log("isActiveUser", isActiveUser);
  }, [invite]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Navbar
        // shouldHideOnScroll
        className={`md:px-[1.5rem] py-[0.75rem] fixed pt-0`}
        style={{
          // position: isHeaderTop ? 'fixed' : 'sticky',
          background: isHeaderTop ? "transparent" : "hsla(0,0%,9%,.88)",
        }}
        maxWidth="full"
        isBlurred={false}
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarContent>
          {/* mobile toggle button */}
          <NavbarMenuToggle
            className="mr-2 md:hidden md:mr-6 focus:outline-none"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          />
          {/* <Logo /> */}

          <Link to="/" onClick={() => dispatch(setTwitterAccessToken(""))}>
            <LogoBox className="relative">
              <img
                className="max-w-[120px] md:max-w-[145.431px] h-auto"
                src="/img/NOVA.svg"
              />
              {/* <span className='logo-text'>zk.Link</span> */}
            </LogoBox>
          </Link>
          <NavNet className="hidden md:flex">
            <div>Mainnet Live</div>
          </NavNet>
          {/* <NavBox className="ml-[3.5rem]"> */}
          <NavbarContent
            className="hidden md:flex gap-[2.5rem]"
            justify="center"
          >
            <NavbarItem>
              <NavLink to="/aggregation-parade" className="nav-link">
                Aggregation Parade
              </NavLink>
            </NavbarItem>
            {/* <NavbarItem>
                {isActive() ? (
                  <NavLink to="/dashboard" className="nav-link">
                    Dashboard
                  </NavLink>
                ) : (
                  <Tooltip content="Not Active">
                    <span className="nav-link cursor-not-allowed opacity-40">
                      Dashboard
                    </span>
                  </Tooltip>
                )}
              </NavbarItem> */}
            <NavbarItem>
              <NavLink to="/leaderboard">Leaderboard</NavLink>
            </NavbarItem>
            <NavbarItem>
              <NavLink to="/about">About</NavLink>
            </NavbarItem>
            <NavbarItem>
              <NavLink to="/bridge">Bridge</NavLink>
            </NavbarItem>
            {/* <NavbarItem>
                <a
                  href={
                    nodeType === "nexus-goerli"
                      ? "https://goerli.portal.zklink.io/bridge/"
                      : "https://portal.zklink.io/bridge/"
                  }
                  target="_blank"
                  className="flex items-center"
                >
                  <span>Bridge</span>
                  <MdArrowOutward className="size-[1.75rem]" />
                </a>
              </NavbarItem> */}
          </NavbarContent>
          {/* </NavBox> */}
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem className="hidden flex items-center gap-[1rem]">
            {/* if the user has completed the invitation */}
            {false && (
              <div className="flex items-center gap-[0.5rem]">
                <div className="text-right">
                  <div className="text-[1rem] text-[#7E7E7E]">YOUR POINTS</div>
                  <div className="text-[1rem] text-[#fff]">2000</div>
                </div>
                <Avatar
                  className="w-[2.5625rem] h-[2.5625rem]"
                  src="/img/icon-avatar.svg"
                />
              </div>
            )}
            {/* <Button
                            className='bg-blue-950'
                            onClick={() => web3Modal.open({ view: 'Networks' })}>
                            Network
                        </Button> */}
            {address && depositStatus && (
              <>
                {depositStatus === "pending" && (
                  <Tooltip
                    showArrow={true}
                    classNames={{
                      content: "max-w-[300px] p-4",
                    }}
                    content="Please allow a few minutes for your deposit to be confirmed on zkLink Nova."
                  >
                    <Button className="border-solid border-1 border-[#03D498] text-[#03D498] bg-[#000] ">
                      Pending Deposit
                      <div className="relative flex w-6 h-6">
                        <i className="absolute w-full h-full rounded-full animate-spinner-ease-spin border-solid border-t-transparent border-l-transparent border-r-transparent border-3 border-b-current"></i>
                        <i className="absolute w-full h-full rounded-full opacity-75 animate-spinner-linear-spin border-dotted border-t-transparent border-l-transparent border-r-transparent border-3 border-b-current"></i>
                      </div>
                    </Button>
                  </Tooltip>
                )}
                {depositStatus === "success" && (
                  <Tooltip
                    showArrow={true}
                    classNames={{
                      content: "max-w-[300px] p-4",
                    }}
                    content="Your funds have been deposited successfully."
                  >
                    <Button className="border-solid border-1 border-[#03D498] text-[#03D498]bg-[#000] ">
                      Successful Deposit <img src="/img/success.svg" alt="" />
                    </Button>
                  </Tooltip>
                )}
              </>
            )}
            {address && !depositStatus && (
              <Button
                className="hidden md:block border-solid border-1 border-[#03D498] text-[#03D498] bg-transparent font-bold"
                onClick={() =>
                  window.open(
                    nodeType === "nexus-goerli"
                      ? "https://goerli.portal.zklink.io/bridge/transfers"
                      : "https://portal.zklink.io/bridge/transfers",
                    "_blank"
                  )
                }
              >
                Deposit History
              </Button>
            )}
            <Button
              className="bg-[#1D4138] text-[#03D498] px-4 flex justify-center items-center gap-[0.75rem]"
              disableAnimation
              onClick={() => web3Modal.open()}
            >
              <img width={20} height={20} src="/img/icon-wallet.svg" />
              <ButtonText>
                {isConnected ? (
                  showAccount(address)
                ) : (
                  <span className="hidden md:block">Connect Wallet</span>
                )}
              </ButtonText>
            </Button>
          </NavbarItem>
        </NavbarContent>
        <NavbarMenu>
          <NavbarMenuItem>
            <NavLink to="/aggregation-parade" className="nav-link">
              Aggregation Parade
            </NavLink>
          </NavbarMenuItem>
          {/* <NavbarMenuItem>
                {isActive() ? (
                  <NavLink to="/dashboard" className="nav-link">
                    Dashboard
                  </NavLink>
                ) : (
                  <Tooltip content="Not Active">
                    <span className="nav-link cursor-not-allowed opacity-40">
                      Dashboard
                    </span>
                  </Tooltip>
                )}
              </NavbarMenuItem> */}
          <NavbarMenuItem>
            <NavLink to="/leaderboard">Leaderboard</NavLink>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <NavLink to="/about">About</NavLink>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <NavLink to="/bridge">Bridge</NavLink>
          </NavbarMenuItem>
          {/* <NavbarMenuItem>
                <a
                  href={
                    nodeType === "nexus-goerli"
                      ? "https://goerli.portal.zklink.io/bridge/"
                      : "https://portal.zklink.io/bridge/"
                  }
                  target="_blank"
                  className="flex items-center"
                >
                  <span>Bridge</span>
                  <MdArrowOutward className="size-[1.75rem]" />
                </a>
              </NavbarMenuItem> */}
        </NavbarMenu>
      </Navbar>
    </>
  );
}
