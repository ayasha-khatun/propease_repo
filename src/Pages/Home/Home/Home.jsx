import React from 'react';
import Banner from '../Banner/Banner';
import AdvertisementSection from '../Advertisement/AdvertisementSection';
import LatestReviews from '../LatestReviews/LatestReviews';
import WhyChooseUs from '../WhyChooseUs/WhyChooseUs';
import FeaturedAgents from '../FeaturedAgents/CustomerTestimonials';
import CustomerTestimonials from '../FeaturedAgents/CustomerTestimonials';
import OurPartnersSection from '../OurPartnersSection/OurPartnersSection';
import AboutUsSection from '../AboutUsSection/AboutUsSection';
import FAQSection from '../FAQSection/FAQSection';

const Home = () => {
    return (
        <div className='mt-10'>
            <Banner></Banner>
            <AdvertisementSection></AdvertisementSection>
            <AboutUsSection></AboutUsSection>
            <OurPartnersSection></OurPartnersSection>
            <WhyChooseUs></WhyChooseUs>
            <LatestReviews></LatestReviews>
            <CustomerTestimonials></CustomerTestimonials>
            <FAQSection></FAQSection>
        </div>
    );
};

export default Home;