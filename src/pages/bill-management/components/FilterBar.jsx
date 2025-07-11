import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const FilterBar = ({ 
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange, 
  sortBy, 
  onSortChange,
  totalCount,
  filteredCount,
  onClearFilters
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Bills' },
    { value: 'paid', label: 'Paid' },
    { value: 'unpaid', label: 'Unpaid' },
    { value: 'overdue', label: 'Overdue' }
  ];

  const sortOptions = [
    { value: 'dueDate', label: 'Due Date' },
    { value: 'amount', label: 'Amount' },
    { value: 'name', label: 'Name' }
  ];

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || sortBy !== 'dueDate';

  return (
    <div className="bg-card border rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search bills..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Status Filter */}
          <div className="min-w-[140px]">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="min-w-[120px]">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count and Clear Filters */}
        <div className="flex items-center justify-between lg:justify-end gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {filteredCount} of {totalCount} bills
          </div>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
              iconSize={16}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
          {searchTerm && (
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-sm">
              <Icon name="Search" size={14} />
              <span>"{searchTerm}"</span>
              <button
                onClick={() => onSearchChange('')}
                className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
          
          {statusFilter !== 'all' && (
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-sm">
              <Icon name="Filter" size={14} />
              <span>{statusOptions.find(opt => opt.value === statusFilter)?.label}</span>
              <button
                onClick={() => onStatusFilterChange('all')}
                className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
          
          {sortBy !== 'dueDate' && (
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-sm">
              <Icon name="ArrowUpDown" size={14} />
              <span>Sort: {sortOptions.find(opt => opt.value === sortBy)?.label}</span>
              <button
                onClick={() => onSortChange('dueDate')}
                className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBar;