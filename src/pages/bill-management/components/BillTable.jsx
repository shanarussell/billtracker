import React from 'react';
import Button from '../../../components/ui/Button';
import { formatDate } from '../../../utils/cn';

const BillTable = ({ bills, onTogglePayment, onEdit, onDelete, onSelect, selectedBills, onSelectAll }) => {
  const getStatusBadge = (status, dueDate) => {
    if (status === 'paid') {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Paid</span>;
    }
    
    const today = new Date();
    const due = new Date(dueDate);
    if (due < today) {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Overdue</span>;
    }
    
    return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
  };



  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const isAllSelected = bills.length > 0 && selectedBills.length === bills.length;
  const isIndeterminate = selectedBills.length > 0 && selectedBills.length < bills.length;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="text-left p-4">
              <input
                type="checkbox"
                checked={isAllSelected}
                ref={input => {
                  if (input) input.indeterminate = isIndeterminate;
                }}
                onChange={onSelectAll}
                className="rounded border-border focus:ring-2 focus:ring-primary"
              />
            </th>
            <th className="text-left p-4 font-semibold text-foreground">Bill Name</th>
            <th className="text-left p-4 font-semibold text-foreground">Amount</th>
            <th className="text-left p-4 font-semibold text-foreground">Due Date</th>

            <th className="text-left p-4 font-semibold text-foreground">Status</th>
            <th className="text-left p-4 font-semibold text-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill) => (
            <tr key={bill.id} className="border-b hover:bg-muted/30 transition-colors duration-200">
              <td className="p-4">
                <input
                  type="checkbox"
                  checked={selectedBills.includes(bill.id)}
                  onChange={() => onSelect(bill.id)}
                  className="rounded border-border focus:ring-2 focus:ring-primary"
                />
              </td>
              <td className="p-4">
                <div>
                  <p className="font-semibold text-foreground">{bill.name}</p>
                  <p className="text-sm text-muted-foreground">{bill.category}</p>
                </div>
              </td>
              <td className="p-4 font-semibold text-foreground">{formatAmount(bill.amount)}</td>
              <td className="p-4 text-foreground">{formatDate(bill.dueDate)}</td>
              <td className="p-4">{getStatusBadge(bill.status, bill.dueDate)}</td>
              <td className="p-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant={bill.status === 'paid' ? 'success' : 'outline'}
                    size="sm"
                    onClick={() => onTogglePayment(bill.id)}
                    iconName={bill.status === 'paid' ? 'CheckCircle' : 'Circle'}
                    iconPosition="left"
                    iconSize={16}
                  >
                    {bill.status === 'paid' ? 'Paid' : 'Pay'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(bill)}
                    iconName="Edit"
                    iconSize={16}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(bill.id)}
                    iconName="Trash2"
                    iconSize={16}
                    className="text-destructive hover:text-destructive"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BillTable;