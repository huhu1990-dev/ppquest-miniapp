-- Seed orders for PPQuest test users
-- Uses games and packages from 050_game.sql seed data
-- Uses test users created in 0_lib/020_entity.sql (uuid_at(1, N))

-- We need to insert orders directly since the seed runs outside of auth context
-- and the app:order:create function requires auth.uid()

INSERT INTO private.order (
  id, created_at, user_id, game_id, game_name, game_icon_url,
  package_id, package_name, player_id, server,
  amount_in_usd, discount_in_usd, promo_code, payment_method,
  status, completed_at, estimated_delivery_in_min
)
SELECT
  public.uuid_from_timestamp(ts), ts, user_id, game_id, game_name, game_icon_url,
  package_id, package_name, player_id, server,
  amount_in_usd, discount_in_usd, promo_code, payment_method,
  status, completed_at, estimated_delivery_in_min
FROM (VALUES
  -- User 1: Completed Mobile Legends order
  (
    '2025-06-01 10:30:00+00'::timestamptz,
    public.uuid_at(1, 1),
    'a0000000-0000-0000-0000-000000000001'::uuid,
    'Mobile Legends',
    'https://placehold.co/128x128?text=ML',
    (SELECT id FROM private.package WHERE game_id = 'a0000000-0000-0000-0000-000000000001' AND name = '570 Diamonds' LIMIT 1),
    '570 Diamonds',
    '123456789',
    'Asia (2001)',
    14.99::numeric(10,2),
    1.50::numeric(10,2),
    'PPQUEST10',
    'CARD'::public.payment_method,
    'COMPLETED'::public.order_status,
    '2025-06-01 10:31:00+00'::timestamptz,
    5
  ),
  -- User 1: Processing Genshin Impact order
  (
    '2025-06-10 14:00:00+00'::timestamptz,
    public.uuid_at(1, 1),
    'a0000000-0000-0000-0000-000000000002'::uuid,
    'Genshin Impact',
    'https://placehold.co/128x128?text=GI',
    (SELECT id FROM private.package WHERE game_id = 'a0000000-0000-0000-0000-000000000002' AND name = '980 Genesis Crystals' LIMIT 1),
    '980 Genesis Crystals',
    '800100200',
    'Asia',
    14.99::numeric(10,2),
    0::numeric(10,2),
    NULL,
    'E_WALLET'::public.payment_method,
    'PROCESSING'::public.order_status,
    NULL,
    5
  ),
  -- User 1: Failed VALORANT order
  (
    '2025-06-12 09:15:00+00'::timestamptz,
    public.uuid_at(1, 1),
    'a0000000-0000-0000-0000-000000000003'::uuid,
    'VALORANT',
    'https://placehold.co/128x128?text=VAL',
    (SELECT id FROM private.package WHERE game_id = 'a0000000-0000-0000-0000-000000000003' AND name = '1000 VP' LIMIT 1),
    '1000 VP',
    'Player#1234',
    NULL,
    9.99::numeric(10,2),
    0::numeric(10,2),
    NULL,
    'CARD'::public.payment_method,
    'FAILED'::public.order_status,
    NULL,
    5
  ),
  -- User 1: Completed Free Fire order with Telegram payment
  (
    '2025-05-20 18:45:00+00'::timestamptz,
    public.uuid_at(1, 1),
    'a0000000-0000-0000-0000-000000000006'::uuid,
    'Free Fire',
    'https://placehold.co/128x128?text=FF',
    (SELECT id FROM private.package WHERE game_id = 'a0000000-0000-0000-0000-000000000006' AND name = '2180 Diamonds' LIMIT 1),
    '2180 Diamonds',
    '987654321',
    NULL,
    19.99::numeric(10,2),
    4.00::numeric(10,2),
    'TOPUP20',
    'TELEGRAM_PAYMENT'::public.payment_method,
    'COMPLETED'::public.order_status,
    '2025-05-20 18:46:00+00'::timestamptz,
    5
  ),
  -- User 1: Refunded Roblox order
  (
    '2025-05-15 12:00:00+00'::timestamptz,
    public.uuid_at(1, 1),
    'a0000000-0000-0000-0000-000000000008'::uuid,
    'Roblox',
    'https://placehold.co/128x128?text=RBX',
    (SELECT id FROM private.package WHERE game_id = 'a0000000-0000-0000-0000-000000000008' AND name = '4500 Robux' LIMIT 1),
    '4500 Robux',
    'TestPlayer123',
    NULL,
    49.99::numeric(10,2),
    5.00::numeric(10,2),
    'PPQUEST10',
    'E_WALLET'::public.payment_method,
    'REFUNDED'::public.order_status,
    NULL,
    5
  ),
  -- User 2: Completed PUBG Mobile order
  (
    '2025-06-08 16:30:00+00'::timestamptz,
    public.uuid_at(1, 2),
    'a0000000-0000-0000-0000-000000000004'::uuid,
    'PUBG Mobile',
    'https://placehold.co/128x128?text=PUBG',
    (SELECT id FROM private.package WHERE game_id = 'a0000000-0000-0000-0000-000000000004' AND name = '1800 UC' LIMIT 1),
    '1800 UC',
    '5001234567',
    NULL,
    24.99::numeric(10,2),
    0::numeric(10,2),
    NULL,
    'CARD'::public.payment_method,
    'COMPLETED'::public.order_status,
    '2025-06-08 16:31:00+00'::timestamptz,
    5
  )
) AS v(
  ts, user_id, game_id, game_name, game_icon_url,
  package_id, package_name, player_id, server,
  amount_in_usd, discount_in_usd, promo_code, payment_method,
  status, completed_at, estimated_delivery_in_min
);
