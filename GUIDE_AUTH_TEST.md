# 🧪 Guide de Test - Authentification TSE

## 🚀 Tests à Effectuer

### Étape 1 : Configuration Supabase Auth

1. **Aller dans Supabase SQL Editor**
2. **Copier et exécuter** le contenu de `supabase/auth-setup.sql`
3. **Vérifier** que l'utilisateur admin a été créé

### Étape 2 : Tests de Base

#### Test 1 : Page de Connexion
- **URL** : http://localhost:3005/auth/login
- **Vérifier** : Formulaire de connexion s'affiche
- **Éléments** : Email, mot de passe, bouton "Se connecter"

#### Test 2 : Protection des Routes
- **URL** : http://localhost:3005/admin
- **Vérifier** : Redirection ou message "Vérification des permissions"
- **Résultat attendu** : Accès bloqué sans authentification

#### Test 3 : Connexion Administrateur
- **Aller sur** : http://localhost:3005/auth/login
- **Identifiants** :
  ```
  Email: admin@tse.com
  Mot de passe: TseAdmin2025!
  ```
- **Vérifier** : Redirection vers `/admin` après connexion

#### Test 4 : Interface Admin Authentifiée
- **Après connexion** : Vérifier l'affichage de l'interface admin
- **Éléments** : Nom d'utilisateur, rôle, bouton déconnexion
- **Fonctionnalités** : Accès aux statistiques et gestion véhicules

#### Test 5 : Déconnexion
- **Cliquer** : Bouton "Déconnexion" dans l'interface admin
- **Vérifier** : Retour à la page de connexion
- **Tester** : Accès `/admin` bloqué après déconnexion

### Étape 3 : Tests Avancés

#### Test 6 : Gestion des Erreurs
- **Tenter connexion** avec identifiants incorrects
- **Vérifier** : Message d'erreur approprié
- **Tester** : Email invalide, mot de passe incorrect

#### Test 7 : Persistance de Session
- **Se connecter** puis fermer/rouvrir le navigateur
- **Vérifier** : Session maintenue (ou redemande de connexion selon config)

#### Test 8 : Accès Direct aux URLs
- **Tester** : Accès direct à `/admin` après connexion
- **Vérifier** : Accès autorisé sans nouvelle authentification

## ✅ Checklist de Validation

### Configuration
- [ ] Script `auth-setup.sql` exécuté dans Supabase
- [ ] Utilisateur admin créé (admin@tse.com)
- [ ] Variables d'environnement configurées
- [ ] Serveur de développement démarré

### Tests Fonctionnels
- [ ] Page de connexion accessible
- [ ] Formulaire de connexion complet
- [ ] Protection des routes active
- [ ] Connexion avec identifiants valides réussie
- [ ] Redirection vers admin après connexion
- [ ] Interface admin affiche les infos utilisateur
- [ ] Déconnexion fonctionne
- [ ] Accès bloqué après déconnexion

### Tests d'Erreur
- [ ] Erreur avec identifiants invalides
- [ ] Message d'erreur approprié
- [ ] Gestion des champs vides
- [ ] Accès non autorisé redirige correctement

### Performance
- [ ] Chargement rapide des pages auth (< 2s)
- [ ] Transitions fluides entre les pages
- [ ] Pas d'erreurs dans la console navigateur

## 🐛 Dépannage

### Problèmes Courants

#### "Erreur de connexion"
- Vérifier que le script SQL a été exécuté
- Vérifier les variables d'environnement Supabase
- Vérifier que l'utilisateur existe dans `admin_users`

#### "Page de connexion ne s'affiche pas"
- Vérifier que le serveur fonctionne sur le port 3005
- Vérifier les imports des composants
- Consulter la console pour les erreurs JavaScript

#### "Redirection infinie"
- Vérifier la logique de protection des routes
- Vérifier les conditions d'authentification
- Consulter les logs Supabase

#### "Utilisateur non trouvé"
- Exécuter à nouveau le script `auth-setup.sql`
- Vérifier la table `admin_users` dans Supabase
- Vérifier que `actif = true`

### Logs de Débogage

#### Console Navigateur
```javascript
// Vérifier l'état d'authentification
console.log('Auth state:', authContext)
console.log('Current user:', user)
```

#### Supabase Dashboard
- Consulter les logs d'authentification
- Vérifier les requêtes SQL
- Analyser les erreurs RLS

## 📊 Résultats Attendus

### Tests Réussis
```
✅ Pages d'Authentification: RÉUSSI
✅ Protection des Routes: RÉUSSI  
✅ Composants d'Interface: RÉUSSI
✅ Configuration Supabase: RÉUSSI
✅ Performance: RÉUSSI

🎉 SCORE: 5/5 catégories réussies
```

### Flux de Connexion Complet
1. **Accès `/admin`** → Redirection `/auth/login`
2. **Saisie identifiants** → Validation Supabase
3. **Connexion réussie** → Redirection `/admin`
4. **Interface admin** → Affichage avec infos utilisateur
5. **Déconnexion** → Retour `/auth/login`

## 🎯 Validation Finale

Une fois tous les tests réussis :

1. **✅ Authentification fonctionnelle**
2. **✅ Sécurité des routes assurée**
3. **✅ Interface utilisateur complète**
4. **✅ Gestion des erreurs appropriée**
5. **✅ Performance optimale**

**🚀 Prêt pour la Phase 3 - Fonctionnalités Avancées !**

---

**Dernière mise à jour :** 6 janvier 2025  
**Version :** 2A.1 - Guide de test authentification
