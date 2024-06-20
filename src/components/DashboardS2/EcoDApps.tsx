import useNovaPoints from "@/hooks/useNovaPoints";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { ReactNode, useMemo, useState } from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import styled from "styled-components";

const Table = styled.table`
  width: 100%;
  background-color: #011a24;

  .th {
    padding: 21px 24px;
    color: #999;
    font-family: "Chakra Petch";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px; /* 100% */
    letter-spacing: -0.5px;
    white-space: nowrap;
  }

  .td {
    padding: 28px 24px;
    color: #fff;
    font-family: "Chakra Petch";
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px; /* 100% */
    letter-spacing: -0.5px;
  }

  .name {
    color: #fff;
    font-family: "Chakra Petch";
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px; /* 100% */
  }
  .sub-title {
    color: #999;
    font-family: "Chakra Petch";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px; /* 114.286% */
    letter-spacing: -0.07px;
  }
`;

const DetailTable = styled.table`
  .detail-td {
    padding: 12px 24px;
    vertical-align: top;

    .detail-label {
      margin-bottom: 8px;
      color: rgba(255, 255, 255, 0.5);
      font-family: "Chakra Petch";
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 16px; /* 100% */
      letter-spacing: -0.08px;
    }
    .detail-value {
      color: #fff;
      font-family: "Chakra Petch";
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      letter-spacing: -0.08px;
    }
  }
`;

const Tag = styled.span`
  padding: 0 8px;
  color: #080d11;
  font-family: "Chakra Petch";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
  border-radius: 4px;

  &.DEX {
    background-color: #6dba49;
  }
  &.Lending {
    background-color: #e653c6;
  }
  &.Perp {
    background-color: #01d8cb;
  }
`;

const EarnButton = styled.span`
  padding: 8px 16px;
  color: #fff;
  font-family: "Chakra Petch";
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 18px; /* 100% */
  border-radius: 8px;
  background: #043f38;
  cursor: pointer;
`;

interface EcoDAppItem {
  tab: string;
  iconURL: string;
  name: string;
  link: string;
  subTitle: string;
  type: string;
  rewards: string;
  protocolAllocated: string;
  yourPoints: string;
  details: {
    booster: string | ReactNode;
    description: string;
    action: string;
    actionLink?: string;
  }[];
  idFeatured?: boolean;
}

export const EcoDApp = (props: {
  data: EcoDAppItem;
  handleLink: (link: string) => void;
}) => {
  const { data, handleLink } = props;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <tr>
        <td className="td">
          <div className="flex items-center gap-[12px]">
            <div className="p-[14px] min-w-[64px] min-h-[64px] rounded-full bg-[#242424]">
              <img
                src={data.iconURL}
                alt=""
                width={36}
                height={36}
                className="w-[36px] h-[36px] block rounded-full"
              />
            </div>
            <div>
              <div className="flex items-center gap-[12px]">
                <div
                  className="flex items-center gap-[4px] cursor-pointer"
                  onClick={() => handleLink(data.link)}
                >
                  <span className="name">{data.name}</span>

                  <img
                    src="/img/icon-open-in-new.svg"
                    alt=""
                    width={24}
                    height={24}
                  />
                </div>
                <Tag className={`${data.type}`}>{data.type}</Tag>
                {data.idFeatured && (
                  <Tag className="bg-[#F2CD0C] flex items-center gap-[4px]">
                    <img
                      src="/img/icon-star.svg"
                      alt=""
                      width={16}
                      height={16}
                    />
                    <span>Featured</span>
                  </Tag>
                )}
              </div>

              <div className="sub-title mt-[12px]">{data.subTitle}</div>
            </div>
          </div>
        </td>

        <td className="td">
          <div className="">{data.rewards}</div>
        </td>
        <td className="td text-right">
          <div>{data.protocolAllocated}</div>
          <div className="sub-title mt-[4px]">{data.type} Points</div>
        </td>
        <td className="td text-right">{data.yourPoints}</td>
        <td className="td w-[160px]">
          <EarnButton
            className="flex items-center gap-[2px] whitespace-nowrap"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>How To Earn</span>
            {isOpen ? <AiFillCaretUp /> : <AiFillCaretDown />}
          </EarnButton>
        </td>
      </tr>

      {isOpen && (
        <tr className="detail">
          <td colSpan={5} className="pb-[12px]">
            <DetailTable className="w-full">
              {data.details.map((detail, index) => (
                <tr key={index}>
                  <td className="detail-td">
                    <div className="detail-label">Booster</div>
                    <div className="detail-value">{detail.booster}</div>
                  </td>
                  <td className="detail-td">
                    <div className="detail-label">Description</div>
                    <div className="detail-value">{detail.description}</div>
                  </td>
                  <td className="detail-td text-right">
                    <div className="detail-label">Action</div>
                    <div className="detail-value flex justify-end items-center gap-[4px]">
                      <div
                        className="text-right whitespace-nowrap text-[#0BC48F] cursor-pointer"
                        onClick={() =>
                          handleLink(detail.actionLink || data.link)
                        }
                      >
                        {detail.action}
                      </div>
                      <img
                        src="/img/icon-open-in-new-green.svg"
                        alt=""
                        width={20}
                        height={20}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </DetailTable>
          </td>
        </tr>
      )}
    </>
  );
};

export default ({ tabActive }: { tabActive?: string }) => {
  const {
    orbiterBridgeNovaPoints,
    symbiosisBridgeNovaPoints,
    mesonBridgeNovaPoints,
  } = useNovaPoints();

  const ecoDAppsList = useMemo(() => {
    const arr: EcoDAppItem[] = [
      {
        tab: "SPOT DEX",
        iconURL: "/img/icon-novaswap.svg",
        name: "Novaswap",
        link: "https://novaswap.fi/",
        subTitle:
          "The aggregation liquidity perp dex. The aggregation liquidity......",
        type: "DEX",
        idFeatured: true,
        rewards: "20x",
        protocolAllocated: "0", // TODO
        yourPoints: "0", // TODO
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
        tab: "LENDING",
        iconURL: "/img/icon-layerbank.svg",
        name: "LayerBank",
        link: "https://zklink.layerbank.finance/",
        subTitle:
          "The aggregation liquidity perp dex. The aggregation liquidity......",
        type: "Lending",
        rewards: "10x",
        protocolAllocated: "0", // TODO
        yourPoints: "0", // TODO
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
        tab: "PERP DEX",
        iconURL: "/img/icon-logx.svg",
        name: "LogX",
        link: "https://app.logx.trade/liquidity",
        subTitle:
          "The aggregation liquidity perp dex. The aggregation liquidity......",
        type: "Perp DEX",
        rewards: "10x",
        protocolAllocated: "0", // TODO
        yourPoints: "0", // TODO
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
        tab: "LENDING",
        iconURL: "/img/icon-native.svg",
        name: "Native Lend",
        link: "https://native.org/lend?utm_campaign=zklink_nova&utm_source=custom&utm_medium=2xpoints?chainId=810180",
        subTitle:
          "The aggregation liquidity perp dex. The aggregation liquidity......",
        type: "Lending",
        rewards: "10x",
        protocolAllocated: "0", // TODO
        yourPoints: "0", // TODO
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
        tab: "SPOT DEX",
        iconURL: "/img/icon-izumi.svg",
        name: "iZUMI",
        link: "https://izumi.finance/trade/swap?chainId=810180",
        subTitle:
          "The aggregation liquidity perp dex. The aggregation liquidity......",
        type: "DEX",
        rewards: "10x",
        protocolAllocated: "0", // TODO
        yourPoints: "0", // TODO
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
        tab: "PERP DEX",
        iconURL: "/img/icon-zkdx.svg",
        name: "zkDX",
        link: "https://app.zkdx.io/stakingliquidity",
        subTitle:
          "The aggregation liquidity perp dex. The aggregation liquidity......",
        type: "Perp DEX",
        rewards: "10x",
        protocolAllocated: "0", // TODO
        yourPoints: "0", // TODO
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
        tab: "SPOT DEX",
        iconURL: "/img/icon-eddyfinance.svg",
        name: "Eddy Finance",
        link: "https://app.eddy.finance/swap",
        subTitle:
          "The aggregation liquidity perp dex. The aggregation liquidity......",
        type: "DEX",
        rewards: "10x",
        protocolAllocated: "0", // TODO
        yourPoints: "0", // TODO
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
        tab: "SPOT DEX",
        iconURL: "/img/icon-allspark.svg",
        name: "Allspark",
        link: "https://www.allspark.finance/mantissa/",
        subTitle:
          "The aggregation liquidity perp dex. The aggregation liquidity......",
        type: "DEX",
        rewards: "10x",
        protocolAllocated: "0", // TODO
        yourPoints: "0", // TODO
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
        tab: "OTHER",
        iconURL: "/img/icon-rubic.svg",
        name: "Rubic",
        link: "https://rubic.exchange/",
        subTitle:
          "The aggregation liquidity perp dex. The aggregation liquidity......",
        type: "Cross-Chain",
        rewards: "10x",
        protocolAllocated: "0", // TODO
        yourPoints: "0", // TODO
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
        tab: "OTHER",
        iconURL: "/img/icon-interport.svg",
        name: "Interport",
        link: "https://app.interport.fi/stablecoin-pools?network=zkLink+Nova",
        subTitle:
          "The aggregation liquidity perp dex. The aggregation liquidity......",
        type: "Cross-Chain",
        rewards: "10x",
        protocolAllocated: "0", // TODO
        yourPoints: "0", // TODO
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
        tab: "OTHER",
        iconURL: "/img/icon-orbiter.svg",
        name: "Orbiter",
        link: "https://www.orbiter.finance/?source=Ethereum&dest=zkLink%20Nova&token=ETH",
        subTitle:
          "The aggregation liquidity perp dex. The aggregation liquidity......",
        type: "Cross-Chain",
        rewards: "10x",
        protocolAllocated: "0", // TODO
        yourPoints: "0", // TODO
        details: [
          {
            booster: `${orbiterBridgeNovaPoints} Nova Points`,
            description: `Bridge more than 0.1 ETH/ 500USDT /500 USDC to Nova to earn Nova Points.`,
            action: "Bridge",
          },
        ],
      },

      {
        tab: "OTHER",
        iconURL: "/img/icon-symbiosis.svg",
        name: "Symbiosis",
        link: "https://app.symbiosis.finance/swap?chainIn=Ethereum&chainOut=ZkLink&tokenIn=ETH&tokenOut=ETH",
        subTitle:
          "The aggregation liquidity perp dex. The aggregation liquidity......",
        type: "Cross-Chain",
        rewards: "10x",
        protocolAllocated: "0", // TODO
        yourPoints: "0", // TODO
        details: [
          {
            booster: `${symbiosisBridgeNovaPoints} Nova Points`,
            description: `Bridge more than 0.1 ETH/ 500USDT /500 USDC to Nova to earn Nova Points.`,
            action: "Bridge",
          },
        ],
      },

      {
        tab: "OTHER",
        iconURL: "/img/icon-meson.svg",
        name: "Meson",
        link: "https://meson.fi/zklink",
        subTitle:
          "The aggregation liquidity perp dex. The aggregation liquidity......",
        type: "Cross-Chain",
        rewards: "10x",
        protocolAllocated: "0", // TODO
        yourPoints: "0", // TODO
        details: [
          {
            booster: `${mesonBridgeNovaPoints} Nova Points`,
            description: `Bridge more than 0.1 ETH/ 500USDT /500 USDC to Nova to earn Nova Points.`,
            action: "Bridge",
          },
        ],
      },
    ];
    return tabActive ? arr.filter((item) => item.tab === tabActive) : arr;
  }, [
    orbiterBridgeNovaPoints,
    symbiosisBridgeNovaPoints,
    mesonBridgeNovaPoints,
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

  return (
    <>
      <Table className="mt-[40px]">
        <thead>
          <tr>
            <th className="th text-left">Protocol</th>
            <th className="th text-right">Rewards</th>
            <th className="th text-right">Protocol Allocated</th>
            <th className="th text-right">Your Points</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {ecoDAppsList.map((ecoDApp, index) => (
            <EcoDApp data={ecoDApp} key={index} handleLink={handleLink} />
          ))}
        </tbody>
      </Table>

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
    </>
  );
};
