import React from 'react';
import { Helmet } from 'react-helmet';
import AppBranding from './components/AppBranding';
import RegistrationForm from './components/RegistrationForm';

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
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <div className="bg-card border rounded-xl shadow-lg p-6 sm:p-8">
                  <RegistrationForm />
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