// export default () => (
//   <div className="relative mb-4 z-[10]">
//     <img src="/img/banner2.gif" className="w-full md:block hidden" />
//     <img src="/img/banner-mobile.gif" className="w-full block md:hidden" />
//   </div>
// );

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay } from "swiper/modules";

export default function Banner() {
  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      navigation={false}
      modules={[Autoplay]}
      className="relative mb-4 z-[10]"
    >
      <SwiperSlide>
        <div>
          <img src="/img/banner2.gif" className="w-full md:block hidden" />
          <img
            src="/img/banner-mobile.gif"
            className="w-full block md:hidden"
          />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <a
          href="https://www.binance.com/en/activity/mission/zklink-nova-airdrop"
          target="_blank"
        >
          <img
            src="/img/banner-binance-zkl@2x.png"
            className="w-full md:block hidden"
          />
          <img
            src="/img/banner-binance-zkl-mobile.png"
            className="w-full block md:hidden"
          />
        </a>
      </SwiperSlide>
    </Swiper>
  );
}
