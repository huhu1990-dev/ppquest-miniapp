CREATE TYPE public."OrderV1" AS (
  id uuid_notnull,
  "createdAt" timestamptz_notnull,
  "userId" uuid_notnull,
  "gameId" uuid_notnull,
  "gameName" text_notnull,
  "gameIconUrl" text_notnull,
  "packageId" uuid_notnull,
  "packageName" text_notnull,
  "playerId" text,
  server text,
  "amountInUsd" numeric_notnull,
  "discountInUsd" numeric_notnull,
  "promoCode" text,
  "paymentMethod" public.payment_method,
  status public.order_status,
  "completedAt" timestamptz,
  "estimatedDeliveryInMin" int_notnull
);
