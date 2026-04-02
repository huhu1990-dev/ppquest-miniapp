-- Seed games for PPQuest gaming top-up catalog

INSERT INTO private.game (id, name, icon_url, banner_url, description, category, platforms, requires_player_id, player_id_label, player_id_help, requires_server, servers, starting_price_in_usd, is_popular, is_new)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Mobile Legends', 'https://source.unsplash.com/Mf23RF8xArY/128x128', 'https://source.unsplash.com/Mf23RF8xArY/600x300', 'Top up diamonds for Mobile Legends: Bang Bang', 'MOBILE', ARRAY['iOS', 'Android'], true, 'User ID', 'Open Mobile Legends > Profile > Below your name you will see your User ID and Server ID', true, ARRAY['Asia (2001)', 'Europe (4001)', 'NA (5001)'], 0.99, true, false),
  ('a0000000-0000-0000-0000-000000000002', 'Genshin Impact', 'https://source.unsplash.com/m3hn2Kn5Bns/128x128', 'https://source.unsplash.com/m3hn2Kn5Bns/600x300', 'Purchase Genesis Crystals for Genshin Impact', 'PC', ARRAY['PC', 'iOS', 'Android', 'PS5'], true, 'UID', 'Open Genshin Impact > Paimon Menu > Your UID is shown at the bottom of the screen', true, ARRAY['America', 'Europe', 'Asia', 'TW/HK/MO'], 0.99, true, false),
  ('a0000000-0000-0000-0000-000000000003', 'VALORANT', 'https://source.unsplash.com/EHLd2utEf68/128x128', 'https://source.unsplash.com/EHLd2utEf68/600x300', 'Buy VALORANT Points for skins and battle pass', 'PC', ARRAY['PC'], true, 'Riot ID', 'Your Riot ID is shown in the top right of the VALORANT client (e.g. Player#TAG)', false, NULL, 4.99, true, false),
  ('a0000000-0000-0000-0000-000000000004', 'PUBG Mobile', 'https://source.unsplash.com/eCktzGjC-iU/128x128', 'https://source.unsplash.com/eCktzGjC-iU/600x300', 'Top up UC for PUBG Mobile', 'MOBILE', ARRAY['iOS', 'Android'], true, 'Player ID', 'Open PUBG Mobile > Settings > Basic > Your Player ID is displayed at the bottom', false, NULL, 0.99, true, false),
  ('a0000000-0000-0000-0000-000000000005', 'Honkai: Star Rail', 'https://source.unsplash.com/nCU4yq5xDEQ/128x128', 'https://source.unsplash.com/nCU4yq5xDEQ/600x300', 'Purchase Oneiric Shards for Honkai: Star Rail', 'PC', ARRAY['PC', 'iOS', 'Android', 'PS5'], true, 'UID', 'Open Honkai: Star Rail > Phone Menu > Your UID is at the bottom of the screen', true, ARRAY['America', 'Europe', 'Asia', 'TW/HK/MO'], 0.99, false, true),
  ('a0000000-0000-0000-0000-000000000006', 'Free Fire', 'https://source.unsplash.com/hUD0PUczwJQ/128x128', 'https://source.unsplash.com/hUD0PUczwJQ/600x300', 'Top up diamonds for Garena Free Fire', 'MOBILE', ARRAY['iOS', 'Android'], true, 'Player ID', 'Open Free Fire > Profile (top left) > Your Player ID is below your name', false, NULL, 0.99, true, false),
  ('a0000000-0000-0000-0000-000000000007', 'League of Legends: Wild Rift', 'https://source.unsplash.com/caNzzoxls8Q/128x128', 'https://source.unsplash.com/caNzzoxls8Q/600x300', 'Purchase Wild Cores for League of Legends: Wild Rift', 'MOBILE', ARRAY['iOS', 'Android'], true, 'Riot ID', 'Your Riot ID can be found in Settings > Account in Wild Rift', false, NULL, 4.99, false, true),
  ('a0000000-0000-0000-0000-000000000008', 'Roblox', 'https://source.unsplash.com/ITFwHdPEED0/128x128', 'https://source.unsplash.com/ITFwHdPEED0/600x300', 'Buy Robux for Roblox', 'PC', ARRAY['PC', 'iOS', 'Android', 'Xbox'], true, 'Username', 'Your Roblox username is shown on your profile page at roblox.com', false, NULL, 4.99, true, false),
  ('a0000000-0000-0000-0000-000000000009', 'Call of Duty: Mobile', 'https://source.unsplash.com/auf3GwpVaOM/128x128', 'https://source.unsplash.com/auf3GwpVaOM/600x300', 'Top up CP for Call of Duty: Mobile', 'MOBILE', ARRAY['iOS', 'Android'], true, 'Player UID', 'Open COD Mobile > Settings > Legal & Privacy > Your UID is displayed', false, NULL, 0.99, false, false),
  ('a0000000-0000-0000-0000-000000000010', 'Fortnite', 'https://source.unsplash.com/WcrqKjgMPfI/128x128', 'https://source.unsplash.com/WcrqKjgMPfI/600x300', 'Purchase V-Bucks for Fortnite', 'CONSOLE', ARRAY['PC', 'PS5', 'Xbox', 'Switch', 'iOS', 'Android'], true, 'Epic Username', 'Your Epic username is shown in the top right of the Fortnite lobby', false, NULL, 7.99, true, true);

-- Seed packages for each game

-- Mobile Legends packages
INSERT INTO private.package (game_id, name, description, type, quantity, price_in_usd, original_price_in_usd, is_promotion, promotion_text)
VALUES
  ('a0000000-0000-0000-0000-000000000001', '11 Diamonds', 'Mobile Legends diamonds', 'CURRENCY', 11, 0.99, NULL, false, NULL),
  ('a0000000-0000-0000-0000-000000000001', '56 Diamonds', 'Mobile Legends diamonds', 'CURRENCY', 56, 1.99, NULL, false, NULL),
  ('a0000000-0000-0000-0000-000000000001', '112 Diamonds', 'Mobile Legends diamonds', 'CURRENCY', 112, 3.99, NULL, false, NULL),
  ('a0000000-0000-0000-0000-000000000001', '223 Diamonds', 'Mobile Legends diamonds', 'CURRENCY', 223, 6.99, NULL, false, NULL),
  ('a0000000-0000-0000-0000-000000000001', '570 Diamonds', 'Mobile Legends diamonds', 'CURRENCY', 570, 14.99, 16.99, true, '12% OFF'),
  ('a0000000-0000-0000-0000-000000000001', 'Weekly Pass', 'Weekly Diamond Pass', 'PASS', NULL, 1.99, NULL, false, NULL),
  ('a0000000-0000-0000-0000-000000000001', 'Starlight Pass', 'Monthly Starlight Membership', 'PASS', NULL, 9.99, NULL, false, NULL);

-- Genshin Impact packages
INSERT INTO private.package (game_id, name, description, type, quantity, price_in_usd, original_price_in_usd, is_promotion, promotion_text)
VALUES
  ('a0000000-0000-0000-0000-000000000002', '60 Genesis Crystals', 'Genshin Impact crystals', 'CURRENCY', 60, 0.99, NULL, false, NULL),
  ('a0000000-0000-0000-0000-000000000002', '300 Genesis Crystals', 'Genshin Impact crystals', 'CURRENCY', 300, 4.99, NULL, false, NULL),
  ('a0000000-0000-0000-0000-000000000002', '980 Genesis Crystals', 'Genshin Impact crystals', 'CURRENCY', 980, 14.99, NULL, false, NULL),
  ('a0000000-0000-0000-0000-000000000002', '1980 Genesis Crystals', 'Genshin Impact crystals', 'CURRENCY', 1980, 29.99, NULL, false, NULL),
  ('a0000000-0000-0000-0000-000000000002', '3280 Genesis Crystals', 'Genshin Impact crystals', 'CURRENCY', 3280, 49.99, 54.99, true, '10% OFF'),
  ('a0000000-0000-0000-0000-000000000002', 'Blessing of the Welkin Moon', '30-day premium pass', 'PASS', NULL, 4.99, NULL, false, NULL);

-- VALORANT packages
INSERT INTO private.package (game_id, name, description, type, quantity, price_in_usd, original_price_in_usd, is_promotion, promotion_text)
VALUES
  ('a0000000-0000-0000-0000-000000000003', '475 VP', 'VALORANT Points', 'CURRENCY', 475, 4.99, NULL, false, NULL),
  ('a0000000-0000-0000-0000-000000000003', '1000 VP', 'VALORANT Points', 'CURRENCY', 1000, 9.99, NULL, false, NULL),
  ('a0000000-0000-0000-0000-000000000003', '2050 VP', 'VALORANT Points', 'CURRENCY', 2050, 19.99, NULL, false, NULL),
  ('a0000000-0000-0000-0000-000000000003', '3650 VP', 'VALORANT Points', 'CURRENCY', 3650, 34.99, NULL, false, NULL),
  ('a0000000-0000-0000-0000-000000000003', '5350 VP', 'VALORANT Points', 'CURRENCY', 5350, 49.99, 54.99, true, '10% OFF');

-- PUBG Mobile packages
INSERT INTO private.package (game_id, name, description, type, quantity, price_in_usd, original_price_in_usd, is_promotion, promotion_text)
VALUES
  ('a0000000-0000-0000-0000-000000000004', '60 UC', 'Unknown Cash', 'CURRENCY', 60, 0.99, NULL, false, NULL),
  ('a0000000-0000-0000-0000-000000000004', '325 UC', 'Unknown Cash', 'CURRENCY', 325, 4.99, NULL, false, NULL),
  ('a0000000-0000-0000-0000-000000000004', '660 UC', 'Unknown Cash', 'CURRENCY', 660, 9.99, NULL, false, NULL),
  ('a0000000-0000-0000-0000-000000000004', '1800 UC', 'Unknown Cash', 'CURRENCY', 1800, 24.99, NULL, false, NULL),
  ('a0000000-0000-0000-0000-000000000004', 'Royale Pass', 'Season Royale Pass', 'PASS', NULL, 9.99, NULL, false, NULL);

-- Honkai: Star Rail packages
INSERT INTO private.package (game_id, name, description, type, quantity, price_in_usd, original_price_in_usd, is_promotion, promotion_text)
VALUES
  ('a0000000-0000-0000-0000-000000000005', '60 Oneiric Shards', 'Honkai: Star Rail shards', 'CURRENCY', 60, 0.99, NULL, false, NULL),
  ('a0000000-0000-0000-0000-000000000005', '300 Oneiric Shards', 'Honkai: Star Rail shards', 'CURRENCY', 300, 4.99, NULL, false, NULL),
  ('a0000000-0000-0000-0000-000000000005', '980 Oneiric Shards', 'Honkai: Star Rail shards', 'CURRENCY', 980, 14.99, NULL, false, NULL),
  ('a0000000-0000-0000-0000-000000000005', '1980 Oneiric Shards', 'Honkai: Star Rail shards', 'CURRENCY', 1980, 29.99, 34.99, true, '15% OFF'),
  ('a0000000-0000-0000-0000-000000000005', 'Express Supply Pass', '30-day premium pass', 'PASS', NULL, 4.99, NULL, false, NULL);

-- Free Fire packages
INSERT INTO private.package (game_id, name, description, type, quantity, price_in_usd, original_price_in_usd, is_promotion, promotion_text)
VALUES
  ('a0000000-0000-0000-0000-000000000006', '100 Diamonds', 'Free Fire diamonds', 'CURRENCY', 100, 0.99, NULL, false, NULL),
  ('a0000000-0000-0000-0000-000000000006', '310 Diamonds', 'Free Fire diamonds', 'CURRENCY', 310, 2.99, NULL, false, NULL),
  ('a0000000-0000-0000-0000-000000000006', '520 Diamonds', 'Free Fire diamonds', 'CURRENCY', 520, 4.99, NULL, false, NULL),
  ('a0000000-0000-0000-0000-000000000006', '1060 Diamonds', 'Free Fire diamonds', 'CURRENCY', 1060, 9.99, NULL, false, NULL),
  ('a0000000-0000-0000-0000-000000000006', '2180 Diamonds', 'Free Fire diamonds', 'CURRENCY', 2180, 19.99, 22.99, true, '13% OFF');

-- Wild Rift packages
INSERT INTO private.package (game_id, name, description, type, quantity, price_in_usd, original_price_in_usd, is_promotion, promotion_text)
VALUES
  ('a0000000-0000-0000-0000-000000000007', '425 Wild Cores', 'Wild Rift cores', 'CURRENCY', 425, 4.99, NULL, false, NULL),
  ('a0000000-0000-0000-0000-000000000007', '1000 Wild Cores', 'Wild Rift cores', 'CURRENCY', 1000, 9.99, NULL, false, NULL),
  ('a0000000-0000-0000-0000-000000000007', '2000 Wild Cores', 'Wild Rift cores', 'CURRENCY', 2000, 19.99, NULL, false, NULL),
  ('a0000000-0000-0000-0000-000000000007', 'Wild Pass', 'Season Wild Pass', 'PASS', NULL, 5.99, NULL, false, NULL);

-- Roblox packages
INSERT INTO private.package (game_id, name, description, type, quantity, price_in_usd, original_price_in_usd, is_promotion, promotion_text)
VALUES
  ('a0000000-0000-0000-0000-000000000008', '400 Robux', 'Roblox Robux', 'CURRENCY', 400, 4.99, NULL, false, NULL),
  ('a0000000-0000-0000-0000-000000000008', '800 Robux', 'Roblox Robux', 'CURRENCY', 800, 9.99, NULL, false, NULL),
  ('a0000000-0000-0000-0000-000000000008', '1700 Robux', 'Roblox Robux', 'CURRENCY', 1700, 19.99, NULL, false, NULL),
  ('a0000000-0000-0000-0000-000000000008', '4500 Robux', 'Roblox Robux', 'CURRENCY', 4500, 49.99, 54.99, true, '10% OFF'),
  ('a0000000-0000-0000-0000-000000000008', 'Roblox Premium 450', 'Monthly 450 Robux + Premium benefits', 'BUNDLE', 450, 4.99, NULL, false, NULL);

-- COD Mobile packages
INSERT INTO private.package (game_id, name, description, type, quantity, price_in_usd, original_price_in_usd, is_promotion, promotion_text)
VALUES
  ('a0000000-0000-0000-0000-000000000009', '80 CP', 'COD Points', 'CURRENCY', 80, 0.99, NULL, false, NULL),
  ('a0000000-0000-0000-0000-000000000009', '400 CP', 'COD Points', 'CURRENCY', 400, 4.99, NULL, false, NULL),
  ('a0000000-0000-0000-0000-000000000009', '800 CP', 'COD Points', 'CURRENCY', 800, 9.99, NULL, false, NULL),
  ('a0000000-0000-0000-0000-000000000009', 'Battle Pass', 'Season Battle Pass', 'PASS', NULL, 9.99, NULL, false, NULL);

-- Fortnite packages
INSERT INTO private.package (game_id, name, description, type, quantity, price_in_usd, original_price_in_usd, is_promotion, promotion_text)
VALUES
  ('a0000000-0000-0000-0000-000000000010', '1000 V-Bucks', 'Fortnite V-Bucks', 'CURRENCY', 1000, 7.99, NULL, false, NULL),
  ('a0000000-0000-0000-0000-000000000010', '2800 V-Bucks', 'Fortnite V-Bucks', 'CURRENCY', 2800, 19.99, NULL, false, NULL),
  ('a0000000-0000-0000-0000-000000000010', '5000 V-Bucks', 'Fortnite V-Bucks', 'CURRENCY', 5000, 31.99, NULL, false, NULL),
  ('a0000000-0000-0000-0000-000000000010', '13500 V-Bucks', 'Fortnite V-Bucks', 'CURRENCY', 13500, 79.99, 89.99, true, '11% OFF'),
  ('a0000000-0000-0000-0000-000000000010', 'Fortnite Crew', 'Monthly Crew subscription + Battle Pass', 'BUNDLE', NULL, 11.99, NULL, false, NULL);

-- ===== GIFT CARDS =====

INSERT INTO private.game (id, name, icon_url, banner_url, description, category, platforms, requires_player_id, player_id_label, player_id_help, requires_server, servers, starting_price_in_usd, is_popular, is_new)
VALUES
  ('b0000000-0000-0000-0000-000000000001', 'Google Play', 'https://source.unsplash.com/0woyPEJQ7jc/128x128', 'https://source.unsplash.com/0woyPEJQ7jc/600x300', 'Redeem for apps, games, movies, music and more on Google Play Store', 'GIFT_CARD', ARRAY['Android'], false, NULL, NULL, false, NULL, 2.99, true, false),
  ('b0000000-0000-0000-0000-000000000002', 'App Store & iTunes', 'https://source.unsplash.com/cR0bLCSpGfw/128x128', 'https://source.unsplash.com/cR0bLCSpGfw/600x300', 'Redeem for apps, games, music, movies and more on the Apple App Store', 'GIFT_CARD', ARRAY['iOS', 'Mac'], false, NULL, NULL, false, NULL, 4.99, true, false),
  ('b0000000-0000-0000-0000-000000000003', 'Steam Wallet', 'https://source.unsplash.com/p0j-mE6mGo4/128x128', 'https://source.unsplash.com/p0j-mE6mGo4/600x300', 'Add funds to your Steam Wallet to buy games, DLC, and in-game items', 'GIFT_CARD', ARRAY['PC'], false, NULL, NULL, false, NULL, 4.99, true, false),
  ('b0000000-0000-0000-0000-000000000004', 'PlayStation Store', 'https://source.unsplash.com/MxVkWPiJALs/128x128', 'https://source.unsplash.com/MxVkWPiJALs/600x300', 'Buy games, DLC, and subscriptions on PlayStation Store for PS5 & PS4', 'GIFT_CARD', ARRAY['PS5', 'PS4'], false, NULL, NULL, false, NULL, 9.99, true, false),
  ('b0000000-0000-0000-0000-000000000005', 'Xbox Gift Card', 'https://source.unsplash.com/BhQZrxDq9oo/128x128', 'https://source.unsplash.com/BhQZrxDq9oo/600x300', 'Buy games, add-ons, movies and more on Xbox and Windows Store', 'GIFT_CARD', ARRAY['Xbox', 'PC'], false, NULL, NULL, false, NULL, 9.99, false, false),
  ('b0000000-0000-0000-0000-000000000006', 'Nintendo eShop', 'https://source.unsplash.com/k4Akpt5-Sfk/128x128', 'https://source.unsplash.com/k4Akpt5-Sfk/600x300', 'Download games and content for Nintendo Switch on the eShop', 'GIFT_CARD', ARRAY['Switch'], false, NULL, NULL, false, NULL, 9.99, false, false),
  ('b0000000-0000-0000-0000-000000000007', 'Garena Shell', 'https://source.unsplash.com/t6e0ntPJ1RE/128x128', 'https://source.unsplash.com/t6e0ntPJ1RE/600x300', 'Top up Garena Shell for Free Fire, League of Legends and other Garena titles', 'GIFT_CARD', ARRAY['iOS', 'Android', 'PC'], false, NULL, NULL, false, NULL, 1.99, true, false),
  ('b0000000-0000-0000-0000-000000000008', 'Razer Gold', 'https://source.unsplash.com/gETE8IyZPrM/128x128', 'https://source.unsplash.com/gETE8IyZPrM/600x300', 'Universal gaming credits redeemable across thousands of top games worldwide', 'GIFT_CARD', ARRAY['PC', 'iOS', 'Android'], false, NULL, NULL, false, NULL, 4.99, false, false);

-- Google Play packages
INSERT INTO private.package (game_id, name, description, type, quantity, price_in_usd, original_price_in_usd, is_promotion, promotion_text)
VALUES
  ('b0000000-0000-0000-0000-000000000001', '฿100 Google Play', 'Google Play Gift Card THB 100', 'BUNDLE', NULL, 2.99, NULL, false, NULL),
  ('b0000000-0000-0000-0000-000000000001', '฿200 Google Play', 'Google Play Gift Card THB 200', 'BUNDLE', NULL, 5.99, NULL, false, NULL),
  ('b0000000-0000-0000-0000-000000000001', '฿500 Google Play', 'Google Play Gift Card THB 500', 'BUNDLE', NULL, 14.99, NULL, false, NULL),
  ('b0000000-0000-0000-0000-000000000001', '฿1,000 Google Play', 'Google Play Gift Card THB 1000', 'BUNDLE', NULL, 28.99, 29.99, true, '3% OFF');

-- App Store & iTunes packages
INSERT INTO private.package (game_id, name, description, type, quantity, price_in_usd, original_price_in_usd, is_promotion, promotion_text)
VALUES
  ('b0000000-0000-0000-0000-000000000002', '$5 App Store', 'App Store & iTunes $5 Gift Card', 'BUNDLE', NULL, 4.99, NULL, false, NULL),
  ('b0000000-0000-0000-0000-000000000002', '$10 App Store', 'App Store & iTunes $10 Gift Card', 'BUNDLE', NULL, 9.99, NULL, false, NULL),
  ('b0000000-0000-0000-0000-000000000002', '$15 App Store', 'App Store & iTunes $15 Gift Card', 'BUNDLE', NULL, 14.99, NULL, false, NULL),
  ('b0000000-0000-0000-0000-000000000002', '$25 App Store', 'App Store & iTunes $25 Gift Card', 'BUNDLE', NULL, 24.99, NULL, false, NULL),
  ('b0000000-0000-0000-0000-000000000002', '$50 App Store', 'App Store & iTunes $50 Gift Card', 'BUNDLE', NULL, 48.99, 49.99, true, '2% OFF');

-- Steam Wallet packages
INSERT INTO private.package (game_id, name, description, type, quantity, price_in_usd, original_price_in_usd, is_promotion, promotion_text)
VALUES
  ('b0000000-0000-0000-0000-000000000003', '$5 Steam', 'Steam Wallet Code $5', 'BUNDLE', NULL, 4.99, NULL, false, NULL),
  ('b0000000-0000-0000-0000-000000000003', '$10 Steam', 'Steam Wallet Code $10', 'BUNDLE', NULL, 9.99, NULL, false, NULL),
  ('b0000000-0000-0000-0000-000000000003', '$20 Steam', 'Steam Wallet Code $20', 'BUNDLE', NULL, 19.99, NULL, false, NULL),
  ('b0000000-0000-0000-0000-000000000003', '$50 Steam', 'Steam Wallet Code $50', 'BUNDLE', NULL, 48.99, 49.99, true, '2% OFF'),
  ('b0000000-0000-0000-0000-000000000003', '$100 Steam', 'Steam Wallet Code $100', 'BUNDLE', NULL, 96.99, 99.99, true, '3% OFF');

-- PlayStation Store packages
INSERT INTO private.package (game_id, name, description, type, quantity, price_in_usd, original_price_in_usd, is_promotion, promotion_text)
VALUES
  ('b0000000-0000-0000-0000-000000000004', '$10 PSN', 'PlayStation Store $10', 'BUNDLE', NULL, 9.99, NULL, false, NULL),
  ('b0000000-0000-0000-0000-000000000004', '$20 PSN', 'PlayStation Store $20', 'BUNDLE', NULL, 19.99, NULL, false, NULL),
  ('b0000000-0000-0000-0000-000000000004', '$50 PSN', 'PlayStation Store $50', 'BUNDLE', NULL, 48.99, 49.99, true, '2% OFF'),
  ('b0000000-0000-0000-0000-000000000004', '$100 PSN', 'PlayStation Store $100', 'BUNDLE', NULL, 96.99, 99.99, true, '3% OFF');

-- Xbox Gift Card packages
INSERT INTO private.package (game_id, name, description, type, quantity, price_in_usd, original_price_in_usd, is_promotion, promotion_text)
VALUES
  ('b0000000-0000-0000-0000-000000000005', '$10 Xbox', 'Xbox Gift Card $10', 'BUNDLE', NULL, 9.99, NULL, false, NULL),
  ('b0000000-0000-0000-0000-000000000005', '$25 Xbox', 'Xbox Gift Card $25', 'BUNDLE', NULL, 24.99, NULL, false, NULL),
  ('b0000000-0000-0000-0000-000000000005', '$50 Xbox', 'Xbox Gift Card $50', 'BUNDLE', NULL, 48.99, 49.99, true, '2% OFF');

-- Nintendo eShop packages
INSERT INTO private.package (game_id, name, description, type, quantity, price_in_usd, original_price_in_usd, is_promotion, promotion_text)
VALUES
  ('b0000000-0000-0000-0000-000000000006', '$10 Nintendo', 'Nintendo eShop $10', 'BUNDLE', NULL, 9.99, NULL, false, NULL),
  ('b0000000-0000-0000-0000-000000000006', '$20 Nintendo', 'Nintendo eShop $20', 'BUNDLE', NULL, 19.99, NULL, false, NULL),
  ('b0000000-0000-0000-0000-000000000006', '$35 Nintendo', 'Nintendo eShop $35', 'BUNDLE', NULL, 34.99, NULL, false, NULL),
  ('b0000000-0000-0000-0000-000000000006', '$70 Nintendo', 'Nintendo eShop $70', 'BUNDLE', NULL, 67.99, 69.99, true, '3% OFF');

-- Garena Shell packages
INSERT INTO private.package (game_id, name, description, type, quantity, price_in_usd, original_price_in_usd, is_promotion, promotion_text)
VALUES
  ('b0000000-0000-0000-0000-000000000007', '100 Shells', 'Garena Shell 100', 'BUNDLE', 100, 1.99, NULL, false, NULL),
  ('b0000000-0000-0000-0000-000000000007', '500 Shells', 'Garena Shell 500', 'BUNDLE', 500, 7.99, NULL, false, NULL),
  ('b0000000-0000-0000-0000-000000000007', '1,000 Shells', 'Garena Shell 1000', 'BUNDLE', 1000, 13.99, 14.99, true, '7% OFF'),
  ('b0000000-0000-0000-0000-000000000007', '2,000 Shells', 'Garena Shell 2000', 'BUNDLE', 2000, 26.99, 28.99, true, '7% OFF');

-- Razer Gold packages
INSERT INTO private.package (game_id, name, description, type, quantity, price_in_usd, original_price_in_usd, is_promotion, promotion_text)
VALUES
  ('b0000000-0000-0000-0000-000000000008', '$5 Razer Gold', 'Razer Gold $5', 'BUNDLE', NULL, 4.99, NULL, false, NULL),
  ('b0000000-0000-0000-0000-000000000008', '$10 Razer Gold', 'Razer Gold $10', 'BUNDLE', NULL, 9.99, NULL, false, NULL),
  ('b0000000-0000-0000-0000-000000000008', '$25 Razer Gold', 'Razer Gold $25', 'BUNDLE', NULL, 24.49, 24.99, true, '2% OFF'),
  ('b0000000-0000-0000-0000-000000000008', '$50 Razer Gold', 'Razer Gold $50', 'BUNDLE', NULL, 47.99, 49.99, true, '4% OFF');

-- ===== PREMIUM APPS =====

INSERT INTO private.game (id, name, icon_url, banner_url, description, category, platforms, requires_player_id, player_id_label, player_id_help, requires_server, servers, starting_price_in_usd, is_popular, is_new)
VALUES
  ('c0000000-0000-0000-0000-000000000001', 'Spotify Premium', 'https://source.unsplash.com/3hq7NmO8hwU/128x128', 'https://source.unsplash.com/3hq7NmO8hwU/600x300', 'Ad-free music streaming, offline downloads, and unlimited skips on millions of songs', 'PREMIUM', ARRAY['iOS', 'Android', 'PC'], false, NULL, NULL, false, NULL, 4.99, true, false),
  ('c0000000-0000-0000-0000-000000000002', 'YouTube Premium', 'https://source.unsplash.com/wXU9yeANElg/128x128', 'https://source.unsplash.com/wXU9yeANElg/600x300', 'Ad-free YouTube, background play, offline downloads, and YouTube Music included', 'PREMIUM', ARRAY['iOS', 'Android', 'PC'], false, NULL, NULL, false, NULL, 3.99, true, false),
  ('c0000000-0000-0000-0000-000000000003', 'Netflix', 'https://source.unsplash.com/hCA5Ii5G0QY/128x128', 'https://source.unsplash.com/hCA5Ii5G0QY/600x300', 'Stream unlimited movies and TV shows anytime, anywhere on any device', 'PREMIUM', ARRAY['iOS', 'Android', 'PC', 'TV'], false, NULL, NULL, false, NULL, 5.99, true, false),
  ('c0000000-0000-0000-0000-000000000004', 'Disney+ Hotstar', 'https://source.unsplash.com/lUbPydZVmGs/128x128', 'https://source.unsplash.com/lUbPydZVmGs/600x300', 'Disney, Marvel, Pixar, Star Wars, National Geographic and live sports all in one place', 'PREMIUM', ARRAY['iOS', 'Android', 'PC', 'TV'], false, NULL, NULL, false, NULL, 3.99, false, true),
  ('c0000000-0000-0000-0000-000000000005', 'LINE MUSIC', 'https://source.unsplash.com/4efMee7CJCU/128x128', 'https://source.unsplash.com/4efMee7CJCU/600x300', 'Stream and share millions of songs and music videos with LINE MUSIC Premium', 'PREMIUM', ARRAY['iOS', 'Android'], false, NULL, NULL, false, NULL, 2.99, false, false);

-- Spotify Premium packages
INSERT INTO private.package (game_id, name, description, type, quantity, price_in_usd, original_price_in_usd, is_promotion, promotion_text)
VALUES
  ('c0000000-0000-0000-0000-000000000001', '1 Month', 'Spotify Premium 1 Month', 'BUNDLE', NULL, 4.99, NULL, false, NULL),
  ('c0000000-0000-0000-0000-000000000001', '3 Months', 'Spotify Premium 3 Months', 'BUNDLE', NULL, 13.99, 14.97, true, '7% OFF'),
  ('c0000000-0000-0000-0000-000000000001', '6 Months', 'Spotify Premium 6 Months', 'BUNDLE', NULL, 26.99, 29.94, true, '10% OFF'),
  ('c0000000-0000-0000-0000-000000000001', '12 Months', 'Spotify Premium 12 Months', 'BUNDLE', NULL, 49.99, 59.88, true, '17% OFF');

-- YouTube Premium packages
INSERT INTO private.package (game_id, name, description, type, quantity, price_in_usd, original_price_in_usd, is_promotion, promotion_text)
VALUES
  ('c0000000-0000-0000-0000-000000000002', '1 Month', 'YouTube Premium 1 Month', 'BUNDLE', NULL, 3.99, NULL, false, NULL),
  ('c0000000-0000-0000-0000-000000000002', '3 Months', 'YouTube Premium 3 Months', 'BUNDLE', NULL, 10.99, 11.97, true, '8% OFF'),
  ('c0000000-0000-0000-0000-000000000002', '12 Months', 'YouTube Premium 12 Months', 'BUNDLE', NULL, 37.99, 47.88, true, '21% OFF');

-- Netflix packages
INSERT INTO private.package (game_id, name, description, type, quantity, price_in_usd, original_price_in_usd, is_promotion, promotion_text)
VALUES
  ('c0000000-0000-0000-0000-000000000003', 'Standard 1 Month', 'Netflix Standard Plan 1 Month', 'BUNDLE', NULL, 5.99, NULL, false, NULL),
  ('c0000000-0000-0000-0000-000000000003', 'Standard 3 Months', 'Netflix Standard Plan 3 Months', 'BUNDLE', NULL, 16.99, 17.97, true, '6% OFF'),
  ('c0000000-0000-0000-0000-000000000003', 'Premium 1 Month', 'Netflix Premium Plan 1 Month (4K)', 'BUNDLE', NULL, 8.99, NULL, false, NULL),
  ('c0000000-0000-0000-0000-000000000003', 'Premium 3 Months', 'Netflix Premium Plan 3 Months (4K)', 'BUNDLE', NULL, 24.99, 26.97, true, '7% OFF');

-- Disney+ Hotstar packages
INSERT INTO private.package (game_id, name, description, type, quantity, price_in_usd, original_price_in_usd, is_promotion, promotion_text)
VALUES
  ('c0000000-0000-0000-0000-000000000004', '1 Month', 'Disney+ Hotstar 1 Month', 'BUNDLE', NULL, 3.99, NULL, false, NULL),
  ('c0000000-0000-0000-0000-000000000004', '3 Months', 'Disney+ Hotstar 3 Months', 'BUNDLE', NULL, 10.99, 11.97, true, '8% OFF'),
  ('c0000000-0000-0000-0000-000000000004', '12 Months', 'Disney+ Hotstar 12 Months', 'BUNDLE', NULL, 35.99, 47.88, true, '25% OFF');

-- LINE MUSIC packages
INSERT INTO private.package (game_id, name, description, type, quantity, price_in_usd, original_price_in_usd, is_promotion, promotion_text)
VALUES
  ('c0000000-0000-0000-0000-000000000005', '1 Month', 'LINE MUSIC Premium 1 Month', 'BUNDLE', NULL, 2.99, NULL, false, NULL),
  ('c0000000-0000-0000-0000-000000000005', '3 Months', 'LINE MUSIC Premium 3 Months', 'BUNDLE', NULL, 7.99, 8.97, true, '11% OFF'),
  ('c0000000-0000-0000-0000-000000000005', '12 Months', 'LINE MUSIC Premium 12 Months', 'BUNDLE', NULL, 27.99, 35.88, true, '22% OFF');
