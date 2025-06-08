# 🧪 Tests API - TSE Catalogue

## 📋 Endpoints à Tester

### APIs Véhicules

#### GET /api/vehicles
```bash
# Tous les véhicules
curl http://localhost:3000/api/vehicles

# Avec filtres
curl "http://localhost:3000/api/vehicles?marque=Toyota&carburant=Hybride"

# Avec pagination
curl "http://localhost:3000/api/vehicles?page=1&limit=5"

# Recherche textuelle
curl "http://localhost:3000/api/vehicles?recherche=Toyota"
```

#### GET /api/vehicles/[id]
```bash
# Véhicule spécifique (remplacer par un vrai ID)
curl http://localhost:3000/api/vehicles/880e8400-e29b-41d4-a716-446655440001
```

#### POST /api/vehicles
```bash
# Créer un nouveau véhicule
curl -X POST http://localhost:3000/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{
    "brand_id": "550e8400-e29b-41d4-a716-446655440001",
    "model_id": "660e8400-e29b-41d4-a716-446655440001",
    "annee": 2024,
    "couleur": "Bleu",
    "prix": 30000,
    "kilometrage": 5000,
    "carburant": "Hybride",
    "transmission": "Automatique",
    "description": "Véhicule de test",
    "statut": "Disponible"
  }'
```

#### PUT /api/vehicles/[id]
```bash
# Mettre à jour un véhicule
curl -X PUT http://localhost:3000/api/vehicles/[ID] \
  -H "Content-Type: application/json" \
  -d '{
    "prix": 29000,
    "statut": "Réservé"
  }'
```

#### DELETE /api/vehicles/[id]
```bash
# Supprimer un véhicule
curl -X DELETE http://localhost:3000/api/vehicles/[ID]
```

### APIs Marques

#### GET /api/brands
```bash
# Toutes les marques
curl http://localhost:3000/api/brands
```

#### POST /api/brands
```bash
# Créer une nouvelle marque
curl -X POST http://localhost:3000/api/brands \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Peugeot",
    "description": "Constructeur automobile français"
  }'
```

### APIs Modèles

#### GET /api/models
```bash
# Tous les modèles
curl http://localhost:3000/api/models

# Modèles d'une marque spécifique
curl "http://localhost:3000/api/models?brandId=550e8400-e29b-41d4-a716-446655440001"
```

#### POST /api/models
```bash
# Créer un nouveau modèle
curl -X POST http://localhost:3000/api/models \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Prius",
    "brand_id": "550e8400-e29b-41d4-a716-446655440001",
    "description": "Véhicule hybride pionnier"
  }'
```

## 🔧 Tests avec JavaScript

### Test de Base
```javascript
// Test simple de l'API véhicules
async function testVehiclesAPI() {
  try {
    const response = await fetch('/api/vehicles');
    const data = await response.json();
    console.log('Véhicules récupérés:', data);
  } catch (error) {
    console.error('Erreur:', error);
  }
}

testVehiclesAPI();
```

### Test avec Filtres
```javascript
// Test avec filtres
async function testVehiclesWithFilters() {
  const params = new URLSearchParams({
    marque: 'Toyota',
    carburant: 'Hybride',
    page: '1',
    limit: '5'
  });
  
  try {
    const response = await fetch(`/api/vehicles?${params}`);
    const data = await response.json();
    console.log('Véhicules filtrés:', data);
  } catch (error) {
    console.error('Erreur:', error);
  }
}

testVehiclesWithFilters();
```

### Test de Création
```javascript
// Test de création d'un véhicule
async function testCreateVehicle() {
  const vehicleData = {
    brand_id: "550e8400-e29b-41d4-a716-446655440001",
    model_id: "660e8400-e29b-41d4-a716-446655440001",
    annee: 2024,
    couleur: "Vert",
    prix: 32000,
    carburant: "Hybride",
    transmission: "Automatique",
    description: "Véhicule de test créé via API"
  };
  
  try {
    const response = await fetch('/api/vehicles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vehicleData)
    });
    
    const data = await response.json();
    console.log('Véhicule créé:', data);
  } catch (error) {
    console.error('Erreur:', error);
  }
}

testCreateVehicle();
```

## 📊 Réponses Attendues

### GET /api/vehicles (Succès)
```json
{
  "vehicles": [
    {
      "id": "880e8400-e29b-41d4-a716-446655440001",
      "brand_id": "550e8400-e29b-41d4-a716-446655440001",
      "model_id": "660e8400-e29b-41d4-a716-446655440001",
      "annee": 2023,
      "couleur": "Blanc",
      "prix": 28500,
      "carburant": "Hybride",
      "brand": {
        "nom": "Toyota"
      },
      "model": {
        "nom": "Corolla Cross"
      }
    }
  ],
  "total": 4,
  "page": 1,
  "limit": 12,
  "totalPages": 1
}
```

### POST /api/vehicles (Succès)
```json
{
  "id": "new-vehicle-id",
  "brand_id": "550e8400-e29b-41d4-a716-446655440001",
  "model_id": "660e8400-e29b-41d4-a716-446655440001",
  "annee": 2024,
  "couleur": "Bleu",
  "prix": 30000,
  "created_at": "2025-01-06T12:00:00Z"
}
```

### Erreur 400 (Données Manquantes)
```json
{
  "error": "Le champ brand_id est requis"
}
```

### Erreur 404 (Véhicule Non Trouvé)
```json
{
  "error": "Véhicule non trouvé"
}
```

### Erreur 500 (Erreur Serveur)
```json
{
  "error": "Erreur lors de la récupération des véhicules"
}
```

## 🔍 Validation des Données

### Champs Requis pour POST /api/vehicles
- `brand_id` : UUID de la marque
- `model_id` : UUID du modèle
- `annee` : Année (nombre)
- `couleur` : Couleur (string)
- `carburant` : Enum ('Essence', 'Diesel', 'Hybride', 'Électrique')
- `transmission` : Enum ('Manuelle', 'Automatique')

### Champs Optionnels
- `prix` : Prix en euros (nombre)
- `kilometrage` : Kilométrage (nombre)
- `description` : Description (string)
- `statut` : Statut (défaut: 'Disponible')
- Caractéristiques techniques : `puissance`, `cylindree`, etc.

## 🚨 Cas d'Erreur à Tester

### Données Invalides
```bash
# Carburant invalide
curl -X POST http://localhost:3000/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{
    "brand_id": "550e8400-e29b-41d4-a716-446655440001",
    "model_id": "660e8400-e29b-41d4-a716-446655440001",
    "annee": 2024,
    "couleur": "Bleu",
    "carburant": "Nucléaire",
    "transmission": "Automatique"
  }'
```

### ID Inexistant
```bash
# Véhicule inexistant
curl http://localhost:3000/api/vehicles/00000000-0000-0000-0000-000000000000
```

### Marque Inexistante
```bash
# Référence vers marque inexistante
curl -X POST http://localhost:3000/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{
    "brand_id": "00000000-0000-0000-0000-000000000000",
    "model_id": "660e8400-e29b-41d4-a716-446655440001",
    "annee": 2024,
    "couleur": "Bleu",
    "carburant": "Essence",
    "transmission": "Automatique"
  }'
```

## ✅ Checklist de Test

### Tests de Base
- [ ] GET /api/vehicles retourne la liste
- [ ] GET /api/vehicles/[id] retourne un véhicule
- [ ] GET /api/brands retourne les marques
- [ ] GET /api/models retourne les modèles

### Tests de Filtrage
- [ ] Filtrage par marque fonctionne
- [ ] Filtrage par carburant fonctionne
- [ ] Recherche textuelle fonctionne
- [ ] Pagination fonctionne

### Tests de Création
- [ ] POST /api/vehicles crée un véhicule
- [ ] POST /api/brands crée une marque
- [ ] POST /api/models crée un modèle

### Tests de Modification
- [ ] PUT /api/vehicles/[id] modifie un véhicule
- [ ] DELETE /api/vehicles/[id] supprime un véhicule

### Tests d'Erreur
- [ ] Données manquantes retournent 400
- [ ] ID inexistant retourne 404
- [ ] Données invalides retournent 400
- [ ] Erreurs serveur retournent 500

## 📝 Notes

### Mode de Test
- **Avec Supabase** : Définir `NEXT_PUBLIC_USE_SUPABASE=true`
- **Mode statique** : Laisser la variable vide ou `false`

### Debugging
- Vérifier les logs dans la console du navigateur
- Utiliser l'onglet Network pour voir les requêtes
- Vérifier les logs Supabase dans le dashboard

---

**Dernière mise à jour :** 6 janvier 2025  
**Version :** 2.0.0 - APIs Supabase
