# 🚗 Installation des Logos de Marques

Ce guide vous explique comment installer les logos des marques de véhicules dans le catalogue TSE.

## 🎯 Méthodes d'Installation

### Méthode 1 : Script Automatique (Recommandé)

```bash
# Depuis le dossier racine du projet
cd tse-catalogue
node scripts/download-brand-logos.js
```

Cette méthode télécharge automatiquement les logos depuis Wikimedia Commons.

### Méthode 2 : Installation Manuelle

1. **Créer le dossier** (s'il n'existe pas) :
   ```bash
   mkdir -p public/images/brands
   ```

2. **Télécharger les logos** depuis les sources officielles ou Wikimedia Commons

3. **Nommer les fichiers** selon la convention :
   - `toyota.png`
   - `nissan.png`
   - `hyundai.png`
   - etc.

4. **Placer les fichiers** dans `public/images/brands/`

## 📋 Liste des Logos Prioritaires

### 🥇 Priorité 1 (Très populaires en Côte d'Ivoire)
- ✅ Toyota
- ✅ Nissan  
- ✅ Honda
- ✅ Hyundai
- ✅ Kia
- ✅ Peugeot
- ✅ Renault

### 🥈 Priorité 2 (Populaires)
- ✅ Volkswagen
- ✅ BMW
- ✅ Mercedes-Benz
- ✅ Audi
- ✅ Ford
- ✅ Mazda
- ✅ Mitsubishi
- ✅ Suzuki
- ✅ Citroën

### 🥉 Priorité 3 (Autres marques)
- Chevrolet
- Jeep
- Fiat
- Volvo
- Skoda
- SEAT
- Opel
- Land Rover
- Lexus
- Infiniti
- Acura
- Cadillac
- Subaru
- Isuzu
- Tata
- Mahindra
- Chery
- BYD
- Geely

## 🔧 Spécifications Techniques

### Format des Logos
- **Extension** : `.png` (avec transparence)
- **Taille** : 200x200px minimum
- **Qualité** : Haute résolution
- **Fond** : Transparent de préférence

### Convention de Nommage
- **Format** : `[marque-en-minuscules].png`
- **Exemples** :
  - Mercedes-Benz → `mercedes.png`
  - Land Rover → `landrover.png`
  - BMW → `bmw.png`

## 🌐 Sources de Logos Recommandées

### 1. Wikimedia Commons (Libre de droits)
```
https://commons.wikimedia.org/wiki/Category:Automobile_logos
```

### 2. Sites Officiels des Constructeurs
- Toyota : https://www.toyota.com
- Nissan : https://www.nissan.com
- etc.

### 3. Logos de Qualité
- Logos-world.net (pour référence)
- Brandslogos.net
- Worldvectorlogo.com

## 📁 Structure des Fichiers

```
public/
└── images/
    └── brands/
        ├── toyota.png
        ├── nissan.png
        ├── honda.png
        ├── hyundai.png
        ├── kia.png
        ├── peugeot.png
        ├── renault.png
        ├── volkswagen.png
        ├── bmw.png
        ├── mercedes.png
        ├── audi.png
        ├── ford.png
        ├── mazda.png
        ├── mitsubishi.png
        ├── suzuki.png
        ├── citroen.png
        ├── chevrolet.png
        ├── jeep.png
        ├── fiat.png
        ├── volvo.png
        └── default.svg (logo par défaut)
```

## 🚀 Après Installation

### 1. Exécuter le Script de Base de Données

```sql
-- Dans Supabase SQL Editor
-- Exécuter le fichier : supabase/insert-brands-local-logos.sql
```

### 2. Vérifier l'Affichage

1. Aller sur http://localhost:3007/catalogue
2. Vérifier que les logos s'affichent correctement
3. Les marques sans logo afficheront une icône de voiture générique

### 3. Optimisation (Optionnel)

```bash
# Optimiser les images PNG
npm install -g imagemin-cli imagemin-pngquant
imagemin public/images/brands/*.png --out-dir=public/images/brands/ --plugin=pngquant
```

## 🔍 Dépannage

### Logo ne s'affiche pas
1. Vérifier le nom du fichier (minuscules, pas d'espaces)
2. Vérifier l'extension (.png)
3. Vérifier les permissions du fichier
4. Vider le cache du navigateur

### Logo de mauvaise qualité
1. Télécharger une version haute résolution
2. Redimensionner à 200x200px minimum
3. Convertir en PNG avec transparence

### Marque manquante
1. Ajouter la marque dans la base de données
2. Télécharger le logo correspondant
3. Nommer selon la convention

## 📝 Notes Légales

Les logos des marques automobiles sont la propriété intellectuelle de leurs détenteurs respectifs. Ils sont utilisés ici dans un contexte commercial légitime pour l'identification des produits.

## 🆘 Support

Si vous rencontrez des problèmes :
1. Vérifiez ce guide
2. Consultez les logs du navigateur (F12)
3. Vérifiez la console Next.js
4. Contactez l'équipe de développement

---

**Bonne installation ! 🚗✨**
