-- ===============================================
-- ENRICHISSEMENT VÉHICULES - SPÉCIFICATIONS TECHNIQUES
-- Version: 1.0
-- Date: 6 janvier 2025
-- Objectif: Ajouter les véhicules avec spécifications complètes
-- ===============================================

-- ===============================================
-- 3. INSERTION DES VÉHICULES AVEC SPÉCIFICATIONS COMPLÈTES
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
    silverado_id UUID;
    elantra_id UUID;
    ram1500_id UUID;
    song_plus_id UUID;
    polo_id UUID;
    jetta_id UUID;
    cx5_id UUID;
    yuan_plus_id UUID;
    swift_id UUID;
    hrv_id UUID;
    highlander_id UUID;
    ranger_id UUID;
    seltos_id UUID;
    escape_id UUID;
    qashqai_id UUID;
    sportage_id UUID;
    lavida_id UUID;
    tiguan_id UUID;
    dolphin_id UUID;
    troc_id UUID;
    sandero_id UUID;
    yaris_cross_id UUID;
    peugeot208_id UUID;
    clio_id UUID;
    creta_id UUID;
    tcross_id UUID;
    yaris_id UUID;
    transit_id UUID;
    bmw_x3_id UUID;
    dmax_id UUID;
    h6_id UUID;
    q5_id UUID;
    yaris_sedan_id UUID;
    kona_id UUID;
    tiba_id UUID;
    tacoma_id UUID;
    cs75_id UUID;
    bmw_3_id UUID;
    santa_fe_id UUID;
    duster_id UUID;
    c_class_id UUID;
    equinox_id UUID;
    sierra_id UUID;
    sorento_id UUID;
    bmw_x5_id UUID;
    crosstrek_id UUID;
    glc_id UUID;
    hongguang_id UUID;
    explorer_id UUID;
    e_class_id UUID;
    n_box_id UUID;
    golf_id UUID;
    altima_id UUID;
    forester_id UUID;
    bmw_x1_id UUID;
    tucson_ewb_id UUID;
    bmw_5_id UUID;
    xc60_id UUID;
    compass_id UUID;
    baleno_id UUID;
    seagull_id UUID;
    corsa_id UUID;
    taos_id UUID;
    kicks_id UUID;
    venue_id UUID;
    aion_s_id UUID;
    audi_a6_id UUID;
    han_id UUID;
    lexus_rx_id UUID;
    lexus_nx_id UUID;
    peugeot2008_id UUID;
    outback_id UUID;
    aion_y_id UUID;
    sienna_id UUID;
    wagon_r_id UUID;
    wrangler_id UUID;
    sprinter_id UUID;
    cx30_id UUID;
    passat_id UUID;
    tiggo8_id UUID;
    zrv_id UUID;
    xc40_id UUID;
    versa_id UUID;
    id4_id UUID;
    dzire_id UUID;

BEGIN
    -- Récupération des IDs des modèles
    SELECT id INTO model_y_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Tesla' AND m.nom = 'Model Y';
    SELECT id INTO model_3_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Tesla' AND m.nom = 'Model 3';
    SELECT id INTO f150_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Ford' AND m.nom = 'F-150';
    SELECT id INTO rav4_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Toyota' AND m.nom = 'RAV4';
    SELECT id INTO crv_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Honda' AND m.nom = 'CR-V';
    SELECT id INTO corolla_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Toyota' AND m.nom = 'Corolla';
    SELECT id INTO corolla_cross_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Toyota' AND m.nom = 'Corolla Cross';
    SELECT id INTO camry_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Toyota' AND m.nom = 'Camry';
    SELECT id INTO hilux_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Toyota' AND m.nom = 'Hilux';
    SELECT id INTO sentra_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Nissan' AND m.nom = 'Sentra';
    SELECT id INTO civic_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Honda' AND m.nom = 'Civic';
    SELECT id INTO qin_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'BYD' AND m.nom = 'Qin';
    SELECT id INTO xtrail_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Nissan' AND m.nom = 'X-Trail';
    SELECT id INTO accord_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Honda' AND m.nom = 'Accord';
    SELECT id INTO tucson_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Hyundai' AND m.nom = 'Tucson';
    SELECT id INTO silverado_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Chevrolet' AND m.nom = 'Silverado 1500';
    SELECT id INTO elantra_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Hyundai' AND m.nom = 'Elantra';
    SELECT id INTO ram1500_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Ram' AND m.nom = '1500';
    SELECT id INTO song_plus_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'BYD' AND m.nom = 'Song Plus';
    SELECT id INTO polo_id FROM models m JOIN brands b ON m.brand_id = b.id WHERE b.nom = 'Volkswagen' AND m.nom = 'Polo';

    -- Insertion des véhicules avec spécifications complètes
    
    -- Tesla Model Y 2024 (Véhicule électrique le plus vendu)
    INSERT INTO vehicles (
        model_id, annee, couleur, prix, kilometrage, carburant, transmission, 
        description, statut, puissance_cv, couple_nm, cylindree_l, consommation_l100km, 
        emissions_co2_gkm, longueur_mm, largeur_mm, hauteur_mm, empattement_mm, 
        coffre_l, reservoir_l, nombre_places, equipements, type_moteur, 
        vitesse_max_kmh, acceleration_0_100_kmh, autonomie_km
    ) VALUES (
        model_y_id, 2024, 'Blanc Nacré', NULL, 0, 'Électrique', 'Automatique',
        'SUV électrique premium avec technologie Tesla avancée',
        'En cours d''importation',
        299, 420, 0, 0, 0, 4751, 1921, 1624, 2890, 854, 0, 5,
        ARRAY['Autopilot', 'Écran tactile 15"', 'Toit panoramique', 'Supercharger', 'Mise à jour OTA', 'Caméras 360°'],
        'Électrique',
        217, 6.9, 533
    );

    -- Toyota RAV4 2024 (SUV compact le plus populaire)
    INSERT INTO vehicles (
        model_id, annee, couleur, prix, kilometrage, carburant, transmission,
        description, statut, puissance_cv, couple_nm, cylindree_l, consommation_l100km,
        emissions_co2_gkm, longueur_mm, largeur_mm, hauteur_mm, empattement_mm,
        coffre_l, reservoir_l, nombre_places, equipements, type_moteur,
        vitesse_max_kmh, acceleration_0_100_kmh
    ) VALUES (
        rav4_id, 2024, 'Gris Métallisé', NULL, 0, 'Essence', 'CVT',
        'SUV compact fiable avec traction intégrale',
        'À venir',
        203, 243, 2.5, 7.8, 178, 4600, 1855, 1685, 2690, 580, 55, 5,
        ARRAY['Toyota Safety Sense 2.0', 'Écran tactile 8"', 'Climatisation auto', 'Caméra de recul', 'AWD', 'Régulateur adaptatif'],
        'Essence atmosphérique',
        180, 8.4
    );

    -- Honda CR-V 2024 (SUV familial populaire)
    INSERT INTO vehicles (
        model_id, annee, couleur, prix, kilometrage, carburant, transmission,
        description, statut, puissance_cv, couple_nm, cylindree_l, consommation_l100km,
        emissions_co2_gkm, longueur_mm, largeur_mm, hauteur_mm, empattement_mm,
        coffre_l, reservoir_l, nombre_places, equipements, type_moteur,
        vitesse_max_kmh, acceleration_0_100_kmh
    ) VALUES (
        crv_id, 2024, 'Noir Cristal', NULL, 0, 'Essence', 'CVT',
        'SUV compact spacieux et économique',
        'À venir',
        190, 243, 1.5, 7.1, 162, 4621, 1855, 1679, 2661, 589, 57, 5,
        ARRAY['Honda Sensing', 'Écran tactile 9"', 'Climatisation bi-zone', 'Toit ouvrant', 'Caméra multi-angles', 'Démarrage sans clé'],
        'Turbo essence',
        190, 9.7
    );

    -- Toyota Corolla 2024 (Berline compacte de référence)
    INSERT INTO vehicles (
        model_id, annee, couleur, prix, kilometrage, carburant, transmission,
        description, statut, puissance_cv, couple_nm, cylindree_l, consommation_l100km,
        emissions_co2_gkm, longueur_mm, largeur_mm, hauteur_mm, empattement_mm,
        coffre_l, reservoir_l, nombre_places, equipements, type_moteur,
        vitesse_max_kmh, acceleration_0_100_kmh
    ) VALUES (
        corolla_id, 2024, 'Blanc Pur', NULL, 0, 'Essence', 'CVT',
        'Berline compacte fiable et économique',
        'À venir',
        169, 203, 2.0, 6.8, 154, 4630, 1780, 1435, 2700, 470, 50, 5,
        ARRAY['Toyota Safety Sense 2.0', 'Écran tactile 8"', 'Climatisation auto', 'Régulateur de vitesse', 'Bluetooth', 'USB multiple'],
        'Essence atmosphérique',
        180, 10.2
    );

    -- Ford F-150 2024 (Pick-up le plus vendu)
    INSERT INTO vehicles (
        model_id, annee, couleur, prix, kilometrage, carburant, transmission,
        description, statut, puissance_cv, couple_nm, cylindree_l, consommation_l100km,
        emissions_co2_gkm, longueur_mm, largeur_mm, hauteur_mm, empattement_mm,
        coffre_l, reservoir_l, nombre_places, equipements, type_moteur,
        vitesse_max_kmh, acceleration_0_100_kmh, capacite_remorquage_kg
    ) VALUES (
        f150_id, 2024, 'Bleu Oxford', NULL, 0, 'Essence', 'Automatique 10 vitesses',
        'Pick-up pleine grandeur le plus populaire d''Amérique',
        'À venir',
        400, 691, 3.5, 11.2, 255, 5890, 2080, 1927, 3685, 0, 98, 6,
        ARRAY['Ford Co-Pilot360', 'SYNC 4', 'Écran 12"', 'Caméra 360°', 'Remorquage intelligent', 'Prise 230V'],
        'V6 Turbo EcoBoost',
        180, 5.4, 5000
    );

    -- Tesla Model 3 2024 (Berline électrique premium)
    INSERT INTO vehicles (
        model_id, annee, couleur, prix, kilometrage, carburant, transmission,
        description, statut, puissance_cv, couple_nm, cylindree_l, consommation_l100km,
        emissions_co2_gkm, longueur_mm, largeur_mm, hauteur_mm, empattement_mm,
        coffre_l, reservoir_l, nombre_places, equipements, type_moteur,
        vitesse_max_kmh, acceleration_0_100_kmh, autonomie_km
    ) VALUES (
        model_3_id, 2024, 'Rouge Multi-Couches', NULL, 0, 'Électrique', 'Automatique',
        'Berline électrique sportive et technologique',
        'En cours d''importation',
        283, 420, 0, 0, 0, 4694, 1849, 1443, 2875, 682, 0, 5,
        ARRAY['Autopilot', 'Écran tactile 15.4"', 'Toit en verre', 'Supercharger', 'Mise à jour OTA', 'Audio premium'],
        'Électrique',
        225, 6.1, 491
    );

    -- BYD Qin Plus 2024 (Hybride rechargeable populaire)
    INSERT INTO vehicles (
        model_id, annee, couleur, prix, kilometrage, carburant, transmission,
        description, statut, puissance_cv, couple_nm, cylindree_l, consommation_l100km,
        emissions_co2_gkm, longueur_mm, largeur_mm, hauteur_mm, empattement_mm,
        coffre_l, reservoir_l, nombre_places, equipements, type_moteur,
        vitesse_max_kmh, acceleration_0_100_kmh, autonomie_electrique_km
    ) VALUES (
        qin_id, 2024, 'Argent Métallisé', NULL, 0, 'Hybride rechargeable', 'Automatique',
        'Berline hybride rechargeable économique',
        'À venir',
        218, 325, 1.5, 3.8, 84, 4765, 1837, 1515, 2718, 450, 50, 5,
        ARRAY['BYD DiLink', 'Écran rotatif 12.8"', 'Climatisation auto', 'Charge rapide', 'Mode EV', 'Caméra 360°'],
        'Hybride rechargeable',
        185, 7.3, 120
    );

    -- Volkswagen Polo 2024 (Citadine premium)
    INSERT INTO vehicles (
        model_id, annee, couleur, prix, kilometrage, carburant, transmission,
        description, statut, puissance_cv, couple_nm, cylindree_l, consommation_l100km,
        emissions_co2_gkm, longueur_mm, largeur_mm, hauteur_mm, empattement_mm,
        coffre_l, reservoir_l, nombre_places, equipements, type_moteur,
        vitesse_max_kmh, acceleration_0_100_kmh
    ) VALUES (
        polo_id, 2024, 'Blanc Candy', NULL, 0, 'Essence', 'Manuelle 5 vitesses',
        'Citadine premium allemande',
        'À venir',
        95, 175, 1.0, 5.4, 123, 4053, 1751, 1446, 2548, 351, 40, 5,
        ARRAY['Composition Media', 'Climatisation', 'Régulateur de vitesse', 'Bluetooth', 'Feux LED', 'Aide au stationnement'],
        'Turbo essence',
        188, 10.8
    );

    -- Ajout de plus de véhicules populaires...
    -- (Suite dans le prochain fichier pour respecter la limite de 300 lignes)

END $$;
