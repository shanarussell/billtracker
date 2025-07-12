import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import TrustSignals from './components/TrustSignals';

const LoginScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
      
      {/* Main Content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="bg-card rounded-xl shadow-elevation-2 border p-6 sm:p-8">
            <LoginHeader />
            <LoginForm />
            <TrustSignals />
          </div>

          {/* Footer Link */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/landing-page')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-accent/10 rounded-full blur-xl"></div>
    </div>
  );
};

export default LoginScreen;