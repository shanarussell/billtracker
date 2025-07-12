import React, { useState } from 'react';
import Button from './Button';
import Icon from '../AppIcon';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, bill, isRecurring }) => {
  const [deleteOption, setDeleteOption] = useState('single'); // 'single' or 'all'

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(deleteOption);
    onClose();
    setDeleteOption('single'); // Reset for next use
  };

  const handleCancel = () => {
    onClose();
    setDeleteOption('single'); // Reset for next use
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0">
            <Icon name="AlertTriangle" size={24} className="text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Delete Bill</h3>
            <p className="text-sm text-slate-600">This action cannot be undone.</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-slate-700 mb-4">
            Are you sure you want to delete <strong>"{bill?.name}"</strong>?
          </p>

          {isRecurring && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-800 mb-2">
                    This appears to be a recurring bill
                  </p>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="single"
                        checked={deleteOption === 'single'}
                        onChange={(e) => setDeleteOption(e.target.value)}
                        className="text-amber-600"
                      />
                      <span className="text-sm text-amber-700">
                        Delete only this instance
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="all"
                        checked={deleteOption === 'all'}
                        onChange={(e) => setDeleteOption(e.target.value)}
                        className="text-amber-600"
                      />
                      <span className="text-sm text-amber-700">
                        Delete all future occurrences
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            className="flex-1 sm:flex-none"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal; 