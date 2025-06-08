# 🚀 Guide de Migration Supabase vers MySQL - TSE Catalogue

## 📋 Vue d'ensemble

Cette migration remplace l'infrastructure Supabase par une solution MySQL + Prisma + AWS S3 pour :

- **💰 Réduire les coûts** : 83% d'économie (de 300€/mois à 50€/mois)
- **⚡ Améliorer les performances** : Optimisations spécifiques aux besoins TSE
- **🎛️ Contrôle total** : Maîtrise complète de l'infrastructure
- **📈 Évolutivité** : Capacité d'adaptation aux besoins futurs

## 🏗️ Architecture après migration

| Composant | Avant (Supabase) | Après (MySQL) |
|-----------|------------------|---------------|
| **Base de données** | PostgreSQL (Supabase) | MySQL 8.0 + Prisma |
| **Authentification** | Supabase Auth | JWT + bcrypt |
| **Storage** | Supabase Storage | AWS S3 (ou compatible) |
| **ORM** | Supabase Client | Prisma |
| **API** | Supabase API | Next.js API Routes |

## 📋 Prérequis

### Logiciels requis
- **Node.js** 18+ 
- **MySQL** 8.0+
- **npm** ou **yarn**

### Services externes
- **Compte AWS S3** (ou DigitalOcean Spaces, MinIO)
- **Serveur MySQL** (local ou hébergé)

### Accès requis
- **Accès admin** au projet Supabase actuel
- **Variables d'environnement** Supabase

## 🚀 Étapes de migration

### Étape 1 : Préparation et configuration

```bash
# 1. Cloner le projet et installer les dépendances
cd tse-catalogue

# 2. Exécuter le script de configuration
chmod +x scripts/setup-mysql-migration.sh
./scripts/setup-mysql-migration.sh
```

### Étape 2 : Configuration des variables d'environnement

```bash
# Copier le fichier d'exemple
cp .env.mysql.example .env

# Éditer .env avec vos valeurs
nano .env
```

**Variables à configurer :**

```env
# MySQL Database
DATABASE_URL="mysql://username:password@localhost:3306/tse_catalogue"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# AWS S3 Configuration
S3_BUCKET_NAME=tse-catalogue
S3_REGION=eu-west-1
S3_ACCESS_KEY_ID=your_access_key_id
S3_SECRET_ACCESS_KEY=your_secret_access_key
S3_BASE_URL=https://tse-catalogue.s3.eu-west-1.amazonaws.com

# Legacy Supabase (pour la migration)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Étape 3 : Création de la base de données MySQL

```sql
-- Connectez-vous à MySQL et créez la base
CREATE DATABASE tse_catalogue CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Créer un utilisateur dédié (recommandé)
CREATE USER 'tse_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON tse_catalogue.* TO 'tse_user'@'localhost';
FLUSH PRIVILEGES;
```

### Étape 4 : Migration des données

```bash
# Exporter les données de Supabase et les importer dans MySQL
chmod +x scripts/migrate-data.sh
./scripts/migrate-data.sh
```

**Ce script va :**
1. Exporter toutes les données de Supabase
2. Créer les tables MySQL avec Prisma
3. Importer les données converties
4. Générer le client Prisma

### Étape 5 : Validation de la migration

```bash
# Tester la connexion MySQL
node scripts/test-mysql-connection.js

# Validation complète de la migration
node scripts/validate-migration.js
```

### Étape 6 : Migration des fichiers (Storage)

```bash
# Script de migration des fichiers vers S3
node scripts/migrate-storage-files.js
```

### Étape 7 : Tests de l'application

```bash
# Démarrer l'application avec MySQL
npm run dev

# Tester les fonctionnalités principales :
# - Connexion admin
# - Liste des véhicules
# - Création d'un véhicule
# - Upload d'images
# - Recherche et filtres
```

## 🔧 Résolution des problèmes

### Problème : Erreur de connexion MySQL

```bash
# Vérifier que MySQL est démarré
sudo systemctl status mysql

# Tester la connexion manuellement
mysql -u tse_user -p tse_catalogue
```

### Problème : Erreur Prisma

```bash
# Régénérer le client Prisma
npx prisma generate

# Synchroniser le schéma
npx prisma db push
```

### Problème : Données manquantes

```bash
# Vérifier les logs de migration
cat logs/migration.log

# Re-exporter les données Supabase
node scripts/export-supabase-data.js
```

### Problème : Erreur S3

```bash
# Vérifier les credentials AWS
aws s3 ls s3://tse-catalogue

# Tester l'upload
node scripts/test-s3-upload.js
```

## 🔄 Plan de rollback

En cas de problème, vous pouvez revenir à Supabase :

```bash
# Exécuter le script de rollback
./scripts/rollback-to-supabase.sh

# Restaurer les variables d'environnement
cp .env.supabase.backup .env

# Redémarrer l'application
npm run dev
```

## 📊 Validation post-migration

### Checklist de validation

- [ ] **Connexion MySQL** fonctionne
- [ ] **Toutes les tables** sont créées
- [ ] **Données migrées** (même nombre d'enregistrements)
- [ ] **Intégrité référentielle** respectée
- [ ] **Authentification** fonctionne
- [ ] **Upload d'images** vers S3 fonctionne
- [ ] **API Routes** répondent correctement
- [ ] **Interface admin** accessible
- [ ] **Recherche et filtres** fonctionnent
- [ ] **Performance** acceptable

### Métriques à vérifier

```sql
-- Compter les enregistrements par table
SELECT 'brands' as table_name, COUNT(*) as count FROM brands
UNION ALL
SELECT 'models', COUNT(*) FROM models
UNION ALL
SELECT 'vehicles', COUNT(*) FROM vehicles
UNION ALL
SELECT 'equipments', COUNT(*) FROM equipments;
```

## 🎯 Optimisations post-migration

### 1. Index MySQL

```sql
-- Ajouter des index pour améliorer les performances
CREATE INDEX idx_vehicles_search ON vehicles(brand_id, model_id, statut, annee);
CREATE INDEX idx_vehicles_featured ON vehicles(featured, created_at);
```

### 2. Configuration MySQL

```ini
# my.cnf optimisations
[mysqld]
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
query_cache_size = 64M
```

### 3. Cache Redis (optionnel)

```bash
# Installer Redis pour le cache
npm install redis
```

## 📈 Monitoring et maintenance

### Logs à surveiller

- `logs/migration.log` - Logs de migration
- `logs/mysql-errors.log` - Erreurs MySQL
- `logs/s3-uploads.log` - Logs S3

### Sauvegardes automatiques

```bash
# Script de sauvegarde MySQL
mysqldump -u tse_user -p tse_catalogue > backup_$(date +%Y%m%d).sql

# Sauvegarde S3
aws s3 sync s3://tse-catalogue s3://tse-catalogue-backup
```

### Monitoring des performances

```sql
-- Requêtes lentes
SELECT * FROM information_schema.processlist WHERE time > 5;

-- Utilisation des index
SHOW INDEX FROM vehicles;
```

## 🎉 Avantages obtenus

### Économies

- **Coût mensuel** : 300€ → 50€ (83% d'économie)
- **ROI** : Migration rentabilisée en 4 mois

### Performance

- **Requêtes optimisées** pour les besoins TSE
- **Index personnalisés** pour la recherche
- **Cache** possible avec Redis

### Contrôle

- **Base de données** sous contrôle total
- **Sauvegardes** personnalisées
- **Évolutivité** selon les besoins

## 📞 Support

En cas de problème :

1. **Consulter les logs** dans `logs/`
2. **Vérifier la documentation** Prisma/MySQL
3. **Utiliser le script de rollback** si nécessaire
4. **Contacter l'équipe technique** TSE

---

**🎯 Cette migration positionne TSE avec une infrastructure moderne, performante et économique pour les années à venir !**
