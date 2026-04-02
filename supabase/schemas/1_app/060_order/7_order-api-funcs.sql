-- Create a new order for the current user
CREATE OR REPLACE FUNCTION public."app:order:create"(
  "gameId" uuid,
  "gameName" text,
  "gameIconUrl" text,
  "packageId" uuid,
  "packageName" text,
  "playerId" text DEFAULT NULL,
  server text DEFAULT NULL,
  "amountInUsd" numeric DEFAULT 0,
  "discountInUsd" numeric DEFAULT 0,
  "promoCode" text DEFAULT NULL,
  "paymentMethod" public.payment_method DEFAULT 'CARD',
  "estimatedDeliveryInMin" int DEFAULT 5
)
RETURNS public."OrderV1"
SECURITY DEFINER
SET search_path = ''
LANGUAGE sql
AS $$
  INSERT INTO private.order (
    user_id,
    game_id,
    game_name,
    game_icon_url,
    package_id,
    package_name,
    player_id,
    server,
    amount_in_usd,
    discount_in_usd,
    promo_code,
    payment_method,
    estimated_delivery_in_min
  )
  SELECT
    auth.uid(),
    "gameId",
    "gameName",
    "gameIconUrl",
    "packageId",
    "packageName",
    "playerId",
    server,
    "amountInUsd",
    "discountInUsd",
    "promoCode",
    "paymentMethod",
    "estimatedDeliveryInMin"
  WHERE auth.uid() IS NOT NULL
  RETURNING
    id,
    created_at,
    user_id,
    game_id,
    game_name,
    game_icon_url,
    package_id,
    package_name,
    player_id,
    private.order.server,
    amount_in_usd,
    discount_in_usd,
    promo_code,
    payment_method,
    status,
    completed_at,
    estimated_delivery_in_min;
$$;

GRANT EXECUTE ON FUNCTION public."app:order:create" TO authenticated;

-- Read all orders for the current user
CREATE OR REPLACE FUNCTION public."app:order:readAll"()
RETURNS SETOF public."OrderV1"
SECURITY DEFINER
SET search_path = ''
STABLE
LANGUAGE sql
AS $$
  SELECT
    o.id,
    o.created_at,
    o.user_id,
    o.game_id,
    o.game_name,
    o.game_icon_url,
    o.package_id,
    o.package_name,
    o.player_id,
    o.server,
    o.amount_in_usd,
    o.discount_in_usd,
    o.promo_code,
    o.payment_method,
    o.status,
    o.completed_at,
    o.estimated_delivery_in_min
  FROM private.order o
  WHERE o.user_id = auth.uid()
  ORDER BY o.created_at DESC;
$$;

GRANT EXECUTE ON FUNCTION public."app:order:readAll" TO authenticated;

-- Read a single order by ID (only if owned by current user)
CREATE OR REPLACE FUNCTION public."app:order:read"(
  "orderId" uuid
)
RETURNS public."OrderV1"
SECURITY DEFINER
SET search_path = ''
STABLE
LANGUAGE sql
AS $$
  SELECT
    o.id,
    o.created_at,
    o.user_id,
    o.game_id,
    o.game_name,
    o.game_icon_url,
    o.package_id,
    o.package_name,
    o.player_id,
    o.server,
    o.amount_in_usd,
    o.discount_in_usd,
    o.promo_code,
    o.payment_method,
    o.status,
    o.completed_at,
    o.estimated_delivery_in_min
  FROM private.order o
  WHERE o.id = "orderId"
    AND o.user_id = auth.uid();
$$;

GRANT EXECUTE ON FUNCTION public."app:order:read" TO authenticated;
