import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import billService from '../../utils/billService';
import depositService from '../../utils/depositService';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import MonthNavigator from '../../components/ui/MonthNavigator';
import Button from '../../components/ui/Button';
import BillCard from './components/BillCard';
import BillTable from './components/BillTable';
import FilterBar from './components/FilterBar';
import BulkActions from './components/BulkActions';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import PaymentModal from '../../components/ui/PaymentModal';
import DepositModal from '../../components/ui/DepositModal';
import DepositCard from './components/DepositCard';
import ViewToggle from './components/ViewToggle';
import Icon from '../../components/AppIcon';

const BillManagement = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  
  // State management
  const [bills, setBills] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [selectedBills, setSelectedBills] = useState([]);
  const [currentView, setCurrentView] = useState('cards');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, billId: null, billName: '', isMultiple: false });
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, bill: null });
  const [depositModal, setDepositModal] = useState({ isOpen: false });
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // Debug deposits state changes
  useEffect(() => {
    console.log('🔍 Debug - Deposits state changed:', deposits);
  }, [deposits]);

  // Load bills
  useEffect(() => {
    let isMounted = true;

    const loadBills = async () => {
      if (!user?.id || authLoading) return;

      try {
        setLoading(true);
        setError(null);

        const billsResult = await billService.getBills(user.id);
        const depositsResult = await depositService.getDeposits(user.id);

        if (!isMounted) return;

        console.log('🔍 Debug - Bills result:', billsResult);
        console.log('🔍 Debug - Deposits result:', depositsResult);
        console.log('🔍 Debug - User ID:', user?.id);
        console.log('🔍 Debug - User object:', user);

        if (billsResult?.success) {
          setBills(billsResult.data || []);
          console.log('✅ Bills loaded:', billsResult.data?.length || 0);
        } else {
          setError(billsResult?.error || 'Failed to load bills');
          console.log('❌ Bills error:', billsResult?.error);
        }

        if (depositsResult?.success) {
          setDeposits(depositsResult.data || []);
          console.log('✅ Deposits loaded:', depositsResult.data?.length || 0);
          console.log('📅 Deposits data:', depositsResult.data);
        } else {
          setError(depositsResult?.error || 'Failed to load deposits');
          console.log('❌ Deposits error:', depositsResult?.error);
        }
      } catch (error) {
        if (isMounted) {
          setError('Failed to load bills');
          console.log('Load bills error:', error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadBills();

    return () => {
      isMounted = false;
    };
  }, [user?.id, authLoading]);

  // Helper function to check if a date is in the selected month
  const isInSelectedMonth = (dateString) => {
    try {
      const date = new Date(dateString);
      // Reset time to start of day to avoid timezone issues
      const depositDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const selectedMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      
      const isInMonth = depositDate.getMonth() === selectedMonth.getMonth() && 
                        depositDate.getFullYear() === selectedMonth.getFullYear();
      
      // Debug logging for troubleshooting
      console.log(`Date: ${dateString}, Deposit Month: ${depositDate.getMonth()}, Deposit Year: ${depositDate.getFullYear()}, Selected Month: ${selectedMonth.getMonth()}, Selected Year: ${selectedMonth.getFullYear()}, IsInMonth: ${isInMonth}`);
      
      return isInMonth;
    } catch (error) {
      console.error('Error parsing date:', dateString, error);
      return false;
    }
  };

  // Filter and sort bills
  const filteredAndSortedBills = React.useMemo(() => {
    // First filter by month
    let monthFiltered = bills.filter(bill => isInSelectedMonth(bill.dueDate));
    
    // Then apply status filter
    let filtered = monthFiltered.filter(bill => {
      // Status filter
      let matchesStatus = true;
      if (statusFilter === 'paid') {
        matchesStatus = bill.status === 'paid';
      } else if (statusFilter === 'unpaid') {
        matchesStatus = bill.status === 'unpaid';
      } else if (statusFilter === 'overdue') {
        matchesStatus = bill.isOverdue;
      }
      
      return matchesStatus;
    });

    // Sort bills
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return (b?.amount || 0) - (a?.amount || 0);
        case 'name':
          return (a?.name || '').localeCompare(b?.name || '');
        case 'dueDate':
        default:
          return new Date(a?.dueDate || 0) - new Date(b?.dueDate || 0);
      }
    });

    return filtered;
  }, [bills, statusFilter, sortBy, currentMonth]);

  // Combine bills and deposits for table view (filtered by month)
  const combinedTableItems = React.useMemo(() => {
    console.log('🔍 Debug - Current deposits:', deposits);
    console.log('🔍 Debug - Current month:', currentMonth);
    console.log('🔍 Debug - Deposits state length:', deposits?.length || 0);
    
    const filteredDeposits = deposits.filter(deposit => {
      const isInMonth = isInSelectedMonth(deposit.deposit_date);
      console.log(`🔍 Debug - Deposit ${deposit.id}: ${deposit.deposit_date} - IsInMonth: ${isInMonth}`);
      return isInMonth;
    });
    
    const filteredBills = bills.filter(bill => isInSelectedMonth(bill.dueDate));
    
    console.log('🔍 Debug - Filtered deposits:', filteredDeposits);
    console.log('🔍 Debug - Filtered bills:', filteredBills);
    
    const depositItems = filteredDeposits.map(deposit => ({
      ...deposit,
      type: 'deposit',
      displayDate: deposit.deposit_date,
    }));
    const billItems = filteredBills.map(bill => ({
      ...bill,
      type: 'bill',
      displayDate: bill.dueDate,
    }));
    return [...depositItems, ...billItems].sort((a, b) => new Date(a.displayDate) - new Date(b.displayDate));
  }, [bills, deposits, currentMonth]);

  // Handle bill actions
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
                ? { ...b, isPaid: false, status: 'unpaid' }
                : b
            )
          );
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
      } else {
        setError(result?.error || 'Failed to mark bill as paid');
      }
    } catch (error) {
      setError('Failed to mark bill as paid');
      console.log('Payment error:', error);
    }
  };

  const handleEditBill = (bill) => {
    navigate('/add-edit-bill', { state: { bill } });
  };

  const handleDeleteBill = (billId) => {
    const bill = bills.find(b => b.id === billId);
    setDeleteModal({
      isOpen: true,
      billId,
      billName: bill?.name || '',
      isMultiple: false
    });
  };

  const confirmDelete = async () => {
    try {
      if (deleteModal.isMultiple) {
        // Delete multiple bills
        const deletePromises = selectedBills.map(billId => billService.deleteBill(billId));
        await Promise.all(deletePromises);
        
        setBills(prevBills => prevBills.filter(bill => !selectedBills.includes(bill.id)));
        setSelectedBills([]);
      } else {
        // Delete single bill
        const result = await billService.deleteBill(deleteModal.billId);
        
        if (result?.success) {
          setBills(prevBills => prevBills.filter(bill => bill.id !== deleteModal.billId));
        } else {
          setError(result?.error || 'Failed to delete bill');
        }
      }
    } catch (error) {
      setError('Failed to delete bill(s)');
      console.log('Delete bill error:', error);
    }
    
    setDeleteModal({ isOpen: false, billId: null, billName: '', isMultiple: false });
  };

  // Handle bill selection
  const handleSelectBill = (billId) => {
    setSelectedBills(prev => 
      prev.includes(billId) 
        ? prev.filter(id => id !== billId)
        : [...prev, billId]
    );
  };

  const handleSelectAll = () => {
    const allBillIds = filteredAndSortedBills.map(bill => bill.id);
    setSelectedBills(prev => 
      prev.length === allBillIds.length ? [] : allBillIds
    );
  };

  // Handle bulk actions
  const handleMarkAllPaid = async () => {
    // For now, show a message that individual payment is required
    setError('Please mark bills as paid individually to specify payment amounts and methods');
    setSelectedBills([]);
  };

  const handleMarkAllUnpaid = async () => {
    try {
      const updatePromises = selectedBills.map(billId => 
        billService.toggleBillPayment(billId, false)
      );
      await Promise.all(updatePromises);
      
      setBills(prevBills => 
        prevBills.map(bill => 
          selectedBills.includes(bill.id) 
            ? { ...bill, status: 'unpaid', isPaid: false }
            : bill
        )
      );
      setSelectedBills([]);
    } catch (error) {
      setError('Failed to mark bills as unpaid');
      console.log('Bulk mark unpaid error:', error);
    }
  };

  const handleDeleteSelected = () => {
    setDeleteModal({
      isOpen: true,
      billId: null,
      billName: '',
      isMultiple: true
    });
  };

  const handleClearSelection = () => {
    setSelectedBills([]);
  };

  // Handle filters
  const handleClearFilters = () => {
    setStatusFilter('all');
    setSortBy('dueDate');
  };

  const handleAddDeposit = () => {
    setDepositModal({ isOpen: true });
  };

  const handleDepositConfirm = async (depositData) => {
    try {
      console.log('🔍 Debug - Creating deposit with data:', depositData);
      const result = await depositService.createDeposit(user.id, depositData);
      
      console.log('🔍 Debug - Deposit creation result:', result);
      
      if (result?.success) {
        setDeposits(prev => [result.data, ...prev]);
        console.log('✅ Deposit created successfully:', result.data);
      } else {
        setError(result?.error || 'Failed to add deposit');
        console.log('❌ Deposit creation failed:', result?.error);
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
      } else {
        setError(result?.error || 'Failed to delete deposit');
      }
    } catch (error) {
      setError('Failed to delete deposit');
      console.log('Delete deposit error:', error);
    }
  };

  const handleMonthChange = (newMonth) => {
    // Ensure the month is set to the first day to avoid day-specific issues
    const firstDayOfMonth = new Date(newMonth.getFullYear(), newMonth.getMonth(), 1);
    setCurrentMonth(firstDayOfMonth);
  };

  // Responsive view handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCurrentView('cards');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Icon name="Loader2" size={32} className="animate-spin mx-auto mb-4 text-primary" />
              <p className="text-slate-600">Loading bills...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6">
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
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <Breadcrumb />
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Bill Management</h1>
            <p className="text-muted-foreground">
              Track and manage your monthly bills and payments
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View Toggle - Hidden on mobile */}
            <div className="hidden lg:block">
              <ViewToggle 
                currentView={currentView}
                onViewChange={setCurrentView}
              />
            </div>
            
            <Button
              variant="default"
              onClick={handleAddDeposit}
              iconName="DollarSign"
              iconPosition="left"
              iconSize={18}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Add Deposit
            </Button>
            
            {/* Test button for debugging */}
            <Button
              variant="outline"
              onClick={async () => {
                console.log('🔍 Debug - Creating test deposit...');
                const testDeposit = {
                  amount: 100,
                  source: 'Test Deposit',
                  depositDate: new Date().toISOString().split('T')[0],
                  notes: 'Test deposit for debugging'
                };
                await handleDepositConfirm(testDeposit);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Test Deposit
            </Button>
            
            <Button
              variant="default"
              onClick={() => navigate('/add-edit-bill')}
              iconName="Plus"
              iconPosition="left"
              iconSize={18}
            >
              Add New Bill
            </Button>
          </div>
        </div>

        {/* Month Navigator */}
        <div className="mb-6">
          <MonthNavigator
            currentMonth={currentMonth}
            onMonthChange={handleMonthChange}
          />
        </div>

        {/* Filter Bar */}
        <FilterBar
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalCount={bills?.length || 0}
          filteredCount={filteredAndSortedBills?.length || 0}
          onClearFilters={handleClearFilters}
        />

        {/* Bulk Actions */}
        <BulkActions
          selectedCount={selectedBills?.length || 0}
          onMarkAllPaid={handleMarkAllPaid}
          onMarkAllUnpaid={handleMarkAllUnpaid}
          onDeleteSelected={handleDeleteSelected}
          onClearSelection={handleClearSelection}
        />

        {/* Bills Display */}
        {filteredAndSortedBills?.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Receipt" size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No bills found</h3>
            <p className="text-muted-foreground mb-4">
              {statusFilter !== 'all' ? 'Try adjusting your filters' : 'Get started by adding your first bill'}
            </p>
            {statusFilter === 'all' && (
              <Button
                variant="default"
                onClick={() => navigate('/add-edit-bill')}
                iconName="Plus"
                iconPosition="left"
                iconSize={18}
              >
                Add Your First Bill
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Debug Section - Temporary */}
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="text-sm font-semibold text-yellow-800 mb-2">Debug Info (Temporary)</h3>
              <div className="text-xs text-yellow-700 space-y-1">
                <p>Total deposits in database: {deposits.length}</p>
                <p>Current month: {currentMonth.toLocaleDateString()}</p>
                <p>Deposits in current month: {deposits.filter(deposit => isInSelectedMonth(deposit.deposit_date)).length}</p>
                <p>All deposits: {JSON.stringify(deposits.map(d => ({ id: d.id, date: d.deposit_date, source: d.source })))}</p>
              </div>
            </div>

            {/* Cards View */}
            {currentView === 'cards' && (
              <div className="space-y-8">
                {console.log('🔍 Debug - Rendering cards view, currentView:', currentView)}
                {console.log('🔍 Debug - Current view state:', { currentView, depositsCount: deposits.length })}
                {/* Deposits Section */}
                {(() => {
                  // Temporarily show all deposits for debugging
                  const allDeposits = deposits;
                  const filteredDeposits = deposits.filter(deposit => isInSelectedMonth(deposit.deposit_date));
                  console.log('🔍 Debug - Deposits section - Total deposits:', deposits.length);
                  console.log('🔍 Debug - Deposits section - Filtered deposits:', filteredDeposits.length);
                  console.log('🔍 Debug - Deposits section - Should show section:', allDeposits.length > 0);
                  console.log('🔍 Debug - Deposits section - All deposits:', allDeposits);
                  console.log('🔍 Debug - Deposits section - Deposits array type:', typeof deposits);
                  console.log('🔍 Debug - Deposits section - Is deposits array:', Array.isArray(deposits));
                  
                  // Show deposits section if there are any deposits (for now, show all)
                  if (allDeposits.length > 0) {
                    console.log('🔍 Debug - Deposits section - Rendering deposits section');
                    return (
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Deposits (All - Debug)</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {allDeposits.map(deposit => {
                            console.log('🔍 Debug - Rendering deposit card:', deposit);
                            return (
                              <DepositCard
                                key={deposit.id}
                                deposit={deposit}
                                onDelete={handleDeleteDeposit}
                              />
                            );
                          })}
                        </div>
                      </div>
                    );
                  } else {
                    console.log('🔍 Debug - Deposits section - No deposits to show');
                  }
                  return null;
                })()}

                {/* Bills Section */}
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Bills</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredAndSortedBills.map(bill => (
                      <BillCard
                        key={bill.id}
                        bill={bill}
                        onTogglePayment={handleTogglePayment}
                        onEdit={handleEditBill}
                        onDelete={handleDeleteBill}
                        onSelect={handleSelectBill}
                        isSelected={selectedBills.includes(bill.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Table View */}
            {currentView === 'table' && (
              <div className="bg-card border rounded-lg overflow-hidden">
                {console.log('🔍 Debug - Rendering table view, currentView:', currentView)}
                {console.log('🔍 Debug - Table view combined items:', combinedTableItems)}
                <BillTable
                  bills={combinedTableItems}
                  onTogglePayment={handleTogglePayment}
                  onEdit={handleEditBill}
                  onDelete={handleDeleteBill}
                  onSelect={handleSelectBill}
                  selectedBills={selectedBills}
                  onSelectAll={handleSelectAll}
                  onDeleteDeposit={handleDeleteDeposit}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, billId: null, billName: '', isMultiple: false })}
        onConfirm={confirmDelete}
        billName={deleteModal.billName}
        isMultiple={deleteModal.isMultiple}
        count={selectedBills?.length || 0}
      />

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

export default BillManagement;