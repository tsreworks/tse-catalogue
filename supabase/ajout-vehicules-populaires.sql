-- ===============================================
-- AJOUT VÉHICULES POPULAIRES - STRUCTURE CORRECTE
-- Version: 1.0
-- Date: 6 janvier 2025
-- Objectif: Ajouter des véhicules avec la structure existante
-- ===============================================

-- ===============================================
-- INSERTION DE VÉHICULES POPULAIRES
-- ===============================================

DO $$
DECLARE
    -- Variables pour les IDs des modèles
    model_y_id UUID;
    model_3_id UUID;
    f150_id UUID;
    rav4_id UUID;
    crv_id UUID;
    corolla_id UUID;
    corolla_cross_id UUID;
    camry_id UUID;
    hilux_id UUID;
    sentra_id UUID;
    civic_id UUID;
    qin_id UUID;
    xtrail_id UUID;
    accord_id UUID;
    tucson_id UUID;
    cx5_id UUID;
    polo_id UUID;
    jetta_id UUID;
    swift_id UUID;
    hrv_id UUID;
    highlander_id UUID;
    ranger_id UUID;
    seltos_id UUID;
    escape_id UUID;
    qashqai_id UUID;
    sportage_id UUID;
    tiguan_id UUID;
    sandero_id UUID;
    yaris_cross_id UUID;
    peugeot208_id UUID;
    clio_id UUID;
    creta_id UUID;
    tcross_id UUID;
    yaris_id UUID;
    bmw_x3_id UUID;
    glc_id UUID;
    q5_id UUID;
    duster_id UUID;

BEGIN
    -- Récupération des IDs des modèles
    SELECT m.id INTO model_y_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Tesla' AND m.nom = 'Model Y';
    SELECT m.id INTO model_3_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Tesla' AND m.nom = 'Model 3';
    SELECT m.id INTO f150_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Ford' AND m.nom = 'F-150';
    SELECT m.id INTO rav4_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Toyota' AND m.nom = 'RAV4';
    SELECT m.id INTO crv_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Honda' AND m.nom = 'CR-V';
    SELECT m.id INTO corolla_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Toyota' AND m.nom = 'Corolla';
    SELECT m.id INTO corolla_cross_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Toyota' AND m.nom = 'Corolla Cross';
    SELECT m.id INTO camry_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Toyota' AND m.nom = 'Camry';
    SELECT m.id INTO hilux_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Toyota' AND m.nom = 'Hilux';
    SELECT m.id INTO sentra_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Nissan' AND m.nom = 'Sentra';
    SELECT m.id INTO civic_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Honda' AND m.nom = 'Civic';
    SELECT m.id INTO qin_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'BYD' AND m.nom = 'Qin';
    SELECT m.id INTO xtrail_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Nissan' AND m.nom = 'X-Trail';
    SELECT m.id INTO accord_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Honda' AND m.nom = 'Accord';
    SELECT m.id INTO tucson_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Hyundai' AND m.nom = 'Tucson';
    SELECT m.id INTO cx5_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Mazda' AND m.nom = 'CX-5';
    SELECT m.id INTO polo_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Volkswagen' AND m.nom = 'Polo';
    SELECT m.id INTO jetta_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Volkswagen' AND m.nom = 'Jetta';
    SELECT m.id INTO swift_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Suzuki' AND m.nom = 'Swift';
    SELECT m.id INTO hrv_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Honda' AND m.nom = 'HR-V';
    SELECT m.id INTO seltos_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Kia' AND m.nom = 'Seltos';
    SELECT m.id INTO qashqai_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Nissan' AND m.nom = 'Qashqai';
    SELECT m.id INTO sportage_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Kia' AND m.nom = 'Sportage';
    SELECT m.id INTO tiguan_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Volkswagen' AND m.nom = 'Tiguan';
    SELECT m.id INTO sandero_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Dacia' AND m.nom = 'Sandero';
    SELECT m.id INTO yaris_cross_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Toyota' AND m.nom = 'Yaris Cross';
    SELECT m.id INTO peugeot208_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Peugeot' AND m.nom = '208';
    SELECT m.id INTO clio_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Renault' AND m.nom = 'Clio';
    SELECT m.id INTO creta_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Hyundai' AND m.nom = 'Creta';
    SELECT m.id INTO tcross_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Volkswagen' AND m.nom = 'T-Cross';
    SELECT m.id INTO yaris_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Toyota' AND m.nom = 'Yaris';
    SELECT m.id INTO bmw_x3_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'BMW' AND m.nom = 'X3';
    SELECT m.id INTO glc_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Mercedes-Benz' AND m.nom = 'GLC';
    SELECT m.id INTO q5_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Audi' AND m.nom = 'Q5';
    SELECT m.id INTO duster_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Dacia' AND m.nom = 'Duster';

    -- Insertion des véhicules populaires avec spécifications adaptées à la structure existante

    -- Tesla Model Y 2024 (Véhicule électrique le plus vendu)
    IF model_y_id IS NOT NULL THEN
        INSERT INTO vehicles (
            brand_id, model_id, annee, couleur, prix, kilometrage, carburant, transmission,
            description, statut, puissance, cylindree, consommation, emissions,
            nombre_portes, nombre_places, coffre
        ) VALUES (
            (SELECT brand_id FROM models WHERE id = model_y_id), model_y_id, 
            2024, 'Blanc Nacré', NULL, 0, 'Électrique', 'Automatique',
            'SUV électrique premium avec technologie Tesla avancée',
            'À venir',
            '299 ch', 'Électrique', '0 L/100km', '0 g/km CO2',
            5, 5, '854L'
        );
    END IF;

    -- Toyota RAV4 2024 (SUV compact le plus populaire)
    IF rav4_id IS NOT NULL THEN
        INSERT INTO vehicles (
            brand_id, model_id, annee, couleur, prix, kilometrage, carburant, transmission,
            description, statut, puissance, cylindree, consommation, emissions,
            nombre_portes, nombre_places, coffre
        ) VALUES (
            (SELECT brand_id FROM models WHERE id = rav4_id), rav4_id,
            2024, 'Gris Métallisé', NULL, 0, 'Essence', 'Automatique',
            'SUV compact fiable avec traction intégrale',
            'À venir',
            '203 ch', '2.5L', '7.8L/100km', '178 g/km CO2',
            5, 5, '580L'
        );
    END IF;

    -- Honda CR-V 2024 (SUV familial populaire)
    IF crv_id IS NOT NULL THEN
        INSERT INTO vehicles (
            brand_id, model_id, annee, couleur, prix, kilometrage, carburant, transmission,
            description, statut, puissance, cylindree, consommation, emissions,
            nombre_portes, nombre_places, coffre
        ) VALUES (
            (SELECT brand_id FROM models WHERE id = crv_id), crv_id,
            2024, 'Noir Cristal', NULL, 0, 'Essence', 'Automatique',
            'SUV compact spacieux et économique',
            'À venir',
            '190 ch', '1.5L Turbo', '7.1L/100km', '162 g/km CO2',
            5, 5, '589L'
        );
    END IF;

    -- Toyota Corolla 2024 (Berline compacte de référence)
    IF corolla_id IS NOT NULL THEN
        INSERT INTO vehicles (
            brand_id, model_id, annee, couleur, prix, kilometrage, carburant, transmission,
            description, statut, puissance, cylindree, consommation, emissions,
            nombre_portes, nombre_places, coffre
        ) VALUES (
            (SELECT brand_id FROM models WHERE id = corolla_id), corolla_id,
            2024, 'Blanc Pur', NULL, 0, 'Essence', 'Automatique',
            'Berline compacte fiable et économique',
            'À venir',
            '169 ch', '2.0L', '6.8L/100km', '154 g/km CO2',
            4, 5, '470L'
        );
    END IF;

    -- Ford F-150 2024 (Pick-up le plus vendu)
    IF f150_id IS NOT NULL THEN
        INSERT INTO vehicles (
            brand_id, model_id, annee, couleur, prix, kilometrage, carburant, transmission,
            description, statut, puissance, cylindree, consommation, emissions,
            nombre_portes, nombre_places, coffre
        ) VALUES (
            (SELECT brand_id FROM models WHERE id = f150_id), f150_id,
            2024, 'Bleu Oxford', NULL, 0, 'Essence', 'Automatique',
            'Pick-up pleine grandeur le plus populaire d''Amérique',
            'À venir',
            '400 ch', '3.5L V6 Turbo', '11.2L/100km', '255 g/km CO2',
            4, 6, 'Benne 1500L'
        );
    END IF;

    -- Tesla Model 3 2024 (Berline électrique premium)
    IF model_3_id IS NOT NULL THEN
        INSERT INTO vehicles (
            brand_id, model_id, annee, couleur, prix, kilometrage, carburant, transmission,
            description, statut, puissance, cylindree, consommation, emissions,
            nombre_portes, nombre_places, coffre
        ) VALUES (
            (SELECT brand_id FROM models WHERE id = model_3_id), model_3_id,
            2024, 'Rouge Multi-Couches', NULL, 0, 'Électrique', 'Automatique',
            'Berline électrique sportive et technologique',
            'À venir',
            '283 ch', 'Électrique', '0 L/100km', '0 g/km CO2',
            4, 5, '682L'
        );
    END IF;

    -- BYD Qin 2024 (Hybride rechargeable populaire)
    IF qin_id IS NOT NULL THEN
        INSERT INTO vehicles (
            brand_id, model_id, annee, couleur, prix, kilometrage, carburant, transmission,
            description, statut, puissance, cylindree, consommation, emissions,
            nombre_portes, nombre_places, coffre
        ) VALUES (
            (SELECT brand_id FROM models WHERE id = qin_id), qin_id,
            2024, 'Argent Métallisé', NULL, 0, 'Hybride', 'Automatique',
            'Berline hybride rechargeable économique',
            'À venir',
            '218 ch', '1.5L + Électrique', '3.8L/100km', '84 g/km CO2',
            4, 5, '450L'
        );
    END IF;

    -- Volkswagen Polo 2024 (Citadine premium)
    IF polo_id IS NOT NULL THEN
        INSERT INTO vehicles (
            brand_id, model_id, annee, couleur, prix, kilometrage, carburant, transmission,
            description, statut, puissance, cylindree, consommation, emissions,
            nombre_portes, nombre_places, coffre
        ) VALUES (
            (SELECT brand_id FROM models WHERE id = polo_id), polo_id,
            2024, 'Blanc Candy', NULL, 0, 'Essence', 'Manuelle',
            'Citadine premium allemande',
            'À venir',
            '95 ch', '1.0L Turbo', '5.4L/100km', '123 g/km CO2',
            5, 5, '351L'
        );
    END IF;

    -- Honda Civic 2024 (Berline compacte sportive)
    IF civic_id IS NOT NULL THEN
        INSERT INTO vehicles (
            brand_id, model_id, annee, couleur, prix, kilometrage, carburant, transmission,
            description, statut, puissance, cylindree, consommation, emissions,
            nombre_portes, nombre_places, coffre
        ) VALUES (
            (SELECT brand_id FROM models WHERE id = civic_id), civic_id,
            2024, 'Gris Sonic', NULL, 0, 'Essence', 'Automatique',
            'Berline compacte sportive et technologique',
            'À venir',
            '180 ch', '1.5L Turbo', '7.0L/100km', '159 g/km CO2',
            4, 5, '519L'
        );
    END IF;

    -- Hyundai Tucson 2024 (SUV compact familial)
    IF tucson_id IS NOT NULL THEN
        INSERT INTO vehicles (
            brand_id, model_id, annee, couleur, prix, kilometrage, carburant, transmission,
            description, statut, puissance, cylindree, consommation, emissions,
            nombre_portes, nombre_places, coffre
        ) VALUES (
            (SELECT brand_id FROM models WHERE id = tucson_id), tucson_id,
            2024, 'Bleu Intense', NULL, 0, 'Essence', 'Automatique',
            'SUV compact familial avec design moderne',
            'À venir',
            '187 ch', '1.6L Turbo', '7.5L/100km', '171 g/km CO2',
            5, 5, '620L'
        );
    END IF;

END $$;

-- ===============================================
-- VÉRIFICATIONS
-- ===============================================

-- Compter les véhicules ajoutés
SELECT 
    'Véhicules totaux' as type, 
    COUNT(*) as nombre 
FROM vehicles;

-- Statistiques par marque
SELECT 
    b.nom as marque,
    COUNT(v.id) as nombre_vehicules
FROM brands b
LEFT JOIN vehicles v ON b.id = v.brand_id
GROUP BY b.nom, b.id
HAVING COUNT(v.id) > 0
ORDER BY nombre_vehicules DESC, b.nom;

-- Statistiques par carburant
SELECT 
    v.carburant,
    COUNT(*) as nombre_vehicules
FROM vehicles v
GROUP BY v.carburant
ORDER BY nombre_vehicules DESC;

-- Message de confirmation
SELECT 
    '✅ VÉHICULES POPULAIRES AJOUTÉS AVEC SUCCÈS !' as message,
    'Structure de base respectée - Prix masqués selon stratégie TSE' as description,
    'Catalogue enrichi et prêt pour utilisation' as statut;
