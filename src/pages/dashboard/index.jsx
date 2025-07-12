import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import billService from '../../utils/billService';
import depositService from '../../utils/depositService';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import MetricsCard from './components/MetricsCard';
import UpcomingBillCard from './components/UpcomingBillCard';
import QuickActions from './components/QuickActions';
import AlertNotifications from './components/AlertNotifications';
import PaymentModal from '../../components/ui/PaymentModal';
import DepositModal from '../../components/ui/DepositModal';
import DepositCard from '../bill-management/components/DepositCard';
import FinancialItemCard from './components/FinancialItemCard';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, userProfile, loading: authLoading } = useAuth();
  const [bills, setBills] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, bill: null });
  const [depositModal, setDepositModal] = useState({ isOpen: false });

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      if (!user?.id || authLoading) return;

      try {
        setLoading(true);
        setError(null);

        // Load bills, deposits, and metrics
        const billsResult = await billService.getBills(user.id);
        const depositsResult = await depositService.getDeposits(user.id);
        const metricsResult = await billService.getFinancialMetrics(user.id);

        if (!isMounted) return;

        if (billsResult?.success) {
          setBills(billsResult.data);
        } else {
          setError(billsResult?.error || 'Failed to load bills');
        }

        if (depositsResult?.success) {
          setDeposits(depositsResult.data);
        } else {
          setError(depositsResult?.error || 'Failed to load deposits');
        }

        if (metricsResult?.success) {
          setMetrics(metricsResult.data);
        } else {
          setError(metricsResult?.error || 'Failed to load financial metrics');
        }
      } catch (error) {
        if (isMounted) {
          setError('Failed to load dashboard data');
          console.log('Dashboard load error:', error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboardData();

    // Reload data every 5 minutes to ensure overdue status is current
    const interval = setInterval(loadDashboardData, 5 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [user?.id, authLoading]);

  const handleTogglePayment = async (billId) => {
    const bill = bills.find(b => b.id === billId);
    if (!bill) return;

    // If bill is already paid, just toggle it to unpaid
    if (bill.isPaid) {
      try {
        const result = await billService.toggleBillPayment(billId, false);
        
        if (result?.success) {
          setBills(prevBills =>
            prevBills.map(b =>
              b.id === billId
                ? { ...b, isPaid: false, status: 'unpaid', isOverdue: b.isOverdue }
                : b
            )
          );
          
          // Reload metrics
          const metricsResult = await billService.getFinancialMetrics(user.id);
          if (metricsResult?.success) {
            setMetrics(metricsResult.data);
          }
        } else {
          setError(result?.error || 'Failed to update payment status');
        }
      } catch (error) {
        setError('Failed to update payment status');
        console.log('Toggle payment error:', error);
      }
    } else {
      // If bill is unpaid, show payment modal
      setPaymentModal({ isOpen: true, bill });
    }
  };

  const handlePaymentConfirm = async (paymentDetails) => {
    try {
      const result = await billService.markBillAsPaid(paymentModal.bill.id, paymentDetails);
      
      if (result?.success) {
        setBills(prevBills => 
          prevBills.map(b => 
            b.id === paymentModal.bill.id 
              ? { 
                  ...b, 
                  isPaid: true, 
                  status: 'paid',
                  paymentMethod: paymentDetails.paymentMethodName
                }
              : b
          )
        );
        
        // Reload metrics
        const metricsResult = await billService.getFinancialMetrics(user.id);
        if (metricsResult?.success) {
          setMetrics(metricsResult.data);
        }
      } else {
        setError(result?.error || 'Failed to mark bill as paid');
      }
    } catch (error) {
      setError('Failed to mark bill as paid');
      console.log('Payment error:', error);
    }
  };

  const handleEditBill = (billId) => {
    navigate(`/add-edit-bill?id=${billId}`);
  };

  const handleViewAllBills = () => {
    navigate('/bill-management');
  };

  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());

  const handleDismissAlert = (alertId) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
  };

  const handleViewBillFromAlert = (billId) => {
    navigate(`/bill-management?highlight=${billId}`);
  };

  const handleAddDeposit = () => {
    setDepositModal({ isOpen: true });
  };

  const handleDepositConfirm = async (depositData) => {
    try {
      const result = await depositService.createDeposit(user.id, depositData);
      
      if (result?.success) {
        setDeposits(prev => [result.data, ...prev]);
        
        // Reload metrics to update available funds
        const metricsResult = await billService.getFinancialMetrics(user.id);
        if (metricsResult?.success) {
          setMetrics(metricsResult.data);
        }
      } else {
        setError(result?.error || 'Failed to add deposit');
      }
    } catch (error) {
      setError('Failed to add deposit');
      console.log('Deposit error:', error);
    }
  };

  const handleDeleteDeposit = async (depositId) => {
    try {
      const result = await depositService.deleteDeposit(depositId);
      
      if (result?.success) {
        setDeposits(prev => prev.filter(deposit => deposit.id !== depositId));
        
        // Reload metrics to update available funds
        const metricsResult = await billService.getFinancialMetrics(user.id);
        if (metricsResult?.success) {
          setMetrics(metricsResult.data);
        }
      } else {
        setError(result?.error || 'Failed to delete deposit');
      }
    } catch (error) {
      setError('Failed to delete deposit');
      console.log('Delete deposit error:', error);
    }
  };

  // Get overdue bills (bills that are overdue)
  const overdueBills = bills
    ?.filter(bill => bill.isOverdue)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)) || [];

  // Get upcoming bills (bills that are not overdue, next 5)
  const upcomingBills = bills
    ?.filter(bill => !bill.isOverdue)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5) || [];

  // Combine deposits and bills into a single list sorted by date
  const allFinancialItems = [
    ...deposits.map(deposit => ({
      ...deposit,
      type: 'deposit',
      displayDate: deposit.deposit_date,
      amount: parseFloat(deposit.amount),
      isPositive: true
    })),
    ...bills.map(bill => ({
      ...bill,
      type: 'bill',
      displayDate: bill.dueDate,
      amount: parseFloat(bill.amount),
      isPositive: false
    }))
  ].sort((a, b) => new Date(a.displayDate) - new Date(b.displayDate)).slice(0, 8);

  // Show loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Icon name="Loader2" size={32} className="animate-spin mx-auto mb-4 text-primary" />
              <p className="text-slate-600">Loading dashboard...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Icon name="AlertCircle" size={32} className="mx-auto mb-4 text-red-500" />
              <p className="text-slate-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Breadcrumb />
        
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {userProfile?.full_name || user?.email?.split('@')[0] || 'User'}!
          </h1>
          <p className="text-slate-600">
            Here's your financial overview for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricsCard
            title="Total Deposits"
            amount={`$${(metrics?.totalDeposits || 0).toFixed(2)}`}
            icon="DollarSign"
            variant="success"
            trend="up"
            trendValue="Income added"
          />
          <MetricsCard
            title="Total Bills Due"
            amount={`$${(metrics?.totalDue || 0).toFixed(2)}`}
            icon="Receipt"
            variant="default"
          />
          <MetricsCard
            title="Total Paid"
            amount={`$${(metrics?.totalPaid || 0).toFixed(2)}`}
            icon="CheckCircle"
            variant="success"
            trend="up"
            trendValue="Payment progress"
          />
          <MetricsCard
            title="Remaining Balance"
            amount={`$${(metrics?.remainingBalance || 0).toFixed(2)}`}
            icon="AlertCircle"
            variant={(metrics?.remainingBalance || 0) > 0 ? "warning" : "success"}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Financial Items */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">
                  Financial Items
                </h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddDeposit}
                    iconName="Plus"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Add Deposit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleViewAllBills}
                    iconName="ArrowRight"
                    iconPosition="right"
                    iconSize={16}
                  >
                    View All
                  </Button>
                </div>
              </div>

              {allFinancialItems?.length > 0 ? (
                <div className="space-y-4">
                  {allFinancialItems.map((item) => (
                    <FinancialItemCard
                      key={`${item.type}-${item.id}`}
                      item={item}
                      onTogglePayment={handleTogglePayment}
                      onEdit={handleEditBill}
                      onDelete={handleDeleteDeposit}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Icon name="Calendar" size={48} color="#64748B" className="mx-auto mb-3" />
                  <p className="text-slate-600">No financial items</p>
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/add-edit-bill')}
                    >
                      Add Your First Bill
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddDeposit}
                    >
                      Add Deposit
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <QuickActions onAddDeposit={handleAddDeposit} />

            {/* Alert Notifications */}
            <AlertNotifications
              bills={bills}
              dismissedAlerts={dismissedAlerts}
              onDismiss={handleDismissAlert}
              onViewBill={handleViewBillFromAlert}
            />
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-8 bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Monthly Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">{bills?.length || 0}</p>
              <p className="text-sm text-slate-600">Total Bills</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {bills?.filter(bill => bill.isPaid).length || 0}
              </p>
              <p className="text-sm text-slate-600">Paid</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">
                {bills?.filter(bill => !bill.isPaid && !bill.isOverdue).length || 0}
              </p>
              <p className="text-sm text-slate-600">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {bills?.filter(bill => bill.isOverdue).length || 0}
                {/* Debug: {bills?.length || 0} total bills, {bills?.filter(bill => bill.isPaid).length || 0} paid */}
              </p>
              <p className="text-sm text-slate-600">Overdue</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{deposits?.length || 0}</p>
              <p className="text-sm text-slate-600">Deposits</p>
            </div>
          </div>
        </div>
      </main>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ isOpen: false, bill: null })}
        onConfirm={handlePaymentConfirm}
        bill={paymentModal.bill}
        currentUser={user}
      />

      {/* Deposit Modal */}
      <DepositModal
        isOpen={depositModal.isOpen}
        onClose={() => setDepositModal({ isOpen: false })}
        onConfirm={handleDepositConfirm}
        currentUser={user}
      />
    </div>
  );
};

export default Dashboard;