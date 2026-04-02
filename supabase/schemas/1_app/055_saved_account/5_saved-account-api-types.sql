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
