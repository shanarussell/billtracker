-- Add Deposits Table for Easy Bill Tracker
-- This table tracks income/deposits that contribute to available funds

-- 1. Create Deposits Table
CREATE TABLE public.deposits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    source TEXT NOT NULL,
    deposit_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Indexes
CREATE INDEX idx_deposits_user_id ON public.deposits(user_id);
CREATE INDEX idx_deposits_deposit_date ON public.deposits(deposit_date);

-- 3. Enable RLS
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;

-- 4. Helper Function for RLS
CREATE OR REPLACE FUNCTION public.owns_deposit(deposit_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.deposits d
    WHERE d.id = deposit_id AND d.user_id = auth.uid()
)
$$;

-- 5. RLS Policies
CREATE POLICY "users_manage_deposits"
ON public.deposits
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 6. Update Trigger for updated_at
CREATE TRIGGER update_deposits_updated_at
    BEFORE UPDATE ON public.deposits
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column(); 