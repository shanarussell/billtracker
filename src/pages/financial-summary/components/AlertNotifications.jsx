import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertNotifications = ({ alerts, onDismiss, onViewBill }) => {
  const getAlertIcon = (type) => {
    switch (type) {
      case 'overdue':
        return 'AlertTriangle';
      case 'budget-exceeded':
        return 'TrendingUp';
      case 'unusual-spending':
        return 'Eye';
      case 'due-soon':
        return 'Clock';
      default:
        return 'Bell';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'overdue':
        return 'text-error border-error/20 bg-error/5';
      case 'budget-exceeded':
        return 'text-warning border-warning/20 bg-warning/5';
      case 'unusual-spending':
        return 'text-accent border-accent/20 bg-accent/5';
      case 'due-soon':
        return 'text-warning border-warning/20 bg-warning/5';
      default:
        return 'text-muted-foreground border-border bg-card';
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Shield" size={20} color="var(--color-success)" />
          <h3 className="text-lg font-semibold text-foreground">All Clear</h3>
        </div>
        <p className="text-muted-foreground">No financial alerts at this time.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Bell" size={20} color="var(--color-warning)" />
          <h3 className="text-lg font-semibold text-foreground">Alerts</h3>
          <span className="bg-warning text-warning-foreground text-xs px-2 py-1 rounded-full">
            {alerts.length}
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => alerts.forEach(alert => onDismiss(alert.id))}
          iconName="X"
          iconSize={16}
        >
          Dismiss All
        </Button>
      </div>
      
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`flex items-start justify-between p-3 rounded-lg border ${getAlertColor(alert.type)}`}
          >
            <div className="flex items-start space-x-3">
              <Icon name={getAlertIcon(alert.type)} size={20} />
              <div>
                <p className="font-medium text-foreground">{alert.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                {alert.amount && (
                  <p className="text-sm font-semibold mt-1">
                    ${alert.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {alert.billId && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewBill(alert.billId)}
                  iconName="ExternalLink"
                  iconSize={14}
                />
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDismiss(alert.id)}
                iconName="X"
                iconSize={14}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertNotifications;