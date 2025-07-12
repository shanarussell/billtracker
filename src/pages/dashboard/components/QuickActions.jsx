import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const QuickActions = ({ onAddDeposit }) => {
  const navigate = useNavigate();

  const handleAddBill = () => {
    navigate('/add-edit-bill');
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          variant="default"
          onClick={handleAddBill}
          iconName="Plus"
          iconPosition="left"
          iconSize={18}
          fullWidth
          className="justify-start"
        >
          Add New Bill
        </Button>
        
        <Button
          variant="success"
          onClick={onAddDeposit}
          iconName="DollarSign"
          iconPosition="left"
          iconSize={18}
          fullWidth
          className="justify-start"
        >
          Add Deposit
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;