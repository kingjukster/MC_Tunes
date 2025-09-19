--------------------------------------------------------
-- V2__views_triggers.sql
-- Derived helpers: triggers + views for MC Tunes
--------------------------------------------------------

-- Trigger to update song_aggregates when a rating is inserted/updated/deleted

-- Clean up old row-level triggers (if they exist)
BEGIN
  EXECUTE IMMEDIATE 'DROP TRIGGER trg_ratings_aiud';
EXCEPTION WHEN OTHERS THEN IF SQLCODE != -4080 THEN RAISE; END IF;
END;
/

BEGIN
  EXECUTE IMMEDIATE 'DROP TRIGGER trg_ratings_agg_ins_upd';
EXCEPTION WHEN OTHERS THEN IF SQLCODE != -4080 THEN RAISE; END IF;
END;
/

BEGIN
  EXECUTE IMMEDIATE 'DROP TRIGGER trg_ratings_agg_del';
EXCEPTION WHEN OTHERS THEN IF SQLCODE != -4080 THEN RAISE; END IF;
END;
/

-- Compound trigger: collect affected song_ids during DML,
-- then update song_aggregates once per statement (no mutating-table read)
CREATE OR REPLACE TRIGGER trg_ratings_agg
FOR INSERT OR UPDATE OF rating_value OR DELETE ON ratings
COMPOUND TRIGGER
  TYPE t_song_ids IS TABLE OF NUMBER INDEX BY PLS_INTEGER;
  g_ids t_song_ids;

  PROCEDURE add_id(p_id NUMBER) IS
    found BOOLEAN := FALSE;
  BEGIN
    IF p_id IS NULL THEN RETURN; END IF;
    -- de-dupe: simple linear scan (small per-stmt sets)
    FOR i IN 1 .. NVL(g_ids.COUNT, 0) LOOP
      IF g_ids(i) = p_id THEN found := TRUE; EXIT; END IF;
    END LOOP;
    IF NOT found THEN
      g_ids(NVL(g_ids.COUNT,0)+1) := p_id;
    END IF;
  END;

  AFTER EACH ROW IS
  BEGIN
    IF INSERTING OR UPDATING THEN add_id(:NEW.song_id); END IF;
    IF DELETING THEN add_id(:OLD.song_id); END IF;
  END AFTER EACH ROW;

    AFTER STATEMENT IS
  BEGIN
    FOR i IN 1 .. NVL(g_ids.COUNT, 0) LOOP
      DECLARE
        v_song_id   NUMBER := g_ids(i);
        v_cnt       NUMBER;
        v_avg       NUMBER;
        v_last      TIMESTAMP;
      BEGIN
        SELECT COUNT(*), ROUND(AVG(rating_value),3), MAX(rated_at)
          INTO v_cnt, v_avg, v_last
          FROM ratings
         WHERE song_id = v_song_id;

        IF v_cnt = 0 THEN
          DELETE FROM song_aggregates WHERE song_id = v_song_id;
        ELSE
          MERGE INTO song_aggregates sa
          USING (SELECT v_song_id AS song_id FROM dual) src
          ON (sa.song_id = src.song_id)
          WHEN MATCHED THEN
            UPDATE SET rating_count = v_cnt, rating_avg = v_avg, last_rated_at = v_last
          WHEN NOT MATCHED THEN
            INSERT (song_id, rating_count, rating_avg, last_rated_at)
            VALUES (v_song_id, v_cnt, v_avg, v_last);
        END IF;
      END;
    END LOOP;
  END AFTER STATEMENT;
END trg_ratings_agg;
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



