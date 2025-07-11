import React from 'react';
import Icon from '../../../components/AppIcon';

const ComparisonCard = ({ title, currentValue, previousValue, period }) => {
  const difference = currentValue - previousValue;
  const percentageChange = previousValue !== 0 ? ((difference / Math.abs(previousValue)) * 100) : 0;
  const isPositive = difference >= 0;
  const isExpense = title.toLowerCase().includes('expense');
  
  // For expenses, positive change is bad, negative change is good
  const isGoodChange = isExpense ? difference <= 0 : difference >= 0;

  return (
    <div className="bg-card rounded-lg border p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
        <div className={`flex items-center space-x-1 ${isGoodChange ? 'text-success' : 'text-error'}`}>
          <Icon 
            name={isPositive ? 'TrendingUp' : 'TrendingDown'} 
            size={16} 
          />
          <span className="text-xs font-medium">
            {Math.abs(percentageChange).toFixed(1)}%
          </span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Current {period}</span>
          <span className="text-sm font-semibold text-foreground">
            ${Math.abs(currentValue).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Previous {period}</span>
          <span className="text-sm text-muted-foreground">
            ${Math.abs(previousValue).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
        
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Difference</span>
            <span className={`text-sm font-medium ${isGoodChange ? 'text-success' : 'text-error'}`}>
              {isPositive ? '+' : ''}${difference.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonCard;