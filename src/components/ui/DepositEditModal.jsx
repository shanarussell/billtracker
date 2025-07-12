import React, { useState, useEffect } from 'react';
import Button from './Button';
import Input from './Input';
import Icon from '../AppIcon';

const DepositEditModal = ({ isOpen, onClose, onConfirm, deposit, currentUser }) => {
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    depositDate: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Load deposit data when modal opens
  useEffect(() => {
    if (isOpen && deposit) {
      setFormData({
        source: deposit.source || '',
        amount: deposit.amount?.toString() || '',
        depositDate: deposit.deposit_date || '',
        notes: deposit.notes || ''
      });
      setErrors({});
    }
  }, [isOpen, deposit]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.source.trim()) {
      newErrors.source = 'Source is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }

    if (!formData.depositDate) {
      newErrors.depositDate = 'Deposit date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const depositData = {
        source: formData.source,
        amount: parseFloat(formData.amount),
        deposit_date: formData.depositDate,
        notes: formData.notes
      };

      await onConfirm(depositData);
      onClose();
    } catch (error) {
      setErrors({ submit: 'Failed to update deposit. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-shrink-0">
            <Icon name="DollarSign" size={24} className="text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Edit Deposit</h3>
            <p className="text-sm text-slate-600">Update your deposit information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Source"
            type="text"
            placeholder="e.g., Salary, Bonus, Refund"
            value={formData.source}
            onChange={(e) => handleInputChange('source', e.target.value)}
            error={errors.source}
            required
          />

          <Input
            label="Amount"
            type="number"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            error={errors.amount}
            required
            min="0"
            step="0.01"
          />

          <Input
            label="Deposit Date"
            type="date"
            value={formData.depositDate}
            onChange={(e) => handleInputChange('depositDate', e.target.value)}
            error={errors.depositDate}
            required
          />

          <Input
            label="Notes (Optional)"
            type="text"
            placeholder="Add any additional notes about this deposit"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
          />

          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <Icon name="AlertCircle" size={20} className="text-red-600 mr-2" />
                <span className="text-red-700">{errors.submit}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              loading={isLoading}
              className="flex-1"
            >
              Update Deposit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepositEditModal; 