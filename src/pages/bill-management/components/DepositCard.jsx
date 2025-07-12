import React from 'react';
import { format } from 'date-fns';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const DepositCard = ({ deposit, onDelete }) => {
  console.log('🔍 Debug - DepositCard rendering with deposit:', deposit);
  
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-600">Deposit</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            {deposit.source}
          </h3>
          <p className="text-2xl font-bold text-green-600">
            ${parseFloat(deposit.amount).toFixed(2)}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(deposit.id)}
          className="text-slate-400 hover:text-red-500"
        >
          <Icon name="Trash2" size={16} />
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Icon name="Calendar" size={14} />
          <span>{formatDate(deposit.deposit_date)}</span>
        </div>
        
        {deposit.notes && (
          <div className="flex items-start gap-2 text-sm text-slate-600">
            <Icon name="FileText" size={14} className="mt-0.5" />
            <span className="line-clamp-2">{deposit.notes}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepositCard; 