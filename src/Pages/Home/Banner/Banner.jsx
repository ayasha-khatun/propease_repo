import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import banner1 from '../../../assets/banner1.jpg';
import banner2 from '../../../assets/banner2.jpg';
import banner3 from '../../../assets/banner3.jpg';

const banners = [
  {
    id: 1,
    image: banner1,
    title: 'Unlock Your New Address',
    subtitle: 'Discover verified properties tailored to your lifestyle..',
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
          <SwiperSlide key={banner.id} className='relative'>
            <div className="min-h-[80vh] opacity-80"
              style={{
                backgroundImage: `url(${banner.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                
              }}
            >
              <div className="flex flex-col justify-items-center items-center">
                  <h2 className="text-2xl md:text-4xl font-bold text-white">{banner.title}</h2>
                   <p className="text-white mt-2 text-sm md:text-base">{banner.subtitle}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerSlider;
