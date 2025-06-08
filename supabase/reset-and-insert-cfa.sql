-- Script de nettoyage et insertion des données CFA
-- Version: 1.0
-- Date: 6 janvier 2025

-- ÉTAPE 1: Nettoyer toutes les données existantes (dans l'ordre des dépendances)
DELETE FROM vehicle_equipments;
DELETE FROM vehicle_images;
DELETE FROM vehicle_documents;
DELETE FROM vehicles;
DELETE FROM models;
DELETE FROM brands;
DELETE FROM equipments;

-- ÉTAPE 2: Insérer les nouvelles données avec prix en CFA

-- Insertion des marques populaires en Côte d'Ivoire
INSERT INTO brands (nom, description, logo) VALUES
('Toyota', 'Marque japonaise réputée pour sa fiabilité et sa durabilité', '/images/brands/toyota.png'),
('Nissan', 'Constructeur japonais innovant, leader en technologie automobile', '/images/brands/nissan.png'),
('Hyundai', 'Marque coréenne offrant un excellent rapport qualité-prix', '/images/brands/hyundai.png'),
('Kia', 'Constructeur coréen moderne avec garantie étendue', '/images/brands/kia.png'),
('Peugeot', 'Marque française élégante et technologique', '/images/brands/peugeot.png'),
('Renault', 'Constructeur français populaire en Afrique', '/images/brands/renault.png'),
('Volkswagen', 'Marque allemande synonyme de qualité et robustesse', '/images/brands/volkswagen.png'),
('Honda', 'Constructeur japonais réputé pour ses moteurs fiables', '/images/brands/honda.png'),
('Mitsubishi', 'Marque japonaise spécialisée dans les SUV et pick-up', '/images/brands/mitsubishi.png'),
('Suzuki', 'Constructeur japonais expert en véhicules compacts', '/images/brands/suzuki.png');

-- Insertion des modèles populaires
INSERT INTO models (nom, brand_id, description) VALUES
-- Toyota
('Corolla', (SELECT id FROM brands WHERE nom = 'Toyota'), 'Berline compacte fiable et économique'),
('Camry', (SELECT id FROM brands WHERE nom = 'Toyota'), 'Berline familiale spacieuse et confortable'),
('RAV4', (SELECT id FROM brands WHERE nom = 'Toyota'), 'SUV compact polyvalent'),
('Hilux', (SELECT id FROM brands WHERE nom = 'Toyota'), 'Pick-up robuste et tout-terrain'),
('Yaris', (SELECT id FROM brands WHERE nom = 'Toyota'), 'Citadine économique et maniable'),

-- Nissan
('Sentra', (SELECT id FROM brands WHERE nom = 'Nissan'), 'Berline moderne et élégante'),
('X-Trail', (SELECT id FROM brands WHERE nom = 'Nissan'), 'SUV familial spacieux'),
('Navara', (SELECT id FROM brands WHERE nom = 'Nissan'), 'Pick-up double cabine'),
('Micra', (SELECT id FROM brands WHERE nom = 'Nissan'), 'Citadine pratique et économique'),

-- Hyundai
('Elantra', (SELECT id FROM brands WHERE nom = 'Hyundai'), 'Berline élégante avec garantie étendue'),
('Tucson', (SELECT id FROM brands WHERE nom = 'Hyundai'), 'SUV moderne et bien équipé'),
('i10', (SELECT id FROM brands WHERE nom = 'Hyundai'), 'Citadine abordable et fiable'),
('Santa Fe', (SELECT id FROM brands WHERE nom = 'Hyundai'), 'SUV 7 places familial'),

-- Kia
('Cerato', (SELECT id FROM brands WHERE nom = 'Kia'), 'Berline sportive et moderne'),
('Sportage', (SELECT id FROM brands WHERE nom = 'Kia'), 'SUV compact stylé'),
('Picanto', (SELECT id FROM brands WHERE nom = 'Kia'), 'Citadine urbaine économique'),

-- Peugeot
('208', (SELECT id FROM brands WHERE nom = 'Peugeot'), 'Citadine française élégante'),
('308', (SELECT id FROM brands WHERE nom = 'Peugeot'), 'Berline compacte technologique'),
('3008', (SELECT id FROM brands WHERE nom = 'Peugeot'), 'SUV français design'),
('Partner', (SELECT id FROM brands WHERE nom = 'Peugeot'), 'Utilitaire polyvalent'),

-- Renault
('Logan', (SELECT id FROM brands WHERE nom = 'Renault'), 'Berline économique et spacieuse'),
('Duster', (SELECT id FROM brands WHERE nom = 'Renault'), 'SUV robuste et abordable'),
('Clio', (SELECT id FROM brands WHERE nom = 'Renault'), 'Citadine française populaire'),

-- Volkswagen
('Polo', (SELECT id FROM brands WHERE nom = 'Volkswagen'), 'Citadine allemande de qualité'),
('Jetta', (SELECT id FROM brands WHERE nom = 'Volkswagen'), 'Berline élégante et robuste'),
('Tiguan', (SELECT id FROM brands WHERE nom = 'Volkswagen'), 'SUV premium allemand'),

-- Honda
('Civic', (SELECT id FROM brands WHERE nom = 'Honda'), 'Berline sportive et fiable'),
('CR-V', (SELECT id FROM brands WHERE nom = 'Honda'), 'SUV familial polyvalent'),
('Accord', (SELECT id FROM brands WHERE nom = 'Honda'), 'Berline haut de gamme'),

-- Mitsubishi
('Lancer', (SELECT id FROM brands WHERE nom = 'Mitsubishi'), 'Berline sportive'),
('Outlander', (SELECT id FROM brands WHERE nom = 'Mitsubishi'), 'SUV 7 places'),
('L200', (SELECT id FROM brands WHERE nom = 'Mitsubishi'), 'Pick-up double cabine'),

-- Suzuki
('Swift', (SELECT id FROM brands WHERE nom = 'Suzuki'), 'Citadine sportive et économique'),
('Vitara', (SELECT id FROM brands WHERE nom = 'Suzuki'), 'SUV compact tout-terrain'),
('Jimny', (SELECT id FROM brands WHERE nom = 'Suzuki'), '4x4 compact authentique');

-- Insertion des équipements populaires
INSERT INTO equipments (nom, description, categorie) VALUES
-- Confort
('Climatisation', 'Système de climatisation automatique', 'Confort'),
('Sièges en cuir', 'Sellerie cuir véritable', 'Confort'),
('Sièges chauffants', 'Sièges avant chauffants', 'Confort'),
('Régulateur de vitesse', 'Régulateur et limiteur de vitesse', 'Confort'),
('Volant chauffant', 'Volant avec chauffage intégré', 'Confort'),

-- Sécurité
('ABS', 'Système antiblocage des roues', 'Sécurité'),
('ESP', 'Contrôle électronique de stabilité', 'Sécurité'),
('Airbags frontaux', 'Airbags conducteur et passager', 'Sécurité'),
('Airbags latéraux', 'Airbags latéraux avant et arrière', 'Sécurité'),
('Caméra de recul', 'Caméra d''aide au stationnement', 'Sécurité'),
('Radar de recul', 'Capteurs de stationnement arrière', 'Sécurité'),

-- Technologie
('GPS intégré', 'Système de navigation GPS', 'Technologie'),
('Bluetooth', 'Connectivité Bluetooth mains libres', 'Technologie'),
('USB/AUX', 'Prises USB et auxiliaire', 'Technologie'),
('Écran tactile', 'Écran multimédia tactile', 'Technologie'),
('Démarrage sans clé', 'Système de démarrage sans clé', 'Technologie'),

-- Extérieur
('Jantes alliage', 'Jantes en alliage léger', 'Extérieur'),
('Toit ouvrant', 'Toit ouvrant électrique', 'Extérieur'),
('Phares LED', 'Éclairage LED avant', 'Extérieur'),
('Barres de toit', 'Barres de toit pour transport', 'Extérieur');

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
((SELECT id FROM brands WHERE nom = 'Hyundai'), (SELECT id FROM models WHERE nom = 'i10'), 2021, 'Rouge', 8500000, 28000, 'Essence', 'Manuelle', 'Hyundai i10 2021, citadine économique, parfaite pour la ville.', 'Disponible'),

-- Kia
((SELECT id FROM brands WHERE nom = 'Kia'), (SELECT id FROM models WHERE nom = 'Cerato'), 2022, 'Noir', 15500000, 10000, 'Essence', 'Automatique', 'Kia Cerato 2022, berline sportive, garantie 7 ans.', 'Disponible'),
((SELECT id FROM brands WHERE nom = 'Kia'), (SELECT id FROM models WHERE nom = 'Sportage'), 2021, 'Blanc', 23000000, 20000, 'Essence', 'Automatique', 'Kia Sportage 2021, SUV élégant et bien équipé.', 'Disponible'),

-- Peugeot
((SELECT id FROM brands WHERE nom = 'Peugeot'), (SELECT id FROM models WHERE nom = '208'), 2022, 'Bleu', 12000000, 18000, 'Essence', 'Manuelle', 'Peugeot 208 2022, citadine française, design moderne.', 'Disponible'),
((SELECT id FROM brands WHERE nom = 'Peugeot'), (SELECT id FROM models WHERE nom = '308'), 2021, 'Gris', 16500000, 25000, 'Essence', 'Automatique', 'Peugeot 308 2021, berline compacte, technologie française.', 'Vendu'),

-- Renault
((SELECT id FROM brands WHERE nom = 'Renault'), (SELECT id FROM models WHERE nom = 'Logan'), 2022, 'Blanc', 11000000, 15000, 'Essence', 'Manuelle', 'Renault Logan 2022, berline économique, très spacieuse.', 'Disponible'),
((SELECT id FROM brands WHERE nom = 'Renault'), (SELECT id FROM models WHERE nom = 'Duster'), 2021, 'Marron', 18000000, 30000, 'Essence', 'Manuelle', 'Renault Duster 2021, SUV robuste, excellent rapport qualité-prix.', 'Disponible'),

-- Volkswagen
((SELECT id FROM brands WHERE nom = 'Volkswagen'), (SELECT id FROM models WHERE nom = 'Polo'), 2022, 'Rouge', 13500000, 12000, 'Essence', 'Automatique', 'Volkswagen Polo 2022, citadine allemande, qualité premium.', 'Disponible'),
((SELECT id FROM brands WHERE nom = 'Volkswagen'), (SELECT id FROM models WHERE nom = 'Jetta'), 2021, 'Noir', 19000000, 22000, 'Essence', 'Automatique', 'Volkswagen Jetta 2021, berline élégante, finition soignée.', 'Disponible'),

-- Honda
((SELECT id FROM brands WHERE nom = 'Honda'), (SELECT id FROM models WHERE nom = 'Civic'), 2022, 'Argent', 17000000, 14000, 'Essence', 'Automatique', 'Honda Civic 2022, berline sportive, moteur fiable.', 'Disponible'),
((SELECT id FROM brands WHERE nom = 'Honda'), (SELECT id FROM models WHERE nom = 'CR-V'), 2021, 'Blanc', 26000000, 19000, 'Essence', 'Automatique', 'Honda CR-V 2021, SUV familial, très polyvalent.', 'Disponible'),

-- Véhicules d'occasion plus abordables
((SELECT id FROM brands WHERE nom = 'Toyota'), (SELECT id FROM models WHERE nom = 'Yaris'), 2019, 'Blanc', 9500000, 45000, 'Essence', 'Manuelle', 'Toyota Yaris 2019, citadine fiable, entretien suivi.', 'Disponible'),
((SELECT id FROM brands WHERE nom = 'Nissan'), (SELECT id FROM models WHERE nom = 'Micra'), 2020, 'Rouge', 8000000, 38000, 'Essence', 'Manuelle', 'Nissan Micra 2020, petite citadine économique.', 'Disponible'),
((SELECT id FROM brands WHERE nom = 'Suzuki'), (SELECT id FROM models WHERE nom = 'Swift'), 2020, 'Bleu', 9000000, 32000, 'Essence', 'Manuelle', 'Suzuki Swift 2020, citadine sportive et économique.', 'Disponible');

-- ÉTAPE 3: Vérification des données insérées
SELECT 'Données CFA insérées avec succès !' as message;
SELECT 
  (SELECT COUNT(*) FROM brands) as marques_inserees,
  (SELECT COUNT(*) FROM models) as modeles_inseres,
  (SELECT COUNT(*) FROM equipments) as equipements_inseres,
  (SELECT COUNT(*) FROM vehicles) as vehicules_inseres;

-- Afficher quelques exemples de prix en CFA
SELECT 
  b.nom as marque,
  m.nom as modele,
  v.annee,
  v.prix as prix_cfa,
  v.statut
FROM vehicles v
JOIN brands b ON v.brand_id = b.id
JOIN models m ON v.model_id = m.id
ORDER BY v.prix
LIMIT 5;
