import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  ReactNode,
  useMemo,
} from "react";
import "./index.css";
import useSBTNFT, { NOVA_NFT } from "@/hooks/useNFT";
import PointsRewardsTooltips from "../Dashboard/PointsRewardsTooltips";
import styled from "styled-components";

let timeout: string | number | NodeJS.Timeout | undefined;
type Ref = ReactNode | { start: (target: number) => void };
interface IProps {
  type: "Trademark" | "MysteryBox" | "OldestFriends";
  targetImageIndex?: number;
  onDrawEnd: () => void;
  sbtNFT?: NOVA_NFT;
}
const TrademarkItems = [
  { name: "+10 Nova points", img: "/img/s2-points-10.png", tooltipId: 10 },
  { name: "+50 Nova points", img: "/img/s2-points-50.png", tooltipId: 50 },
];

const MysteryboxItems = [
  { name: "Nova x3 Booster", img: "/img/img-point-booster-1.png" },
  { name: "Nova x4 Booster", img: "/img/img-point-booster-2.png" },
  { name: "Nova +100 Booster", img: "/img/img-point-booster-3.png" },
  { name: "Nova +300 Booster", img: "/img/img-point-booster-4.png" },
  { name: "Nova +500 Booster", img: "/img/img-point-booster-5.png" },
  { name: "Nova +1000 Booster", img: "/img/img-point-booster-6.png" },
  { name: "Nova +2000 Booster", img: "/img/img-point-booster-7.png" },
  { name: "Lynks", img: "" },
];

const S2PointsCard = styled.div`
  position: relative;
  border-radius: 32px 32px 0 0;
  border: 2px solid #635f5f;
  background: #151923;
  overflow: hidden;

  .card-shadow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 381px;
    width: 381px;
    height: 381px;
    display: block;
  }

  .img-bg {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 35px 40px 28px;
    /* width: 120px; */
    /* height: 120px; */
    height: auto;
    background: #151923;
  }
  .item-name {
    width: 100%;
    background: #1b1d20;
    z-index: 1;
    color: #fff;
    font-family: Satoshi;
    font-size: 16.452px;
    font-style: normal;
    font-weight: 400;
    line-height: 18.802px; /* 114.286% */
    letter-spacing: -0.082px;
  }
`;

const LotteryAnimation = React.forwardRef<Ref, IProps>((props, ref) => {
  const { targetImageIndex, onDrawEnd, type, sbtNFT } = props;
  const curRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => ({
    start: (targetImageIndex: number) => start(targetImageIndex),
  }));
  const [currentImageIndex, setCurrentImageIndex] = useState<number>();

  const lynksNFTImg = useMemo(() => {
    if (sbtNFT) {
      return `/img/img-mystery-box-lynks-${sbtNFT.name}.png`;
    } else {
      return `/img/img-mystery-box-lynks-ENTP.png`;
    }
  }, [sbtNFT]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const start = async (targetImageIndex: number) => {
    return new Promise((resolve) => {
      if (targetImageIndex < 0) return;

      let step = 0;
      let speed = 2;
      const Loops = type === "Trademark" ? 2 : 2;
      const count = type === "Trademark" ? 2 : 8;
      const totalSteps = count * Loops + targetImageIndex; // run four loops and end on target
      const stopAnimation = () => {
        clearTimeout(timeout);
        setCurrentImageIndex(targetImageIndex);
      };
      const startAnimation = () => {
        if (step >= totalSteps) {
          stopAnimation();
          onDrawEnd();
          return resolve(undefined);
        }
        if (step > count * (Loops - 1) + targetImageIndex) {
          speed++;
        }
        setCurrentImageIndex(step % count);
        step++;
        timeout = setTimeout(
          startAnimation,
          speed * (type === "MysteryBox" ? 80 : 100)
        );
      };

      startAnimation();
    });
  };

  useEffect(() => {
    console.log("targetImageIndex", targetImageIndex);

    if (targetImageIndex !== undefined) {
      setCurrentImageIndex(targetImageIndex);
    } else {
      setCurrentImageIndex(undefined);
    }
    // return () => {
    //   onDrawEnd();
    //   clearTimeout(timeout);
    // };
  }, [targetImageIndex]);

  return (
    <div className={`lottery-container lottery-container-${type}`} ref={curRef}>
      {type === "Trademark" && (
        <>
          {TrademarkItems.map((item, index) => (
            <S2PointsCard
              key={item.name}
              className={`lottery-item ${
                currentImageIndex === index ? "active" : ""
              }`}
              data-tooltip-id={
                item?.tooltipId ? `points-rewards-tips-${item.tooltipId}` : ""
              }
            >
              <img
                src="/img/s2-points-shadow.png"
                alt=""
                className="card-shadow"
              />
              <div className="img-bg">
                <img
                  className="min-w-[120px] min-h-[120px]"
                  src={index === 8 ? lynksNFTImg : `${item.img}`}
                  alt="Image 1"
                />
              </div>
              <div
                className={`item-name ${
                  item?.tooltipId ? "flex items-center gap-1" : ""
                }`}
              >
                <span>{item.name}</span>
                {item?.tooltipId && (
                  <img src="/img/icon-info.svg" className="info" />
                )}
              </div>
            </S2PointsCard>
          ))}
        </>
      )}
      {type === "MysteryBox" && (
        <>
          {MysteryboxItems.map((item, index) => (
            <div
              key={item.name}
              className={`lottery-item ${
                currentImageIndex === index ? "active" : ""
              }`}
            >
              <div className="img-bg">
                <img src={index === 7 ? lynksNFTImg : item.img} alt="Image 1" />
              </div>
              <div className="item-name">{item.name}</div>
            </div>
          ))}
        </>
      )}

      <PointsRewardsTooltips />
    </div>
  );
});

export default LotteryAnimation;
