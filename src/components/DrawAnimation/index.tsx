import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  ReactNode,
} from "react";
import "./index.css";

const Loops = 4;
let timeout: string | number | NodeJS.Timeout | undefined;
type Ref = ReactNode | { start: (target: number) => void };
interface IProps {
  type: "Trademark" | "MysteryBox";
  targetImageIndex?: number;
  onDrawEnd: () => void;
}
const LotteryAnimation = React.forwardRef<Ref, IProps>((props, ref) => {
  const { targetImageIndex, onDrawEnd, type } = props;
  const curRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => ({
    start: (targetImageIndex: number) => start(targetImageIndex),
  }));
  const [currentImageIndex, setCurrentImageIndex] = useState<number>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const start = (targetImageIndex: number) => {
    if (!targetImageIndex) return;

    let step = 0;
    let speed = 2;
    const count = type === "Trademark" ? 6 : 8;
    const totalSteps = count * Loops + targetImageIndex; // run four loops and end on target
    const stopAnimation = () => {
      clearTimeout(timeout);
      setCurrentImageIndex(targetImageIndex);
    };
    const startAnimation = () => {
      if (step >= totalSteps) {
        stopAnimation();
        onDrawEnd();
        return;
      }
      if (step > count * (Loops - 1) + targetImageIndex) {
        speed++;
      }
      setCurrentImageIndex(step % count);
      step++;
      timeout = setTimeout(startAnimation, speed * 120);
    };

    startAnimation();
  };

  useEffect(() => {
    if (targetImageIndex) {
      setCurrentImageIndex(targetImageIndex);
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
          {[1, 2, 3, 5, 4].map((item) => (
            <div
              key={item}
              className={`lottery-item ${
                currentImageIndex === item - 1 ? "active" : ""
              }`}
            >
              <img src={`/img/img-trademark-temp-${item}.png`} alt="Image 1" />
            </div>
          ))}
        </>
      )}
      {type === "MysteryBox" && (
        <>
          {[1, 2, 3, 4, 8, 7, 6, 5].map((item) => (
            <div
              key={item}
              className={`lottery-item ${
                currentImageIndex === item - 1 ? "active" : ""
              }`}
            >
              <img src={`/img/img-point-booster-${item}.png`} alt="Image 1" />
            </div>
          ))}
        </>
      )}
    </div>
  );
});

export default LotteryAnimation;
