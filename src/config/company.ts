// Configuration de l'entreprise TSE - Côte d'Ivoire
export const COMPANY_INFO = {
  // Informations générales
  name: 'TOTAL SERVICE EQUIPEMENT',
  shortName: 'TSE',
  slogan: 'Votre partenaire automobile de confiance',
  
  // Adresse
  address: {
    street: 'COCODY ANGRE 7ième TRANCHE',
    city: 'Abidjan',
    country: 'Côte d\'Ivoire',
    postalCode: '503 BP 138 ABJ 503'
  },
  
  // Contact
  contact: {
    phones: [
      '+225 07 07 52 52 48',
      '+225 01 50 50 95 09',
      '+225 25 20 01 99 43'
    ],
    email: 'infostse747@gmail.com',
    website: 'www.tse.ci'
  },
  
  // Informations légales
  legal: {
    regime: 'Réel simplifié',
    rccm: 'CI-ABJ-2020-B-11711',
    cc: '2035402N'
  },
  
  // Informations bancaires
  banking: {
    bank: 'BDU',
    account: 'CI180 01001 020401121832 56'
  },
  
  // Horaires d'ouverture
  hours: {
    weekdays: '08h00 - 18h00',
    saturday: '08h00 - 16h00',
    sunday: 'Fermé'
  },
  
  // Réseaux sociaux (à compléter si nécessaire)
  social: {
    facebook: '',
    instagram: '',
    linkedin: '',
    whatsapp: '+225070752524'
  }
} as const

// Configuration de la devise
export const CURRENCY_CONFIG = {
  code: 'XOF', // Code ISO pour le Franc CFA
  symbol: 'CFA',
  name: 'Franc CFA',
  position: 'after', // Position du symbole (before/after)
  decimals: 0, // Nombre de décimales (CFA n'utilise généralement pas de décimales)
  separator: ' ', // Séparateur entre le montant et le symbole
  thousandsSeparator: ' ', // Séparateur des milliers
  decimalSeparator: ',' // Séparateur décimal (style français)
} as const

// Fonction pour formater les prix en CFA
export function formatPrice(amount: number): string {
  const { symbol, position, decimals, separator, thousandsSeparator, decimalSeparator } = CURRENCY_CONFIG
  
  // Formater le nombre avec les séparateurs
  const formattedAmount = new Intl.NumberFormat('fr-CI', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: true
  }).format(amount)
  
  // Retourner avec le symbole dans la bonne position
  if (position === 'before') {
    return `${symbol}${separator}${formattedAmount}`
  } else {
    return `${formattedAmount}${separator}${symbol}`
  }
}

// Fonction pour formater les numéros de téléphone ivoiriens
export function formatPhoneNumber(phone: string): string {
  // Nettoyer le numéro
  const cleaned = phone.replace(/\D/g, '')
  
  // Format ivoirien: +225 XX XX XX XX XX
  if (cleaned.startsWith('225')) {
    const number = cleaned.substring(3)
    return `+225 ${number.substring(0, 2)} ${number.substring(2, 4)} ${number.substring(4, 6)} ${number.substring(6, 8)} ${number.substring(8, 10)}`
  }
  
  // Si le numéro commence par 0, le convertir au format international
  if (cleaned.startsWith('0')) {
    const number = cleaned.substring(1)
    return `+225 ${number.substring(0, 2)} ${number.substring(2, 4)} ${number.substring(4, 6)} ${number.substring(6, 8)} ${number.substring(8, 10)}`
  }
  
  return phone
}

// Configuration des langues
export const LANGUAGE_CONFIG = {
  primary: 'fr', // Français comme langue principale
  supported: ['fr', 'en'], // Français et anglais supportés
  currency: {
    fr: 'Franc CFA',
    en: 'CFA Franc'
  }
} as const

// Configuration du marché automobile ivoirien
export const MARKET_CONFIG = {
  // Marques populaires en Côte d'Ivoire
  popularBrands: [
    'Toyota',
    'Nissan',
    'Hyundai',
    'Kia',
    'Peugeot',
    'Renault',
    'Volkswagen',
    'Honda',
    'Mitsubishi',
    'Suzuki'
  ],
  
  // Types de véhicules populaires
  popularTypes: [
    'Berline',
    'SUV',
    'Pick-up',
    'Utilitaire',
    'Citadine',
    'Break'
  ],
  
  // Gammes de prix typiques (en CFA)
  priceRanges: [
    { min: 0, max: 5000000, label: 'Moins de 5M CFA' },
    { min: 5000000, max: 10000000, label: '5M - 10M CFA' },
    { min: 10000000, max: 20000000, label: '10M - 20M CFA' },
    { min: 20000000, max: 50000000, label: '20M - 50M CFA' },
    { min: 50000000, max: null, label: 'Plus de 50M CFA' }
  ]
} as const

// Export par défaut
export default {
  COMPANY_INFO,
  CURRENCY_CONFIG,
  LANGUAGE_CONFIG,
  MARKET_CONFIG,
  formatPrice,
  formatPhoneNumber
}
