ALTER SESSION SET CURRENT_SCHEMA = mctunes;

------------------------------------------------------------
-- Moods (upsert by code)
------------------------------------------------------------
MERGE INTO moods m
USING (
  SELECT 'happy' code, 'Happy' display_name FROM dual UNION ALL
  SELECT 'calm' , 'Calm'  FROM dual UNION ALL
  SELECT 'sad'  , 'Sad'   FROM dual UNION ALL
  SELECT 'energetic','Energetic' FROM dual UNION ALL
  SELECT 'focus','Focus' FROM dual UNION ALL
  SELECT 'party','Party' FROM dual UNION ALL
  SELECT 'custom','Custom' FROM dual
) src
ON (m.code = src.code)
WHEN MATCHED THEN UPDATE SET m.display_name = src.display_name
WHEN NOT MATCHED THEN INSERT (code, display_name) VALUES (src.code, src.display_name);

------------------------------------------------------------
-- Activities (upsert by name)
------------------------------------------------------------
MERGE INTO activities a
USING (
  SELECT 'Studying' name, 'Focus and learn' descr, 1 deflt FROM dual UNION ALL
  SELECT 'Workout'  , 'Exercise / gym time', 1 FROM dual UNION ALL
  SELECT 'Commute'  , 'Travel / commute'   , 1 FROM dual UNION ALL
  SELECT 'Relaxing' , 'Chill / downtime'   , 1 FROM dual UNION ALL
  SELECT 'Party'    , 'Party / socializing', 1 FROM dual
) src
ON (a.name = src.name)
WHEN MATCHED THEN UPDATE SET a.description = src.descr, a.is_default = src.deflt
WHEN NOT MATCHED THEN INSERT (name, description, is_default)
VALUES (src.name, src.descr, src.deflt);

------------------------------------------------------------
-- Genres (upsert by name)
------------------------------------------------------------
INSERT INTO genres (name)
SELECT s.name
FROM (
  SELECT 'Pop' name FROM dual UNION ALL
  SELECT 'Hip-Hop'   FROM dual UNION ALL
  SELECT 'Rock'      FROM dual UNION ALL
  SELECT 'Jazz'      FROM dual UNION ALL
  SELECT 'Classical' FROM dual UNION ALL
  SELECT 'Electronic'FROM dual UNION ALL
  SELECT 'Country'   FROM dual
) s
WHERE NOT EXISTS (SELECT 1 FROM genres g WHERE g.name = s.name);


COMMIT;
