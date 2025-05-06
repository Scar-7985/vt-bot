// HeroBannerSlider.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';

const HeroBanner = () => {
  const images = [
    "assets/img/Banner_1.png",
    "assets/img/Banner_2.png",
    "assets/img/Banner_3.png"
  ];

  return (
    <div className="w-full mt-5" d='appCapsule'>
      
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3000 }}
        loop={true}
        spaceBetween={0}
        slidesPerView={1}
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <img src={src} alt={`Banner ${index + 1}`} className="img-fluid" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroBanner;