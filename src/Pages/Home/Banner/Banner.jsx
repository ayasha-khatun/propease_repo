import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import banner1 from '../../../assets/banner1.jpg';
import banner2 from '../../../assets/banner2.jpg';
import banner3 from '../../../assets/banner3.jpg';

const banners = [
  {
    id: 1,
    image: banner1,
    title: 'Unlock Your New Address',
    subtitle: 'Discover verified properties tailored to your lifestyle.',
  },
  {
    id: 2,
    image: banner2,
    title: 'Boost Sales with Smart Tools',
    subtitle: 'List properties, track offers, and grow your real estate business.',
  },
  {
    id: 3,
    image: banner3,
    title: 'Power Up Platform Control',
    subtitle: 'Manage listings, users, and reports with full authority.',
  },
];

const BannerSlider = () => {
  return (
    <div className="w-full rounded-xl overflow-hidden mb-10">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        className="mySwiper"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id} className="relative">
            <div
              className="min-h-[80vh] w-full flex flex-col justify-center items-center text-center relative"
              style={{
                backgroundImage: `url(${banner.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 z-10"></div>

              {/* Text Content */}
              <div className="relative z-20 px-4">
                <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
                  {banner.title}
                </h2>
                <p className="text-white mt-3 text-sm md:text-lg drop-shadow-md">
                  {banner.subtitle}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerSlider;
