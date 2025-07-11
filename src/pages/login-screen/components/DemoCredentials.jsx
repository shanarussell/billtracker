import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const DemoCredentials = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="mt-6 p-4 bg-muted rounded-lg border">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Icon name="Info" size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">Demo Credentials</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleVisibility}
          iconName={isVisible ? "EyeOff" : "Eye"}
          iconSize={16}
        >
          {isVisible ? 'Hide' : 'Show'}
        </Button>
      </div>
      
      {isVisible && (
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between p-2 bg-background rounded border">
            <span className="text-muted-foreground">Email:</span>
            <span className="font-mono text-foreground">john.doe@example.com</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-background rounded border">
            <span className="text-muted-foreground">Password:</span>
            <span className="font-mono text-foreground">password123</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Use these credentials to explore the demo application
          </p>
        </div>
      )}
    </div>
  );
};

export default DemoCredentials;