import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/registration-screen');
  };

  const handleLearnMore = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Track Bills & Income
              <span className="text-primary block">in One Place</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl">
              Easy Bill Tracker helps you manage both your bills and income in one simple dashboard. Never miss a payment and always know your financial status.
            </p>
            
            {/* Key Benefits */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
              <div className="flex items-center bg-white/80 rounded-full px-4 py-2 shadow-sm">
                <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                <span className="text-sm font-medium text-foreground">Track Bills & Income</span>
              </div>
              <div className="flex items-center bg-white/80 rounded-full px-4 py-2 shadow-sm">
                <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                <span className="text-sm font-medium text-foreground">Recurring Bills</span>
              </div>
              <div className="flex items-center bg-white/80 rounded-full px-4 py-2 shadow-sm">
                <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
                <span className="text-sm font-medium text-foreground">Payment Tracking</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                variant="default"
                size="lg"
                onClick={handleGetStarted}
                iconName="ArrowRight"
                iconPosition="right"
                className="text-lg px-8 py-3"
              >
                Start Tracking Your Finances
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleLearnMore}
                iconName="Play"
                iconPosition="left"
                className="text-lg px-8 py-3"
              >
                See How It Works
              </Button>
            </div>


          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 lg:p-8">
              <Image
                src="/assets/images/bill-tracker-screenshots-3.png"
                alt="Easy Bill Tracker Dashboard Preview"
                className="w-full h-auto rounded-lg"
              />
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-success text-white rounded-full p-3 shadow-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;