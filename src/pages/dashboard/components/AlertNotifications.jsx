import React, { useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertNotifications = ({ bills = [], dismissedAlerts = new Set(), onDismiss, onViewBill }) => {
  // Generate real alerts from bills data
  const alertsToShow = useMemo(() => {
    if (!bills || bills.length === 0) return [];

    const alerts = [];
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    bills.forEach((bill) => {
      const dueDate = new Date(bill.dueDate);
      const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

      // Overdue bills
      if (bill.status !== 'paid' && dueDate < today) {
        const daysOverdue = Math.abs(daysUntilDue);
        alerts.push({
          id: `overdue-${bill.id}`,
          type: 'overdue',
          title: 'Overdue Bill',
          message: `${bill.name} is ${daysOverdue} day${daysOverdue > 1 ? 's' : ''} overdue`,
          billId: bill.id,
          priority: 'high',
          timestamp: dueDate,
          amount: bill.amount
        });
      }
      // Due tomorrow
      else if (bill.status !== 'paid' && dueDate.toDateString() === tomorrow.toDateString()) {
        alerts.push({
          id: `due-tomorrow-${bill.id}`,
          type: 'due_soon',
          title: 'Due Tomorrow',
          message: `${bill.name} payment due tomorrow`,
          billId: bill.id,
          priority: 'high',
          timestamp: dueDate,
          amount: bill.amount
        });
      }
      // Due in 3 days
      else if (bill.status !== 'paid' && dueDate <= threeDaysFromNow && dueDate > tomorrow) {
        alerts.push({
          id: `due-soon-${bill.id}`,
          type: 'reminder',
          title: 'Payment Reminder',
          message: `${bill.name} due in ${Math.abs(daysUntilDue)} days`,
          billId: bill.id,
          priority: 'medium',
          timestamp: dueDate,
          amount: bill.amount
        });
      }
      // Due today
      else if (bill.status !== 'paid' && dueDate.toDateString() === today.toDateString()) {
        alerts.push({
          id: `due-today-${bill.id}`,
          type: 'due_today',
          title: 'Due Today',
          message: `${bill.name} payment is due today`,
          billId: bill.id,
          priority: 'high',
          timestamp: dueDate,
          amount: bill.amount
        });
      }
    });

    // Sort by priority and timestamp
    const sortedAlerts = alerts.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return a.timestamp - b.timestamp;
    });

    // Filter out dismissed alerts
    return sortedAlerts.filter(alert => !dismissedAlerts.has(alert.id));
  }, [bills, dismissedAlerts]);

  const getAlertStyles = (type, priority) => {
    switch (type) {
      case 'overdue':
        return {
          container: 'bg-red-50 border-red-200',
          icon: 'AlertTriangle',
          iconColor: '#DC2626',
          textColor: 'text-red-800'
        };
      case 'due_today':
        return {
          container: 'bg-red-50 border-red-200',
          icon: 'AlertCircle',
          iconColor: '#DC2626',
          textColor: 'text-red-800'
        };
      case 'due_soon':
        return {
          container: 'bg-amber-50 border-amber-200',
          icon: 'Clock',
          iconColor: '#D97706',
          textColor: 'text-amber-800'
        };
      default:
        return {
          container: 'bg-blue-50 border-blue-200',
          icon: 'Info',
          iconColor: '#1E40AF',
          textColor: 'text-blue-800'
        };
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = Math.abs(now - timestamp);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return timestamp > now ? 'Tomorrow' : 'Yesterday';
    return timestamp > now ? `In ${days} days` : `${days} days ago`;
  };

  if (!alertsToShow.length) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Notifications</h3>
        </div>
        <div className="text-center py-8">
          <Icon name="CheckCircle" size={48} color="#059669" className="mx-auto mb-3" />
          <p className="text-slate-600">All caught up! No pending notifications.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Notifications</h3>
        <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
          {alertsToShow.length}
        </span>
      </div>

      <div className="space-y-3">
        {alertsToShow.map((alert) => {
          const styles = getAlertStyles(alert.type, alert.priority);
          
          return (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border ${styles.container} transition-all duration-200`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Icon name={styles.icon} size={20} color={styles.iconColor} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${styles.textColor}`}>
                      {alert.title}
                    </h4>
                    <span className="text-xs text-slate-500">
                      {formatTimestamp(alert.timestamp)}
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${styles.textColor} opacity-90`}>
                    {alert.message}
                  </p>
                  
                  <div className="flex items-center space-x-2 mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewBill && onViewBill(alert.billId)}
                      className={`${styles.textColor} hover:bg-white hover:bg-opacity-50`}
                    >
                      View Bill
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDismiss && onDismiss(alert.id)}
                      iconName="X"
                      iconSize={14}
                      className="text-slate-500 hover:text-slate-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertNotifications;