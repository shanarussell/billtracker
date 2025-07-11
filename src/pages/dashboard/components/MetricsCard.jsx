import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, amount, icon, variant = 'default', trend, trendValue }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      case 'danger':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-white border-slate-200';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'success':
        return '#059669';
      case 'warning':
        return '#D97706';
      case 'danger':
        return '#DC2626';
      default:
        return '#1E40AF';
    }
  };

  const getTrendColor = () => {
    return trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-slate-600';
  };

  return (
    <div className={`p-6 rounded-lg border ${getVariantStyles()} transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{amount}</p>
          {trend && trendValue && (
            <div className="flex items-center mt-2">
              <Icon 
                name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                size={16} 
                color={getTrendColor().replace('text-', '')} 
              />
              <span className={`text-sm ml-1 ${getTrendColor()}`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center shadow-sm">
            <Icon name={icon} size={24} color={getIconColor()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;