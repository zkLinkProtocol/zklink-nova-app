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

let timeout: string | number | NodeJS.Timeout | undefined;
type Ref = ReactNode | { start: (target: number) => void };
interface IProps {
  type: "Trademark" | "MysteryBox" | "OldestFriends";
  targetImageIndex?: number;
  onDrawEnd: () => void;
  sbtNFT?: NOVA_NFT;
}

const OldestFriendsItems = [
  { name: "Oak Tree Roots", img: "img-trademark-1.png" },
  { name: "Magnifying Glass", img: "img-trademark-2.png" },
  { name: "Chess Knight", img: "img-trademark-3.png" },
  { name: "Binary Code Metrix Cube", img: "img-trademark-4.png" },
  { name: "+50 Nova points", img: "img-trademark-9.png" },
  { name: "+100 Nova points", img: "img-trademark-10.png" },
  { name: "Lynks", img: "img-trademark-lynks.png" },
];

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
      const Loops = 2;
      const count = OldestFriendsItems.length;
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
      {OldestFriendsItems.map((item, index) => (
        <div
          key={item.name}
          className={`lottery-item ${
            currentImageIndex === index ? "active" : ""
          }`}
        >
          <div className="img-bg">
            <img
              src={index === 6 ? lynksNFTImg : `/img/${item.img}`}
              alt="Image 1"
            />
          </div>
          <div className="item-name">{item.name}</div>
        </div>
      ))}
    </div>
  );
});

export default LotteryAnimation;
