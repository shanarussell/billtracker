import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  return (
    <div className="mt-8 pt-6 border-t border-border">
      <div className="text-center space-y-4">
        {/* Security Badge */}
        <div className="flex items-center justify-center space-x-2">
          <Icon name="Shield" size={16} className="text-success" />
          <span className="text-sm text-muted-foreground">
            SSL Secured & Encrypted
          </span>
        </div>

        {/* Privacy Assurance */}
        <div className="flex items-center justify-center space-x-2">
          <Icon name="Lock" size={16} className="text-success" />
          <span className="text-sm text-muted-foreground">
            Your financial data is private and secure
          </span>
        </div>

        {/* Trust Message */}
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          We use bank-level security to protect your personal information and never share your data with third parties.
        </p>
      </div>
    </div>
  );
};

export default TrustSignals;