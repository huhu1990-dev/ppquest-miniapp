CREATE TYPE public."GameV1" AS (
  id uuid_notnull,
  "createdAt" timestamptz_notnull,
  "updatedAt" timestamptz_notnull,
  name text_notnull,
  "iconUrl" text_notnull,
  "bannerUrl" text,
  description text,
  category public.game_category,
  platforms text[],
  "requiresPlayerId" bool_notnull,
  "playerIdLabel" text,
  "playerIdHelp" text,
  "requiresServer" bool_notnull,
  servers text[],
  "startingPriceInUsd" numeric,
  "isPopular" bool_notnull,
  "isNew" bool_notnull
);

CREATE TYPE public."PackageV1" AS (
  id uuid_notnull,
  "createdAt" timestamptz_notnull,
  "updatedAt" timestamptz_notnull,
  "gameId" uuid_notnull,
  name text_notnull,
  description text,
  type public.package_type,
  quantity int,
  "priceInUsd" numeric_notnull,
  "originalPriceInUsd" numeric,
  "isPromotion" bool_notnull,
  "promotionText" text
);
