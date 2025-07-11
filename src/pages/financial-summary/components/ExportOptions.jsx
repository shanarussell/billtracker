import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ExportOptions = ({ onExport }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [dateRange, setDateRange] = useState('current-month');

  const formatOptions = [
    { value: 'pdf', label: 'PDF Report' },
    { value: 'csv', label: 'CSV Data' },
    { value: 'excel', label: 'Excel Spreadsheet' }
  ];

  const dateRangeOptions = [
    { value: 'current-month', label: 'Current Month' },
    { value: 'last-3-months', label: 'Last 3 Months' },
    { value: 'last-6-months', label: 'Last 6 Months' },
    { value: 'current-year', label: 'Current Year' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport({ format: exportFormat, dateRange });
      // Simulate export process
      setTimeout(() => {
        setIsExporting(false);
      }, 2000);
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Download" size={20} color="var(--color-primary)" />
        <h3 className="text-lg font-semibold text-foreground">Export Data</h3>
      </div>
      
      <div className="space-y-4">
        <Select
          label="Export Format"
          options={formatOptions}
          value={exportFormat}
          onChange={setExportFormat}
        />
        
        <Select
          label="Date Range"
          options={dateRangeOptions}
          value={dateRange}
          onChange={setDateRange}
        />
        
        <Button
          variant="default"
          onClick={handleExport}
          loading={isExporting}
          iconName="Download"
          iconPosition="left"
          iconSize={16}
          fullWidth
        >
          {isExporting ? 'Exporting...' : 'Export Report'}
        </Button>
      </div>
      
      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground">
          <Icon name="Info" size={14} className="inline mr-1" />
          Exported data includes all bills, payments, and financial summaries for the selected period.
        </p>
      </div>
    </div>
  );
};

export default ExportOptions;