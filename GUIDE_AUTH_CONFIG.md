# 🔧 Guide Configuration Authentification - TSE Catalogue

## 🚨 Correction de l'Erreur SQL

L'erreur que vous avez rencontrée est due à une incompatibilité de types dans le script SQL original. Voici la procédure corrigée :

## 📋 Étapes de Configuration Corrigées

### Étape 1 : Exécuter le Script SQL Corrigé

1. **Aller dans Supabase SQL Editor**
2. **Copier et exécuter** le contenu de `supabase/auth-setup-simple.sql` (nouveau fichier corrigé)
3. **Vérifier** que le script s'exécute sans erreur

### Étape 2 : Créer l'Utilisateur Administrateur

#### Option A : Via l'Interface Supabase (Recommandée)

1. **Aller dans Authentication > Users** dans le dashboard Supabase
2. **Cliquer "Add user"**
3. **Remplir les informations** :
   ```
   Email: admin@tse.com
   Password: TseAdmin2025!
   Email Confirm: true (cocher)
   ```
4. **Cliquer "Create user"**

#### Option B : Via SQL (Après création de l'utilisateur)

Une fois l'utilisateur créé via l'interface, exécuter dans SQL Editor :

```sql
-- Créer le profil admin pour l'utilisateur
SELECT create_admin_profile(
  'admin@tse.com',
  'Admin',
  'TSE',
  'super_admin'
);
```

### Étape 3 : Vérification

#### Vérifier que l'utilisateur existe
```sql
-- Vérifier l'utilisateur auth
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'admin@tse.com';

-- Vérifier le profil admin
SELECT * FROM admin_users 
WHERE email = 'admin@tse.com';
```

#### Résultat attendu
- L'utilisateur doit apparaître dans `auth.users`
- Le profil doit apparaître dans `admin_users` avec `actif = true`

## 🔧 Script de Test Rapide

Créez et exécutez ce script dans SQL Editor pour tout configurer d'un coup :

```sql
-- 1. Vérifier si l'utilisateur auth existe
DO $$
DECLARE
  user_exists BOOLEAN;
  user_id UUID;
BEGIN
  -- Vérifier l'existence de l'utilisateur
  SELECT EXISTS(
    SELECT 1 FROM auth.users WHERE email = 'admin@tse.com'
  ) INTO user_exists;
  
  IF NOT user_exists THEN
    RAISE NOTICE 'ATTENTION: Créez d''abord l''utilisateur admin@tse.com via Authentication > Users';
  ELSE
    -- Récupérer l'ID utilisateur
    SELECT id INTO user_id FROM auth.users WHERE email = 'admin@tse.com';
    
    -- Créer ou mettre à jour le profil admin
    INSERT INTO admin_users (id, email, nom, prenom, role, actif)
    VALUES (user_id, 'admin@tse.com', 'Admin', 'TSE', 'super_admin', true)
    ON CONFLICT (email) 
    DO UPDATE SET 
      nom = EXCLUDED.nom,
      prenom = EXCLUDED.prenom,
      role = EXCLUDED.role,
      actif = EXCLUDED.actif,
      updated_at = NOW();
    
    RAISE NOTICE 'Profil admin configuré avec succès pour %', user_id;
  END IF;
END;
$$;
```

## 🧪 Test de Configuration

### Test 1 : Vérification Base de Données
```sql
-- Vérifier la configuration complète
SELECT 
  'auth.users' as table_name,
  COUNT(*) as count,
  string_agg(email, ', ') as emails
FROM auth.users 
WHERE email = 'admin@tse.com'

UNION ALL

SELECT 
  'admin_users' as table_name,
  COUNT(*) as count,
  string_agg(email, ', ') as emails
FROM admin_users 
WHERE email = 'admin@tse.com';
```

### Test 2 : Test des Fonctions
```sql
-- Tester les fonctions d'authentification
SELECT 
  is_admin('admin@tse.com') as is_admin,
  get_user_role('admin@tse.com') as role;
```

### Test 3 : Test de l'Application

1. **Aller sur** : http://localhost:3005/auth/login
2. **Se connecter avec** :
   - Email: `admin@tse.com`
   - Mot de passe: `TseAdmin2025!`
3. **Vérifier** : Redirection vers `/admin`

## 🚨 Dépannage

### Erreur "Utilisateur non trouvé"

**Cause** : L'utilisateur n'existe pas dans `auth.users`

**Solution** :
1. Aller dans Authentication > Users
2. Créer l'utilisateur manuellement
3. Exécuter `create_admin_profile()`

### Erreur "Accès non autorisé"

**Cause** : Le profil admin n'existe pas ou `actif = false`

**Solution** :
```sql
-- Vérifier et corriger le profil
UPDATE admin_users 
SET actif = true, role = 'super_admin'
WHERE email = 'admin@tse.com';
```

### Erreur de Politique RLS

**Cause** : Politiques RLS trop restrictives

**Solution temporaire** :
```sql
-- Désactiver temporairement RLS pour debug
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
-- Réactiver après test
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
```

## 📝 Checklist de Configuration

### Base de Données
- [ ] Script `auth-setup-simple.sql` exécuté sans erreur
- [ ] Fonctions `is_admin` et `get_user_role` créées
- [ ] Politiques RLS configurées

### Utilisateur Admin
- [ ] Utilisateur créé dans Authentication > Users
- [ ] Email confirmé (important !)
- [ ] Profil admin créé dans `admin_users`
- [ ] `actif = true` et `role = 'super_admin'`

### Tests
- [ ] Connexion réussie sur `/auth/login`
- [ ] Redirection vers `/admin` après connexion
- [ ] Interface admin affiche les infos utilisateur
- [ ] Déconnexion fonctionne

## 🎯 Résultat Final

Une fois la configuration terminée, vous devriez avoir :

```sql
-- Dans auth.users
id: [UUID]
email: admin@tse.com
email_confirmed_at: [timestamp]

-- Dans admin_users  
id: [même UUID]
email: admin@tse.com
nom: Admin
prenom: TSE
role: super_admin
actif: true
```

## 🚀 Prochaines Étapes

Une fois l'authentification configurée :

1. **Tester la connexion** complète
2. **Vérifier les permissions** admin
3. **Passer à la Phase 3** - Fonctionnalités avancées

---

**Important** : Utilisez le fichier `auth-setup-simple.sql` au lieu de `auth-setup.sql` pour éviter les erreurs de types.
