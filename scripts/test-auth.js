// Script de test pour l'authentification TSE Catalogue
// Usage: node scripts/test-auth.js

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3005';

console.log('🔐 Tests d\'Authentification TSE Catalogue\n');

// Test des pages d'authentification
async function testAuthPages() {
  console.log('📱 Test des Pages d\'Authentification\n');
  
  const pages = [
    ['Page de connexion', `${BASE_URL}/auth/login`],
    ['Page accès refusé', `${BASE_URL}/auth/unauthorized`],
  ];
  
  let passed = 0;
  for (const [name, url] of pages) {
    try {
      console.log(`🔍 Test: ${name}`);
      const response = await fetch(url);
      
      if (response.ok) {
        console.log(`✅ ${name}: Accessible (${response.status})`);
        passed++;
      } else {
        console.log(`❌ ${name}: Status ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${name}: Erreur - ${error.message}`);
    }
    console.log('');
  }
  
  console.log(`📊 Résultat: ${passed}/${pages.length} pages accessibles\n`);
  return passed === pages.length;
}

// Test de protection des routes
async function testRouteProtection() {
  console.log('🛡️  Test de Protection des Routes\n');
  
  try {
    console.log('🔍 Test: Accès /admin sans authentification');
    const response = await fetch(`${BASE_URL}/admin`, {
      redirect: 'manual' // Ne pas suivre les redirections
    });
    
    // On s'attend à une redirection ou à du contenu qui demande l'authentification
    if (response.status === 200) {
      const html = await response.text();
      if (html.includes('Connexion') || html.includes('login') || html.includes('Vérification des permissions')) {
        console.log('✅ Protection active: Page demande authentification');
        return true;
      } else {
        console.log('⚠️  Protection incertaine: Page accessible sans authentification');
        return false;
      }
    } else if (response.status >= 300 && response.status < 400) {
      console.log('✅ Protection active: Redirection détectée');
      return true;
    } else {
      console.log(`❌ Protection échouée: Status ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Erreur test protection: ${error.message}`);
    return false;
  }
}

// Test de la structure des composants d'authentification
async function testAuthComponents() {
  console.log('🧩 Test des Composants d\'Authentification\n');
  
  try {
    console.log('🔍 Test: Page de connexion contient le formulaire');
    const response = await fetch(`${BASE_URL}/auth/login`);
    const html = await response.text();
    
    const checks = [
      ['Formulaire de connexion', html.includes('email') && html.includes('password')],
      ['Titre approprié', html.includes('Connexion') || html.includes('Administrateur')],
      ['Champs requis', html.includes('required')],
      ['Bouton de soumission', html.includes('Se connecter') || html.includes('Connexion')],
    ];
    
    let passed = 0;
    for (const [name, condition] of checks) {
      if (condition) {
        console.log(`✅ ${name}: Présent`);
        passed++;
      } else {
        console.log(`❌ ${name}: Manquant`);
      }
    }
    
    console.log(`\n📊 Composants: ${passed}/${checks.length} éléments présents\n`);
    return passed >= checks.length * 0.75; // 75% de réussite
    
  } catch (error) {
    console.log(`❌ Erreur test composants: ${error.message}`);
    return false;
  }
}

// Test de la configuration Supabase Auth
async function testSupabaseAuthConfig() {
  console.log('⚙️  Test Configuration Supabase Auth\n');
  
  try {
    // Vérifier que les variables d'environnement sont présentes
    console.log('🔍 Test: Variables d\'environnement');
    
    // On ne peut pas accéder aux variables d'environnement depuis ce script
    // mais on peut tester si l'application se charge correctement
    const response = await fetch(`${BASE_URL}/auth/login`);
    
    if (response.ok) {
      const html = await response.text();
      
      // Vérifier qu'il n'y a pas d'erreurs de configuration visibles
      if (html.includes('Variables d\'environnement manquantes') || 
          html.includes('Configuration error') ||
          html.includes('Supabase error')) {
        console.log('❌ Erreurs de configuration détectées');
        return false;
      } else {
        console.log('✅ Configuration semble correcte');
        return true;
      }
    } else {
      console.log(`❌ Erreur chargement page: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Erreur test configuration: ${error.message}`);
    return false;
  }
}

// Test de performance des pages d'authentification
async function testAuthPerformance() {
  console.log('⚡ Test Performance Authentification\n');
  
  const tests = [
    ['Page de connexion', `${BASE_URL}/auth/login`],
    ['Page admin (protection)', `${BASE_URL}/admin`],
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
      
      if (duration < 2000) { // 2 secondes max pour les pages d'auth
        console.log(`✅ ${name}: ${duration}ms`);
        passed++;
      } else {
        console.log(`⚠️  ${name}: ${duration}ms (lent)`);
      }
    } catch (error) {
      console.log(`❌ ${name}: ${error.message}`);
    }
  }
  
  const avgTime = Math.round(totalTime / tests.length);
  console.log(`\n📊 Performance moyenne: ${avgTime}ms`);
  
  if (avgTime < 1000) {
    console.log('🚀 Performance excellente !');
  } else if (avgTime < 2000) {
    console.log('👍 Performance correcte');
  } else {
    console.log('⚠️  Performance à optimiser');
  }
  
  return passed >= tests.length * 0.75;
}

// Exécution de tous les tests d'authentification
async function runAuthTests() {
  console.log('🎯 Tests d\'Authentification Complets\n');
  
  const results = {
    pages: await testAuthPages(),
    protection: await testRouteProtection(),
    components: await testAuthComponents(),
    config: await testSupabaseAuthConfig(),
    performance: await testAuthPerformance(),
  };
  
  console.log('\n📊 RÉSUMÉ AUTHENTIFICATION\n');
  
  const testNames = {
    pages: 'Pages d\'Authentification',
    protection: 'Protection des Routes',
    components: 'Composants d\'Interface',
    config: 'Configuration Supabase',
    performance: 'Performance'
  };
  
  let totalPassed = 0;
  let totalTests = 0;
  
  for (const [key, passed] of Object.entries(results)) {
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${testNames[key]}: ${passed ? 'RÉUSSI' : 'ÉCHEC'}`);
    if (passed) totalPassed++;
    totalTests++;
  }
  
  console.log(`\n🎉 SCORE AUTHENTIFICATION: ${totalPassed}/${totalTests} catégories réussies`);
  
  if (totalPassed === totalTests) {
    console.log('\n🚀 PARFAIT ! Authentification entièrement fonctionnelle !');
    console.log('\n✅ Prêt pour les tests de connexion:');
    console.log('1. Aller sur http://localhost:3005/auth/login');
    console.log('2. Utiliser: admin@tse.com / TseAdmin2025!');
    console.log('3. Vérifier l\'accès à /admin');
    console.log('4. Tester la déconnexion');
  } else if (totalPassed >= totalTests * 0.75) {
    console.log('\n👍 Authentification majoritairement fonctionnelle !');
    console.log('Quelques ajustements mineurs peuvent être nécessaires.');
  } else {
    console.log('\n⚠️  Problèmes détectés dans l\'authentification.');
    console.log('Vérifiez la configuration Supabase et les composants.');
  }
}

// Vérification que le serveur est accessible
async function checkServer() {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`);
    return response.ok;
  } catch (error) {
    console.log('❌ Serveur non accessible. Vérifiez que npm run dev est lancé sur le port 3005.');
    return false;
  }
}

// Point d'entrée
async function main() {
  if (await checkServer()) {
    await runAuthTests();
  }
}

main();
