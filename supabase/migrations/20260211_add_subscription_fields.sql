-- Add subscription fields to user_profiles
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'active' CHECK (subscription_status IN ('active', 'blocked')),
ADD COLUMN IF NOT EXISTS subscription_expires_at timestamptz;

-- Update existing users to have defaults
UPDATE public.user_profiles
SET subscription_status = 'active'
WHERE subscription_status IS NULL;

-- Create policy to allow admins to update profiles (for status/dates)
CREATE POLICY "Admins can update all profiles"
ON public.user_profiles
FOR UPDATE
USING ( public.is_admin() );
