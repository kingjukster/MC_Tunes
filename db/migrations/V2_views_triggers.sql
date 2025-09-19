--------------------------------------------------------
-- V2__views_triggers.sql
-- Derived helpers: triggers + views for MC Tunes
--------------------------------------------------------

-- Trigger to update song_aggregates when a rating is inserted/updated/deleted

CREATE OR REPLACE TRIGGER trg_ratings_aiud
AFTER INSERT OR UPDATE OR DELETE ON ratings
FOR EACH ROW
DECLARE
BEGIN
  IF INSERTING OR UPDATING THEN
    MERGE INTO song_aggregates sa
    USING (SELECT :NEW.song_id AS song_id FROM dual) src
    ON (sa.song_id = src.song_id)
    WHEN MATCHED THEN
      UPDATE SET
        rating_count = (SELECT COUNT(*) FROM ratings r WHERE r.song_id = :NEW.song_id),
        rating_avg   = (SELECT ROUND(AVG(r.rating_value),3) FROM ratings r WHERE r.song_id = :NEW.song_id),
        last_rated_at = (SELECT MAX(r.rated_at) FROM ratings r WHERE r.song_id = :NEW.song_id)
    WHEN NOT MATCHED THEN
      INSERT (song_id, rating_count, rating_avg, last_rated_at)
      VALUES (:NEW.song_id, 1, :NEW.rating_value, :NEW.rated_at);
  ELSIF DELETING THEN
    MERGE INTO song_aggregates sa
    USING (SELECT :OLD.song_id AS song_id FROM dual) src
    ON (sa.song_id = src.song_id)
    WHEN MATCHED THEN
      UPDATE SET
        rating_count = (SELECT COUNT(*) FROM ratings r WHERE r.song_id = :OLD.song_id),
        rating_avg   = (SELECT NVL(ROUND(AVG(r.rating_value),3),0) FROM ratings r WHERE r.song_id = :OLD.song_id),
        last_rated_at = (SELECT MAX(r.rated_at) FROM ratings r WHERE r.song_id = :OLD.song_id);
  END IF;
END;
/

--------------------------------------------------------
-- Views for easier querying
--------------------------------------------------------

-- View: song with genre name & aggregates
CREATE OR REPLACE VIEW v_songs_enriched AS
SELECT
  s.id,
  s.title,
  s.artist,
  s.album,
  s.release_year,
  g.name AS genre,
  s.tempo_bpm,
  s.energy,
  s.valence,
  s.danceability,
  s.default_mood_id,
  sa.rating_count,
  sa.rating_avg,
  sa.last_rated_at
FROM songs s
LEFT JOIN genres g ON s.genre_id = g.id
LEFT JOIN song_aggregates sa ON s.id = sa.song_id;

-- View: user ratings with song info
CREATE OR REPLACE VIEW v_user_ratings AS
SELECT
  r.id AS rating_id,
  r.user_id,
  r.song_id,
  s.title,
  s.artist,
  r.rating_value,
  r.rated_at
FROM ratings r
JOIN songs s ON r.song_id = s.id;

-- View: listening history enriched
CREATE OR REPLACE VIEW v_listening_history AS
SELECT
  lh.id,
  lh.user_id,
  u.display_name,
  lh.song_id,
  s.title,
  s.artist,
  lh.played_at,
  lh.source,
  lh.mood_id,
  lh.activity_id
FROM listening_history lh
JOIN users u ON lh.user_id = u.id
JOIN songs s ON lh.song_id = s.id;
