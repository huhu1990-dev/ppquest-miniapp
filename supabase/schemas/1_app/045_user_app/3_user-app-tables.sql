-- Extension table for app-specific user profile data
-- References auth.users via FK, extends the base profile in 0_lib/040_profile
CREATE TABLE IF NOT EXISTS private.user_app_profile (
  id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_onboarding_complete boolean NOT NULL DEFAULT false,
  telegram_user_id text,
  total_orders_count int NOT NULL DEFAULT 0,
  total_spent_in_usd numeric(12, 2) NOT NULL DEFAULT 0,

  CONSTRAINT total_orders_count_non_negative CHECK (total_orders_count >= 0),
  CONSTRAINT total_spent_in_usd_non_negative CHECK (total_spent_in_usd >= 0)
);

-- User game preferences table
CREATE TABLE IF NOT EXISTS private.user_preference (
  id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  favorite_game_ids uuid[] DEFAULT '{}'
);

-- Trigger to auto-create user_app_profile and user_preference on new user signup
CREATE OR REPLACE FUNCTION private.handle_new_user_app() RETURNS trigger
SECURITY DEFINER
SET "search_path" TO ''
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO private.user_app_profile (id)
  VALUES (NEW.id);

  INSERT INTO private.user_preference (id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created_app
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION private.handle_new_user_app();
