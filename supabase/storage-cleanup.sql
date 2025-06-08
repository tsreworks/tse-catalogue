-- Script de nettoyage Supabase Storage pour TSE Catalogue
-- À exécuter AVANT storage-setup.sql si vous avez des erreurs de politiques existantes
-- Version: 1.0
-- Date: 6 janvier 2025

-- Supprimer toutes les politiques storage existantes
DROP POLICY IF EXISTS "Images véhicules lecture publique" ON storage.objects;
DROP POLICY IF EXISTS "Images véhicules upload admin" ON storage.objects;
DROP POLICY IF EXISTS "Images véhicules update admin" ON storage.objects;
DROP POLICY IF EXISTS "Images véhicules delete admin" ON storage.objects;
DROP POLICY IF EXISTS "Documents véhicules lecture publique" ON storage.objects;
DROP POLICY IF EXISTS "Documents véhicules upload admin" ON storage.objects;
DROP POLICY IF EXISTS "Documents véhicules update admin" ON storage.objects;
DROP POLICY IF EXISTS "Documents véhicules delete admin" ON storage.objects;

-- Supprimer les fonctions existantes
DROP FUNCTION IF EXISTS get_public_url(TEXT, TEXT);
DROP FUNCTION IF EXISTS cleanup_orphaned_files();
DROP FUNCTION IF EXISTS validate_file_type(TEXT, TEXT, TEXT);

-- Supprimer les vues existantes
DROP VIEW IF EXISTS storage_stats;

-- Supprimer les buckets (ATTENTION: cela supprime tous les fichiers!)
-- Décommentez seulement si vous voulez vraiment tout supprimer
-- DELETE FROM storage.objects WHERE bucket_id IN ('vehicle-images', 'vehicle-documents');
-- DELETE FROM storage.buckets WHERE id IN ('vehicle-images', 'vehicle-documents');

-- Message de confirmation
SELECT 'Nettoyage des politiques et fonctions storage terminé' as message;
SELECT 'Vous pouvez maintenant exécuter storage-setup.sql' as instruction;
