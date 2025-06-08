#!/usr/bin/env node

console.log('=== Test de configuration TSE Catalogue ===\n')

// Test des variables d'environnement
console.log('Variables d\'environnement:')
console.log('  DATABASE_URL:', process.env.DATABASE_URL ? 'OK' : 'MANQUANTE')
console.log('  JWT_SECRET:', process.env.JWT_SECRET ? 'OK' : 'MANQUANTE')
console.log('  S3_BUCKET_NAME:', process.env.S3_BUCKET_NAME ? 'OK' : 'MANQUANTE')

// Test des dependances
console.log('\nDependances:')
try {
  require('@prisma/client')
  console.log('  @prisma/client: OK')
} catch (e) {
  console.log('  @prisma/client: MANQUANTE')
}

try {
  require('bcryptjs')
  console.log('  bcryptjs: OK')
} catch (e) {
  console.log('  bcryptjs: MANQUANTE')
}

// Test des fichiers
const fs = require('fs')
console.log('\nFichiers:')
console.log('  prisma/schema.prisma:', fs.existsSync('prisma/schema.prisma') ? 'OK' : 'MANQUANT')
console.log('  src/lib/database.ts:', fs.existsSync('src/lib/database.ts') ? 'OK' : 'MANQUANT')

console.log('\n=== Configuration prete pour la migration ===')
console.log('\nProchaines etapes:')
console.log('1. Configurer MySQL')
console.log('2. Mettre a jour .env avec les vraies valeurs')
console.log('3. Executer la migration')
