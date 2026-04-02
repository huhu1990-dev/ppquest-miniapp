CREATE TABLE IF NOT EXISTS private.order (
  id uuid NOT NULL PRIMARY KEY DEFAULT public.uuid_from_timestamp(),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id uuid NOT NULL REFERENCES private.game(id),
  game_name text NOT NULL,
  game_icon_url text NOT NULL,
  package_id uuid NOT NULL REFERENCES private.package(id),
  package_name text NOT NULL,
  player_id text,
  server text,
  amount_in_usd numeric(10, 2) NOT NULL,
  discount_in_usd numeric(10, 2) NOT NULL DEFAULT 0,
  promo_code text,
  payment_method public.payment_method NOT NULL,
  status public.order_status NOT NULL DEFAULT 'PROCESSING',
  completed_at timestamptz,
  estimated_delivery_in_min int NOT NULL DEFAULT 5,

  CONSTRAINT game_name_length CHECK (char_length(game_name) <= 100),
  CONSTRAINT package_name_length CHECK (char_length(package_name) <= 100),
  CONSTRAINT player_id_length CHECK (player_id IS NULL OR (char_length(player_id) >= 1 AND char_length(player_id) <= 100)),
  CONSTRAINT server_length CHECK (server IS NULL OR char_length(server) <= 100),
  CONSTRAINT amount_non_negative CHECK (amount_in_usd >= 0),
  CONSTRAINT discount_non_negative CHECK (discount_in_usd >= 0),
  CONSTRAINT promo_code_length CHECK (promo_code IS NULL OR char_length(promo_code) <= 50),
  CONSTRAINT estimated_delivery_range CHECK (estimated_delivery_in_min >= 0 AND estimated_delivery_in_min <= 1440)
);

CREATE INDEX order_idx_user_id ON private.order(user_id);
CREATE INDEX order_idx_status ON private.order(status);
CREATE INDEX order_idx_created_at ON private.order(created_at DESC);

-- Trigger to update user_app_profile statistics when an order is completed
CREATE OR REPLACE FUNCTION private.handle_order_status_change() RETURNS trigger
SECURITY DEFINER
SET search_path = ''
LANGUAGE plpgsql
AS $$
BEGIN
  -- When order transitions to COMPLETED, increment stats
  IF NEW.status = 'COMPLETED' AND (OLD.status IS DISTINCT FROM 'COMPLETED') THEN
    UPDATE private.user_app_profile
    SET
      total_orders_count = total_orders_count + 1,
      total_spent_in_usd = total_spent_in_usd + NEW.amount_in_usd,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.user_id;
  END IF;

  -- When order transitions away from COMPLETED (e.g. to REFUNDED), decrement stats
  IF OLD.status = 'COMPLETED' AND NEW.status IS DISTINCT FROM 'COMPLETED' THEN
    UPDATE private.user_app_profile
    SET
      total_orders_count = GREATEST(COALESCE(total_orders_count, 0) - 1, 0)::int,
      total_spent_in_usd = GREATEST(COALESCE(total_spent_in_usd, 0) - OLD.amount_in_usd, 0)::numeric(12, 2),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.user_id;
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_order_status_change
  AFTER UPDATE OF status ON private.order
  FOR EACH ROW
  EXECUTE FUNCTION private.handle_order_status_change();
