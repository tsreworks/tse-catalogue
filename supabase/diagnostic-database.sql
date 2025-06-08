-- Script de diagnostic de la base de données TSE
-- Version: 1.0
-- Date: 6 janvier 2025

-- 1. Vérifier les marques
SELECT '=== MARQUES ===' as section;
SELECT 
  COUNT(*) as total_marques,
  COUNT(CASE WHEN logo IS NOT NULL THEN 1 END) as avec_logo,
  COUNT(CASE WHEN logo IS NULL THEN 1 END) as sans_logo
FROM brands;

SELECT 'Top 10 marques:' as info;
SELECT nom, logo FROM brands ORDER BY nom LIMIT 10;

-- 2. Vérifier les modèles
SELECT '=== MODÈLES ===' as section;
SELECT 
  COUNT(*) as total_modeles,
  COUNT(DISTINCT brand_id) as marques_avec_modeles
FROM models;

SELECT 'Modèles par marque:' as info;
SELECT 
  b.nom as marque,
  COUNT(m.id) as nombre_modeles
FROM brands b
LEFT JOIN models m ON b.id = m.brand_id
GROUP BY b.id, b.nom
ORDER BY nombre_modeles DESC
LIMIT 10;

-- 3. Vérifier les véhicules
SELECT '=== VÉHICULES ===' as section;
SELECT 
  COUNT(*) as total_vehicules,
  COUNT(DISTINCT brand_id) as marques_avec_vehicules,
  COUNT(DISTINCT model_id) as modeles_avec_vehicules,
  COUNT(CASE WHEN statut = 'Disponible' THEN 1 END) as vehicules_disponibles
FROM vehicles;

SELECT 'Véhicules par marque:' as info;
SELECT 
  b.nom as marque,
  COUNT(v.id) as nombre_vehicules
FROM brands b
LEFT JOIN vehicles v ON b.id = v.brand_id
GROUP BY b.id, b.nom
ORDER BY nombre_vehicules DESC
LIMIT 10;

-- 4. Vérifier la jointure complète
SELECT '=== JOINTURE COMPLÈTE ===' as section;
SELECT 
  b.nom as marque,
  m.nom as modele,
  v.annee,
  v.couleur,
  v.prix,
  v.statut
FROM brands b
LEFT JOIN models m ON b.id = m.brand_id
LEFT JOIN vehicles v ON m.id = v.model_id
WHERE v.id IS NOT NULL
ORDER BY b.nom, m.nom, v.annee DESC
LIMIT 20;

-- 5. Vérifier les logos
SELECT '=== LOGOS ===' as section;
SELECT 'Logos disponibles:' as info;
SELECT 
  nom,
  CASE 
    WHEN logo LIKE '%.svg' THEN 'SVG'
    WHEN logo LIKE '%.png' THEN 'PNG'
    WHEN logo LIKE 'http%' THEN 'URL'
    ELSE 'Autre'
  END as type_logo,
  logo
FROM brands 
WHERE logo IS NOT NULL
ORDER BY nom;

-- 6. Statistiques générales
SELECT '=== STATISTIQUES ===' as section;
SELECT 
  'Marques' as type,
  COUNT(*) as total
FROM brands
UNION ALL
SELECT 
  'Modèles' as type,
  COUNT(*) as total
FROM models
UNION ALL
SELECT 
  'Véhicules' as type,
  COUNT(*) as total
FROM vehicles
UNION ALL
SELECT 
  'Véhicules disponibles' as type,
  COUNT(*) as total
FROM vehicles
WHERE statut = 'Disponible';

-- 7. Problèmes potentiels
SELECT '=== PROBLÈMES POTENTIELS ===' as section;

SELECT 'Marques sans modèles:' as probleme;
SELECT b.nom
FROM brands b
LEFT JOIN models m ON b.id = m.brand_id
WHERE m.id IS NULL
ORDER BY b.nom;

SELECT 'Modèles sans véhicules:' as probleme;
SELECT 
  b.nom as marque,
  m.nom as modele
FROM models m
JOIN brands b ON m.brand_id = b.id
LEFT JOIN vehicles v ON m.id = v.model_id
WHERE v.id IS NULL
ORDER BY b.nom, m.nom;

SELECT 'Marques sans logos:' as probleme;
SELECT nom
FROM brands
WHERE logo IS NULL
ORDER BY nom;

-- Message final
SELECT 'Diagnostic terminé !' as message;
