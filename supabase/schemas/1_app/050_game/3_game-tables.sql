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
