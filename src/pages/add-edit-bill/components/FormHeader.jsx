import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const FormHeader = () => {
  const [searchParams] = useSearchParams();
  const billId = searchParams.get('id');
  const isEditMode = Boolean(billId);

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mr-4">
          <Icon 
            name={isEditMode ? "Edit" : "Plus"} 
            size={24} 
            className="text-primary" 
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isEditMode ? 'Edit Bill' : 'Add New Bill'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditMode 
              ? 'Update your bill information and settings'
              : 'Create a new bill with payment details and recurring options'
            }
          </p>
        </div>
      </div>
      
      {/* Progress Indicator */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-foreground font-medium">
              {isEditMode ? 'Editing' : 'Creating'} Bill
            </span>
          </div>
          <span className="text-muted-foreground">
            Fill in the required information below
          </span>
        </div>
      </div>
    </div>
  );
};

export default FormHeader;