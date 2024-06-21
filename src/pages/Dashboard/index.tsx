import styled from "styled-components";
import AssetsTable from "@/components/AssetsTable";
import { BgBox, BgCoverImg, CardBox } from "@/styles/common";
import { useEffect, useMemo, useState } from "react";
import ReferralList from "@/components/ReferralList";
import { RootState } from "@/store";
import {
  SupportToken,
  getAccountRefferalsTVL,
  getAccountTvl,
  getEigenlayerPoints,
  getExplorerTokenTvl,
  getGroupTvl,
  getPufferPoints,
  getReferralTvl,
  getRenzoPoints,
  getSupportTokens,
  getTokenPrice,
  getTotalTvlByToken,
  getMagPiePoints,
  getLayerbankPufferPoints,
  getRoyaltyBooster,
  getRsethPoints,
  getRemainMysteryboxDrawCount,
  getRemainMysteryboxDrawCountV2,
} from "@/api";
import { useAccount } from "wagmi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Loading from "@/components/Loading";
import NovaCharacter from "@/components/Dashboard/NovaCharacter";
import NovaPoints from "@/components/Dashboard/NovaPoints";
import StakingValue from "@/components/Dashboard/StakingValue";
import TvlSummary from "@/components/Dashboard/TvlSummary";
import { formatNumberWithUnit, sleep } from "@/utils";
import NFTCard from "./components/NFTCard";
import NFTCardV2 from "./components/NFTCardV2";
import EcoDApps, { EcoDAppsProps } from "@/components/Dashboard/EcoDApps";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react";
import { setIsNovaChadNftHide } from "@/store/modules/airdrop";
import { PUFFER_TOKEN_ADDRESS } from "@/constants";
import Banner from "@/components/Banner";
import useNovaPoints from "@/hooks/useNovaPoints";
import { Tooltip } from "react-tooltip";
import useNovaChadNftStatus from "@/hooks/useNovaChadNftStatus";
import TwitterVerify from "@/components/Dashboard/TwitterVerify";
import axios from "axios";
import NovaDropLink from "@/components/Dashboard/NovaDropLink";
import MysteryBoxIII from "@/components/Dashboard/MysteryBoxIII";

const TabsBox = styled.div`
  .tab-item {
    position: relative;
    color: #a9a9a9;
    font-family: Satoshi;
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 700;
    line-height: 2rem; /* 133.333% */
    letter-spacing: 0.09rem;
    user-select: none;
    cursor: pointer;
    &.active,
    &:hover {
      color: #fff;
    }
    &.notify {
      &::after {
        content: "";
        position: absolute;
        top: 0;
        right: -0.5rem;
        width: 0.5rem;
        height: 0.5rem;
        background-color: #ff0000;
        border-radius: 50%;
      }
    }
  }
`;

export type TotalTvlItem = {
  symbol: string;
  tokenAddress: string;
  amount: string;
  tvl: string;
  type: string;
  yieldType: string;
  iconURL: string | null;
};

export type AccountTvlItem = {
  tvl: string;
  amount: string;
  tokenAddress: string;
  symbol: string;
  iconURL: string | null;
};

export enum TabType {
  Eco = 0,
  Assets = 1,
  NFTs = 2,
  Referral = 3,
}

export function DisclaimerFooter() {
  return (
    <div className="flex justify-between items-center">
      <div className="right-[6rem] bottom-[1rem] flex justify-end items-end">
        <div className="flex items-center gap-[1rem]">
          <a href="https://blog.zk.link/" target="_blank">
            <img src="/img/icon-medium.svg" className="w-[1rem] h-[1rem]" />
          </a>
          <a href="https://discord.com/invite/zklink" target="_blank">
            <img src="/img/icon-dc.svg" className="w-[1rem] h-[1rem]" />
          </a>
          <a href="https://t.me/zkLinkorg">
            <img src="/img/icon-tg.svg" className="w-[1rem] h-[1rem]" />
          </a>
          <a href="https://twitter.com/zkLink_Official" target="_blank">
            <img
              src="/img/icon-twitter.svg"
              className="w-[0.75rem] h-[0.75rem]"
            />
          </a>
          <a href="https://github.com/zkLinkProtocol" target="_blank">
            <img src="/img/icon-github.svg" className="w-[1rem] h-[1rem]" />
          </a>
        </div>
      </div>
      <Link to="/about?anchor=disclaimer">zkLink Nova Disclaimer</Link>
    </div>
  );
}
export interface UserTvlData {
  binded: boolean;
  groupTvl: number;
  referrerTvl: number;
}

export default function Dashboard() {
  const { isConnected, address } = useAccount();
  const { invite, isNovaChadNftHide, isActiveUser } = useSelector(
    (store: RootState) => store.airdrop
  );
  const [tabsActive, setTabsActive] = useState(0);
  const [totalTvlList, setTotalTvlList] = useState<TotalTvlItem[]>([]);
  const [stakingUsdValue, setStakingUsdValue] = useState(0);
  const [stakingEthValue, setStakingEthValue] = useState(0);
  const [referrersTvlList, setReferrersTvl] = useState([]);
  const [accountTvlData, setAccountTvlData] = useState<AccountTvlItem[]>([]);
  const [groupTvl, setGroupTvl] = useState(0);
  const [totalTvl, setTotalTvl] = useState(0);
  const [referralTvl, setReferralTvl] = useState(0);
  const [supportTokens, setSupportTokens] = useState<SupportToken[]>([]);
  const [ethUsdPrice, setEthUsdPrice] = useState(0);
  const [nftPhase, setNftPhase] = useState(2); // default: phase 2
  const novaChadNftModal = useDisclosure();
  const { isMemeMysteryboxReward } = useNovaChadNftStatus();

  const {
    novaPoints,
    referPoints,
    layerbankNovaPoints,
    linkswapNovaPoints,
    aquaNovaPoints,
    izumiNovaPoints,
    symbiosisNovaPoints,
    orbiterNovaPoints,
    mesonNovaPoints,
    owltoNovaPoints,
    dAppNovaPoints,
    otherNovaPoints,
    kolPoints,
    totalNovaPoints,
    symbiosisBridgeNovaPoints,
    mesonBridgeNovaPoints,
    owltoBridgeNovaPoints,
    orbiterBridgeNovaPoints,
    interportNovaPoints,
    allsparkNovaPoints,
    logxNovaPoints,
    novaSwapNovaPoints,
    eddyFinanceNovaPoints,
    pointsDetail,
    rubicNovaPoints,
    zkdxNovaPoints,
    wagmiNovaPoints,
  } = useNovaPoints();

  const navigatorTo = useNavigate();

  const getAccountRefferalsTVLFunc = async () => {
    if (!address) return;
    const res = await getAccountRefferalsTVL(address);
    if (res.result) {
      setReferrersTvl(res.result);
    }
  };

  // const getAccounTvlFunc = async () => {
  //   if (!address) return;
  //   const res = await getAccounTvl(address);
  // };

  const getAccountTvlFunc = async () => {
    let usdPrice = 0;
    const tokenList = await getExplorerTokenTvl(true);
    const ethToken = tokenList.find((item) => item.symbol === "ETH");
    if (ethToken) {
      const res = await getTokenPrice(ethToken.l2Address);
      usdPrice = +res.usdPrice || 0;
      setEthUsdPrice(usdPrice);
    }

    if (!address) return;

    const res = await getAccountTvl(address);
    const { result } = res;
    let data = [];
    if (result && Array.isArray(result) && result.length > 0) {
      data = result;
    }
    setAccountTvlData(data);

    let usd = 0;
    let eth = 0;
    data.forEach((item) => {
      usd += +item?.tvl;
      eth += +item?.tvl;
    });
    setStakingEthValue(eth);
    setStakingUsdValue(usd * usdPrice);
  };

  const getTotalTvlByTokenFunc = async () => {
    const res = await getTotalTvlByToken();
    const { result } = res;
    let arr = [];
    if (result && Array.isArray(result) && result.length > 0) {
      arr = result;
    }
    setTotalTvlList(arr);
  };

  const getGroupTvlFunc = async () => {
    if (!address) return;
    const res = await getGroupTvl(address);
    setGroupTvl(res?.result || 0);
  };

  const getReferralTvlFunc = async () => {
    if (!address) return;
    const res = await getReferralTvl(address);
    setReferralTvl(res?.result || 0);
  };

  const getSupportTokensFunc = async () => {
    const res = await getSupportTokens();
    if (res && Array.isArray(res)) {
      setSupportTokens(res);
    }
  };

  const getTotalTvlFunc = async () => {
    // const res = await getTotalTvl();
    // setTotalTvl(res?.result || 0);
    const res = await getExplorerTokenTvl(false);

    let num = 0;
    if (res.length > 0) {
      num = +parseInt(res[0].tvl);
    }

    setTotalTvl(num);
  };

  const getEthUsdPrice = async () => {
    const tokenList = await getExplorerTokenTvl(true);
    const ethToken = tokenList.find((item) => item.symbol === "ETH");
    if (ethToken) {
      const res = await getTokenPrice(ethToken.l2Address);
      setEthUsdPrice(+res.usdPrice || 0);
    }
  };

  const [pufferEigenlayerPoints, setPufferEigenlayerPoints] = useState(0);
  const getEigenlayerPointsFunc = async () => {
    if (!address) return;
    const { data } = await getEigenlayerPoints(address);
    console.log("getEigenlayerPointsFunc", data);
    if (data && data?.eigenlayer_points) {
      setPufferEigenlayerPoints(+data.eigenlayer_points);
    }
  };

  const [pufferPoints, setPufferPoints] = useState(0);
  const getPufferPointsFunc = async () => {
    if (!address) return;
    const { data } = await getPufferPoints(address);

    if (data && Array.isArray(data) && data.length > 0) {
      const obj = data.find((item) => (item.address = address));
      if (obj) {
        setPufferPoints(+obj.points);
      }
    }
  };

  const [magpiePointsData, setMagpiePointsData] = useState<{
    points: number;
    layerPoints: number;
  }>({
    points: 0,
    layerPoints: 0,
  });

  const getMagpiePointsFunc = async () => {
    if (!address) return;
    const { data } = await getMagPiePoints(address);
    if (data && Array.isArray(data) && data.length > 0) {
      setMagpiePointsData({
        points: data.reduce(
          (prev, cur) => prev + Number(cur.points.eigenpiePoints),
          0
        ),
        layerPoints: data.reduce(
          (prev, cur) => prev + Number(cur.points.eigenLayerPoints),
          0
        ),
      });
    }
  };

  const [renzoPoints, setRenzoPoints] = useState(0);
  const [renzoEigenLayerPoints, setRenzoEigenLayerPoints] = useState(0);
  const getRenzoPointsFunc = async () => {
    if (!address) return;
    const { data } = await getRenzoPoints(address);

    if (data && Array.isArray(data) && data.length > 0) {
      setRenzoPoints(
        data.reduce((prev, item) => prev + +item.points.renzoPoints, 0)
      );

      setRenzoEigenLayerPoints(
        data.reduce((prev, item) => prev + +item.points.eigenLayerPoints, 0)
      );
    }
  };

  const [layerbankPufferPoints, setLayerbankPufferPoints] = useState(0);
  const [layerbankEigenlayerPoints, setLayerbankEigenlayerPoints] = useState(0);

  const getLayerbankPufferPointsFunc = async () => {
    if (!address) return;
    const { data } = await getLayerbankPufferPoints(
      address,
      PUFFER_TOKEN_ADDRESS
    );
    if (data && Array.isArray(data) && data.length > 0) {
      const points = data.reduce((prev, item) => prev + Number(item.points), 0);
      console.log("setLayerbankPufferPoints", points);
      setLayerbankPufferPoints(points);
    }
  };

  const [royaltyBooster, setRoyaltyBooster] = useState(0);
  const getRoyaltyBoosterFunc = async () => {
    if (!address) return;
    const { result } = await getRoyaltyBooster(address);
    if (result?.loyaltyBooster) {
      setRoyaltyBooster(Number(result.loyaltyBooster) || 0);
    }
  };

  const [kelpMiles, setKelpMiles] = useState(0);
  const [kelpEigenlayerPoints, setKelpEigenlayerPoints] = useState(0);

  const getRsethPointsFunc = async () => {
    if (!address) return;
    const { data } = await getRsethPoints(address);

    const kelpMiles = data.reduce(
      (prev, item) => prev + Number(item.points.kelpMiles || 0),
      0
    );
    const elPoints = data.reduce(
      (prev, item) => prev + Number(item.points.elPoints || 0),
      0
    );
    setKelpMiles(kelpMiles);
    setKelpEigenlayerPoints(elPoints);
  };

  const [bedrockPoints, setBedrockPoints] = useState(0);
  const [bedrockEigenlayerPoints, setBedrockEigenlayerPoints] = useState(0);

  const getBedrockPointsFunc = async () => {
    const address = "0xbecd67861bf48D3760cC8CBc24550381024D3Ad3";
    const res = await axios.get(
      `https://points.magic.top/third_protocol/get_userpoint_by_contract_address/0xAd16eDCF7DEB7e90096A259c81269d811544B6B6/${address}`,
      {
        headers: {
          accept: "application/json",
          "x-api-key":
            "E9XFnNGAthUbj6RhqZ2TVYbSJ4VgfLDs3GfZusYBSpJeGcHdnCa5ztY9N2qdYYC5D4fgZUnPtwNRC4RMvGHR6jzmMhvNjUAzFEyJRhYRS5D8tQseatv2autYMaCKtQJ4",
        },
      }
    );

    const { data, code } = res?.data;

    console.log("getBedrockPointsFunc", data);
    if (code === 200 && data) {
      setBedrockPoints(Number(data?.totalPoint) || 0);
      setBedrockEigenlayerPoints(Number(data?.totalEigenPodPoint) || 0);
    }
  };

  /**
   * Init: Get data from server
   */
  useEffect(() => {
    getEthUsdPrice();
    getSupportTokensFunc();
    getTotalTvlByTokenFunc();
    getAccountRefferalsTVLFunc();
    getGroupTvlFunc();
    getReferralTvlFunc();
    getTotalTvlFunc();
    getEigenlayerPointsFunc();
    getPufferPointsFunc();
    getRenzoPointsFunc();
    getAccountTvlFunc();
    getMagpiePointsFunc();
    getLayerbankPufferPointsFunc();
    getRoyaltyBoosterFunc();
    getRsethPointsFunc();
    getAllsparkTradePointsFunc();
    getBedrockPointsFunc();
  }, [address]);

  useEffect(() => {
    /**
     * return home page if not active
     */
    if (!isActiveUser) {
      navigatorTo("/");
    }
  }, [isActiveUser]);

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const [allsparkTradePoints, setAllsparkTradePoints] = useState(0);

  const getAllsparkTradePointsFunc = async () => {
    if (!address) return;
    const { data: res } = await axios.post(
      "https://allspark.finance/points/getUserTradePoints",
      {
        address,
      }
    );
    console.log("allsparkTradePoints", res);
    if ((res as any)?.data) {
      setAllsparkTradePoints(res.data?.tradePoints || 0);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);

      if (isMemeMysteryboxReward && !isNovaChadNftHide) {
        novaChadNftModal.onOpen();
      }
    }, 1000);
  }, [isNovaChadNftHide, isMemeMysteryboxReward]);

  const ecoDappsData = useMemo(() => {
    const rubicPoints = [
      {
        name: "Nova Points",
        value: formatNumberWithUnit(rubicNovaPoints),
      },
    ];
    const rubic: EcoDAppsProps = {
      name: "Rubic",
      handler: "@CryptoRubic",
      link: "https://rubic.exchange/",
      iconURL: "/img/icon-rubic.svg",
      type: "Cross-Chain",
      points: rubicPoints,
      earned: `${rubicPoints.length} ${
        rubicPoints.length > 1 ? "Types" : "Type"
      } of Point`,
      details: [
        {
          status: "Live",
          tagLabel: "Trading Rewards",
          tag: "1 point per trade",
          actionType: "Use Protocol",
          description: `For each transaction you interact with Rubic, you could receive 1 Nova Points.`,
        },
      ],
    };

    const lauyerbankPoints = [
      {
        name: "Nova Points",
        value: formatNumberWithUnit(layerbankNovaPoints),
      },
      {
        name: "LayerBank Points",
        value: "Coming soon",
      },
      {
        name: "Puffer Points",
        value: formatNumberWithUnit(layerbankPufferPoints),
      },
      // {
      //   name: "Eigenlayer Points",
      //   value: formatNumberWithUnit(layerbankEigenlayerPoints),
      // },
    ];
    const novaSwap: EcoDAppsProps = {
      isFeatured: true,
      name: "Novaswap",
      handler: "@NovaSwap_fi",
      link: "https://novaswap.fi/",
      iconURL: "/img/icon-novaswap.svg",
      booster: "Up to 20x",
      type: "DEX",
      points: [
        {
          name: "Nova Points",
          value: formatNumberWithUnit(novaSwapNovaPoints),
        },
      ],
      earned: `1 Type of Point`,
      boosterTooltips: (
        <div>
          <p>20x for ETH/wETH and merged wBTC, USDT, USDC</p>
          <p>10x for canonically bridged tokens eligible to earn points</p>
        </div>
      ),
      details: [
        {
          status: "Live",
          tagLabel: "Booster",
          tag: "Up to 20x",
          tagTooltips: (
            <div>
              <p>20x for ETH/wETH and merged wBTC, USDT, USDC</p>
              <p>10x for canonically bridged tokens eligible to earn points</p>
            </div>
          ),
          actionType: "Provide Liquidity",
          description: `You earn points based on the liquidity you've supplied to the pool over a specific period, with the points multiplied accordingly.`,
        },
      ],
    };

    const layerbank: EcoDAppsProps = {
      name: "LayerBank",
      handler: "@LayerBankFi",
      link: "https://zklink.layerbank.finance/",
      iconURL: "/img/icon-layerbank.svg",
      booster: "Up to 10x",
      type: "Lending",
      points: lauyerbankPoints,
      earned: `${lauyerbankPoints.length} ${
        lauyerbankPoints.length > 1 ? "Types" : "Type"
      } of Point`,
      boosterTooltips: (
        <div>
          <p>10x for ETH/wETH and merged wBTC, USDT, USDC</p>
          <p>
            4x for canonically bridged tokens (pufETH.eth, Manta.manta,
            Stone.manta, wBTC.eth)
          </p>
          <p>2x for externally bridged tokens (solvBTC.m, mBTC, BTCT)</p>
        </div>
      ),
      details: [
        {
          status: "Live",
          tagLabel: "Booster",
          tag: "Up to 10x",
          tagTooltips: (
            <div>
              <p>10x for ETH/wETH and merged wBTC, USDT, USDC</p>
              <p>
                4x for canonically bridged tokens (pufETH.eth, Manta.manta,
                Stone.manta, wBTC.eth)
              </p>
              <p>2x for externally bridged tokens (solvBTC.m, mBTC, BTCT)</p>
            </div>
          ),
          actionType: "Provide Liquidity",
          description: `You earn points based on the liquidity you've supplied to the pool over a specific period, with the points multiplied accordingly.`,
        },
      ],
    };

    const linkswapPoints = [
      {
        name: "Nova Points",
        value: formatNumberWithUnit(linkswapNovaPoints),
      },
    ];
    const linkswap: EcoDAppsProps = {
      name: "Linkswap",
      handler: "@LinkswapFinance",
      link: "https://linkswap.finance/earn",
      iconURL: "/img/icon-linkswap.svg",
      type: "DEX",
      points: linkswapPoints,
      earned: `${linkswapPoints.length} ${
        linkswapPoints.length > 1 ? "Types" : "Type"
      } of Point + Yield`,
      details: [
        {
          status: "Live",
          tagLabel: "Booster",
          tag: "1.5x Nova Points",
          actionType: "Provide Liquidity",
          description: `You earn points based on the liquidity you've supplied to the pool over a specific period, with the points multiplied accordingly.`,
        },
      ],
    };

    const aquaPoints = [
      {
        name: "Nova Points",
        value: formatNumberWithUnit(aquaNovaPoints),
      },
    ];

    const aqua: EcoDAppsProps = {
      name: "Native Lend",
      handler: "@native_fi",
      link: "https://native.org/lend?utm_campaign=zklink_nova&utm_source=custom&utm_medium=2xpoints?chainId=810180",
      iconURL: "/img/icon-native.svg",
      booster: "Up to 10x",
      type: "Lending",
      points: aquaPoints,
      earned: `${aquaPoints.length} ${
        aquaPoints.length > 1 ? "Types" : "Type"
      } of Point + Yield`,
      boosterTooltips: (
        <p>
          10x for ETH/wETH and merged wBTC, USDT, USDC <br />
          4x for canonically bridged tokens
        </p>
      ),
      details: [
        {
          status: "Live",
          tagLabel: "Booster",
          tag: "Up to 10x",
          tagTooltips: (
            <p>
              10x for ETH/wETH and merged wBTC, USDT, USDC <br />
              4x for canonically bridged tokens
            </p>
          ),
          actionType: "Provide Liquidity",
          description: `You earn points based on the liquidity you've supplied to the pool over a specific period, with the points multiplied accordingly.`,
        },
      ],
    };

    const izumiPoints = [
      {
        name: "Nova Points",
        value: formatNumberWithUnit(izumiNovaPoints),
      },
    ];

    const izumi: EcoDAppsProps = {
      name: "iZUMI",
      handler: "@izumi_Finance",
      link: "https://izumi.finance/trade/swap?chainId=810180",
      iconURL: "/img/icon-izumi.svg",
      booster: "Up to 10x",
      type: "DEX",
      points: izumiPoints,
      earned: `${izumiPoints.length} ${
        izumiPoints.length > 1 ? "Types" : "Type"
      } of Point + Yield`,
      boosterTooltips: (
        <div>
          <p>10x for ETH/wETH and merged wBTC, USDT, USDC</p>
          <p>3x for externally bridged tokens (solvBTC.m)</p>
          <p>
            Note: Boosts are provided only for effective liquidity. For AMM DEX,
            two-sided liquidity provision is required to qualify for the dApp
            booster.
          </p>
        </div>
      ),
      details: [
        {
          status: "Live",
          tag: "Up to 10x",
          tagLabel: "Booster",
          tagTooltips: (
            <div>
              <p>10x for ETH/wETH and merged wBTC, USDT, USDC</p>
              <p>3x for externally bridged tokens (solvBTC.m)</p>
              <p>
                Note: Boosts are provided only for effective liquidity. For AMM
                DEX, two-sided liquidity provision is required to qualify for
                the dApp booster.
              </p>
            </div>
          ),
          actionType: "Provide Liquidity",
          description: `You earn points based on the liquidity you've supplied to the pool over a specific period, with the points multiplied accordingly.`,
        },
      ],
    };

    const symbiosisPoints = [
      {
        name: "Nova Points",
        value: formatNumberWithUnit(symbiosisNovaPoints),
      },
    ];
    const symbiosis: EcoDAppsProps = {
      name: "Symbiosis",
      handler: "@symbiosis_fi",
      link: " https://app.symbiosis.finance/swap?chainIn=Ethereum&chainOut=ZkLink&tokenIn=ETH&tokenOut=ETH",
      iconURL: "/img/icon-symbiosis.svg",
      type: "Cross-Chain",
      points: symbiosisPoints,
      earned: `${symbiosisPoints.length} ${
        symbiosisPoints.length > 1 ? "Types" : "Type"
      } of Point`,
      details: [
        {
          status: "Live",
          tagLabel: "Current Reward Level",
          tag: `${symbiosisBridgeNovaPoints} ${
            symbiosisBridgeNovaPoints > 1 ? "Nova Points" : "Nova Point"
          }`,
          actionType: "Bridge",
          description: `Bridge more than 0.1 ETH/ 500USDT /500 USDC to Nova to earn Nova Points.`,
          descriptionTips: `You can earn Nova Points for each transaction of bridging to Nova over 0.1 ETH/ 500USDT /500 USDC (qualified transactions). Every day beginning at UTC 0:00, users who bridge to Nova early will receive more points. You'll accumulate Nova points as follows: 5 points for the initial 200 qualified transactions, 4 points for qualified transactions 201-400, 3 points for qualified transactions 401-600, 2 points for qualified transactions 601-800, and 1 point for any qualified transactions beyond that.`,
        },
      ],
    };

    const mesonPoints = [
      {
        name: "Nova Points",
        value: formatNumberWithUnit(mesonNovaPoints),
      },
    ];
    const meson: EcoDAppsProps = {
      name: "Meson",
      handler: "@mesonfi",
      link: "https://meson.fi/zklink",
      iconURL: "/img/icon-meson.svg",
      type: "Cross-Chain",
      points: mesonPoints,
      earned: `1 ${mesonPoints.length > 1 ? "Types" : "Type"} of Point`,
      details: [
        {
          status: "Live",
          tagLabel: "Current Reward Level",
          tag: `${mesonBridgeNovaPoints} ${
            mesonBridgeNovaPoints > 1 ? "Nova Points" : "Nova Point"
          }`,
          actionType: "Bridge",
          description: `Bridge more than 0.1 ETH/ 500USDT /500 USDC to Nova to earn Nova Points.`,
          descriptionTips: `You can earn Nova Points for each transaction of bridging to Nova over 0.1 ETH/ 500USDT /500 USDC (qualified transactions). Every day beginning at UTC 0:00, users who bridge to Nova early will receive more points. You'll accumulate Nova points as follows: 5 points for the initial 200 qualified transactions, 4 points for qualified transactions 201-400, 3 points for qualified transactions 401-600, 2 points for qualified transactions 601-800, and 1 point for any qualified transactions beyond that.`,
        },
      ],
    };

    const owltoPoints = [
      {
        name: "Nova Points",
        value: formatNumberWithUnit(owltoNovaPoints),
      },
    ];
    const owlto: EcoDAppsProps = {
      name: "Owlto",
      handler: "@Owlto_Finance",
      link: "https://owlto.finance/?to=zkLinkNova",
      iconURL: "/img/icon-owlto.svg",
      type: "Cross-Chain",
      points: owltoPoints,
      earned: `${owltoPoints.length} ${
        owltoPoints.length > 1 ? "Types" : "Type"
      } of Point`,
      details: [
        {
          status: "Live",
          tagLabel: "Current Reward Level",
          tag: `${owltoBridgeNovaPoints} ${
            owltoBridgeNovaPoints > 1 ? "Nova Points" : "Nova Point"
          }`,
          actionType: "Bridge",
          description: `Bridge more than 0.1 ETH/ 500USDT /500 USDC to Nova to earn Nova Points.`,
          descriptionTips: `You can earn Nova Points for each transaction of bridging to Nova over 0.1 ETH/ 500USDT /500 USDC (qualified transactions). Every day beginning at UTC 0:00, users who bridge to Nova early will receive more points. You'll accumulate Nova points as follows: 5 points for the initial 200 qualified transactions, 4 points for qualified transactions 201-400, 3 points for qualified transactions 401-600, 2 points for qualified transactions 601-800, and 1 point for any qualified transactions beyond that.`,
        },
      ],
    };

    const logxPoints = [
      {
        name: "Nova Points",
        value: formatNumberWithUnit(logxNovaPoints),
      },
    ];
    const logx: EcoDAppsProps = {
      name: "LogX",
      handler: "@LogX_trade",
      link: "https://app.logx.trade/liquidity",
      booster: "Up to 10x",
      iconURL: "/img/icon-logx.svg",
      type: "Perp DEX",
      points: logxPoints,
      earned: `${logxPoints.length} ${
        logxPoints.length > 1 ? "Types" : "Type"
      } of Point`,
      boosterTooltips: (
        <div>
          <p>10x points for LPs providing USDT</p>
          <p>1 points for a trader’s every 1000 USD trading volume</p>
        </div>
      ),
      details: [
        {
          status: "Live",
          tag: "Up to 10x",
          tagLabel: "Trading rewards",
          tagTooltips: (
            <div>
              <p>10x points for LPs providing USDT</p>
              <p>1 points for a trader’s every 1000 USD trading volume</p>
            </div>
          ),
          description: `You earn points based on the liquidity you've supplied to the pool over a specific period, with the points multiplied accordingly.`,
          actionType: "Provide Liquidity",
          actionLink: "https://app.logx.trade/liquidity",
        },
        {
          status: "Live",
          tagLabel: "Trading rewards",
          tag: "1 point / $200 volume",
          description: `For every $1000 in trading volume on LogX, you will receive 1 Nova Point.`,
          actionType: "Trade",
          actionLink: "https://app.logx.trade/",
        },
      ],
    };

    const freePoints = [
      {
        name: "Nova Points",
        value: formatNumberWithUnit(0), // TODO
      },
    ];
    const freeBridgeNovaPoints = 4; // TODO
    const free: EcoDAppsProps = {
      name: "Free",
      handler: "@FreeLayer2",
      link: "https://free.tech/zklink",
      iconURL: "/img/icon-free.svg",
      type: "Cross-Chain",
      points: freePoints,
      earned: `${freePoints.length} ${
        freePoints.length > 1 ? "Types" : "Type"
      } of Point`,
      details: [
        {
          status: "Live",
          tagLabel: "Current Reward Level",
          tag: `${freeBridgeNovaPoints} ${
            freeBridgeNovaPoints > 1 ? "Nova Points" : "Nova Point"
          }`,
          actionType: "Bridge",
          description: `Bridge more than 0.1 ETH/ 500USDT /500 USDC to Nova to earn Nova Points.`,
          descriptionTips:
            "You can earn Nova Points for each transaction of bridging to Nova over 0.1 ETH/ 500USDT /500 USDC (qualified transactions). Every day beginning at UTC+10:00, users who bridge to Nova early will receive more points. You'll accumulate Nova points as follows: 5 points for the initial 200 qualified transactions, 4 points for qualified transactions 201-400, 3 points for qualified transactions 401-600, 2 points for qualified transactions 601-800, and 1 point for any qualified transactions beyond that.",
        },
      ],
    };

    const orbiterPoints = [
      {
        name: "Nova Points",
        value: formatNumberWithUnit(orbiterNovaPoints),
      },
    ];
    const orbiter: EcoDAppsProps = {
      name: "Orbiter",
      handler: "@Orbiter_Finance",
      link: "https://www.orbiter.finance/?source=Ethereum&dest=zkLink%20Nova&token=ETH",
      iconURL: "/img/icon-orbiter.svg",
      type: "Cross-Chain",
      points: orbiterPoints,
      earned: `${orbiterPoints.length} ${
        orbiterPoints.length > 1 ? "Types" : "Type"
      } of Point`,

      details: [
        {
          status: "Live",
          tagLabel: "Current Reward Level",
          tag: `${orbiterBridgeNovaPoints} ${
            orbiterBridgeNovaPoints > 1 ? "Nova Points" : "Nova Point"
          }`,
          actionType: "Bridge",
          description: `Bridge more than 0.1 ETH/ 500USDT /500 USDC to Nova to earn Nova Points.`,
          descriptionTips:
            "You can earn Nova Points for each transaction of bridging to Nova over 0.1 ETH/ 500USDT /500 USDC (qualified transactions). Every day beginning at UTC+10:00, users who bridge to Nova early will receive more points. You'll accumulate Nova points as follows: 5 points for the initial 200 qualified transactions, 4 points for qualified transactions 201-400, 3 points for qualified transactions 401-600, 2 points for qualified transactions 601-800, and 1 point for any qualified transactions beyond that.",
        },
      ],
    };

    const interportPoints = [
      {
        name: "Nova Points",
        value: formatNumberWithUnit(interportNovaPoints),
      },
    ];
    const interport: EcoDAppsProps = {
      name: "Interport",
      handler: "@InterportFi",
      booster: "Up to 10x",
      link: "https://app.interport.fi/stablecoin-pools?network=zkLink+Nova",
      iconURL: "/img/icon-interport.svg",
      type: "Cross-Chain",
      points: interportPoints,
      earned: `${interportPoints.length} ${
        interportPoints.length > 1 ? "Types" : "Type"
      } of Point + Yield`,
      boosterTooltips: (
        <div>
          <p>10x for merged USDT and USDC</p>
        </div>
      ),
      details: [
        {
          status: "Live",
          tagLabel: "Booster",
          tag: "Up to 10x",
          tagTooltips: (
            <div>
              <p>10x for merged USDT and USDC</p>
            </div>
          ),
          actionType: "Provide Liquidity",
          description: `For each block that liquidity is in a pool you earn points multiplied by the liquidity you provided`,
        },
      ],
    };

    const eddyFinance: EcoDAppsProps = {
      name: "Eddy Finance",
      handler: "@eddy_protocol",
      link: "https://app.eddy.finance/swap",
      iconURL: "/img/icon-eddyfinance.svg",
      type: "DEX",
      points: [
        {
          name: "Nova Points",
          value: formatNumberWithUnit(eddyFinanceNovaPoints),
        },
      ],
      earned: `1 Type of Point`,
      details: [
        {
          status: "Live",
          tagLabel: "Booster",
          tag: "1 point / $200 volume",
          actionType: "Trade",
          description: `For every $1000 in trading volume on Eddy Finance (Nova Network), you will receive 1 Nova Point.`,
        },
      ],
    };

    const allsparkPoints = [
      {
        name: "Nova Points",
        value: formatNumberWithUnit(allsparkNovaPoints),
      },
      {
        name: "Allspark Trade Points",
        value: formatNumberWithUnit(allsparkTradePoints),
      },
    ];

    const allspark: EcoDAppsProps = {
      name: "Allspark",
      handler: "@AllsparkFinance",
      link: "https://www.allspark.finance/mantissa/",
      iconURL: "/img/icon-allspark.svg",
      type: "Prediction",
      points: allsparkPoints,
      earned: `${allsparkPoints.length} ${
        allsparkPoints.length > 1 ? "Types" : "Type"
      } of Point`,
      details: [
        {
          status: "Live",
          tagLabel: "Trading Rewards",
          tag: "1 point per trade",
          actionType: "Use Protocol",
          description: `For each transaction you interact with Allspark, you could receive 0.5 Nova Points.`,
        },
      ],
    };

    const zkdxPoints = [
      {
        name: "Nova Points",
        value: formatNumberWithUnit(zkdxNovaPoints),
      },
    ];

    const zkdx: EcoDAppsProps = {
      name: "zkDX",
      handler: "@zkDXio",
      link: "https://app.zkdx.io/tokenomics?chainid=810180",
      booster: "Up to 10x",
      iconURL: "/img/icon-zkdx.svg",
      type: "Perp DEX",
      points: zkdxPoints,
      earned: `${zkdxPoints.length} ${
        zkdxPoints.length > 1 ? "Types" : "Type"
      } of Point`,
      boosterTooltips: (
        <div>
          <p>10x for Merged ETH, USDC</p>
        </div>
      ),
      details: [
        {
          status: "Live",
          tagLabel: "Booster",
          tag: "Up to 10x",
          tagTooltips: (
            <div>
              <p>10x for Merged ETH, USDC</p>
            </div>
          ),
          description: `You earn points based on the liquidity you've supplied to the pool over a specific period, with the points multiplied accordingly.`,
          actionType: "Provide Liquidity",
          actionLink: "https://app.zkdx.io/tokenomics?chainid=810180",
        },
        {
          status: "Live",
          tagLabel: "Trading rewards",
          tag: "1 point / $200 volume",
          description: `For every $200 in trading volume on zkDX, you will receive 1 Nova Point.`,
          actionType: "Trade",
          actionLink: "https://app.zkdx.io/trade?chainid=810180",
        },
      ],
    };

    const wagmiPoints = [
      {
        name: "Nova Points",
        value: formatNumberWithUnit(wagmiNovaPoints),
      },
    ];

    const wagmi: EcoDAppsProps = {
      name: "Wagmi",
      handler: "@popsiclefinance",
      link: "https://app.wagmi.com/liquidity/pools",
      booster: "Up to 10x",
      iconURL: "/img/icon-wagmi.svg",
      type: "DEX",
      points: wagmiPoints,
      earned: `${wagmiPoints.length} ${
        wagmiPoints.length > 1 ? "Types" : "Type"
      } of Point`,
      boosterTooltips: (
        <div>
          <p>10x for Merged wBTC, wETH, USDT</p>
        </div>
      ),
      details: [
        {
          status: "Live",
          tagLabel: "Booster",
          tag: "Up to 10x",
          tagTooltips: (
            <div>
              <p>10x for Merged wBTC, wETH, USDT</p>
            </div>
          ),
          description: `You earn points based on the liquidity you've supplied to the pool over a specific period, with the points multiplied accordingly.`,
          actionType: "Provide Liquidity",
          actionLink: "https://app.wagmi.com/liquidity/pools",
        },
        {
          status: "Live",
          tagLabel: "Trading rewards",
          tag: "1 point / $200 volume",
          description: `For every $200 in trading volume on Wagmi, you will receive 1 Nova Point.`,
          actionType: "Trade",
          actionLink: "https://app.wagmi.com/trade/swap",
        },
      ],
    };

    const arr: EcoDAppsProps[] = [
      novaSwap,
      layerbank,
      logx,
      aqua,
      wagmi,
      izumi,
      zkdx,
      // owlto,
      eddyFinance,
      allspark,
      rubic,
      interport,
      orbiter,
      symbiosis,
      meson,
      // free,
      // linkswap,
    ];

    return arr;
  }, [
    layerbankNovaPoints,
    layerbankPufferPoints,
    novaSwapNovaPoints,
    // linkswapNovaPoints,
    aquaNovaPoints,
    izumiNovaPoints,
    symbiosisNovaPoints,
    symbiosisBridgeNovaPoints,
    mesonNovaPoints,
    mesonBridgeNovaPoints,
    owltoNovaPoints,
    owltoBridgeNovaPoints,
    logxNovaPoints,
    orbiterNovaPoints,
    orbiterBridgeNovaPoints,
    interportNovaPoints,
    eddyFinanceNovaPoints,
    allsparkNovaPoints,
    allsparkTradePoints,
    rubicNovaPoints,
    zkdxNovaPoints,
    wagmiNovaPoints,
  ]);
  const [remainMintCount, setRemainMintCount] = useState(0);
  const [remainMintCountV2, setRemainMintCountV2] = useState(0);
  useEffect(() => {
    if (address) {
      getRemainMysteryboxDrawCount(address).then((res) => {
        const remainNumber = res.result;
        setRemainMintCount(Number(remainNumber) || 0);
      });

      getRemainMysteryboxDrawCountV2(address).then((res) => {
        const remainNumberV2 = res.result;
        setRemainMintCountV2(Number(remainNumberV2) || 0);
      });
    }
  }, [address]);

  const onCloseNovaChadNftModal = async () => {
    novaChadNftModal.onClose();
    setTabsActive(TabType.NFTs);
    setNftPhase(2);
    await sleep(200);
    scrollToAnchor("mysterybox");
    dispatch(setIsNovaChadNftHide(true));
  };

  const scrollToAnchor = (anchorName: string) => {
    if (!!anchorName) {
      let anchorElement = document.getElementById(anchorName);
      if (anchorElement) {
        const scrollTop = anchorElement.offsetTop;
        window.scrollTo(0, scrollTop);
        document.documentElement.scrollTop = scrollTop;
        document.body.scrollTop = scrollTop;
      }
    }
  };

  return (
    <BgBox>
      <BgCoverImg />
      {isLoading && <Loading />}

      {/* <div className="md:w-full md:text-center md:py-[0.5rem] py-[1rem] text-[1rem] bg-[#226959] z-10 md:px-[6.125rem] md:mx-0 px-[1rem] mx-3">
        <span className="text-[#03d498]">
          All other projects points are undergoing synchronization at the
          moment. Your point balances may not be visible until this process is
          complete.
        </span>
      </div> */}

      <Banner />

      {/* <div className="md:pl-[4.75rem] md:pr-[6rem] px-[1rem]">
        <Banner />
      </div> */}

      <div className="relative md:flex gap-[1.5rem] md:px-[4.75rem] px-[1rem] z-[1] pt-[1rem]">
        {/* Left: nova points ... data */}
        <div className="md:w-[27.125rem] z-10">
          <NovaDropLink />
          <NovaCharacter />
          <MysteryBoxIII />
          <NovaPoints
            groupTvl={groupTvl}
            referPoints={referPoints}
            novaPoints={novaPoints}
            pufferEigenlayerPoints={pufferEigenlayerPoints}
            pufferPoints={pufferPoints}
            renzoPoints={renzoPoints}
            renzoEigenLayerPoints={renzoEigenLayerPoints}
            magpiePointsData={magpiePointsData}
            dAppNovaPoints={dAppNovaPoints}
            royaltyBooster={royaltyBooster}
            kolPoints={kolPoints}
            otherNovaPoints={otherNovaPoints}
            totalNovaPoints={totalNovaPoints}
            kelpMiles={kelpMiles}
            kelpEigenlayerPoints={kelpEigenlayerPoints}
            bedrockPoints={bedrockPoints}
            bedrockEigenlayerPoints={bedrockEigenlayerPoints}
          />
          <StakingValue
            stakingUsdValue={stakingUsdValue}
            stakingEthValue={stakingEthValue}
          />
        </div>

        {/* Right: tvl ... data */}
        <div className="md:w-full maxWid">
          {!invite?.twitterHandler && <TwitterVerify />}

          <TvlSummary
            totalTvl={totalTvl}
            groupTvl={groupTvl}
            referralTvl={referralTvl}
          />

          {/* Group Milestone */}
          {/* <div className="mt-[2rem]">
            <GroupMilestone groupTvl={groupTvl} />
          </div> */}

          <div className="mt-[2rem]">
            {/* Tabs btn: Assets | Trademark NFTs | Referral  */}
            <TabsBox className="flex items-center gap-[1.5rem] overflow-x-auto">
              {["Eco dApps", "Assets", "Nova NFTs", "Referral"].map(
                (item, index) => (
                  <span
                    key={index}
                    className={`tab-item whitespace-nowrap ${
                      tabsActive === index ? "active" : ""
                    } ${
                      (remainMintCount > 0 || remainMintCountV2 > 0) &&
                      index === 2
                        ? "notify"
                        : ""
                    }`}
                    data-tooltip-id={
                      (remainMintCount > 0 || remainMintCountV2 > 0) &&
                      index === 2
                        ? "remain-notify"
                        : undefined
                    }
                    onClick={() => setTabsActive(index)}
                  >
                    {item}
                  </span>
                )
              )}
            </TabsBox>

            <Tooltip
              id="remain-notify"
              style={{
                fontSize: "14px",
                background: "#666",
                borderRadius: "0.5rem",
                width: "18rem",
              }}
              content="You've received Phase II Mystery Boxes! Open it now!"
            />

            {/* Tabs view: Assets */}
            {tabsActive === TabType.Eco && <EcoDApps data={ecoDappsData} />}

            {/* Tabs view: Assets */}
            {tabsActive === TabType.Assets && (
              <AssetsTable
                ethUsdPrice={ethUsdPrice}
                supportTokens={supportTokens}
                totalTvlList={totalTvlList}
                accountTvlData={accountTvlData}
              />
            )}
            {/* Tabs view: Trademark NFTs */}
            {tabsActive === TabType.NFTs && (
              <>
                {nftPhase === 1 && (
                  <NFTCard switchPhase={(p) => setNftPhase(p)} />
                )}
                {nftPhase === 2 && (
                  <NFTCardV2 switchPhase={(p) => setNftPhase(p)} />
                )}
              </>
            )}

            {/* Tabs view: Referral */}
            {tabsActive === TabType.Referral && (
              <CardBox className="mt-[2rem] min-h-[30rem]">
                <ReferralList
                  data={referrersTvlList}
                  ethUsdPrice={ethUsdPrice}
                />
              </CardBox>
            )}
          </div>
        </div>
      </div>

      <div className="relative mt-[3rem] md:pl-[4.75rem] md:pr-[6rem] px-[1rem] z-[1]">
        <DisclaimerFooter />
      </div>

      <Modal
        classNames={{ closeButton: "text-[1.5rem]" }}
        size="2xl"
        hideCloseButton
        isOpen={novaChadNftModal.isOpen}
        onOpenChange={novaChadNftModal.onOpenChange}
      >
        <ModalContent className="mb-[3.75rem]">
          <ModalBody className="pb-8">
            <h4 className="py-[1.5rem] text-center text-[1.5rem]">
              Congratulations, you've receive a mystery box!
            </h4>
            <div>
              <div>
                <img
                  src="/img/img-mystery-box-v2.png"
                  className="mx-auto w-[11.25rem] h-[11.25rem] block"
                />
              </div>
              <p className="mt-[0.75rem] w-full text-center text-[0.75rem] text-[#fff] font-[400]">
                Got to Nova NFTs and scroll down to mint!
              </p>
            </div>

            <div>
              <Button
                className="gradient-btn mt-4 w-full py-[1rem]"
                onClick={onCloseNovaChadNftModal}
              >
                <span className="text-[1rem] font-[700]">Confirm</span>
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </BgBox>
  );
}
