-- Backfill existing users from auth.users to public.user_profiles
INSERT INTO public.user_profiles (user_id, email, name, role)
SELECT 
    id, 
    email, 
    raw_user_meta_data->>'full_name',
    'user'
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.user_profiles)
ON CONFLICT (user_id) DO NOTHING;
