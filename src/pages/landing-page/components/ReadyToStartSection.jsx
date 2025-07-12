import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const ReadyToStartSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/registration-screen');
  };

  const handleLogin = () => {
    navigate('/login-screen');
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
            Ready to Start Tracking?
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join users who have simplified their financial tracking with Easy Bill Tracker.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              variant="default"
              size="lg"
              onClick={handleGetStarted}
              iconName="ArrowRight"
              iconPosition="right"
              className="text-lg px-8 py-4"
            >
              Get Started Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleLogin}
              iconName="LogIn"
              iconPosition="left"
              className="text-lg px-8 py-4"
            >
              Sign In
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-sm text-muted-foreground">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
              <span>Setup takes less than 2 minutes</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
              <span>100% secure & private</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReadyToStartSection; 