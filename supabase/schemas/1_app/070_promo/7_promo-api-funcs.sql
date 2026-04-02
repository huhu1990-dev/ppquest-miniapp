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
