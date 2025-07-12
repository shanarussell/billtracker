-- Add recurring bill fields to bills table
-- This migration adds support for proper recurring bill functionality

-- Add frequency enum type
CREATE TYPE public.bill_frequency AS ENUM ('weekly', 'monthly', 'quarterly', 'annually');

-- Add frequency and end_date columns to bills table
ALTER TABLE public.bills 
ADD COLUMN frequency public.bill_frequency DEFAULT 'monthly',
ADD COLUMN end_date DATE;

-- Add index for recurring bills
CREATE INDEX idx_bills_recurring ON public.bills(user_id, is_recurring, frequency) WHERE is_recurring = true;

-- Update existing bills to have default frequency
UPDATE public.bills 
SET frequency = 'monthly' 
WHERE is_recurring = true AND frequency IS NULL; 