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
