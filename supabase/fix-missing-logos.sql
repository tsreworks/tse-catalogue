-- Correction immédiate des logos manquants
-- Version: 1.0
-- Date: 6 janvier 2025

-- Corriger tous les logos qui causent des erreurs 404
UPDATE brands SET logo = '/images/brands/default.svg' 
WHERE logo LIKE '%.png';

-- Mettre à jour spécifiquement les logos que nous avons créés en SVG
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

-- Vérifier les corrections
SELECT 
  nom,
  logo,
  CASE 
    WHEN logo LIKE '%.svg' THEN '✅ SVG'
    WHEN logo LIKE '%.png' THEN '❌ PNG (404)'
    WHEN logo IS NULL THEN '⚠️ NULL'
    ELSE '❓ Autre'
  END as statut_logo
FROM brands 
ORDER BY nom;

-- Compter les logos par type
SELECT 
  CASE 
    WHEN logo LIKE '%.svg' THEN 'SVG (OK)'
    WHEN logo LIKE '%.png' THEN 'PNG (404)'
    WHEN logo IS NULL THEN 'NULL'
    ELSE 'Autre'
  END as type_logo,
  COUNT(*) as nombre
FROM brands 
GROUP BY 
  CASE 
    WHEN logo LIKE '%.svg' THEN 'SVG (OK)'
    WHEN logo LIKE '%.png' THEN 'PNG (404)'
    WHEN logo IS NULL THEN 'NULL'
    ELSE 'Autre'
  END;

-- Message de confirmation
SELECT 'Logos corrigés ! Plus d''erreurs 404 attendues.' as message;
