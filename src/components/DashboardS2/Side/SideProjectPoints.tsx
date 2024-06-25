import {
  getEigenlayerPoints,
  getMagPiePoints,
  getPufferPoints,
  getRenzoPoints,
  getRsethPoints,
} from "@/api";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import styled from "styled-components";
import { useAccount } from "wagmi";

const Container = styled.div`
  padding: 20px 0;
  border-bottom: 1px solid #999;

  .sub-title {
    padding: 20px 0;
    color: #fff;
    font-family: "Chakra Petch";
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px; /* 100% */
    letter-spacing: -0.5px;
  }

  .label {
    color: #999;
    font-family: "Chakra Petch";
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 22px; /* 91.667% */
    letter-spacing: -0.5px;
  }

  .value {
    color: #fff;
    text-align: right;
    font-family: "Chakra Petch";
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px; /* 100% */
    letter-spacing: 1.44px;
  }
`;

export interface ProjectPointsItem {
  icon: string;
  pointsName: string;
  pointsValue: number;
  eigenlayerName: string;
  eigenlayerValue: number;
  pointsTips?: string;
  eigenlayerTips?: string;
}

export default () => {
  const [isOpen, setIsOpen] = useState(false);
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

  const projectPointsList = useMemo(() => {
    const arr: ProjectPointsItem[] = [
      {
        icon: "/img/icon-puffer-points.png",
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
        icon: "/img/icon-ezPoints.png",
        pointsName: "ezPoints",
        eigenlayerName: "Renzo",
        pointsValue: renzoPoints,
        eigenlayerValue: renzoEigenLayerPoints,
        pointsTips:
          "Your ezPoints will be visible one hour after you deposit your ezETH.",
      },
      {
        icon: "/img/icon-eigenpie.png",
        pointsName: "EigenPie Points",
        eigenlayerName: "EigenPie",
        pointsValue: magpiePointsData.points,
        eigenlayerValue: magpiePointsData.layerPoints,
        pointsTips:
          "Your EngenPie Points will be visible one hour after you deposit your mxETH",
      },
      {
        icon: "/img/icon-kelp.png",
        pointsName: "Kelp Miles",
        eigenlayerName: "KelpDao",
        pointsValue: kelpMiles,
        eigenlayerValue: kelpEigenlayerPoints,
      },
      {
        icon: "/img/icon-bedrock.svg",
        pointsName: "Bedrock Diamonds",
        eigenlayerName: "Bedrock",
        pointsValue: bedrockPoints,
        eigenlayerValue: bedrockEigenlayerPoints,
      },
    ];

    return arr;
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
  ]);

  useEffect(() => {
    getPufferPointsFunc();
    getEigenlayerPointsFunc();
    getRenzoPointsFunc();
    getMagpiePointsFunc();
    getRsethPointsFunc();
    getBedrockPointsFunc();
  }, [address]);

  return (
    <Container>
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="sub-title">Your Project Points</span>
        {isOpen ? (
          <BsChevronUp className="text-[20px]" />
        ) : (
          <BsChevronDown className="text-[20px]" />
        )}
      </div>

      {isOpen && (
        <div>
          <div>
            {projectPointsList.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center">
                  <div className="label flex items-center gap-[8px]">
                    <img
                      src={item.icon}
                      alt=""
                      width={24}
                      height={24}
                      className="w-[24px] h-[24px] rounded-full"
                    />
                    <span>{item.pointsName}</span>
                  </div>
                  <div className="value">{item.pointsValue}</div>
                </div>
                <div className="mt-[8px] mb-[24px] ml-[32px] flex justify-between items-center">
                  <div className="label">{item.eigenlayerName}</div>
                  <div className="value">{item.eigenlayerValue}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
};
