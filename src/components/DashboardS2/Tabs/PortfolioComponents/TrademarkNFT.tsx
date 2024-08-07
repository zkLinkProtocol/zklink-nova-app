import { useEffect, useState } from "react";
import useNovaNFT, { MysteryboxMintParams } from "@/hooks/useNovaNFT";
import { useAccount } from "wagmi";
import { Abi } from "viem";
import styled from "styled-components";
import { useUpdateNftBalanceStore } from "@/hooks/useUpdateNftBalanceStore";
import { t } from "i18next";

const Container = styled.div`
  margin-top: 20px;
  & > div:last-child {
    margin-bottom: 0;
  }
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  border-radius: 24px;
  border: 2px solid #635f5f;
  background: #151923;
  margin-bottom: 18px;
  padding: 16px 20px;
  .icon {
    width: 56px;
    height: 56px;
    flex-shrink: 0;
    border-radius: 12px;
    margin-right: 4px;
  }
  .name {
    color: #fff;
    font-family: Satoshi;
    font-size: 16px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
    text-transform: capitalize;
  }
  .desc {
    color: rgba(255, 255, 255, 0.6);
    font-family: Satoshi;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  .action {
    display: flex;
    align-items: center;
    margin-left: auto;
    & > .action-label {
      color: rgba(255, 255, 255, 0.6);
      font-family: Satoshi;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      margin-right: 2px;
    }
    & > .participate {
      text-align: center;
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
    }
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
`;

const ALL_NFTS = [
  { img: "trademark-1.png", name: "Oak Tree Roots", balance: 0 },
  { img: "trademark-2.png", name: "Magnifying Glass", balance: 0 },
  { img: "trademark-3.png", name: "Chess Knight", balance: 0 },
  { img: "trademark-4.png", name: "Binary Code Metrix Cube", balance: 0 },
];
export default function TrademarkNFT() {
  const [nftData, setNftData] = useState(ALL_NFTS);
  const { address } = useAccount();
  const { publicClient, trademarkNFT } = useNovaNFT();
  const { factor } = useUpdateNftBalanceStore();
  useEffect(() => {
    (async () => {
      if (!publicClient || !address || !trademarkNFT) {
        return;
      }
      const trademarkBalancesCall = await publicClient?.multicall({
        contracts: [1, 2, 3, 4].map((item) => ({
          address: trademarkNFT.address,
          abi: trademarkNFT.abi as Abi,
          functionName: "balanceOf",
          args: [address, item],
        })),
      });
      const trademarkBalances =
        trademarkBalancesCall?.map((item) => item.result?.toString() ?? 0) ??
        [];
      const nfts = [];
      console.log("trademarkBalances: ", trademarkBalances);
      for (let i = 0; i < 4; i++) {
        nfts.push({ ...ALL_NFTS[i], balance: Number(trademarkBalances[i]) });
      }
      setNftData(nfts);
    })();
  }, [address, publicClient, trademarkNFT, factor]);

  return (
    <Container>
      {nftData.map((item, index) => (
        <Item key={index} className="flex-col md:flex-row md:h-[80px]">
          <div className="flex items-center">
            <img
              src={`/img/img-${item.img}`}
              alt={item.name}
              className="icon min-w--[56px] w-[56px] h-[56px]"
            />

            <div className="flex flex-col">
              <p className="name">
                {item.name} ({item.balance})
              </p>
              <p className="desc">
                {t("dashboard.eran_nft_by_participating", { name: item.name })}
              </p>
            </div>
          </div>

          <div className="row-line mt-[20px] mb-[12px] md:hidden"></div>

          <div className="action flex col-2 justify-between md:justify-center items-center gap-[10px] w-full md:w-auto">
            <span className="action-label">Action:</span>
            <a
              href="https://www.okx.com/web3/marketplace/nft/collection/zklinknova/nova-trademark-nfts"
              target="_blank"
              className="flex items-center gap-[10px]"
            >
              <span className="participate">Buy From OKX</span>
              <img src="img/icon-square-link-color.svg" alt="" />
            </a>
          </div>
        </Item>
      ))}
    </Container>
  );
}
