-- Données de démonstration pour TSE Catalogue
-- Version: 1.0
-- Date: 6 janvier 2025

-- Insertion des marques
INSERT INTO brands (id, nom, description) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Toyota', 'Constructeur automobile japonais réputé pour sa fiabilité'),
('550e8400-e29b-41d4-a716-446655440002', 'Ford', 'Constructeur automobile américain, pionnier de l''industrie automobile'),
('550e8400-e29b-41d4-a716-446655440003', 'Nissan', 'Constructeur automobile japonais, innovateur en technologies automobiles');

-- Insertion des modèles
INSERT INTO models (id, nom, brand_id, description) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Corolla Cross', '550e8400-e29b-41d4-a716-446655440001', 'SUV compact hybride'),
('660e8400-e29b-41d4-a716-446655440002', 'Territory', '550e8400-e29b-41d4-a716-446655440002', 'SUV familial spacieux'),
('660e8400-e29b-41d4-a716-446655440003', 'Hilux', '550e8400-e29b-41d4-a716-446655440001', 'Pick-up robuste et fiable'),
('660e8400-e29b-41d4-a716-446655440004', 'Qashqai', '550e8400-e29b-41d4-a716-446655440003', 'SUV urbain élégant');

-- Insertion des équipements
INSERT INTO equipments (id, nom, categorie) VALUES
-- Confort
('770e8400-e29b-41d4-a716-446655440001', 'Climatisation automatique', 'Confort'),
('770e8400-e29b-41d4-a716-446655440002', 'Climatisation tri-zone', 'Confort'),
('770e8400-e29b-41d4-a716-446655440003', 'Sièges en cuir', 'Confort'),
('770e8400-e29b-41d4-a716-446655440004', 'Toit panoramique', 'Confort'),
('770e8400-e29b-41d4-a716-446655440005', 'Régulateur de vitesse', 'Confort'),
('770e8400-e29b-41d4-a716-446655440006', 'Régulateur de vitesse adaptatif', 'Confort'),

-- Technologie
('770e8400-e29b-41d4-a716-446655440007', 'GPS intégré', 'Technologie'),
('770e8400-e29b-41d4-a716-446655440008', 'Écran tactile 10"', 'Technologie'),
('770e8400-e29b-41d4-a716-446655440009', 'Écran tactile 12.3"', 'Technologie'),
('770e8400-e29b-41d4-a716-446655440010', 'Bluetooth', 'Technologie'),
('770e8400-e29b-41d4-a716-446655440011', 'Système audio Bose', 'Technologie'),
('770e8400-e29b-41d4-a716-446655440012', 'Système audio premium', 'Technologie'),

-- Sécurité
('770e8400-e29b-41d4-a716-446655440013', 'Caméra de recul', 'Sécurité'),
('770e8400-e29b-41d4-a716-446655440014', 'Caméra 360°', 'Sécurité'),
('770e8400-e29b-41d4-a716-446655440015', 'Système Toyota Safety Sense', 'Sécurité'),
('770e8400-e29b-41d4-a716-446655440016', 'Ford Co-Pilot360', 'Sécurité'),
('770e8400-e29b-41d4-a716-446655440017', 'ProPILOT (conduite semi-autonome)', 'Sécurité'),
('770e8400-e29b-41d4-a716-446655440018', 'Aide au stationnement', 'Sécurité'),
('770e8400-e29b-41d4-a716-446655440019', 'Détection d''angle mort', 'Sécurité'),
('770e8400-e29b-41d4-a716-446655440020', 'Freinage d''urgence intelligent', 'Sécurité'),

-- Extérieur
('770e8400-e29b-41d4-a716-446655440021', 'Jantes alliage 17"', 'Extérieur'),
('770e8400-e29b-41d4-a716-446655440022', 'Jantes alliage 19"', 'Extérieur'),
('770e8400-e29b-41d4-a716-446655440023', 'Éclairage LED', 'Extérieur'),

-- Utilitaire
('770e8400-e29b-41d4-a716-446655440024', 'Transmission 4x4', 'Utilitaire'),
('770e8400-e29b-41d4-a716-446655440025', 'Barre de charge', 'Utilitaire'),
('770e8400-e29b-41d4-a716-446655440026', 'Crochet d''attelage 3500kg', 'Utilitaire'),
('770e8400-e29b-41d4-a716-446655440027', 'Différentiel arrière verrouillable', 'Utilitaire'),
('770e8400-e29b-41d4-a716-446655440028', 'Plaques de protection', 'Utilitaire'),
('770e8400-e29b-41d4-a716-446655440029', 'Système de descente assistée', 'Utilitaire'),
('770e8400-e29b-41d4-a716-446655440030', 'Pneus tout-terrain', 'Utilitaire');

-- Insertion des véhicules
INSERT INTO vehicles (
    id, brand_id, model_id, annee, couleur, prix, kilometrage, carburant, transmission,
    description, statut, puissance, cylindree, consommation, emissions, 
    nombre_portes, nombre_places, coffre, created_at, updated_at
) VALUES
-- Toyota Corolla Cross 2023
(
    '880e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440001',
    2023, 'Blanc', 28500.00, 15000, 'Hybride', 'Automatique',
    'SUV compact hybride, parfait pour la ville et les longs trajets. Alliant efficacité énergétique et polyvalence, ce véhicule offre un excellent compromis entre performance et économie.',
    'Disponible', '122 ch', '1.8L', '4.5L/100km', '102 g/km CO2',
    5, 5, '487L', '2024-01-15 10:00:00+00', '2024-01-15 10:00:00+00'
),
-- Ford Territory 2022
(
    '880e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440002',
    '660e8400-e29b-41d4-a716-446655440002',
    2022, 'Gris', 32000.00, 25000, 'Essence', 'Automatique',
    'SUV spacieux et confortable pour toute la famille. Doté de technologies avancées et d''un habitacle généreux, il répond aux besoins des familles modernes.',
    'Disponible', '143 ch', '1.5L', '7.2L/100km', '165 g/km CO2',
    5, 7, '448L', '2024-01-10 09:00:00+00', '2024-01-10 09:00:00+00'
),
-- Toyota Hilux 2023
(
    '880e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440003',
    2023, 'Noir', 45000.00, 8000, 'Diesel', 'Manuelle',
    'Pick-up robuste et fiable pour tous vos besoins professionnels. Reconnu pour sa durabilité exceptionnelle et ses capacités tout-terrain.',
    'Disponible', '204 ch', '2.8L', '8.1L/100km', '213 g/km CO2',
    4, 5, '1085L', '2024-01-05 08:00:00+00', '2024-01-05 08:00:00+00'
),
-- Nissan Qashqai 2023
(
    '880e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440003',
    '660e8400-e29b-41d4-a716-446655440004',
    2023, 'Rouge', 35000.00, 12000, 'Essence', 'Automatique',
    'SUV urbain élégant et technologique. Pionnier du segment des crossovers, il combine style, confort et technologies de pointe.',
    'Réservé', '158 ch', '1.3L', '6.8L/100km', '155 g/km CO2',
    5, 5, '504L', '2024-01-12 11:00:00+00', '2024-01-12 11:00:00+00'
);

-- Insertion des équipements pour chaque véhicule
-- Toyota Corolla Cross 2023
INSERT INTO vehicle_equipments (vehicle_id, equipment_id) VALUES
('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001'), -- Climatisation automatique
('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440007'), -- GPS intégré
('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440013'), -- Caméra de recul
('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440010'), -- Bluetooth
('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440015'), -- Système Toyota Safety Sense
('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440021'), -- Jantes alliage 17"
('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440023'), -- Éclairage LED
('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440006'); -- Régulateur de vitesse adaptatif

-- Ford Territory 2022
INSERT INTO vehicle_equipments (vehicle_id, equipment_id) VALUES
('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002'), -- Climatisation tri-zone
('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440008'), -- Écran tactile 10"
('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440018'), -- Aide au stationnement
('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440005'), -- Régulateur de vitesse
('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440016'), -- Ford Co-Pilot360
('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440003'), -- Sièges en cuir
('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440004'), -- Toit panoramique
('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440012'); -- Système audio premium

-- Toyota Hilux 2023
INSERT INTO vehicle_equipments (vehicle_id, equipment_id) VALUES
('880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440024'), -- Transmission 4x4
('880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440025'), -- Barre de charge
('880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440026'), -- Crochet d'attelage 3500kg
('880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001'), -- Climatisation
('880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440027'), -- Différentiel arrière verrouillable
('880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440028'), -- Plaques de protection
('880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440029'), -- Système de descente assistée
('880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440030'); -- Pneus tout-terrain

-- Nissan Qashqai 2023
INSERT INTO vehicle_equipments (vehicle_id, equipment_id) VALUES
('880e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440017'), -- ProPILOT (conduite semi-autonome)
('880e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440009'), -- Écran tactile 12.3"
('880e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440004'), -- Toit panoramique
('880e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440022'), -- Jantes alliage 19"
('880e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440011'), -- Système audio Bose
('880e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440014'), -- Caméra 360°
('880e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440019'), -- Détection d'angle mort
('880e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440020'); -- Freinage d'urgence intelligent

-- Insertion des documents (fiches techniques)
INSERT INTO vehicle_documents (id, vehicle_id, nom, type_document, url, mime_type) VALUES
('990e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'Fiche technique Corolla Cross 2023', 'fiche_technique', '/documents/corolla-cross-fiche.pdf', 'application/pdf'),
('990e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', 'Fiche technique Territory 2022', 'fiche_technique', '/documents/territory-fiche.pdf', 'application/pdf'),
('990e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440003', 'Fiche technique Hilux 2023', 'fiche_technique', '/documents/hilux-fiche.pdf', 'application/pdf'),
('990e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440004', 'Fiche technique Qashqai 2023', 'fiche_technique', '/documents/qashqai-fiche.pdf', 'application/pdf');

-- Insertion d'un utilisateur administrateur de démonstration
INSERT INTO admin_users (id, email, nom, prenom, role) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', 'admin@tse.com', 'Admin', 'TSE', 'super_admin');
