-- Migration 3: Storage buckets for product images, generations, and character packs

INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('product-images', 'product-images', true),
  ('generations', 'generations', true),
  ('character-packs', 'character-packs', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Auth users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Anyone can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Auth users can upload generations"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'generations' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Anyone can view generations"
ON storage.objects FOR SELECT
USING (bucket_id = 'generations');

CREATE POLICY "Auth users can upload character packs"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'character-packs' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Anyone can view character packs"
ON storage.objects FOR SELECT
USING (bucket_id = 'character-packs');
