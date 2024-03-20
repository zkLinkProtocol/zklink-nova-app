import "./index.css";
import { useEffect, useRef } from "react";
const Marquee = () => {
  const marqueeRef = useRef(null);
  useEffect(() => {
    const marqueeContainer = marqueeRef.current;
    const marqueeItems =
      marqueeContainer.getElementsByClassName("marquee-item");
    const marqueeWidth = marqueeItems[0].offsetWidth;

    let animationFrame;

    const animateMarquee = () => {
      marqueeContainer.style.transform = `translateX(-${marqueeWidth}px)`;
      for (let i = 0; i < marqueeItems.length; i++) {
        const item = marqueeItems[i];
        const itemPosition = item.getBoundingClientRect();
        const itemCenter = itemPosition.left + itemPosition.width / 2;
        const containerCenter =
          marqueeContainer.getBoundingClientRect().left + marqueeWidth / 2;
        const scale =
          1 +
          0.2 *
            Math.cos(((itemCenter - containerCenter) / marqueeWidth) * Math.PI);
        item.style.transform = `scale(${scale})`;
      }

      animationFrame = requestAnimationFrame(animateMarquee);
    };

    animateMarquee();

    setTimeout(() => {
      cancelAnimationFrame(animationFrame);
      marqueeContainer.style.transform = `translateX(0)`;
      for (let i = 0; i < marqueeItems.length; i++) {
        marqueeItems[i].style.transform = "scale(1)";
      }
    }, 6000);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);
  return (
    <div className="marquee-container">
      <div className="marquee" ref={marqueeRef}>
        {[4, 1, 2, 3, 4, 1].map((item) => (
          <div className="marquee-item" key={item}>
            <img src={`/img/img-trademark-temp-${item}.png`} alt="Image 1" />
          </div>
        ))}

        {/* Add more images here */}
      </div>
    </div>
  );
};

export default Marquee;
