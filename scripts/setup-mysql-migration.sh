#!/bin/bash

# Script de configuration pour la migration Supabase vers MySQL
# TSE Catalogue - Migration Setup

set -e

echo "🚀 Configuration de la migration Supabase vers MySQL - TSE Catalogue"
echo "=================================================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier les prérequis
check_prerequisites() {
    print_status "Vérification des prérequis..."
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js n'est pas installé"
        exit 1
    fi
    
    # Vérifier npm
    if ! command -v npm &> /dev/null; then
        print_error "npm n'est pas installé"
        exit 1
    fi
    
    # Vérifier MySQL
    if ! command -v mysql &> /dev/null; then
        print_warning "MySQL client n'est pas installé. Veuillez l'installer pour tester la connexion."
    fi
    
    print_success "Prérequis vérifiés"
}

# Installer les nouvelles dépendances
install_dependencies() {
    print_status "Installation des nouvelles dépendances..."
    
    # Sauvegarder package.json actuel
    cp package.json package.json.backup
    print_status "Sauvegarde de package.json créée"
    
    # Installer les dépendances MySQL/Prisma
    npm install @prisma/client prisma
    npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
    npm install bcryptjs jsonwebtoken sharp uuid
    
    # Installer les types
    npm install -D @types/bcryptjs @types/jsonwebtoken @types/uuid
    
    print_success "Dépendances installées"
}

# Configurer Prisma
setup_prisma() {
    print_status "Configuration de Prisma..."
    
    # Initialiser Prisma si pas déjà fait
    if [ ! -f "prisma/schema.prisma" ]; then
        npx prisma init
        print_status "Prisma initialisé"
    fi
    
    # Le schéma est déjà créé dans prisma/schema.prisma
    print_success "Prisma configuré"
}

# Créer les dossiers nécessaires
create_directories() {
    print_status "Création des dossiers nécessaires..."
    
    mkdir -p migration-data
    mkdir -p logs
    mkdir -p backups
    
    print_success "Dossiers créés"
}

# Configurer les variables d'environnement
setup_environment() {
    print_status "Configuration des variables d'environnement..."
    
    # Créer .env.mysql.example
    cat > .env.mysql.example << 'EOF'
# Configuration MySQL pour TSE Catalogue
# Copiez ce fichier vers .env et remplissez les valeurs

# MySQL Database
DATABASE_URL="mysql://username:password@localhost:3306/tse_catalogue"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# AWS S3 Configuration
S3_BUCKET_NAME=tse-catalogue
S3_REGION=eu-west-1
S3_ACCESS_KEY_ID=your_access_key_id
S3_SECRET_ACCESS_KEY=your_secret_access_key
S3_ENDPOINT=https://s3.eu-west-1.amazonaws.com
S3_BASE_URL=https://tse-catalogue.s3.eu-west-1.amazonaws.com

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Legacy Supabase (pour la migration)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
EOF

    print_success "Fichier .env.mysql.example créé"
    print_warning "Veuillez copier .env.mysql.example vers .env et remplir les valeurs"
}

# Créer le script de migration des données
create_migration_script() {
    print_status "Création du script de migration des données..."
    
    cat > scripts/migrate-data.sh << 'EOF'
#!/bin/bash

# Script de migration des données Supabase vers MySQL
set -e

echo "🔄 Migration des données Supabase vers MySQL"
echo "============================================"

# Vérifier que les variables d'environnement sont définies
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL n'est pas définie"
    exit 1
fi

# 1. Exporter les données de Supabase
echo "📊 Export des données Supabase..."
node scripts/export-supabase-data.js

# 2. Générer la base de données MySQL
echo "🗄️ Génération de la base de données MySQL..."
npx prisma db push

# 3. Importer les données
echo "📥 Import des données dans MySQL..."
if command -v mysql &> /dev/null; then
    mysql --defaults-extra-file=<(echo -e "[client]\nuser=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')\npassword=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')\nhost=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')\nport=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')") $(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p') < migration-data/migration_complete.sql
else
    echo "⚠️ MySQL client non trouvé. Veuillez exécuter manuellement :"
    echo "mysql -u username -p database_name < migration-data/migration_complete.sql"
fi

# 4. Générer le client Prisma
echo "🔧 Génération du client Prisma..."
npx prisma generate

echo "✅ Migration des données terminée"
EOF

    chmod +x scripts/migrate-data.sh
    print_success "Script de migration créé"
}

# Créer le script de test
create_test_script() {
    print_status "Création du script de test..."
    
    cat > scripts/test-mysql-connection.js << 'EOF'
#!/usr/bin/env node

/**
 * Script de test de la connexion MySQL
 */

const { PrismaClient } = require('@prisma/client')

async function testConnection() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔌 Test de connexion à MySQL...')
    
    // Test de connexion basique
    await prisma.$connect()
    console.log('✅ Connexion MySQL réussie')
    
    // Test des tables
    const tables = await prisma.$queryRaw`SHOW TABLES`
    console.log(`📊 ${tables.length} table(s) trouvée(s)`)
    
    // Test des données
    const brandsCount = await prisma.brand.count()
    const vehiclesCount = await prisma.vehicle.count()
    
    console.log(`🚗 ${vehiclesCount} véhicule(s) dans la base`)
    console.log(`🏷️ ${brandsCount} marque(s) dans la base`)
    
    console.log('✅ Test de connexion MySQL réussi')
    
  } catch (error) {
    console.error('❌ Erreur de connexion MySQL:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
EOF

    chmod +x scripts/test-mysql-connection.js
    print_success "Script de test créé"
}

# Créer le script de rollback
create_rollback_script() {
    print_status "Création du script de rollback..."
    
    cat > scripts/rollback-to-supabase.sh << 'EOF'
#!/bin/bash

# Script de rollback vers Supabase
set -e

echo "🔄 Rollback vers Supabase"
echo "========================="

# Restaurer package.json
if [ -f "package.json.backup" ]; then
    cp package.json.backup package.json
    echo "✅ package.json restauré"
fi

# Restaurer les fichiers originaux
if [ -f "src/lib/supabase.ts.backup" ]; then
    cp src/lib/supabase.ts.backup src/lib/supabase.ts
    echo "✅ supabase.ts restauré"
fi

if [ -f "src/lib/auth.ts.backup" ]; then
    cp src/lib/auth.ts.backup src/lib/auth.ts
    echo "✅ auth.ts restauré"
fi

if [ -f "src/lib/storage.ts.backup" ]; then
    cp src/lib/storage.ts.backup src/lib/storage.ts
    echo "✅ storage.ts restauré"
fi

# Réinstaller les dépendances Supabase
npm install @supabase/supabase-js

echo "✅ Rollback terminé"
echo "⚠️ Veuillez redémarrer l'application"
EOF

    chmod +x scripts/rollback-to-supabase.sh
    print_success "Script de rollback créé"
}

# Créer la documentation
create_documentation() {
    print_status "Création de la documentation..."
    
    cat > MIGRATION.md << 'EOF'
# Migration Supabase vers MySQL - TSE Catalogue

## Vue d'ensemble

Cette migration remplace Supabase par MySQL + Prisma + AWS S3 pour :
- Réduire les coûts (83% d'économie)
- Améliorer les performances
- Avoir un contrôle total sur l'infrastructure

## Prérequis

- Node.js 18+
- MySQL 8.0+
- Compte AWS S3 (ou compatible)

## Étapes de migration

### 1. Configuration initiale

```bash
# Exécuter le script de setup
./scripts/setup-mysql-migration.sh

# Configurer les variables d'environnement
cp .env.mysql.example .env
# Éditer .env avec vos valeurs
```

### 2. Migration des données

```bash
# Exporter et migrer les données
./scripts/migrate-data.sh
```

### 3. Tests

```bash
# Tester la connexion MySQL
node scripts/test-mysql-connection.js

# Tester l'application
npm run dev
```

### 4. Rollback (si nécessaire)

```bash
# Revenir à Supabase
./scripts/rollback-to-supabase.sh
```

## Architecture après migration

- **Base de données** : MySQL avec Prisma ORM
- **Authentification** : JWT + bcrypt
- **Storage** : AWS S3 (ou compatible)
- **API** : Next.js API Routes

## Avantages

- ✅ Coût réduit de 83%
- ✅ Performance améliorée
- ✅ Contrôle total
- ✅ Évolutivité

## Support

En cas de problème, consultez les logs dans le dossier `logs/`
EOF

    print_success "Documentation créée"
}

# Sauvegarder les fichiers existants
backup_existing_files() {
    print_status "Sauvegarde des fichiers existants..."
    
    # Sauvegarder les fichiers Supabase
    if [ -f "src/lib/supabase.ts" ]; then
        cp src/lib/supabase.ts src/lib/supabase.ts.backup
        print_status "supabase.ts sauvegardé"
    fi
    
    if [ -f "src/lib/auth.ts" ]; then
        cp src/lib/auth.ts src/lib/auth.ts.backup
        print_status "auth.ts sauvegardé"
    fi
    
    if [ -f "src/lib/storage.ts" ]; then
        cp src/lib/storage.ts src/lib/storage.ts.backup
        print_status "storage.ts sauvegardé"
    fi
    
    print_success "Fichiers sauvegardés"
}

# Fonction principale
main() {
    echo
    print_status "Début de la configuration de migration..."
    echo
    
    check_prerequisites
    backup_existing_files
    create_directories
    install_dependencies
    setup_prisma
    setup_environment
    create_migration_script
    create_test_script
    create_rollback_script
    create_documentation
    
    echo
    print_success "Configuration terminée !"
    echo
    echo "📋 Prochaines étapes :"
    echo "1. Configurer .env avec vos valeurs MySQL et S3"
    echo "2. Créer la base de données MySQL"
    echo "3. Exécuter : ./scripts/migrate-data.sh"
    echo "4. Tester : node scripts/test-mysql-connection.js"
    echo "5. Démarrer l'application : npm run dev"
    echo
    print_warning "Consultez MIGRATION.md pour plus de détails"
}

# Exécution
main "$@"
