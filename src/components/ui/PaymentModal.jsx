import React, { useState, useEffect } from 'react';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import Icon from '../AppIcon';
import paymentMethodService from '../../utils/paymentMethodService';

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  bill, 
  currentUser 
}) => {
  const [amount, setAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [newMethodName, setNewMethodName] = useState('');

  useEffect(() => {
    if (isOpen && bill) {
      setAmount(bill.amount.toString());
      loadPaymentMethods();
    }
  }, [isOpen, bill]);

  const loadPaymentMethods = async () => {
    if (!currentUser?.id) return;
    
    try {
      const result = await paymentMethodService.getPaymentMethods(currentUser.id);
      if (result.success) {
        setPaymentMethods(result.data);
        // Set default payment method if available
        const defaultMethod = result.data.find(method => method.is_default);
        if (defaultMethod) {
          setSelectedPaymentMethod(defaultMethod.id);
        }
      }
    } catch (error) {
      console.error('Failed to load payment methods:', error);
    }
  };

  const handleAddPaymentMethod = async () => {
    if (!newMethodName.trim()) {
      setError('Please enter a payment method name');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await paymentMethodService.createPaymentMethod(currentUser.id, {
        name: newMethodName.trim(),
        type: 'credit_card', // Default type since we're not using types in the UI
        isDefault: paymentMethods.length === 0 // Make default if it's the first one
      });

      if (result.success) {
        setPaymentMethods(prev => [...prev, result.data]);
        setSelectedPaymentMethod(result.data.id);
            setNewMethodName('');
    setShowAddMethod(false);
      } else {
        setError(result.error || 'Failed to add payment method');
      }
    } catch (error) {
      setError('Failed to add payment method');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!selectedPaymentMethod) {
      setError('Please select a payment method');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const selectedMethod = paymentMethods.find(method => method.id === selectedPaymentMethod);
      await onConfirm({
        amount: parseFloat(amount),
        paymentMethodId: selectedPaymentMethod,
        paymentMethodName: selectedMethod?.name || 'Unknown'
      });
      onClose();
    } catch (error) {
      setError('Failed to mark bill as paid');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setAmount('');
    setSelectedPaymentMethod('');
    setError('');
    setShowAddMethod(false);
    setNewMethodName('');
    onClose();
  };

  if (!isOpen || !bill) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Mark Bill as Paid</h2>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="mb-4">
          <h3 className="font-medium text-foreground mb-2">{bill.name}</h3>
          <p className="text-sm text-muted-foreground">Original amount: ${bill.amount.toFixed(2)}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Amount Paid
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount paid"
              step="0.01"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Payment Method
            </label>
            {paymentMethods.length > 0 ? (
              <Select
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              >
                <option value="">Select payment method</option>
                {paymentMethods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.name} {method.is_default ? '(Default)' : ''}
                  </option>
                ))}
              </Select>
            ) : (
              <p className="text-sm text-muted-foreground mb-2">No payment methods found</p>
            )}
            
            <button
              type="button"
              onClick={() => setShowAddMethod(!showAddMethod)}
              className="text-sm text-primary hover:text-primary/80 flex items-center space-x-1"
            >
              <Icon name="Plus" size={14} />
              <span>Add new payment method</span>
            </button>
          </div>

          {showAddMethod && (
            <div className="border border-border rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-foreground">Add New Payment Method</h4>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Method Name
                </label>
                <Input
                  type="text"
                  value={newMethodName}
                  onChange={(e) => setNewMethodName(e.target.value)}
                  placeholder="e.g., Chase Credit Card"
                />
              </div>

              <Button
                onClick={handleAddPaymentMethod}
                disabled={isLoading || !newMethodName.trim()}
                size="sm"
                className="w-full"
              >
                {isLoading ? 'Adding...' : 'Add Payment Method'}
              </Button>
            </div>
          )}

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end space-x-3 mt-6">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || !amount || !selectedPaymentMethod}
            className="min-w-[100px]"
          >
            {isLoading ? 'Processing...' : 'Mark Paid'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 