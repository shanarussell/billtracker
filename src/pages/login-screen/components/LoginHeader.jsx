import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      {/* App Logo */}
      <div className="flex justify-center mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg">
            <Icon name="Receipt" size={28} color="white" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold text-foreground">Easy Bill Tracker</h1>
            <p className="text-sm text-muted-foreground">Manage your bills with ease</p>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Welcome Back</h2>
        <p className="text-muted-foreground">
          Sign in to access your personal finance dashboard and manage your monthly bills
        </p>
      </div>
    </div>
  );
};

export default LoginHeader;