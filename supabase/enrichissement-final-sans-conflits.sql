-- ===============================================
-- ENRICHISSEMENT CATALOGUE TSE - SANS CONFLITS
-- Version: 1.2
-- Date: 6 janvier 2025
-- Objectif: Ajouter les modèles populaires en gérant les conflits
-- ===============================================

-- ===============================================
-- 1. AJOUT DES NOUVELLES MARQUES (SANS CONFLITS)
-- ===============================================

INSERT INTO brands (nom, logo, description) VALUES
-- Marques américaines
('Tesla', '/images/brands/default.svg', 'Constructeur américain spécialisé dans les véhicules électriques (fondé en 2003)'),
('Ford', '/images/brands/default.svg', 'Constructeur automobile américain fondé par Henry Ford en 1903'),
('Chevrolet', '/images/brands/default.svg', 'Marque automobile américaine du groupe General Motors (fondée en 1911)'),
('GMC', '/images/brands/default.svg', 'Marque de véhicules utilitaires du groupe General Motors (fondée en 1912)'),
('Ram', '/images/brands/default.svg', 'Marque de pick-up et véhicules commerciaux (fondée en 2010)'),
('Jeep', '/images/brands/default.svg', 'Marque américaine spécialisée dans les véhicules tout-terrain (fondée en 1941)'),

-- Marques chinoises
('BYD', '/images/brands/default.svg', 'Constructeur chinois leader dans les véhicules électriques (fondé en 1995)'),
('Haval', '/images/brands/default.svg', 'Marque SUV chinoise du groupe Great Wall Motors (fondée en 2013)'),
('Changan', '/images/brands/default.svg', 'Constructeur automobile chinois historique (fondé en 1862)'),
('Chery', '/images/brands/default.svg', 'Constructeur automobile chinois en expansion (fondé en 1997)'),
('Wuling', '/images/brands/default.svg', 'Marque chinoise spécialisée dans les véhicules commerciaux (fondée en 1958)'),
('AION', '/images/brands/default.svg', 'Marque de véhicules électriques de GAC Motor (fondée en 2017)'),

-- Marques japonaises supplémentaires
('Mazda', '/images/brands/default.svg', 'Constructeur automobile japonais réputé pour son design (fondé en 1920)'),
('Subaru', '/images/brands/default.svg', 'Constructeur automobile japonais spécialisé dans la traction intégrale (fondé en 1953)'),
('Suzuki', '/images/brands/default.svg', 'Constructeur automobile et moto japonais (fondé en 1909)'),
('Isuzu', '/images/brands/default.svg', 'Constructeur japonais spécialisé dans les véhicules commerciaux (fondé en 1916)'),
('Lexus', '/images/brands/default.svg', 'Marque de luxe de Toyota (fondée en 1989)'),

-- Marques européennes supplémentaires
('Audi', '/images/brands/default.svg', 'Marque de luxe allemande du groupe Volkswagen (fondée en 1909)'),
('Volvo', '/images/brands/default.svg', 'Constructeur automobile suédois réputé pour la sécurité (fondé en 1927)'),
('Dacia', '/images/brands/default.svg', 'Marque roumaine du groupe Renault offrant un excellent rapport qualité-prix (fondée en 1966)'),
('Opel', '/images/brands/default.svg', 'Marque automobile allemande historique (fondée en 1862)')

ON CONFLICT (nom) DO NOTHING;

-- ===============================================
-- 2. AJOUT DES NOUVEAUX MODÈLES (AVEC GESTION CONFLITS)
-- ===============================================

-- Fonction pour insérer un modèle sans conflit
CREATE OR REPLACE FUNCTION insert_model_safe(
    brand_name TEXT,
    model_name TEXT,
    model_description TEXT
) RETURNS VOID AS $$
DECLARE
    brand_uuid UUID;
BEGIN
    -- Récupérer l'ID de la marque
    SELECT id INTO brand_uuid FROM brands WHERE nom = brand_name;
    
    -- Insérer le modèle si la marque existe
    IF brand_uuid IS NOT NULL THEN
        INSERT INTO models (brand_id, nom, description) 
        VALUES (brand_uuid, model_name, model_description)
        ON CONFLICT (nom, brand_id) DO NOTHING;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Insertion sécurisée des modèles

-- Tesla
SELECT insert_model_safe('Tesla', 'Model Y', 'SUV électrique compact premium avec technologie avancée');
SELECT insert_model_safe('Tesla', 'Model 3', 'Berline électrique premium avec autopilot');

-- Ford
SELECT insert_model_safe('Ford', 'F-150', 'Pick-up pleine grandeur le plus vendu');
SELECT insert_model_safe('Ford', 'Ranger', 'Pick-up compact polyvalent');
SELECT insert_model_safe('Ford', 'Escape', 'SUV compact familial (Kuga en Europe)');
SELECT insert_model_safe('Ford', 'Explorer', 'SUV 7 places familial');
SELECT insert_model_safe('Ford', 'Transit', 'Véhicule utilitaire polyvalent');

-- BYD
SELECT insert_model_safe('BYD', 'Qin', 'Berline hybride rechargeable');
SELECT insert_model_safe('BYD', 'Song Plus', 'SUV hybride rechargeable');
SELECT insert_model_safe('BYD', 'Yuan Plus', 'SUV électrique compact (Atto 3)');
SELECT insert_model_safe('BYD', 'Dolphin', 'Citadine électrique');
SELECT insert_model_safe('BYD', 'Han', 'Berline électrique premium');

-- Mazda
SELECT insert_model_safe('Mazda', 'CX-5', 'SUV compact premium avec design Kodo');
SELECT insert_model_safe('Mazda', 'CX-30', 'SUV urbain compact élégant');
SELECT insert_model_safe('Mazda', 'Mazda3', 'Berline compacte sportive');

-- Subaru
SELECT insert_model_safe('Subaru', 'Crosstrek', 'SUV compact tout-terrain (XV)');
SELECT insert_model_safe('Subaru', 'Forester', 'SUV familial tout-terrain');
SELECT insert_model_safe('Subaru', 'Outback', 'Break surélevé tout-terrain');

-- Suzuki
SELECT insert_model_safe('Suzuki', 'Swift', 'Citadine sportive et agile');
SELECT insert_model_safe('Suzuki', 'Baleno', 'Berline compacte économique');
SELECT insert_model_safe('Suzuki', 'Vitara', 'SUV compact abordable');

-- Toyota (modèles supplémentaires)
SELECT insert_model_safe('Toyota', 'Corolla Cross', 'SUV compact basé sur Corolla');
SELECT insert_model_safe('Toyota', 'Camry', 'Berline intermédiaire confortable');
SELECT insert_model_safe('Toyota', 'Highlander', 'SUV 7 places familial');
SELECT insert_model_safe('Toyota', 'Tacoma', 'Pick-up compact robuste');
SELECT insert_model_safe('Toyota', 'Yaris Cross', 'SUV urbain compact');
SELECT insert_model_safe('Toyota', 'Yaris', 'Citadine économique et fiable');

-- Honda (modèles supplémentaires)
SELECT insert_model_safe('Honda', 'Civic', 'Berline compacte sportive');
SELECT insert_model_safe('Honda', 'Accord', 'Berline intermédiaire premium');
SELECT insert_model_safe('Honda', 'HR-V', 'SUV urbain compact');
SELECT insert_model_safe('Honda', 'Pilot', 'SUV 7 places familial');

-- Nissan (modèles supplémentaires)
SELECT insert_model_safe('Nissan', 'Sentra', 'Berline compacte (Sylphy)');
SELECT insert_model_safe('Nissan', 'X-Trail', 'SUV familial (Rogue)');
SELECT insert_model_safe('Nissan', 'Qashqai', 'SUV compact urbain');
SELECT insert_model_safe('Nissan', 'Altima', 'Berline intermédiaire');
SELECT insert_model_safe('Nissan', 'Kicks', 'SUV urbain compact');
SELECT insert_model_safe('Nissan', 'Versa', 'Berline compacte (Sunny)');

-- Hyundai (modèles supplémentaires)
SELECT insert_model_safe('Hyundai', 'Tucson', 'SUV compact familial moderne');
SELECT insert_model_safe('Hyundai', 'Elantra', 'Berline compacte (Avante)');
SELECT insert_model_safe('Hyundai', 'Creta', 'SUV compact abordable');
SELECT insert_model_safe('Hyundai', 'Kona', 'SUV urbain compact');
SELECT insert_model_safe('Hyundai', 'Santa Fe', 'SUV 7 places familial');
SELECT insert_model_safe('Hyundai', 'Venue', 'SUV urbain entry-level');

-- Kia (modèles supplémentaires)
SELECT insert_model_safe('Kia', 'Seltos', 'SUV compact moderne');
SELECT insert_model_safe('Kia', 'Sportage', 'SUV compact familial');
SELECT insert_model_safe('Kia', 'Sorento', 'SUV 7 places premium');

-- Volkswagen (modèles supplémentaires)
SELECT insert_model_safe('Volkswagen', 'Polo', 'Citadine premium allemande');
SELECT insert_model_safe('Volkswagen', 'Jetta', 'Berline compacte (Sagitar)');
SELECT insert_model_safe('Volkswagen', 'Tiguan', 'SUV compact premium');
SELECT insert_model_safe('Volkswagen', 'T-Cross', 'SUV urbain entry-level');
SELECT insert_model_safe('Volkswagen', 'Golf', 'Compacte de référence');
SELECT insert_model_safe('Volkswagen', 'Passat', 'Berline intermédiaire');
SELECT insert_model_safe('Volkswagen', 'ID.4', 'SUV électrique');

-- BMW (modèles supplémentaires)
SELECT insert_model_safe('BMW', 'X3', 'SUV premium compact');
SELECT insert_model_safe('BMW', 'Série 3', 'Berline sportive de référence');
SELECT insert_model_safe('BMW', 'X5', 'SUV premium intermédiaire');
SELECT insert_model_safe('BMW', 'X1', 'SUV premium urbain');
SELECT insert_model_safe('BMW', 'Série 5', 'Berline de luxe');

-- Mercedes-Benz (modèles supplémentaires)
SELECT insert_model_safe('Mercedes-Benz', 'GLC', 'SUV premium compact');
SELECT insert_model_safe('Mercedes-Benz', 'Classe C', 'Berline de luxe compacte');
SELECT insert_model_safe('Mercedes-Benz', 'Classe E', 'Berline de luxe');
SELECT insert_model_safe('Mercedes-Benz', 'Sprinter', 'Véhicule utilitaire premium');

-- Audi
SELECT insert_model_safe('Audi', 'Q5', 'SUV premium intermédiaire');
SELECT insert_model_safe('Audi', 'A4', 'Berline premium compacte');
SELECT insert_model_safe('Audi', 'Q3', 'SUV premium compact');
SELECT insert_model_safe('Audi', 'A6', 'Berline de luxe');

-- Peugeot (modèles supplémentaires)
SELECT insert_model_safe('Peugeot', '208', 'Citadine moderne française');
SELECT insert_model_safe('Peugeot', '2008', 'SUV urbain compact');
SELECT insert_model_safe('Peugeot', '3008', 'SUV compact premium');

-- Renault (modèles supplémentaires)
SELECT insert_model_safe('Renault', 'Clio', 'Citadine européenne populaire');
SELECT insert_model_safe('Renault', 'Captur', 'SUV urbain compact');
SELECT insert_model_safe('Renault', 'Kadjar', 'SUV compact familial');

-- Dacia
SELECT insert_model_safe('Dacia', 'Sandero', 'Citadine abordable');
SELECT insert_model_safe('Dacia', 'Duster', 'SUV abordable et robuste');
SELECT insert_model_safe('Dacia', 'Logan', 'Berline économique');

-- Chevrolet
SELECT insert_model_safe('Chevrolet', 'Silverado 1500', 'Pick-up pleine grandeur');
SELECT insert_model_safe('Chevrolet', 'Equinox', 'SUV compact familial');

-- GMC
SELECT insert_model_safe('GMC', 'Sierra 1500', 'Pick-up pleine grandeur premium');

-- Ram
SELECT insert_model_safe('Ram', '1500', 'Pick-up pleine grandeur robuste');

-- Jeep
SELECT insert_model_safe('Jeep', 'Compass', 'SUV compact tout-terrain');
SELECT insert_model_safe('Jeep', 'Wrangler', 'SUV tout-terrain iconique');

-- Lexus
SELECT insert_model_safe('Lexus', 'RX', 'SUV de luxe intermédiaire');
SELECT insert_model_safe('Lexus', 'NX', 'SUV de luxe compact');

-- Isuzu
SELECT insert_model_safe('Isuzu', 'D-Max', 'Pick-up robuste');

-- Volvo
SELECT insert_model_safe('Volvo', 'XC60', 'SUV premium compact');
SELECT insert_model_safe('Volvo', 'XC40', 'SUV urbain premium');

-- Opel
SELECT insert_model_safe('Opel', 'Corsa', 'Citadine européenne');

-- Haval
SELECT insert_model_safe('Haval', 'H6', 'SUV compact populaire en Chine');

-- Changan
SELECT insert_model_safe('Changan', 'CS75', 'SUV compact chinois');

-- Chery
SELECT insert_model_safe('Chery', 'Tiggo 8', 'SUV 7 places familial');

-- Wuling
SELECT insert_model_safe('Wuling', 'Hongguang Mini EV', 'Micro-véhicule électrique urbain');

-- AION
SELECT insert_model_safe('AION', 'S', 'Berline électrique premium');
SELECT insert_model_safe('AION', 'Y', 'SUV électrique familial');

-- Supprimer la fonction temporaire
DROP FUNCTION insert_model_safe(TEXT, TEXT, TEXT);

-- ===============================================
-- 3. VÉRIFICATIONS ET STATISTIQUES
-- ===============================================

-- Compter les éléments
SELECT 'Marques totales' as type, COUNT(*) as nombre FROM brands
UNION ALL
SELECT 'Modèles totaux' as type, COUNT(*) as nombre FROM models;

-- Statistiques par marque
SELECT 
    b.nom as marque,
    COUNT(m.id) as nombre_modeles
FROM brands b
LEFT JOIN models m ON b.id = m.brand_id
GROUP BY b.nom, b.id
ORDER BY nombre_modeles DESC, b.nom;

-- Message de confirmation
SELECT 
    '✅ ENRICHISSEMENT TERMINÉ SANS CONFLITS !' as message,
    'Tous les doublons ont été gérés automatiquement' as description,
    'Catalogue enrichi et prêt pour ajout de véhicules' as statut;
