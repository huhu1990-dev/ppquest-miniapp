-- Read the current user's app profile
CREATE OR REPLACE FUNCTION public."app:userApp:profile:read"()
RETURNS public."UserAppProfileV1"
SECURITY DEFINER
SET search_path = ''
STABLE
LANGUAGE sql
AS $$
  SELECT
    p.id,
    p.created_at,
    p.updated_at,
    p.is_onboarding_complete,
    p.telegram_user_id,
    p.total_orders_count,
    p.total_spent_in_usd
  FROM private.user_app_profile p
  WHERE p.id = auth.uid();
$$;

GRANT EXECUTE ON FUNCTION public."app:userApp:profile:read" TO authenticated;

-- Update the current user's app profile
CREATE OR REPLACE FUNCTION public."app:userApp:profile:update"(
  "isOnboardingComplete" boolean DEFAULT NULL,
  "telegramUserId" text DEFAULT '___UNSET___'
)
RETURNS public."UserAppProfileV1"
SECURITY DEFINER
SET search_path = ''
LANGUAGE sql
AS $$
  UPDATE private.user_app_profile p SET
    updated_at = CURRENT_TIMESTAMP,
    is_onboarding_complete = COALESCE("isOnboardingComplete", p.is_onboarding_complete),
    telegram_user_id = CASE WHEN "telegramUserId" IS DISTINCT FROM '___UNSET___' THEN "telegramUserId" ELSE p.telegram_user_id END
  WHERE p.id = auth.uid()
  RETURNING
    p.id,
    p.created_at,
    p.updated_at,
    p.is_onboarding_complete,
    p.telegram_user_id,
    p.total_orders_count,
    p.total_spent_in_usd;
$$;

GRANT EXECUTE ON FUNCTION public."app:userApp:profile:update" TO authenticated;

-- Read the current user's game preferences
CREATE OR REPLACE FUNCTION public."app:userApp:preference:read"()
RETURNS public."UserPreferenceV1"
SECURITY DEFINER
SET search_path = ''
STABLE
LANGUAGE sql
AS $$
  SELECT
    up.id,
    up.created_at,
    up.updated_at,
    up.favorite_game_ids
  FROM private.user_preference up
  WHERE up.id = auth.uid();
$$;

GRANT EXECUTE ON FUNCTION public."app:userApp:preference:read" TO authenticated;

-- Update the current user's game preferences
CREATE OR REPLACE FUNCTION public."app:userApp:preference:update"(
  "favoriteGameIds" uuid[] DEFAULT NULL
)
RETURNS public."UserPreferenceV1"
SECURITY DEFINER
SET search_path = ''
LANGUAGE sql
AS $$
  UPDATE private.user_preference up SET
    updated_at = CURRENT_TIMESTAMP,
    favorite_game_ids = COALESCE("favoriteGameIds", up.favorite_game_ids)
  WHERE up.id = auth.uid()
  RETURNING
    up.id,
    up.created_at,
    up.updated_at,
    up.favorite_game_ids;
$$;

GRANT EXECUTE ON FUNCTION public."app:userApp:preference:update" TO authenticated;

-- Admin: Set telegram_user_id for a given user (called from telegram-auth edge function)
CREATE OR REPLACE FUNCTION public."admin:userApp:setTelegramUserId"(
  "userId" uuid,
  "telegramUserId" text
)
RETURNS void
SET search_path = ''
LANGUAGE sql
AS $$
  UPDATE private.user_app_profile
  SET
    telegram_user_id = "telegramUserId",
    updated_at = CURRENT_TIMESTAMP
  WHERE id = "userId";
$$;

GRANT EXECUTE ON FUNCTION public."admin:userApp:setTelegramUserId" TO service_role;
