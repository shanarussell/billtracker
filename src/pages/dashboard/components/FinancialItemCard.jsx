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
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-4 hover:shadow-lg hover:border-green-300 transition-all duration-200">
        {/* Header Section - More Compact */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1 min-w-0">
            {/* Status Badge and Title Row */}
            <div className="flex items-center gap-3 mb-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                <Icon name="DollarSign" size={12} />
                <span>Deposit</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 truncate">
                {item.source}
              </h3>
            </div>
            
            {/* Amount */}
            <p className="text-xl font-bold text-green-600">
              +${item.amount.toFixed(2)}
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-1 ml-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit && onEdit(item.id, item)}
              className="text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg p-2"
            >
              <Icon name="Edit" size={18} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(item.id)}
              className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg p-2"
            >
              <Icon name="Trash2" size={18} />
            </Button>
          </div>
        </div>

        {/* Metadata Section - More Compact */}
        <div className="space-y-2 pt-3 border-t border-green-100">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <div className="flex items-center gap-1.5">
              <Icon name="Calendar" size={14} className="text-green-500" />
              <span className="font-medium">{formatDate(item.deposit_date)}</span>
            </div>
          </div>
          
          {item.notes && (
            <div className="flex items-start gap-2 text-sm text-slate-600">
              <Icon name="FileText" size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{item.notes}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Bill item
  const getStatusConfig = () => {
    if (item.isOverdue) {
      return {
        badge: 'bg-red-100 text-red-700 border-red-200',
        icon: 'AlertTriangle',
        text: 'Overdue',
        amountColor: 'text-red-600'
      };
    } else if (item.isPaid) {
      return {
        badge: 'bg-green-100 text-green-700 border-green-200',
        icon: 'CheckCircle',
        text: 'Paid',
        amountColor: 'text-green-600'
      };
    } else {
      return {
        badge: 'bg-amber-100 text-amber-700 border-amber-200',
        icon: 'Clock',
        text: 'Due',
        amountColor: 'text-slate-900'
      };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className={`bg-white rounded-xl border p-4 hover:shadow-lg transition-all duration-200 ${
      item.isOverdue ? 'border-red-200 hover:border-red-300' : 
      item.isPaid ? 'border-green-200 hover:border-green-300' : 
      'border-slate-200 hover:border-slate-300'
    }`}>
      {/* Header Section - More Compact */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1 min-w-0">
          {/* Status Badge and Title Row */}
          <div className="flex items-center gap-3 mb-2">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.badge}`}>
              <Icon name={statusConfig.icon} size={12} />
              <span>{statusConfig.text}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 truncate">
              {item.name}
            </h3>
          </div>
          
          {/* Amount */}
          <p className={`text-xl font-bold ${statusConfig.amountColor}`}>
            -${item.amount.toFixed(2)}
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-1 ml-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit && onEdit(item.id, item)}
            className="text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg p-2"
          >
            <Icon name="Edit" size={18} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onTogglePayment(item.id)}
            className={`rounded-lg p-2 ${
              item.isPaid 
                ? 'text-green-500 hover:text-green-600 hover:bg-green-50' 
                : 'text-amber-500 hover:text-amber-600 hover:bg-amber-50'
            }`}
          >
            <Icon name={item.isPaid ? "CheckCircle" : "CreditCard"} size={18} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete && onDelete(item.id, item)}
            className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg p-2"
          >
            <Icon name="Trash2" size={18} />
          </Button>
        </div>
      </div>

      {/* Metadata Section - More Compact */}
      <div className="space-y-2 pt-3 border-t border-slate-100">
        {/* Date and Category Row */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <Icon name="Calendar" size={14} className="text-slate-400" />
            <span className="font-medium text-slate-700">{formatDate(item.dueDate)}</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Icon name="Tag" size={14} className="text-slate-400" />
            <span className="font-medium text-slate-700">{item.category}</span>
          </div>
        </div>

        {/* Payment Method (if paid) */}
        {item.isPaid && item.paymentMethod && (
          <div className="flex items-center gap-1.5 text-sm">
            <Icon name="CreditCard" size={14} className="text-green-500" />
            <span className="font-medium text-green-600">Paid via {item.paymentMethod}</span>
          </div>
        )}

        {/* Notes */}
        {item.notes && (
          <div className="flex items-start gap-2 text-sm text-slate-600">
            <Icon name="FileText" size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{item.notes}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialItemCard; 