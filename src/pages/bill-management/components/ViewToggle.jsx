import React from 'react';

import Button from '../../../components/ui/Button';

const ViewToggle = ({ currentView, onViewChange }) => {
  return (
    <div className="flex items-center bg-muted rounded-lg p-1">
      <Button
        variant={currentView === 'cards' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('cards')}
        iconName="Grid3X3"
        iconSize={16}
        className="rounded-md"
      >
        <span className="hidden sm:inline ml-2">Cards</span>
      </Button>
      <Button
        variant={currentView === 'table' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('table')}
        iconName="List"
        iconSize={16}
        className="rounded-md"
      >
        <span className="hidden sm:inline ml-2">Table</span>
      </Button>
    </div>
  );
};

export default ViewToggle;