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
