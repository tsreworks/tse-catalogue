-- Mise à jour des chemins de logos vers les fichiers SVG
-- Version: 1.0
-- Date: 6 janvier 2025

-- Mettre à jour les logos des marques principales avec les fichiers SVG créés
UPDATE brands SET logo = '/images/brands/toyota.svg' WHERE nom = 'Toyota';
UPDATE brands SET logo = '/images/brands/nissan.svg' WHERE nom = 'Nissan';
UPDATE brands SET logo = '/images/brands/honda.svg' WHERE nom = 'Honda';
UPDATE brands SET logo = '/images/brands/hyundai.svg' WHERE nom = 'Hyundai';
UPDATE brands SET logo = '/images/brands/kia.svg' WHERE nom = 'Kia';
UPDATE brands SET logo = '/images/brands/peugeot.svg' WHERE nom = 'Peugeot';
UPDATE brands SET logo = '/images/brands/renault.svg' WHERE nom = 'Renault';
UPDATE brands SET logo = '/images/brands/volkswagen.svg' WHERE nom = 'Volkswagen';
UPDATE brands SET logo = '/images/brands/bmw.svg' WHERE nom = 'BMW';
UPDATE brands SET logo = '/images/brands/mercedes.svg' WHERE nom = 'Mercedes-Benz';

-- Mettre à jour les autres marques avec le logo par défaut
UPDATE brands SET logo = '/images/brands/default.svg' WHERE nom IN (
  'Mazda', 'Mitsubishi', 'Suzuki', 'Subaru', 'Isuzu',
  'Citroën', 'Audi', 'Opel', 'Ford', 'Chevrolet', 'Jeep',
  'Fiat', 'Chery', 'BYD', 'Geely', 'Tata', 'Mahindra',
  'Lexus', 'Infiniti', 'Acura', 'Cadillac', 'Land Rover',
  'Volvo', 'Skoda', 'SEAT'
);

-- Corriger tous les logos qui pointent encore vers des fichiers .png inexistants
UPDATE brands SET logo = '/images/brands/default.svg'
WHERE logo LIKE '%.png' AND logo NOT IN (
  '/images/brands/toyota.svg',
  '/images/brands/nissan.svg',
  '/images/brands/honda.svg',
  '/images/brands/hyundai.svg',
  '/images/brands/kia.svg',
  '/images/brands/peugeot.svg',
  '/images/brands/renault.svg',
  '/images/brands/volkswagen.svg',
  '/images/brands/bmw.svg',
  '/images/brands/mercedes.svg'
);

-- Vérifier les mises à jour
SELECT nom, logo FROM brands ORDER BY nom;

-- Statistiques
SELECT 
  COUNT(*) as total_marques,
  COUNT(CASE WHEN logo LIKE '%default.svg%' THEN 1 END) as logos_par_defaut,
  COUNT(CASE WHEN logo NOT LIKE '%default.svg%' AND logo IS NOT NULL THEN 1 END) as logos_personnalises
FROM brands;

-- Message de confirmation
SELECT 'Logos des marques mis à jour avec succès !' as message;
