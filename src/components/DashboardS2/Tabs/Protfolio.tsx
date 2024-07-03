import styled from "styled-components";
import { Button, Tooltip, Checkbox } from "@nextui-org/react";
import { useState, useEffect, useMemo } from "react";
import { formatNumberWithUnit } from "@/utils";
import SbtNft from "./PortfolioComponents/SbtNFT";
import LynksNft from "./PortfolioComponents/LynksNFT";
import TrademarkNFT from "./PortfolioComponents/TrademarkNFT";
import { useAccount } from "wagmi";
import {
  getEigenlayerPoints,
  getMagPiePoints,
  getPufferPoints,
  getRenzoPoints,
  getRsethPoints,
} from "@/api";
import axios from "axios";
import { NovaPointsListItem } from "@/pages/DashboardS2/index2";
const Title = styled.div`
  background: linear-gradient(180deg, #fff 0%, #bababa 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: right;
  font-family: Satoshi;
  font-size: 32px;
  font-style: normal;
  font-weight: 900;
  line-height: normal;
`;
const Container = styled.div`
  .view-more {
    display: flex;
    padding: 12px 18px;
    justify-content: space-between;
    align-items: flex-start;
    border-radius: 24px;
    border: 1px solid rgba(51, 49, 49, 0);
    background: #10131c;
    filter: blur(0.125px);
    cursor: pointer;
    color: #fbfbfb;
    text-align: right;
    font-family: Satoshi;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 110%; /* 17.6px */
    text-transform: capitalize;
  }
  .points-divide {
    height: 1px;
    width: 142px;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(251, 251, 251, 0.6) 51.5%,
      rgba(255, 255, 255, 0) 100%
    );
  }
  .divide {
    height: 1px;
    width: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(251, 251, 251, 0.6) 51.5%,
      rgba(255, 255, 255, 0) 100%
    );
  }
  .points-value {
    text-align: center;
    font-family: Satoshi;
    font-size: 47px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
    background: linear-gradient(180deg, #fff 0%, #bababa 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .btn-earn-more {
    display: flex;
    width: 150px;
    height: 30px;
    padding: 7.5px 40px;
    justify-content: center;
    align-items: center;
    border-radius: 64px;
    background: #1d4138;
    box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.15),
      0px 0px 12px 0px rgba(255, 255, 255, 0.75) inset;
  }
`;

const List = styled.div`
  width: 100%;
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
    .particpate {
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
  .col-2 {
    flex: 2;
  }
  .col-3 {
    flex: 3;
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
`;

const NovaPointsBox = styled.div`
  background: url("/img/s2/bg-nova-points.png") no-repeat;
  background-position: center -30px;
  background-size: 440px auto;
`;

const PointsBox = styled.div`
  padding: 4px 28px;
  border: 2px solid transparent;
  border-radius: 16px;
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;
  background-image: linear-gradient(to right, #282828, #000000),
    linear-gradient(#fb2450 1%, #fbc82e 5%, #6eee3f, #5889f3, #5095f1, #b10af4);
`;

const PointsPopoverContent = (props: {
  data: {
    name: string;
    points: number;
  }[];
}) => {
  const { data } = props;
  return (
    <div className="w-full">
      {data.map((item, index) => (
        <div
          className={`flex items-center justify-between ${
            index !== 0 ? "mt-5" : ""
          }`}
          key={index}
        >
          <span>{item.name}</span>
          <span>{formatNumberWithUnit(item.points)}</span>
        </div>
      ))}
    </div>
  );
};

export interface ProjectPointsItem {
  iconURL: string;
  link: string;
  pointsName: string;
  pointsValue: number;
  eigenlayerName: string;
  eigenlayerValue: number;
  pointsTips?: string;
  eigenlayerTips?: string;
}

export default function Portfolio({
  novaPointsList,
  handleTabChange,
}: {
  novaPointsList: NovaPointsListItem[];
  handleTabChange: (index: number) => void;
}) {
  const [checked, setChecked] = useState(false);
  const { address } = useAccount();

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

  const [pufferEigenlayerPoints, setPufferEigenlayerPoints] = useState(0);
  const getEigenlayerPointsFunc = async () => {
    if (!address) return;
    const { data } = await getEigenlayerPoints(address);
    console.log("getEigenlayerPointsFunc", data);
    if (data && data?.eigenlayer_points) {
      setPufferEigenlayerPoints(+data.eigenlayer_points);
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

  const projectPointsList = useMemo(() => {
    const arr: ProjectPointsItem[] = [
      {
        iconURL: "/img/icon-puffer.svg",
        link: "https://www.puffer.fi/",
        pointsName: "Puffer Points",
        eigenlayerName: "Puffer",
        pointsValue: pufferPoints,
        eigenlayerValue: pufferEigenlayerPoints,
        pointsTips:
          "Your Puffer Points will be visible one hour after you deposit your pufETH.",
        eigenlayerTips:
          "zkLink Nova utilizes the puffer API to showcase puffer Eigenlayer Points. According to Puffer, new users who join puffer after February 9th will not receive Eigenlayer points.",
      },
      {
        iconURL: "/img/icon-renzo.svg",
        link: "https://app.renzoprotocol.com/restake",
        pointsName: "ezPoints",
        eigenlayerName: "Renzo",
        pointsValue: renzoPoints,
        eigenlayerValue: renzoEigenLayerPoints,
        pointsTips:
          "Your ezPoints will be visible one hour after you deposit your ezETH.",
      },
      {
        iconURL: "/img/icon-eigenpie.svg",
        link: "https://www.eigenlayer.magpiexyz.io/restake",
        pointsName: "EigenPie Points",
        eigenlayerName: "EigenPie",
        pointsValue: magpiePointsData.points,
        eigenlayerValue: magpiePointsData.layerPoints,
        pointsTips:
          "Your EngenPie Points will be visible one hour after you deposit your mxETH",
      },
      {
        iconURL: "/img/icon-kelp.svg",
        link: " https://kelpdao.xyz/restake/",
        pointsName: "Kelp Miles",
        eigenlayerName: "KelpDao",
        pointsValue: kelpMiles,
        eigenlayerValue: kelpEigenlayerPoints,
      },
      {
        iconURL: "/img/icon-bedrock.svg",
        link: "https://www.bedrock.technology/",
        pointsName: "Bedrock Diamonds",
        eigenlayerName: "Bedrock",
        pointsValue: bedrockPoints,
        eigenlayerValue: bedrockEigenlayerPoints,
      },
    ];

    const list = checked ? arr.filter((item) => item.pointsValue >= 0.01) : arr;
    console.log(checked, arr, "checked");

    return list;
  }, [
    pufferPoints,
    pufferEigenlayerPoints,
    renzoPoints,
    renzoEigenLayerPoints,
    magpiePointsData,
    kelpMiles,
    kelpEigenlayerPoints,
    bedrockPoints,
    bedrockEigenlayerPoints,
    checked,
  ]);

  useEffect(() => {
    getPufferPointsFunc();
    getEigenlayerPointsFunc();
    getRenzoPointsFunc();
    getMagpiePointsFunc();
    getRsethPointsFunc();
    getBedrockPointsFunc();
  }, [address]);

  const handleViewMore = () => {};

  return (
    <Container>
      <div className="flex items-center justify-between">
        <Title>Your Nova Points</Title>
      </div>
      <div className="flex flex-wrap items-center mt-5">
        {novaPointsList.map((item, index) => (
          <NovaPointsBox
            key={index}
            className="flex flex-col items-center w-[295px] h-[298px] bg-[#1B1D20] "
          >
            <p className="mt-[150px] text-white text-[16px]">{item.name}</p>
            {/* <div className="points-divide my-8"></div> */}
            <Tooltip
              classNames={{
                content:
                  "w-[300px] rounded-lg bg-[#151923] text-white px-4 py-5",
              }}
              content={<PointsPopoverContent data={item.earnedBy} />}
            >
              <p className="points-value">
                {formatNumberWithUnit(item.points)}
              </p>
            </Tooltip>
            <div className="flex justify-center">
              <Button
                className="btn-earn-more"
                onClick={() => handleTabChange(index)}
              >
                <img
                  src="/img/icon-wallet-white-2.svg"
                  alt=""
                  width={24}
                  height={24}
                />
                <span className="font-[900] text-[14px]">Earn More</span>
              </Button>
            </div>
          </NovaPointsBox>
        ))}
      </div>
      <div className="divide my-12"></div>
      <div className="mb-[18px] flex items-center justify-between">
        <Title>Your Project Points</Title>
        <div className="view-more" onClick={handleViewMore}>
          <span className="mr-2 text-[#FbFbFb]/[0.6]">{`Hide Points < 0.1`}</span>
          <Checkbox
            defaultSelected
            radius="none"
            isSelected={checked}
            onValueChange={setChecked}
          ></Checkbox>
        </div>
      </div>
      <List>
        <div className="list-content">
          {projectPointsList.map((item, index) => (
            <div className="row mb-[24px] flex items-center" key={index}>
              <div className="list-content-item flex col-2 items-center gap-[10px]">
                {item?.iconURL && (
                  <img
                    src={item?.iconURL}
                    alt=""
                    className="w-[55px] h-[56px] rounded-full block"
                  />
                )}
                <div>
                  <div className="symbol flex items-center">
                    <span className="mr-1">{item?.eigenlayerName}</span>
                  </div>
                </div>
              </div>
              <div className="col-line"></div>

              <div className="list-content-item flex col-3 flex items-center gap-[12px] text-center">
                <span className="text-gray">{item.pointsName}</span>
                <PointsBox>{formatNumberWithUnit(item?.pointsValue)}</PointsBox>
              </div>
              <div className="col-line"></div>

              <div className="list-content-item flex col-3 flex items-center gap-[12px] text-center">
                <span className="text-gray">
                  {item.eigenlayerName} Eigenlayer Points
                </span>
                <PointsBox>
                  {formatNumberWithUnit(item?.eigenlayerValue)}
                </PointsBox>
              </div>
              <div className="col-line"></div>

              <a
                className="list-content-item  flex col-2 justify-center items-center gap-[10px]"
                href={item.link}
                target="_blank"
              >
                <span className="particpate">Participate</span>
                <img src="img/icon-link-arrow.svg" alt="" />
              </a>
            </div>
          ))}
        </div>
      </List>
      <div className="divide my-12"></div>
      <div className="flex items-center justify-between mb-5">
        <Title>Your Nova NFT</Title>
      </div>
      <div className="flex gap-6">
        <SbtNft />
        <LynksNft />
      </div>
      <TrademarkNFT />
    </Container>
  );
}
