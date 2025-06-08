#!/usr/bin/env node

/**
 * Script d'export des données Supabase vers MySQL
 * Analyse complète du projet TSE Catalogue
 * 
 * Usage: node scripts/export-supabase-data.js
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes')
  console.error('Vérifiez NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Dossier de sortie
const outputDir = path.join(__dirname, '..', 'migration-data')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

/**
 * Exporter une table vers un fichier JSON
 */
async function exportTable(tableName, options = {}) {
  try {
    console.log(`📊 Export de la table ${tableName}...`)
    
    let query = supabase.from(tableName).select('*')
    
    // Ajouter les relations si spécifiées
    if (options.select) {
      query = supabase.from(tableName).select(options.select)
    }
    
    // Ajouter l'ordre si spécifié
    if (options.orderBy) {
      query = query.order(options.orderBy.column, { ascending: options.orderBy.ascending })
    }
    
    const { data, error } = await query
    
    if (error) {
      throw error
    }
    
    // Sauvegarder en JSON
    const filename = path.join(outputDir, `${tableName}.json`)
    fs.writeFileSync(filename, JSON.stringify(data, null, 2))
    
    console.log(`✅ ${tableName}: ${data.length} enregistrements exportés`)
    return data
    
  } catch (error) {
    console.error(`❌ Erreur export ${tableName}:`, error.message)
    return []
  }
}

/**
 * Exporter les fichiers du storage
 */
async function exportStorage(bucketName) {
  try {
    console.log(`📁 Export du bucket ${bucketName}...`)
    
    const { data: files, error } = await supabase.storage
      .from(bucketName)
      .list('', { limit: 1000, sortBy: { column: 'created_at', order: 'desc' } })
    
    if (error) {
      throw error
    }
    
    const fileList = []
    
    for (const file of files) {
      if (file.name && !file.name.endsWith('/')) {
        const { data: urlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(file.name)
        
        fileList.push({
          name: file.name,
          size: file.metadata?.size,
          lastModified: file.updated_at,
          publicUrl: urlData.publicUrl,
          bucket: bucketName
        })
      }
    }
    
    // Sauvegarder la liste des fichiers
    const filename = path.join(outputDir, `storage_${bucketName}.json`)
    fs.writeFileSync(filename, JSON.stringify(fileList, null, 2))
    
    console.log(`✅ ${bucketName}: ${fileList.length} fichiers listés`)
    return fileList
    
  } catch (error) {
    console.error(`❌ Erreur export storage ${bucketName}:`, error.message)
    return []
  }
}

/**
 * Convertir les données Supabase vers le format MySQL/Prisma
 */
function convertToMySQLFormat(tableName, data) {
  if (!data || data.length === 0) return []

  return data.map(row => {
    const converted = { ...row }

    // Conversions spécifiques par table
    switch (tableName) {
      case 'brands':
        return {
          id: converted.id,
          nom: converted.nom,
          description: converted.description,
          logo: converted.logo,
          site_web: converted.site_web,
          pays_origine: converted.pays_origine,
          created_at: converted.created_at,
          updated_at: converted.updated_at
        }

      case 'models':
        return {
          id: converted.id,
          nom: converted.nom,
          brand_id: converted.brand_id,
          description: converted.description,
          type_vehicule: converted.type_vehicule || 'Berline',
          created_at: converted.created_at,
          updated_at: converted.updated_at
        }

      case 'vehicles':
        return {
          id: converted.id,
          brand_id: converted.brand_id,
          model_id: converted.model_id,
          annee: converted.annee,
          couleur: converted.couleur,
          prix: converted.prix,
          kilometrage: converted.kilometrage || 0,
          carburant: converted.carburant,
          transmission: converted.transmission,
          statut: converted.statut || 'Disponible',
          description: converted.description,
          puissance: converted.puissance,
          cylindree: converted.cylindree,
          consommation: converted.consommation,
          emissions_co2: converted.emissions_co2,
          nombre_portes: converted.nombre_portes,
          nombre_places: converted.nombre_places,
          coffre: converted.coffre,
          puissance_cv: converted.puissance_cv,
          consommation_l100km: converted.consommation_l100km,
          longueur_mm: converted.longueur_mm,
          largeur_mm: converted.largeur_mm,
          hauteur_mm: converted.hauteur_mm,
          poids_kg: converted.poids_kg,
          equipements: converted.equipements,
          slug: converted.slug,
          featured: converted.featured || false,
          created_at: converted.created_at,
          updated_at: converted.updated_at
        }

      case 'equipments':
        return {
          id: converted.id,
          nom: converted.nom,
          description: converted.description,
          categorie: converted.categorie || 'Confort',
          icone: converted.icone,
          created_at: converted.created_at,
          updated_at: converted.updated_at
        }

      case 'vehicle_images':
        return {
          id: converted.id,
          vehicle_id: converted.vehicle_id,
          url: converted.url,
          alt_text: converted.alt_text,
          est_principale: converted.est_principale || false,
          ordre: converted.ordre || 0,
          taille_fichier: converted.taille_fichier,
          largeur: converted.largeur,
          hauteur: converted.hauteur,
          created_at: converted.created_at,
          updated_at: converted.updated_at
        }

      case 'vehicle_documents':
        return {
          id: converted.id,
          vehicle_id: converted.vehicle_id,
          nom: converted.nom,
          url: converted.url,
          type_document: converted.type_document || 'Autre',
          taille_fichier: converted.taille_fichier,
          created_at: converted.created_at,
          updated_at: converted.updated_at
        }

      case 'vehicle_equipments':
        return {
          id: converted.id,
          vehicle_id: converted.vehicle_id,
          equipment_id: converted.equipment_id,
          created_at: converted.created_at
        }

      case 'admin_users':
        return {
          id: converted.id,
          email: converted.email,
          password_hash: converted.password_hash || '', // À regénérer
          nom: converted.nom,
          prenom: converted.prenom,
          role: converted.role || 'admin',
          actif: converted.actif !== false,
          derniere_connexion: converted.derniere_connexion,
          created_at: converted.created_at,
          updated_at: converted.updated_at
        }

      default:
        return converted
    }
  })
}

/**
 * Générer les scripts SQL d'insertion pour MySQL
 */
function generateMySQLInserts(tableName, data) {
  if (!data || data.length === 0) return ''
  
  const filename = path.join(outputDir, `${tableName}_insert.sql`)
  let sql = `-- Insertion des données pour ${tableName}\n`
  sql += `-- Généré le ${new Date().toISOString()}\n\n`
  
  // Désactiver les contraintes temporairement
  sql += `SET FOREIGN_KEY_CHECKS = 0;\n`
  sql += `SET UNIQUE_CHECKS = 0;\n\n`
  
  // Vider la table
  sql += `TRUNCATE TABLE ${tableName};\n\n`
  
  // Générer les INSERT
  for (const row of data) {
    const columns = Object.keys(row).join(', ')
    const values = Object.values(row).map(value => {
      if (value === null || value === undefined) return 'NULL'
      if (typeof value === 'string') {
        return `'${value.replace(/'/g, "''").replace(/\\/g, '\\\\')}'`
      }
      if (typeof value === 'boolean') {
        return value ? '1' : '0'
      }
      if (value instanceof Date) {
        return `'${value.toISOString().slice(0, 19).replace('T', ' ')}'`
      }
      if (typeof value === 'object') {
        return `'${JSON.stringify(value).replace(/'/g, "''")}'`
      }
      return value
    }).join(', ')
    
    sql += `INSERT INTO ${tableName} (${columns}) VALUES (${values});\n`
  }
  
  // Réactiver les contraintes
  sql += `\nSET FOREIGN_KEY_CHECKS = 1;\n`
  sql += `SET UNIQUE_CHECKS = 1;\n`
  
  fs.writeFileSync(filename, sql)
  console.log(`📝 Script SQL généré: ${filename}`)
}

/**
 * Fonction principale d'export
 */
async function exportAll() {
  console.log('🚀 Début de l\'export Supabase vers MySQL - TSE Catalogue\n')
  
  const startTime = Date.now()
  
  try {
    // Export des tables dans l'ordre des dépendances
    console.log('📊 Export des tables principales...\n')
    
    const brands = await exportTable('brands', {
      orderBy: { column: 'nom', ascending: true }
    })
    
    const models = await exportTable('models', {
      orderBy: { column: 'nom', ascending: true }
    })
    
    const equipments = await exportTable('equipments', {
      orderBy: { column: 'categorie', ascending: true }
    })
    
    const vehicles = await exportTable('vehicles', {
      orderBy: { column: 'created_at', ascending: false }
    })
    
    const vehicleImages = await exportTable('vehicle_images', {
      orderBy: { column: 'vehicle_id', ascending: true }
    })
    
    const vehicleDocuments = await exportTable('vehicle_documents', {
      orderBy: { column: 'vehicle_id', ascending: true }
    })
    
    const vehicleEquipments = await exportTable('vehicle_equipments')
    
    const adminUsers = await exportTable('admin_users', {
      orderBy: { column: 'created_at', ascending: true }
    })
    
    // Export du storage
    console.log('\n📁 Export des fichiers storage...\n')
    const vehicleImagesFiles = await exportStorage('vehicle-images')
    const vehicleDocumentsFiles = await exportStorage('vehicle-documents')
    
    // Conversion et génération des scripts SQL
    console.log('\n📝 Génération des scripts SQL...\n')
    
    const convertedData = {
      brands: convertToMySQLFormat('brands', brands),
      models: convertToMySQLFormat('models', models),
      equipments: convertToMySQLFormat('equipments', equipments),
      vehicles: convertToMySQLFormat('vehicles', vehicles),
      vehicle_images: convertToMySQLFormat('vehicle_images', vehicleImages),
      vehicle_documents: convertToMySQLFormat('vehicle_documents', vehicleDocuments),
      vehicle_equipments: convertToMySQLFormat('vehicle_equipments', vehicleEquipments),
      admin_users: convertToMySQLFormat('admin_users', adminUsers)
    }
    
    // Générer les scripts SQL
    Object.entries(convertedData).forEach(([tableName, data]) => {
      generateMySQLInserts(tableName, data)
    })
    
    // Générer un script de migration complet
    const migrationScript = `-- Script de migration complet TSE Catalogue
-- Généré le ${new Date().toISOString()}
-- Migration Supabase vers MySQL

-- 1. Créer la base de données et les tables
-- SOURCE prisma/schema.sql;

-- 2. Insérer les données dans l'ordre des dépendances
SOURCE ${path.join(outputDir, 'brands_insert.sql')};
SOURCE ${path.join(outputDir, 'models_insert.sql')};
SOURCE ${path.join(outputDir, 'equipments_insert.sql')};
SOURCE ${path.join(outputDir, 'vehicles_insert.sql')};
SOURCE ${path.join(outputDir, 'vehicle_images_insert.sql')};
SOURCE ${path.join(outputDir, 'vehicle_documents_insert.sql')};
SOURCE ${path.join(outputDir, 'vehicle_equipments_insert.sql')};
SOURCE ${path.join(outputDir, 'admin_users_insert.sql')};

-- 3. Vérifications post-migration
SELECT 'Migration terminée' as status;
SELECT COUNT(*) as brands_count FROM brands;
SELECT COUNT(*) as models_count FROM models;
SELECT COUNT(*) as vehicles_count FROM vehicles;
SELECT COUNT(*) as equipments_count FROM equipments;
SELECT COUNT(*) as vehicle_images_count FROM vehicle_images;
SELECT COUNT(*) as vehicle_documents_count FROM vehicle_documents;
SELECT COUNT(*) as admin_users_count FROM admin_users;

-- 4. Vérifier l'intégrité référentielle
SELECT 'Vérification des relations...' as status;
SELECT v.id, v.brand_id, b.nom as brand_name 
FROM vehicles v 
LEFT JOIN brands b ON v.brand_id = b.id 
WHERE b.id IS NULL 
LIMIT 5;

SELECT v.id, v.model_id, m.nom as model_name 
FROM vehicles v 
LEFT JOIN models m ON v.model_id = m.id 
WHERE m.id IS NULL 
LIMIT 5;
`
    
    fs.writeFileSync(path.join(outputDir, 'migration_complete.sql'), migrationScript)
    
    // Générer un rapport de migration
    const migrationReport = {
      timestamp: new Date().toISOString(),
      duration: (Date.now() - startTime) / 1000,
      tables: {
        brands: brands.length,
        models: models.length,
        vehicles: vehicles.length,
        equipments: equipments.length,
        vehicle_images: vehicleImages.length,
        vehicle_documents: vehicleDocuments.length,
        vehicle_equipments: vehicleEquipments.length,
        admin_users: adminUsers.length
      },
      storage: {
        vehicle_images_files: vehicleImagesFiles.length,
        vehicle_documents_files: vehicleDocumentsFiles.length
      },
      files_generated: [
        'brands.json', 'brands_insert.sql',
        'models.json', 'models_insert.sql',
        'vehicles.json', 'vehicles_insert.sql',
        'equipments.json', 'equipments_insert.sql',
        'vehicle_images.json', 'vehicle_images_insert.sql',
        'vehicle_documents.json', 'vehicle_documents_insert.sql',
        'vehicle_equipments.json', 'vehicle_equipments_insert.sql',
        'admin_users.json', 'admin_users_insert.sql',
        'storage_vehicle-images.json',
        'storage_vehicle-documents.json',
        'migration_complete.sql'
      ]
    }
    
    fs.writeFileSync(
      path.join(outputDir, 'migration_report.json'), 
      JSON.stringify(migrationReport, null, 2)
    )
    
    // Résumé
    const duration = (Date.now() - startTime) / 1000
    console.log('\n🎉 Export terminé avec succès!')
    console.log(`⏱️  Durée: ${duration.toFixed(2)}s`)
    console.log(`📁 Fichiers générés dans: ${outputDir}`)
    console.log('\n📊 Résumé des données exportées:')
    console.log(`   • ${brands.length} marques`)
    console.log(`   • ${models.length} modèles`)
    console.log(`   • ${vehicles.length} véhicules`)
    console.log(`   • ${equipments.length} équipements`)
    console.log(`   • ${vehicleImages.length} images de véhicules`)
    console.log(`   • ${vehicleDocuments.length} documents de véhicules`)
    console.log(`   • ${vehicleEquipments.length} associations véhicule-équipement`)
    console.log(`   • ${adminUsers.length} utilisateurs admin`)
    console.log(`   • ${vehicleImagesFiles.length} fichiers images`)
    console.log(`   • ${vehicleDocumentsFiles.length} fichiers documents`)
    
    console.log('\n📝 Prochaines étapes:')
    console.log('1. Configurer MySQL et créer la base de données')
    console.log('2. Exécuter: npx prisma db push')
    console.log('3. Exécuter: mysql -u root -p < migration-data/migration_complete.sql')
    console.log('4. Migrer les fichiers du storage vers S3')
    console.log('5. Mettre à jour les variables d\'environnement')
    console.log('6. Tester l\'application avec MySQL')
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'export:', error)
    process.exit(1)
  }
}

// Exécution
if (require.main === module) {
  exportAll()
}

module.exports = { exportAll, exportTable, exportStorage }
