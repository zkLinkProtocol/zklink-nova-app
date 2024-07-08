import "./index.scss";
import {
  useEffect,
  useRef,
  useState,
  ReactNode,
  forwardRef,
  useImperativeHandle,
} from "react";

const INITIAL_SPEED = 60;
const IMAGE_WIDTH = 120;

let timeout;
interface IProps {
  PrizeItems: { img: string; name: string }[];
  targetIndex?: number;
  onDrawEnd?: () => void;
}
type Ref = ReactNode | { start: (target: number) => void };
const Marquee = forwardRef<Ref, IProps>((props, ref) => {
  const { targetIndex, onDrawEnd, PrizeItems } = props;
  const [isOpening, setIsOpening] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const InitialTranslate = Math.floor(PrizeItems.length / 2) * IMAGE_WIDTH;
  const ActualPrizeItems = [
    PrizeItems[PrizeItems.length - 1],
    ...PrizeItems,
    PrizeItems[0],
  ];
  const PRIZE_SIZE = PrizeItems.length;

  const curRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => ({
    start: (targetImageIndex: number) => start(targetImageIndex),
  }));

  const start = async (targetIndex: number) => {
    return new Promise((resolve) => {
      // targetIndex  from 0
      let step = 0;
      let speed = 2;
      let lastTranslate = InitialTranslate;
      const Loops = 5;
      const totalTranslate =
        PRIZE_SIZE * Loops * IMAGE_WIDTH + targetIndex * IMAGE_WIDTH;
      const stopAnimation = () => {
        clearTimeout(timeout);
        setCurrentIndex(targetIndex);
        return resolve(undefined);
      };
      const startAnimation = () => {
        if (step >= totalTranslate) {
          marqueeRef.current.style.transition = "none";
          stopAnimation();
          onDrawEnd?.();
          return;
        }
        if (
          step >
          PRIZE_SIZE * (Loops - 1) * IMAGE_WIDTH + targetIndex * IMAGE_WIDTH
        ) {
          speed++;
        }
        setCurrentIndex((step * IMAGE_WIDTH) % PRIZE_SIZE);
        step += IMAGE_WIDTH;
        const translateStep = (step / IMAGE_WIDTH) % PrizeItems.length;
        let translate = 0;
        if (translateStep === 0) {
          translate = InitialTranslate;
          marqueeRef.current.style.transition = "none";
        } else {
          translate = lastTranslate - IMAGE_WIDTH;
          marqueeRef.current.style.transition = "transform 0.1s linear";
        }
        lastTranslate = translate;

        marqueeRef.current.style.transform = `translateX(${translate}px)`;

        timeout = setTimeout(startAnimation, speed * 100);
      };
      startAnimation();
    });
  };

  useEffect(() => {
    if (marqueeRef.current) {
      marqueeRef.current.style.transform = `translateX(${
        Math.floor(PrizeItems.length / 2) * IMAGE_WIDTH
      }px)`;
    }
  }, []);

  return (
    <div className="marquee-container" ref={curRef}>
      <div className="marquee" ref={marqueeRef}>
        {ActualPrizeItems.map((item, index) => (
          <div
            key={index}
            className={`marquee-item ${index === currentIndex ? "active" : ""}`}
          >
            <img src={item.img} />
          </div>
        ))}

        {/* Add more images here */}
      </div>
    </div>
  );
});

export default Marquee;
