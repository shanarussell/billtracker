import { supabase } from './supabase';

class BillService {
  // Get all bills for the current user
  async getBills(userId) {
    try {
      console.log('🔍 Attempting to fetch bills for user:', userId);
      const { data, error } = await supabase
        .from('bills')
        .select(`
          *,
          payment_method:payment_methods(id, name, type)
        `)
        .eq('user_id', userId)
        .order('due_date', { ascending: true });

      if (error) {
        console.error('❌ Supabase getBills error:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Bills fetched successfully:', data?.length || 0, 'bills found');

      // Transform data to match component expectations
      const transformedData = data?.map(bill => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day
        const dueDate = new Date(bill.due_date);
        dueDate.setHours(0, 0, 0, 0); // Reset time to start of day
        
        const isOverdue = bill.status !== 'paid' && dueDate < today;
        
        return {
          id: bill.id,
          name: bill.name,
          category: bill.category,
          amount: parseFloat(bill.amount),
          dueDate: bill.due_date, // Keep as-is, will be handled by formatDate
          paymentMethod: bill.payment_method?.name || 'Not Set',
          status: bill.status,
          isPaid: bill.status === 'paid',
          isOverdue: isOverdue,
          isRecurring: bill.is_recurring,
          notes: bill.notes,
          createdAt: bill.created_at,
          updatedAt: bill.updated_at
        };
      }) || [];

      return { success: true, data: transformedData };
    } catch (error) {
      console.error('❌ JavaScript error in getBills:', error);
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      console.log('JavaScript error in getBills:', error);
      return { success: false, error: 'Failed to load bills' };
    }
  }

  // Create a new bill
  async createBill(userId, billData) {
    try {
      // If this is a recurring bill, create multiple individual bills
      if (billData.isRecurring) {
        const bills = this.generateRecurringBillInstances(userId, billData);
        
        const { data, error } = await supabase
          .from('bills')
          .insert(bills)
          .select();

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true, data: data[0] }; // Return the first bill as the "main" one
      } else {
        // Create a single bill
        const { data, error } = await supabase
          .from('bills')
          .insert({
            user_id: userId,
            name: billData.name,
            category: billData.category,
            amount: billData.amount,
            due_date: billData.dueDate,
            payment_method_id: billData.paymentMethodId,
            status: billData.status || 'unpaid',
            is_recurring: false, // Individual bills are not recurring
            notes: billData.notes || ''
          })
          .select()
          .single();

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true, data };
      }
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Please check your internet connection.' 
        };
      }
      console.log('JavaScript error in createBill:', error);
      return { success: false, error: 'Failed to create bill' };
    }
  }

  // Generate recurring bill instances
  generateRecurringBillInstances(userId, billData) {
    const bills = [];
    const startDate = new Date(billData.dueDate);
    const end = billData.endDate ? new Date(billData.endDate) : null;
    const frequency = billData.frequency || 'monthly';
    
    // Generate bills for the next 12 months (or until end date)
    for (let i = 0; i < 52; i++) { // Max 52 weeks for weekly bills
      const nextDate = new Date(startDate);
      
      switch (frequency) {
        case 'weekly':
          nextDate.setDate(startDate.getDate() + (i * 7));
          break;
        case 'monthly':
          nextDate.setMonth(startDate.getMonth() + i);
          break;
        case 'quarterly':
          nextDate.setMonth(startDate.getMonth() + (i * 3));
          break;
        case 'annually':
          nextDate.setFullYear(startDate.getFullYear() + i);
          break;
        default:
          nextDate.setMonth(startDate.getMonth() + i);
      }
      
      // Stop if we've reached the end date
      if (end && nextDate > end) {
        break;
      }
      
      // Stop if we've generated too many bills (safety check)
      if (i > 52) {
        break;
      }
      
      bills.push({
        user_id: userId,
        name: billData.name,
        category: billData.category,
        amount: billData.amount,
        due_date: nextDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        payment_method_id: billData.paymentMethodId,
        status: 'unpaid',
        is_recurring: false, // These are individual instances
        notes: billData.notes || ''
      });
    }
    
    return bills;
  }

  // Update an existing bill
  async updateBill(billId, updates) {
    try {
      const { data, error } = await supabase
        .from('bills')
        .update({
          name: updates.name,
          category: updates.category,
          amount: updates.amount,
          due_date: updates.dueDate,
          payment_method_id: updates.paymentMethodId,
          status: updates.status,
          is_recurring: updates.isRecurring,
          notes: updates.notes
        })
        .eq('id', billId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Please check your internet connection.' 
        };
      }
      console.log('JavaScript error in updateBill:', error);
      return { success: false, error: 'Failed to update bill' };
    }
  }

  // Delete a bill
  async deleteBill(billId) {
    try {
      const { error } = await supabase
        .from('bills')
        .delete()
        .eq('id', billId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Please check your internet connection.' 
        };
      }
      console.log('JavaScript error in deleteBill:', error);
      return { success: false, error: 'Failed to delete bill' };
    }
  }

  // Toggle bill payment status
  async toggleBillPayment(billId, isPaid) {
    try {
      const newStatus = isPaid ? 'paid' : 'unpaid';
      
      const { data, error } = await supabase
        .from('bills')
        .update({ status: newStatus })
        .eq('id', billId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Please check your internet connection.' 
        };
      }
      console.log('JavaScript error in toggleBillPayment:', error);
      return { success: false, error: 'Failed to update payment status' };
    }
  }

  // Mark bill as paid with payment details
  async markBillAsPaid(billId, paymentDetails) {
    try {
      const { data, error } = await supabase
        .from('bills')
        .update({ 
          status: 'paid',
          payment_method_id: paymentDetails.paymentMethodId
        })
        .eq('id', billId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      // Create payment record
      const paymentResult = await this.createBillPayment(
        billId, 
        paymentDetails.amount, 
        paymentDetails.paymentMethodId
      );

      if (!paymentResult.success) {
        return paymentResult;
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Please check your internet connection.' 
        };
      }
      console.log('JavaScript error in markBillAsPaid:', error);
      return { success: false, error: 'Failed to mark bill as paid' };
    }
  }

  // Create bill payment record
  async createBillPayment(billId, amount, paymentMethodId) {
    try {
      const { data, error } = await supabase
        .from('bill_payments')
        .insert({
          bill_id: billId,
          user_id: (await supabase.auth.getSession()).data.session?.user?.id,
          amount: amount,
          payment_method_id: paymentMethodId,
          notes: 'Payment recorded automatically'
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.log('JavaScript error in createBillPayment:', error);
      return { success: false, error: 'Failed to record payment' };
    }
  }

  // Get bill by ID
  async getBillById(billId) {
    try {
      const { data, error } = await supabase
        .from('bills')
        .select(`
          *,
          payment_method:payment_methods(id, name, type)
        `)
        .eq('id', billId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      // Transform data to match component expectations
      const transformedData = {
        id: data.id,
        name: data.name,
        category: data.category,
        amount: parseFloat(data.amount),
        dueDate: data.due_date,
        paymentMethod: data.payment_method?.name || 'Not Set',
        paymentMethodId: data.payment_method?.id,
        status: data.status,
        isPaid: data.status === 'paid',
        isOverdue: data.status === 'overdue',
        isRecurring: data.is_recurring,
        notes: data.notes,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      return { success: true, data: transformedData };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Please check your internet connection.' 
        };
      }
      console.log('JavaScript error in getBillById:', error);
      return { success: false, error: 'Failed to load bill' };
    }
  }

  // Get financial metrics for dashboard
  async getFinancialMetrics(userId) {
    try {
      const { data: bills, error } = await supabase
        .from('bills')
        .select('amount, status')
        .eq('user_id', userId);

      if (error) {
        return { success: false, error: error.message };
      }

      const totalDue = bills?.reduce((sum, bill) => sum + parseFloat(bill.amount), 0) || 0;
      const totalPaid = bills?.filter(bill => bill.status === 'paid')
        .reduce((sum, bill) => sum + parseFloat(bill.amount), 0) || 0;
      const remainingBalance = totalDue - totalPaid;
      const overdueBills = bills?.filter(bill => bill.status === 'overdue').length || 0;

      // Get user's monthly income for available funds calculation
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('monthly_income')
        .eq('id', userId)
        .single();

      const monthlyIncome = parseFloat(profile?.monthly_income || 0);

      // Get total deposits
      const { data: deposits } = await supabase
        .from('deposits')
        .select('amount')
        .eq('user_id', userId);

      const totalDeposits = deposits?.reduce((sum, deposit) => sum + parseFloat(deposit.amount), 0) || 0;
      const availableFunds = monthlyIncome + totalDeposits - totalDue;

      return {
        success: true,
        data: {
          totalDue,
          totalPaid,
          remainingBalance,
          availableFunds,
          overdueBills,
          monthlyIncome,
          totalDeposits
        }
      };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Please check your internet connection.' 
        };
      }
      console.log('JavaScript error in getFinancialMetrics:', error);
      return { success: false, error: 'Failed to calculate metrics' };
    }
  }
}

const billService = new BillService();
export default billService;