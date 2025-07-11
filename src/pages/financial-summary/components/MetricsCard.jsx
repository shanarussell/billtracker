import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, amount, icon, trend, trendValue, variant = 'default' }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'income':
        return 'border-success/20 bg-success/5';
      case 'expense':
        return 'border-error/20 bg-error/5';
      case 'balance':
        return amount >= 0 ? 'border-success/20 bg-success/5' : 'border-error/20 bg-error/5';
      default:
        return 'border-border bg-card';
    }
  };

  const getAmountColor = () => {
    switch (variant) {
      case 'income':
        return 'text-success';
      case 'expense':
        return 'text-error';
      case 'balance':
        return amount >= 0 ? 'text-success' : 'text-error';
      default:
        return 'text-foreground';
    }
  };

  const getTrendColor = () => {
    if (variant === 'expense') {
      return trend === 'up' ? 'text-error' : 'text-success';
    }
    return trend === 'up' ? 'text-success' : 'text-error';
  };

  return (
    <div className={`rounded-lg border p-4 ${getVariantStyles()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon name={icon} size={20} color="var(--color-primary)" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={`text-2xl font-bold ${getAmountColor()}`}>
              ${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
        
        {trend && trendValue && (
          <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
            <Icon 
              name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
              size={16} 
            />
            <span className="text-sm font-medium">{trendValue}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricsCard;