import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import banner2 from '../../../assets/banner.png';
import banner3 from '../../../assets/banner2.png';
import banner from '../../../assets/banner3.png';

const banners = [
  {
    id: 1,
    image: banner,
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
    <section className="w-full pb-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="mySwiper rounded-3xl shadow-xl"
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <div
                className="relative flex flex-col items-center justify-center text-center min-h-[80vh] rounded-3xl overflow-hidden"
                style={{
                  backgroundImage: `url(${banner.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 dark:from-black/80 dark:via-black/60 dark:to-black/90 rounded-3xl z-10"></div>

                {/* Hero Content */}
                <div className="relative z-20 max-w-2xl px-6 text-white">
                  <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
                    {banner.title}
                  </h1>
                  <p className="text-gray-100 text-base md:text-xl mb-6 drop-shadow-[0_3px_8px_rgba(0,0,0,0.8)]">
                    {banner.subtitle}
                  </p>
                  <div className="flex justify-center gap-4">
                    <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-full hover:from-purple-600 hover:to-indigo-500 transition duration-300 shadow-lg">
                      Explore Now
                    </button>
                    
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default BannerSlider;
