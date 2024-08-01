import {
  NovaCategoryPoints,
  NovaCategoryUserPoints,
  NovaProjectTotalPoints,
  PortocolSpinItem,
  TvlCategoryMilestone,
  getNovaProjectTotalPoints,
  getProtocolSpin,
} from "@/api";
import useNovaPoints from "@/hooks/useNovaPoints";
import { formatNumberWithUnit } from "@/utils";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { NovaPointsListItem } from "@/pages/DashboardS2/index2";
import SectorHeader from "./SectorHeader";
import { useTranslation } from "react-i18next";
import DailyDrawModal from "../DailyRoulette/DailyDrawModal";

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

  .row-items {
    width: 80%;
    .list-header-item,
    .list-content-item {
      width: 25%;

      &:last-child {
        width: 268px;
      }
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
  holdingPoints: NovaProjectTotalPoints;
  remainSpinNum: number;
  projectName: string;
  totalPoints?: NovaProjectTotalPoints;
  details: {
    booster: string | ReactNode;
    description: string;
    action: string;
    actionLink?: string;
    actionLinks?: string[];
    descriptionTooltip?: string;
  }[];
  idFeatured?: boolean;
}

const EcoDApp = (props: {
  data: EcoDAppItem;
  handleLink: (link: string) => void;
  onDrawed: () => void;
}) => {
  const { data, handleLink, onDrawed } = props;
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const modal = useDisclosure();

  const allocatedTooltips = useMemo(() => {
    const protocolPoints = [
      {
        label: t("dashboard.by_interaction"),
        value: formatNumberWithUnit(data.totalPoints?.ecoPoints || 0),
      },
      {
        label: "By Referral",
        value: formatNumberWithUnit(data.totalPoints?.referralPoints || 0),
      },
    ];

    const yourPoints = [
      {
        label: t("dashboard.by_interaction"),
        value: formatNumberWithUnit(data.holdingPoints?.ecoPoints || 0),
      },
      {
        label: "By Referral",
        value: formatNumberWithUnit(data.holdingPoints?.referralPoints || 0),
      },
    ];

    return {
      protocolPoints,
      yourPoints,
    };
  }, [data, t]);

  const handleSpinModal = (e: React.MouseEvent<HTMLElement>) => {
    if (data.remainSpinNum < 1) {
      return;
    }
    e.stopPropagation();
    modal.onOpen();
  };

  return (
    <>
      <div className="row mb-[24px] overflow-hidden">
        <div className="flex items-center cursor-pointer">
          <div className="list-content-item flex items-center gap-[10px] w-1/5">
            <img
              src={data.iconURL}
              alt=""
              className="w-[55px] h-[56px] rounded-full block"
            />
            <div>
              <div
                className="symbol flex items-center gap-[4px]"
                onClick={(e) => {
                  handleLink(data.link);
                }}
              >
                <span className="whitespace-nowrap">{data.name}</span>
                <img
                  src="/img/icon-ecolink.svg"
                  alt=""
                  width={16}
                  height={16}
                />
              </div>
              <div className="name mt-[5px]">{data.handler}</div>
            </div>
          </div>
          <div
            className="row-items flex items-center w-4/5"
            onClick={() => setIsOpen(!isOpen)}
          >
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
                    className="min-w-[32px] w-[32px] rounded-full"
                  />
                </Tooltip>
              ))}
            </div>
            <div className="col-line"></div>

            <div className="list-content-item text-center">
              <Tooltip
                classNames={{
                  content: "py-[20px] px-[16px] text-[14px] bg-[#000811]",
                }}
                content={
                  <div className="min-w-[200px]">
                    <div className="text-[#999] text-[14px] font-[500]">
                      Your Allocated Points
                    </div>
                    {allocatedTooltips.yourPoints.map((item, index) => (
                      <div
                        className="flex items-center justify-between text-[#fff] text-[14px] font-[500]"
                        key={index}
                      >
                        <span>{item.label}</span>
                        <span>{item.value}</span>
                      </div>
                    ))}

                    <div className="mt-[18px] text-[#999] text-[14px] font-[500]">
                      Protocol Allocated Points
                    </div>

                    {allocatedTooltips.protocolPoints.map((item, index) => (
                      <div
                        className="flex items-center justify-between text-[#fff] text-[14px] font-[500]"
                        key={index}
                      >
                        <span>{item.label}</span>
                        <span>{item.value}</span>
                      </div>
                    ))}
                  </div>
                }
              >
                <div>
                  {formatNumberWithUnit(
                    data.holdingPoints.ecoPoints +
                      data.holdingPoints.referralPoints
                  )}
                  /
                  <span className="opacity-40">
                    {formatNumberWithUnit(
                      (data.totalPoints?.ecoPoints || 0) +
                        (data.totalPoints?.referralPoints || 0)
                    )}
                  </span>
                </div>
              </Tooltip>
            </div>
            <div className="col-line"></div>

            <div className="list-content-item flex justify-center items-center">
              <div
                className={`px-[8px] py-[4px] bg-[#282828] rounded-[4px] flex justify-center items-center gap-[8px] ${
                  data.remainSpinNum < 1
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
                onClick={handleSpinModal}
              >
                <img
                  src="/img/s2/icon-spin-gradient.svg"
                  alt=""
                  width={24}
                  height={24}
                  className="min-w-[24px]"
                />
                <GradientText>Spin</GradientText>
              </div>
            </div>

            <div className="list-content-item  flex justify-end items-center">
              {/* <span className="action">Action:</span> */}
              <div className="flex items-center gap-[4px] cursor-pointer select-none">
                <GradientText className="participate">How to earn</GradientText>
                <img
                  src="/img/icon-ecolink2.svg"
                  alt=""
                  width={16}
                  height={16}
                />
              </div>
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
                <div className="detail-item min-w-[440px] w-[440px]">
                  <div className="detail-label">Booster</div>
                  <div className="detail-value">{detail.booster}</div>
                </div>
                <div className="detail-item min-w-[480px] w-[480px]">
                  <div className="detail-label">Description</div>
                  <div className="detail-value">
                    {detail.description}

                    {detail?.descriptionTooltip && (
                      <Tooltip
                        content={detail.descriptionTooltip}
                        classNames={{
                          content:
                            "max-w-[600px] py-[20px] px-[16px] text-[14px] text-[#FBFBFB99] bg-[#000811]",
                        }}
                      >
                        <img
                          src="/img/icon-info-2.svg"
                          alt=""
                          className="w-[20px] h-[20px] inline-block"
                        />
                      </Tooltip>
                    )}
                  </div>
                </div>

                <div className="detail-label">Action</div>
                {detail.actionLinks ? (
                  <Dropdown>
                    <DropdownTrigger>
                      <div className="detail-value flex justify-end items-center gap-[4px]">
                        <div className="text-right whitespace-nowrap text-[#0BC48F] cursor-pointer">
                          <GradientText>{detail.action}</GradientText>
                        </div>
                        <img
                          src="/img/open-in-new-s2.svg"
                          alt=""
                          width={20}
                          height={20}
                        />
                      </div>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="action"
                      itemClasses={{
                        base: "gap-4",
                      }}
                    >
                      {detail.actionLinks.map((link, index) => (
                        <DropdownItem
                          className="whitespace-nowrap"
                          key={index}
                          onClick={() => handleLink(link)}
                        >
                          {link}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                ) : (
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
                )}
              </div>
            ))}
          </DetailBox>
        )}
      </div>
      <DailyDrawModal
        key={data.name}
        modalInstance={modal}
        onDrawed={onDrawed}
        remain={data.remainSpinNum}
        type="protocol"
        projectName={data.projectName}
      />
    </>
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
  holdingPoints?: NovaPointsListItem;
  novaCategoryTotalPoints?: NovaCategoryPoints;
}) {
  const { t } = useTranslation();

  const geNovaCategoryUserPointsByProject = (project: string) => {
    const obj = novaCategoryUserPoints.find((item) => item.project === project);
    return obj;
  };

  const {
    orbiterBridgeNovaPoints,
    symbiosisBridgeNovaPoints,
    mesonBridgeNovaPoints,
  } = useNovaPoints();

  const [projectTotalPoints, setProjectTotalPoints] = useState<
    NovaProjectTotalPoints[]
  >([]);

  const getProjectTotalPoints = async () => {
    const { data } = await getNovaProjectTotalPoints();
    if (data) {
      setProjectTotalPoints(data);
    }
  };

  useEffect(() => {
    getProjectTotalPoints();
  }, []);

  const getTotalPointsByProject = useCallback(
    (project: string) => {
      const obj = projectTotalPoints.find((item) => item.project === project);
      return obj;
    },
    [projectTotalPoints]
  );

  const getHoldingPointsByProject = (project: string) => {
    const data = geNovaCategoryUserPointsByProject(project);
    return {
      project: project,
      ecoPoints: data?.holdingPoints || 0,
      referralPoints: data?.refPoints || 0,
    };
  };

  const [spinList, setSpinList] = useState<PortocolSpinItem[]>([]);

  const getSpin = async () => {
    const { result } = await getProtocolSpin();
    console.log("getProtocolSpin", result);
    if (result) {
      setSpinList(result);
    }
  };

  const getSpinByProject = (project: string) => {
    const data = spinList.find((item) => item.projectName === project);
    return {
      project,
      remainSpinNum: data?.remainSpinNum || 0,
    };
  };

  const ecoDAppsList = useMemo(() => {
    // const novaswap = geNovaCategoryUserPointsByProject("novaswap");
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
        holdingPoints: getHoldingPointsByProject("nowaswap"),
        totalPoints: getTotalPointsByProject("novaswap"),
        remainSpinNum: getSpinByProject("novaswap").remainSpinNum,
        projectName: "novaswap",
        details: [
          {
            booster: (
              <div>
                <p>20x for ZKL, Merge wBTC, wETH, USDT，USDC</p>
                <p>10x for other supported tokens</p>
              </div>
            ),
            description: t("dashboard.eco_dapp_desc"),
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
        holdingPoints: getHoldingPointsByProject("nowaswap"),
        totalPoints: getTotalPointsByProject("novaswap"),
        remainSpinNum: getSpinByProject("novaswap").remainSpinNum,
        projectName: "novaswap",
        details: [
          {
            booster: (
              <div>
                <div>
                  <p>20x for ZKL, Merge wBTC, wETH, USDT，USDC</p>
                  <p>10x for other supported tokens</p>
                </div>
              </div>
            ),
            description: t("dashboard.eco_dapp_desc"),
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
          {
            name: "Layerbank Points",
            iconURL: "/img/icon-rewards-layerbank.svg",
          },
        ],
        holdingPoints: getHoldingPointsByProject("layerbank"),
        totalPoints: getTotalPointsByProject("layerbank"),
        remainSpinNum: getSpinByProject("layerbank").remainSpinNum,
        projectName: "layerbank",
        details: [
          {
            booster: (
              <div>
                <p>10x for ZKL, ETH/wETH and merged wBTC, USDT, USDC</p>
                <p>
                  4x for canonically bridged tokens (pufETH.eth, Manta.manta,
                  Stone.manta, wBTC.eth)
                </p>
                <p>2x for externally bridged tokens (solvBTC.m, mBTC)</p>
              </div>
            ),
            description: t("dashboard.eco_dapp_desc"),
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
        holdingPoints: getHoldingPointsByProject("logx"),
        totalPoints: getTotalPointsByProject("logx"),
        remainSpinNum: getSpinByProject("logx").remainSpinNum,
        projectName: "logx",
        details: [
          {
            booster: (
              <div>
                <p>10x points for LPs providing USDT</p>
              </div>
            ),
            description: t("dashboard.eco_dapp_desc"),
            action: "Provide Liquidity",
          },
          {
            booster: (
              <div>
                <p>1 point / $200 volume</p>
              </div>
            ),
            description: t("dashboard.logx_trade_desc"),
            action: "Trade",
            actionLink: "https://app.logx.trade/",
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
        holdingPoints: getHoldingPointsByProject("shoebill"),
        totalPoints: getTotalPointsByProject("shoebill"),
        remainSpinNum: getSpinByProject("shoebill").remainSpinNum,
        projectName: "shoebill",
        details: [
          {
            booster: (
              <div>
                <p>10x for ZKL, ETH</p>
                <p>4x for other suppoted points</p>
              </div>
            ),
            description: t("dashboard.eco_dapp_desc"),
            action: "Provide Liquidity",
          },
        ],
      },
      {
        category: aqua?.category || "lending",
        iconURL: "/img/icon-native.svg",
        name: "Native Lend",
        link: "https://native.org/lend?utm_campaign=zklink_nova&utm_source=custom&utm_medium=2xpoints?chainId=810180",
        handler: "@native_fi",
        type: "Lending",
        rewardsIcon: [
          { name: "Nova Points", iconURL: "/img/icon-rewards-nova.svg" },
        ],
        rewards: "Up to 10x",
        holdingPoints: getHoldingPointsByProject("aqua"),
        totalPoints: getTotalPointsByProject("aqua"),
        remainSpinNum: getSpinByProject("aqua").remainSpinNum,
        projectName: "aqua",
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
            description: t("dashboard.eco_dapp_desc"),
            action: "Provide Liquidity",
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
        holdingPoints: getHoldingPointsByProject("izumi"),
        totalPoints: getTotalPointsByProject("izumi"),
        remainSpinNum: getSpinByProject("izumi").remainSpinNum,
        projectName: "izumi",
        details: [
          {
            booster: (
              <div>
                <p>10x for ZKL, ETH/wETH and merged wBTC, USDT, USDC</p>
                <p>3x for externally bridged tokens (solvBTC.m)</p>
                <p>
                  Note: Boosts are provided only for effective liquidity. For
                  AMM DEX, two-sided liquidity provision is required to qualify
                  for the dApp booster.
                </p>
              </div>
            ),
            description: t("dashboard.eco_dapp_desc"),
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
        holdingPoints: getHoldingPointsByProject("wagmi"),
        totalPoints: getTotalPointsByProject("wagmi"),
        remainSpinNum: getSpinByProject("wagmi").remainSpinNum,
        projectName: "wagmi",
        details: [
          {
            booster: (
              <div>
                <p>10x for Merged wBTC, wETH, USDT</p>
              </div>
            ),
            description: t("dashboard.eco_dapp_desc"),
            action: "Provide Liquidity",
          },
          {
            booster: (
              <div>
                <p>1 point / $200 volume</p>
              </div>
            ),
            description: t("dashboard.wagmi_trade_desc"),
            action: "Trade",
            actionLink: "https://app.wagmi.com/trade/swap",
          },
        ],
      },

      {
        category: zkdx?.category || "perpdex",
        iconURL: "/img/icon-zkdx.svg",
        name: "zkDX",
        link: "https://app.zkdx.io/stakingliquidity",
        handler: "@zkDXio",
        type: "Perp DEX",
        rewardsIcon: [
          { name: "Nova Points", iconURL: "/img/icon-rewards-nova.svg" },
        ],
        rewards: "Up to 10x / Trading",
        holdingPoints: getHoldingPointsByProject("zkdx"),
        totalPoints: getTotalPointsByProject("zkdx"),
        remainSpinNum: getSpinByProject("zkdx").remainSpinNum,
        projectName: "zkdx",
        details: [
          {
            booster: (
              <div>
                <p>10x for Merged ETH, USDC</p>
              </div>
            ),
            description: t("dashboard.eco_dapp_desc"),
            action: "Provide Liquidity",
          },
          {
            booster: (
              <div>
                <p>1 point / $200 volume</p>
              </div>
            ),
            description: t("dashboard.zkdx_trade_desc"),
            action: "Trade",
            actionLink: "https://app.zkdx.io/trade",
          },
        ],
      },

      {
        category: allspark?.category || "other",
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
        holdingPoints: getHoldingPointsByProject("allspark"),
        totalPoints: getTotalPointsByProject("allspark"),
        remainSpinNum: getSpinByProject("allspark").remainSpinNum,
        projectName: "allspark",
        details: [
          {
            booster: (
              <div>
                <p>1 points per trade</p>
              </div>
            ),
            description: t("dashboard.allspark_desc"),
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
        holdingPoints: getHoldingPointsByProject("rubic"),
        totalPoints: getTotalPointsByProject("rubic"),
        remainSpinNum: getSpinByProject("rubic").remainSpinNum,
        projectName: "rubic",
        details: [
          {
            booster: (
              <div>
                <p>1 point per trade</p>
              </div>
            ),
            description: t("dashboard.rubic_desc"),
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
        holdingPoints: getHoldingPointsByProject("interport"),
        totalPoints: getTotalPointsByProject("interport"),
        remainSpinNum: getSpinByProject("interport").remainSpinNum,
        projectName: "interport",
        details: [
          {
            booster: (
              <div>
                <p>10x for merged USDT and USDC</p>
              </div>
            ),
            description: t("dashboard.interport_desc"),
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
        holdingPoints: getHoldingPointsByProject("orbiter"),
        totalPoints: getTotalPointsByProject("orbiter"),
        remainSpinNum: getSpinByProject("orbiter").remainSpinNum,
        projectName: "orbiter",
        details: [
          {
            booster: `${orbiterBridgeNovaPoints} Nova Points`,
            description: t("dashboard.orbiter_desc"),
            descriptionTooltip:
              "You can earn Nova Points for each transaction of bridging to Nova over 0.1 ETH/ 500USDT /500 USDC (qualified transactions). Every day beginning at UTC+10:00, users who bridge to Nova early will receive more points. You'll accumulate Nova points as follows: 5 points for the initial 200 qualified transactions, 4 points for qualified transactions 201-400, 3 points for qualified transactions 401-600, 2 points for qualified transactions 601-800, and 1 point for any qualified transactions beyond that.",
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
        holdingPoints: getHoldingPointsByProject("symbiosis"),
        totalPoints: getTotalPointsByProject("symbiosis"),
        remainSpinNum: getSpinByProject("symbiosis").remainSpinNum,
        projectName: "symbiosis",
        details: [
          {
            booster: `${symbiosisBridgeNovaPoints} Nova Points`,
            description: t("dashboard.symbiosis_desc"),
            descriptionTooltip: `You can earn Nova Points for each transaction of bridging to Nova over 0.1 ETH/ 500USDT /500 USDC (qualified transactions). Every day beginning at UTC 0:00, users who bridge to Nova early will receive more points. You'll accumulate Nova points as follows: 5 points for the initial 200 qualified transactions, 4 points for qualified transactions 201-400, 3 points for qualified transactions 401-600, 2 points for qualified transactions 601-800, and 1 point for any qualified transactions beyond that.`,
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
        holdingPoints: getHoldingPointsByProject("meson"),
        totalPoints: getTotalPointsByProject("meson"),
        remainSpinNum: getSpinByProject("meson").remainSpinNum,
        projectName: "meson",
        details: [
          {
            booster: `${mesonBridgeNovaPoints} Nova Points`,
            description: t("dashboard.meson_desc"),
            descriptionTooltip: `You can earn Nova Points for each transaction of bridging to Nova over 0.1 ETH/ 500USDT /500 USDC (qualified transactions). Every day beginning at UTC 0:00, users who bridge to Nova early will receive more points. You'll accumulate Nova points as follows: 5 points for the initial 200 qualified transactions, 4 points for qualified transactions 201-400, 3 points for qualified transactions 401-600, 2 points for qualified transactions 601-800, and 1 point for any qualified transactions beyond that.`,
            action: "Bridge",
          },
        ],
      },
      {
        category: eddy?.category || "other",
        iconURL: "/img/icon-eddyfinance.svg",
        name: "Eddy Finance",
        link: "https://app.eddy.finance/swap",
        handler: "@eddy_protocol",
        type: "DEX",
        rewardsIcon: [
          { name: "Nova Points", iconURL: "/img/icon-rewards-nova.svg" },
        ],
        rewards: "Trading",
        holdingPoints: getHoldingPointsByProject("eddy"),
        totalPoints: getTotalPointsByProject("eddy"),
        remainSpinNum: getSpinByProject("eddy").remainSpinNum,
        projectName: "eddy",
        details: [
          {
            booster: (
              <div>
                <p>1 point / $200 volume</p>
              </div>
            ),
            description: t("dashboard.eddy_desc"),
            action: "Trade",
          },
        ],
      },
      {
        category: "spotdex",
        iconURL: "/img/icon-steer.png",
        name: "Steer",
        link: "https://app.steer.finance/novaswap",
        handler: "@steerprotocol",
        type: "DEX",
        rewardsIcon: [
          { name: "Nova Points", iconURL: "/img/icon-rewards-nova.svg" },
        ],
        rewards: "20x Boost",
        holdingPoints: getHoldingPointsByProject("steer"),
        totalPoints: getTotalPointsByProject("steer"),
        remainSpinNum: getSpinByProject("steer").remainSpinNum,
        projectName: "steer",
        details: [
          {
            booster: (
              <div>
                <p>20x for ETH, WETH, Merged WBTC, USDT, USDC</p>
                <p>
                  10x for canonically bridged tokens eligible to earn points
                </p>
              </div>
            ),
            description: `You earn points based on the liquidity you've supplied to the pool over a specific period, with the points multiplied accordingly.`,
            action: "Provide Liquidity",
          },
        ],
      },
      {
        category: "gamefi",
        iconURL: "/img/icon-skyrangers.png",
        name: "Sky Rangers",
        link: "https://statics.skyrangers.io/",
        handler: "@OfficialSkyRang",
        type: "DEX",
        rewardsIcon: [
          { name: "Nova Points", iconURL: "/img/icon-rewards-nova.svg" },
        ],
        rewards: "Interaction",
        holdingPoints: getHoldingPointsByProject("skyrangers"),
        totalPoints: getTotalPointsByProject("skyrangers"),
        remainSpinNum: getSpinByProject("skyrangers").remainSpinNum,
        projectName: "skyrangers",
        details: [
          {
            booster: (
              <div>
                <p>Open Blindbox, NFT Level Up, ZKL Deposit, ZKL Withdraw</p>
              </div>
            ),
            description: `With a total 5x of any supported actions, you can receive 1 Nova Points.`,
            action: "Play now",
            actionLinks: [
              "https://statics.skyrangers.io/",
              "https://t.me/SkyRangers_bot",
            ],
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
    t,
  ]);

  const warningModal = useDisclosure();
  const [link, setLink] = useState<string | undefined>(undefined);
  const [recognize, setRecognize] = useState(false);

  const handleLink = (link: string) => {
    setRecognize(false);
    setLink(link);
    warningModal.onOpen();
  };

  useEffect(() => {
    getSpin();
  }, []);

  return (
    <Container>
      <SectorHeader
        tabActive={tabActive}
        holdingPoints={holdingPoints}
        novaCategoryTotalPoints={novaCategoryTotalPoints}
        tvlCategoryMilestone={tvlCategoryMilestone}
      />

      <List>
        <div className="list-header flex items-center">
          <div className="list-header-item text-left w-1/5">Protocol</div>
          <div className="row-items flex items-center w-4/5">
            <div className="list-header-item text-center">
              {t("dashboard.points_booster")}
            </div>
            <div className="list-header-item text-center">
              {t("dashboard.rewards")}
            </div>
            <div className="list-header-item text-center">
              {t("dashboard.allocated_points")}
            </div>
            <div className="list-header-item text-center">Roulette</div>
            <div className="list-header-item"></div>
          </div>
        </div>
        <div className="list-content">
          {ecoDAppsList.map((item, index) => (
            <EcoDApp
              key={index}
              data={item}
              handleLink={handleLink}
              onDrawed={getSpin}
            />
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
              {t("dashboard.acdess_3rd_website")}
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
                {t("dashboard.recognize")}
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
                {t("dashboard.continute_to_access")}
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
}
