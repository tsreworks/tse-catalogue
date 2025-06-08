// Script de test pour vérifier la configuration Supabase
// Usage: node scripts/test-supabase.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🧪 Test de Configuration Supabase\n');

// Vérification des variables d'environnement
console.log('📋 Vérification des variables d\'environnement:');
console.log(`URL: ${supabaseUrl ? '✅ Définie' : '❌ Manquante'}`);
console.log(`Clé: ${supabaseKey ? '✅ Définie' : '❌ Manquante'}`);

if (!supabaseUrl || !supabaseKey) {
  console.log('\n❌ Configuration incomplète. Vérifiez votre fichier .env.local');
  process.exit(1);
}

// Test de connexion
async function testConnection() {
  try {
    console.log('\n🔌 Test de connexion...');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test simple : récupérer les marques
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Erreur de connexion:', error.message);
      return false;
    }
    
    console.log('✅ Connexion réussie !');
    console.log(`📊 Données récupérées: ${data ? data.length : 0} marque(s)`);
    return true;
  } catch (error) {
    console.log('❌ Erreur:', error.message);
    return false;
  }
}

// Test des tables
async function testTables() {
  try {
    console.log('\n📋 Test des tables...');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const tables = [
      { name: 'brands', label: 'Marques' },
      { name: 'models', label: 'Modèles' },
      { name: 'vehicles', label: 'Véhicules' },
      { name: 'equipments', label: 'Équipements' }
    ];
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table.name)
        .select('id')
        .limit(1);
      
      if (error) {
        console.log(`❌ ${table.label}: ${error.message}`);
      } else {
        console.log(`✅ ${table.label}: Table accessible`);
      }
    }
  } catch (error) {
    console.log('❌ Erreur lors du test des tables:', error.message);
  }
}

// Test des données
async function testData() {
  try {
    console.log('\n📊 Test des données...');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Compter les enregistrements
    const counts = {};
    const tables = ['brands', 'models', 'vehicles', 'equipments'];
    
    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (!error) {
        counts[table] = count;
      }
    }
    
    console.log('📈 Nombre d\'enregistrements:');
    console.log(`   Marques: ${counts.brands || 0}`);
    console.log(`   Modèles: ${counts.models || 0}`);
    console.log(`   Véhicules: ${counts.vehicles || 0}`);
    console.log(`   Équipements: ${counts.equipments || 0}`);
    
    // Vérifier qu'on a les données de base
    if (counts.brands >= 3 && counts.vehicles >= 4) {
      console.log('✅ Données de démonstration présentes');
    } else {
      console.log('⚠️  Données de démonstration incomplètes');
      console.log('   Exécutez le script seed.sql dans Supabase SQL Editor');
    }
    
  } catch (error) {
    console.log('❌ Erreur lors du test des données:', error.message);
  }
}

// Test d'une requête complexe
async function testComplexQuery() {
  try {
    console.log('\n🔍 Test de requête complexe...');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data, error } = await supabase
      .from('vehicles')
      .select(`
        *,
        brand:brands(nom),
        model:models(nom)
      `)
      .limit(1);
    
    if (error) {
      console.log('❌ Erreur requête complexe:', error.message);
    } else if (data && data.length > 0) {
      console.log('✅ Requête complexe réussie');
      console.log(`   Exemple: ${data[0].brand?.nom} ${data[0].model?.nom} ${data[0].annee}`);
    } else {
      console.log('⚠️  Aucune donnée retournée');
    }
  } catch (error) {
    console.log('❌ Erreur:', error.message);
  }
}

// Exécution des tests
async function runTests() {
  const connected = await testConnection();
  
  if (connected) {
    await testTables();
    await testData();
    await testComplexQuery();
    
    console.log('\n🎉 Tests terminés !');
    console.log('\n📝 Prochaines étapes:');
    console.log('1. Si tous les tests sont ✅, décommentez NEXT_PUBLIC_USE_SUPABASE=true dans .env.local');
    console.log('2. Redémarrez votre serveur de développement');
    console.log('3. Testez les APIs avec: npm run test:api');
  } else {
    console.log('\n❌ Échec de la connexion. Vérifiez:');
    console.log('1. Vos clés Supabase dans .env.local');
    console.log('2. Que le projet Supabase est actif');
    console.log('3. Que les scripts schema.sql et seed.sql ont été exécutés');
  }
}

runTests();
