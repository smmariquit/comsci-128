-- Execute this in your Supabase SQL Editor to add the optional latitude and longitude columns
-- These columns will allow you to store exact geospatial coordinates for each room.

ALTER TABLE room
ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
