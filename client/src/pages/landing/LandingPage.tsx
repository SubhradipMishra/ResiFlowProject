import React from 'react';
import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import FeaturesSection from '../../components/FeaturesSection';
import HowItWorks from '../../components/HowItWorks';
import WhyChooseUs from '../../components/WhyChooseUs';
import InteractiveSimulator from '../../components/InteractiveSimulator';
import PricingSection from '../../components/PricingSection';
import FAQSection from '../../components/FAQSection';
import CallToAction from '../../components/CallToAction';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import Testimonials from '../../components/Testimonials';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const handleAction = () => {
        if (isAuthenticated) {
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-rose-100 selection:text-[#e11d48] overflow-x-hidden">
            <Navbar onOpenDemo={handleAction} onOpenPortal={handleAction} />
            <Hero onOpenDemo={handleAction} onOpenVideo={handleAction} />
            <FeaturesSection />
            <HowItWorks />
            <WhyChooseUs />
            <InteractiveSimulator />
            <PricingSection />
            <Testimonials />
            <FAQSection />
            <CallToAction onGetStarted={handleAction} onContactSales={handleAction} />
            <Footer />
        </div>
    );
};

export default LandingPage;
