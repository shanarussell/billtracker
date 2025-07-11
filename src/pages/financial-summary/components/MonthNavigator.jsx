import React from 'react';

import Button from '../../../components/ui/Button';

const MonthNavigator = ({ currentMonth, onMonthChange }) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    onMonthChange(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    onMonthChange(nextMonth);
  };

  return (
    <div className="flex items-center justify-between bg-card rounded-lg p-4 shadow-sm border">
      <Button
        variant="ghost"
        size="sm"
        onClick={handlePrevMonth}
        iconName="ChevronLeft"
        iconSize={20}
        className="h-10 w-10"
      />
      
      <div className="text-center">
        <h2 className="text-xl font-semibold text-foreground">
          {months[currentMonth]} 2024
        </h2>
        <p className="text-sm text-muted-foreground">Financial Summary</p>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleNextMonth}
        iconName="ChevronRight"
        iconSize={20}
        className="h-10 w-10"
      />
    </div>
  );
};

export default MonthNavigator;