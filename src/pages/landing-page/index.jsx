import React from 'react';
import LandingHeader from './components/LandingHeader';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/HowItWorksSection';
import LandingFooter from './components/LandingFooter';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
      </main>
      
      <LandingFooter />
    </div>
  );
};

export default LandingPage;