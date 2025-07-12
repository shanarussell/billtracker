import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { formatDate } from '../../../utils/cn';

const UpcomingBillCard = ({ bill, onTogglePayment, onEdit }) => {
  const getStatusColor = () => {
    if (bill.isPaid) return 'bg-green-100 text-green-800 border-green-200';
    if (bill.isOverdue) return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  const getStatusIcon = () => {
    if (bill.isPaid) return 'CheckCircle';
    if (bill.isOverdue) return 'AlertCircle';
    return 'Clock';
  };



  const getDaysUntilDue = () => {
    const today = new Date();
    const [year, month, day] = bill.dueDate.split('-').map(Number);
    const dueDate = new Date(year, month - 1, day);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
            <Icon name="Receipt" size={20} color="#475569" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{bill.name}</h3>
            <p className="text-sm text-slate-600">{bill.category}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-slate-900">${bill.amount.toFixed(2)}</p>
          <p className="text-xs text-slate-500">{formatDate(bill.dueDate)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor()}`}>
            <Icon name={getStatusIcon()} size={12} className="mr-1" />
            {bill.isPaid ? 'Paid' : bill.isOverdue ? 'Overdue' : 'Pending'}
          </span>
          <span className="text-xs text-slate-500">{getDaysUntilDue()}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(bill.id)}
            iconName="Edit"
            iconSize={16}
            className="text-slate-600 hover:text-slate-900"
          />
          <Button
            variant={bill.isPaid ? "outline" : "default"}
            size="sm"
            onClick={() => onTogglePayment(bill.id)}
            iconName={bill.isPaid ? "X" : "Check"}
            iconSize={16}
          >
            {bill.isPaid ? 'Unpaid' : 'Mark Paid'}
          </Button>
        </div>
      </div>

      {bill.paymentMethod && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center space-x-2">
            <Icon name="CreditCard" size={14} color="#64748B" />
            <span className="text-sm text-slate-600">{bill.paymentMethod}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingBillCard;