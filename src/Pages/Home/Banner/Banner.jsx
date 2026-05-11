import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, TrendingUp, Shield, ChevronDown } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import banner2 from '../../../assets/banner.png';
import banner3 from '../../../assets/banner2.png';
import banner from '../../../assets/banner3.png';

const banners = [
  {
    id: 1,
    image: banner,
    tag: 'Find Your Dream Home',
    title: 'Unlock Your',
    highlight: 'New Address',
    subtitle: 'Discover verified properties tailored to your lifestyle and budget.',
  },
  {
    id: 2,
    image: banner2,
    tag: 'For Real Estate Agents',
    title: 'Boost Sales with',
    highlight: 'Smart Tools',
    subtitle: 'List properties, track offers, and grow your real estate business.',
  },
  {
    id: 3,
    image: banner3,
    tag: 'Admin Dashboard',
    title: 'Full Platform',
    highlight: 'Control',
    subtitle: 'Manage listings, users, and reports with complete authority.',
  },
];

const stats = [
  { value: '12K+', label: 'Properties Listed' },
  { value: '8K+', label: 'Happy Clients' },
  { value: '98%', label: 'Verified Listings' },
  { value: '150+', label: 'Expert Agents' },
];

const useCounter = (target, duration = 2000) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const num = parseInt(target.replace(/\D/g, ''));
    const suffix = target.replace(/[0-9]/g, '');
    let start = 0;
    const step = num / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= num) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start) + suffix);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
};

const StatItem = ({ value, label }) => {
  const count = useCounter(value);
  return (
    <div className="text-center">
      <div className="text-xl md:text-2xl font-extrabold text-white">{count}</div>
      <div className="text-xs text-white/65 mt-0.5">{label}</div>
    </div>
  );
};

const BannerSlider = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/all-properties?search=${encodeURIComponent(searchQuery)}`);
  };

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <section className="relative w-full">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="w-full"
        style={{
          '--swiper-pagination-color': '#fff',
          '--swiper-pagination-bullet-inactive-color': 'rgba(255,255,255,0.4)',
          '--swiper-pagination-bullet-inactive-opacity': '1',
          '--swiper-pagination-bullet-size': '8px',
          '--swiper-pagination-bottom': '12px',
        }}
      >
        {banners.map((item, index) => (
          <SwiperSlide key={item.id}>
            <div
              className="relative flex flex-col min-h-screen overflow-hidden"
              style={{
                backgroundImage: `url(${item.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80 z-10" />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-secondary/10 z-10" />

              {/* Main content — vertically centered, takes up most space */}
              <div className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-6 pt-20 pb-6">

                {/* Tag badge */}
                <div
                  className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-5 transition-all duration-700 ${
                    activeIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  {item.tag}
                </div>

                {/* Title */}
                <h1
                  className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-white mb-4 transition-all duration-700 delay-100 ${
                    activeIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                >
                  {item.title}{' '}
                  <span className="relative inline-block">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                      {item.highlight}
                    </span>
                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                      <path d="M2 10 Q150 2 298 10" stroke="url(#grad1)" strokeWidth="3" strokeLinecap="round" />
                      <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                </h1>

                {/* Subtitle */}
                <p
                  className={`text-white/75 text-base md:text-lg max-w-xl mb-8 leading-relaxed transition-all duration-700 delay-200 ${
                    activeIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                >
                  {item.subtitle}
                </p>

                {/* Search bar */}
                <form
                  onSubmit={handleSearch}
                  className={`w-full max-w-2xl transition-all duration-700 delay-300 ${
                    activeIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                >
                  <div className="flex items-center bg-white rounded-2xl shadow-2xl shadow-black/40 overflow-hidden p-1.5 gap-2">
                    <div className="flex items-center gap-2 flex-1 px-3">
                      <MapPin size={18} className="text-primary shrink-0" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by location, city or area..."
                        className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 text-sm outline-none py-2"
                      />
                    </div>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm hover:opacity-90 transition-all duration-200 shrink-0"
                    >
                      <Search size={16} />
                      <span className="hidden sm:inline">Search</span>
                    </button>
                  </div>
                </form>

                {/* Quick filter tags */}
                <div
                  className={`flex flex-wrap justify-center gap-2 mt-4 transition-all duration-700 delay-[400ms] ${
                    activeIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  {['Apartment', 'Villa', 'Office', 'Land'].map((type) => (
                    <button
                      key={type}
                      onClick={() => navigate(`/all-properties?search=${type}`)}
                      className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white/85 text-xs font-medium backdrop-blur-sm transition-all duration-200"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats bar — pinned to bottom, inside flow */}
              <div className="relative z-20 w-full px-6 pb-10">
                <div className="max-w-3xl mx-auto">
                  <div className="grid grid-cols-4 gap-2 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-4">
                    {stats.map((stat, i) => (
                      <div key={i} className="relative">
                        <StatItem value={stat.value} label={stat.label} />
                        {i < stats.length - 1 && (
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-7 bg-white/20" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Scroll down indicator */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-0.5 text-white/40 hover:text-white/70 transition-colors duration-200 animate-bounce"
        aria-label="Scroll down"
      >
        <ChevronDown size={18} />
      </button>

      {/* Trust badges — bottom right */}
      <div className="absolute bottom-3 right-4 z-30 hidden sm:flex items-center gap-4 pointer-events-none">
        <div className="flex items-center gap-1.5 text-white/50 text-xs">
          <Shield size={11} />
          <span>Verified Listings</span>
        </div>
        <div className="flex items-center gap-1.5 text-white/50 text-xs">
          <TrendingUp size={11} />
          <span>Best Market Prices</span>
        </div>
      </div>
    </section>
  );
};

export default BannerSlider;
