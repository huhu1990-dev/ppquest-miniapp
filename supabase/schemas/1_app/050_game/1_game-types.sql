CREATE TYPE public.game_category AS ENUM (
  'MOBILE',
  'PC',
  'CONSOLE',
  'GIFT_CARD',
  'PREMIUM'
);

COMMENT ON TYPE public.game_category IS '
description: Game platform categories
values:
  MOBILE: Mobile games
  PC: PC games
  CONSOLE: Console games
  GIFT_CARD: Gift cards (Google Play, App Store, Steam, PSN, etc.)
  PREMIUM: Premium app subscriptions (Spotify, Netflix, YouTube Premium, etc.)
';

CREATE TYPE public.package_type AS ENUM (
  'CURRENCY',
  'PASS',
  'BUNDLE'
);

COMMENT ON TYPE public.package_type IS '
description: Types of top-up packages
values:
  CURRENCY: In-game currency (diamonds, coins, etc.)
  PASS: Season pass, battle pass, etc.
  BUNDLE: Bundle of items or currency
';
