-- ===============================================
-- ENRICHISSEMENT CATALOGUE TSE - 100 MODÈLES POPULAIRES
-- Version: 1.0
-- Date: 6 janvier 2025
-- Objectif: Ajouter les 100 modèles de véhicules les plus vendus mondialement
-- ===============================================

-- Désactiver les contraintes temporairement pour l'insertion en masse
SET session_replication_role = replica;

-- ===============================================
-- 1. AJOUT DES NOUVELLES MARQUES
-- ===============================================

-- Marques déjà existantes: Toyota, Nissan, Honda, Hyundai, Kia, Peugeot, Renault, Volkswagen, BMW, Mercedes-Benz

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
('Opel', '/images/brands/default.svg', 'Marque automobile allemande historique (fondée en 1862)'),

-- Marques du Moyen-Orient
('Saipa', '/images/brands/default.svg', 'Constructeur automobile iranien (fondé en 1966)')

ON CONFLICT (nom) DO NOTHING;

-- ===============================================
-- 2. AJOUT DES NOUVEAUX MODÈLES
-- ===============================================

-- Récupération des IDs des marques pour les relations
DO $$
DECLARE
    tesla_id UUID;
    ford_id UUID;
    chevrolet_id UUID;
    gmc_id UUID;
    ram_id UUID;
    jeep_id UUID;
    byd_id UUID;
    haval_id UUID;
    changan_id UUID;
    chery_id UUID;
    wuling_id UUID;
    aion_id UUID;
    mazda_id UUID;
    subaru_id UUID;
    suzuki_id UUID;
    isuzu_id UUID;
    lexus_id UUID;
    audi_id UUID;
    volvo_id UUID;
    dacia_id UUID;
    opel_id UUID;
    saipa_id UUID;
    toyota_id UUID;
    nissan_id UUID;
    honda_id UUID;
    hyundai_id UUID;
    kia_id UUID;
    peugeot_id UUID;
    renault_id UUID;
    volkswagen_id UUID;
    bmw_id UUID;
    mercedes_id UUID;
BEGIN
    -- Récupération des IDs des marques
    SELECT id INTO tesla_id FROM brands WHERE nom = 'Tesla';
    SELECT id INTO ford_id FROM brands WHERE nom = 'Ford';
    SELECT id INTO chevrolet_id FROM brands WHERE nom = 'Chevrolet';
    SELECT id INTO gmc_id FROM brands WHERE nom = 'GMC';
    SELECT id INTO ram_id FROM brands WHERE nom = 'Ram';
    SELECT id INTO jeep_id FROM brands WHERE nom = 'Jeep';
    SELECT id INTO byd_id FROM brands WHERE nom = 'BYD';
    SELECT id INTO haval_id FROM brands WHERE nom = 'Haval';
    SELECT id INTO changan_id FROM brands WHERE nom = 'Changan';
    SELECT id INTO chery_id FROM brands WHERE nom = 'Chery';
    SELECT id INTO wuling_id FROM brands WHERE nom = 'Wuling';
    SELECT id INTO aion_id FROM brands WHERE nom = 'AION';
    SELECT id INTO mazda_id FROM brands WHERE nom = 'Mazda';
    SELECT id INTO subaru_id FROM brands WHERE nom = 'Subaru';
    SELECT id INTO suzuki_id FROM brands WHERE nom = 'Suzuki';
    SELECT id INTO isuzu_id FROM brands WHERE nom = 'Isuzu';
    SELECT id INTO lexus_id FROM brands WHERE nom = 'Lexus';
    SELECT id INTO audi_id FROM brands WHERE nom = 'Audi';
    SELECT id INTO volvo_id FROM brands WHERE nom = 'Volvo';
    SELECT id INTO dacia_id FROM brands WHERE nom = 'Dacia';
    SELECT id INTO opel_id FROM brands WHERE nom = 'Opel';
    SELECT id INTO saipa_id FROM brands WHERE nom = 'Saipa';
    SELECT id INTO toyota_id FROM brands WHERE nom = 'Toyota';
    SELECT id INTO nissan_id FROM brands WHERE nom = 'Nissan';
    SELECT id INTO honda_id FROM brands WHERE nom = 'Honda';
    SELECT id INTO hyundai_id FROM brands WHERE nom = 'Hyundai';
    SELECT id INTO kia_id FROM brands WHERE nom = 'Kia';
    SELECT id INTO peugeot_id FROM brands WHERE nom = 'Peugeot';
    SELECT id INTO renault_id FROM brands WHERE nom = 'Renault';
    SELECT id INTO volkswagen_id FROM brands WHERE nom = 'Volkswagen';
    SELECT id INTO bmw_id FROM brands WHERE nom = 'BMW';
    SELECT id INTO mercedes_id FROM brands WHERE nom = 'Mercedes-Benz';

    -- Insertion des modèles Tesla
    INSERT INTO models (brand_id, nom, description) VALUES
    (tesla_id, 'Model Y', 'SUV électrique compact premium avec technologie avancée'),
    (tesla_id, 'Model 3', 'Berline électrique premium avec autopilot')
    ON CONFLICT (nom, brand_id) DO NOTHING;

    -- Insertion des modèles Ford
    INSERT INTO models (brand_id, nom, description) VALUES
    (ford_id, 'F-150', 'Pick-up pleine grandeur le plus vendu'),
    (ford_id, 'Ranger', 'Pick-up compact polyvalent'),
    (ford_id, 'Escape', 'SUV compact familial (Kuga en Europe)'),
    (ford_id, 'Explorer', 'SUV 7 places familial'),
    (ford_id, 'Transit', 'Véhicule utilitaire polyvalent')
    ON CONFLICT (nom, brand_id) DO NOTHING;

    -- Insertion des modèles Chevrolet
    INSERT INTO models (brand_id, nom, description) VALUES
    (chevrolet_id, 'Silverado 1500', 'Pick-up pleine grandeur'),
    (chevrolet_id, 'Equinox', 'SUV compact familial');

    -- Insertion des modèles GMC
    INSERT INTO models (brand_id, nom, description) VALUES
    (gmc_id, 'Sierra 1500', 'Pick-up pleine grandeur premium');

    -- Insertion des modèles Ram
    INSERT INTO models (brand_id, nom, description) VALUES
    (ram_id, '1500', 'Pick-up pleine grandeur robuste');

    -- Insertion des modèles Jeep
    INSERT INTO models (brand_id, nom, description) VALUES
    (jeep_id, 'Compass', 'SUV compact tout-terrain'),
    (jeep_id, 'Wrangler', 'SUV tout-terrain iconique');

    -- Insertion des modèles BYD
    INSERT INTO models (brand_id, nom, description) VALUES
    (byd_id, 'Qin', 'Berline hybride rechargeable'),
    (byd_id, 'Song Plus', 'SUV hybride rechargeable'),
    (byd_id, 'Yuan Plus', 'SUV électrique compact (Atto 3)'),
    (byd_id, 'Dolphin', 'Citadine électrique'),
    (byd_id, 'Seagull', 'Citadine électrique abordable'),
    (byd_id, 'Han', 'Berline électrique premium');

    -- Insertion des modèles Haval
    INSERT INTO models (brand_id, nom, description, segment, type_carrosserie) VALUES
    (haval_id, 'H6', 'SUV compact populaire en Chine', 'SUV Compact', 'SUV');

    -- Insertion des modèles Changan
    INSERT INTO models (brand_id, nom, description, segment, type_carrosserie) VALUES
    (changan_id, 'CS75', 'SUV compact chinois', 'SUV Compact', 'SUV');

    -- Insertion des modèles Chery
    INSERT INTO models (brand_id, nom, description, segment, type_carrosserie) VALUES
    (chery_id, 'Tiggo 8', 'SUV 7 places familial', 'SUV Intermédiaire', 'SUV');

    -- Insertion des modèles Wuling
    INSERT INTO models (brand_id, nom, description, segment, type_carrosserie) VALUES
    (wuling_id, 'Hongguang Mini EV', 'Micro-véhicule électrique urbain', 'Citadine', 'Hatchback');

    -- Insertion des modèles AION
    INSERT INTO models (brand_id, nom, description, segment, type_carrosserie) VALUES
    (aion_id, 'S', 'Berline électrique premium', 'Berline Compacte', 'Berline'),
    (aion_id, 'Y', 'SUV électrique familial', 'SUV Compact', 'SUV');

    -- Insertion des modèles Mazda
    INSERT INTO models (brand_id, nom, description, segment, type_carrosserie) VALUES
    (mazda_id, 'CX-5', 'SUV compact premium', 'SUV Compact', 'SUV'),
    (mazda_id, 'CX-30', 'SUV urbain compact', 'SUV Compact', 'SUV');

    -- Insertion des modèles Subaru
    INSERT INTO models (brand_id, nom, description, segment, type_carrosserie) VALUES
    (subaru_id, 'Crosstrek', 'SUV compact tout-terrain (XV)', 'SUV Compact', 'SUV'),
    (subaru_id, 'Forester', 'SUV familial tout-terrain', 'SUV Intermédiaire', 'SUV'),
    (subaru_id, 'Outback', 'Break surélevé tout-terrain', 'Break', 'Break');

    -- Insertion des modèles Suzuki
    INSERT INTO models (brand_id, nom, description, segment, type_carrosserie) VALUES
    (suzuki_id, 'Swift', 'Citadine sportive', 'Citadine', 'Hatchback'),
    (suzuki_id, 'Baleno', 'Berline compacte', 'Berline Compacte', 'Berline'),
    (suzuki_id, 'Wagon R', 'Citadine haute (Inde)', 'Citadine', 'Hatchback'),
    (suzuki_id, 'Dzire', 'Berline compacte (Inde)', 'Berline Compacte', 'Berline');

    -- Insertion des modèles Isuzu
    INSERT INTO models (brand_id, nom, description, segment, type_carrosserie) VALUES
    (isuzu_id, 'D-Max', 'Pick-up robuste', 'Pick-up Compact', 'Pick-up');

    -- Insertion des modèles Lexus
    INSERT INTO models (brand_id, nom, description, segment, type_carrosserie) VALUES
    (lexus_id, 'RX', 'SUV de luxe intermédiaire', 'SUV Intermédiaire', 'SUV'),
    (lexus_id, 'NX', 'SUV de luxe compact', 'SUV Compact', 'SUV');

    -- Insertion des modèles Audi
    INSERT INTO models (brand_id, nom, description, segment, type_carrosserie) VALUES
    (audi_id, 'Q5', 'SUV premium intermédiaire', 'SUV Intermédiaire', 'SUV'),
    (audi_id, 'A6', 'Berline de luxe', 'Berline Intermédiaire', 'Berline');

    -- Insertion des modèles Volvo
    INSERT INTO models (brand_id, nom, description, segment, type_carrosserie) VALUES
    (volvo_id, 'XC60', 'SUV premium compact', 'SUV Compact', 'SUV'),
    (volvo_id, 'XC40', 'SUV urbain premium', 'SUV Compact', 'SUV');

    -- Insertion des modèles Dacia
    INSERT INTO models (brand_id, nom, description, segment, type_carrosserie) VALUES
    (dacia_id, 'Sandero', 'Citadine abordable', 'Citadine', 'Hatchback'),
    (dacia_id, 'Duster', 'SUV abordable', 'SUV Compact', 'SUV');

    -- Insertion des modèles Opel
    INSERT INTO models (brand_id, nom, description, segment, type_carrosserie) VALUES
    (opel_id, 'Corsa', 'Citadine européenne', 'Citadine', 'Hatchback');

    -- Insertion des modèles Saipa
    INSERT INTO models (brand_id, nom, description, segment, type_carrosserie) VALUES
    (saipa_id, 'Tiba', 'Citadine économique iranienne', 'Citadine', 'Hatchback');

    -- Modèles supplémentaires pour marques existantes
    -- Toyota
    INSERT INTO models (brand_id, nom, description, segment, type_carrosserie) VALUES
    (toyota_id, 'Corolla Cross', 'SUV compact basé sur Corolla', 'SUV Compact', 'SUV'),
    (toyota_id, 'Camry', 'Berline intermédiaire', 'Berline Intermédiaire', 'Berline'),
    (toyota_id, 'Highlander', 'SUV 7 places familial', 'SUV Intermédiaire', 'SUV'),
    (toyota_id, 'Tacoma', 'Pick-up compact', 'Pick-up Compact', 'Pick-up'),
    (toyota_id, 'Sienna', 'Monospace familial', 'Monospace', 'Monospace'),
    (toyota_id, 'Yaris Cross', 'SUV urbain compact', 'SUV Compact', 'SUV'),
    (toyota_id, 'Yaris', 'Citadine économique', 'Citadine', 'Hatchback');

    -- Honda
    INSERT INTO models (brand_id, nom, description, segment, type_carrosserie) VALUES
    (honda_id, 'Civic', 'Berline compacte sportive', 'Berline Compacte', 'Berline'),
    (honda_id, 'Accord', 'Berline intermédiaire', 'Berline Intermédiaire', 'Berline'),
    (honda_id, 'HR-V', 'SUV urbain compact', 'SUV Compact', 'SUV'),
    (honda_id, 'N-Box', 'Kei car japonaise', 'Citadine', 'Hatchback'),
    (honda_id, 'ZR-V', 'SUV compact récent', 'SUV Compact', 'SUV');

    -- Nissan
    INSERT INTO models (brand_id, nom, description, segment, type_carrosserie) VALUES
    (nissan_id, 'Sentra', 'Berline compacte (Sylphy)', 'Berline Compacte', 'Berline'),
    (nissan_id, 'X-Trail', 'SUV familial (Rogue)', 'SUV Intermédiaire', 'SUV'),
    (nissan_id, 'Qashqai', 'SUV compact urbain', 'SUV Compact', 'SUV'),
    (nissan_id, 'Altima', 'Berline intermédiaire', 'Berline Intermédiaire', 'Berline'),
    (nissan_id, 'Kicks', 'SUV urbain compact', 'SUV Compact', 'SUV'),
    (nissan_id, 'Versa', 'Berline compacte (Sunny)', 'Berline Compacte', 'Berline');

    -- Hyundai
    INSERT INTO models (brand_id, nom, description, segment, type_carrosserie) VALUES
    (hyundai_id, 'Tucson', 'SUV compact familial', 'SUV Compact', 'SUV'),
    (hyundai_id, 'Elantra', 'Berline compacte (Avante)', 'Berline Compacte', 'Berline'),
    (hyundai_id, 'Creta', 'SUV compact abordable', 'SUV Compact', 'SUV'),
    (hyundai_id, 'Kona', 'SUV urbain compact', 'SUV Compact', 'SUV'),
    (hyundai_id, 'Santa Fe', 'SUV 7 places familial', 'SUV Intermédiaire', 'SUV'),
    (hyundai_id, 'Venue', 'SUV urbain entry-level', 'SUV Compact', 'SUV');

    -- Kia
    INSERT INTO models (brand_id, nom, description, segment, type_carrosserie) VALUES
    (kia_id, 'Seltos', 'SUV compact moderne', 'SUV Compact', 'SUV'),
    (kia_id, 'Sportage', 'SUV compact familial', 'SUV Compact', 'SUV'),
    (kia_id, 'Sorento', 'SUV 7 places premium', 'SUV Intermédiaire', 'SUV');

    -- Peugeot
    INSERT INTO models (brand_id, nom, description, segment, type_carrosserie) VALUES
    (peugeot_id, '208', 'Citadine moderne', 'Citadine', 'Hatchback'),
    (peugeot_id, '2008', 'SUV urbain compact', 'SUV Compact', 'SUV');

    -- Renault
    INSERT INTO models (brand_id, nom, description, segment, type_carrosserie) VALUES
    (renault_id, 'Clio', 'Citadine européenne populaire', 'Citadine', 'Hatchback');

    -- Volkswagen
    INSERT INTO models (brand_id, nom, description, segment, type_carrosserie) VALUES
    (volkswagen_id, 'Polo', 'Citadine premium', 'Citadine', 'Hatchback'),
    (volkswagen_id, 'Jetta', 'Berline compacte (Sagitar)', 'Berline Compacte', 'Berline'),
    (volkswagen_id, 'Tiguan', 'SUV compact premium', 'SUV Compact', 'SUV'),
    (volkswagen_id, 'Lavida', 'Berline compacte (Chine)', 'Berline Compacte', 'Berline'),
    (volkswagen_id, 'T-Roc', 'SUV urbain compact', 'SUV Compact', 'SUV'),
    (volkswagen_id, 'T-Cross', 'SUV urbain entry-level', 'SUV Compact', 'SUV'),
    (volkswagen_id, 'Golf', 'Compacte de référence', 'Berline Compacte', 'Hatchback'),
    (volkswagen_id, 'Taos', 'SUV compact (Tharu)', 'SUV Compact', 'SUV'),
    (volkswagen_id, 'Passat', 'Berline intermédiaire', 'Berline Intermédiaire', 'Berline'),
    (volkswagen_id, 'ID.4', 'SUV électrique', 'SUV Compact', 'SUV');

    -- BMW
    INSERT INTO models (brand_id, nom, description, segment, type_carrosserie) VALUES
    (bmw_id, 'X3', 'SUV premium compact', 'SUV Compact', 'SUV'),
    (bmw_id, 'Série 3', 'Berline sportive de référence', 'Berline Compacte', 'Berline'),
    (bmw_id, 'X5', 'SUV premium intermédiaire', 'SUV Intermédiaire', 'SUV'),
    (bmw_id, 'X1', 'SUV premium urbain', 'SUV Compact', 'SUV'),
    (bmw_id, 'Série 5', 'Berline de luxe', 'Berline Intermédiaire', 'Berline');

    -- Mercedes-Benz
    INSERT INTO models (brand_id, nom, description, segment, type_carrosserie) VALUES
    (mercedes_id, 'GLC', 'SUV premium compact', 'SUV Compact', 'SUV'),
    (mercedes_id, 'Classe C', 'Berline de luxe compacte', 'Berline Compacte', 'Berline'),
    (mercedes_id, 'Classe E', 'Berline de luxe', 'Berline Intermédiaire', 'Berline'),
    (mercedes_id, 'Sprinter', 'Véhicule utilitaire premium', 'Utilitaire', 'Fourgon');

END $$;
