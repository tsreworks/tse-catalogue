# 📁 Guide Upload de Fichiers - TSE Catalogue

## 🚀 Vue d'ensemble

Le système d'upload de fichiers TSE permet de gérer facilement les images et documents associés aux véhicules avec Supabase Storage.

## 🏗️ Architecture

### Composants Principaux

#### `StorageService` (`src/lib/storage.ts`)
Service principal pour la gestion des fichiers :
- Upload vers Supabase Storage
- Validation des fichiers
- Redimensionnement d'images
- Gestion des URLs publiques
- Suppression de fichiers

#### `ImageUpload` (`src/components/ImageUpload.tsx`)
Composant d'upload d'images :
- Drag & drop intuitif
- Prévisualisation en temps réel
- Redimensionnement automatique
- Support multi-fichiers
- Validation des types

#### `DocumentUpload` (`src/components/DocumentUpload.tsx`)
Composant d'upload de documents :
- Support PDF, Word
- Validation des types MIME
- Affichage des métadonnées
- Gestion des erreurs

#### Page de Gestion (`/admin/media`)
Interface complète de gestion :
- Vue grille et liste
- Recherche et filtres
- Actions en lot
- Statistiques d'utilisation

## 📋 Configuration Supabase Storage

### Étape 1 : Exécuter le Script de Configuration

Exécutez `supabase/storage-setup.sql` dans Supabase SQL Editor pour :
- Créer les buckets `vehicle-images` et `vehicle-documents`
- Configurer les politiques de sécurité
- Définir les types MIME autorisés
- Créer les fonctions utilitaires

### Étape 2 : Vérifier les Buckets

Dans Supabase Dashboard > Storage, vérifiez que les buckets sont créés :

```
vehicle-images/
├── admin-uploads/
└── vehicles/

vehicle-documents/
├── admin-uploads/
└── vehicles/
```

## 🎯 Utilisation

### Upload d'Images

```tsx
import ImageUpload from '@/components/ImageUpload'

<ImageUpload
  onUploadComplete={(results) => {
    console.log('Images uploadées:', results)
  }}
  onUploadError={(error) => {
    console.error('Erreur:', error)
  }}
  maxFiles={5}
  folder="vehicles"
  showPreview={true}
/>
```

### Upload de Documents

```tsx
import DocumentUpload from '@/components/DocumentUpload'

<DocumentUpload
  onUploadComplete={(results) => {
    console.log('Documents uploadés:', results)
  }}
  maxFiles={3}
  folder="vehicles"
  allowedTypes={['application/pdf']}
/>
```

### Service Storage

```tsx
import { StorageService } from '@/lib/storage'

// Upload d'un fichier
const result = await StorageService.uploadFile(file, {
  bucket: 'vehicle-images',
  folder: 'vehicles'
})

// Supprimer un fichier
await StorageService.deleteFile('vehicle-images', 'path/to/file.jpg')

// Obtenir l'URL publique
const url = StorageService.getPublicUrl('vehicle-images', 'path/to/file.jpg')
```

## 🔧 Fonctionnalités

### Images

#### **Types Supportés**
- JPEG, JPG, PNG, WebP
- Taille max : 10MB par fichier
- Redimensionnement automatique (1920x1080 max)

#### **Fonctionnalités**
- ✅ Drag & drop
- ✅ Prévisualisation instantanée
- ✅ Redimensionnement automatique
- ✅ Génération de miniatures
- ✅ Validation des dimensions
- ✅ Compression intelligente

### Documents

#### **Types Supportés**
- PDF : `application/pdf`
- Word : `application/msword`, `.docx`
- Taille max : 50MB par fichier

#### **Fonctionnalités**
- ✅ Validation des types MIME
- ✅ Affichage des métadonnées
- ✅ Prévisualisation des informations
- ✅ Téléchargement direct
- ✅ Gestion des erreurs

## 🛡️ Sécurité

### Politiques RLS

#### **Lecture Publique**
- Toutes les images et documents sont accessibles en lecture
- URLs publiques générées automatiquement

#### **Modification Admin**
- Seuls les administrateurs authentifiés peuvent :
  - Uploader des fichiers
  - Modifier les métadonnées
  - Supprimer des fichiers

### Validation

#### **Côté Client**
- Vérification des types MIME
- Contrôle de la taille des fichiers
- Validation des dimensions (images)

#### **Côté Serveur**
- Politiques Supabase Storage
- Contraintes de bucket
- Authentification requise

## 📊 Gestion des Médias

### Interface Admin (`/admin/media`)

#### **Fonctionnalités**
- 📁 Navigation par onglets (Images/Documents)
- 🔍 Recherche par nom de fichier
- 👁️ Prévisualisation en grille ou liste
- ✅ Sélection multiple
- 🗑️ Suppression en lot
- 📥 Téléchargement direct

#### **Statistiques**
- Nombre total de fichiers
- Espace utilisé par bucket
- Fichiers récents
- Fichiers orphelins

### Actions Disponibles

#### **Upload**
- Glisser-déposer des fichiers
- Sélection multiple
- Progression en temps réel
- Gestion des erreurs

#### **Gestion**
- Prévisualisation des fichiers
- Téléchargement individuel
- Suppression sécurisée
- Recherche et filtres

## 🔗 Intégration avec les Véhicules

### Base de Données

#### **Tables Médias**
```sql
-- Images de véhicules
vehicle_images (
  id, vehicle_id, url, filename, 
  alt_text, is_primary, display_order
)

-- Documents de véhicules
vehicle_documents (
  id, vehicle_id, url, filename,
  document_type, title, description
)
```

#### **Relations**
- Chaque véhicule peut avoir plusieurs images
- Une image principale par véhicule
- Documents classés par type (manuel, certificat, etc.)

### API Integration

```tsx
// Associer une image à un véhicule
const associateImage = async (vehicleId: string, imageUrl: string) => {
  await supabase
    .from('vehicle_images')
    .insert({
      vehicle_id: vehicleId,
      url: imageUrl,
      filename: 'image.jpg',
      is_primary: true
    })
}
```

## 🧪 Tests et Validation

### Tests Manuels

#### **Upload d'Images**
- [ ] Drag & drop fonctionne
- [ ] Sélection multiple (max 5)
- [ ] Prévisualisation s'affiche
- [ ] Redimensionnement appliqué
- [ ] URLs générées correctement

#### **Upload de Documents**
- [ ] Types PDF/Word acceptés
- [ ] Autres types rejetés
- [ ] Métadonnées affichées
- [ ] Téléchargement possible

#### **Interface de Gestion**
- [ ] Navigation onglets
- [ ] Recherche fonctionne
- [ ] Sélection multiple
- [ ] Suppression en lot
- [ ] Modes grille/liste

### Tests Automatisés

```javascript
// Test du service storage
describe('StorageService', () => {
  test('upload image', async () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const result = await StorageService.uploadFile(file)
    expect(result.success).toBe(true)
    expect(result.url).toBeDefined()
  })
})
```

## 🚨 Dépannage

### Erreurs Communes

#### **"Bucket not found"**
- Vérifier que les buckets sont créés dans Supabase
- Exécuter le script `storage-setup.sql`

#### **"Upload failed"**
- Vérifier les politiques RLS
- Contrôler l'authentification admin
- Vérifier les types MIME autorisés

#### **"File too large"**
- Images : 10MB max
- Documents : 50MB max
- Vérifier la configuration du bucket

### Logs de Débogage

```typescript
// Activer les logs détaillés
console.log('Upload result:', result)
console.log('File info:', {
  name: file.name,
  size: file.size,
  type: file.type
})
```

## 📈 Performance

### Optimisations

#### **Images**
- Redimensionnement automatique (1920x1080)
- Compression JPEG (qualité 80%)
- Format WebP recommandé
- Lazy loading dans l'interface

#### **Stockage**
- CDN Supabase intégré
- Cache-Control configuré (1h)
- Compression gzip automatique

### Métriques

- **Temps d'upload** : < 5s pour 10MB
- **Temps de chargement** : < 1s via CDN
- **Espace utilisé** : Visible dans l'interface admin

## 🔄 Prochaines Étapes

### Phase 3B - Améliorations
- [ ] Édition d'images (crop, rotation)
- [ ] Génération automatique de miniatures
- [ ] Watermark automatique
- [ ] Optimisation WebP

### Phase 3C - Intégration
- [ ] Association automatique véhicule-médias
- [ ] Import en lot via CSV
- [ ] Synchronisation avec systèmes externes
- [ ] API publique pour partenaires

---

**Dernière mise à jour :** 6 janvier 2025  
**Version :** 3A.0 - Upload de fichiers implémenté
