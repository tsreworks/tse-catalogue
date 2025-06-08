-- Données d'exemple simplifiées pour TSE Catalogue - Marché Ivoirien
-- Prix en Francs CFA - Version simplifiée
-- Version: 1.0
-- Date: 6 janvier 2025

-- Insertion des marques populaires en Côte d'Ivoire (version simple)
INSERT INTO brands (nom, description) VALUES
('Toyota', 'Marque japonaise réputée pour sa fiabilité et sa durabilité'),
('Nissan', 'Constructeur japonais innovant, leader en technologie automobile'),
('Hyundai', 'Marque coréenne offrant un excellent rapport qualité-prix'),
('Kia', 'Constructeur coréen moderne avec garantie étendue'),
('Peugeot', 'Marque française élégante et technologique'),
('Renault', 'Constructeur français populaire en Afrique');

-- Insertion des modèles populaires (version simple)
INSERT INTO models (nom, brand_id, description) VALUES
-- Toyota
('Corolla', (SELECT id FROM brands WHERE nom = 'Toyota'), 'Berline compacte fiable et économique'),
('Camry', (SELECT id FROM brands WHERE nom = 'Toyota'), 'Berline familiale spacieuse et confortable'),
('RAV4', (SELECT id FROM brands WHERE nom = 'Toyota'), 'SUV compact polyvalent'),
('Hilux', (SELECT id FROM brands WHERE nom = 'Toyota'), 'Pick-up robuste et tout-terrain'),

-- Nissan
('Sentra', (SELECT id FROM brands WHERE nom = 'Nissan'), 'Berline moderne et élégante'),
('X-Trail', (SELECT id FROM brands WHERE nom = 'Nissan'), 'SUV familial spacieux'),

-- Hyundai
('Elantra', (SELECT id FROM brands WHERE nom = 'Hyundai'), 'Berline élégante avec garantie étendue'),
('Tucson', (SELECT id FROM brands WHERE nom = 'Hyundai'), 'SUV moderne et bien équipé'),

-- Kia
('Cerato', (SELECT id FROM brands WHERE nom = 'Kia'), 'Berline sportive et moderne'),
('Sportage', (SELECT id FROM brands WHERE nom = 'Kia'), 'SUV compact stylé'),

-- Peugeot
('208', (SELECT id FROM brands WHERE nom = 'Peugeot'), 'Citadine française élégante'),
('308', (SELECT id FROM brands WHERE nom = 'Peugeot'), 'Berline compacte technologique'),

-- Renault
('Logan', (SELECT id FROM brands WHERE nom = 'Renault'), 'Berline économique et spacieuse'),
('Duster', (SELECT id FROM brands WHERE nom = 'Renault'), 'SUV robuste et abordable');

-- Insertion des équipements de base
INSERT INTO equipments (nom, description, categorie) VALUES
-- Confort
('Climatisation', 'Système de climatisation automatique', 'Confort'),
('Sièges en cuir', 'Sellerie cuir véritable', 'Confort'),
('Régulateur de vitesse', 'Régulateur et limiteur de vitesse', 'Confort'),

-- Sécurité
('ABS', 'Système antiblocage des roues', 'Sécurité'),
('ESP', 'Contrôle électronique de stabilité', 'Sécurité'),
('Airbags frontaux', 'Airbags conducteur et passager', 'Sécurité'),
('Caméra de recul', 'Caméra d''aide au stationnement', 'Sécurité'),

-- Technologie
('GPS intégré', 'Système de navigation GPS', 'Technologie'),
('Bluetooth', 'Connectivité Bluetooth mains libres', 'Technologie'),
('USB/AUX', 'Prises USB et auxiliaire', 'Technologie'),

-- Extérieur
('Jantes alliage', 'Jantes en alliage léger', 'Extérieur'),
('Phares LED', 'Éclairage LED avant', 'Extérieur');

-- Insertion des véhicules d'exemple avec prix réalistes en CFA
INSERT INTO vehicles (brand_id, model_id, annee, couleur, prix, kilometrage, carburant, transmission, description, statut) VALUES
-- Toyota (marque très populaire en CI)
((SELECT id FROM brands WHERE nom = 'Toyota'), (SELECT id FROM models WHERE nom = 'Corolla'), 2022, 'Blanc', 15000000, 15000, 'Essence', 'Automatique', 'Toyota Corolla 2022 en excellent état, entretien régulier, un seul propriétaire. Véhicule très fiable.', 'Disponible'),
((SELECT id FROM brands WHERE nom = 'Toyota'), (SELECT id FROM models WHERE nom = 'Corolla'), 2021, 'Gris', 13500000, 25000, 'Essence', 'Manuelle', 'Toyota Corolla 2021, très économique, parfaite pour la ville et les longs trajets.', 'Disponible'),
((SELECT id FROM brands WHERE nom = 'Toyota'), (SELECT id FROM models WHERE nom = 'Camry'), 2023, 'Noir', 22000000, 8000, 'Essence', 'Automatique', 'Toyota Camry 2023, berline haut de gamme, tout équipée, garantie constructeur.', 'Disponible'),
((SELECT id FROM brands WHERE nom = 'Toyota'), (SELECT id FROM models WHERE nom = 'RAV4'), 2022, 'Rouge', 28000000, 18000, 'Essence', 'Automatique', 'Toyota RAV4 2022, SUV familial, 4x4, parfait pour tous terrains.', 'Réservé'),
((SELECT id FROM brands WHERE nom = 'Toyota'), (SELECT id FROM models WHERE nom = 'Hilux'), 2021, 'Blanc', 32000000, 35000, 'Diesel', 'Manuelle', 'Toyota Hilux 2021, pick-up double cabine, très robuste, idéal professionnel.', 'Disponible'),

-- Nissan
((SELECT id FROM brands WHERE nom = 'Nissan'), (SELECT id FROM models WHERE nom = 'Sentra'), 2022, 'Argent', 14000000, 12000, 'Essence', 'Automatique', 'Nissan Sentra 2022, berline moderne, économique et confortable.', 'Disponible'),
((SELECT id FROM brands WHERE nom = 'Nissan'), (SELECT id FROM models WHERE nom = 'X-Trail'), 2021, 'Bleu', 25000000, 22000, 'Essence', 'Automatique', 'Nissan X-Trail 2021, SUV 7 places, parfait pour les familles.', 'Disponible'),

-- Hyundai
((SELECT id FROM brands WHERE nom = 'Hyundai'), (SELECT id FROM models WHERE nom = 'Elantra'), 2023, 'Blanc', 16000000, 5000, 'Essence', 'Automatique', 'Hyundai Elantra 2023, berline neuve, garantie 5 ans, très bien équipée.', 'Disponible'),
((SELECT id FROM brands WHERE nom = 'Hyundai'), (SELECT id FROM models WHERE nom = 'Tucson'), 2022, 'Gris', 24000000, 15000, 'Essence', 'Automatique', 'Hyundai Tucson 2022, SUV moderne, technologie avancée.', 'Disponible'),

-- Kia
((SELECT id FROM brands WHERE nom = 'Kia'), (SELECT id FROM models WHERE nom = 'Cerato'), 2022, 'Noir', 15500000, 10000, 'Essence', 'Automatique', 'Kia Cerato 2022, berline sportive, garantie 7 ans.', 'Disponible'),
((SELECT id FROM brands WHERE nom = 'Kia'), (SELECT id FROM models WHERE nom = 'Sportage'), 2021, 'Blanc', 23000000, 20000, 'Essence', 'Automatique', 'Kia Sportage 2021, SUV élégant et bien équipé.', 'Disponible'),

-- Peugeot
((SELECT id FROM brands WHERE nom = 'Peugeot'), (SELECT id FROM models WHERE nom = '208'), 2022, 'Bleu', 12000000, 18000, 'Essence', 'Manuelle', 'Peugeot 208 2022, citadine française, design moderne.', 'Disponible'),
((SELECT id FROM brands WHERE nom = 'Peugeot'), (SELECT id FROM models WHERE nom = '308'), 2021, 'Gris', 16500000, 25000, 'Essence', 'Automatique', 'Peugeot 308 2021, berline compacte, technologie française.', 'Vendu'),

-- Renault
((SELECT id FROM brands WHERE nom = 'Renault'), (SELECT id FROM models WHERE nom = 'Logan'), 2022, 'Blanc', 11000000, 15000, 'Essence', 'Manuelle', 'Renault Logan 2022, berline économique, très spacieuse.', 'Disponible'),
((SELECT id FROM brands WHERE nom = 'Renault'), (SELECT id FROM models WHERE nom = 'Duster'), 2021, 'Marron', 18000000, 30000, 'Essence', 'Manuelle', 'Renault Duster 2021, SUV robuste, excellent rapport qualité-prix.', 'Disponible');

-- Message de confirmation
SELECT 'Données d''exemple simplifiées insérées avec succès - Prix en Francs CFA pour le marché ivoirien' as message;
