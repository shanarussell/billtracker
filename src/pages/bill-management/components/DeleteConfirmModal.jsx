import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, billName, isMultiple = false, count = 1 }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-card border rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
            <Icon name="AlertTriangle" size={20} className="text-destructive" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {isMultiple ? 'Delete Bills' : 'Delete Bill'}
            </h3>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone
            </p>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-foreground">
            {isMultiple 
              ? `Are you sure you want to delete ${count} selected bills? This will permanently remove them from your account.`
              : `Are you sure you want to delete "${billName}"? This will permanently remove it from your account.`
            }
          </p>
        </div>
        
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            iconName="Trash2"
            iconPosition="left"
            iconSize={16}
            className="sm:w-auto"
          >
            {isMultiple ? `Delete ${count} Bills` : 'Delete Bill'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;