import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FormTips = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const tips = [
    {
      icon: 'Lightbulb',
      title: 'Recurring Bills',
      description: 'Set up recurring bills for automatic tracking of monthly payments like utilities, loans, and subscriptions.'
    },
    {
      icon: 'Calendar',
      title: 'Due Date Reminders',
      description: 'Choose how many days before the due date you want to be reminded about upcoming payments.'
    },
    {
      icon: 'CreditCard',
      title: 'Payment Methods',
      description: 'Select the payment method you use for each bill to better track your spending across different accounts.'
    },
    {
      icon: 'Tag',
      title: 'Categories',
      description: 'Organize your bills by category to get better insights into your spending patterns and budget allocation.'
    },
    {
      icon: 'FileText',
      title: 'Notes',
      description: 'Add notes to remember important details like account numbers, customer service info, or seasonal variations.'
    }
  ];

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Icon name="Info" size={20} className="text-blue-600 mr-2" />
          <h3 className="font-medium text-blue-900">Helpful Tips</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
          className="text-blue-700 hover:text-blue-800"
        >
          {isExpanded ? 'Hide' : 'Show'} Tips
        </Button>
      </div>
      
      {isExpanded && (
        <div className="mt-4 space-y-3">
          {tips.map((tip, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-0.5">
                <Icon name={tip.icon} size={16} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900 text-sm">{tip.title}</h4>
                <p className="text-blue-700 text-sm mt-1">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormTips;