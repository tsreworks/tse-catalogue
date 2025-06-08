const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration des logos à télécharger
const brandLogos = [
  // Marques prioritaires avec URLs de logos de qualité
  {
    name: 'toyota',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Toyota_Logo.svg/200px-Toyota_Logo.svg.png',
    priority: 1
  },
  {
    name: 'nissan',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Nissan_logo.svg/200px-Nissan_logo.svg.png',
    priority: 1
  },
  {
    name: 'honda',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Honda_logo.svg/200px-Honda_logo.svg.png',
    priority: 1
  },
  {
    name: 'hyundai',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Hyundai_Motor_Company_logo.svg/200px-Hyundai_Motor_Company_logo.svg.png',
    priority: 1
  },
  {
    name: 'kia',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Kia_logo2.svg/200px-Kia_logo2.svg.png',
    priority: 1
  },
  {
    name: 'peugeot',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Peugeot_logo.svg/200px-Peugeot_logo.svg.png',
    priority: 1
  },
  {
    name: 'renault',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Renault_logo.svg/200px-Renault_logo.svg.png',
    priority: 1
  },
  {
    name: 'volkswagen',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Volkswagen_logo_2019.svg/200px-Volkswagen_logo_2019.svg.png',
    priority: 2
  },
  {
    name: 'bmw',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/200px-BMW.svg.png',
    priority: 2
  },
  {
    name: 'mercedes',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Logo.svg/200px-Mercedes-Logo.svg.png',
    priority: 2
  },
  {
    name: 'audi',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Audi-Logo_2016.svg/200px-Audi-Logo_2016.svg.png',
    priority: 2
  },
  {
    name: 'ford',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Ford_logo_flat.svg/200px-Ford_logo_flat.svg.png',
    priority: 2
  },
  {
    name: 'mazda',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Mazda_logo.svg/200px-Mazda_logo.svg.png',
    priority: 2
  },
  {
    name: 'mitsubishi',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Mitsubishi_logo.svg/200px-Mitsubishi_logo.svg.png',
    priority: 2
  },
  {
    name: 'suzuki',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Suzuki_logo_2.svg/200px-Suzuki_logo_2.svg.png',
    priority: 2
  },
  {
    name: 'citroen',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Citro%C3%ABn_logo.svg/200px-Citro%C3%ABn_logo.svg.png',
    priority: 2
  },
  {
    name: 'chevrolet',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Chevrolet-logo.svg/200px-Chevrolet-logo.svg.png',
    priority: 3
  },
  {
    name: 'jeep',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Jeep_logo.svg/200px-Jeep_logo.svg.png',
    priority: 3
  },
  {
    name: 'fiat',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Fiat_logo.svg/200px-Fiat_logo.svg.png',
    priority: 3
  },
  {
    name: 'volvo',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Volvo_logo.svg/200px-Volvo_logo.svg.png',
    priority: 3
  }
];

// Dossier de destination
const logoDir = path.join(__dirname, '..', 'public', 'images', 'brands');

// Créer le dossier s'il n'existe pas
if (!fs.existsSync(logoDir)) {
  fs.mkdirSync(logoDir, { recursive: true });
  console.log('📁 Dossier créé:', logoDir);
}

// Fonction pour télécharger un fichier
function downloadFile(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(logoDir, filename);
    
    // Vérifier si le fichier existe déjà
    if (fs.existsSync(filePath)) {
      console.log(`⏭️  ${filename} existe déjà`);
      resolve();
      return;
    }

    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ ${filename} téléchargé`);
          resolve();
        });
      } else {
        fs.unlink(filePath, () => {}); // Supprimer le fichier en cas d'erreur
        reject(new Error(`Erreur HTTP: ${response.statusCode} pour ${url}`));
      }
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Supprimer le fichier en cas d'erreur
      reject(err);
    });
  });
}

// Fonction principale
async function downloadAllLogos() {
  console.log('🚀 Début du téléchargement des logos de marques...\n');
  
  // Trier par priorité
  const sortedLogos = brandLogos.sort((a, b) => a.priority - b.priority);
  
  let downloaded = 0;
  let errors = 0;
  
  for (const logo of sortedLogos) {
    try {
      await downloadFile(logo.url, `${logo.name}.png`);
      downloaded++;
      
      // Pause entre les téléchargements pour éviter la surcharge
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`❌ Erreur pour ${logo.name}:`, error.message);
      errors++;
    }
  }
  
  console.log('\n📊 Résumé:');
  console.log(`✅ Téléchargés: ${downloaded}`);
  console.log(`❌ Erreurs: ${errors}`);
  console.log(`📁 Dossier: ${logoDir}`);
  
  // Créer un logo par défaut si nécessaire
  createDefaultLogo();
}

// Créer un logo par défaut pour les marques sans logo
function createDefaultLogo() {
  const defaultLogoPath = path.join(logoDir, 'default.png');
  
  if (!fs.existsSync(defaultLogoPath)) {
    // Créer un fichier SVG simple et le convertir
    const svgContent = `
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#f3f4f6" rx="20"/>
        <circle cx="100" cy="80" r="30" fill="#6b7280"/>
        <rect x="70" y="120" width="60" height="40" fill="#6b7280" rx="5"/>
        <circle cx="85" cy="170" r="15" fill="#374151"/>
        <circle cx="115" cy="170" r="15" fill="#374151"/>
        <text x="100" y="195" text-anchor="middle" font-family="Arial" font-size="12" fill="#6b7280">AUTO</text>
      </svg>
    `;
    
    fs.writeFileSync(defaultLogoPath.replace('.png', '.svg'), svgContent);
    console.log('🎨 Logo par défaut créé (SVG)');
  }
}

// Lancer le téléchargement
if (require.main === module) {
  downloadAllLogos().catch(console.error);
}

module.exports = { downloadAllLogos, brandLogos };
