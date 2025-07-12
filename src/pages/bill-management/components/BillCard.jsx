import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { formatDate } from '../../../utils/cn';

const BillCard = ({ bill, onTogglePayment, onEdit, onDelete, onSelect, isSelected }) => {
  const getStatusColor = (status, dueDate) => {
    if (status === 'paid') return 'bg-green-50 border-green-200';
    if (status === 'overdue') return 'bg-red-50 border-red-200';
    
    const today = new Date();
    const due = new Date(dueDate);
    if (due < today) return 'bg-red-50 border-red-200';
    
    return 'bg-white border-border';
  };

  const getStatusIcon = (status, dueDate) => {
    if (status === 'paid') return { name: 'CheckCircle', color: 'text-green-600' };
    if (status === 'overdue') return { name: 'AlertCircle', color: 'text-red-600' };
    
    const today = new Date();
    const due = new Date(dueDate);
    if (due < today) return { name: 'AlertCircle', color: 'text-red-600' };
    
    return { name: 'Clock', color: 'text-muted-foreground' };
  };



  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const statusIcon = getStatusIcon(bill.status, bill.dueDate);

  return (
    <div className={`rounded-lg border p-4 transition-all duration-200 hover:shadow-md ${getStatusColor(bill.status, bill.dueDate)}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(bill.id)}
            className="rounded border-border focus:ring-2 focus:ring-primary"
          />
          <div>
            <h3 className="font-semibold text-foreground">{bill.name}</h3>
            <p className="text-sm text-muted-foreground">{bill.category}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name={statusIcon.name} size={20} className={statusIcon.color} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-muted-foreground">Amount</p>
          <p className="font-semibold text-foreground">{formatAmount(bill.amount)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Due Date</p>
          <p className="font-semibold text-foreground">{formatDate(bill.dueDate)}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-muted-foreground">Payment Method</p>
        <p className="font-medium text-foreground">{bill.paymentMethod}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant={bill.status === 'paid' ? 'success' : 'outline'}
            size="sm"
            onClick={() => onTogglePayment(bill.id)}
            iconName={bill.status === 'paid' ? 'CheckCircle' : 'Circle'}
            iconPosition="left"
            iconSize={16}
          >
            {bill.status === 'paid' ? 'Paid' : 'Mark Paid'}
          </Button>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(bill)}
            iconName="Edit"
            iconSize={16}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(bill.id)}
            iconName="Trash2"
            iconSize={16}
            className="text-destructive hover:text-destructive"
          />
        </div>
      </div>
    </div>
  );
};

export default BillCard;