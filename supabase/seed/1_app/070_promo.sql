-- Seed promo codes for PPQuest gaming top-up

INSERT INTO private.promo_code (code, discount_percent, is_active, valid_from, valid_until, max_uses)
VALUES
  ('PPQUEST10', 10, true, NULL, NULL, NULL),
  ('TOPUP20', 20, true, NULL, NULL, NULL),
  ('WELCOME15', 15, true, NULL, NULL, 1000);
