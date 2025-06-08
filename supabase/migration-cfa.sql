-- Migration vers les prix en Francs CFA - VERSION CORRIGÉE
-- Version: 1.1
-- Date: 6 janvier 2025

-- Étape 1: Modifier le type de colonne prix
-- Utiliser BIGINT au lieu d'INTEGER pour éviter les dépassements

-- Sauvegarder les données existantes si nécessaire
-- CREATE TABLE vehicles_backup AS SELECT * FROM vehicles;

-- Modifier le type de la colonne prix de DECIMAL vers BIGINT (sans multiplication)
ALTER TABLE vehicles ALTER COLUMN prix TYPE BIGINT;

-- Ajouter un commentaire pour clarifier l'unité
COMMENT ON COLUMN vehicles.prix IS 'Prix en Francs CFA (XOF) - pas de décimales';

-- Étape 2: Mettre à jour les données existantes avec des prix réalistes en CFA
-- Si vous avez des données existantes, les convertir avec un taux approximatif

-- Exemple de conversion (à adapter selon vos données réelles):
-- 1 EUR ≈ 655 CFA (taux approximatif)
-- Mais il est préférable de mettre des prix réalistes pour le marché ivoirien

-- Supprimer les anciennes données de test si elles existent
DELETE FROM vehicle_equipments;
DELETE FROM vehicles;
DELETE FROM models;
DELETE FROM brands;
DELETE FROM equipments;

-- Réinitialiser les séquences
ALTER SEQUENCE brands_id_seq RESTART WITH 1;
ALTER SEQUENCE models_id_seq RESTART WITH 1;
ALTER SEQUENCE equipments_id_seq RESTART WITH 1;

-- Insérer les nouvelles données adaptées au marché ivoirien
-- (Le contenu sera inséré via sample-data-cfa.sql)

-- Étape 3: Ajouter des contraintes pour les prix en CFA
-- Prix minimum: 1 000 000 CFA (environ 1500 EUR)
-- Prix maximum: 100 000 000 CFA (environ 150 000 EUR)
ALTER TABLE vehicles ADD CONSTRAINT check_prix_minimum CHECK (prix >= 1000000);
ALTER TABLE vehicles ADD CONSTRAINT check_prix_maximum CHECK (prix <= 100000000);

-- Étape 4: Créer des index pour optimiser les recherches par prix
CREATE INDEX IF NOT EXISTS idx_vehicles_prix ON vehicles(prix);
CREATE INDEX IF NOT EXISTS idx_vehicles_prix_range ON vehicles(prix) WHERE statut = 'Disponible';

-- Étape 5: Créer des vues utiles pour les gammes de prix
CREATE OR REPLACE VIEW vehicles_by_price_range AS
SELECT 
  CASE 
    WHEN prix < 5000000 THEN 'Moins de 5M CFA'
    WHEN prix < 10000000 THEN '5M - 10M CFA'
    WHEN prix < 20000000 THEN '10M - 20M CFA'
    WHEN prix < 50000000 THEN '20M - 50M CFA'
    ELSE 'Plus de 50M CFA'
  END as gamme_prix,
  COUNT(*) as nombre_vehicules,
  MIN(prix) as prix_minimum,
  MAX(prix) as prix_maximum,
  AVG(prix)::BIGINT as prix_moyen
FROM vehicles 
WHERE statut = 'Disponible'
GROUP BY 
  CASE 
    WHEN prix < 5000000 THEN 'Moins de 5M CFA'
    WHEN prix < 10000000 THEN '5M - 10M CFA'
    WHEN prix < 20000000 THEN '10M - 20M CFA'
    WHEN prix < 50000000 THEN '20M - 50M CFA'
    ELSE 'Plus de 50M CFA'
  END
ORDER BY MIN(prix);

-- Étape 6: Fonction pour formater les prix en CFA (côté base de données)
CREATE OR REPLACE FUNCTION format_prix_cfa(prix_value BIGINT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  -- Formater le prix avec des espaces comme séparateurs de milliers
  RETURN REPLACE(TO_CHAR(prix_value, 'FM999G999G999G999'), ',', ' ') || ' CFA';
END;
$$;

-- Étape 7: Vue pour l'affichage des véhicules avec prix formatés
CREATE OR REPLACE VIEW vehicles_display AS
SELECT 
  v.*,
  b.nom as marque,
  m.nom as modele,
  format_prix_cfa(v.prix) as prix_formate,
  CASE 
    WHEN v.annee >= 2023 THEN 'Neuf'
    WHEN v.annee >= 2020 THEN 'Récent'
    WHEN v.annee >= 2015 THEN 'Occasion'
    ELSE 'Ancien'
  END as categorie_age
FROM vehicles v
JOIN brands b ON v.brand_id = b.id
JOIN models m ON v.model_id = m.id;

-- Étape 8: Statistiques des prix par marque
CREATE OR REPLACE VIEW prix_par_marque AS
SELECT 
  b.nom as marque,
  COUNT(v.id) as nombre_vehicules,
  MIN(v.prix) as prix_minimum,
  MAX(v.prix) as prix_maximum,
  AVG(v.prix)::BIGINT as prix_moyen,
  format_prix_cfa(MIN(v.prix)) as prix_min_formate,
  format_prix_cfa(MAX(v.prix)) as prix_max_formate,
  format_prix_cfa(AVG(v.prix)::BIGINT) as prix_moyen_formate
FROM vehicles v
JOIN brands b ON v.brand_id = b.id
WHERE v.statut = 'Disponible'
GROUP BY b.nom
ORDER BY prix_moyen DESC;

-- Commentaires pour la documentation
COMMENT ON VIEW vehicles_by_price_range IS 'Répartition des véhicules par gamme de prix en CFA';
COMMENT ON VIEW vehicles_display IS 'Vue complète des véhicules avec prix formatés en CFA';
COMMENT ON VIEW prix_par_marque IS 'Statistiques des prix par marque en CFA';
COMMENT ON FUNCTION format_prix_cfa IS 'Formate un prix en Francs CFA avec séparateurs';

-- Message de fin
SELECT 'Migration vers les prix en Francs CFA terminée avec succès' as message;
SELECT 'Exécutez maintenant sample-data-cfa.sql pour insérer les données de test' as next_step;
