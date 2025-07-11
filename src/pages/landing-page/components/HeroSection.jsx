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
              Take Control of Your
              <span className="text-primary block">Monthly Bills</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl">
              Never miss a payment again. BillTracker Pro helps you organize, track, and manage all your monthly bills in one secure, easy-to-use platform.
            </p>
            
            {/* Key Benefits */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
              <div className="flex items-center bg-white/80 rounded-full px-4 py-2 shadow-sm">
                <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                <span className="text-sm font-medium text-foreground">Never Miss Payments</span>
              </div>
              <div className="flex items-center bg-white/80 rounded-full px-4 py-2 shadow-sm">
                <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                <span className="text-sm font-medium text-foreground">Track All Bills</span>
              </div>
              <div className="flex items-center bg-white/80 rounded-full px-4 py-2 shadow-sm">
                <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
                <span className="text-sm font-medium text-foreground">Budget Better</span>
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
                Start Organizing Your Bills Today
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

            {/* Trust Indicators */}
            <div className="mt-8 pt-8 border-t border-border/50">
              <p className="text-sm text-muted-foreground mb-4">Trusted by thousands of users</p>
              <div className="flex items-center justify-center lg:justify-start gap-6">
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-green-600 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 border-2 border-white"></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-foreground">5,000+ Active Users</span>
                </div>
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-sm font-medium text-foreground">4.9/5 Rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 lg:p-8">
              <Image
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="BillTracker Pro Dashboard Preview"
                className="w-full h-auto rounded-lg"
              />
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-success text-white rounded-full p-3 shadow-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-primary text-white rounded-lg p-3 shadow-lg">
                <div className="text-xs font-medium">Bills Organized</div>
                <div className="text-lg font-bold">$2,450</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;