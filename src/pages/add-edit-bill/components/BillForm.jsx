import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const { user } = useAuth();
  const billId = searchParams.get('id');
  const billFromState = location.state?.bill;
  const isEditMode = Boolean(billId || billFromState);

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
  const [loadingBill, setLoadingBill] = useState(false);



  const frequencyOptions = [
    { value: 'weekly', label: 'Weekly' },
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

  // Load bill data for editing
  useEffect(() => {
    const loadBillData = async () => {
      if (!isEditMode) return;
      
      // If we have bill data from state, use it directly
      if (billFromState) {
        setFormData({
          name: billFromState.name || '',
          amount: billFromState.amount?.toString() || '',
          dueDate: billFromState.dueDate || '',
          isRecurring: billFromState.isRecurring || false,
          frequency: 'monthly', // Default since we don't store this
          endDate: '', // Default since we don't store this
          notes: billFromState.notes || '',
          reminderDays: '3' // Default since we don't store this
        });
        return;
      }
      
      // Otherwise, fetch bill data by ID
      if (!billId) return;
      
      try {
        setLoadingBill(true);
        const result = await billService.getBillById(billId);
        
        if (result?.success && result.data) {
          const bill = result.data;
          setFormData({
            name: bill.name || '',
            amount: bill.amount?.toString() || '',
            dueDate: bill.dueDate || '',
            isRecurring: bill.isRecurring || false,
            frequency: 'monthly', // Default since we don't store this
            endDate: '', // Default since we don't store this
            notes: bill.notes || '',
            reminderDays: '3' // Default since we don't store this
          });
        } else {
          console.error('Failed to load bill:', result?.error);
          setErrors({ submit: 'Failed to load bill data. Please try again.' });
        }
      } catch (error) {
        console.error('Error loading bill:', error);
        setErrors({ submit: 'Failed to load bill data. Please try again.' });
      } finally {
        setLoadingBill(false);
      }
    };

    loadBillData();
  }, [billId, billFromState, isEditMode]);

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



    if (formData.isRecurring && formData.endDate) {
      const [ey, em, ed] = formData.endDate.split('-').map(Number);
      const [dy, dm, dd] = formData.dueDate.split('-').map(Number);
      const endDate = new Date(ey, em - 1, ed);
      const dueDate = new Date(dy, dm - 1, dd);
      if (endDate <= dueDate) {
        newErrors.endDate = 'End date must be after due date';
      }
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
        category: 'Other', // Default category since it's required by database
        amount: parseFloat(formData.amount),
        dueDate: formData.dueDate,
        status: 'unpaid',
        isRecurring: formData.isRecurring,
        frequency: formData.frequency,
        endDate: formData.endDate || null,
        notes: formData.notes || ''
      };

      let result;
      if (isEditMode) {
        const editBillId = billId || billFromState?.id;
        result = await billService.updateBill(editBillId, billData);
      } else {
        result = await billService.createBill(user.id, billData);
      }
      
      if (result?.success) {
        // Navigate back to dashboard with success message
        navigate('/dashboard', {
          state: { 
            message: isEditMode ? "Bill updated successfully!" : "Bill added successfully!", 
            type: "success" 
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
    navigate('/dashboard');
  };

  const getNextPaymentDates = () => {
    if (!formData.isRecurring || !formData.dueDate) return [];
    
    const dates = [];
    const [sy, sm, sd] = formData.dueDate.split('-').map(Number);
    const startDate = new Date(sy, sm - 1, sd);
    const endDate = formData.endDate ? (() => { const [ey, em, ed] = formData.endDate.split('-').map(Number); return new Date(ey, em - 1, ed); })() : null;
    
    for (let i = 0; i < 3; i++) {
      const nextDate = new Date(startDate);
      
      switch (formData.frequency) {
        case 'weekly':
          nextDate.setDate(startDate.getDate() + (i * 7));
          break;
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

  // Show loading state when loading bill data
  if (isEditMode && loadingBill) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Icon name="Loader2" size={32} className="animate-spin mx-auto mb-4 text-primary" />
            <p className="text-slate-600">Loading bill data...</p>
          </div>
        </div>
      </div>
    );
  }

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