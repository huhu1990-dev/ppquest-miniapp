CREATE TYPE public."UserAppProfileV1" AS (
  id uuid_notnull,
  "createdAt" timestamptz_notnull,
  "updatedAt" timestamptz_notnull,
  "isOnboardingComplete" bool_notnull,
  "telegramUserId" text,
  "totalOrdersCount" int_notnull,
  "totalSpentInUsd" numeric_notnull
);

CREATE TYPE public."UserPreferenceV1" AS (
  id uuid_notnull,
  "createdAt" timestamptz_notnull,
  "updatedAt" timestamptz_notnull,
  "favoriteGameIds" uuid[]
);
