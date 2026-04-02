-- 0_lib/000_init/0_init.sql

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
-- Disable this line as otherwise the search path for pgcrypt functions needs to be explicitly specified
-- SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
-- pgjwt not supported anymore by supabase. If needed, use functions from here
---https://github.com/michelp/pgjwt/blob/master/pgjwt--0.2.0.sql
-- CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
-- Supabase vault extension resets the search path causiong "ERROR:  3F000: no schema has been selected to create in"
-- https://woz-crew.slack.com/archives/C09MUU8PXQB/p1761616184946489
-- Remove once supabase resolves this issue
SET search_path to "\$user", public, extensions; 

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

-- The schema we are using to store the actual data
CREATE SCHEMA IF NOT EXISTS private AUTHORIZATION pg_database_owner;
COMMENT ON SCHEMA "public" IS 'standard public schema';

-- https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/api/using-custom-schemas.mdx
GRANT USAGE ON SCHEMA private TO service_role, postgres;
GRANT ALL ON ALL TABLES IN SCHEMA private TO service_role, postgres;
GRANT ALL ON ALL ROUTINES IN SCHEMA private TO service_role, postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA private TO service_role, postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA private GRANT ALL ON TABLES TO service_role, postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA private GRANT ALL ON ROUTINES TO service_role, postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA private GRANT ALL ON SEQUENCES TO service_role, postgres;

-- Change the privileges for all functions created in the future in all schemas. 
-- Currently there is no way to limit it to a single schema. https://postgrest.org/en/v12/explanations/db_authz.html#functions
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM anon, authenticated, service_role;


-- 0_lib/000_init/1_types.sql

-- NOT NULL types to be used in composite types which otherwise don't support it: https://dba.stackexchange.com/a/342852/118434
CREATE DOMAIN public.bool_notnull AS bool NOT NULL;
CREATE DOMAIN public.smallint_notnull AS smallint NOT NULL;
CREATE DOMAIN public.int2_notnull AS int2 NOT NULL; 
CREATE DOMAIN public.int_notnull AS int NOT NULL;
CREATE DOMAIN public.int4_notnull AS int4 NOT NULL;
CREATE DOMAIN public.bigint_notnull AS bigint NOT NULL;
CREATE DOMAIN public.int8_notnull AS int8 NOT NULL; 
CREATE DOMAIN public.real_notnull AS real NOT NULL;
CREATE DOMAIN public.float4_notnull AS float4 NOT NULL;
CREATE DOMAIN public.double_notnull AS double precision NOT NULL;
CREATE DOMAIN public.float8_notnull AS float8 NOT NULL;
CREATE DOMAIN public.decimal_notnull AS decimal NOT NULL;
CREATE DOMAIN public.numeric_notnull AS numeric NOT NULL;
CREATE DOMAIN public.money_notnull AS money NOT NULL;

CREATE DOMAIN public.interval_notnull AS interval NOT NULL;
CREATE DOMAIN public.date_notnull AS date NOT NULL;
CREATE DOMAIN public.timetz_notnull AS timetz NOT NULL;
CREATE DOMAIN public.time_notnull AS time NOT NULL;
CREATE DOMAIN public.timestamptz_notnull AS timestamptz NOT NULL;
CREATE DOMAIN public.timestamp_notnull AS timestamp NOT NULL;
CREATE DOMAIN public.uuid_notnull AS uuid NOT NULL;

CREATE DOMAIN public.text_notnull AS text NOT NULL;
CREATE DOMAIN public.bytea_notnull AS bytea NOT NULL;
CREATE DOMAIN public.varchar_notnull AS varchar NOT NULL;
CREATE DOMAIN public.jsonb_notnull AS jsonb NOT NULL;

-- First, create the email domain for testing
CREATE DOMAIN public.email AS TEXT
CHECK (
    VALUE ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND LENGTH(VALUE) <= 254
    AND VALUE NOT LIKE '%..%'  -- No consecutive dots
    AND VALUE NOT LIKE '.%'    -- No leading dot
    AND VALUE NOT LIKE '%.'    -- No trailing dot
);

CREATE DOMAIN public.url AS TEXT;
-- CHECK (
    -- VALUE ~* '^(https?|ftp|ftps|file)://[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*(:(\d{1,5}))?(/.*)?(\?.*)?(\#.*)?$'
    -- OR VALUE ~* '^file:///[a-zA-Z0-9/._\-~%]+$'  -- Special handling for file:// URLs
    -- AND LENGTH(VALUE) <= 2048
-- )


-- 0_lib/000_init/7-uuid-api-funcs.sql

-- Implements a UUID "similar" to type v7 (without the version tag) to generate sortable UUIDs using a timestamp and random number:
-- https://www.ietf.org/archive/id/draft-peabody-dispatch-new-uuid-format-04.html#name-uuid-version-7
-- https://uuid7.com/
-- http://www.codeproject.com/Articles/388157/GUIDs-as-fast-primary-keys-under-multiple-database
--
-- We use 6 bytes (signed) for milliseconds since 1970 = 1628906 days = 4462 years
-- The remaining 10 bytes are random numbers

CREATE OR REPLACE FUNCTION public.uuid_from_millis(millis_since_1970 bigint, uuid1 uuid)
RETURNS uuid
RETURNS NULL ON NULL INPUT
IMMUTABLE
SET search_path = ''
LANGUAGE SQL
AS $$ SELECT (lpad(to_hex(millis_since_1970), 12, '0') || substring(uuid1::text from 14))::UUID; $$;
-- SELECT text('007bdc9c-'||substr(md5(random()::text), 9))::uuid

GRANT EXECUTE ON FUNCTION public.uuid_from_millis TO PUBLIC;

CREATE OR REPLACE FUNCTION public.uuid_from_timestamp(ts timestamptz = now(), uuid1 uuid = gen_random_uuid())
RETURNS uuid
RETURNS NULL ON NULL INPUT
IMMUTABLE
SET search_path = ''
LANGUAGE SQL
AS $$ SELECT public.uuid_from_millis((EXTRACT(EPOCH FROM ts)*1000)::bigint, uuid1);$$;

GRANT EXECUTE ON FUNCTION public.uuid_from_timestamp TO PUBLIC;


CREATE OR REPLACE FUNCTION public.uuid_from_longs(msb bigint, lsb bigint)
RETURNS uuid
RETURNS NULL ON NULL INPUT
IMMUTABLE
SET search_path = ''
LANGUAGE SQL
AS $$ SELECT (lpad(to_hex(msb), 16, '0') || lpad(to_hex(lsb), 16, '0'))::UUID; $$;

GRANT EXECUTE ON FUNCTION public.uuid_from_longs TO PUBLIC;

-- set the time and space component of the uuid to fixed values
CREATE OR REPLACE FUNCTION public.uuid_at(time_id bigint, space_id bigint = 0)
RETURNS uuid
RETURNS NULL ON NULL INPUT
IMMUTABLE
SET search_path = ''
LANGUAGE SQL
AS $$ SELECT (lpad(to_hex(time_id), 12, '0') || lpad(to_hex(space_id), 20, '0'))::UUID; $$;

GRANT EXECUTE ON FUNCTION public.uuid_at TO PUBLIC;


CREATE OR REPLACE FUNCTION public.int_id_from_millis(millis_since_1970 bigint) 
RETURNS integer
RETURNS NULL ON NULL INPUT
IMMUTABLE
SET search_path = ''
LANGUAGE SQL
-- use seconds since epoch, which is 2025-01-01 00:00:00 UTC
AS $$ SELECT (millis_since_1970 - 1735689600000)/1000; $$;

GRANT EXECUTE ON FUNCTION public.int_id_from_millis TO PUBLIC;


CREATE OR REPLACE FUNCTION public.int_id_from_timestamp(ts timestamptz = now()) 
RETURNS integer
RETURNS NULL ON NULL INPUT
IMMUTABLE
SET search_path = ''
LANGUAGE SQL 
-- epoch is 2025-01-01 00:00:00 UTC
AS $$ SELECT public.int_id_from_millis((EXTRACT(EPOCH FROM ts)*1000)::bigint); $$;

GRANT EXECUTE ON FUNCTION public.int_id_from_timestamp TO PUBLIC;


CREATE OR REPLACE FUNCTION private.bytea_to_int8(ba BYTEA, start_pos INT, num_bytes INT)
RETURNS int8
SET search_path = ''
LANGUAGE plpgsql
AS $$
DECLARE
  result int8 := 0;
  msb_bit int;
BEGIN
  IF num_bytes < 1 OR num_bytes > 8 THEN RETURN NULL; END IF;

  -- Get the most significant bit of the first byte
  msb_bit := (get_byte(ba, start_pos) >> 7) & 1;

  -- If MSB is 1 and we're reading less than 8 bytes, start with all 1s in upper bits
  IF msb_bit = 1 AND num_bytes < 8 THEN
    result := -1 << (num_bytes * 8);
  END IF;

  FOR i IN 0..num_bytes-1 LOOP
    result := result | (get_byte(ba, start_pos + i)::int8 << (8 * (num_bytes - 1 - i)));
  END LOOP;

  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION public.uuid_to_millis(uuid1 uuid)
RETURNS bigint
RETURNS NULL ON NULL INPUT
IMMUTABLE
SET search_path = ''
LANGUAGE SQL
AS $$ SELECT private.bytea_to_int8(uuid_send(uuid1), 0, 6); $$;
-- AS $$ SELECT ('x' || translate(uuid1::text, '-', ''))::bit(46)::bigint; $$;
-- AS $$ SELECT ('x' || translate(uuid1::text, '-', ''))::bit(64)::bigint; $$;

GRANT EXECUTE ON FUNCTION public.uuid_to_millis TO PUBLIC;


-- Combine an existing uuid and given millis into a new uuid. The millis will define the time part of
-- the uuid. The random part inside the uuid will be combined using XOR. We also include the millis into
-- XOR to make sure that a uuid with a timestamp part equal to the given millis will not just return the given uuid.
CREATE OR REPLACE FUNCTION public.uuid_add_millis_and_id(uuid1 uuid, millis_since1970 bigint = NULL, uuid2 uuid = NULL) 
RETURNS uuid
IMMUTABLE
SET search_path = ''
LANGUAGE plpgsql
AS $$
DECLARE
  v_bytea1 bytea;
  v_bytea2 bytea;
  v_millis_shifted bigint;
  v_tmp int;
BEGIN
    -- swap in case only one is null
  IF uuid1 IS NULL THEN
    uuid1 := uuid2;
    uuid2 := NULL;
  END IF;
  -- v_bytea1 := decode(replace(uuid1::text, '-', ''), 'hex');
  -- v_bytea2 := decode(replace(uuid2::text, '-', ''), 'hex');
  v_bytea1 := uuid_send(uuid1);
  v_bytea2 := uuid_send(uuid2);

  -- RAISE NOTICE '%', octet_length(v_bytea1);
  IF millis_since1970 IS NOT NULL THEN
    v_millis_shifted := (millis_since1970) << 16;
    FOR i IN 0..5 LOOP
      -- Write milliseconds to first 6 bytes
      v_tmp := (v_millis_shifted >> ((7 - (i % 8)) * 8) & 255)::int;
      v_bytea1 := set_byte(v_bytea1, i, v_tmp);
    END LOOP;
  END IF;

  FOR i IN 6..15 LOOP
    v_tmp := get_byte(v_bytea1, i);
    -- Apply milliseconds XOR if provided
    IF millis_since1970 IS NOT NULL THEN
      v_tmp := v_tmp # (millis_since1970 >> ((7 - (i % 8)) * 8) & 255)::int;
    END IF;

    -- Apply milliseconds XOR if provided
    IF v_bytea2 IS NOT NULL THEN
      v_tmp := v_tmp # get_byte(v_bytea2, i);
    END IF;
    v_bytea1 := set_byte(v_bytea1, i, v_tmp);
  END LOOP;

  RETURN encode(v_bytea1, 'hex')::uuid;
END;
$$;

GRANT EXECUTE ON FUNCTION public.uuid_add_millis_and_id TO PUBLIC;


CREATE OR REPLACE FUNCTION public.uuid_add_timestamp_and_id(uuid1 uuid, ts timestamptz = NULL, uuid2 uuid = NULL)
RETURNS uuid
IMMUTABLE
SET search_path = ''
LANGUAGE SQL
AS $$ SELECT public.uuid_add_millis_and_id(uuid1, (EXTRACT(EPOCH FROM ts)*1000)::bigint, uuid2); $$;

GRANT EXECUTE ON FUNCTION public.uuid_add_timestamp_and_id TO PUBLIC;


-- Convert UUID into url safe base64 ID
CREATE OR REPLACE FUNCTION public.uuid_to_base64(uuid1 uuid)
RETURNS text
IMMUTABLE
SET search_path = ''
LANGUAGE SQL
AS $$ SELECT substring(translate(encode(decode(replace(uuid1::text, '-', ''), 'hex'), 'base64'), '+/', '-_') for 22); $$;

GRANT EXECUTE ON FUNCTION public.uuid_to_base64 TO PUBLIC;

-- Convert url safe base64 ID into UUID
CREATE OR REPLACE FUNCTION public.uuid_from_base64(uuid_base64 text)
RETURNS uuid
IMMUTABLE
SET search_path = ''
LANGUAGE SQL 
-- add the trailing '==' characters to base64 string if missing
AS $$ SELECT encode(decode(translate(CASE WHEN right(uuid_base64, 2) != '==' THEN uuid_base64 || '==' ELSE uuid_base64 END, '-_', '+/'), 'base64'), 'hex')::UUID; $$;

GRANT EXECUTE ON FUNCTION public.uuid_from_base64 TO PUBLIC;

-- 0_lib/010_user/5_user-api-types.sql

CREATE TYPE public."UserV1" AS (
  id uuid_notnull,
  email public.email,
  "role" varchar(255),
  "emailConfirmedAt" timestamptz,
  "lastSignInAt" timestamptz,
  "createdAt" timestamptz,
  "updatedAt" timestamptz,
  phone text,
  "isSsoUser" bool_notnull,
  "deletedAt" timestamptz
);

-- 0_lib/010_user/7_user-api-funcs.sql

-- Method to be called by the client to delete user related data
CREATE OR REPLACE FUNCTION public."admin:user:deleteRelatedData"(
  "userId" UUID
)
RETURNS void
-- No SECURITY DEFINER, caller is admin
SET search_path = ''
LANGUAGE plpgsql
AS $$
BEGIN
  -- Delete organization
  IF EXISTS (
    SELECT 1 
    FROM information_schema.tables 
    WHERE table_schema = 'private' 
      AND table_name = 'organization'
  ) THEN
    DELETE FROM private.organization
    WHERE owner_entity_id = "userId";

    DELETE FROM private.organization_membership
    WHERE entity_id = "userId";
  END IF;

  -- Delete entity
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'private'
      AND table_name = 'entity'
  ) THEN
    DELETE FROM private.entity
    WHERE user_id = "userId";
  END IF;

  -- Delete profile
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'private'
      AND table_name = 'profile'
  ) THEN
    DELETE FROM private.profile
    WHERE id = "userId";
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public."admin:user:deleteRelatedData" TO service_role;

-- 0_lib/020_entity/1_entity-types.sql

CREATE TYPE public.entity_type AS ENUM (
  'PERSON', -- A user or person not in the system. We can tell if a person is a "user" if the user_id in the entity table is not null. Other use-case specific roles should probably be expressed through additional tables 
  'SYSTEM', -- Any system generated content that doesn't represent a "Bot". For example status messages
  'BOT' -- Has a persona and possibly a name and the user engages with it
);

COMMENT ON TYPE public.entity_type IS '
description: Entities that are used throughout the system
values:
  PERSON: A user or person not in the system. We can tell if a person is a "user" if the user_id in the entity table is not null. Other use-case specific roles should probably be expressed through additional tables 
  SYSTEM: Any system generated content that doesn''t represent a "Bot". For example status messages
  BOT: Has a persona and possibly a name and the user engages with it
';

-- 0_lib/020_entity/3_entity-tables.sql

CREATE TABLE IF NOT EXISTS private.entity (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  entity_type public.entity_type NOT NULL,
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE, -- make this index unique so we prevent more than one entity per user
  name text, -- can be used to name the system or bots or persons not registered in the system

  -- whenever user_id is not null, the id and user id should be equal. This makes querying easier in some cases since we usually have the user id available
  CONSTRAINT id_matches_user_id CHECK (user_id IS NULL OR id = user_id)
);

-- make this index unique so we prevent more than one entity per user
--CREATE UNIQUE INDEX IF NOT EXISTS entity_idx_user_id ON private.entity(user_id) WHERE user_id IS NOT NULL;

-- Add fixed entities
INSERT INTO private.entity (id, entity_type, name)
VALUES ('00000000-0000-0000-0000-000000000000', 'SYSTEM', 'system');

-- 0_lib/020_entity/5_entity-api-types.sql

CREATE TYPE public."EntityV1" AS (
  id uuid_notnull,
  "createdAt" timestamptz_notnull,
  "updatedAt" timestamptz_notnull,
  "entityType" public.entity_type,
  "userId" uuid,
  name text
);

-- 0_lib/020_entity/7_entity-api-funcs.sql

-- Function to check if entity exists
CREATE OR REPLACE FUNCTION public."app:entity:exists"("entityId" uuid)
RETURNS boolean
SECURITY DEFINER
SET search_path = ''
STABLE
LANGUAGE sql
AS $$
SELECT EXISTS(
  SELECT 1 
  FROM private.entity e
  WHERE e.id = "entityId"
  -- any authenticated user can read entities
  AND auth.uid() IS NOT NULL
);
$$;

GRANT EXECUTE ON FUNCTION public."app:entity:exists" TO authenticated;

-- Function to create user entity
CREATE OR REPLACE FUNCTION public."app:entity:user:create"()
RETURNS boolean
SECURITY DEFINER
SET search_path = ''
LANGUAGE sql
AS $$
WITH inserted AS (
  INSERT INTO private.entity (id, entity_type, user_id)
  SELECT auth.uid(), 'PERSON', auth.uid()
  -- Only allow if user is authenticated and creating their own entity
  WHERE auth.uid() IS NOT NULL 
  ON CONFLICT (id) DO NOTHING
  RETURNING id
)
SELECT EXISTS(SELECT 1 FROM inserted) OR EXISTS(
  SELECT 1 FROM private.entity WHERE id = auth.uid()
);
$$;

GRANT EXECUTE ON FUNCTION public."app:entity:user:create" TO authenticated;

-- Function to update user entity
CREATE OR REPLACE FUNCTION public."app:entity:user:update"(
  "newEntityType" public.entity_type DEFAULT NULL,
  "newName" text DEFAULT NULL
)
RETURNS boolean
SECURITY DEFINER
SET search_path = ''
LANGUAGE sql
AS $$
WITH updated AS (
  UPDATE private.entity
  SET 
    entity_type = COALESCE("newEntityType", entity_type),
    name = COALESCE("newName", name),
    updated_at = CURRENT_TIMESTAMP
  WHERE id = auth.uid()
    -- Only allow users to update their own entity
    AND user_id = auth.uid()
    AND auth.uid() IS NOT NULL
  RETURNING id
)
SELECT EXISTS(SELECT 1 FROM updated);
$$;

GRANT EXECUTE ON FUNCTION public."app:entity:user:update" TO authenticated;

-- Function to read user entity data
CREATE OR REPLACE FUNCTION public."app:entity:user:read"()
RETURNS public."EntityV1"
SECURITY DEFINER
SET search_path = ''
STABLE
LANGUAGE sql
AS $$
SELECT ROW(
  e.id,
  e.created_at,
  e.updated_at,
  e.entity_type,
  e.user_id,
  e.name
)::public."EntityV1"
FROM private.entity e
WHERE e.id = auth.uid()
  AND e.user_id = auth.uid()
  AND auth.uid() IS NOT NULL
LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public."app:entity:user:read" TO authenticated;

-- Get entity by email (case-insensitive)
CREATE OR REPLACE FUNCTION public."admin:entity:getByEmail"("userEmail" TEXT)
RETURNS TABLE("entityId" UUID, email TEXT)
SECURITY DEFINER -- Added SECURITY DEFINER to access auth.users from admin function with service_role
SET search_path = ''
LANGUAGE sql
STABLE
AS $$
  SELECT e.id, u.email
  FROM private.entity e
  JOIN auth.users u ON u.id = e.user_id
  WHERE LOWER(u.email) = LOWER("userEmail")
  LIMIT 1;
$$;
GRANT EXECUTE ON FUNCTION public."admin:entity:getByEmail" TO service_role;
-- 0_lib/030_asset/5_asset-api-types.sql

CREATE TYPE public."AssetV1" AS (
  id uuid_notnull,
  "bucketId" text,
  name text,
  "ownerId" text,
  "mimeType" text
);


-- 0_lib/030_asset/7_asset-api-funcs.sql


CREATE OR REPLACE FUNCTION public."app:assets:user:read"()
RETURNS SETOF public."AssetV1"
STABLE
SECURITY DEFINER
SET search_path = ''
LANGUAGE sql
AS $$    
SELECT 
  id,
  bucket_id,
  name,
  owner_id,
  metadata->>'mimetype'
FROM "storage".objects
-- Can only read your own
WHERE owner_id = auth.uid()::text;
$$;

GRANT EXECUTE ON FUNCTION public."app:assets:user:read" TO authenticated;

CREATE OR REPLACE FUNCTION public."admin:assets:user:read"("ownerId" uuid)
RETURNS SETOF public."AssetV1"
STABLE
-- No SECURITY DEFINER, caller is admin
SET search_path = ''
LANGUAGE sql
AS $$    
SELECT 
  id,
  bucket_id,
  name,
  owner_id,
  metadata->>'mimetype'
FROM "storage".objects
-- Admin can read all
WHERE owner_id = "ownerId"::text;
$$;

-- Restrict admin access to service role 
GRANT EXECUTE ON FUNCTION public."admin:assets:user:read" TO service_role;

-- 0_lib/040_profile/1_profile-types.sql


CREATE TYPE public.gender_type AS ENUM (
  'MALE',
  'FEMALE',
  'NON_BINARY'
);
COMMENT ON TYPE public.gender_type IS '
description: Available genders
values:
  MALE: Male gender
  FEMALE: Female gender
  NON_BINARY: Non-binary gender
';

-- 0_lib/040_profile/3_profile-tables.sql

-- Based on https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native
-- Create a table for user profiles
CREATE TABLE IF NOT EXISTS private.profile (
  id uuid NOT NULL primary key REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  username text unique,
  full_name text,
  avatar_url text,
  -- gender_type_id int2 REFERENCES private.gender_type(id),
  gender public.gender_type,
  given_name text, -- use also for "first_name"
  family_name text, -- use also for "last_name"
  birth_date date,

  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- Add structured comment with metadata
COMMENT ON COLUMN private.profile.avatar_url IS '
description: URL to user''s profile picture
type: imageUrl
';


-- 0_lib/040_profile/4_profile-funcs.sql


-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
CREATE OR REPLACE FUNCTION private.handle_new_user() RETURNS trigger
SECURITY DEFINER -- need security definer for RLS
SET "search_path" TO ''
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO private.profile (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');

  INSERT INTO private.entity (id, entity_type, user_id)
  VALUES (NEW.id, 'PERSON', NEW.id);
  RETURN NEW;
END;
$$;
CREATE OR REPLACE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION private.handle_new_user();

-- 0_lib/040_profile/5_profile-api-types.sql


CREATE TYPE public."ProfileV1" AS (
  id uuid_notnull,
  "createdAt" timestamptz_notnull,
  "updatedAt" timestamptz_notnull,
  username text,
  "fullName" text,
  "avatarUrl" text,
  gender public.gender_type,
  "givenName" text, -- use also for "firstName"
  "familyName" text, -- use also for "lastName"
  "birthDate" date
);

CREATE TYPE public."ProfileWithEmailV1" AS (
  profile public."ProfileV1",
  email public.email
);

CREATE TYPE public."ProfileUpdateV1" AS (
  "updatedAt" timestamptz,
  username text,
  "fullName" text,
  "avatarUrl" text,
  gender public.gender_type,
  "givenName" text,
  "familyName" text,
  "birthDate" date
);

-- 0_lib/040_profile/7_profile-api-funcs.sql



CREATE OR REPLACE FUNCTION public."app:profile:user:read"()
RETURNS public."ProfileV1"
SECURITY DEFINER
SET search_path = ''
LANGUAGE sql
AS $$
SELECT p.*
FROM private.profile p
-- Can only read your own
WHERE p.id = auth.uid();
$$;

GRANT EXECUTE ON FUNCTION public."app:profile:user:read" TO authenticated;

CREATE OR REPLACE FUNCTION public."app:profile:user:readWithEmail"()
RETURNS public."ProfileWithEmailV1"
SECURITY DEFINER
SET search_path = ''
STABLE
LANGUAGE sql
AS $$
SELECT ROW(
  ROW(p.*)::public."ProfileV1",
  u.email
)::public."ProfileWithEmailV1"
FROM private.profile p
INNER JOIN auth.users u ON u.id = p.id
-- Can only read your own
WHERE p.id = auth.uid();
$$;

GRANT EXECUTE ON FUNCTION public."app:profile:user:readWithEmail" TO authenticated;


CREATE OR REPLACE FUNCTION public."app:profile:user:update"(
  "avatarUrl" text DEFAULT '___UNSET___',
  username TEXT DEFAULT '___UNSET___',
  "fullName" TEXT DEFAULT '___UNSET___',
  "givenName" TEXT DEFAULT '___UNSET___',
  "familyName" TEXT DEFAULT '___UNSET___',
  "birthDate" DATE DEFAULT '1900-01-01'::DATE,
  gender public.gender_type DEFAULT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT '1900-01-01 00:00:00+00'::TIMESTAMPTZ
)
RETURNS public."ProfileV1"
SECURITY DEFINER
SET search_path = ''
LANGUAGE sql
AS $$
UPDATE private.profile p SET
  updated_at = CASE WHEN "updatedAt" != '1900-01-01 00:00:00+00'::TIMESTAMPTZ THEN "updatedAt" ELSE CURRENT_TIMESTAMP END,
  username = CASE WHEN username IS DISTINCT FROM '___UNSET___' THEN username ELSE p.username END,
  full_name = CASE WHEN "fullName" IS DISTINCT FROM '___UNSET___' THEN "fullName" ELSE p.full_name END,
  avatar_url = CASE WHEN "avatarUrl" IS DISTINCT FROM '___UNSET___' THEN "avatarUrl" ELSE p.avatar_url END,
  gender = CASE WHEN gender IS NOT NULL THEN gender ELSE p.gender END,
  given_name = CASE WHEN "givenName" IS DISTINCT FROM '___UNSET___' THEN "givenName" ELSE p.given_name END,
  family_name = CASE WHEN "familyName" IS DISTINCT FROM '___UNSET___' THEN "familyName" ELSE p.family_name END,
  birth_date = CASE WHEN "birthDate" != '1900-01-01'::DATE THEN "birthDate" ELSE p.birth_date END
-- Can only update your own
WHERE p.id = auth.uid()
RETURNING *;
$$;

GRANT EXECUTE ON FUNCTION public."app:profile:user:update" TO authenticated;

-- 0_lib/040_profile/8_profile-buckets.sql

INSERT INTO storage.buckets (id, name)
  VALUES ('avatars', 'avatars');

INSERT INTO storage.buckets (id, name)
  VALUES ('app-assets', 'app-assets');


-- Set up access controls for storage.
-- See https://supabase.com/docs/guides/storage/security/access-control#policy-examples for more details.
-- https://www.postgresql.org/docs/current/sql-createpolicy.html
-- Note: these policies don't restrict to specific roles such as 
-- https://supabase.com/docs/guides/database/postgres/roles#supabase-roles
-- TODO: restrict these more to logged-in users by using `TO authenticated`? 
-- https://supabase.com/docs/guides/storage/security/access-control#policy-examples
CREATE POLICY "Avatar images are publicly accessible." ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Anyone can upload an avatar." ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'avatars');

-- The USING expression determines which records the UPDATE command will see to operate against, 
-- while the WITH CHECK expression defines which modified rows are allowed to be stored back into the relation.
CREATE POLICY "Anyone can update their own avatar." ON storage.objects
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = owner_id::uuid) WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "service role has full access to app-assets bucket" ON storage.objects
FOR ALL 
TO service_role
USING (bucket_id = 'app-assets')
WITH CHECK (bucket_id = 'app-assets');

-- 1_app/045_user_app/3_user-app-tables.sql

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

-- 1_app/045_user_app/5_user-app-api-types.sql

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

-- 1_app/045_user_app/7_user-app-api-funcs.sql

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

-- 1_app/050_game/1_game-types.sql

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

-- 1_app/050_game/3_game-tables.sql

CREATE TABLE IF NOT EXISTS private.game (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  name text NOT NULL,
  icon_url text NOT NULL,
  banner_url text,
  description text,
  category public.game_category NOT NULL,
  platforms text[] NOT NULL DEFAULT '{}',
  requires_player_id boolean NOT NULL DEFAULT true,
  player_id_label text,
  player_id_help text,
  requires_server boolean NOT NULL DEFAULT false,
  servers text[],
  starting_price_in_usd numeric(10, 2),
  is_popular boolean NOT NULL DEFAULT false,
  is_new boolean NOT NULL DEFAULT false,

  CONSTRAINT name_length CHECK (char_length(name) >= 1 AND char_length(name) <= 100),
  CONSTRAINT description_length CHECK (description IS NULL OR char_length(description) <= 1000),
  CONSTRAINT player_id_label_length CHECK (player_id_label IS NULL OR char_length(player_id_label) <= 50),
  CONSTRAINT player_id_help_length CHECK (player_id_help IS NULL OR char_length(player_id_help) <= 500),
  CONSTRAINT starting_price_non_negative CHECK (starting_price_in_usd IS NULL OR starting_price_in_usd >= 0),
  CONSTRAINT platforms_not_empty CHECK (array_length(platforms, 1) >= 1)
);

CREATE INDEX game_idx_category ON private.game(category);
CREATE INDEX game_idx_is_popular ON private.game(is_popular) WHERE is_popular = true;
CREATE INDEX game_idx_is_new ON private.game(is_new) WHERE is_new = true;

CREATE TABLE IF NOT EXISTS private.package (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  game_id uuid NOT NULL REFERENCES private.game(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  type public.package_type NOT NULL,
  quantity int,
  price_in_usd numeric(10, 2) NOT NULL,
  original_price_in_usd numeric(10, 2),
  is_promotion boolean NOT NULL DEFAULT false,
  promotion_text text,

  CONSTRAINT name_length CHECK (char_length(name) >= 1 AND char_length(name) <= 100),
  CONSTRAINT description_length CHECK (description IS NULL OR char_length(description) <= 500),
  CONSTRAINT quantity_positive CHECK (quantity IS NULL OR quantity >= 1),
  CONSTRAINT price_non_negative CHECK (price_in_usd >= 0),
  CONSTRAINT original_price_non_negative CHECK (original_price_in_usd IS NULL OR original_price_in_usd >= 0),
  CONSTRAINT promotion_text_length CHECK (promotion_text IS NULL OR char_length(promotion_text) <= 50)
);

CREATE INDEX package_idx_game_id ON private.package(game_id);
CREATE INDEX package_idx_type ON private.package(type);

-- 1_app/050_game/5_game-api-types.sql

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

-- 1_app/050_game/7_game-api-funcs.sql

-- Read all games (public access for browsing, no login required)
CREATE OR REPLACE FUNCTION public."app:game:readAll"()
RETURNS SETOF public."GameV1"
SECURITY DEFINER
SET search_path = ''
STABLE
LANGUAGE sql
AS $$
  SELECT
    g.id,
    g.created_at,
    g.updated_at,
    g.name,
    g.icon_url,
    g.banner_url,
    g.description,
    g.category,
    g.platforms,
    g.requires_player_id,
    g.player_id_label,
    g.player_id_help,
    g.requires_server,
    g.servers,
    g.starting_price_in_usd,
    g.is_popular,
    g.is_new
  FROM private.game g
  ORDER BY g.is_popular DESC, g.name ASC;
$$;

GRANT EXECUTE ON FUNCTION public."app:game:readAll" TO anon, authenticated;

-- Read a single game by ID
CREATE OR REPLACE FUNCTION public."app:game:read"(
  "gameId" uuid
)
RETURNS public."GameV1"
SECURITY DEFINER
SET search_path = ''
STABLE
LANGUAGE sql
AS $$
  SELECT
    g.id,
    g.created_at,
    g.updated_at,
    g.name,
    g.icon_url,
    g.banner_url,
    g.description,
    g.category,
    g.platforms,
    g.requires_player_id,
    g.player_id_label,
    g.player_id_help,
    g.requires_server,
    g.servers,
    g.starting_price_in_usd,
    g.is_popular,
    g.is_new
  FROM private.game g
  WHERE g.id = "gameId";
$$;

GRANT EXECUTE ON FUNCTION public."app:game:read" TO anon, authenticated;

-- Read all packages for a game (public access)
CREATE OR REPLACE FUNCTION public."app:game:package:readAll"(
  "gameId" uuid
)
RETURNS SETOF public."PackageV1"
SECURITY DEFINER
SET search_path = ''
STABLE
LANGUAGE sql
AS $$
  SELECT
    p.id,
    p.created_at,
    p.updated_at,
    p.game_id,
    p.name,
    p.description,
    p.type,
    p.quantity,
    p.price_in_usd,
    p.original_price_in_usd,
    p.is_promotion,
    p.promotion_text
  FROM private.package p
  WHERE p.game_id = "gameId"
  ORDER BY p.type, p.price_in_usd ASC;
$$;

GRANT EXECUTE ON FUNCTION public."app:game:package:readAll" TO anon, authenticated;

-- Read a single package by ID
CREATE OR REPLACE FUNCTION public."app:game:package:read"(
  "packageId" uuid
)
RETURNS public."PackageV1"
SECURITY DEFINER
SET search_path = ''
STABLE
LANGUAGE sql
AS $$
  SELECT
    p.id,
    p.created_at,
    p.updated_at,
    p.game_id,
    p.name,
    p.description,
    p.type,
    p.quantity,
    p.price_in_usd,
    p.original_price_in_usd,
    p.is_promotion,
    p.promotion_text
  FROM private.package p
  WHERE p.id = "packageId";
$$;

GRANT EXECUTE ON FUNCTION public."app:game:package:read" TO anon, authenticated;

-- 1_app/055_saved_account/3_saved-account-tables.sql

-- Saved game accounts (player UIDs per game) for quick top-up
-- Must run after 050_game since it references private.game
CREATE TABLE IF NOT EXISTS private.saved_game_account (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id uuid NOT NULL REFERENCES private.game(id) ON DELETE CASCADE,
  player_id text NOT NULL,
  server text,
  nickname text,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT player_id_not_empty CHECK (char_length(player_id) >= 1 AND char_length(player_id) <= 100),
  CONSTRAINT nickname_length CHECK (nickname IS NULL OR char_length(nickname) <= 50),
  CONSTRAINT saved_game_account_unique UNIQUE(user_id, game_id, player_id)
);

CREATE INDEX saved_game_account_idx_user_id ON private.saved_game_account(user_id);

-- 1_app/055_saved_account/5_saved-account-api-types.sql

-- Must run after 050_game since SavedGameAccountV1 embeds GameV1
CREATE TYPE public."SavedGameAccountV1" AS (
  id uuid_notnull,
  "userId" uuid_notnull,
  "gameId" uuid_notnull,
  "playerId" text_notnull,
  server text,
  nickname text,
  "createdAt" timestamptz_notnull,
  "updatedAt" timestamptz_notnull,
  game public."GameV1"
);

-- 1_app/055_saved_account/7_saved-account-api-funcs.sql

-- Read all saved game accounts for the current user (with game info joined)
CREATE OR REPLACE FUNCTION public."app:userApp:savedAccount:readAll"()
RETURNS SETOF public."SavedGameAccountV1"
SECURITY DEFINER
SET search_path = ''
STABLE
LANGUAGE sql
AS $$
  SELECT
    s.id,
    s.user_id,
    s.game_id,
    s.player_id,
    s.server,
    s.nickname,
    s.created_at,
    s.updated_at,
    ROW(
      g.id,
      g.created_at,
      g.updated_at,
      g.name,
      g.icon_url,
      g.banner_url,
      g.description,
      g.category,
      g.platforms,
      g.requires_player_id,
      g.player_id_label,
      g.player_id_help,
      g.requires_server,
      g.servers,
      g.starting_price_in_usd,
      g.is_popular,
      g.is_new
    )::public."GameV1"
  FROM private.saved_game_account s
  JOIN private.game g ON g.id = s.game_id
  WHERE s.user_id = auth.uid()
  ORDER BY s.updated_at DESC;
$$;

GRANT EXECUTE ON FUNCTION public."app:userApp:savedAccount:readAll" TO authenticated;

-- Upsert a saved game account (insert or update by game_id + player_id)
CREATE OR REPLACE FUNCTION public."app:userApp:savedAccount:upsert"(
  "gameId" uuid,
  "playerId" text,
  "server" text DEFAULT NULL,
  "nickname" text DEFAULT NULL
)
RETURNS public."SavedGameAccountV1"
SECURITY DEFINER
SET search_path = ''
LANGUAGE plpgsql
AS $$
DECLARE
  _result public."SavedGameAccountV1";
  _id uuid;
BEGIN
  INSERT INTO private.saved_game_account (user_id, game_id, player_id, server, nickname)
  VALUES (auth.uid(), "gameId", "playerId", "server", "nickname")
  ON CONFLICT (user_id, game_id, player_id)
  DO UPDATE SET
    server = EXCLUDED.server,
    nickname = EXCLUDED.nickname,
    updated_at = CURRENT_TIMESTAMP
  RETURNING id INTO _id;

  SELECT
    s.id,
    s.user_id,
    s.game_id,
    s.player_id,
    s.server,
    s.nickname,
    s.created_at,
    s.updated_at,
    ROW(
      g.id,
      g.created_at,
      g.updated_at,
      g.name,
      g.icon_url,
      g.banner_url,
      g.description,
      g.category,
      g.platforms,
      g.requires_player_id,
      g.player_id_label,
      g.player_id_help,
      g.requires_server,
      g.servers,
      g.starting_price_in_usd,
      g.is_popular,
      g.is_new
    )::public."GameV1"
  INTO _result
  FROM private.saved_game_account s
  JOIN private.game g ON g.id = s.game_id
  WHERE s.id = _id;

  RETURN _result;
END;
$$;

GRANT EXECUTE ON FUNCTION public."app:userApp:savedAccount:upsert" TO authenticated;

-- Delete a saved game account by id (only owner can delete)
CREATE OR REPLACE FUNCTION public."app:userApp:savedAccount:delete"(
  "savedAccountId" uuid
)
RETURNS void
SECURITY DEFINER
SET search_path = ''
LANGUAGE sql
AS $$
  DELETE FROM private.saved_game_account
  WHERE id = "savedAccountId" AND user_id = auth.uid();
$$;

GRANT EXECUTE ON FUNCTION public."app:userApp:savedAccount:delete" TO authenticated;

-- 1_app/060_order/1_order-types.sql

CREATE TYPE public.order_status AS ENUM (
  'PROCESSING',
  'COMPLETED',
  'FAILED',
  'REFUNDED'
);

COMMENT ON TYPE public.order_status IS '
description: Status of a top-up order
values:
  PROCESSING: Order is being processed
  COMPLETED: Order has been delivered successfully
  FAILED: Order processing failed
  REFUNDED: Order has been refunded
';

CREATE TYPE public.payment_method AS ENUM (
  'CARD',
  'E_WALLET',
  'TELEGRAM_PAYMENT',
  'CRYPTO',
  'PPWALLET'
);

COMMENT ON TYPE public.payment_method IS '
description: Available payment methods
values:
  CARD: Credit or debit card payment
  E_WALLET: E-wallet payment (GCash, PayMaya, etc.)
  TELEGRAM_PAYMENT: Telegram built-in payment system
  CRYPTO: Cryptocurrency payment (USDT, BTC, ETH, etc.)
  PPWALLET: Pay via PPWallet (THB balance)
';

-- 1_app/060_order/3_order-tables.sql

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

-- 1_app/060_order/5_order-api-types.sql

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

-- 1_app/060_order/7_order-api-funcs.sql

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

-- 1_app/070_promo/3_promo-tables.sql

CREATE TABLE IF NOT EXISTS private.promo_code (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  code text NOT NULL,
  discount_percent int NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  valid_from timestamptz,
  valid_until timestamptz,
  max_uses int,
  current_uses int NOT NULL DEFAULT 0,

  CONSTRAINT code_unique UNIQUE (code),
  CONSTRAINT code_length CHECK (char_length(code) >= 1 AND char_length(code) <= 50),
  CONSTRAINT discount_percent_range CHECK (discount_percent >= 1 AND discount_percent <= 100),
  CONSTRAINT current_uses_non_negative CHECK (current_uses >= 0),
  CONSTRAINT max_uses_positive CHECK (max_uses IS NULL OR max_uses >= 1)
);

CREATE INDEX promo_code_idx_code ON private.promo_code(code);
CREATE INDEX promo_code_idx_is_active ON private.promo_code(is_active) WHERE is_active = true;

-- 1_app/070_promo/5_promo-api-types.sql

CREATE TYPE public."PromoCodeV1" AS (
  id uuid_notnull,
  "createdAt" timestamptz_notnull,
  code text_notnull,
  "discountPercent" int_notnull,
  "isActive" bool_notnull,
  "validFrom" timestamptz,
  "validUntil" timestamptz
);

-- 1_app/070_promo/7_promo-api-funcs.sql

-- Validate a promo code and return it if valid, null otherwise
-- Also increments current_uses on successful validation
CREATE OR REPLACE FUNCTION public."app:promo:validate"(
  "promoCode" text
)
RETURNS public."PromoCodeV1"
SECURITY DEFINER
SET search_path = ''
LANGUAGE plpgsql
AS $$
DECLARE
  _result public."PromoCodeV1";
  _upper_code text;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN NULL;
  END IF;

  _upper_code := upper(trim("promoCode"));

  SELECT
    pc.id,
    pc.created_at,
    pc.code,
    pc.discount_percent,
    pc.is_active,
    pc.valid_from,
    pc.valid_until
  INTO _result
  FROM private.promo_code pc
  WHERE pc.code = _upper_code
    AND pc.is_active = true
    AND (pc.valid_from IS NULL OR pc.valid_from <= CURRENT_TIMESTAMP)
    AND (pc.valid_until IS NULL OR pc.valid_until >= CURRENT_TIMESTAMP)
    AND (pc.max_uses IS NULL OR pc.current_uses < pc.max_uses);

  IF _result.id IS NULL THEN
    RETURN NULL;
  END IF;

  UPDATE private.promo_code
  SET current_uses = current_uses + 1,
      updated_at = CURRENT_TIMESTAMP
  WHERE id = _result.id;

  RETURN _result;
END;
$$;

GRANT EXECUTE ON FUNCTION public."app:promo:validate" TO authenticated;
