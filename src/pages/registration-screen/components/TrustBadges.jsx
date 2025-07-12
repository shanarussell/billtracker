import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustBadges = () => {
  const trustFeatures = [
    {
      icon: 'Shield',
      title: 'Bank-Level Security',
      description: 'Your financial data is protected with 256-bit SSL encryption'
    },
    {
      icon: 'Lock',
      title: 'Privacy Protected',
      description: 'We never share your personal information with third parties'
    },
    {
      icon: 'Eye',
      title: 'Your Data Only',
      description: 'Only you can access your bills and financial information'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Your Financial Privacy is Our Priority
        </h3>
        <p className="text-sm text-muted-foreground">
          Join thousands of users who trust Easy Bill Tracker with their financial management
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trustFeatures.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center p-4">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
              <Icon name={feature.icon} size={24} className="text-primary" />
            </div>
            <h4 className="font-medium text-foreground mb-2">{feature.title}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-muted/50 rounded-lg border">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={16} className="text-green-600" />
            <span className="text-sm font-medium text-foreground">SSL Secured</span>
          </div>
          <div className="w-px h-4 bg-border"></div>
          <div className="flex items-center space-x-2">
            <Icon name="Users" size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-foreground">10,000+ Users</span>
          </div>
          <div className="w-px h-4 bg-border"></div>
          <div className="flex items-center space-x-2">
            <Icon name="Star" size={16} className="text-yellow-600" />
            <span className="text-sm font-medium text-foreground">4.8/5 Rating</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustBadges;