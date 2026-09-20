import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Pillars } from './components/Pillars';
import { AboutSection } from './components/AboutSection';
import { FeaturesSection } from './components/FeaturesSection';
import { InteractiveSimulator } from './components/InteractiveSimulator';
import { WhyChooseUs } from './components/WhyChooseUs';
import { HowItWorks } from './components/HowItWorks';
import { Testimonials } from './components/Testimonials';
import { PricingSection } from './components/PricingSection';
import { FAQSection } from './components/FAQSection';
import { CallToAction } from './components/CallToAction';
import { Footer } from './components/Footer';

// Components & Cursor
import { SpotlightCursor } from './components/SpotlightCursor';

// Modals
import { DemoModal } from './components/Modals/DemoModal';
import { PaymentModal } from './components/Modals/PaymentModal';
import { ResidentPortalModal } from './components/Modals/ResidentPortalModal';

export const App: React.FC = () => {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [portalModalOpen, setPortalModalOpen] = useState(false);
  const [selectedPlanForDemo, setSelectedPlanForDemo] = useState<string | undefined>(undefined);

  const handleOpenDemoWithPlan = (planName: string, price: string) => {
    setSelectedPlanForDemo(`${planName} (${price})`);
    setDemoModalOpen(true);
  };

  const handleOpenGeneralDemo = () => {
    setSelectedPlanForDemo(undefined);
    setDemoModalOpen(true);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col selection:bg-brand-500 selection:text-white font-sans relative">
      {/* Interactive Spotlight Cursor */}
      <SpotlightCursor />

      {/* Navigation */}
      <Navbar
        onOpenDemo={handleOpenGeneralDemo}
        onOpenPortal={() => setPortalModalOpen(true)}
      />

      {/* Hero Section */}
      <Hero
        onOpenDemo={handleOpenGeneralDemo}
        onOpenVideo={() => scrollToSection('simulator')}
      />

      {/* 5 Quick Access Pillars */}
      <Pillars
        onSelectPillar={(id) => {
          if (id === 'billing') {
            setPaymentModalOpen(true);
          } else {
            scrollToSection('features');
          }
        }}
      />

      {/* About Section with Live Resident Status Card */}
      <AboutSection
        onPayNow={() => setPaymentModalOpen(true)}
        onOpenDemo={handleOpenGeneralDemo}
      />

      {/* 6 Core Feature Grid */}
      <FeaturesSection
        onSelectFeature={() => scrollToSection('simulator')}
        onExploreAll={() => scrollToSection('simulator')}
      />

      {/* Interactive Simulator Playground */}
      <InteractiveSimulator />

      {/* Why Choose Us & Story Experience */}
      <WhyChooseUs onLearnMore={handleOpenGeneralDemo} />

      {/* How It Works with Animated Curly Road Route */}
      <HowItWorks />

      {/* Testimonials with Infinite Marquee */}
      <Testimonials />

      {/* Pricing Plans */}
      <PricingSection onSelectPlan={handleOpenDemoWithPlan} />

      {/* FAQ Section */}
      <FAQSection />

      {/* Call to Action Banner */}
      <CallToAction
        onGetStarted={handleOpenGeneralDemo}
        onContactSales={handleOpenGeneralDemo}
      />

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <DemoModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        defaultPlan={selectedPlanForDemo}
      />

      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
      />

      <ResidentPortalModal
        isOpen={portalModalOpen}
        onClose={() => setPortalModalOpen(false)}
      />
    </div>
  );
};

export default App;
