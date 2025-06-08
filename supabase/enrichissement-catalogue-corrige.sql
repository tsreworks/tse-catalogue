-- ===============================================
-- ENRICHISSEMENT CATALOGUE TSE - VERSION CORRIGÉE
-- Version: 1.1
-- Date: 6 janvier 2025
-- Objectif: Ajouter les modèles populaires en respectant la structure existante
-- ===============================================

-- Désactiver les contraintes temporairement pour l'insertion en masse
SET session_replication_role = replica;

-- ===============================================
-- 1. AJOUT DES NOUVELLES MARQUES
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
-- 2. AJOUT DES NOUVEAUX MODÈLES
-- ===============================================

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

    -- Insertion des modèles BYD
    INSERT INTO models (brand_id, nom, description) VALUES
    (byd_id, 'Qin', 'Berline hybride rechargeable'),
    (byd_id, 'Song Plus', 'SUV hybride rechargeable'),
    (byd_id, 'Yuan Plus', 'SUV électrique compact (Atto 3)'),
    (byd_id, 'Dolphin', 'Citadine électrique'),
    (byd_id, 'Han', 'Berline électrique premium')
    ON CONFLICT (nom, brand_id) DO NOTHING;

    -- Insertion des modèles Mazda
    INSERT INTO models (brand_id, nom, description) VALUES
    (mazda_id, 'CX-5', 'SUV compact premium avec design Kodo'),
    (mazda_id, 'CX-30', 'SUV urbain compact élégant'),
    (mazda_id, 'Mazda3', 'Berline compacte sportive')
    ON CONFLICT (nom, brand_id) DO NOTHING;

    -- Insertion des modèles Subaru
    INSERT INTO models (brand_id, nom, description) VALUES
    (subaru_id, 'Crosstrek', 'SUV compact tout-terrain (XV)'),
    (subaru_id, 'Forester', 'SUV familial tout-terrain'),
    (subaru_id, 'Outback', 'Break surélevé tout-terrain')
    ON CONFLICT (nom, brand_id) DO NOTHING;

    -- Insertion des modèles Suzuki
    INSERT INTO models (brand_id, nom, description) VALUES
    (suzuki_id, 'Swift', 'Citadine sportive et agile'),
    (suzuki_id, 'Baleno', 'Berline compacte économique'),
    (suzuki_id, 'Vitara', 'SUV compact abordable')
    ON CONFLICT (nom, brand_id) DO NOTHING;

    -- Modèles supplémentaires pour marques existantes
    -- Toyota
    INSERT INTO models (brand_id, nom, description) VALUES
    (toyota_id, 'Corolla Cross', 'SUV compact basé sur Corolla'),
    (toyota_id, 'Camry', 'Berline intermédiaire confortable'),
    (toyota_id, 'Highlander', 'SUV 7 places familial'),
    (toyota_id, 'Tacoma', 'Pick-up compact robuste'),
    (toyota_id, 'Yaris Cross', 'SUV urbain compact'),
    (toyota_id, 'Yaris', 'Citadine économique et fiable');

    -- Honda
    INSERT INTO models (brand_id, nom, description) VALUES
    (honda_id, 'Civic', 'Berline compacte sportive'),
    (honda_id, 'Accord', 'Berline intermédiaire premium'),
    (honda_id, 'HR-V', 'SUV urbain compact'),
    (honda_id, 'Pilot', 'SUV 7 places familial');

    -- Nissan
    INSERT INTO models (brand_id, nom, description) VALUES
    (nissan_id, 'Sentra', 'Berline compacte (Sylphy)'),
    (nissan_id, 'X-Trail', 'SUV familial (Rogue)'),
    (nissan_id, 'Qashqai', 'SUV compact urbain'),
    (nissan_id, 'Altima', 'Berline intermédiaire'),
    (nissan_id, 'Kicks', 'SUV urbain compact'),
    (nissan_id, 'Versa', 'Berline compacte (Sunny)');

    -- Hyundai
    INSERT INTO models (brand_id, nom, description) VALUES
    (hyundai_id, 'Tucson', 'SUV compact familial moderne'),
    (hyundai_id, 'Elantra', 'Berline compacte (Avante)'),
    (hyundai_id, 'Creta', 'SUV compact abordable'),
    (hyundai_id, 'Kona', 'SUV urbain compact'),
    (hyundai_id, 'Santa Fe', 'SUV 7 places familial'),
    (hyundai_id, 'Venue', 'SUV urbain entry-level');

    -- Kia
    INSERT INTO models (brand_id, nom, description) VALUES
    (kia_id, 'Seltos', 'SUV compact moderne'),
    (kia_id, 'Sportage', 'SUV compact familial'),
    (kia_id, 'Sorento', 'SUV 7 places premium');

    -- Volkswagen
    INSERT INTO models (brand_id, nom, description) VALUES
    (volkswagen_id, 'Polo', 'Citadine premium allemande'),
    (volkswagen_id, 'Jetta', 'Berline compacte (Sagitar)'),
    (volkswagen_id, 'Tiguan', 'SUV compact premium'),
    (volkswagen_id, 'T-Cross', 'SUV urbain entry-level'),
    (volkswagen_id, 'Golf', 'Compacte de référence'),
    (volkswagen_id, 'Passat', 'Berline intermédiaire'),
    (volkswagen_id, 'ID.4', 'SUV électrique');

    -- BMW
    INSERT INTO models (brand_id, nom, description) VALUES
    (bmw_id, 'X3', 'SUV premium compact'),
    (bmw_id, 'Série 3', 'Berline sportive de référence'),
    (bmw_id, 'X5', 'SUV premium intermédiaire'),
    (bmw_id, 'X1', 'SUV premium urbain'),
    (bmw_id, 'Série 5', 'Berline de luxe');

    -- Mercedes-Benz
    INSERT INTO models (brand_id, nom, description) VALUES
    (mercedes_id, 'GLC', 'SUV premium compact'),
    (mercedes_id, 'Classe C', 'Berline de luxe compacte'),
    (mercedes_id, 'Classe E', 'Berline de luxe'),
    (mercedes_id, 'Sprinter', 'Véhicule utilitaire premium');

    -- Audi
    INSERT INTO models (brand_id, nom, description) VALUES
    (audi_id, 'Q5', 'SUV premium intermédiaire'),
    (audi_id, 'A4', 'Berline premium compacte'),
    (audi_id, 'Q3', 'SUV premium compact'),
    (audi_id, 'A6', 'Berline de luxe');

    -- Peugeot
    INSERT INTO models (brand_id, nom, description) VALUES
    (peugeot_id, '208', 'Citadine moderne française'),
    (peugeot_id, '2008', 'SUV urbain compact'),
    (peugeot_id, '3008', 'SUV compact premium');

    -- Renault
    INSERT INTO models (brand_id, nom, description) VALUES
    (renault_id, 'Clio', 'Citadine européenne populaire'),
    (renault_id, 'Captur', 'SUV urbain compact'),
    (renault_id, 'Kadjar', 'SUV compact familial');

    -- Dacia
    INSERT INTO models (brand_id, nom, description) VALUES
    (dacia_id, 'Sandero', 'Citadine abordable'),
    (dacia_id, 'Duster', 'SUV abordable et robuste'),
    (dacia_id, 'Logan', 'Berline économique');

END $$;

-- Réactiver les contraintes
SET session_replication_role = DEFAULT;

-- ===============================================
-- 3. VÉRIFICATIONS ET STATISTIQUES
-- ===============================================

-- Compter les nouvelles marques ajoutées
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
    '✅ ENRICHISSEMENT TERMINÉ AVEC SUCCÈS !' as message,
    'Le catalogue TSE contient maintenant de nombreux modèles populaires' as description,
    'Structure de base respectée - Prêt pour ajout de véhicules' as statut;
