// import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./styles.css";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";

export default function swapperAds() {
  return (
    <>
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
        className="mySwiper"
      >
        <SwiperSlide>
          <a
            href="https://www.okx.com/web3/discover/cryptopedia/event/28"
            target="_blank"
          >
            <img
              src="/img/banner-okx.png"
              className="hidden md:block w-full h-auto block"
            />

            <img
              src="/img/banner-okx-mobile.png"
              className="block md:hidden w-full h-auto block"
            />
          </a>
        </SwiperSlide>
        <SwiperSlide>
          <a href="https://zklink.io/merge" target="_blank">
            <img
              src="/img/banner-merge-token.png"
              className="hidden md:block w-full h-auto block"
            />
            <img
              src="/img/banner-merge-token-mobile.png"
              className="block md:hidden  w-full h-auto block"
            />
          </a>
        </SwiperSlide>
      </Swiper>
    </>
  );
}
