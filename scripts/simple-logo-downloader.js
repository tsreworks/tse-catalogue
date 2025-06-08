// Script simplifié pour télécharger les logos des marques
console.log('🚀 Début du téléchargement des logos...');

const fs = require('fs');
const path = require('path');

// Créer le dossier de destination
const logoDir = path.join(__dirname, '..', 'public', 'images', 'brands');

console.log('📁 Dossier de destination:', logoDir);

// Vérifier si le dossier existe
if (fs.existsSync(logoDir)) {
  console.log('✅ Dossier existe déjà');
} else {
  console.log('❌ Dossier n\'existe pas');
  process.exit(1);
}

// Créer des logos SVG simples pour les marques principales
const brands = [
  'toyota', 'nissan', 'honda', 'hyundai', 'kia', 
  'peugeot', 'renault', 'volkswagen', 'bmw', 'mercedes',
  'audi', 'ford', 'mazda', 'mitsubishi', 'suzuki'
];

// Template SVG simple
function createSimpleLogo(brandName) {
  return `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2" rx="20"/>
    <circle cx="100" cy="80" r="25" fill="#3b82f6"/>
    <rect x="75" y="115" width="50" height="30" fill="#3b82f6" rx="5"/>
    <circle cx="85" cy="155" r="12" fill="#1e40af"/>
    <circle cx="115" cy="155" r="12" fill="#1e40af"/>
    <text x="100" y="185" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#1e40af">${brandName.toUpperCase()}</text>
  </svg>`;
}

// Créer les logos SVG
let created = 0;
brands.forEach(brand => {
  const svgPath = path.join(logoDir, `${brand}.svg`);
  const pngPath = path.join(logoDir, `${brand}.png`);
  
  // Vérifier si le fichier existe déjà
  if (fs.existsSync(svgPath) || fs.existsSync(pngPath)) {
    console.log(`⏭️  ${brand} existe déjà`);
    return;
  }
  
  try {
    const svgContent = createSimpleLogo(brand);
    fs.writeFileSync(svgPath, svgContent);
    console.log(`✅ ${brand}.svg créé`);
    created++;
  } catch (error) {
    console.error(`❌ Erreur pour ${brand}:`, error.message);
  }
});

// Créer un logo par défaut
const defaultSvg = path.join(logoDir, 'default.svg');
if (!fs.existsSync(defaultSvg)) {
  const defaultContent = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2" rx="20"/>
    <circle cx="100" cy="80" r="25" fill="#6b7280"/>
    <rect x="75" y="115" width="50" height="30" fill="#6b7280" rx="5"/>
    <circle cx="85" cy="155" r="12" fill="#374151"/>
    <circle cx="115" cy="155" r="12" fill="#374151"/>
    <text x="100" y="185" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#6b7280">AUTO</text>
  </svg>`;
  
  fs.writeFileSync(defaultSvg, defaultContent);
  console.log('🎨 Logo par défaut créé');
  created++;
}

console.log('\n📊 Résumé:');
console.log(`✅ Logos créés: ${created}`);
console.log(`📁 Dossier: ${logoDir}`);
console.log('\n💡 Note: Les logos SVG sont temporaires. Pour de vrais logos PNG, utilisez le script complet ou téléchargez manuellement.');

console.log('\n🎯 Prochaines étapes:');
console.log('1. Exécuter le script SQL pour insérer les marques');
console.log('2. Tester le catalogue sur http://localhost:3007/catalogue');
console.log('3. Remplacer les SVG par de vrais logos PNG si souhaité');
