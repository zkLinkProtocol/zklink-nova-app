import { ReactNode, useState } from "react";
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
  iconURL: string;
  name: string;
  subTitle: string;
  type: string;
  idFeatured: boolean;
  rewards: string;
  protocolAllocated: string;
  yourPoints: string;
  details: {
    booster: string | ReactNode;
    description: string;
    action: string;
    actionLink: string;
  }[];
}

export const EcoDApp = (props: { data: EcoDAppItem }) => {
  const { data } = props;
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
                <div className="flex items-center gap-[4px]">
                  <span className="name">Novaswap</span>
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

        <td className="td"></td>
        <td className="td text-right">
          <div>{data.protocolAllocated}</div>
          <div>{data.type} Points</div>
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
                    <div>{detail.description}</div>
                  </td>
                  <td className="detail-td text-right">
                    <div className="detail-label">Action</div>
                    <div className="flex justify-end items-center gap-[4px]">
                      <a
                        href={detail.actionLink}
                        target="_blank"
                        className="text-right whitespace-nowrap text-[#0BC48F]"
                      >
                        {detail.action}
                      </a>
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

export default () => {
  const ecoDApps: EcoDAppItem[] = [
    {
      iconURL: "/img/icon-novaswap.svg",
      name: "Novaswap",
      subTitle:
        "The aggregation liquidity perp dex. The aggregation liquidity......",
      type: "DEX",
      idFeatured: true,
      rewards: "20x",
      protocolAllocated: "500.12 K",
      yourPoints: "13.16k",
      details: [
        {
          booster: (
            <div>
              <p className="whitespace-nowrap">
                <span className="font-[700]">20x</span> for ETH, WETH, Merged
                WBTC, USDT, USDC
              </p>
              <p className="whitespace-nowrap">
                <span className="font-[700]">10x</span> for canonically bridged
                tokens eligible to earn points
              </p>
            </div>
          ),
          description:
            "You earn points based on the liquidity you've supplied to the pool over a specific period, with the points multiplied accordingly.",
          action: "Provide Liquidity",
          actionLink: "",
        },
        {
          booster: (
            <p className="whitespace-nowrap">
              <span className="font-[700]">1 Nova Points</span> per trade
            </p>
          ),
          description:
            "You earn points based on the liquidity you've supplied to the pool over a specific period, with the points multiplied accordingly.",
          action: "Trade",
          actionLink: "",
        },
      ],
    },
    {
      iconURL: "/img/icon-layerbank.svg",
      name: "Layerbank",
      subTitle:
        "The aggregation liquidity perp dex. The aggregation liquidity......",
      type: "Lending",
      idFeatured: false,
      rewards: "20x",
      protocolAllocated: "500.12 K",
      yourPoints: "13.16k",
      details: [
        {
          booster: (
            <p className="whitespace-nowrap">
              <span className="font-[700]">1 Nova Points</span> per trade
            </p>
          ),
          description:
            "You earn points based on the liquidity you've supplied to the pool over a specific period, with the points multiplied accordingly.",
          action: "Trade",
          actionLink: "",
        },
      ],
    },
  ];

  return (
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
        {ecoDApps.map((ecoDApp, index) => (
          <EcoDApp data={ecoDApp} key={index} />
        ))}
      </tbody>
    </Table>
  );
};
