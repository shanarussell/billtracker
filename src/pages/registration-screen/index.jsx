import React from 'react';
import { Helmet } from 'react-helmet';
import AppBranding from './components/AppBranding';
import RegistrationForm from './components/RegistrationForm';
import TrustBadges from './components/TrustBadges';

const RegistrationScreen = () => {
  return (
    <>
      <Helmet>
        <title>Create Account - Easy Bill Tracker</title>
        <meta name="description" content="Create your Easy Bill Tracker account to start managing your monthly bills efficiently and never miss a payment again." />
        <meta name="keywords" content="bill tracker, account registration, financial management, bill management signup" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Main Content */}
        <div className="flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
          <div className="w-full max-w-6xl mx-auto">
            
            {/* App Branding Section */}
            <div className="mb-12">
              <AppBranding />
            </div>

            {/* Registration Form Section */}
            <div className="flex flex-col lg:flex-row items-start justify-center gap-12">
              
              {/* Form Container */}
              <div className="w-full lg:w-1/2 max-w-md mx-auto lg:mx-0">
                <div className="bg-card border rounded-xl shadow-lg p-6 sm:p-8">
                  <RegistrationForm />
                </div>
              </div>

              {/* Trust Badges Section */}
              <div className="w-full lg:w-1/2 max-w-2xl mx-auto lg:mx-0">
                <div className="lg:sticky lg:top-8">
                  <TrustBadges />
                </div>
              </div>
            </div>

            {/* Footer Section */}
            <div className="mt-16 text-center">
              <div className="border-t pt-8">
                <p className="text-xs text-muted-foreground">
                  &copy; {new Date().getFullYear()} Easy Bill Tracker. All rights reserved.
                </p>
                <div className="flex items-center justify-center space-x-4 mt-4">
                  <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Service
                  </button>
                  <span className="text-xs text-muted-foreground">•</span>
                  <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </button>
                  <span className="text-xs text-muted-foreground">•</span>
                  <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegistrationScreen;