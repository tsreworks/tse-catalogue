# 🔐 Configuration Authentification - TSE Catalogue

## 📋 Vue d'ensemble

Ce guide vous accompagne dans la configuration de l'authentification sécurisée pour les administrateurs TSE avec Supabase Auth.

## 🚀 Étapes de Configuration

### 1. Configuration Supabase Auth

#### Exécution du Script d'Authentification
1. Aller dans **SQL Editor** dans le dashboard Supabase
2. Copier le contenu de `supabase/auth-setup.sql`
3. Exécuter le script pour configurer l'authentification

#### Configuration des Paramètres Auth
1. Aller dans **Authentication > Settings** dans le dashboard
2. Configurer les paramètres suivants :

```
Site URL: http://localhost:3005 (développement)
Redirect URLs: 
  - http://localhost:3005/auth/callback
  - http://localhost:3005/admin

Email Templates:
  - Personnaliser les templates d'email si nécessaire
```

### 2. Compte Administrateur par Défaut

Le script crée automatiquement un compte super administrateur :

```
Email: admin@tse.com
Mot de passe: TseAdmin2025!
Rôle: super_admin
```

**⚠️ IMPORTANT :** Changez ce mot de passe en production !

### 3. Test de l'Authentification

#### Accès à la Page de Connexion
1. Aller sur `http://localhost:3005/auth/login`
2. Utiliser les identifiants par défaut
3. Vérifier la redirection vers `/admin`

#### Test des Protections
1. Essayer d'accéder à `/admin` sans être connecté
2. Vérifier la redirection vers `/auth/login`
3. Tester la déconnexion

## 🏗️ Architecture d'Authentification

### Composants Principaux

#### `AuthService` (`src/lib/auth.ts`)
Service principal pour gérer l'authentification :
- Connexion/déconnexion
- Vérification des permissions
- Gestion des sessions
- Récupération des données utilisateur

#### `AuthContext` (`src/contexts/AuthContext.tsx`)
Contexte React pour l'état d'authentification :
- Provider global
- Hooks d'authentification
- Gestion des erreurs

#### `ProtectedRoute` (`src/components/ProtectedRoute.tsx`)
Composant pour protéger les routes :
- Vérification automatique des permissions
- Redirection si non autorisé
- Support des rôles (admin, super_admin)

#### `LoginForm` (`src/components/LoginForm.tsx`)
Interface de connexion :
- Formulaire sécurisé
- Gestion des erreurs
- Validation côté client

### Pages d'Authentification

#### `/auth/login`
- Page de connexion sécurisée
- Validation des identifiants
- Redirection après connexion

#### `/auth/unauthorized`
- Page d'accès refusé
- Informations sur les permissions
- Actions de récupération

## 🔒 Sécurité

### Row Level Security (RLS)

#### Politiques Configurées
```sql
-- Lecture des données admin (soi-même uniquement)
"Les admins peuvent lire leurs propres données"

-- Modification des données (super_admins uniquement)
"Seuls les super_admins peuvent modifier les admins"

-- CRUD véhicules (admins authentifiés)
"Admins peuvent modifier les véhicules"
```

#### Vérifications d'Accès
- Authentification Supabase requise
- Vérification du statut actif
- Contrôle des rôles par fonction

### Fonctions de Sécurité

#### `is_admin(email)`
Vérifie si un utilisateur est administrateur actif.

#### `get_user_role(email)`
Retourne le rôle d'un utilisateur (admin, super_admin, none).

#### `create_admin_user(...)`
Crée un nouvel utilisateur administrateur de manière sécurisée.

## 👥 Gestion des Utilisateurs

### Rôles Disponibles

#### `admin`
- Accès à l'interface d'administration
- CRUD sur les véhicules, marques, modèles
- Consultation des statistiques

#### `super_admin`
- Tous les droits admin
- Gestion des utilisateurs administrateurs
- Configuration système

### Création d'Utilisateurs

#### Via SQL (recommandé pour le premier utilisateur)
```sql
SELECT create_admin_user(
  'nouvel.admin@tse.com',
  'MotDePasseSecurise123!',
  'Nom',
  'Prénom',
  'admin'
);
```

#### Via Interface (à implémenter)
- Formulaire de création d'utilisateur
- Validation des données
- Envoi d'email d'invitation

## 🔧 Hooks et Utilitaires

### Hooks d'Authentification

#### `useAuthContext()`
```typescript
const { user, loading, error, signIn, signOut } = useAuthContext()
```

#### `useRequireAuth()`
```typescript
const { user, loading } = useRequireAuth()
// Redirige automatiquement si non connecté
```

#### `useRequirePermission(role)`
```typescript
const { hasPermission, checking } = useRequirePermission('super_admin')
// Vérifie les permissions et redirige si insuffisantes
```

### Utilisation dans les Composants

#### Protection d'une Page
```tsx
export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminPageContent />
    </ProtectedRoute>
  )
}
```

#### Vérification Conditionnelle
```tsx
const { user } = useAuthContext()

if (user?.role === 'super_admin') {
  // Afficher options super admin
}
```

## 🧪 Tests d'Authentification

### Tests Manuels

#### Connexion
- [ ] Connexion avec identifiants valides
- [ ] Erreur avec identifiants invalides
- [ ] Redirection après connexion réussie

#### Protection des Routes
- [ ] Accès `/admin` sans connexion → redirection `/auth/login`
- [ ] Accès `/admin` avec connexion → accès autorisé
- [ ] Déconnexion → redirection et perte d'accès

#### Permissions
- [ ] Admin peut accéder à l'interface
- [ ] Super admin a accès complet
- [ ] Utilisateur inactif ne peut pas se connecter

### Tests Automatisés (à implémenter)

#### Tests Unitaires
- Services d'authentification
- Hooks React
- Composants de protection

#### Tests d'Intégration
- Flux de connexion complet
- Vérification des permissions
- Gestion des erreurs

## 🚨 Dépannage

### Erreurs Communes

#### "Accès non autorisé"
- Vérifier que l'utilisateur existe dans `admin_users`
- Vérifier que `actif = true`
- Vérifier les politiques RLS

#### "Variables d'environnement manquantes"
- Vérifier `.env.local`
- Redémarrer le serveur de développement

#### "Erreur de connexion Supabase"
- Vérifier les clés API
- Vérifier la configuration Auth dans Supabase

### Logs de Débogage

#### Côté Client
```typescript
// Activer les logs détaillés
console.log('User:', user)
console.log('Auth state:', { loading, error })
```

#### Côté Supabase
- Consulter les logs dans le dashboard
- Vérifier les requêtes SQL
- Analyser les erreurs RLS

## 🔄 Prochaines Étapes

### Phase 2B - Fonctionnalités Avancées
- [ ] Réinitialisation de mot de passe
- [ ] Changement de mot de passe
- [ ] Gestion des sessions multiples
- [ ] Audit des connexions

### Phase 3 - Interface de Gestion
- [ ] CRUD utilisateurs administrateurs
- [ ] Gestion des rôles et permissions
- [ ] Logs d'activité
- [ ] Notifications de sécurité

## 📞 Support

### Ressources
- **Documentation Supabase Auth** : [docs.supabase.com/auth](https://docs.supabase.com/auth)
- **Next.js Authentication** : [nextjs.org/docs/authentication](https://nextjs.org/docs/authentication)

### Contact
- Équipe de développement TSE
- Support technique Supabase

---

**Dernière mise à jour :** 6 janvier 2025  
**Version :** 2A.0 - Authentification implémentée
