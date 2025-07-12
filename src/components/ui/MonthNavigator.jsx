import React from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const MonthNavigator = ({ currentMonth, onMonthChange, className = '' }) => {
  const formatMonth = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const goToPreviousMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    onMonthChange(newMonth);
  };

  const goToNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    onMonthChange(newMonth);
  };

  const goToCurrentMonth = () => {
    onMonthChange(new Date());
  };

  const isCurrentMonth = () => {
    const now = new Date();
    return currentMonth.getMonth() === now.getMonth() && 
           currentMonth.getFullYear() === now.getFullYear();
  };

  return (
    <div className={`flex items-center justify-between bg-white rounded-lg border border-slate-200 p-4 ${className}`}>
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={goToPreviousMonth}
          iconName="ChevronLeft"
          iconSize={20}
          className="text-slate-600 hover:text-slate-900"
        />
        
        <h2 className="text-xl font-semibold text-slate-900">
          {formatMonth(currentMonth)}
        </h2>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={goToNextMonth}
          iconName="ChevronRight"
          iconSize={20}
          className="text-slate-600 hover:text-slate-900"
        />
      </div>
      
      {!isCurrentMonth() && (
        <Button
          variant="outline"
          size="sm"
          onClick={goToCurrentMonth}
          iconName="Calendar"
          iconPosition="left"
          iconSize={16}
          className="text-slate-600 hover:text-slate-900"
        >
          Current Month
        </Button>
      )}
    </div>
  );
};

export default MonthNavigator; 