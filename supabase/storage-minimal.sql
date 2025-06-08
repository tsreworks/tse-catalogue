-- Configuration minimale Supabase Storage pour TSE Catalogue
-- Version: 1.0 (Ultra-simplifiée)
-- Date: 6 janvier 2025

-- Supprimer les politiques existantes (si elles existent)
DROP POLICY IF EXISTS "Images véhicules lecture publique" ON storage.objects;
DROP POLICY IF EXISTS "Images véhicules upload admin" ON storage.objects;
DROP POLICY IF EXISTS "Images véhicules update admin" ON storage.objects;
DROP POLICY IF EXISTS "Images véhicules delete admin" ON storage.objects;
DROP POLICY IF EXISTS "Documents véhicules lecture publique" ON storage.objects;
DROP POLICY IF EXISTS "Documents véhicules upload admin" ON storage.objects;
DROP POLICY IF EXISTS "Documents véhicules update admin" ON storage.objects;
DROP POLICY IF EXISTS "Documents véhicules delete admin" ON storage.objects;

-- Créer les buckets de stockage
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  (
    'vehicle-images',
    'vehicle-images',
    true,
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  ),
  (
    'vehicle-documents',
    'vehicle-documents', 
    true,
    52428800, -- 50MB
    ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  )
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Politiques de sécurité pour vehicle-images
CREATE POLICY "Images véhicules lecture publique" ON storage.objects
FOR SELECT USING (bucket_id = 'vehicle-images');

CREATE POLICY "Images véhicules upload admin" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'vehicle-images' 
  AND EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = auth.email() 
    AND actif = true
  )
);

CREATE POLICY "Images véhicules update admin" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'vehicle-images'
  AND EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = auth.email() 
    AND actif = true
  )
);

CREATE POLICY "Images véhicules delete admin" ON storage.objects
FOR DELETE USING (
  bucket_id = 'vehicle-images'
  AND EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = auth.email() 
    AND actif = true
  )
);

-- Politiques de sécurité pour vehicle-documents
CREATE POLICY "Documents véhicules lecture publique" ON storage.objects
FOR SELECT USING (bucket_id = 'vehicle-documents');

CREATE POLICY "Documents véhicules upload admin" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'vehicle-documents'
  AND EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = auth.email() 
    AND actif = true
  )
);

CREATE POLICY "Documents véhicules update admin" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'vehicle-documents'
  AND EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = auth.email() 
    AND actif = true
  )
);

CREATE POLICY "Documents véhicules delete admin" ON storage.objects
FOR DELETE USING (
  bucket_id = 'vehicle-documents'
  AND EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = auth.email() 
    AND actif = true
  )
);

-- Message de fin
SELECT 'Configuration Supabase Storage minimale terminée avec succès' as message;
SELECT 'Buckets créés: vehicle-images, vehicle-documents' as buckets;
SELECT 'Politiques configurées pour lecture publique et modification admin' as policies;
