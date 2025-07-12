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
      console.log('🔍 Creating bill with data:', billData);
      
      // If this is a recurring bill, create multiple individual bills
      if (billData.isRecurring) {
        console.log('🔄 Creating recurring bill with frequency:', billData.frequency);
        const bills = this.generateRecurringBillInstances(userId, billData);
        console.log('📅 Generated', bills.length, 'recurring bill instances');
        
        const { data, error } = await supabase
          .from('bills')
          .insert(bills)
          .select();

        if (error) {
          console.error('❌ Error creating recurring bills:', error);
          return { success: false, error: error.message };
        }

        console.log('✅ Successfully created', data.length, 'recurring bills');
        return { success: true, data: data[0] }; // Return the first bill as the "main" one
      } else {
        console.log('📝 Creating single bill');
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
          console.error('❌ Error creating single bill:', error);
          return { success: false, error: error.message };
        }

        console.log('✅ Successfully created single bill');
        return { success: true, data };
      }
    } catch (error) {
      console.error('❌ JavaScript error in createBill:', error);
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Please check your internet connection.' 
        };
      }
      return { success: false, error: 'Failed to create bill' };
    }
  }

  // Generate recurring bill instances
  generateRecurringBillInstances(userId, billData) {
    console.log('🔄 Generating recurring bill instances for:', billData.name);
    console.log('📅 Start date:', billData.dueDate);
    console.log('🔄 Frequency:', billData.frequency);
    console.log('📅 End date:', billData.endDate);
    
    const bills = [];
    const startDate = new Date(billData.dueDate);
    const end = billData.endDate ? new Date(billData.endDate) : null;
    const frequency = billData.frequency || 'monthly';
    
    console.log('📅 Parsed start date:', startDate);
    console.log('📅 Parsed end date:', end);
    
    // Generate bills for the next 12 months (or until end date)
    for (let i = 0; i < 52; i++) { // Max 52 weeks for weekly bills
      const nextDate = new Date(startDate);
      
      switch (frequency) {
        case 'weekly':
          nextDate.setDate(startDate.getDate() + (i * 7));
          break;
        case 'monthly':
          // For monthly, we need to preserve the day of month
          const originalDay = startDate.getDate();
          nextDate.setMonth(startDate.getMonth() + i);
          // If the original day doesn't exist in the new month (e.g., Jan 31 -> Feb), 
          // set to the last day of the new month
          const lastDayOfMonth = new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate();
          nextDate.setDate(Math.min(originalDay, lastDayOfMonth));
          break;
        case 'quarterly':
          // For quarterly, preserve the day of month
          const originalDayQuarterly = startDate.getDate();
          nextDate.setMonth(startDate.getMonth() + (i * 3));
          const lastDayOfQuarterlyMonth = new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate();
          nextDate.setDate(Math.min(originalDayQuarterly, lastDayOfQuarterlyMonth));
          break;
        case 'annually':
          nextDate.setFullYear(startDate.getFullYear() + i);
          break;
        default:
          // For monthly, preserve the day of month
          const originalDayDefault = startDate.getDate();
          nextDate.setMonth(startDate.getMonth() + i);
          const lastDayOfDefaultMonth = new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate();
          nextDate.setDate(Math.min(originalDayDefault, lastDayOfDefaultMonth));
      }
      
      // Stop if we've reached the end date
      if (end && nextDate > end) {
        console.log('📅 Stopping at end date:', end);
        break;
      }
      
      // Stop if we've generated too many bills (safety check)
      if (i > 52) {
        console.log('📅 Stopping at max limit (52)');
        break;
      }
      
      const billInstance = {
        user_id: userId,
        name: billData.name,
        category: billData.category,
        amount: billData.amount,
        due_date: nextDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        payment_method_id: billData.paymentMethodId,
        status: 'unpaid',
        is_recurring: false, // These are individual instances
        notes: billData.notes || ''
      };
      
      bills.push(billInstance);
      console.log(`📅 Generated bill ${i + 1}:`, billInstance.due_date);
    }
    
    console.log('✅ Total bills generated:', bills.length);
    return bills;
  }

  // Update an existing bill
  async updateBill(billId, updates) {
    try {
      console.log('🔍 Updating bill with data:', updates);
      
      // First, get the current bill to check if it's changing to recurring
      const currentBill = await this.getBillById(billId);
      const wasRecurring = currentBill.success ? currentBill.data.isRecurring : false;
      const isChangingToRecurring = !wasRecurring && updates.isRecurring;
      
      console.log('🔄 Was recurring:', wasRecurring);
      console.log('🔄 Is changing to recurring:', isChangingToRecurring);
      
      // Update the main bill
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
        console.error('❌ Error updating bill:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Bill updated successfully');

      // If the bill is changing to recurring, generate the recurring instances
      if (isChangingToRecurring) {
        console.log('🔄 Generating recurring bills for updated bill');
        const bills = this.generateRecurringBillInstances(data.user_id, {
          ...updates,
          dueDate: updates.dueDate,
          frequency: updates.frequency || 'monthly',
          endDate: updates.endDate
        });
        
        if (bills.length > 0) {
          const { data: recurringData, error: recurringError } = await supabase
            .from('bills')
            .insert(bills)
            .select();

          if (recurringError) {
            console.error('❌ Error creating recurring bills:', recurringError);
            // Don't fail the update, just log the warning
          } else {
            console.log('✅ Successfully created', recurringData.length, 'recurring bills');
          }
        }
      }

      return { success: true, data };
    } catch (error) {
      console.error('❌ JavaScript error in updateBill:', error);
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Please check your internet connection.' 
        };
      }
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
        frequency: data.frequency,
        endDate: data.end_date,
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