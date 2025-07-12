import React from 'react';
import { format } from 'date-fns';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FinancialItemCard = ({ item, onTogglePayment, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    try {
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return format(date, 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  if (item.type === 'deposit') {
    return (
      <div className="bg-white rounded-lg border border-green-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-600">Deposit</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              {item.source}
            </h3>
            <p className="text-xl font-bold text-green-600">
              +${item.amount.toFixed(2)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(item.id)}
            className="text-slate-400 hover:text-red-500"
          >
            <Icon name="Trash2" size={16} />
          </Button>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Icon name="Calendar" size={14} />
            <span>{formatDate(item.deposit_date)}</span>
          </div>
          
          {item.notes && (
            <div className="flex items-start gap-2 text-sm text-slate-600">
              <Icon name="FileText" size={14} className="mt-0.5" />
              <span className="line-clamp-2">{item.notes}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Bill item
  return (
    <div className={`bg-white rounded-lg border p-4 hover:shadow-md transition-shadow ${
      item.isOverdue ? 'border-red-200' : 'border-slate-200'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${
              item.isOverdue ? 'bg-red-500' : 
              item.isPaid ? 'bg-green-500' : 'bg-amber-500'
            }`}></div>
            <span className={`text-sm font-medium ${
              item.isOverdue ? 'text-red-600' : 
              item.isPaid ? 'text-green-600' : 'text-amber-600'
            }`}>
              {item.isOverdue ? 'Overdue' : item.isPaid ? 'Paid' : 'Due'}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            {item.name}
          </h3>
          <p className={`text-xl font-bold ${
            item.isPaid ? 'text-green-600' : 'text-slate-900'
          }`}>
            -${item.amount.toFixed(2)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(item.id)}
            className="text-slate-400 hover:text-blue-500"
          >
            <Icon name="Edit" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onTogglePayment(item.id)}
            className={`${
              item.isPaid ? 'text-green-500 hover:text-green-600' : 'text-amber-500 hover:text-amber-600'
            }`}
          >
            <Icon name={item.isPaid ? "CheckCircle" : "CreditCard"} size={16} />
          </Button>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Icon name="Calendar" size={14} />
          <span>{formatDate(item.dueDate)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Icon name="Tag" size={14} />
          <span>{item.category}</span>
        </div>

        {item.isPaid && item.paymentMethod && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <Icon name="CreditCard" size={14} />
            <span>Paid via {item.paymentMethod}</span>
          </div>
        )}

        {item.notes && (
          <div className="flex items-start gap-2 text-sm text-slate-600">
            <Icon name="FileText" size={14} className="mt-0.5" />
            <span className="line-clamp-2">{item.notes}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialItemCard; 