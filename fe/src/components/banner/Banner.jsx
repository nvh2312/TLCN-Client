import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { bannerData } from "../../api/bannerData";
import { Navigation, Pagination, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

const Banner = () => {
  return (
    <div className="mt-5 md:mt-7 lg:mt-10 px-[8px] md:px-[20px]">
      <div className="container max-w-[100vw]">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={1}
          navigation
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="w-full rounded-lg"
        >
          {bannerData.length > 0 &&
            bannerData.map((item) => (
              <SwiperSlide key={item.id}>
                <img
                  src={item.img}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Banner;
