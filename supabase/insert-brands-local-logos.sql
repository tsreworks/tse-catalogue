-- Insertion des marques majeures avec logos locaux
-- Version: 1.0 (Logos locaux)
-- Date: 6 janvier 2025

-- Nettoyer les données existantes
DELETE FROM vehicle_equipments;
DELETE FROM vehicle_images;
DELETE FROM vehicle_documents;
DELETE FROM vehicles;
DELETE FROM models;
DELETE FROM brands;
DELETE FROM equipments;

-- Insertion des marques majeures avec logos locaux
INSERT INTO brands (nom, description, logo) VALUES
-- Marques japonaises (très populaires en Afrique)
('Toyota', 'Constructeur japonais leader mondial, réputé pour sa fiabilité et sa durabilité exceptionnelles', '/images/brands/toyota.svg'),
('Nissan', 'Marque japonaise innovante, pionnière en technologie automobile et véhicules électriques', '/images/brands/nissan.svg'),
('Honda', 'Constructeur japonais expert en moteurs fiables, leader en innovation technologique', '/images/brands/honda.svg'),
('Mazda', 'Marque japonaise au design élégant, technologie SKYACTIV et conduite plaisante', '/images/brands/default.svg'),
('Mitsubishi', 'Constructeur japonais spécialisé dans les SUV robustes et véhicules tout-terrain', '/images/brands/default.svg'),
('Suzuki', 'Marque japonaise experte en véhicules compacts économiques et tout-terrain', '/images/brands/default.svg'),
('Subaru', 'Constructeur japonais spécialisé dans la transmission intégrale et la sécurité', '/images/brands/default.svg'),
('Isuzu', 'Marque japonaise leader en véhicules utilitaires et camions robustes', '/images/brands/default.svg'),

-- Marques coréennes (très populaires pour le rapport qualité-prix)
('Hyundai', 'Constructeur coréen moderne offrant un excellent rapport qualité-prix avec garantie étendue', '/images/brands/hyundai.svg'),
('Kia', 'Marque coréenne stylée avec design moderne, technologie avancée et garantie 7 ans', '/images/brands/kia.svg'),

-- Marques françaises (historiquement présentes en Afrique)
('Peugeot', 'Constructeur français élégant, technologie avancée et design raffiné', '/images/brands/peugeot.svg'),
('Renault', 'Marque française populaire en Afrique, véhicules adaptés aux conditions locales', '/images/brands/renault.svg'),
('Citroën', 'Constructeur français innovant, confort de conduite et technologies avant-gardistes', '/images/brands/default.svg'),

-- Marques allemandes (premium et qualité)
('Volkswagen', 'Marque allemande synonyme de qualité, robustesse et ingénierie de précision', '/images/brands/volkswagen.svg'),
('BMW', 'Constructeur allemand premium, plaisir de conduire et technologie de pointe', '/images/brands/bmw.svg'),
('Mercedes-Benz', 'Marque allemande de luxe, innovation technologique et prestige automobile', '/images/brands/mercedes.svg'),
('Audi', 'Constructeur allemand premium, design progressif et technologie quattro', '/images/brands/default.svg'),
('Opel', 'Marque allemande accessible, véhicules pratiques et économiques', '/images/brands/default.svg'),

-- Marques américaines
('Ford', 'Constructeur américain historique, robustesse et innovation depuis 1903', '/images/brands/default.svg'),
('Chevrolet', 'Marque américaine populaire, véhicules polyvalents et performants', '/images/brands/default.svg'),
('Jeep', 'Spécialiste américain des véhicules tout-terrain et SUV authentiques', '/images/brands/default.svg'),

-- Marques italiennes
('Fiat', 'Constructeur italien, véhicules urbains élégants et économiques', '/images/brands/default.svg'),

-- Marques chinoises (émergentes en Afrique)
('Chery', 'Constructeur chinois en expansion, véhicules modernes à prix compétitifs', '/images/brands/chery.png'),
('BYD', 'Marque chinoise leader en véhicules électriques et technologies vertes', '/images/brands/byd.png'),
('Geely', 'Constructeur chinois moderne, propriétaire de Volvo, qualité croissante', '/images/brands/geely.png'),

-- Marques indiennes (présentes en Afrique)
('Tata', 'Constructeur indien robuste, véhicules adaptés aux marchés émergents', '/images/brands/tata.png'),
('Mahindra', 'Marque indienne spécialisée dans les SUV et véhicules utilitaires robustes', '/images/brands/mahindra.png'),

-- Marques de luxe
('Lexus', 'Division de luxe de Toyota, raffinement japonais et fiabilité premium', '/images/brands/lexus.png'),
('Infiniti', 'Marque de luxe de Nissan, performance et technologie avancée', '/images/brands/infiniti.png'),
('Acura', 'Division premium de Honda, sport de luxe et innovation', '/images/brands/acura.png'),
('Cadillac', 'Marque de luxe américaine, prestige et technologie de pointe', '/images/brands/cadillac.png'),

-- Marques spécialisées
('Land Rover', 'Spécialiste britannique des véhicules tout-terrain de luxe', '/images/brands/landrover.png'),
('Volvo', 'Constructeur suédois pionnier en sécurité automobile et durabilité', '/images/brands/volvo.png'),
('Skoda', 'Marque tchèque du groupe Volkswagen, qualité allemande à prix accessible', '/images/brands/skoda.png'),
('SEAT', 'Constructeur espagnol du groupe Volkswagen, design méditerranéen et sportivité', '/images/brands/seat.png');

-- Insertion des modèles populaires pour chaque marque
INSERT INTO models (nom, brand_id, description) VALUES
-- Toyota (marque la plus populaire)
('Corolla', (SELECT id FROM brands WHERE nom = 'Toyota'), 'Berline compacte fiable et économique, best-seller mondial'),
('Camry', (SELECT id FROM brands WHERE nom = 'Toyota'), 'Berline familiale spacieuse et confortable'),
('RAV4', (SELECT id FROM brands WHERE nom = 'Toyota'), 'SUV compact polyvalent et robuste'),
('Hilux', (SELECT id FROM brands WHERE nom = 'Toyota'), 'Pick-up double cabine robuste, leader en Afrique'),
('Yaris', (SELECT id FROM brands WHERE nom = 'Toyota'), 'Citadine économique et maniable'),
('Prado', (SELECT id FROM brands WHERE nom = 'Toyota'), 'SUV premium tout-terrain'),
('Avensis', (SELECT id FROM brands WHERE nom = 'Toyota'), 'Berline familiale élégante'),

-- Nissan
('Sentra', (SELECT id FROM brands WHERE nom = 'Nissan'), 'Berline moderne et élégante'),
('X-Trail', (SELECT id FROM brands WHERE nom = 'Nissan'), 'SUV familial spacieux'),
('Navara', (SELECT id FROM brands WHERE nom = 'Nissan'), 'Pick-up double cabine performant'),
('Micra', (SELECT id FROM brands WHERE nom = 'Nissan'), 'Citadine pratique et économique'),
('Qashqai', (SELECT id FROM brands WHERE nom = 'Nissan'), 'SUV urbain innovant'),
('Patrol', (SELECT id FROM brands WHERE nom = 'Nissan'), 'SUV tout-terrain robuste'),

-- Honda
('Civic', (SELECT id FROM brands WHERE nom = 'Honda'), 'Berline sportive et fiable'),
('CR-V', (SELECT id FROM brands WHERE nom = 'Honda'), 'SUV familial polyvalent'),
('Accord', (SELECT id FROM brands WHERE nom = 'Honda'), 'Berline haut de gamme'),
('Pilot', (SELECT id FROM brands WHERE nom = 'Honda'), 'SUV 7 places familial'),
('Fit', (SELECT id FROM brands WHERE nom = 'Honda'), 'Citadine spacieuse et économique'),

-- Hyundai
('Elantra', (SELECT id FROM brands WHERE nom = 'Hyundai'), 'Berline élégante avec garantie étendue'),
('Tucson', (SELECT id FROM brands WHERE nom = 'Hyundai'), 'SUV moderne et bien équipé'),
('i10', (SELECT id FROM brands WHERE nom = 'Hyundai'), 'Citadine abordable et fiable'),
('Santa Fe', (SELECT id FROM brands WHERE nom = 'Hyundai'), 'SUV 7 places familial'),
('Accent', (SELECT id FROM brands WHERE nom = 'Hyundai'), 'Berline compacte économique'),

-- Kia
('Cerato', (SELECT id FROM brands WHERE nom = 'Kia'), 'Berline sportive et moderne'),
('Sportage', (SELECT id FROM brands WHERE nom = 'Kia'), 'SUV compact stylé'),
('Picanto', (SELECT id FROM brands WHERE nom = 'Kia'), 'Citadine urbaine économique'),
('Sorento', (SELECT id FROM brands WHERE nom = 'Kia'), 'SUV 7 places premium'),
('Rio', (SELECT id FROM brands WHERE nom = 'Kia'), 'Berline compacte moderne'),

-- Peugeot
('208', (SELECT id FROM brands WHERE nom = 'Peugeot'), 'Citadine française élégante'),
('308', (SELECT id FROM brands WHERE nom = 'Peugeot'), 'Berline compacte technologique'),
('3008', (SELECT id FROM brands WHERE nom = 'Peugeot'), 'SUV français design'),
('Partner', (SELECT id FROM brands WHERE nom = 'Peugeot'), 'Utilitaire polyvalent'),
('2008', (SELECT id FROM brands WHERE nom = 'Peugeot'), 'SUV urbain compact'),

-- Renault
('Logan', (SELECT id FROM brands WHERE nom = 'Renault'), 'Berline économique et spacieuse'),
('Duster', (SELECT id FROM brands WHERE nom = 'Renault'), 'SUV robuste et abordable'),
('Clio', (SELECT id FROM brands WHERE nom = 'Renault'), 'Citadine française populaire'),
('Captur', (SELECT id FROM brands WHERE nom = 'Renault'), 'SUV urbain coloré'),
('Sandero', (SELECT id FROM brands WHERE nom = 'Renault'), 'Berline compacte économique'),

-- Volkswagen
('Polo', (SELECT id FROM brands WHERE nom = 'Volkswagen'), 'Citadine allemande de qualité'),
('Jetta', (SELECT id FROM brands WHERE nom = 'Volkswagen'), 'Berline élégante et robuste'),
('Tiguan', (SELECT id FROM brands WHERE nom = 'Volkswagen'), 'SUV premium allemand'),
('Golf', (SELECT id FROM brands WHERE nom = 'Volkswagen'), 'Berline compacte iconique'),
('Passat', (SELECT id FROM brands WHERE nom = 'Volkswagen'), 'Berline familiale premium'),

-- BMW
('Série 3', (SELECT id FROM brands WHERE nom = 'BMW'), 'Berline sportive premium'),
('X3', (SELECT id FROM brands WHERE nom = 'BMW'), 'SUV premium polyvalent'),
('Série 5', (SELECT id FROM brands WHERE nom = 'BMW'), 'Berline executive'),
('X5', (SELECT id FROM brands WHERE nom = 'BMW'), 'SUV de luxe'),

-- Mercedes-Benz
('Classe A', (SELECT id FROM brands WHERE nom = 'Mercedes-Benz'), 'Berline compacte de luxe'),
('Classe C', (SELECT id FROM brands WHERE nom = 'Mercedes-Benz'), 'Berline premium élégante'),
('GLC', (SELECT id FROM brands WHERE nom = 'Mercedes-Benz'), 'SUV de luxe compact'),
('Classe E', (SELECT id FROM brands WHERE nom = 'Mercedes-Benz'), 'Berline executive'),

-- Ford
('Focus', (SELECT id FROM brands WHERE nom = 'Ford'), 'Berline compacte dynamique'),
('Escape', (SELECT id FROM brands WHERE nom = 'Ford'), 'SUV compact polyvalent'),
('F-150', (SELECT id FROM brands WHERE nom = 'Ford'), 'Pick-up américain robuste'),
('Fiesta', (SELECT id FROM brands WHERE nom = 'Ford'), 'Citadine sportive'),

-- Autres marques avec modèles populaires
('Mazda3', (SELECT id FROM brands WHERE nom = 'Mazda'), 'Berline élégante et sportive'),
('CX-5', (SELECT id FROM brands WHERE nom = 'Mazda'), 'SUV design et dynamique'),
('Outlander', (SELECT id FROM brands WHERE nom = 'Mitsubishi'), 'SUV 7 places robuste'),
('L200', (SELECT id FROM brands WHERE nom = 'Mitsubishi'), 'Pick-up double cabine'),
('Swift', (SELECT id FROM brands WHERE nom = 'Suzuki'), 'Citadine sportive et économique'),
('Vitara', (SELECT id FROM brands WHERE nom = 'Suzuki'), 'SUV compact tout-terrain');

-- Message de confirmation
SELECT 'Marques majeures avec modèles populaires insérées avec succès !' as message;
SELECT
  (SELECT COUNT(*) FROM brands) as nombre_marques,
  (SELECT COUNT(*) FROM models) as nombre_modeles;
