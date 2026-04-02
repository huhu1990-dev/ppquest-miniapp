CREATE TYPE public."PromoCodeV1" AS (
  id uuid_notnull,
  "createdAt" timestamptz_notnull,
  code text_notnull,
  "discountPercent" int_notnull,
  "isActive" bool_notnull,
  "validFrom" timestamptz,
  "validUntil" timestamptz
);
