// Script de test complet pour les APIs TSE Catalogue
// Usage: node scripts/test-apis.js

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

console.log('🧪 Tests Complets des APIs TSE Catalogue\n');

// Fonction utilitaire pour les tests
async function testAPI(name, url, expectedStatus = 200) {
  try {
    console.log(`🔍 Test: ${name}`);
    const response = await fetch(url);
    const status = response.status;
    
    if (status === expectedStatus) {
      console.log(`✅ ${name}: Status ${status} OK`);
      
      if (response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json();
        
        if (Array.isArray(data)) {
          console.log(`   📊 Données: ${data.length} éléments`);
        } else if (data.vehicles) {
          console.log(`   📊 Véhicules: ${data.vehicles.length}/${data.total} (page ${data.page})`);
        } else if (data.id) {
          console.log(`   📊 Élément: ID ${data.id.substring(0, 8)}...`);
        }
      }
      return true;
    } else {
      console.log(`❌ ${name}: Status ${status} (attendu: ${expectedStatus})`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${name}: Erreur - ${error.message}`);
    return false;
  }
}

// Tests des APIs de base
async function testBasicAPIs() {
  console.log('📋 Tests des APIs de Base\n');
  
  const tests = [
    ['API Véhicules - Liste complète', `${BASE_URL}/api/vehicles`],
    ['API Marques', `${BASE_URL}/api/brands`],
    ['API Modèles', `${BASE_URL}/api/models`],
    ['API Véhicule spécifique', `${BASE_URL}/api/vehicles/880e8400-e29b-41d4-a716-446655440001`],
  ];
  
  let passed = 0;
  for (const [name, url] of tests) {
    if (await testAPI(name, url)) passed++;
    console.log('');
  }
  
  console.log(`📊 Résultat: ${passed}/${tests.length} tests réussis\n`);
  return passed === tests.length;
}

// Tests des filtres
async function testFilters() {
  console.log('🔍 Tests des Filtres\n');
  
  const filterTests = [
    ['Filtre par marque Toyota', `${BASE_URL}/api/vehicles?marque=Toyota`],
    ['Filtre par carburant Hybride', `${BASE_URL}/api/vehicles?carburant=Hybride`],
    ['Filtre par transmission Automatique', `${BASE_URL}/api/vehicles?transmission=Automatique`],
    ['Filtre par statut Disponible', `${BASE_URL}/api/vehicles?statut=Disponible`],
    ['Recherche textuelle "Toyota"', `${BASE_URL}/api/vehicles?recherche=Toyota`],
    ['Pagination page 1, limit 2', `${BASE_URL}/api/vehicles?page=1&limit=2`],
  ];
  
  let passed = 0;
  for (const [name, url] of filterTests) {
    if (await testAPI(name, url)) passed++;
    console.log('');
  }
  
  console.log(`📊 Résultat: ${passed}/${filterTests.length} tests réussis\n`);
  return passed === filterTests.length;
}

// Tests des erreurs
async function testErrors() {
  console.log('🚨 Tests de Gestion d\'Erreurs\n');
  
  const errorTests = [
    ['Véhicule inexistant', `${BASE_URL}/api/vehicles/00000000-0000-0000-0000-000000000000`, 404],
    ['API inexistante', `${BASE_URL}/api/inexistant`, 404],
  ];
  
  let passed = 0;
  for (const [name, url, expectedStatus] of errorTests) {
    if (await testAPI(name, url, expectedStatus)) passed++;
    console.log('');
  }
  
  console.log(`📊 Résultat: ${passed}/${errorTests.length} tests réussis\n`);
  return passed === errorTests.length;
}

// Test de création (POST)
async function testCreation() {
  console.log('➕ Test de Création\n');
  
  try {
    console.log('🔍 Test: Création d\'une nouvelle marque');
    
    const newBrand = {
      nom: `Test-${Date.now()}`,
      description: 'Marque de test créée par le script'
    };
    
    const response = await fetch(`${BASE_URL}/api/brands`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBrand)
    });
    
    if (response.status === 201) {
      const data = await response.json();
      console.log(`✅ Création réussie: ${data.nom} (ID: ${data.id.substring(0, 8)}...)`);
      return true;
    } else {
      console.log(`❌ Échec création: Status ${response.status}`);
      const error = await response.text();
      console.log(`   Erreur: ${error}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Erreur création: ${error.message}`);
    return false;
  }
}

// Test de performance
async function testPerformance() {
  console.log('⚡ Test de Performance\n');
  
  const start = Date.now();
  
  try {
    const response = await fetch(`${BASE_URL}/api/vehicles`);
    const end = Date.now();
    const duration = end - start;
    
    if (response.ok) {
      console.log(`✅ Temps de réponse: ${duration}ms`);
      
      if (duration < 1000) {
        console.log('🚀 Performance excellente (< 1s)');
      } else if (duration < 3000) {
        console.log('👍 Performance correcte (< 3s)');
      } else {
        console.log('⚠️  Performance lente (> 3s)');
      }
      
      return duration < 3000;
    } else {
      console.log('❌ Erreur lors du test de performance');
      return false;
    }
  } catch (error) {
    console.log(`❌ Erreur performance: ${error.message}`);
    return false;
  }
}

// Test de cohérence des données
async function testDataConsistency() {
  console.log('🔗 Test de Cohérence des Données\n');
  
  try {
    // Récupérer un véhicule avec ses relations
    const vehicleResponse = await fetch(`${BASE_URL}/api/vehicles/880e8400-e29b-41d4-a716-446655440001`);
    const vehicle = await vehicleResponse.json();
    
    // Vérifier que les relations existent
    const checks = [
      ['Marque liée', vehicle.brand && vehicle.brand.nom],
      ['Modèle lié', vehicle.model && vehicle.model.nom],
      ['Équipements liés', vehicle.equipments && vehicle.equipments.length > 0],
      ['Documents liés', vehicle.vehicle_documents && vehicle.vehicle_documents.length > 0],
    ];
    
    let passed = 0;
    for (const [name, condition] of checks) {
      if (condition) {
        console.log(`✅ ${name}: OK`);
        passed++;
      } else {
        console.log(`❌ ${name}: Manquant`);
      }
    }
    
    console.log(`\n📊 Cohérence: ${passed}/${checks.length} relations OK\n`);
    return passed === checks.length;
  } catch (error) {
    console.log(`❌ Erreur cohérence: ${error.message}`);
    return false;
  }
}

// Exécution de tous les tests
async function runAllTests() {
  console.log('🎯 Début des Tests Complets\n');
  
  const results = {
    basic: await testBasicAPIs(),
    filters: await testFilters(),
    errors: await testErrors(),
    creation: await testCreation(),
    performance: await testPerformance(),
    consistency: await testDataConsistency(),
  };
  
  console.log('📊 RÉSUMÉ FINAL\n');
  
  const testNames = {
    basic: 'APIs de Base',
    filters: 'Filtres',
    errors: 'Gestion d\'Erreurs',
    creation: 'Création',
    performance: 'Performance',
    consistency: 'Cohérence des Données'
  };
  
  let totalPassed = 0;
  let totalTests = 0;
  
  for (const [key, passed] of Object.entries(results)) {
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${testNames[key]}: ${passed ? 'RÉUSSI' : 'ÉCHEC'}`);
    if (passed) totalPassed++;
    totalTests++;
  }
  
  console.log(`\n🎉 SCORE GLOBAL: ${totalPassed}/${totalTests} catégories réussies`);
  
  if (totalPassed === totalTests) {
    console.log('\n🚀 FÉLICITATIONS ! Toutes les APIs fonctionnent parfaitement avec Supabase !');
    console.log('\n📝 Prochaines étapes recommandées:');
    console.log('1. Tester l\'interface web sur http://localhost:3000/catalogue');
    console.log('2. Vérifier que les filtres fonctionnent dans l\'interface');
    console.log('3. Tester les pages de détails véhicules');
    console.log('4. Passer à la Phase 2A - Authentification');
  } else {
    console.log('\n⚠️  Certains tests ont échoué. Vérifiez:');
    console.log('1. Que Supabase est bien configuré');
    console.log('2. Que les données de démonstration sont présentes');
    console.log('3. Que le serveur de développement fonctionne');
  }
}

// Vérification que le serveur est accessible
async function checkServer() {
  try {
    const response = await fetch(`${BASE_URL}/api/vehicles`);
    return response.ok;
  } catch (error) {
    console.log('❌ Serveur non accessible. Vérifiez que npm run dev est lancé.');
    return false;
  }
}

// Point d'entrée
async function main() {
  if (await checkServer()) {
    await runAllTests();
  }
}

main();
