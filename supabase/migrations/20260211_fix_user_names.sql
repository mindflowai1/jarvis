-- Update existing user profiles with the correct name from auth.users metadata
UPDATE public.user_profiles
SET name = COALESCE(
    auth.users.raw_user_meta_data->>'full_name',
    auth.users.raw_user_meta_data->>'name',
    auth.users.email
)
FROM auth.users
WHERE public.user_profiles.user_id = auth.users.id;
