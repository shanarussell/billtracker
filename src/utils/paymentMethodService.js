import { supabase } from './supabase';

class PaymentMethodService {
  // Get all payment methods for the current user
  async getPaymentMethods(userId) {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      console.log('JavaScript error in getPaymentMethods:', error);
      return { success: false, error: 'Failed to load payment methods' };
    }
  }

  // Create a new payment method
  async createPaymentMethod(userId, methodData) {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .insert({
          user_id: userId,
          name: methodData.name,
          type: methodData.type,
          is_default: methodData.isDefault || false
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
      console.log('JavaScript error in createPaymentMethod:', error);
      return { success: false, error: 'Failed to create payment method' };
    }
  }

  // Update an existing payment method
  async updatePaymentMethod(methodId, updates) {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .update(updates)
        .eq('id', methodId)
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
      console.log('JavaScript error in updatePaymentMethod:', error);
      return { success: false, error: 'Failed to update payment method' };
    }
  }

  // Delete a payment method
  async deletePaymentMethod(methodId) {
    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', methodId);

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
      console.log('JavaScript error in deletePaymentMethod:', error);
      return { success: false, error: 'Failed to delete payment method' };
    }
  }

  // Set default payment method
  async setDefaultPaymentMethod(userId, methodId) {
    try {
      // First, unset all other default flags
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', userId);

      // Then set the new default
      const { data, error } = await supabase
        .from('payment_methods')
        .update({ is_default: true })
        .eq('id', methodId)
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
      console.log('JavaScript error in setDefaultPaymentMethod:', error);
      return { success: false, error: 'Failed to set default payment method' };
    }
  }
}

const paymentMethodService = new PaymentMethodService();
export default paymentMethodService;