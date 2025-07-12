import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import MonthNavigator from '../../components/ui/MonthNavigator';
import MetricsCard from './components/MetricsCard';
import SpendingBreakdown from './components/SpendingBreakdown';
import CashFlowChart from './components/CashFlowChart';
import BillTimeline from './components/BillTimeline';
import ComparisonCard from './components/ComparisonCard';
import ExportOptions from './components/ExportOptions';
import AlertNotifications from './components/AlertNotifications';

const FinancialSummary = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDateRange, setSelectedDateRange] = useState('current-month');

  // Mock financial data
  const mockFinancialData = {
    currentMonth: {
      income: 5500.00,
      expenses: 3850.75,
      balance: 1649.25,
      savingsRate: 30
    },
    previousMonth: {
      income: 5200.00,
      expenses: 4100.50,
      balance: 1099.50,
      savingsRate: 21
    },
    spendingByMethod: [
      { name: "AFCU", value: 1250.00, total: 3850.75 },
      { name: "Discover", value: 890.25, total: 3850.75 },
      { name: "Apple Card", value: 675.50, total: 3850.75 },
      { name: "Chase Card", value: 520.00, total: 3850.75 },
      { name: "Care Credit", value: 315.00, total: 3850.75 },
      { name: "HEB Card", value: 200.00, total: 3850.75 }
    ],
    spendingByCategory: [
      { name: "Housing", value: 1500.00, total: 3850.75 },
      { name: "Utilities", value: 450.75, total: 3850.75 },
      { name: "Transportation", value: 380.00, total: 3850.75 },
      { name: "Food", value: 520.00, total: 3850.75 },
      { name: "Healthcare", value: 315.00, total: 3850.75 },
      { name: "Entertainment", value: 285.00, total: 3850.75 },
      { name: "Shopping", value: 400.00, total: 3850.75 }
    ],
    cashFlowData: [
      { month: "Jan", income: 5200, expenses: 4100 },
      { month: "Feb", income: 5300, expenses: 3950 },
      { month: "Mar", income: 5100, expenses: 4200 },
      { month: "Apr", income: 5400, expenses: 3800 },
      { month: "May", income: 5250, expenses: 4050 },
      { month: "Jun", income: 5500, expenses: 3850 }
    ]
  };

  const mockBills = [
    {
      id: 1,
      name: "Rent Payment",
      amount: 1500.00,
      dueDate: "2024-07-15",
      status: "unpaid",
      paymentMethod: "AFCU"
    },
    {
      id: 2,
      name: "Electric Bill",
      amount: 125.50,
      dueDate: "2024-07-12",
      status: "paid",
      paymentMethod: "Discover"
    },
    {
      id: 3,
      name: "Internet Service",
      amount: 89.99,
      dueDate: "2024-07-18",
      status: "unpaid",
      paymentMethod: "Apple Card"
    },
    {
      id: 4,
      name: "Car Insurance",
      amount: 156.75,
      dueDate: "2024-07-08",
      status: "overdue",
      paymentMethod: "Chase Card"
    },
    {
      id: 5,
      name: "Phone Bill",
      amount: 85.00,
      dueDate: "2024-07-20",
      status: "unpaid",
      paymentMethod: "AFCU"
    },
    {
      id: 6,
      name: "Streaming Services",
      amount: 45.97,
      dueDate: "2024-07-25",
      status: "unpaid",
      paymentMethod: "Apple Card"
    }
  ];

  const mockAlerts = [
    {
      id: 1,
      type: "overdue",
      title: "Overdue Payment",
      message: "Car Insurance payment is 2 days overdue",
      amount: 156.75,
      billId: 4
    },
    {
      id: 2,
      type: "due-soon",
      title: "Payment Due Soon",
      message: "Electric Bill due in 2 days",
      amount: 125.50,
      billId: 2
    },
    {
      id: 3,
      type: "budget-exceeded",
      title: "Budget Alert",
      message: "Entertainment spending exceeded monthly budget by 15%",
      amount: 285.00
    }
  ];

  const [alerts, setAlerts] = useState(mockAlerts);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login-screen');
      return;
    }
  }, [navigate]);

  const handleMonthChange = (month) => {
    setCurrentMonth(month);
  };

  const handleBillClick = (bill) => {
    // Navigate to dashboard instead of bills page
    // navigate('/bill-management', { state: { selectedBill: bill } });
  };

  const handleViewBill = (bill) => {
    // Since we removed the bills page, we'll stay on dashboard
    // The dashboard already shows all bills and deposits
  };

  const handleDismissAlert = (alertId) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const handleExport = async ({ format, dateRange }) => {
    // Mock export functionality
    console.log(`Exporting ${format} for ${dateRange}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  };

  const { currentMonth: currentData, previousMonth: previousData } = mockFinancialData;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <Breadcrumb />
        
        {/* Month Navigator */}
        <div className="mb-6">
          <MonthNavigator 
            currentMonth={currentMonth}
            onMonthChange={handleMonthChange}
          />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricsCard
            title="Monthly Income"
            amount={currentData.income}
            icon="TrendingUp"
            trend="up"
            trendValue="5.8"
            variant="income"
          />
          <MetricsCard
            title="Total Expenses"
            amount={currentData.expenses}
            icon="TrendingDown"
            trend="down"
            trendValue="6.1"
            variant="expense"
          />
          <MetricsCard
            title="Remaining Balance"
            amount={currentData.balance}
            icon="Wallet"
            trend="up"
            trendValue="50.0"
            variant="balance"
          />
          <MetricsCard
            title="Savings Rate"
            amount={currentData.savingsRate}
            icon="PiggyBank"
            trend="up"
            trendValue="42.9"
            variant="default"
          />
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="mb-6">
            <AlertNotifications
              alerts={alerts}
              onDismiss={handleDismissAlert}
              onViewBill={handleViewBill}
            />
          </div>
        )}

        {/* Charts and Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SpendingBreakdown
            data={mockFinancialData.spendingByMethod}
            title="Spending by Payment Method"
          />
          <SpendingBreakdown
            data={mockFinancialData.spendingByCategory}
            title="Spending by Category"
          />
        </div>

        {/* Cash Flow Chart */}
        <div className="mb-6">
          <CashFlowChart data={mockFinancialData.cashFlowData} />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bill Timeline */}
          <div className="lg:col-span-2">
            <BillTimeline
              bills={mockBills}
              onBillClick={handleBillClick}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Comparison Cards */}
            <div className="space-y-4">
              <ComparisonCard
                title="Monthly Income"
                currentValue={currentData.income}
                previousValue={previousData.income}
                period="Month"
              />
              <ComparisonCard
                title="Monthly Expenses"
                currentValue={currentData.expenses}
                previousValue={previousData.expenses}
                period="Month"
              />
              <ComparisonCard
                title="Net Balance"
                currentValue={currentData.balance}
                previousValue={previousData.balance}
                period="Month"
              />
            </div>

            {/* Export Options */}
            <ExportOptions onExport={handleExport} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default FinancialSummary;