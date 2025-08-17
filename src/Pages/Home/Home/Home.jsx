import React from 'react';
import Banner from '../Banner/Banner';
import AdvertisementSection from '../Advertisement/AdvertisementSection';
import LatestReviews from '../LatestReviews/LatestReviews';
import WhyChooseUs from '../WhyChooseUs/WhyChooseUs';
import FeaturedAgents from '../FeaturedAgents/CustomerTestimonials';
import CustomerTestimonials from '../FeaturedAgents/CustomerTestimonials';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <AdvertisementSection></AdvertisementSection>
            <LatestReviews></LatestReviews>
            <WhyChooseUs></WhyChooseUs>
            <CustomerTestimonials></CustomerTestimonials>
        </div>
    );
};

export default Home;