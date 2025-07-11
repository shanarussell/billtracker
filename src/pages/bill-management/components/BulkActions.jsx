import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActions = ({ selectedCount, onMarkAllPaid, onMarkAllUnpaid, onDeleteSelected, onClearSelection }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Icon name="CheckSquare" size={20} className="text-primary" />
          <span className="font-medium text-foreground">
            {selectedCount} bill{selectedCount > 1 ? 's' : ''} selected
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onMarkAllPaid}
            iconName="CheckCircle"
            iconPosition="left"
            iconSize={16}
          >
            Mark as Paid
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onMarkAllUnpaid}
            iconName="Circle"
            iconPosition="left"
            iconSize={16}
          >
            Mark as Unpaid
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={onDeleteSelected}
            iconName="Trash2"
            iconPosition="left"
            iconSize={16}
          >
            Delete Selected
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            iconName="X"
            iconPosition="left"
            iconSize={16}
          >
            Clear Selection
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;