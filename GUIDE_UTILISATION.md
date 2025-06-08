# 📖 Guide d'Utilisation - TSE Catalogue

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18 ou supérieur
- npm ou yarn
- Navigateur web moderne

### Installation
```bash
cd tse-catalogue
npm install
npm run dev
```

L'application sera accessible sur : http://localhost:3000

## 🏠 Page d'Accueil

### Fonctionnalités
- **Présentation de l'entreprise** avec logo TSE
- **Navigation principale** vers le catalogue et l'administration
- **Section fonctionnalités** expliquant les capacités du système
- **Design responsive** adapté mobile et desktop

### Navigation
- **Catalogue** : Accès au catalogue client
- **Administration** : Interface de gestion (back-office)

## 📋 Catalogue Client

### Accès
URL : `/catalogue` ou bouton "Voir le Catalogue" depuis l'accueil

### Fonctionnalités

#### Recherche
- **Barre de recherche** : Recherche textuelle dans marque, modèle, couleur
- **Recherche en temps réel** : Résultats mis à jour automatiquement

#### Filtrage Avancé
Cliquez sur "Filtres" pour accéder aux options :
- **Marque** : Toyota, Ford, Nissan
- **Carburant** : Essence, Diesel, Hybride, Électrique
- **Transmission** : Manuelle, Automatique
- **Année** : Plage d'années (min/max)
- **Prix** : Fourchette de prix en euros
- **Couleur** : Recherche par couleur
- **Statut** : Disponible, Réservé, Vendu, En maintenance

#### Affichage
- **Mode grille** : Cartes véhicules en grille (par défaut)
- **Mode liste** : Affichage en liste compacte
- **Compteur de résultats** : Nombre de véhicules trouvés

#### Cartes Véhicules
Chaque carte affiche :
- **Image** (ou placeholder si pas d'image)
- **Marque et modèle**
- **Année et couleur**
- **Carburant et transmission**
- **Kilométrage** (si disponible)
- **Prix** (si défini)
- **Badge statut** (Disponible, Réservé, etc.)
- **Bouton "Voir détails"** → Accès à la page complète
- **Bouton téléchargement fiche technique** (si disponible)

## 📋 Pages de Détails Véhicules

### Accès
- **Depuis le catalogue** : Clic sur "Voir détails" sur une carte véhicule
- **URL directe** : `/catalogue/[marque-modele-annee]`
- **Exemples** :
  - `/catalogue/toyota-corolla-cross-2023`
  - `/catalogue/ford-territory-2022`

### Structure de la Page

#### En-tête
- **Titre complet** : Marque, modèle, année
- **Informations rapides** : Couleur, carburant, année
- **Badge statut** : Disponible, Réservé, etc.
- **Prix et kilométrage** mis en évidence

#### Navigation
- **Breadcrumb** : Retour au catalogue
- **Actions** : Partager, Imprimer, Télécharger PDF

#### Galerie d'Images
- **Placeholder professionnel** en attendant les vraies photos
- **Message informatif** pour contacter l'équipe

#### Système d'Onglets

##### 1. Vue d'Ensemble
- **Informations rapides** : Carburant, transmission, places, coffre
- **Équipements principaux** : 6 premiers équipements avec lien vers la liste complète
- **Icônes visuelles** pour chaque caractéristique

##### 2. Spécifications Techniques
- **Motorisation** : Puissance, cylindrée, carburant, transmission
- **Performance** : Consommation, émissions CO2
- **Dimensions** : Portes, places, volume coffre
- **Équipements complets** : Liste exhaustive avec puces colorées
- **Informations générales** : Tableau récapitulatif
- **Notes importantes** : Avertissements sur les spécifications

##### 3. Contact
- **Coordonnées TSE** : Téléphone, email, adresse, horaires
- **Formulaire pré-rempli** : Nom, email, téléphone, message personnalisé
- **Récapitulatif véhicule** : Informations du véhicule consulté
- **Services proposés** : Essai, reprise, financement, livraison

#### Sidebar (Desktop)
- **Contact rapide** : Boutons d'appel et email directs
- **Informations véhicule** : Référence, dates, statut
- **Services TSE** : Garantie, contrôle technique, SAV, financement

### Fonctionnalités Avancées

#### Partage
- **Navigateurs modernes** : API Web Share native
- **Fallback** : Copie automatique de l'URL dans le presse-papiers
- **Réseaux sociaux** : Métadonnées Open Graph optimisées

#### Impression
- **Styles optimisés** : Mise en page adaptée au papier
- **Contenu sélectionné** : Informations essentielles uniquement
- **Logo TSE** : Présent sur la version imprimée

#### SEO
- **Métadonnées dynamiques** : Titre et description personnalisés
- **URLs optimisées** : Structure claire et lisible
- **Indexation intelligente** : Selon le statut du véhicule

### Navigation Mobile
- **Interface tactile** : Boutons adaptés au touch
- **Onglets swipables** : Navigation fluide entre les sections
- **Menu collapsible** : Optimisation de l'espace écran

## 🔧 Interface d'Administration

### Accès
URL : `/admin` ou lien "Administration" dans la navigation

### Tableau de Bord

#### Statistiques
- **Total véhicules** : Nombre total dans le catalogue
- **Disponibles** : Véhicules en vente
- **Réservés** : Véhicules réservés par des clients
- **Vendus** : Véhicules vendus
- **Valeur totale du stock** : Valeur financière du stock disponible
- **Métriques** : Taux de disponibilité, prix moyen

#### Gestion des Véhicules

##### Actions Principales
- **Ajouter un véhicule** : Nouveau véhicule au catalogue
- **Importer** : Import en lot (CSV, Excel)
- **Exporter** : Export des données

##### Sélection Multiple
- **Case à cocher** : Sélection individuelle ou globale
- **Actions en lot** : Suppression multiple
- **Compteur de sélection** : Nombre d'éléments sélectionnés

##### Tableau de Gestion
Colonnes affichées :
- **Véhicule** : Image miniature + marque/modèle + détails
- **Prix** : Prix de vente
- **Statut** : Badge coloré selon le statut
- **Date d'ajout** : Date de création de la fiche
- **Actions** : Voir, Modifier, Supprimer

##### Actions par Véhicule
- **👁️ Voir** : Consulter les détails
- **✏️ Modifier** : Éditer la fiche
- **🗑️ Supprimer** : Supprimer du catalogue

## 📄 Fiches Techniques

### Véhicules Disponibles
Le système inclut les fiches techniques pour :
- **Toyota Corolla Cross 2023** (Hybride)
- **Ford Territory 2022** (Essence)
- **Toyota Hilux 2023** (Diesel)
- **Nissan Qashqai 2023** (Essence)

### Téléchargement
- **Bouton téléchargement** sur chaque carte véhicule
- **Fichiers PDF** optimisés pour l'impression
- **Ouverture dans nouvel onglet**

## 🎨 Charte Graphique TSE

### Couleurs Principales
- **Bleu primaire** : #0ea5e9 (boutons, liens)
- **Bleu foncé** : #0369a1 (accents)
- **Gris** : Différentes nuances pour le texte et arrière-plans

### Typographie
- **Titres** : Poppins (font-heading)
- **Texte** : Inter (font-sans)

### Logo
- **Avec fond** : `logo.png`
- **Sans fond** : `logosansfond.png` (utilisé dans l'interface)

## 📱 Responsive Design

### Breakpoints
- **Mobile** : < 768px
- **Tablet** : 768px - 1024px
- **Desktop** : > 1024px

### Adaptations
- **Navigation** : Menu hamburger sur mobile
- **Grille** : 1 colonne mobile, 2-3 colonnes desktop
- **Filtres** : Panel collapsible sur mobile
- **Tableaux** : Scroll horizontal sur mobile

## 🔍 Fonctionnalités de Recherche

### Recherche Textuelle
- **Champs indexés** : Marque, modèle, couleur
- **Recherche partielle** : Résultats même avec mots incomplets
- **Insensible à la casse** : Majuscules/minuscules ignorées

### Filtres Combinés
- **Cumul des filtres** : Tous les filtres s'appliquent ensemble
- **Effacement** : Bouton "Effacer tout" pour reset
- **Filtres actifs** : Affichage des filtres appliqués avec suppression individuelle

## 📊 Données de Démonstration

### Véhicules Inclus
1. **Toyota Corolla Cross 2023**
   - Prix : 28 500 €
   - Kilométrage : 15 000 km
   - Statut : Disponible

2. **Ford Territory 2022**
   - Prix : 32 000 €
   - Kilométrage : 25 000 km
   - Statut : Disponible

3. **Toyota Hilux 2023**
   - Prix : 45 000 €
   - Kilométrage : 8 000 km
   - Statut : Disponible

4. **Nissan Qashqai 2023**
   - Prix : 35 000 €
   - Kilométrage : 12 000 km
   - Statut : Réservé

## 🚀 Prochaines Fonctionnalités

### En Développement
- **Base de données** : Remplacement des données statiques
- **Authentification** : Login administrateur sécurisé
- **Upload d'images** : Ajout de photos véhicules
- **Formulaires** : Création/modification de fiches

### Planifiées
- **Pages détail** : Fiche complète par véhicule
- **Galerie photos** : Multiples images par véhicule
- **Notifications** : Alertes pour nouveaux véhicules
- **Export PDF** : Génération de catalogues

## 📞 Support

Pour toute question ou assistance :
- **Documentation** : Consultez README.md et ROADMAP.md
- **Issues** : Signalez les problèmes rencontrés
- **Contact** : Équipe IT Total Service Equipement

---

**Version :** 1.0.0  
**Dernière mise à jour :** 6 janvier 2025
