#!/usr/bin/env node

/**
 * Script de validation de la migration Supabase vers MySQL
 * Vérifie l'intégrité des données et le bon fonctionnement
 */

const { PrismaClient } = require('@prisma/client')
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

let supabase = null
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey)
}

const prisma = new PrismaClient()

// Couleurs pour les messages
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

/**
 * Valider la connexion MySQL
 */
async function validateMySQLConnection() {
  log('\n🔌 Validation de la connexion MySQL...', 'blue')
  
  try {
    await prisma.$connect()
    log('✅ Connexion MySQL réussie', 'green')
    
    // Tester une requête simple
    const result = await prisma.$queryRaw`SELECT 1 as test`
    if (result[0].test === 1) {
      log('✅ Requête de test réussie', 'green')
    }
    
    return true
  } catch (error) {
    log(`❌ Erreur de connexion MySQL: ${error.message}`, 'red')
    return false
  }
}

/**
 * Valider la structure des tables
 */
async function validateTableStructure() {
  log('\n📊 Validation de la structure des tables...', 'blue')
  
  try {
    const tables = await prisma.$queryRaw`SHOW TABLES`
    const tableNames = tables.map(t => Object.values(t)[0])
    
    const expectedTables = [
      'brands',
      'models', 
      'vehicles',
      'equipments',
      'vehicle_images',
      'vehicle_documents',
      'vehicle_equipments',
      'admin_users',
      'user_sessions'
    ]
    
    let allTablesExist = true
    
    for (const expectedTable of expectedTables) {
      if (tableNames.includes(expectedTable)) {
        log(`✅ Table ${expectedTable} existe`, 'green')
      } else {
        log(`❌ Table ${expectedTable} manquante`, 'red')
        allTablesExist = false
      }
    }
    
    return allTablesExist
  } catch (error) {
    log(`❌ Erreur validation structure: ${error.message}`, 'red')
    return false
  }
}

/**
 * Comparer les données Supabase vs MySQL
 */
async function compareData() {
  log('\n🔍 Comparaison des données Supabase vs MySQL...', 'blue')
  
  if (!supabase) {
    log('⚠️ Supabase non configuré, comparaison ignorée', 'yellow')
    return true
  }
  
  try {
    const comparisons = []
    
    // Comparer les marques
    const { data: supabaseBrands } = await supabase.from('brands').select('*')
    const mysqlBrands = await prisma.brand.findMany()
    
    comparisons.push({
      table: 'brands',
      supabase: supabaseBrands?.length || 0,
      mysql: mysqlBrands.length
    })
    
    // Comparer les modèles
    const { data: supabaseModels } = await supabase.from('models').select('*')
    const mysqlModels = await prisma.model.findMany()
    
    comparisons.push({
      table: 'models',
      supabase: supabaseModels?.length || 0,
      mysql: mysqlModels.length
    })
    
    // Comparer les véhicules
    const { data: supabaseVehicles } = await supabase.from('vehicles').select('*')
    const mysqlVehicles = await prisma.vehicle.findMany()
    
    comparisons.push({
      table: 'vehicles',
      supabase: supabaseVehicles?.length || 0,
      mysql: mysqlVehicles.length
    })
    
    // Comparer les équipements
    const { data: supabaseEquipments } = await supabase.from('equipments').select('*')
    const mysqlEquipments = await prisma.equipment.findMany()
    
    comparisons.push({
      table: 'equipments',
      supabase: supabaseEquipments?.length || 0,
      mysql: mysqlEquipments.length
    })
    
    // Afficher les résultats
    let allMatch = true
    
    log('\n📈 Résultats de la comparaison:', 'cyan')
    console.table(comparisons)
    
    for (const comp of comparisons) {
      if (comp.supabase !== comp.mysql) {
        log(`⚠️ Différence détectée pour ${comp.table}: Supabase=${comp.supabase}, MySQL=${comp.mysql}`, 'yellow')
        allMatch = false
      }
    }
    
    if (allMatch) {
      log('✅ Toutes les données correspondent', 'green')
    }
    
    return allMatch
  } catch (error) {
    log(`❌ Erreur comparaison données: ${error.message}`, 'red')
    return false
  }
}

/**
 * Valider l'intégrité référentielle
 */
async function validateReferentialIntegrity() {
  log('\n🔗 Validation de l\'intégrité référentielle...', 'blue')
  
  try {
    // Vérifier les véhicules sans marque
    const vehiclesWithoutBrand = await prisma.vehicle.findMany({
      where: {
        brand: null
      }
    })
    
    if (vehiclesWithoutBrand.length > 0) {
      log(`❌ ${vehiclesWithoutBrand.length} véhicule(s) sans marque`, 'red')
      return false
    }
    
    // Vérifier les véhicules sans modèle
    const vehiclesWithoutModel = await prisma.vehicle.findMany({
      where: {
        model: null
      }
    })
    
    if (vehiclesWithoutModel.length > 0) {
      log(`❌ ${vehiclesWithoutModel.length} véhicule(s) sans modèle`, 'red')
      return false
    }
    
    // Vérifier les modèles sans marque
    const modelsWithoutBrand = await prisma.model.findMany({
      where: {
        brand: null
      }
    })
    
    if (modelsWithoutBrand.length > 0) {
      log(`❌ ${modelsWithoutBrand.length} modèle(s) sans marque`, 'red')
      return false
    }
    
    log('✅ Intégrité référentielle validée', 'green')
    return true
  } catch (error) {
    log(`❌ Erreur validation intégrité: ${error.message}`, 'red')
    return false
  }
}

/**
 * Tester les opérations CRUD
 */
async function testCRUDOperations() {
  log('\n🧪 Test des opérations CRUD...', 'blue')
  
  try {
    // Test CREATE
    const testBrand = await prisma.brand.create({
      data: {
        nom: 'Test Brand Migration',
        description: 'Brand créée pour tester la migration'
      }
    })
    log('✅ CREATE: Marque créée', 'green')
    
    // Test READ
    const foundBrand = await prisma.brand.findUnique({
      where: { id: testBrand.id }
    })
    
    if (foundBrand) {
      log('✅ READ: Marque trouvée', 'green')
    } else {
      log('❌ READ: Marque non trouvée', 'red')
      return false
    }
    
    // Test UPDATE
    const updatedBrand = await prisma.brand.update({
      where: { id: testBrand.id },
      data: { description: 'Description mise à jour' }
    })
    
    if (updatedBrand.description === 'Description mise à jour') {
      log('✅ UPDATE: Marque mise à jour', 'green')
    } else {
      log('❌ UPDATE: Échec mise à jour', 'red')
      return false
    }
    
    // Test DELETE
    await prisma.brand.delete({
      where: { id: testBrand.id }
    })
    
    const deletedBrand = await prisma.brand.findUnique({
      where: { id: testBrand.id }
    })
    
    if (!deletedBrand) {
      log('✅ DELETE: Marque supprimée', 'green')
    } else {
      log('❌ DELETE: Échec suppression', 'red')
      return false
    }
    
    return true
  } catch (error) {
    log(`❌ Erreur test CRUD: ${error.message}`, 'red')
    return false
  }
}

/**
 * Tester les requêtes complexes
 */
async function testComplexQueries() {
  log('\n🔍 Test des requêtes complexes...', 'blue')
  
  try {
    // Test requête avec relations
    const vehiclesWithRelations = await prisma.vehicle.findMany({
      include: {
        brand: true,
        model: true,
        images: true
      },
      take: 5
    })
    
    if (vehiclesWithRelations.length > 0) {
      log('✅ Requête avec relations réussie', 'green')
    }
    
    // Test agrégation
    const stats = await prisma.vehicle.groupBy({
      by: ['statut'],
      _count: true
    })
    
    if (stats.length > 0) {
      log('✅ Requête d\'agrégation réussie', 'green')
    }
    
    // Test recherche
    const searchResults = await prisma.vehicle.findMany({
      where: {
        OR: [
          { couleur: { contains: 'blanc' } },
          { description: { contains: 'confort' } }
        ]
      },
      take: 5
    })
    
    log('✅ Requête de recherche réussie', 'green')
    
    return true
  } catch (error) {
    log(`❌ Erreur requêtes complexes: ${error.message}`, 'red')
    return false
  }
}

/**
 * Générer un rapport de validation
 */
async function generateValidationReport(results) {
  log('\n📋 Génération du rapport de validation...', 'blue')
  
  const report = {
    timestamp: new Date().toISOString(),
    migration_status: results.every(r => r.success) ? 'SUCCESS' : 'FAILED',
    tests: results,
    summary: {
      total_tests: results.length,
      passed: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    }
  }
  
  // Sauvegarder le rapport
  const reportPath = path.join(__dirname, '..', 'logs', 'validation-report.json')
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
  
  log(`✅ Rapport sauvegardé: ${reportPath}`, 'green')
  
  return report
}

/**
 * Fonction principale
 */
async function validateMigration() {
  log('🔍 VALIDATION DE LA MIGRATION SUPABASE VERS MYSQL', 'magenta')
  log('================================================', 'magenta')
  
  const results = []
  
  try {
    // Test 1: Connexion MySQL
    const mysqlConnection = await validateMySQLConnection()
    results.push({ test: 'MySQL Connection', success: mysqlConnection })
    
    // Test 2: Structure des tables
    const tableStructure = await validateTableStructure()
    results.push({ test: 'Table Structure', success: tableStructure })
    
    // Test 3: Comparaison des données
    const dataComparison = await compareData()
    results.push({ test: 'Data Comparison', success: dataComparison })
    
    // Test 4: Intégrité référentielle
    const referentialIntegrity = await validateReferentialIntegrity()
    results.push({ test: 'Referential Integrity', success: referentialIntegrity })
    
    // Test 5: Opérations CRUD
    const crudOperations = await testCRUDOperations()
    results.push({ test: 'CRUD Operations', success: crudOperations })
    
    // Test 6: Requêtes complexes
    const complexQueries = await testComplexQueries()
    results.push({ test: 'Complex Queries', success: complexQueries })
    
    // Générer le rapport
    const report = await generateValidationReport(results)
    
    // Résumé final
    log('\n🎯 RÉSUMÉ DE LA VALIDATION', 'magenta')
    log('==========================', 'magenta')
    
    const passed = results.filter(r => r.success).length
    const total = results.length
    
    if (passed === total) {
      log(`✅ MIGRATION RÉUSSIE: ${passed}/${total} tests passés`, 'green')
      log('🎉 La migration est prête pour la production !', 'green')
    } else {
      log(`❌ MIGRATION ÉCHOUÉE: ${passed}/${total} tests passés`, 'red')
      log('🔧 Veuillez corriger les erreurs avant de continuer', 'yellow')
    }
    
    // Afficher les détails
    log('\n📊 Détails des tests:', 'cyan')
    results.forEach(result => {
      const status = result.success ? '✅' : '❌'
      log(`${status} ${result.test}`)
    })
    
    process.exit(passed === total ? 0 : 1)
    
  } catch (error) {
    log(`❌ Erreur fatale: ${error.message}`, 'red')
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécution
if (require.main === module) {
  validateMigration()
}

module.exports = { validateMigration }
