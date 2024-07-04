import {
  NovaCategoryPoints,
  NovaCategoryUserPoints,
  TvlCategory,
  TvlCategoryMilestone,
} from "@/api";
import useNovaPoints from "@/hooks/useNovaPoints";
import { formatNumberWithUnit, formatToThounds } from "@/utils";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import MilestoneProgress from "../MilestoneProgress";

const MilestoneBox = styled.div`
  color: rgba(251, 251, 251, 0.6);
  font-family: Satoshi;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

const BlurBox = styled.div`
  color: rgba(251, 251, 251, 0.6);
  text-align: center;
  font-family: Satoshi;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 12px;
  border-radius: 24px;
  border: 1px solid rgba(51, 49, 49, 0.6);
  background: #10131c;
  filter: blur(0.125px);
  .bold {
    font-weight: 900;
    background: linear-gradient(180deg, #fff 0%, #bababa 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const Container = styled.div`
  .holding-title {
    color: #fff;
    font-family: Satoshi;
    font-size: 14px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
    text-transform: capitalize;
  }
  .holding-value {
    color: #fff;
    font-family: Satoshi;
    font-size: 32px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    text-transform: capitalize;
    .max {
      color: #a9a9a9;
      font-family: Satoshi;
      font-size: 15.436px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      text-transform: capitalize;
    }
  }
  .holding-desc {
    color: rgba(251, 251, 251, 0.6);
    font-family: Satoshi;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    text-transform: capitalize;
  }
`;

const IconBox = styled.div`
  position: relative;
  padding: 4px;
  border: 1px solid transparent;
  border-radius: 50%;
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;
  background-image: linear-gradient(to right, #282828, #000000),
    linear-gradient(#fb2450 1%, #fbc82e 5%, #6eee3f, #5889f3, #5095f1, #b10af4);
`;

const AllocatedBox = styled.div`
  padding: 16px 28px;
  min-width: 419px;
  border-radius: 16px;
  filter: blur(0.125px);
  border: 2px solid transparent;
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;
  background-image: linear-gradient(to right, #282828, #000000),
    linear-gradient(
      175deg,
      #fb2450 1%,
      #fbc82e 5%,
      #6eee3f,
      #5889f3,
      #5095f1,
      #b10af4
    );

  .label {
    color: var(--Neutral-2, rgba(251, 251, 251, 0.6));
    text-align: center;
    font-family: Satoshi;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }

  .value {
    text-align: right;
    font-family: Satoshi;
    font-size: 24px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
    background: linear-gradient(180deg, #fff 0%, #bababa 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .line {
    margin: 12px auto;
    width: 100%;
    height: 1px;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(251, 251, 251, 0.6) 51.5%,
      rgba(255, 255, 255, 0) 100%
    );
  }
`;

const List = styled.div`
  width: 100%;

  .list-header-item {
    padding: 24px 0;
    color: rgba(251, 251, 251, 0.6);
    font-family: Satoshi;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }

  .row {
    border-radius: 24px;
    border: 2px solid #635f5f;
    background: #151923;
  }

  .list-content-item {
    padding: 16px 28px;
    color: var(--Neutral-1, #fff);
    font-family: Satoshi;
    font-size: 14px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;

    .symbol {
      color: #fff;
      font-family: Satoshi;
      font-size: 16px;
      font-style: normal;
      font-weight: 900;
      line-height: normal;
      text-transform: capitalize;
    }
    .name {
      color: #03d498;
      font-family: Satoshi;
      font-size: 12px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }

    .text-gray {
      color: rgba(255, 255, 255, 0.6);
      font-family: Satoshi;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
    .action {
      color: rgba(251, 251, 251, 0.6);
      font-family: Satoshi;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      text-align: center;
    }
  }

  .col-line {
    width: 1px;
    height: 44px;
    opacity: 0.3;
    opacity: 0.3;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(251, 251, 251, 0.6) 51.5%,
      rgba(255, 255, 255, 0) 100%
    );
  }

  .row-line {
    width: 100%;
    height: 1px;
    opacity: 0.3;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(251, 251, 251, 0.6) 51.5%,
      rgba(255, 255, 255, 0) 100%
    );
  }

  .list-header-item,
  .list-content-item {
    width: 20%;

    &:last-child {
      width: 268px;
    }
  }
`;

const GradientText = styled.span`
  font-family: Satoshi;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  background: linear-gradient(
    90deg,
    #4ba790 0%,
    rgba(251, 251, 251, 0.6) 50.31%,
    #9747ff 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const GradientBox = styled.div`
  padding: 4px 28px;
  border: 2px solid transparent;
  border-radius: 16px;
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;
  background-image: linear-gradient(to right, #282828, #000000),
    linear-gradient(#fb2450 1%, #fbc82e 5%, #6eee3f, #5889f3, #5095f1, #b10af4);
`;

const DetailBox = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.08px;
  font-family: "Chakra Petch";
  /* background: #011a24; */
  .detail-label {
    margin-bottom: 12px;
    color: var(--Neutral-1, #fff);
    font-family: Satoshi;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 16px; /* 100% */
    letter-spacing: -0.08px;
  }
  .detail-value {
    color: var(--Neutral-2, rgba(251, 251, 251, 0.6));
    font-family: Satoshi;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: -0.07px;
  }

  .detail-row {
    &.rounded-bottom {
      border-radius: 0 0 16px 16px;
    }
    background: #0d0f14;
    .detail-item {
      padding: 24px;
    }
  }
`;

interface EcoDAppItem {
  category?: string;
  iconURL: string;
  name: string;
  link: string;
  handler: string;
  type: string;
  rewards: string;
  rewardsIcon?: {
    name: string;
    iconURL: string;
  }[];
  protocolAllocated: number;
  details: {
    booster: string | ReactNode;
    description: string;
    action: string;
    actionLink?: string;
  }[];
  idFeatured?: boolean;
}

const milestoneMap: {
  [key: string]: {
    zkl: number;
    tvl: number;
  }[];
} = {
  spotdex: [
    {
      tvl: 0,
      zkl: 100000,
    },
    {
      tvl: 5000000,
      zkl: 500000,
    },
    {
      tvl: 25000000,
      zkl: 1000000,
    },
    {
      tvl: 50000000,
      zkl: 1500000,
    },
  ],
  perpdex: [
    {
      tvl: 0,
      zkl: 100000,
    },
    {
      tvl: 100000000,
      zkl: 500000,
    },
    {
      tvl: 500000000,
      zkl: 1000000,
    },
    {
      tvl: 2000000000,
      zkl: 2000000,
    },
  ],
  lending: [
    {
      tvl: 0,
      zkl: 100000,
    },
    {
      tvl: 10000000,
      zkl: 100000,
    },
    {
      tvl: 50000000,
      zkl: 350000,
    },
    {
      tvl: 200000000,
      zkl: 700000,
    },
  ],
};

const milestoneNoProgressMap: {
  [key: string]: {
    zkl: number;
    max: number;
  };
} = {
  gamefi: {
    zkl: 10000,
    max: 1000000,
  },
  other: {
    zkl: 50000,
    max: 500000,
  },
  nativeboost: {
    zkl: 50000,
    max: 500000,
  },
};

const EcoDApp = (props: {
  data: EcoDAppItem;
  handleLink: (link: string) => void;
}) => {
  const { data, handleLink } = props;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="row mb-[24px] overflow-hidden">
      <div className="flex items-center cursor-pointer">
        <div className="list-content-item flex items-center gap-[10px]">
          <img
            src={data.iconURL}
            alt=""
            className="w-[55px] h-[56px] rounded-full block"
          />
          <div>
            <div
              className="symbol flex items-center gap-[4px]"
              onClick={() => handleLink(data.link)}
            >
              <span>{data.name}</span>
              <img src="/img/icon-ecolink.svg" alt="" width={16} height={16} />
            </div>
            <div className="name mt-[5px]">{data.handler}</div>
          </div>
        </div>
        <div className="col-line"></div>
        <div className="list-content-item text-center flex items-center justify-center">
          <Tooltip
            classNames={{
              content:
                "py-[20px] px-[16px] text-[14px] text-[#FBFBFB99] bg-[#000811]",
            }}
            content={data.details[0].booster}
          >
            <GradientBox>{data.rewards}</GradientBox>
          </Tooltip>
        </div>
        <div className="col-line"></div>

        <div className="list-content-item text-center flex items-center justify-center gap-[4px]">
          {data?.rewardsIcon?.map((item, index) => (
            <Tooltip content={item.name} key={index}>
              <img
                src={item.iconURL}
                className="min-w-[32px] min-h-[32px] rounded-full"
              />
            </Tooltip>
          ))}
        </div>
        <div className="col-line"></div>

        <div className="list-content-item text-center">
          {formatNumberWithUnit(data.protocolAllocated)}
        </div>
        <div className="col-line"></div>

        <div className="list-content-item  flex justify-end items-center gap-[10px]">
          <span className="action">Action:</span>
          <div
            className="flex items-center gap-[4px] cursor-pointer select-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <GradientText className="particpate">Participate</GradientText>
            <img src="/img/icon-ecolink2.svg" alt="" width={16} height={16} />
          </div>
        </div>
      </div>
      {/* <div className="row-line"></div> */}
      {isOpen && (
        <DetailBox className="w-full mt-[4px] px-[7px]">
          {data.details.map((detail, index) => (
            <div
              className={`detail-row mb-[8px] flex justify-between ${
                index === data.details.length - 1 ? "rounded-bottom" : ""
              }`}
              key={index}
            >
              <div className="detail-item">
                <div className="detail-label">Booster</div>
                <div className="detail-value">{detail.booster}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Description</div>
                <div className="detail-value">{detail.description}</div>
              </div>
              <div className="detail-item text-right">
                <div className="detail-label">Action</div>
                <div className="detail-value flex justify-end items-center gap-[4px]">
                  <div
                    className="text-right whitespace-nowrap text-[#0BC48F] cursor-pointer"
                    onClick={() => handleLink(detail.actionLink || data.link)}
                  >
                    <GradientText>{detail.action}</GradientText>
                  </div>
                  <img
                    src="/img/open-in-new-s2.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                </div>
              </div>
            </div>
          ))}
        </DetailBox>
      )}
    </div>
  );
};

export default function EcoDApps({
  tabActive,
  novaCategoryUserPoints,
  tvlCategoryMilestone,
  holdingPoints,
  novaCategoryTotalPoints,
}: {
  tabActive?: {
    category: string;
    name: string;
    iconURL: string;
  };
  novaCategoryUserPoints: NovaCategoryUserPoints[];
  tvlCategoryMilestone: TvlCategoryMilestone[];
  holdingPoints: number;
  novaCategoryTotalPoints: number;
}) {
  const geNovaCategoryUserPointsByProject = (project: string) => {
    const obj = novaCategoryUserPoints.find((item) => item.project === project);
    return obj;
  };

  const {
    orbiterBridgeNovaPoints,
    symbiosisBridgeNovaPoints,
    mesonBridgeNovaPoints,
  } = useNovaPoints();

  const ecoDAppsList = useMemo(() => {
    const novaswap = geNovaCategoryUserPointsByProject("novaswap");
    const izumi = geNovaCategoryUserPointsByProject("izumi");
    const shoebill = geNovaCategoryUserPointsByProject("shoebill");
    const wagmi = geNovaCategoryUserPointsByProject("wagmi");
    const eddy = geNovaCategoryUserPointsByProject("eddy");
    const logx = geNovaCategoryUserPointsByProject("logx");
    const zkdx = geNovaCategoryUserPointsByProject("zkdx");
    const layerbank = geNovaCategoryUserPointsByProject("layerbank");
    const aqua = geNovaCategoryUserPointsByProject("aqua");
    const allspark = geNovaCategoryUserPointsByProject("allspark");
    const rubic = geNovaCategoryUserPointsByProject("rubic");
    const interport = geNovaCategoryUserPointsByProject("interport");
    const orbiter = geNovaCategoryUserPointsByProject("orbiter");
    const symbiosis = geNovaCategoryUserPointsByProject("symbiosis");
    const meson = geNovaCategoryUserPointsByProject("meson");

    const arr: EcoDAppItem[] = [
      {
        category: "nativeboost",
        iconURL: "/img/icon-novaswap.svg",
        name: "Novaswap",
        link: "https://novaswap.fi/",
        handler: "@NovaSwap_fi",
        type: "DEX",
        idFeatured: true,
        rewards: "Up to 20x",
        rewardsIcon: [
          { name: "Nova Points", iconURL: "/img/icon-rewards-nova.svg" },
        ],
        protocolAllocated:
          (novaswap?.refPoints || 0) + (novaswap?.holdingPoints || 0),
        details: [
          {
            booster: (
              <div>
                <p className="whitespace-nowrap">
                  <span className="font-[700]">20x</span> for ETH, WETH, Merged
                  WBTC, USDT, USDC
                </p>
                <p className="whitespace-nowrap">
                  <span className="font-[700]">10x</span> for canonically
                  bridged tokens eligible to earn points
                </p>
              </div>
            ),
            description:
              "You earn points based on the liquidity you've supplied to the pool over a specific period, with the points multiplied accordingly.",
            action: "Provide Liquidity",
          },
        ],
      },
      {
        category: "spotdex",
        iconURL: "/img/icon-novaswap.svg",
        name: "Novaswap",
        link: "https://novaswap.fi/",
        handler: "@NovaSwap_fi",
        type: "DEX",
        idFeatured: true,
        rewards: "Up to 20x",
        rewardsIcon: [
          { name: "Nova Points", iconURL: "/img/icon-rewards-nova.svg" },
        ],
        protocolAllocated:
          (novaswap?.refPoints || 0) + (novaswap?.holdingPoints || 0),
        details: [
          {
            booster: (
              <div>
                <p className="whitespace-nowrap">
                  <span className="font-[700]">20x</span> for ETH, WETH, Merged
                  WBTC, USDT, USDC
                </p>
                <p className="whitespace-nowrap">
                  <span className="font-[700]">10x</span> for canonically
                  bridged tokens eligible to earn points
                </p>
              </div>
            ),
            description:
              "You earn points based on the liquidity you've supplied to the pool over a specific period, with the points multiplied accordingly.",
            action: "Provide Liquidity",
          },
        ],
      },
      {
        category: layerbank?.category || "lending",
        iconURL: "/img/icon-layerbank.svg",
        name: "LayerBank",
        link: "https://zklink.layerbank.finance/",
        handler: "@LayerBankFi",
        type: "Lending",
        rewards: "Up to 10x",
        rewardsIcon: [
          { name: "Nova Points", iconURL: "/img/icon-rewards-nova.svg" },
          {
            name: "EigenLayer Points",
            iconURL: "/img/icon-rewards-eigenlayer.svg",
          },
          { name: "Puffer Points", iconURL: "/img/icon-rewards-puffer.svg" },
        ],

        protocolAllocated:
          (layerbank?.refPoints || 0) + (layerbank?.holdingPoints || 0),

        details: [
          {
            booster: (
              <div>
                <p>10x for ETH/wETH and merged wBTC, USDT, USDC</p>
                <p>
                  4x for canonically bridged tokens (pufETH.eth, Manta.manta,
                  Stone.manta, wBTC.eth)
                </p>
                <p>2x for externally bridged tokens (solvBTC.m, mBTC, BTCT)</p>
              </div>
            ),
            description: `You earn points based on the liquidity you've supplied to the pool over a specific period, with the points multiplied accordingly.`,
            action: "Provide Liquidity",
          },
        ],
      },
      {
        category: logx?.category || "perpdex",
        iconURL: "/img/icon-logx.svg",
        name: "LogX",
        link: "https://app.logx.trade/liquidity",
        handler: "@LogX_trade",
        type: "Perp DEX",
        rewards: "Up to 10x / Trading",
        rewardsIcon: [
          { name: "Nova Points", iconURL: "/img/icon-rewards-nova.svg" },
        ],
        protocolAllocated: (logx?.refPoints || 0) + (logx?.holdingPoints || 0),
        details: [
          {
            booster: (
              <div>
                <p>10x points for LPs providing USDT</p>
                <p>1 points for a trader’s every 1000 USD trading volume</p>
              </div>
            ),
            description: `You earn points based on the liquidity you've supplied to the pool over a specific period, with the points multiplied accordingly.`,
            action: "Provide Liquidity",
          },
          {
            booster: (
              <div>
                <p>1 point / $1000 volume</p>
              </div>
            ),
            description: `For every $1000 in trading volume on LogX, you will receive 1 Nova Point.`,
            action: "Provide Liquidity",
            actionLink: "https://app.logx.trade/",
          },
        ],
      },

      {
        category: aqua?.category,
        iconURL: "/img/icon-native.svg",
        name: "Native Lend" || "lending",
        link: "https://native.org/lend?utm_campaign=zklink_nova&utm_source=custom&utm_medium=2xpoints?chainId=810180",
        handler: "@native_fi",
        type: "Lending",
        rewardsIcon: [
          { name: "Nova Points", iconURL: "/img/icon-rewards-nova.svg" },
        ],
        rewards: "Up to 10x",
        protocolAllocated: (aqua?.refPoints || 0) + (aqua?.holdingPoints || 0),
        details: [
          {
            booster: (
              <div>
                <p>
                  10x for ETH/wETH and merged wBTC, USDT, USDC <br />
                  4x for canonically bridged tokens
                </p>
              </div>
            ),
            description: `You earn points based on the liquidity you've supplied to the pool over a specific period, with the points multiplied accordingly.`,
            action: "Provide Liquidity",
          },
        ],
      },

      {
        category: shoebill?.category || "lending",
        iconURL: "/img/icon-shoebill.svg",
        name: "Shoebill",
        link: "https://zklink-eth.shoebill.finance/#/",
        handler: "@ShoebillFinance",
        type: "Lending",
        rewardsIcon: [
          { name: "Nova Points", iconURL: "/img/icon-rewards-nova.svg" },
        ],
        rewards: "Up to 10x",
        protocolAllocated:
          (shoebill?.refPoints || 0) + (shoebill?.holdingPoints || 0),
        details: [
          {
            booster: (
              <div>
                <p>10x for ETH</p>
                <p>10x for other supported points</p>
              </div>
            ),
            description: `You earn points based on the liquidity you've supplied to the pool over a specific period, with the points multiplied accordingly.`,
            action: "Provide Liquidity",
          },
        ],
      },

      {
        category: wagmi?.category || "spotdex",
        iconURL: "/img/icon-wagmi.svg",
        name: "Wagmi",
        link: "https://app.wagmi.com/liquidity/pools",
        handler: "@popsiclefinance",
        type: "DEX",
        rewardsIcon: [
          { name: "Nova Points", iconURL: "/img/icon-rewards-nova.svg" },
        ],
        rewards: "Up to 10x / Trading",
        protocolAllocated:
          (wagmi?.refPoints || 0) + (wagmi?.holdingPoints || 0),
        details: [
          {
            booster: (
              <div>
                <p>10x for Merged wBTC, wETH, USDT</p>
              </div>
            ),
            description: `You earn points based on the liquidity you've supplied to the pool over a specific period, with the points multiplied accordingly.`,
            action: "Provide Liquidity",
          },
          {
            booster: (
              <div>
                <p>1 point / $200 volume</p>
              </div>
            ),
            description: `For every $200 in trading volume on Wagmi, you will receive 1 Nova Point.`,
            action: "Trade",
            actionLink: "https://app.wagmi.com/trade/swap",
          },
        ],
      },

      {
        category: izumi?.category || "spotdex",
        iconURL: "/img/icon-izumi.svg",
        name: "iZUMI",
        link: "https://izumi.finance/trade/swap?chainId=810180",
        handler: "@izumi_Finance",
        type: "DEX",
        rewardsIcon: [
          { name: "Nova Points", iconURL: "/img/icon-rewards-nova.svg" },
        ],
        rewards: "Up to 10x",
        protocolAllocated:
          (izumi?.refPoints || 0) + (izumi?.holdingPoints || 0),
        details: [
          {
            booster: (
              <div>
                <p>10x for ETH/wETH and merged wBTC, USDT, USDC</p>
                <p>3x for externally bridged tokens (solvBTC.m)</p>
                <p>
                  Note: Boosts are provided only for effective liquidity. For
                  AMM DEX, two-sided liquidity provision is required to qualify
                  for the dApp booster.
                </p>
              </div>
            ),
            description: `You earn points based on the liquidity you've supplied to the pool over a specific period, with the points multiplied accordingly.`,
            action: "Provide Liquidity",
          },
        ],
      },

      {
        category: zkdx?.category,
        iconURL: "/img/icon-zkdx.svg" || "perpdex",
        name: "zkDX",
        link: "https://app.zkdx.io/stakingliquidity",
        handler: "@zkDXio",
        type: "Perp DEX",
        rewardsIcon: [
          { name: "Nova Points", iconURL: "/img/icon-rewards-nova.svg" },
        ],
        rewards: "Up to 10x / Trading",
        protocolAllocated: (zkdx?.refPoints || 0) + (zkdx?.holdingPoints || 0),
        details: [
          {
            booster: (
              <div>
                <p>10x for Merged ETH, USDC</p>
              </div>
            ),
            description: `You earn points based on the liquidity you've supplied to the pool over a specific period, with the points multiplied accordingly.`,
            action: "Provide Liquidity",
          },
          {
            booster: (
              <div>
                <p>1 point / $200 volume</p>
              </div>
            ),
            description: `For every $200 in trading volume on zkDX, you will receive 1 Nova Point.`,
            action: "Trade",
            actionLink: "https://app.zkdx.io/trade",
          },
        ],
      },

      {
        category: eddy?.category || "spotdex",
        iconURL: "/img/icon-eddyfinance.svg",
        name: "Eddy Finance",
        link: "https://app.eddy.finance/swap",
        handler: "@eddy_protocol",
        type: "DEX",
        rewardsIcon: [
          { name: "Nova Points", iconURL: "/img/icon-rewards-nova.svg" },
        ],
        rewards: "Trading",
        protocolAllocated: (eddy?.refPoints || 0) + (eddy?.holdingPoints || 0),
        details: [
          {
            booster: (
              <div>
                <p>1 point / $200 volume</p>
              </div>
            ),
            description: `For every $200 in trading volume on Eddy Finance (Nova Network), you will receive 1 Nova Point.`,
            action: "Trade",
          },
        ],
      },

      {
        category: allspark?.category || "gamefi",
        iconURL: "/img/icon-allspark.svg",
        name: "Allspark",
        link: "https://www.allspark.finance/mantissa/",
        handler: "@AllsparkFinance",
        type: "DEX",
        rewardsIcon: [
          { name: "Nova Points", iconURL: "/img/icon-rewards-nova.svg" },
          {
            name: "AllSpark Points",
            iconURL: "/img/icon-rewards-allspark.svg",
          },
        ],
        rewards: "Interaction",
        protocolAllocated:
          (allspark?.refPoints || 0) + (allspark?.holdingPoints || 0),
        details: [
          {
            booster: (
              <div>
                <p>0.5 point per trade</p>
              </div>
            ),
            description: `For each transaction you interact with Allspark, you could receive 0.5 Nova Points.`,
            action: "Use Protocol",
          },
        ],
      },

      {
        category: rubic?.category || "other",
        iconURL: "/img/icon-rubic.svg",
        name: "Rubic",
        link: "https://rubic.exchange/",
        handler: "@CryptoRubic",
        type: "",
        rewardsIcon: [
          { name: "Nova Points", iconURL: "/img/icon-rewards-nova.svg" },
        ],
        rewards: "Bridge",
        protocolAllocated:
          (rubic?.refPoints || 0) + (rubic?.holdingPoints || 0),
        details: [
          {
            booster: (
              <div>
                <p>1 point per trade</p>
              </div>
            ),
            description: `For each transaction you interact with Rubic, you could receive 1 Nova Points.`,
            action: "Use Protocol",
          },
        ],
      },

      {
        category: interport?.category || "other",
        iconURL: "/img/icon-interport.svg",
        name: "Interport",
        link: "https://app.interport.fi/stablecoin-pools?network=zkLink+Nova",
        handler: "@InterportFi",
        type: "",
        rewardsIcon: [
          { name: "Nova Points", iconURL: "/img/icon-rewards-nova.svg" },
        ],
        rewards: "Up to 10x",
        protocolAllocated:
          (interport?.refPoints || 0) + (interport?.holdingPoints || 0),
        details: [
          {
            booster: (
              <div>
                <p>10x for merged USDT and USDC</p>
              </div>
            ),
            description: `For each block that liquidity is in a pool you earn points multiplied by the liquidity you provided`,
            action: "Use Protocol",
          },
        ],
      },

      {
        category: orbiter?.category || "other",
        iconURL: "/img/icon-orbiter.svg",
        name: "Orbiter",
        link: "https://www.orbiter.finance/?source=Ethereum&dest=zkLink%20Nova&token=ETH",
        handler: "@InterportFi",
        type: "",
        rewardsIcon: [
          { name: "Nova Points", iconURL: "/img/icon-rewards-nova.svg" },
        ],
        rewards: "Bridge",
        protocolAllocated:
          (orbiter?.refPoints || 0) + (orbiter?.holdingPoints || 0),
        details: [
          {
            booster: `${orbiterBridgeNovaPoints} Nova Points`,
            description: `Bridge more than 0.1 ETH/ 500USDT /500 USDC to Nova to earn Nova Points.`,
            action: "Bridge",
          },
        ],
      },

      {
        category: symbiosis?.category || "other",
        iconURL: "/img/icon-symbiosis.svg",
        name: "Symbiosis",
        link: "https://app.symbiosis.finance/swap?chainIn=Ethereum&chainOut=ZkLink&tokenIn=ETH&tokenOut=ETH",
        handler: "@symbiosis_fi",
        type: "",
        rewardsIcon: [
          { name: "Nova Points", iconURL: "/img/icon-rewards-nova.svg" },
        ],
        rewards: "Bridge",
        protocolAllocated:
          (symbiosis?.refPoints || 0) + (symbiosis?.holdingPoints || 0),
        details: [
          {
            booster: `${symbiosisBridgeNovaPoints} Nova Points`,
            description: `Bridge more than 0.1 ETH/ 500USDT /500 USDC to Nova to earn Nova Points.`,
            action: "Bridge",
          },
        ],
      },

      {
        category: meson?.category || "other",
        iconURL: "/img/icon-meson.svg",
        name: "Meson",
        link: "https://meson.fi/zklink",
        handler: "@mesonfi",
        type: "",
        rewardsIcon: [
          { name: "Nova Points", iconURL: "/img/icon-rewards-nova.svg" },
        ],
        rewards: "Bridge",
        protocolAllocated:
          (meson?.refPoints || 0) + (meson?.holdingPoints || 0),
        details: [
          {
            booster: `${mesonBridgeNovaPoints} Nova Points`,
            description: `Bridge more than 0.1 ETH/ 500USDT /500 USDC to Nova to earn Nova Points.`,
            action: "Bridge",
          },
        ],
      },
    ];

    return tabActive
      ? arr.filter((item) => item?.category === tabActive.category)
      : arr;
  }, [
    orbiterBridgeNovaPoints,
    symbiosisBridgeNovaPoints,
    mesonBridgeNovaPoints,
    novaCategoryUserPoints,
    geNovaCategoryUserPointsByProject,
    tabActive,
  ]);

  const warningModal = useDisclosure();
  const [link, setLink] = useState<string | undefined>(undefined);
  const [recognize, setRecognize] = useState(false);

  const handleLink = (link: string) => {
    setRecognize(false);
    setLink(link);
    warningModal.onOpen();
  };

  const currentTvl = useMemo(() => {
    console.log("tvlCategory", tvlCategoryMilestone, tabActive?.category);
    const tvl =
      tvlCategoryMilestone?.find((item) => item.name === tabActive?.category)
        ?.data || 0;

    console.log("tvl", tvl);
    return tvl;
  }, [tvlCategoryMilestone, tabActive]);

  const [milestoneProgressList, setMilestoneProgressList] = useState<number[]>(
    []
  );

  const isMaxProgress = useMemo(() => {
    if (
      milestoneProgressList.length > 0 &&
      milestoneProgressList[milestoneProgressList.length - 1] === 100
    ) {
      return true;
    } else {
      return false;
    }
  }, [milestoneProgressList]);

  const [currentAllocationZKL, setCurrentAllocationZKL] = useState(0);
  const [nextAllocationZKL, setNextAllocationZKL] = useState(0);
  const [nextTargetTvl, setNextTargetTvl] = useState(0);
  const [maxZKL, setMaxZKL] = useState(0);

  const isNoProgress = useMemo(() => {
    if (
      tabActive?.category === "gamefi" ||
      tabActive?.category === "other" ||
      tabActive?.category === "nativeboost"
    ) {
      return true;
    } else {
      return false;
    }
  }, [tabActive]);

  useEffect(() => {
    if (!tabActive) return;
    console.log("tabActive", tabActive);

    if (tabActive?.category && isNoProgress) {
      setCurrentAllocationZKL(
        milestoneNoProgressMap[tabActive?.category].zkl || 0
      );
      setMaxZKL(milestoneNoProgressMap[tabActive?.category].max || 0);
    } else {
      const milestoneData = milestoneMap[tabActive?.category];
      console.log("milestoneData", milestoneData);

      if (milestoneData) {
        const currentTvlNum = Number(currentTvl);

        const progressFilters = milestoneData.filter((item) => item.tvl !== 0);

        const arr = progressFilters.map((item, index) => {
          let progress = 0;

          const prevTvl = index > 0 ? progressFilters[index - 1].tvl : 0;
          if (currentTvlNum >= item.tvl) {
            progress = 100;
          } else if (currentTvlNum > prevTvl && currentTvlNum < item.tvl) {
            progress = (currentTvlNum / item.tvl) * 100;
          } else {
            progress = 0;
          }

          return progress;
        });

        const activeFilters = milestoneData.filter(
          (item) => currentTvlNum > item.tvl
        );
        const currentIndex =
          activeFilters.length === 0 ? 0 : activeFilters.length - 1;
        const nextIndex =
          currentIndex + 1 === milestoneData.length
            ? currentIndex
            : currentIndex + 1;

        setCurrentAllocationZKL(milestoneData[currentIndex].zkl || 0);
        setNextAllocationZKL(milestoneData[nextIndex].zkl || 0);
        setNextTargetTvl(milestoneData[nextIndex].tvl || 0);

        setMaxZKL(milestoneData[milestoneData.length - 1].zkl || 0);

        setMilestoneProgressList(arr);
      }
    }
  }, [tabActive?.category, isNoProgress, currentTvl]);

  return (
    <Container>
      <div className="flex justify-between">
        <div>
          <div className="holding-title flex items-center gap-[4px]">
            <img
              src={tabActive?.iconURL}
              alt=""
              className="w-[16px] h-[16px]"
            />
            <span>{tabActive?.name} $ZKL Allocation</span>
          </div>
          <div className="holding-value mt-[16px]">
            {formatToThounds(currentAllocationZKL)} $ZKL{" "}
            <span className="max">
              $ZKL (Up to {formatToThounds(maxZKL)} $ZKL)
            </span>
          </div>
          {!isNoProgress ? (
            <div className="holding-desc mt-[25px] flex items-center gap-[4px]">
              Next $ZKL Allocation Level: {formatToThounds(nextAllocationZKL)}{" "}
              $ZKL
              <Tooltip
                classNames={{
                  content:
                    "max-w-[300px] py-[20px] px-[16px] text-[14px] text-[#FBFBFB99] bg-[#000811]",
                }}
                content={`This sector will allocated ${formatToThounds(
                  nextAllocationZKL
                )} $ZKL after reaching the next milestone.`}
              >
                <img
                  src="/img/icon-info-2.svg"
                  alt=""
                  className="w-[20px] h-[20px]"
                />
              </Tooltip>
            </div>
          ) : (
            ""
          )}
        </div>
        <AllocatedBox>
          <div className="flex items-center justify-between">
            <span className="label">Sector Allocated Points</span>
            <span className="value">
              {formatNumberWithUnit(novaCategoryTotalPoints)}
            </span>
          </div>
          <div className="line"></div>
          <div className="flex items-center justify-between">
            <span className="label">Your Points</span>
            <span className="value">{formatNumberWithUnit(holdingPoints)}</span>
          </div>
        </AllocatedBox>
      </div>
      <MilestoneBox>
        <div className="mt-[36px] flex justify-between items-center">
          {isNoProgress ? (
            <div>
              This sector currently doesn't have a milestone, so the $ZKL
              allocation will grow contingently.
            </div>
          ) : (
            <>
              <div>
                Current{" "}
                {tabActive?.category === "perpdex" ? "Trading Volume" : "TVL"}:{" "}
                {formatToThounds(currentTvl)}
              </div>
              <div>
                {isMaxProgress ? (
                  <span className="text-green">Max</span>
                ) : (
                  <>
                    Next TVL{" "}
                    {tabActive?.category === "perpdex"
                      ? "Trading Volume"
                      : "TVL"}{" "}
                    Milestone : {formatToThounds(nextTargetTvl)}
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {isNoProgress ? (
          <div className="w-full mt-[22px]">
            <MilestoneProgress progress={0} isDisabled={true} />
          </div>
        ) : (
          <div className="mt-[22px] flex items-center justify-between gap-[17px]">
            {milestoneProgressList.map((item, index) => (
              <div className="w-full" key={index}>
                <MilestoneProgress progress={item} />
              </div>
            ))}
          </div>
        )}
      </MilestoneBox>

      <List>
        <div className="list-header flex items-center">
          <div className="list-header-item text-left">Protocol</div>
          <div className="list-header-item text-center">Points booster</div>
          <div className="list-header-item text-center">Rewards</div>
          <div className="list-header-item text-center">Allocated Points</div>
          <div className="list-header-item"></div>
        </div>
        <div className="list-content">
          {ecoDAppsList.map((item, index) => (
            <EcoDApp key={index} data={item} handleLink={handleLink} />
          ))}
        </div>
      </List>

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
                  setRecognize(false);
                  warningModal.onClose();
                  window.open(link, "_blank");
                }}
              >
                Continue to Access
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
}
