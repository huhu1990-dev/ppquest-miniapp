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
