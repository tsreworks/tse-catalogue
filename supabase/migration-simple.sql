-- Migration simplifiée vers les prix en Francs CFA
-- Version: 1.0 (Ultra-simple)
-- Date: 6 janvier 2025

-- Étape 1: Modifier le type de colonne prix (sans conversion)
ALTER TABLE vehicles ALTER COLUMN prix TYPE BIGINT;

-- Ajouter un commentaire pour clarifier l'unité
COMMENT ON COLUMN vehicles.prix IS 'Prix en Francs CFA (XOF) - pas de décimales';

-- Étape 2: Nettoyer les données existantes (si les tables existent)
DELETE FROM vehicle_equipments WHERE TRUE;
DELETE FROM vehicles WHERE TRUE;
DELETE FROM models WHERE TRUE;
DELETE FROM brands WHERE TRUE;
DELETE FROM equipments WHERE TRUE;

-- Étape 3: Ajouter des contraintes basiques pour les prix en CFA
ALTER TABLE vehicles ADD CONSTRAINT check_prix_minimum CHECK (prix >= 1000000);
ALTER TABLE vehicles ADD CONSTRAINT check_prix_maximum CHECK (prix <= 100000000);

-- Message de fin
SELECT 'Migration simplifiée terminée - Prêt pour les données CFA' as message;
SELECT 'Exécutez maintenant sample-data-cfa.sql pour insérer les données de test' as next_step;
