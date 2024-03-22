import React, { useState, useEffect } from "react";
import "./index.css";

const Loops = 4;
const LotteryAnimation = ({
  targetImageIndex,
}: {
  targetImageIndex: number;
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>();

  useEffect(() => {
    let timeout: string | number | NodeJS.Timeout | undefined;
    let step = 0;
    let speed = 2;
    const totalSteps = 6 * Loops + targetImageIndex; // run four loops and end on target
    const stopAnimation = () => {
      clearTimeout(timeout);
      setCurrentImageIndex(targetImageIndex);
    };
    const startAnimation = () => {
      if (step >= totalSteps) {
        stopAnimation();
        return;
      }
      if (step > 6 * (Loops - 1) + targetImageIndex) {
        speed++;
      }
      setCurrentImageIndex(step % 6);
      step++;
      timeout = setTimeout(startAnimation, speed * 140);
    };

    startAnimation();

    return () => {
      clearTimeout(timeout);
    };
  }, [targetImageIndex]);

  return (
    <div className="lottery-container">
      <div
        className={`lottery-item ${currentImageIndex === 0 ? "active" : ""}`}
      >
        <img src={`/img/img-trademark-temp-1.png`} alt="Image 1" />
      </div>

      <div
        className={`lottery-item ${currentImageIndex === 1 ? "active" : ""}`}
      >
        <img src={`/img/img-trademark-temp-2.png`} alt="Image 1" />
      </div>
      <div
        className={`lottery-item ${currentImageIndex === 2 ? "active" : ""}`}
      >
        <img src={`/img/img-trademark-temp-3.png`} alt="Image 1" />
      </div>

      <div
        className={`lottery-item ${currentImageIndex === 4 ? "active" : ""}`}
      >
        <img src={`/img/img-trademark-temp-5.png`} alt="Image 1" />
      </div>
      <div
        className={`lottery-item ${currentImageIndex === 3 ? "active" : ""}`}
      >
        <img src={`/img/img-trademark-temp-4.png`} alt="Image 1" />
      </div>
    </div>
  );
};

export default LotteryAnimation;
