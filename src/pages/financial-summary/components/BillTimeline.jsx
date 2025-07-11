import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BillTimeline = ({ bills, onBillClick }) => {
  const getStatusColor = (status, dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const isOverdue = due < today && status !== 'paid';
    
    if (status === 'paid') return 'text-success border-success/20 bg-success/5';
    if (isOverdue) return 'text-error border-error/20 bg-error/5';
    return 'text-muted-foreground border-border bg-card';
  };

  const getStatusIcon = (status, dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const isOverdue = due < today && status !== 'paid';
    
    if (status === 'paid') return 'CheckCircle';
    if (isOverdue) return 'AlertCircle';
    return 'Clock';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const sortedBills = [...bills].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Upcoming Bills</h3>
        <Button
          variant="ghost"
          size="sm"
          iconName="Calendar"
          iconPosition="left"
          iconSize={16}
        >
          View All
        </Button>
      </div>
      
      <div className="space-y-3">
        {sortedBills.slice(0, 6).map((bill) => (
          <div
            key={bill.id}
            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${getStatusColor(bill.status, bill.dueDate)}`}
            onClick={() => onBillClick(bill)}
          >
            <div className="flex items-center space-x-3">
              <Icon 
                name={getStatusIcon(bill.status, bill.dueDate)} 
                size={20} 
              />
              <div>
                <p className="font-medium text-foreground">{bill.name}</p>
                <p className="text-sm text-muted-foreground">
                  Due {formatDate(bill.dueDate)} • {bill.paymentMethod}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="font-semibold text-foreground">
                ${bill.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {bill.status}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {sortedBills.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Calendar" size={48} className="mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No bills scheduled</p>
        </div>
      )}
    </div>
  );
};

export default BillTimeline;