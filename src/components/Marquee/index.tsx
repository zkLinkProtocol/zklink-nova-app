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
const HALF_WIDTH = IMAGE_WIDTH / 2;
const PrizeItems = [
  {
    name: "Nova +50 Booster",
    img: "/img/img-point-booster-v2-1.png",
    tooltipId: 50,
  },
  {
    name: "Nova +100 Booster",
    img: "/img/img-point-booster-v2-2.png",
    tooltipId: 100,
  },
  {
    name: "Nova +200 Booster",
    img: "/img/img-point-booster-v2-3.png",
    tooltipId: 200,
  },
  { name: "Binary Code Metrix Cube", img: "/img/img-trademark-4.png" },
  { name: "Chess Knight", img: "/img/img-trademark-3.png" },
  { name: "Magnifying Glass", img: "/img/img-trademark-2.png" },
  { name: "Oak Tree Roots", img: "/img/img-trademark-1.png" },
];
const InitialTranslate = Math.floor(PrizeItems.length / 2) * IMAGE_WIDTH;
const ActualPrizeItems = [
  PrizeItems[PrizeItems.length - 1],
  ...PrizeItems,
  PrizeItems[0],
];
const PRIZE_SIZE = PrizeItems.length;
let timeout;
interface IProps {
  targetIndex?: number;
  onDrawEnd?: () => void;
}
type Ref = ReactNode | { start: (target: number) => void };
const Marquee = forwardRef<Ref, IProps>((props, ref) => {
  const { targetIndex, onDrawEnd } = props;
  const [isOpening, setIsOpening] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(null);

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
        } else {
          translate = lastTranslate - IMAGE_WIDTH;
        }
        lastTranslate = translate;

        marqueeRef.current.style.transform = `translateX(${translate}px)`;
        timeout = setTimeout(startAnimation, speed * 100);
      };
      startAnimation();
    });
  };

  const handleOpenCase = () => {
    start(6);
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
      <div className="flex items-center gap-5">
        <button onClick={handleOpenCase}>Start</button>
        <button onClick={() => setIsOpening(false)}>Stop</button>
      </div>
    </div>
  );
});

export default Marquee;
