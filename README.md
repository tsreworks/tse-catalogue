# TSE Catalogue - Total Service Equipement

## 📋 Description

Catalogue numérique pour les véhicules de Total Service Equipement (TSE). Cette application web moderne permet de gérer et consulter l'inventaire de véhicules avec une interface client et un back-office administrateur.

## 🚀 Fonctionnalités

### Site Client
- ✅ Page d'accueil avec présentation de l'entreprise
- ✅ Catalogue de véhicules avec filtrage avancé
- ✅ Recherche par marque, modèle, année, couleur, carburant
- ✅ Affichage en grille ou liste
- ✅ **Pages de détails véhicules complètes**
- ✅ **URLs dynamiques** `/catalogue/[marque-modele-annee]`
- ✅ **Spécifications techniques détaillées**
- ✅ **Galerie d'images** (avec placeholder)
- ✅ **Métadonnées SEO dynamiques**
- ✅ **Fonctions de partage et impression**
- ✅ **Formulaire de contact intégré**
- ✅ Téléchargement des fiches techniques
- ✅ Design responsive (mobile/desktop)

### Back-office Administrateur
- ✅ Interface d'administration
- ✅ Gestion CRUD des véhicules
- ✅ Sélection multiple et actions en lot
- ✅ Upload de photos et documents
- ✅ Gestion des statuts (Disponible, Vendu, Réservé, En maintenance)

## 🛠️ Technologies

- **Framework**: Next.js 15 avec TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Base de données**: Prêt pour Supabase
- **Déploiement**: Vercel/Netlify ready

## 🎨 Design

Le design respecte la charte graphique de TSE avec :
- Logo officiel intégré (avec et sans fond)
- Palette de couleurs cohérente
- Typographie moderne (Inter + Poppins)
- Interface intuitive et professionnelle

## 📁 Structure du Projet

```
tse-catalogue/
├── src/
│   ├── app/                    # Pages Next.js App Router
│   │   ├── page.tsx           # Page d'accueil
│   │   ├── catalogue/         # Catalogue client
│   │   │   ├── page.tsx       # Liste des véhicules
│   │   │   └── [slug]/        # Pages de détails dynamiques
│   │   │       ├── page.tsx   # Page de détails véhicule
│   │   │       └── not-found.tsx # Page 404 personnalisée
│   │   ├── admin/             # Interface administrateur
│   │   ├── layout.tsx         # Layout principal
│   │   └── globals.css        # Styles globaux
│   ├── components/            # Composants réutilisables
│   │   ├── VehicleCard.tsx    # Carte véhicule
│   │   ├── VehicleDetailPage.tsx # Page de détails complète
│   │   ├── VehicleSpecs.tsx   # Spécifications techniques
│   │   ├── VehicleContact.tsx # Formulaire de contact
│   │   ├── VehicleFilters.tsx # Filtres avancés
│   │   └── AdminStats.tsx     # Statistiques admin
│   ├── lib/                   # Utilitaires
│   │   ├── utils.ts           # Fonctions helper
│   │   └── vehicles-data.ts   # Données centralisées
│   └── types/                 # Types TypeScript
│       └── vehicle.ts         # Types véhicules
├── public/
│   └── images/                # Assets statiques
│       ├── logo.png           # Logo avec fond
│       └── logosansfond.png   # Logo sans fond
└── ...
```

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation
```bash
cd tse-catalogue
npm install
```

### Développement
```bash
npm run dev
```
L'application sera accessible sur http://localhost:3000

### Production
```bash
npm run build
npm start
```

## 📊 Données de Démonstration

L'application inclut des données de démonstration avec :
- Toyota Corolla Cross 2023 (Hybride)
- Ford Territory 2022 (Essence)
- Toyota Hilux 2023 (Diesel)

## 🔄 Prochaines Étapes

### Phase 2 - Base de Données
- [ ] Intégration Supabase
- [ ] Schéma de base de données
- [ ] API endpoints
- [ ] Authentification admin

### Phase 3 - Fonctionnalités Avancées
- [ ] Upload d'images
- [ ] Gestion des fiches techniques PDF
- [ ] Système de notifications
- [ ] Statistiques et analytics

### Phase 4 - Optimisations
- [ ] SEO et métadonnées
- [ ] Performance et caching
- [ ] Tests automatisés
- [ ] Déploiement automatique

## 👥 Équipe

- **Directeur IT**: Gestion de projet et spécifications
- **Développement**: Augment Agent (Assistant IA)

## 📞 Support

Pour toute question ou assistance, contactez l'équipe IT de Total Service Equipement.

---

**Total Service Equipement** - Votre partenaire véhicules
"# tse-catalogue" 
"# tse-catalogue" 
