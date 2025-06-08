# 🗄️ Configuration Supabase - TSE Catalogue

## 📋 Vue d'ensemble

Ce guide vous accompagne dans la configuration de Supabase pour remplacer les données statiques par une vraie base de données PostgreSQL.

## 🚀 Étapes de Configuration

### 1. Création du Projet Supabase

1. **Créer un compte** sur [supabase.com](https://supabase.com)
2. **Créer un nouveau projet** :
   - Nom : `tse-catalogue`
   - Région : Europe (eu-central-1) recommandée
   - Mot de passe de base de données : Générer un mot de passe fort

### 2. Configuration de la Base de Données

#### Exécution du Schéma
1. Aller dans **SQL Editor** dans le dashboard Supabase
2. Copier le contenu de `supabase/schema.sql`
3. Exécuter le script pour créer toutes les tables

#### Insertion des Données de Démonstration
1. Dans **SQL Editor**, créer une nouvelle requête
2. Copier le contenu de `supabase/seed.sql`
3. Exécuter le script pour insérer les données de test

### 3. Configuration des Variables d'Environnement

#### Récupération des Clés
1. Aller dans **Settings > API** dans le dashboard
2. Copier les valeurs suivantes :
   - **Project URL** : `https://your-project.supabase.co`
   - **anon public** : Clé publique pour le client
   - **service_role** : Clé privée pour l'admin (⚠️ À garder secrète)

#### Configuration Locale
1. Copier `.env.example` vers `.env.local`
2. Remplir les variables :

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Activer Supabase (optionnel, par défaut false)
NEXT_PUBLIC_USE_SUPABASE=true
```

### 4. Configuration du Storage (Optionnel)

#### Pour les Images et Documents
1. Aller dans **Storage** dans le dashboard
2. Créer un bucket `vehicle-images` :
   - Public : `true`
   - Allowed MIME types : `image/*`
3. Créer un bucket `vehicle-documents` :
   - Public : `true`
   - Allowed MIME types : `application/pdf`

#### Politiques de Sécurité
```sql
-- Politique pour les images (lecture publique)
CREATE POLICY "Images publiques en lecture" ON storage.objects
FOR SELECT USING (bucket_id = 'vehicle-images');

-- Politique pour les documents (lecture publique)
CREATE POLICY "Documents publiques en lecture" ON storage.objects
FOR SELECT USING (bucket_id = 'vehicle-documents');
```

## 🔧 Architecture de la Base de Données

### Tables Principales

#### `brands` - Marques
- `id` : UUID (PK)
- `nom` : Nom de la marque (unique)
- `logo` : URL du logo
- `description` : Description optionnelle

#### `models` - Modèles
- `id` : UUID (PK)
- `nom` : Nom du modèle
- `brand_id` : Référence vers la marque (FK)
- `description` : Description optionnelle

#### `vehicles` - Véhicules
- `id` : UUID (PK)
- `brand_id`, `model_id` : Références (FK)
- `annee`, `couleur`, `prix`, `kilometrage`
- `carburant`, `transmission`, `statut`
- `description` : Description détaillée
- Caractéristiques techniques : `puissance`, `cylindree`, etc.

#### `equipments` - Équipements
- `id` : UUID (PK)
- `nom` : Nom de l'équipement
- `categorie` : Catégorie (Confort, Sécurité, etc.)

#### `vehicle_equipments` - Liaison Many-to-Many
- `vehicle_id`, `equipment_id` : Clés composites

#### `vehicle_images` - Images
- `id` : UUID (PK)
- `vehicle_id` : Référence véhicule (FK)
- `url` : URL de l'image
- `est_principale` : Image principale (unique par véhicule)

#### `vehicle_documents` - Documents
- `id` : UUID (PK)
- `vehicle_id` : Référence véhicule (FK)
- `type_document` : Type (fiche_technique, manuel, etc.)
- `url` : URL du document

### Relations
```
brands (1) ←→ (N) models (1) ←→ (N) vehicles
vehicles (1) ←→ (N) vehicle_images
vehicles (1) ←→ (N) vehicle_documents
vehicles (N) ←→ (N) equipments (via vehicle_equipments)
```

## 🔄 Migration Progressive

### Mode Hybride
L'application supporte un mode hybride avec fallback :

1. **Supabase activé** (`NEXT_PUBLIC_USE_SUPABASE=true`) :
   - Utilise la base de données Supabase
   - Fallback vers données statiques en cas d'erreur

2. **Mode statique** (par défaut) :
   - Utilise les données de `vehicles-data.ts`
   - Aucune dépendance externe

### Activation Progressive
```typescript
// Dans data-adapter.ts
const USE_SUPABASE = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true'
```

## 🛡️ Sécurité

### Row Level Security (RLS)
- **Activé** sur toutes les tables
- **Lecture publique** pour le catalogue client
- **Écriture restreinte** aux administrateurs authentifiés

### Politiques Configurées
- Lecture publique : `brands`, `models`, `vehicles`, `equipments`
- Écriture admin : Authentification requise (à implémenter)

## 🧪 Tests et Validation

### Vérification de la Configuration
1. **Test de connexion** :
```bash
cd tse-catalogue
npm run dev
```

2. **Test des APIs** :
```bash
curl http://localhost:3000/api/vehicles
curl http://localhost:3000/api/brands
curl http://localhost:3000/api/models
```

3. **Vérification des données** :
   - Aller sur `/catalogue`
   - Vérifier que les véhicules s'affichent
   - Tester les filtres

### Debugging
- **Logs Supabase** : Dashboard > Logs
- **Erreurs API** : Console navigateur
- **Variables d'environnement** : Vérifier `.env.local`

## 📊 Monitoring

### Métriques Importantes
- **Requêtes par minute** : Dashboard Supabase
- **Temps de réponse** : Network tab navigateur
- **Erreurs** : Logs d'application

### Limites du Plan Gratuit
- **Base de données** : 500 MB
- **Bandwidth** : 5 GB/mois
- **Requêtes** : 50,000/mois

## 🔄 Prochaines Étapes

### Phase 2A - Authentification
- [ ] Configuration Supabase Auth
- [ ] Login administrateur
- [ ] Protection des routes admin

### Phase 2B - Upload de Fichiers
- [ ] Configuration Storage
- [ ] Upload d'images véhicules
- [ ] Upload de documents PDF

### Phase 2C - Fonctionnalités Avancées
- [ ] Recherche full-text
- [ ] Cache et optimisations
- [ ] Backup automatique

## 🆘 Dépannage

### Erreurs Communes

#### "Variables d'environnement manquantes"
- Vérifier `.env.local`
- Redémarrer le serveur de développement

#### "Erreur de connexion Supabase"
- Vérifier l'URL du projet
- Vérifier les clés API
- Vérifier la connectivité réseau

#### "Tables non trouvées"
- Exécuter `schema.sql` dans SQL Editor
- Vérifier les permissions RLS

### Support
- **Documentation Supabase** : [docs.supabase.com](https://docs.supabase.com)
- **Discord Supabase** : Support communautaire
- **GitHub Issues** : Pour les bugs spécifiques

---

**Dernière mise à jour :** 6 janvier 2025  
**Version :** 2.0.0 - Intégration Supabase
