import React from 'react';
import LandingHeader from './components/LandingHeader';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/HowItWorksSection';
import ReadyToStartSection from './components/ReadyToStartSection';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ReadyToStartSection />
      </main>
    </div>
  );
};

export default LandingPage;