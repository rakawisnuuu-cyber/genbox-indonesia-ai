-- Migration 1: Update characters table for 6-shot pack

ALTER TABLE characters ADD COLUMN IF NOT EXISTS 
  identity_prompt TEXT;

ALTER TABLE characters ADD COLUMN IF NOT EXISTS 
  hero_image_url TEXT;

ALTER TABLE characters ADD COLUMN IF NOT EXISTS 
  reference_images TEXT[] DEFAULT '{}';

ALTER TABLE characters ADD COLUMN IF NOT EXISTS 
  shot_metadata JSONB DEFAULT '{}';
