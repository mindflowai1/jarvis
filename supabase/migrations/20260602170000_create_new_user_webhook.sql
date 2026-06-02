-- Enable pg_net extension in extensions schema if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Function to handle new user profile webhook trigger
CREATE OR REPLACE FUNCTION public.handle_user_profile_created_webhook()
RETURNS TRIGGER AS $$
DECLARE
  request_id bigint;
BEGIN
  -- Safe wrapper to avoid blocking user creation if pg_net has issues or parameters fail
  BEGIN
    SELECT net.http_post(
      url := 'https://n8n-n8n-start.kof6cn.easypanel.host/webhook/586daf22-d3dd-4719-9fe0-87d3de1c16ad',
      body := json_build_object(
        'event', 'user.created',
        'id', NEW.id,
        'user_id', NEW.user_id,
        'name', NEW.name,
        'email', NEW.email,
        'phone_number', NEW.phone_number,
        'whatsapp_number', NEW.whatsapp_number,
        'created_at', NEW.created_at
      )::jsonb
    ) INTO request_id;
  EXCEPTION WHEN OTHERS THEN
    -- Capture and log error as warning without throwing exception or aborting transactions
    RAISE WARNING 'Could not trigger user webhook: %', SQLERRM;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute AFTER a new user profile is inserted into public.user_profiles
DROP TRIGGER IF EXISTS on_user_profile_created_webhook ON public.user_profiles;
CREATE TRIGGER on_user_profile_created_webhook
  AFTER INSERT ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_profile_created_webhook();
