-- Easy Bill Tracker Database Schema
-- Authentication & Bill Management Module

-- 1. Custom Types
CREATE TYPE public.user_role AS ENUM ('admin', 'user');
CREATE TYPE public.bill_status AS ENUM ('paid', 'unpaid', 'overdue');
CREATE TYPE public.bill_category AS ENUM ('Utilities', 'Credit Cards', 'Insurance', 'Healthcare', 'Entertainment', 'Transportation', 'Housing', 'Food', 'Shopping', 'Other');
CREATE TYPE public.payment_method_type AS ENUM ('credit_card', 'debit_card', 'bank_account', 'cash', 'check', 'digital_wallet');

-- 2. User Profiles Table (PostgREST compatible)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'user'::public.user_role,
    monthly_income DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Payment Methods Table
CREATE TABLE public.payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type public.payment_method_type NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Bills Table
CREATE TABLE public.bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category public.bill_category NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    due_date DATE NOT NULL,
    payment_method_id UUID REFERENCES public.payment_methods(id) ON DELETE SET NULL,
    status public.bill_status DEFAULT 'unpaid'::public.bill_status,
    is_recurring BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Bill Payments History Table
CREATE TABLE public.bill_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_id UUID REFERENCES public.bills(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    payment_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    payment_method_id UUID REFERENCES public.payment_methods(id) ON DELETE SET NULL,
    notes TEXT
);

-- 6. Financial Goals Table
CREATE TABLE public.financial_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    target_amount DECIMAL(10,2) NOT NULL CHECK (target_amount >= 0),
    current_amount DECIMAL(10,2) DEFAULT 0.00 CHECK (current_amount >= 0),
    target_date DATE,
    is_achieved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_payment_methods_user_id ON public.payment_methods(user_id);
CREATE INDEX idx_bills_user_id ON public.bills(user_id);
CREATE INDEX idx_bills_due_date ON public.bills(due_date);
CREATE INDEX idx_bills_status ON public.bills(status);
CREATE INDEX idx_bills_category ON public.bills(category);
CREATE INDEX idx_bill_payments_bill_id ON public.bill_payments(bill_id);
CREATE INDEX idx_bill_payments_user_id ON public.bill_payments(user_id);
CREATE INDEX idx_financial_goals_user_id ON public.financial_goals(user_id);

-- 8. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bill_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_goals ENABLE ROW LEVEL SECURITY;

-- 9. Helper Functions for RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'::public.user_role
)
$$;

CREATE OR REPLACE FUNCTION public.owns_payment_method(method_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.payment_methods pm
    WHERE pm.id = method_id AND pm.user_id = auth.uid()
)
$$;

CREATE OR REPLACE FUNCTION public.owns_bill(bill_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.bills b
    WHERE b.id = bill_id AND b.user_id = auth.uid()
)
$$;

CREATE OR REPLACE FUNCTION public.owns_bill_payment(payment_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.bill_payments bp
    WHERE bp.id = payment_id AND bp.user_id = auth.uid()
)
$$;

CREATE OR REPLACE FUNCTION public.owns_financial_goal(goal_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.financial_goals fg
    WHERE fg.id = goal_id AND fg.user_id = auth.uid()
)
$$;

-- 10. RLS Policies
-- User Profiles Policies
CREATE POLICY "users_own_profile"
ON public.user_profiles
FOR ALL
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Payment Methods Policies
CREATE POLICY "users_manage_payment_methods"
ON public.payment_methods
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Bills Policies
CREATE POLICY "users_manage_bills"
ON public.bills
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Bill Payments Policies
CREATE POLICY "users_manage_bill_payments"
ON public.bill_payments
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Financial Goals Policies
CREATE POLICY "users_manage_financial_goals"
ON public.financial_goals
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 11. Functions for auto profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'user'::public.user_role)
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 12. Functions for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- Apply timestamp triggers
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bills_updated_at
    BEFORE UPDATE ON public.bills
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_financial_goals_updated_at
    BEFORE UPDATE ON public.financial_goals
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 13. Mock Data for Development
DO $$
DECLARE
    admin_user_id UUID := gen_random_uuid();
    regular_user_id UUID := gen_random_uuid();
    afcu_payment_id UUID := gen_random_uuid();
    chase_payment_id UUID := gen_random_uuid();
    discover_payment_id UUID := gen_random_uuid();
    apple_payment_id UUID := gen_random_uuid();
    electric_bill_id UUID := gen_random_uuid();
    credit_bill_id UUID := gen_random_uuid();
    internet_bill_id UUID := gen_random_uuid();
    insurance_bill_id UUID := gen_random_uuid();
    phone_bill_id UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'john@billtracker.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "John Smith"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (regular_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'sarah@billtracker.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Sarah Johnson"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Update user profiles with monthly income
    UPDATE public.user_profiles 
    SET monthly_income = 4500.00, role = 'admin'::public.user_role 
    WHERE id = admin_user_id;
    
    UPDATE public.user_profiles 
    SET monthly_income = 3200.00 
    WHERE id = regular_user_id;

    -- Create payment methods for admin user
    INSERT INTO public.payment_methods (id, user_id, name, type, is_default) VALUES
        (afcu_payment_id, admin_user_id, 'AFCU', 'bank_account'::public.payment_method_type, true),
        (chase_payment_id, admin_user_id, 'Chase Card', 'credit_card'::public.payment_method_type, false),
        (discover_payment_id, admin_user_id, 'Discover', 'credit_card'::public.payment_method_type, false),
        (apple_payment_id, admin_user_id, 'Apple Card', 'credit_card'::public.payment_method_type, false);

    -- Create bills for admin user
    INSERT INTO public.bills (id, user_id, name, category, amount, due_date, payment_method_id, status, is_recurring, notes) VALUES
        (electric_bill_id, admin_user_id, 'Electric Bill', 'Utilities'::public.bill_category, 125.50, '2025-07-08', afcu_payment_id, 'overdue'::public.bill_status, true, 'Monthly electric utility bill'),
        (credit_bill_id, admin_user_id, 'Credit Card Payment', 'Credit Cards'::public.bill_category, 450.00, '2025-07-11', chase_payment_id, 'unpaid'::public.bill_status, true, 'Monthly credit card payment'),
        (internet_bill_id, admin_user_id, 'Internet Service', 'Utilities'::public.bill_category, 79.99, '2025-07-15', apple_payment_id, 'unpaid'::public.bill_status, true, 'Monthly internet service'),
        (insurance_bill_id, admin_user_id, 'Car Insurance', 'Insurance'::public.bill_category, 89.99, '2025-07-13', discover_payment_id, 'paid'::public.bill_status, true, 'Monthly car insurance premium'),
        (phone_bill_id, admin_user_id, 'Phone Bill', 'Utilities'::public.bill_category, 65.00, '2025-07-18', afcu_payment_id, 'unpaid'::public.bill_status, true, 'Monthly phone service');

    -- Create some bill payments history for paid bills
    INSERT INTO public.bill_payments (bill_id, user_id, amount, payment_method_id, notes) VALUES
        (insurance_bill_id, admin_user_id, 89.99, discover_payment_id, 'Auto-pay monthly insurance');

    -- Create financial goals
    INSERT INTO public.financial_goals (user_id, title, target_amount, current_amount, target_date) VALUES
        (admin_user_id, 'Emergency Fund', 5000.00, 2500.00, '2025-12-31'),
        (admin_user_id, 'Vacation Savings', 2000.00, 850.00, '2025-08-15');

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error during mock data creation: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error during mock data creation: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error during mock data creation: %', SQLERRM;
END $$;

-- 14. Cleanup function for development
CREATE OR REPLACE FUNCTION public.cleanup_mock_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    mock_user_ids UUID[];
BEGIN
    -- Get mock user IDs
    SELECT ARRAY_AGG(id) INTO mock_user_ids
    FROM auth.users
    WHERE email LIKE '%@billtracker.com';

    -- Delete in dependency order
    DELETE FROM public.bill_payments WHERE user_id = ANY(mock_user_ids);
    DELETE FROM public.financial_goals WHERE user_id = ANY(mock_user_ids);
    DELETE FROM public.bills WHERE user_id = ANY(mock_user_ids);
    DELETE FROM public.payment_methods WHERE user_id = ANY(mock_user_ids);
    DELETE FROM public.user_profiles WHERE id = ANY(mock_user_ids);
    DELETE FROM auth.users WHERE id = ANY(mock_user_ids);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key constraint prevents cleanup: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$$;