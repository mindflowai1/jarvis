-- Create a secure function to check if the user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_profiles
    WHERE user_id = auth.uid()
    AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create policy to allow admins to view all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
CREATE POLICY "Admins can view all profiles"
  ON public.user_profiles
  FOR SELECT
  USING ( public.is_admin() );
