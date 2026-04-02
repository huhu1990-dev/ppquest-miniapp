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
