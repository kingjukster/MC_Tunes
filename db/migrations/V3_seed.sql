--------------------------------------------------------
-- V3__seed.sql
-- Seed lookup tables: moods, activities, genres
--------------------------------------------------------

-- Moods
INSERT INTO moods (code, display_name) VALUES ('happy', 'Happy');
INSERT INTO moods (code, display_name) VALUES ('calm', 'Calm');
INSERT INTO moods (code, display_name) VALUES ('sad', 'Sad');
INSERT INTO moods (code, display_name) VALUES ('energetic', 'Energetic');
INSERT INTO moods (code, display_name) VALUES ('focus', 'Focus');
INSERT INTO moods (code, display_name) VALUES ('party', 'Party');
INSERT INTO moods (code, display_name) VALUES ('custom', 'Custom');

-- Activities
INSERT INTO activities (name, description, is_default) VALUES ('Studying', 'Focus and learn', 1);
INSERT INTO activities (name, description, is_default) VALUES ('Workout', 'Exercise / gym time', 1);
INSERT INTO activities (name, description, is_default) VALUES ('Commute', 'Travel / commute', 1);
INSERT INTO activities (name, description, is_default) VALUES ('Relaxing', 'Chill / downtime', 1);
INSERT INTO activities (name, description, is_default) VALUES ('Party', 'Party / socializing', 1);

-- Genres (minimal seed; expand later)
INSERT INTO genres (name) VALUES ('Pop');
INSERT INTO genres (name) VALUES ('Hip-Hop');
INSERT INTO genres (name) VALUES ('Rock');
INSERT INTO genres (name) VALUES ('Jazz');
INSERT INTO genres (name) VALUES ('Classical');
INSERT INTO genres (name) VALUES ('Electronic');
INSERT INTO genres (name) VALUES ('Country');
