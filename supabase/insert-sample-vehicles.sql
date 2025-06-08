-- Insertion de véhicules d'exemple pour tester le catalogue
-- Version: 1.0
-- Date: 6 janvier 2025

-- Insérer quelques véhicules pour les marques principales
INSERT INTO vehicles (
  brand_id, 
  model_id, 
  annee, 
  couleur, 
  prix, 
  kilometrage, 
  carburant, 
  transmission, 
  description, 
  statut
) VALUES

-- Toyota Corolla
(
  (SELECT id FROM brands WHERE nom = 'Toyota'),
  (SELECT id FROM models WHERE nom = 'Corolla' AND brand_id = (SELECT id FROM brands WHERE nom = 'Toyota')),
  2023,
  'Blanc',
  18500000,
  15000,
  'Essence',
  'Automatique',
  'Toyota Corolla 2023 en excellent état, entretien régulier, véhicule fiable et économique.',
  'Disponible'
),
(
  (SELECT id FROM brands WHERE nom = 'Toyota'),
  (SELECT id FROM models WHERE nom = 'Corolla' AND brand_id = (SELECT id FROM brands WHERE nom = 'Toyota')),
  2022,
  'Gris',
  16800000,
  28000,
  'Essence',
  'Manuelle',
  'Toyota Corolla 2022, véhicule bien entretenu, idéal pour la ville et les longs trajets.',
  'Disponible'
),

-- Toyota RAV4
(
  (SELECT id FROM brands WHERE nom = 'Toyota'),
  (SELECT id FROM models WHERE nom = 'RAV4' AND brand_id = (SELECT id FROM brands WHERE nom = 'Toyota')),
  2023,
  'Noir',
  28500000,
  12000,
  'Essence',
  'Automatique',
  'Toyota RAV4 2023, SUV spacieux et robuste, parfait pour les familles.',
  'Disponible'
),

-- Toyota Hilux
(
  (SELECT id FROM brands WHERE nom = 'Toyota'),
  (SELECT id FROM models WHERE nom = 'Hilux' AND brand_id = (SELECT id FROM brands WHERE nom = 'Toyota')),
  2023,
  'Blanc',
  32000000,
  8000,
  'Diesel',
  'Manuelle',
  'Toyota Hilux 2023 double cabine, pick-up robuste idéal pour le travail et les loisirs.',
  'Disponible'
),

-- Nissan Sentra
(
  (SELECT id FROM brands WHERE nom = 'Nissan'),
  (SELECT id FROM models WHERE nom = 'Sentra' AND brand_id = (SELECT id FROM brands WHERE nom = 'Nissan')),
  2023,
  'Rouge',
  17200000,
  18000,
  'Essence',
  'Automatique',
  'Nissan Sentra 2023, berline moderne et confortable avec technologies avancées.',
  'Disponible'
),

-- Nissan X-Trail
(
  (SELECT id FROM brands WHERE nom = 'Nissan'),
  (SELECT id FROM models WHERE nom = 'X-Trail' AND brand_id = (SELECT id FROM brands WHERE nom = 'Nissan')),
  2022,
  'Bleu',
  26800000,
  22000,
  'Essence',
  'Automatique',
  'Nissan X-Trail 2022, SUV familial spacieux avec 7 places.',
  'Disponible'
),

-- Honda Civic
(
  (SELECT id FROM brands WHERE nom = 'Honda'),
  (SELECT id FROM models WHERE nom = 'Civic' AND brand_id = (SELECT id FROM brands WHERE nom = 'Honda')),
  2023,
  'Argent',
  19500000,
  14000,
  'Essence',
  'Automatique',
  'Honda Civic 2023, berline sportive et fiable, excellent rapport qualité-prix.',
  'Disponible'
),

-- Honda CR-V
(
  (SELECT id FROM brands WHERE nom = 'Honda'),
  (SELECT id FROM models WHERE nom = 'CR-V' AND brand_id = (SELECT id FROM brands WHERE nom = 'Honda')),
  2022,
  'Noir',
  27500000,
  19000,
  'Essence',
  'Automatique',
  'Honda CR-V 2022, SUV polyvalent et économique, parfait pour les familles.',
  'Disponible'
),

-- Hyundai Elantra
(
  (SELECT id FROM brands WHERE nom = 'Hyundai'),
  (SELECT id FROM models WHERE nom = 'Elantra' AND brand_id = (SELECT id FROM brands WHERE nom = 'Hyundai')),
  2023,
  'Blanc',
  16500000,
  11000,
  'Essence',
  'Automatique',
  'Hyundai Elantra 2023 avec garantie constructeur, berline élégante et bien équipée.',
  'Disponible'
),

-- Hyundai Tucson
(
  (SELECT id FROM brands WHERE nom = 'Hyundai'),
  (SELECT id FROM models WHERE nom = 'Tucson' AND brand_id = (SELECT id FROM brands WHERE nom = 'Hyundai')),
  2023,
  'Gris',
  25800000,
  9000,
  'Essence',
  'Automatique',
  'Hyundai Tucson 2023, SUV moderne avec design avant-gardiste et technologies de pointe.',
  'Disponible'
),

-- Kia Cerato
(
  (SELECT id FROM brands WHERE nom = 'Kia'),
  (SELECT id FROM models WHERE nom = 'Cerato' AND brand_id = (SELECT id FROM brands WHERE nom = 'Kia')),
  2023,
  'Rouge',
  17800000,
  13000,
  'Essence',
  'Automatique',
  'Kia Cerato 2023 avec garantie 7 ans, berline sportive et moderne.',
  'Disponible'
),

-- Kia Sportage
(
  (SELECT id FROM brands WHERE nom = 'Kia'),
  (SELECT id FROM models WHERE nom = 'Sportage' AND brand_id = (SELECT id FROM brands WHERE nom = 'Kia')),
  2022,
  'Bleu',
  24500000,
  16000,
  'Essence',
  'Automatique',
  'Kia Sportage 2022, SUV compact stylé avec excellent équipement de série.',
  'Disponible'
),

-- Peugeot 308
(
  (SELECT id FROM brands WHERE nom = 'Peugeot'),
  (SELECT id FROM models WHERE nom = '308' AND brand_id = (SELECT id FROM brands WHERE nom = 'Peugeot')),
  2022,
  'Blanc',
  18200000,
  21000,
  'Essence',
  'Automatique',
  'Peugeot 308 2022, berline française élégante avec technologies avancées.',
  'Disponible'
),

-- Renault Duster
(
  (SELECT id FROM brands WHERE nom = 'Renault'),
  (SELECT id FROM models WHERE nom = 'Duster' AND brand_id = (SELECT id FROM brands WHERE nom = 'Renault')),
  2023,
  'Gris',
  19800000,
  7000,
  'Essence',
  'Manuelle',
  'Renault Duster 2023, SUV robuste et abordable, parfait pour tous terrains.',
  'Disponible'
),

-- Volkswagen Polo
(
  (SELECT id FROM brands WHERE nom = 'Volkswagen'),
  (SELECT id FROM models WHERE nom = 'Polo' AND brand_id = (SELECT id FROM brands WHERE nom = 'Volkswagen')),
  2023,
  'Noir',
  16200000,
  10000,
  'Essence',
  'Automatique',
  'Volkswagen Polo 2023, citadine allemande de qualité avec finitions soignées.',
  'Disponible'
);

-- Vérifier les insertions
SELECT 
  b.nom as marque,
  m.nom as modele,
  v.annee,
  v.couleur,
  v.prix,
  v.statut
FROM vehicles v
JOIN brands b ON v.brand_id = b.id
JOIN models m ON v.model_id = m.id
ORDER BY b.nom, m.nom, v.annee DESC;

-- Statistiques
SELECT 
  COUNT(*) as total_vehicules,
  COUNT(DISTINCT brand_id) as marques_avec_vehicules,
  COUNT(DISTINCT model_id) as modeles_avec_vehicules
FROM vehicles;

-- Message de confirmation
SELECT 'Véhicules d''exemple insérés avec succès !' as message;
