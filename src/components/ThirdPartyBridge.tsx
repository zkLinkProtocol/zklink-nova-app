import useNovaPoints from "@/hooks/useNovaPoints";
import { useMemo } from "react";
import styled from "styled-components";
import { DefaultBtn, Line } from "./Bridge/Components";

const Title = styled.div`
  color: var(--Neutral-1, #fff);
  font-family: Satoshi;
  font-size: 24px;
  font-style: normal;
  font-weight: 900;
  line-height: normal;
`;

const ListCard = styled.a`
  border-radius: 16px;
  border: 2.205px solid #635f5f;
  background: #151923;
`;

const ColLine = styled.div`
  width: 1px;
  height: 48px;
  opacity: 0.3;
  background: linear-gradient(
    rgba(255, 255, 255, 0) 0%,
    rgba(251, 251, 251, 0.6) 51.5%,
    rgba(255, 255, 255, 0) 100%
  );
`;

export default function ThridPartyBridge() {
  const {
    mesonBridgeNovaPoints,
    symbiosisBridgeNovaPoints,
    owltoBridgeNovaPoints,
    orbiterBridgeNovaPoints,
  } = useNovaPoints();
  const bridges = useMemo(() => {
    return [
      {
        iconURL: "/img/icon-free.svg",
        name: "Free",
        desc: "Bridge Bitcoin assets to earn Nova Points.",
        tooltip: "",
        points: "",
        link: "https://app.free.tech/",
      },
      {
        iconURL: "/img/icon-orbiter.svg",
        name: "Orbiter Finance",
        desc: "Bridge more than 0.1 ETH/ 500USDT /500 USDC to Nova to earn Nova Points.",
        tooltip: "",
        points: `${orbiterBridgeNovaPoints} ${
          orbiterBridgeNovaPoints > 1 ? "Nova Points" : "Nova Point"
        }`,
        link: "https://www.orbiter.finance/?source=Ethereum&dest=zkLink%20Nova&token=ETH",
      },
      {
        iconURL: "/img/icon-meson.svg",
        name: "Meson Finance",
        desc: "Bridge more than 0.1 ETH/ 500USDT /500 USDC to Nova to earn Nova Points.",
        tooltip: "",
        points: `${mesonBridgeNovaPoints} ${
          mesonBridgeNovaPoints > 1 ? "Nova Points" : "Nova Point"
        }`,
        link: "https://meson.fi/zklink",
      },
      // {
      //   iconURL: "/img/icon-owlto.svg",
      //   name: "Owlto Finance",
      //   desc: "Bridge more than 0.1 ETH/ 500USDT /500 USDC to Nova to earn Nova Points.",
      //   tooltip: "",
      //   points: `${owltoBridgeNovaPoints} ${
      //     owltoBridgeNovaPoints > 1 ? "Nova Points" : "Nova Point"
      //   }`,
      //   link: "https://owlto.finance/?to=zkLinkNova",
      // },
      {
        iconURL: "/img/icon-symbiosis.svg",
        name: "Symbiosis",
        desc: "Bridge more than 0.1 ETH/ 500USDT /500 USDC to Nova to earn Nova Points.",
        tooltip: "",
        points: `${symbiosisBridgeNovaPoints} ${
          symbiosisBridgeNovaPoints > 1 ? "Nova Points" : "Nova Point"
        }`,
        link: "https://app.symbiosis.finance/swap?chainIn=Ethereum&chainOut=ZkLink&tokenIn=ETH&tokenOut=ETH",
      },
    ];
  }, [
    mesonBridgeNovaPoints,
    orbiterBridgeNovaPoints,
    symbiosisBridgeNovaPoints,
  ]);

  return (
    <div className="mt-[16px] px-[8px]">
      <Title>Earn Extra Nova Points by deposit from third-party bridges!</Title>
      <Line className="mt-6" />
      {bridges.map((bridge, index) => (
        <ListCard
          key={index}
          className="bridge-bg-secondary mt-[1rem] px-[1rem] py-[0.75rem] rounded-[1rem] block flex justify-between items-center"
          href={bridge.link}
          target="_blank"
        >
          <div className="flex shrink grow basis-0 items-center gap-[14px]">
            <img
              src={bridge.iconURL}
              alt={bridge.name}
              className="w-[40px] h-[40px] rounded-full"
            />
            <div>
              <div className="text-[#fff] text-[18px] font-[500]">
                {bridge.name}
              </div>
              <div className="w-[334px] text-[#FBFBFB99] text-[12px] leading-[18px]">
                {bridge.desc}
              </div>
            </div>
            <ColLine />
          </div>

          <div className="min-w-[100px] flex justify-end items-center gap-[0.5rem] whitespace-nowrap">
            {bridge.points && (
              <DefaultBtn className="block rounded-[100px] px-[16px] h-[26px]">
                <span className="btn-text">{bridge.points}</span>
              </DefaultBtn>
            )}
            <img src="/img/icon-ecolink2.svg" className="w-[20px] h-[20px]" />
          </div>
        </ListCard>
      ))}
    </div>
  );
}
