-- Insertion des marques majeures de véhicules avec logos
-- Version: 1.0
-- Date: 6 janvier 2025
-- Marques populaires mondiales et en Côte d'Ivoire

-- Nettoyer les données existantes
DELETE FROM vehicle_equipments;
DELETE FROM vehicle_images;
DELETE FROM vehicle_documents;
DELETE FROM vehicles;
DELETE FROM models;
DELETE FROM brands;
DELETE FROM equipments;

-- Insertion des marques majeures avec logos
INSERT INTO brands (nom, description, logo) VALUES
-- Marques japonaises (très populaires en Afrique)
('Toyota', 'Constructeur japonais leader mondial, réputé pour sa fiabilité et sa durabilité exceptionnelles', 'https://logos-world.net/wp-content/uploads/2020/04/Toyota-Logo.png'),
('Nissan', 'Marque japonaise innovante, pionnière en technologie automobile et véhicules électriques', 'https://logos-world.net/wp-content/uploads/2020/04/Nissan-Logo.png'),
('Honda', 'Constructeur japonais expert en moteurs fiables, leader en innovation technologique', 'https://logos-world.net/wp-content/uploads/2020/04/Honda-Logo.png'),
('Mazda', 'Marque japonaise au design élégant, technologie SKYACTIV et conduite plaisante', 'https://logos-world.net/wp-content/uploads/2020/04/Mazda-Logo.png'),
('Mitsubishi', 'Constructeur japonais spécialisé dans les SUV robustes et véhicules tout-terrain', 'https://logos-world.net/wp-content/uploads/2020/04/Mitsubishi-Logo.png'),
('Suzuki', 'Marque japonaise experte en véhicules compacts économiques et tout-terrain', 'https://logos-world.net/wp-content/uploads/2020/04/Suzuki-Logo.png'),
('Subaru', 'Constructeur japonais spécialisé dans la transmission intégrale et la sécurité', 'https://logos-world.net/wp-content/uploads/2020/04/Subaru-Logo.png'),
('Isuzu', 'Marque japonaise leader en véhicules utilitaires et camions robustes', 'https://logos-world.net/wp-content/uploads/2020/04/Isuzu-Logo.png'),

-- Marques coréennes (très populaires pour le rapport qualité-prix)
('Hyundai', 'Constructeur coréen moderne offrant un excellent rapport qualité-prix avec garantie étendue', 'https://logos-world.net/wp-content/uploads/2020/04/Hyundai-Logo.png'),
('Kia', 'Marque coréenne stylée avec design moderne, technologie avancée et garantie 7 ans', 'https://logos-world.net/wp-content/uploads/2020/04/Kia-Logo.png'),

-- Marques françaises (historiquement présentes en Afrique)
('Peugeot', 'Constructeur français élégant, technologie avancée et design raffiné', 'https://logos-world.net/wp-content/uploads/2020/04/Peugeot-Logo.png'),
('Renault', 'Marque française populaire en Afrique, véhicules adaptés aux conditions locales', 'https://logos-world.net/wp-content/uploads/2020/04/Renault-Logo.png'),
('Citroën', 'Constructeur français innovant, confort de conduite et technologies avant-gardistes', 'https://logos-world.net/wp-content/uploads/2020/04/Citroen-Logo.png'),

-- Marques allemandes (premium et qualité)
('Volkswagen', 'Marque allemande synonyme de qualité, robustesse et ingénierie de précision', 'https://logos-world.net/wp-content/uploads/2020/04/Volkswagen-Logo.png'),
('BMW', 'Constructeur allemand premium, plaisir de conduire et technologie de pointe', 'https://logos-world.net/wp-content/uploads/2020/04/BMW-Logo.png'),
('Mercedes-Benz', 'Marque allemande de luxe, innovation technologique et prestige automobile', 'https://logos-world.net/wp-content/uploads/2020/04/Mercedes-Benz-Logo.png'),
('Audi', 'Constructeur allemand premium, design progressif et technologie quattro', 'https://logos-world.net/wp-content/uploads/2020/04/Audi-Logo.png'),
('Opel', 'Marque allemande accessible, véhicules pratiques et économiques', 'https://logos-world.net/wp-content/uploads/2020/04/Opel-Logo.png'),

-- Marques américaines
('Ford', 'Constructeur américain historique, robustesse et innovation depuis 1903', 'https://logos-world.net/wp-content/uploads/2020/04/Ford-Logo.png'),
('Chevrolet', 'Marque américaine populaire, véhicules polyvalents et performants', 'https://logos-world.net/wp-content/uploads/2020/04/Chevrolet-Logo.png'),
('Jeep', 'Spécialiste américain des véhicules tout-terrain et SUV authentiques', 'https://logos-world.net/wp-content/uploads/2020/04/Jeep-Logo.png'),

-- Marques italiennes
('Fiat', 'Constructeur italien, véhicules urbains élégants et économiques', 'https://logos-world.net/wp-content/uploads/2020/04/Fiat-Logo.png'),

-- Marques chinoises (émergentes en Afrique)
('Chery', 'Constructeur chinois en expansion, véhicules modernes à prix compétitifs', 'https://logos-world.net/wp-content/uploads/2020/04/Chery-Logo.png'),
('BYD', 'Marque chinoise leader en véhicules électriques et technologies vertes', 'https://logos-world.net/wp-content/uploads/2020/04/BYD-Logo.png'),
('Geely', 'Constructeur chinois moderne, propriétaire de Volvo, qualité croissante', 'https://logos-world.net/wp-content/uploads/2020/04/Geely-Logo.png'),

-- Marques indiennes (présentes en Afrique)
('Tata', 'Constructeur indien robuste, véhicules adaptés aux marchés émergents', 'https://logos-world.net/wp-content/uploads/2020/04/Tata-Logo.png'),
('Mahindra', 'Marque indienne spécialisée dans les SUV et véhicules utilitaires robustes', 'https://logos-world.net/wp-content/uploads/2020/04/Mahindra-Logo.png'),

-- Marques de luxe
('Lexus', 'Division de luxe de Toyota, raffinement japonais et fiabilité premium', 'https://logos-world.net/wp-content/uploads/2020/04/Lexus-Logo.png'),
('Infiniti', 'Marque de luxe de Nissan, performance et technologie avancée', 'https://logos-world.net/wp-content/uploads/2020/04/Infiniti-Logo.png'),
('Acura', 'Division premium de Honda, sport de luxe et innovation', 'https://logos-world.net/wp-content/uploads/2020/04/Acura-Logo.png'),
('Cadillac', 'Marque de luxe américaine, prestige et technologie de pointe', 'https://logos-world.net/wp-content/uploads/2020/04/Cadillac-Logo.png'),

-- Marques spécialisées
('Land Rover', 'Spécialiste britannique des véhicules tout-terrain de luxe', 'https://logos-world.net/wp-content/uploads/2020/04/Land-Rover-Logo.png'),
('Volvo', 'Constructeur suédois pionnier en sécurité automobile et durabilité', 'https://logos-world.net/wp-content/uploads/2020/04/Volvo-Logo.png'),
('Skoda', 'Marque tchèque du groupe Volkswagen, qualité allemande à prix accessible', 'https://logos-world.net/wp-content/uploads/2020/04/Skoda-Logo.png'),
('SEAT', 'Constructeur espagnol du groupe Volkswagen, design méditerranéen et sportivité', 'https://logos-world.net/wp-content/uploads/2020/04/SEAT-Logo.png');

-- Message de confirmation
SELECT 'Marques majeures insérées avec succès !' as message;
SELECT COUNT(*) as nombre_marques FROM brands;
