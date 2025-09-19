ALTER SESSION SET CURRENT_SCHEMA = mctunes;

------------------------------------------------------------
-- (Optional, but helps keep demo songs unique for MERGE ON)
-- Comment out if you don't want a uniqueness rule here.
------------------------------------------------------------
BEGIN
  EXECUTE IMMEDIATE 'CREATE UNIQUE INDEX ux_songs_title_artist ON songs(title, artist)';
EXCEPTION WHEN OTHERS THEN
  IF SQLCODE != -955 THEN RAISE; END IF; -- ignore "already exists"
END;
/

------------------------------------------------------------
-- Users (upsert by email)
------------------------------------------------------------
MERGE INTO users u
USING (SELECT 'demo1@mctunes.app' email, '$argon2id$v=19$m=65536,t=3,p=1$demo$hash' ph, 'Demo One' dn FROM dual) s
ON (u.email = s.email)
WHEN MATCHED THEN UPDATE SET u.display_name = s.dn, u.password_hash = s.ph
WHEN NOT MATCHED THEN INSERT (email, password_hash, display_name) VALUES (s.email, s.ph, s.dn);

MERGE INTO users u
USING (SELECT 'demo2@mctunes.app' email, '$argon2id$v=19$m=65536,t=3,p=1$demo$hash' ph, 'Demo Two' dn FROM dual) s
ON (u.email = s.email)
WHEN MATCHED THEN UPDATE SET u.display_name = s.dn, u.password_hash = s.ph
WHEN NOT MATCHED THEN INSERT (email, password_hash, display_name) VALUES (s.email, s.ph, s.dn);

------------------------------------------------------------
-- Songs (upsert by (title, artist))
------------------------------------------------------------
MERGE INTO songs t
USING (
  SELECT 'Starlight Drive' title, 'Nova Tide' artist, NULL album, NULL release_year,
         NULL genre_id, 128 tempo_bpm, 0.72 energy, 0.65 valence, 0.78 danceability, NULL default_mood_id FROM dual UNION ALL
  SELECT 'Golden Hour'    , 'Aria Vale', NULL, NULL, NULL, 100, 0.55, 0.88, 0.64, NULL FROM dual UNION ALL
  SELECT 'Circuit Dreams' , 'Flux Unit', NULL, NULL, NULL, 140, 0.85, 0.52, 0.81, NULL FROM dual
) s
ON (t.title = s.title AND t.artist = s.artist)
WHEN MATCHED THEN UPDATE SET
  t.album = s.album, t.release_year = s.release_year, t.genre_id = s.genre_id,
  t.tempo_bpm = s.tempo_bpm, t.energy = s.energy, t.valence = s.valence,
  t.danceability = s.danceability, t.default_mood_id = s.default_mood_id
WHEN NOT MATCHED THEN INSERT (title, artist, album, release_year, genre_id, tempo_bpm, energy, valence, danceability, default_mood_id)
VALUES (s.title, s.artist, s.album, s.release_year, s.genre_id, s.tempo_bpm, s.energy, s.valence, s.danceability, s.default_mood_id);

------------------------------------------------------------
-- Ratings (upsert per (user_id, song_id))
-- Join users by email + songs by (title,artist), so no variables needed.
------------------------------------------------------------
MERGE INTO ratings r
USING (
  SELECT u.id AS user_id, s.id AS song_id, 5 AS rating_value
  FROM users u
  JOIN songs s ON s.title='Starlight Drive' AND s.artist='Nova Tide'
  WHERE u.email='demo1@mctunes.app'
) src
ON (r.user_id = src.user_id AND r.song_id = src.song_id)
WHEN MATCHED THEN UPDATE SET r.rating_value = src.rating_value, r.rated_at = SYSTIMESTAMP
WHEN NOT MATCHED THEN INSERT (user_id, song_id, rating_value) VALUES (src.user_id, src.song_id, src.rating_value);

MERGE INTO ratings r
USING (
  SELECT u.id AS user_id, s.id AS song_id, 4 AS rating_value
  FROM users u
  JOIN songs s ON s.title='Starlight Drive' AND s.artist='Nova Tide'
  WHERE u.email='demo2@mctunes.app'
) src
ON (r.user_id = src.user_id AND r.song_id = src.song_id)
WHEN MATCHED THEN UPDATE SET r.rating_value = src.rating_value, r.rated_at = SYSTIMESTAMP
WHEN NOT MATCHED THEN INSERT (user_id, song_id, rating_value) VALUES (src.user_id, src.song_id, src.rating_value);

MERGE INTO ratings r
USING (
  SELECT u.id AS user_id, s.id AS song_id, 4 AS rating_value
  FROM users u
  JOIN songs s ON s.title='Golden Hour' AND s.artist='Aria Vale'
  WHERE u.email='demo1@mctunes.app'
) src
ON (r.user_id = src.user_id AND r.song_id = src.song_id)
WHEN MATCHED THEN UPDATE SET r.rating_value = src.rating_value, r.rated_at = SYSTIMESTAMP
WHEN NOT MATCHED THEN INSERT (user_id, song_id, rating_value) VALUES (src.user_id, src.song_id, src.rating_value);

MERGE INTO ratings r
USING (
  SELECT u.id AS user_id, s.id AS song_id, 5 AS rating_value
  FROM users u
  JOIN songs s ON s.title='Circuit Dreams' AND s.artist='Flux Unit'
  WHERE u.email='demo2@mctunes.app'
) src
ON (r.user_id = src.user_id AND r.song_id = src.song_id)
WHEN MATCHED THEN UPDATE SET r.rating_value = src.rating_value, r.rated_at = SYSTIMESTAMP
WHEN NOT MATCHED THEN INSERT (user_id, song_id, rating_value) VALUES (src.user_id, src.song_id, src.rating_value);

------------------------------------------------------------
-- Listening history (insert-if-missing)
------------------------------------------------------------
INSERT INTO listening_history (user_id, song_id, played_at, source, mood_id, activity_id)
SELECT
  u.id,
  s.id,
  SYSTIMESTAMP - INTERVAL '2' HOUR,
  'stream',
  (SELECT id FROM moods WHERE code='energetic'),
  (SELECT id FROM activities WHERE name='Workout')
FROM users u
JOIN songs s ON s.title='Starlight Drive' AND s.artist='Nova Tide'
WHERE u.email='demo1@mctunes.app'
  AND NOT EXISTS (
    SELECT 1 FROM listening_history lh WHERE lh.user_id = u.id AND lh.song_id = s.id
  );

INSERT INTO listening_history (user_id, song_id, played_at, source, mood_id, activity_id)
SELECT
  u.id,
  s.id,
  SYSTIMESTAMP - INTERVAL '1' HOUR,
  'stream',
  (SELECT id FROM moods WHERE code='focus'),
  (SELECT id FROM activities WHERE name='Studying')
FROM users u
JOIN songs s ON s.title='Golden Hour' AND s.artist='Aria Vale'
WHERE u.email='demo1@mctunes.app'
  AND NOT EXISTS (
    SELECT 1 FROM listening_history lh WHERE lh.user_id = u.id AND lh.song_id = s.id
  );

INSERT INTO listening_history (user_id, song_id, played_at, source, mood_id, activity_id)
SELECT
  u.id,
  s.id,
  SYSTIMESTAMP - INTERVAL '30' MINUTE,
  'stream',
  (SELECT id FROM moods WHERE code='party'),
  (SELECT id FROM activities WHERE name='Party')
FROM users u
JOIN songs s ON s.title='Circuit Dreams' AND s.artist='Flux Unit'
WHERE u.email='demo2@mctunes.app'
  AND NOT EXISTS (
    SELECT 1 FROM listening_history lh WHERE lh.user_id = u.id AND lh.song_id = s.id
  );

COMMIT;
