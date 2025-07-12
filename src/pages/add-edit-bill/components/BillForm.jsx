import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import billService from '../../../utils/billService';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const BillForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const billId = searchParams.get('id');
  const isEditMode = Boolean(billId);

  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    dueDate: '',
    isRecurring: false,
    frequency: 'monthly',
    endDate: '',
    notes: '',
    reminderDays: '3'
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);



  const frequencyOptions = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'annually', label: 'Annually' }
  ];



  const reminderOptions = [
    { value: '1', label: '1 day before' },
    { value: '3', label: '3 days before' },
    { value: '5', label: '5 days before' },
    { value: '7', label: '7 days before' }
  ];

  useEffect(() => {
    if (isEditMode && billId) {
      const existingBill = mockBills.find(bill => bill.id === billId);
      if (existingBill) {
        setFormData(existingBill);
      }
    }
  }, [billId, isEditMode]);

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

    if (!formData.name.trim()) {
      newErrors.name = 'Bill name is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }



    if (formData.isRecurring && formData.endDate && new Date(formData.endDate) <= new Date(formData.dueDate)) {
      newErrors.endDate = 'End date must be after due date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm() || !user?.id) {
      return;
    }

    setIsLoading(true);

    try {
      const billData = {
        name: formData.name,
        amount: parseFloat(formData.amount),
        dueDate: formData.dueDate,
        status: 'unpaid',
        isRecurring: formData.isRecurring,
        notes: formData.notes || ''
      };

      let result;
      if (isEditMode) {
        result = await billService.updateBill(billId, billData);
      } else {
        result = await billService.createBill(user.id, billData);
      }
      
      if (result?.success) {
        navigate('/bill-management', { 
          state: { 
            message: isEditMode ? 'Bill updated successfully!' : 'Bill added successfully!',
            type: 'success'
          }
        });
      } else {
        setErrors({ submit: result?.error || 'Failed to save bill. Please try again.' });
      }
    } catch (error) {
      console.error('Error saving bill:', error);
      setErrors({ submit: 'Failed to save bill. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/bill-management');
  };

  const getNextPaymentDates = () => {
    if (!formData.isRecurring || !formData.dueDate) return [];
    
    const dates = [];
    const startDate = new Date(formData.dueDate);
    const endDate = formData.endDate ? new Date(formData.endDate) : null;
    
    for (let i = 0; i < 3; i++) {
      const nextDate = new Date(startDate);
      
      switch (formData.frequency) {
        case 'monthly':
          nextDate.setMonth(startDate.getMonth() + i);
          break;
        case 'quarterly':
          nextDate.setMonth(startDate.getMonth() + (i * 3));
          break;
        case 'annually':
          nextDate.setFullYear(startDate.getFullYear() + i);
          break;
      }
      
      if (endDate && nextDate > endDate) break;
      dates.push(nextDate.toLocaleDateString());
    }
    
    return dates;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bill Information Section */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="Receipt" size={20} className="mr-2" />
            Bill Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Bill Name"
                type="text"
                placeholder="e.g., Electric Bill, Car Payment"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={errors.name}
                required
              />
            </div>
            
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
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
              error={errors.dueDate}
              required
            />
          </div>
        </div>

        {/* Recurring Settings Section */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="Repeat" size={20} className="mr-2" />
            Recurring Settings
          </h3>
          
          <div className="space-y-4">
            <Checkbox
              label="This is a recurring bill"
              description="Bill will automatically repeat based on frequency"
              checked={formData.isRecurring}
              onChange={(e) => handleInputChange('isRecurring', e.target.checked)}
            />
            
            {formData.isRecurring && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 border-l-2 border-muted">
                <Select
                  label="Frequency"
                  options={frequencyOptions}
                  value={formData.frequency}
                  onChange={(value) => handleInputChange('frequency', value)}
                />
                
                <Input
                  label="End Date (Optional)"
                  type="date"
                  description="Leave empty for ongoing bills"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  error={errors.endDate}
                />
                
                {getNextPaymentDates().length > 0 && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Next Payment Dates Preview
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {getNextPaymentDates().map((date, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
                        >
                          {date}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Additional Options Section */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="Settings" size={20} className="mr-2" />
            Additional Options
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Reminder"
              description="Get notified before due date"
              options={reminderOptions}
              value={formData.reminderDays}
              onChange={(value) => handleInputChange('reminderDays', value)}
            />
            
            <div className="md:col-span-2">
              <Input
                label="Notes (Optional)"
                type="text"
                placeholder="Add any additional notes about this bill"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
              />
            </div>
          </div>
        </div>

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
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
          <Button
            type="submit"
            variant="default"
            loading={isLoading}
            iconName="Save"
            iconPosition="left"
            className="sm:order-2"
          >
            {isEditMode ? 'Update Bill' : 'Save Bill'}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            iconName="X"
            iconPosition="left"
            className="sm:order-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BillForm;