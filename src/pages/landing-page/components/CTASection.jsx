import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const CTASection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/registration-screen');
  };

  const handleLogin = () => {
    navigate('/login-screen');
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-primary to-accent">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center">
          {/* Main CTA Content */}
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              Start Tracking Your Finances
              <span className="block">in One Simple Place</span>
            </h2>
            <p className="text-lg lg:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join users who have simplified their financial tracking. Manage bills and income together, and never miss a payment again.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                variant="secondary"
                size="lg"
                onClick={handleGetStarted}
                iconName="ArrowRight"
                iconPosition="right"
                className="text-lg px-8 py-4 bg-white text-primary hover:bg-gray-50"
              >
                Get Started Free
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleLogin}
                iconName="LogIn"
                iconPosition="left"
                className="text-lg px-8 py-4 border-white text-white hover:bg-white/10"
              >
                Sign In
              </Button>
            </div>

            {/* Value Props */}
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-center text-white/90">
                <Icon name="CheckCircle" size={20} className="mr-2 text-white" />
                <span className="text-sm font-medium">Free to Start</span>
              </div>
              <div className="flex items-center justify-center text-white/90">
                <Icon name="Shield" size={20} className="mr-2 text-white" />
                <span className="text-sm font-medium">Secure & Private</span>
              </div>
              <div className="flex items-center justify-center text-white/90">
                <Icon name="Smartphone" size={20} className="mr-2 text-white" />
                <span className="text-sm font-medium">Works Everywhere</span>
              </div>
            </div>
          </div>

          {/* Feature Highlights with Screenshot */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 lg:p-12 max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Screenshot */}
              <div className="order-2 lg:order-1">
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                  <Image
                    src="/assets/images/bill-tracker-screenshots-4.png"
                    alt="Easy Bill Tracker Financial Summary"
                    className="w-full h-auto"
                  />
                </div>
              </div>
              
              {/* Features */}
              <div className="order-1 lg:order-2">
                <h3 className="text-2xl font-bold text-white mb-8">
                  What You'll Get With Easy Bill Tracker
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
                      <Icon name="Receipt" size={28} className="text-white" />
                    </div>
                    <h4 className="font-semibold text-white mb-2">Bill & Income Tracking</h4>
                    <p className="text-sm text-white/80">Manage both in one place</p>
                  </div>

                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
                      <Icon name="Repeat" size={28} className="text-white" />
                    </div>
                    <h4 className="font-semibold text-white mb-2">Recurring Bills</h4>
                    <p className="text-sm text-white/80">Weekly to annual frequencies</p>
                  </div>

                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
                      <Icon name="CheckCircle" size={28} className="text-white" />
                    </div>
                    <h4 className="font-semibold text-white mb-2">Payment Tracking</h4>
                    <p className="text-sm text-white/80">Mark paid/unpaid status</p>
                  </div>

                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
                      <Icon name="BarChart3" size={28} className="text-white" />
                    </div>
                    <h4 className="font-semibold text-white mb-2">Financial Metrics</h4>
                    <p className="text-sm text-white/80">Income vs expenses view</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Final Encouragement */}
          <div className="mt-12 text-center">
            <p className="text-white/90 text-lg mb-4">
              Ready to take control of your finances?
            </p>
            <p className="text-white/70 text-sm">
              It takes less than 2 minutes to get started. No credit card required.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;