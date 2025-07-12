import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const LandingHeader = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogin = () => {
    navigate('/login-screen');
    setIsMobileMenuOpen(false);
  };

  const handleSignUp = () => {
    navigate('/registration-screen');
    setIsMobileMenuOpen(false);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const navigationItems = [
    { label: 'Features', action: () => scrollToSection('features') },
    { label: 'How It Works', action: () => scrollToSection('how-it-works') },
    { label: 'Testimonials', action: () => scrollToSection('testimonials') }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Icon name="Receipt" size={20} color="white" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Easy Bill Tracker
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={handleLogin}
              className="font-medium"
            >
              Sign In
            </Button>
            <Button
              variant="default"
              onClick={handleSignUp}
              iconName="ArrowRight"
              iconPosition="right"
              className="font-medium"
            >
              Get Started Free
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            iconName={isMobileMenuOpen ? "X" : "Menu"}
            iconSize={20}
            className="md:hidden"
          />
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-white">
            <nav className="px-4 py-4 space-y-4">
              {navigationItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.action}
                  className="block w-full text-left text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium py-2"
                >
                  {item.label}
                </button>
              ))}
              
              <div className="pt-4 border-t border-border space-y-3">
                <Button
                  variant="outline"
                  onClick={handleLogin}
                  fullWidth
                  className="justify-start font-medium"
                >
                  Sign In
                </Button>
                <Button
                  variant="default"
                  onClick={handleSignUp}
                  fullWidth
                  iconName="ArrowRight"
                  iconPosition="right"
                  className="justify-center font-medium"
                >
                  Get Started Free
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default LandingHeader;