import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AppBranding = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg">
            <Icon name="Receipt" size={28} color="white" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold text-foreground">Easy Bill Tracker</h1>
            <p className="text-sm text-muted-foreground">Smart Bill Management</p>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="space-y-2 mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          Create Your Account
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Join Easy Bill Tracker to take control of your monthly bills and never miss a payment again.
        </p>
      </div>

      {/* Quick Benefits */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="flex items-center justify-center space-x-2 p-3 bg-muted/30 rounded-lg">
          <Icon name="Calendar" size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">Track Due Dates</span>
        </div>
        <div className="flex items-center justify-center space-x-2 p-3 bg-muted/30 rounded-lg">
          <Icon name="DollarSign" size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">Monitor Spending</span>
        </div>
        <div className="flex items-center justify-center space-x-2 p-3 bg-muted/30 rounded-lg">
          <Icon name="Bell" size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">Get Reminders</span>
        </div>
      </div>

      {/* Back to Landing */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/landing-page')}
          iconName="ArrowLeft"
          iconPosition="left"
          className="text-muted-foreground hover:text-foreground"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default AppBranding;