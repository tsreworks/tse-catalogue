-- Migration minimale vers les prix en Francs CFA
-- Version: 1.0 (Minimal)
-- Date: 6 janvier 2025

-- Étape 1: Modifier le type de colonne prix uniquement
ALTER TABLE vehicles ALTER COLUMN prix TYPE BIGINT;

-- Ajouter un commentaire pour clarifier l'unité
COMMENT ON COLUMN vehicles.prix IS 'Prix en Francs CFA (XOF) - pas de décimales';

-- Message de fin
SELECT 'Migration minimale terminée - Colonne prix convertie en BIGINT pour CFA' as message;
