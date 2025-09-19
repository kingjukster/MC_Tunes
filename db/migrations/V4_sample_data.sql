------------------------------------------------------------
-- V4__sample_data.sql  (Oracle 23c Free, run as mctunes)
-- Assumes V1..V3 are applied.
------------------------------------------------------------

-- === Users (password_hash values are placeholders; your app should hash real passwords) ===
INSERT INTO users (email, password_hash, display_name) VALUES
  ('demo1@mctunes.app', '$argon2id$v=19$m=65536,t=3,p=1$demo$hash', 'Demo One');
INSERT INTO users (email, password_hash, display_name) VALUES
  ('demo2@mctunes.app', '$argon2id$v=19$m=65536,t=3,p=1$demo$hash', 'Demo Two');

-- Capture user ids for convenience (works in SQL*Plus/SQLcl via variables)
VAR u1 NUMBER
VAR u2 NUMBER
BEGIN
  SELECT id INTO :u1 FROM users WHERE email = 'demo1@mctunes.app';
  SELECT id INTO :u2 FROM users WHERE email = 'demo2@mctunes.app';
END;
/

-- === Genres are in V3; fetch ids on the fly ===
-- Helper inline selects used below:
--   (SELECT id FROM genres WHERE name='Hip-Hop')
--   (SELECT id FROM genres WHERE name='Pop')
--   (SELECT id FROM genres WHERE name='Rock')
--   (SELECT id FROM genres WHERE name='Electronic')
--   (SELECT id FROM moods  WHERE code='energetic') etc.

-- === Songs ===
INSERT INTO songs (title, artist, album, release_year, genre_id, tempo_bpm, energy, valence, danceability, default_mood_id)
VALUES ('No Ceiling', 'MC T', 'Singles', 2025,
        (SELECT id FROM genres WHERE name='Hip-Hop'),
        112.0, 0.82, 0.55, 0.78, (SELECT id FROM moods WHERE code='energetic'));

INSERT INTO songs (title, artist, album, release_year, genre_id, tempo_bpm, energy, valence, danceability, default_mood_id)
VALUES ('Realize', 'MC T', 'D.O.D.', 2025,
        (SELECT id FROM genres WHERE name='Hip-Hop'),
        118.0, 0.76, 0.60, 0.74, (SELECT id FROM moods WHERE code='focus'));

INSERT INTO songs (title, artist, album, release_year, genre_id, tempo_bpm, energy, valence, danceability, default_mood_id)
VALUES ('Lonely Road', 'MC T', 'D.O.D.', 2025,
        (SELECT id FROM genres WHERE name='Hip-Hop'),
        92.0, 0.58, 0.30, 0.63, (SELECT id FROM moods WHERE code='sad'));

INSERT INTO songs (title, artist, album, release_year, genre_id, tempo_bpm, energy, valence, danceability, default_mood_id)
VALUES ('Club Lights', 'Assorted', 'Party Pack', 2024,
        (SELECT id FROM genres WHERE name='Electronic'),
        126.0, 0.88, 0.72, 0.84, (SELECT id FROM moods WHERE code='party'));

INSERT INTO songs (title, artist, album, release_year, genre_id, tempo_bpm, energy, valence, danceability, default_mood_id)
VALUES ('Deep Focus', 'LoKey', 'Study Sessions', 2023,
        (SELECT id FROM genres WHERE name='Electronic'),
        80.0, 0.40, 0.55, 0.62, (SELECT id FROM moods WHERE code='focus'));

INSERT INTO songs (title, artist, album, release_year, genre_id, tempo_bpm, energy, valence, danceability, default_mood_id)
VALUES ('Sunday Calm', 'Riverline', 'Quiet Hours', 2022,
        (SELECT id FROM genres WHERE name='Pop'),
        98.0, 0.42, 0.65, 0.66, (SELECT id FROM moods WHERE code='calm'));

INSERT INTO songs (title, artist, album, release_year, genre_id, tempo_bpm, energy, valence, danceability, default_mood_id)
VALUES ('Edge of Night', 'The Breakers', 'Neon City', 2021,
        (SELECT id FROM genres WHERE name='Rock'),
        130.0, 0.83, 0.48, 0.60, (SELECT id FROM moods WHERE code='energetic'));

INSERT INTO songs (title, artist, album, release_year, genre_id, tempo_bpm, energy, valence, danceability, default_mood_id)
VALUES ('Golden Hour', 'Aria Vale', 'Skylines', 2020,
        (SELECT id FROM genres WHERE name='Pop'),
        100.0, 0.55, 0.78, 0.70, (SELECT id FROM moods WHERE code='happy'));

INSERT INTO songs (title, artist, album, release_year, genre_id, tempo_bpm, energy, valence, danceability, default_mood_id)
VALUES ('Circuit Dreams', 'Flux Unit', 'Wired', 2024,
        (SELECT id FROM genres WHERE name='Electronic'),
        122.0, 0.75, 0.66, 0.82, (SELECT id FROM moods WHERE code='party'));

INSERT INTO songs (title, artist, album, release_year, genre_id, tempo_bpm, energy, valence, danceability, default_mood_id)
VALUES ('Paper Planes', 'Indigo Gray', 'Overcast', 2019,
        (SELECT id FROM genres WHERE name='Rock'),
        105.0, 0.62, 0.47, 0.58, (SELECT id FROM moods WHERE code='custom'));

INSERT INTO songs (title, artist, album, release_year, genre_id, tempo_bpm, energy, valence, danceability, default_mood_id)
VALUES ('Midnight Walk', 'LoKey', 'Study Sessions', 2023,
        (SELECT id FROM genres WHERE name='Electronic'),
        78.0, 0.38, 0.52, 0.60, (SELECT id FROM moods WHERE code='focus'));

INSERT INTO songs (title, artist, album, release_year, genre_id, tempo_bpm, energy, valence, danceability, default_mood_id)
VALUES ('Daybreak', 'Aria Vale', 'Skylines', 2020,
        (SELECT id FROM genres WHERE name='Pop'),
        96.0, 0.50, 0.82, 0.72, (SELECT id FROM moods WHERE code='happy'));

-- Capture a few song ids to reference in ratings/history
VAR s1 NUMBER
VAR s2 NUMBER
VAR s3 NUMBER
BEGIN
  SELECT id INTO :s1 FROM songs WHERE title='No Ceiling' AND artist='MC T';
  SELECT id INTO :s2 FROM songs WHERE title='Realize' AND artist='MC T';
  SELECT id INTO :s3 FROM songs WHERE title='Club Lights' AND artist='Assorted';
END;
/

-- === Ratings (triggers will maintain song_aggregates) ===
INSERT INTO ratings (user_id, song_id, rating_value) VALUES (:u1, :s1, 5);
INSERT INTO ratings (user_id, song_id, rating_value) VALUES (:u2, :s1, 4);

INSERT INTO ratings (user_id, song_id, rating_value) VALUES (:u1, :s2, 4);
INSERT INTO ratings (user_id, song_id, rating_value) VALUES (:u2, :s2, 5);

INSERT INTO ratings (user_id, song_id, rating_value)
  SELECT :u1, id, 4 FROM songs WHERE title='Golden Hour' AND artist='Aria Vale';
INSERT INTO ratings (user_id, song_id, rating_value)
  SELECT :u2, id, 5 FROM songs WHERE title='Circuit Dreams' AND artist='Flux Unit';

-- A couple updates to exercise UPDATE path on trigger
UPDATE ratings SET rating_value = 5 WHERE user_id = :u2 AND song_id = :s1;

-- === Listening history ===
INSERT INTO listening_history (user_id, song_id, played_at, source, mood_id, activity_id)
VALUES (:u1, :s1, SYSTIMESTAMP - INTERVAL '2' HOUR, 'stream',
        (SELECT id FROM moods WHERE code='energetic'),
        (SELECT id FROM activities WHERE name='Workout'));

INSERT INTO listening_history (user_id, song_id, played_at, source, mood_id, activity_id)
VALUES (:u1, :s2, SYSTIMESTAMP - INTERVAL '1' HOUR, 'stream',
        (SELECT id FROM moods WHERE code='focus'),
        (SELECT id FROM activities WHERE name='Studying'));

INSERT INTO listening_history (user_id, song_id, played_at, source, mood_id, activity_id)
VALUES (:u2, :s3, SYSTIMESTAMP - INTERVAL '30' MINUTE, 'stream',
        (SELECT id FROM moods WHERE code='party'),
        (SELECT id FROM activities WHERE name='Party'));

-- === User context (current mood/activity) ===
MERGE INTO user_context uc
USING (SELECT :u1 AS user_id FROM dual) x
ON (uc.user_id = x.user_id)
WHEN MATCHED THEN UPDATE SET mood_id=(SELECT id FROM moods WHERE code='focus'),
                              activity_id=(SELECT id FROM activities WHERE name='Studying'),
                              updated_at=SYSTIMESTAMP
WHEN NOT MATCHED THEN INSERT (user_id, mood_id, activity_id)
VALUES (:u1, (SELECT id FROM moods WHERE code='focus'),
            (SELECT id FROM activities WHERE name='Studying'));

MERGE INTO user_context uc
USING (SELECT :u2 AS user_id FROM dual) x
ON (uc.user_id = x.user_id)
WHEN MATCHED THEN UPDATE SET mood_id=(SELECT id FROM moods WHERE code='party'),
                              activity_id=(SELECT id FROM activities WHERE name='Party'),
                              updated_at=SYSTIMESTAMP
WHEN NOT MATCHED THEN INSERT (user_id, mood_id, activity_id)
VALUES (:u2, (SELECT id FROM moods WHERE code='party'),
            (SELECT id FROM activities WHERE name='Party'));

COMMIT;






