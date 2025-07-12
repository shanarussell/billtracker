import { supabase } from './supabase';

class DepositService {
  // Get all deposits for the current user
  async getDeposits(userId) {
    try {
      console.log('🔍 Debug - Fetching deposits for user:', userId);
      
      const { data, error } = await supabase
        .from('deposits')
        .select('*')
        .eq('user_id', userId)
        .order('deposit_date', { ascending: false });

      console.log('🔍 Debug - Supabase response:', { data, error });

      if (error) {
        console.log('❌ Supabase error:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Deposits fetched successfully:', data?.length || 0, 'deposits found');
      return { success: true, data: data || [] };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      console.log('JavaScript error in getDeposits:', error);
      return { success: false, error: 'Failed to load deposits' };
    }
  }

  // Create a new deposit
  async createDeposit(userId, depositData) {
    try {
      const { data, error } = await supabase
        .from('deposits')
        .insert({
          user_id: userId,
          amount: depositData.amount,
          source: depositData.source,
          deposit_date: depositData.depositDate,
          notes: depositData.notes || ''
        })
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
      console.log('JavaScript error in createDeposit:', error);
      return { success: false, error: 'Failed to create deposit' };
    }
  }

  // Update an existing deposit
  async updateDeposit(depositId, updates) {
    try {
      const { data, error } = await supabase
        .from('deposits')
        .update(updates)
        .eq('id', depositId)
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
      console.log('JavaScript error in updateDeposit:', error);
      return { success: false, error: 'Failed to update deposit' };
    }
  }

  // Delete a deposit
  async deleteDeposit(depositId) {
    try {
      const { error } = await supabase
        .from('deposits')
        .delete()
        .eq('id', depositId);

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
      console.log('JavaScript error in deleteDeposit:', error);
      return { success: false, error: 'Failed to delete deposit' };
    }
  }

  // Get total deposits for a user (for available funds calculation)
  async getTotalDeposits(userId) {
    try {
      const { data, error } = await supabase
        .from('deposits')
        .select('amount')
        .eq('user_id', userId);

      if (error) {
        return { success: false, error: error.message };
      }

      const total = data?.reduce((sum, deposit) => sum + parseFloat(deposit.amount), 0) || 0;
      return { success: true, data: total };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Please check your internet connection.' 
        };
      }
      console.log('JavaScript error in getTotalDeposits:', error);
      return { success: false, error: 'Failed to calculate total deposits' };
    }
  }
}

const depositService = new DepositService();
export default depositService; 