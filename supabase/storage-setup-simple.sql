-- Configuration simplifiée Supabase Storage pour TSE Catalogue
-- Version: 1.1 (Corrigée)
-- Date: 6 janvier 2025

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
-- Lecture publique
CREATE POLICY "Images véhicules lecture publique" ON storage.objects
FOR SELECT USING (bucket_id = 'vehicle-images');

-- Upload pour les admins authentifiés
CREATE POLICY "Images véhicules upload admin" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'vehicle-images' 
  AND EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = auth.email() 
    AND actif = true
  )
);

-- Mise à jour pour les admins authentifiés
CREATE POLICY "Images véhicules update admin" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'vehicle-images'
  AND EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = auth.email() 
    AND actif = true
  )
);

-- Suppression pour les admins authentifiés
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
-- Lecture publique
CREATE POLICY "Documents véhicules lecture publique" ON storage.objects
FOR SELECT USING (bucket_id = 'vehicle-documents');

-- Upload pour les admins authentifiés
CREATE POLICY "Documents véhicules upload admin" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'vehicle-documents'
  AND EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = auth.email() 
    AND actif = true
  )
);

-- Mise à jour pour les admins authentifiés
CREATE POLICY "Documents véhicules update admin" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'vehicle-documents'
  AND EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = auth.email() 
    AND actif = true
  )
);

-- Suppression pour les admins authentifiés
CREATE POLICY "Documents véhicules delete admin" ON storage.objects
FOR DELETE USING (
  bucket_id = 'vehicle-documents'
  AND EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = auth.email() 
    AND actif = true
  )
);

-- Fonction simple pour obtenir l'URL publique d'un fichier
CREATE OR REPLACE FUNCTION get_public_url(bucket_name TEXT, file_path TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Retourner l'URL de base construite manuellement
  -- Remplacez YOUR_PROJECT_URL par votre URL Supabase réelle
  RETURN CONCAT(
    'https://YOUR_PROJECT_URL.supabase.co/storage/v1/object/public/',
    bucket_name,
    '/',
    file_path
  );
END;
$$;

-- Fonction pour valider les types de fichiers
CREATE OR REPLACE FUNCTION validate_file_type(
  bucket_name TEXT,
  file_name TEXT,
  mime_type TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  allowed_types TEXT[];
BEGIN
  -- Récupérer les types MIME autorisés pour le bucket
  SELECT allowed_mime_types INTO allowed_types
  FROM storage.buckets
  WHERE id = bucket_name;
  
  -- Vérifier si le type MIME est autorisé
  RETURN mime_type = ANY(allowed_types);
END;
$$;

-- Vue simplifiée pour les statistiques de stockage
CREATE OR REPLACE VIEW storage_stats AS
SELECT 
  bucket_id,
  COUNT(*) as total_files,
  COALESCE(SUM((metadata->>'size')::BIGINT), 0) as total_size_bytes,
  ROUND(COALESCE(SUM((metadata->>'size')::BIGINT), 0) / 1024.0 / 1024.0, 2) as total_size_mb,
  MIN(created_at) as oldest_file,
  MAX(created_at) as newest_file
FROM storage.objects
WHERE bucket_id IN ('vehicle-images', 'vehicle-documents')
GROUP BY bucket_id;

-- Fonction simplifiée pour nettoyer les fichiers orphelins
CREATE OR REPLACE FUNCTION cleanup_orphaned_files()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result_message TEXT;
BEGIN
  -- Pour l'instant, retourner juste un message
  -- Cette fonction peut être améliorée plus tard
  result_message := 'Fonction de nettoyage disponible - à implémenter selon les besoins';
  
  RETURN result_message;
END;
$$;

-- Commentaires pour la documentation
COMMENT ON FUNCTION get_public_url IS 'Génère l''URL publique d''un fichier dans Supabase Storage';
COMMENT ON FUNCTION validate_file_type IS 'Valide qu''un type de fichier est autorisé pour un bucket donné';
COMMENT ON FUNCTION cleanup_orphaned_files IS 'Fonction de nettoyage des fichiers orphelins (à implémenter)';
COMMENT ON VIEW storage_stats IS 'Statistiques d''utilisation du stockage par bucket';

-- Message de fin
SELECT 'Configuration Supabase Storage simplifiée terminée avec succès' as message;

-- Instructions pour la suite
SELECT 'IMPORTANT: Remplacez YOUR_PROJECT_URL dans get_public_url par votre URL Supabase réelle' as instruction;
