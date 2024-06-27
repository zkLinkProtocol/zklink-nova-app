import { useEffect, useState } from "react";
import useNovaNFT, { MysteryboxMintParams } from "@/hooks/useNovaNFT";
import { useAccount } from "wagmi";
import { Abi } from "viem";
import styled from "styled-components";

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
  height: 80px;
  padding: 16px 20px;
  & > img {
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
    & > .particpate {
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
  }, [address, publicClient, trademarkNFT]);

  return (
    <Container>
      {nftData.map((item, index) => (
        <Item key={index}>
          <img src={`/img/img-${item.img}`} alt={item.name} />
          <div className="flex flex-col">
            <p className="name">
              {item.name} ({item.balance})
            </p>
            <p className="desc">
              You could earn Oak Tree Roots by participate in daily checking or
              buy from OKX
            </p>
          </div>
          <div className="action flex col-2 justify-center items-center gap-[10px]">
            <span className="action-label">Action:</span>
            <span className="particpate">Acquire now</span>
            <img src="img/icon-square-link-color.svg" alt="" />
          </div>
        </Item>
      ))}
    </Container>
  );
}
