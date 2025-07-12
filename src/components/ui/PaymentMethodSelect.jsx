import React, { useState } from 'react';
import { ChevronDown, Trash2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import Button from './Button';
import Icon from '../AppIcon';

const PaymentMethodSelect = ({
  value,
  onChange,
  options = [],
  placeholder = "Select payment method",
  disabled = false,
  onDeleteMethod,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Filter out the placeholder option for display
  const displayOptions = options.filter(option => option.value !== '');

  const getSelectedDisplay = () => {
    if (!value) return placeholder;
    const selectedOption = options.find(opt => opt.value === value);
    return selectedOption ? selectedOption.label : placeholder;
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionSelect = (option) => {
    onChange?.(option.value);
    setIsOpen(false);
  };

  const handleDelete = (e, option) => {
    e.stopPropagation();
    if (onDeleteMethod) {
      onDeleteMethod(option.value);
    }
  };

  const isSelected = (optionValue) => {
    return value === optionValue;
  };

  return (
    <div className="relative">
      <button
        type="button"
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-white text-black px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          !value && "text-muted-foreground"
        )}
        onClick={handleToggle}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        {...props}
      >
        <span className="truncate">{getSelectedDisplay()}</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white text-black border border-border rounded-md shadow-md">
          <div className="py-1 max-h-60 overflow-auto">
            {displayOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No payment methods available
              </div>
            ) : (
              displayOptions.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                    isSelected(option.value) && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => handleOptionSelect(option)}
                >
                  <span className="flex-1">{option.label}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 ml-2 hover:bg-red-100 hover:text-red-600"
                    onClick={(e) => handleDelete(e, option)}
                    title="Delete payment method"
                  >
                    <Icon name="Trash2" size={14} />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelect; 