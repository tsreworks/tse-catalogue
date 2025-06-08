// Test d'intégration pour vérifier que l'interface web utilise Supabase
// Usage: node scripts/test-integration.js

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3005';

console.log('🔗 Tests d\'Intégration Interface Web + Supabase\n');

// Test que les pages web chargent et utilisent les données Supabase
async function testWebPages() {
  console.log('📱 Test des Pages Web\n');
  
  const pages = [
    ['Page d\'accueil', `${BASE_URL}/`],
    ['Catalogue', `${BASE_URL}/catalogue`],
    ['Page de détails véhicule', `${BASE_URL}/catalogue/toyota-corolla-cross-2023`],
    ['Administration', `${BASE_URL}/admin`],
  ];
  
  let passed = 0;
  for (const [name, url] of pages) {
    try {
      console.log(`🔍 Test: ${name}`);
      const response = await fetch(url);
      
      if (response.ok) {
        const html = await response.text();
        
        // Vérifier que la page contient des données réelles
        const hasData = html.includes('Toyota') || html.includes('Corolla') || html.includes('28500');
        
        if (hasData) {
          console.log(`✅ ${name}: OK - Données présentes`);
          passed++;
        } else {
          console.log(`⚠️  ${name}: Chargé mais données manquantes`);
        }
      } else {
        console.log(`❌ ${name}: Status ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${name}: Erreur - ${error.message}`);
    }
    console.log('');
  }
  
  console.log(`📊 Résultat: ${passed}/${pages.length} pages OK\n`);
  return passed === pages.length;
}

// Test des données spécifiques Supabase vs statiques
async function testDataSource() {
  console.log('🗄️  Test Source des Données\n');
  
  try {
    // Récupérer les données via API
    const apiResponse = await fetch(`${BASE_URL}/api/vehicles`);
    const apiData = await apiResponse.json();
    
    // Vérifier la structure Supabase (UUIDs, timestamps, etc.)
    const firstVehicle = apiData.vehicles[0];
    
    const checks = [
      ['UUIDs Supabase', firstVehicle.id && firstVehicle.id.includes('-')],
      ['Timestamps ISO', firstVehicle.created_at && firstVehicle.created_at.includes('T')],
      ['Relations brand', firstVehicle.brand && firstVehicle.brand.nom],
      ['Relations model', firstVehicle.model && firstVehicle.model.nom],
      ['Équipements liés', firstVehicle.equipments && firstVehicle.equipments.length > 0],
      ['Documents liés', firstVehicle.vehicle_documents && firstVehicle.vehicle_documents.length > 0],
    ];
    
    let passed = 0;
    for (const [name, condition] of checks) {
      if (condition) {
        console.log(`✅ ${name}: Détecté`);
        passed++;
      } else {
        console.log(`❌ ${name}: Non détecté`);
      }
    }
    
    console.log(`\n📊 Indicateurs Supabase: ${passed}/${checks.length} détectés`);
    
    if (passed >= 4) {
      console.log('🎉 CONFIRMATION: L\'application utilise bien Supabase !');
      return true;
    } else {
      console.log('⚠️  L\'application semble utiliser les données statiques');
      return false;
    }
    
  } catch (error) {
    console.log(`❌ Erreur test source: ${error.message}`);
    return false;
  }
}

// Test des performances avec Supabase
async function testSupabasePerformance() {
  console.log('\n⚡ Test Performance Supabase\n');
  
  const tests = [
    ['Chargement liste véhicules', `${BASE_URL}/api/vehicles`],
    ['Filtre par marque', `${BASE_URL}/api/vehicles?marque=Toyota`],
    ['Véhicule spécifique', `${BASE_URL}/api/vehicles/880e8400-e29b-41d4-a716-446655440001`],
    ['Liste marques', `${BASE_URL}/api/brands`],
  ];
  
  let totalTime = 0;
  let passed = 0;
  
  for (const [name, url] of tests) {
    try {
      const start = Date.now();
      const response = await fetch(url);
      const end = Date.now();
      const duration = end - start;
      
      totalTime += duration;
      
      if (response.ok && duration < 1000) {
        console.log(`✅ ${name}: ${duration}ms`);
        passed++;
      } else if (response.ok) {
        console.log(`⚠️  ${name}: ${duration}ms (lent)`);
      } else {
        console.log(`❌ ${name}: Erreur ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${name}: ${error.message}`);
    }
  }
  
  const avgTime = Math.round(totalTime / tests.length);
  console.log(`\n📊 Performance moyenne: ${avgTime}ms`);
  
  if (avgTime < 500) {
    console.log('🚀 Performance excellente !');
  } else if (avgTime < 1000) {
    console.log('👍 Performance correcte');
  } else {
    console.log('⚠️  Performance à optimiser');
  }
  
  return passed >= tests.length * 0.75; // 75% de réussite
}

// Test de cohérence entre API et interface
async function testAPIWebConsistency() {
  console.log('\n🔄 Test Cohérence API ↔ Interface\n');
  
  try {
    // Récupérer les données via API
    const apiResponse = await fetch(`${BASE_URL}/api/vehicles`);
    const apiData = await apiResponse.json();
    
    // Récupérer la page catalogue
    const webResponse = await fetch(`${BASE_URL}/catalogue`);
    const webHTML = await webResponse.text();
    
    // Vérifier que les données de l'API apparaissent dans l'interface
    const vehicle = apiData.vehicles[0];
    const checks = [
      ['Marque dans interface', webHTML.includes(vehicle.brand.nom)],
      ['Modèle dans interface', webHTML.includes(vehicle.model.nom)],
      ['Année dans interface', webHTML.includes(vehicle.annee.toString())],
      ['Prix dans interface', vehicle.prix && webHTML.includes(vehicle.prix.toString())],
    ];
    
    let passed = 0;
    for (const [name, condition] of checks) {
      if (condition) {
        console.log(`✅ ${name}: Cohérent`);
        passed++;
      } else {
        console.log(`❌ ${name}: Incohérent`);
      }
    }
    
    console.log(`\n📊 Cohérence: ${passed}/${checks.length} éléments cohérents`);
    return passed >= checks.length * 0.75;
    
  } catch (error) {
    console.log(`❌ Erreur cohérence: ${error.message}`);
    return false;
  }
}

// Exécution de tous les tests d'intégration
async function runIntegrationTests() {
  console.log('🎯 Tests d\'Intégration Complets\n');
  
  const results = {
    webPages: await testWebPages(),
    dataSource: await testDataSource(),
    performance: await testSupabasePerformance(),
    consistency: await testAPIWebConsistency(),
  };
  
  console.log('\n📊 RÉSUMÉ INTÉGRATION\n');
  
  const testNames = {
    webPages: 'Pages Web',
    dataSource: 'Source Supabase',
    performance: 'Performance',
    consistency: 'Cohérence API/Web'
  };
  
  let totalPassed = 0;
  let totalTests = 0;
  
  for (const [key, passed] of Object.entries(results)) {
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${testNames[key]}: ${passed ? 'RÉUSSI' : 'ÉCHEC'}`);
    if (passed) totalPassed++;
    totalTests++;
  }
  
  console.log(`\n🎉 SCORE INTÉGRATION: ${totalPassed}/${totalTests} catégories réussies`);
  
  if (totalPassed === totalTests) {
    console.log('\n🚀 PARFAIT ! Supabase est parfaitement intégré !');
    console.log('\n✅ Configuration terminée avec succès:');
    console.log('   • Base de données Supabase opérationnelle');
    console.log('   • APIs REST fonctionnelles');
    console.log('   • Interface web connectée');
    console.log('   • Données cohérentes');
    console.log('   • Performance optimale');
    console.log('\n📝 Prêt pour la Phase 2A - Authentification !');
  } else {
    console.log('\n⚠️  Quelques ajustements nécessaires, mais la base fonctionne !');
  }
}

// Point d'entrée
runIntegrationTests();
