import { Vehicle } from '@/types/vehicle'

// Données centralisées des véhicules de démonstration
export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    marque: 'Toyota',
    modele: 'Corolla Cross',
    annee: 2023,
    couleur: 'Blanc',
    prix: 28500,
    kilometrage: 15000,
    carburant: 'Hybride',
    transmission: 'Automatique',
    description: 'SUV compact hybride, parfait pour la ville et les longs trajets. Alliant efficacité énergétique et polyvalence, ce véhicule offre un excellent compromis entre performance et économie.',
    caracteristiques: {
      puissance: '122 ch',
      cylindree: '1.8L',
      consommation: '4.5L/100km',
      emissions: '102 g/km CO2',
      nombrePortes: 5,
      nombrePlaces: 5,
      coffre: '487L',
      equipements: [
        'Climatisation automatique',
        'GPS intégré',
        'Caméra de recul',
        'Bluetooth',
        'Système Toyota Safety Sense',
        'Jantes alliage 17"',
        'Éclairage LED',
        'Régulateur de vitesse adaptatif'
      ]
    },
    images: [],
    ficheTechnique: '/documents/corolla-cross-fiche.pdf',
    dateAjout: new Date('2024-01-15'),
    dateModification: new Date('2024-01-15'),
    statut: 'Disponible'
  },
  {
    id: '2',
    marque: 'Ford',
    modele: 'Territory',
    annee: 2022,
    couleur: 'Gris',
    prix: 32000,
    kilometrage: 25000,
    carburant: 'Essence',
    transmission: 'Automatique',
    description: 'SUV spacieux et confortable pour toute la famille. Doté de technologies avancées et d\'un habitacle généreux, il répond aux besoins des familles modernes.',
    caracteristiques: {
      puissance: '143 ch',
      cylindree: '1.5L',
      consommation: '7.2L/100km',
      emissions: '165 g/km CO2',
      nombrePortes: 5,
      nombrePlaces: 7,
      coffre: '448L',
      equipements: [
        'Climatisation tri-zone',
        'Écran tactile 10"',
        'Aide au stationnement',
        'Régulateur de vitesse',
        'Ford Co-Pilot360',
        'Sièges en cuir',
        'Toit panoramique',
        'Système audio premium'
      ]
    },
    images: [],
    ficheTechnique: '/documents/territory-fiche.pdf',
    dateAjout: new Date('2024-01-10'),
    dateModification: new Date('2024-01-10'),
    statut: 'Disponible'
  },
  {
    id: '3',
    marque: 'Toyota',
    modele: 'Hilux',
    annee: 2023,
    couleur: 'Noir',
    prix: 45000,
    kilometrage: 8000,
    carburant: 'Diesel',
    transmission: 'Manuelle',
    description: 'Pick-up robuste et fiable pour tous vos besoins professionnels. Reconnu pour sa durabilité exceptionnelle et ses capacités tout-terrain.',
    caracteristiques: {
      puissance: '204 ch',
      cylindree: '2.8L',
      consommation: '8.1L/100km',
      emissions: '213 g/km CO2',
      nombrePortes: 4,
      nombrePlaces: 5,
      coffre: '1085L',
      equipements: [
        'Transmission 4x4',
        'Barre de charge',
        'Crochet d\'attelage 3500kg',
        'Climatisation',
        'Différentiel arrière verrouillable',
        'Plaques de protection',
        'Système de descente assistée',
        'Pneus tout-terrain'
      ]
    },
    images: [],
    ficheTechnique: '/documents/hilux-fiche.pdf',
    dateAjout: new Date('2024-01-05'),
    dateModification: new Date('2024-01-05'),
    statut: 'Disponible'
  },
  {
    id: '4',
    marque: 'Nissan',
    modele: 'Qashqai',
    annee: 2023,
    couleur: 'Rouge',
    prix: 35000,
    kilometrage: 12000,
    carburant: 'Essence',
    transmission: 'Automatique',
    description: 'SUV urbain élégant et technologique. Pionnier du segment des crossovers, il combine style, confort et technologies de pointe.',
    caracteristiques: {
      puissance: '158 ch',
      cylindree: '1.3L',
      consommation: '6.8L/100km',
      emissions: '155 g/km CO2',
      nombrePortes: 5,
      nombrePlaces: 5,
      coffre: '504L',
      equipements: [
        'ProPILOT (conduite semi-autonome)',
        'Écran tactile 12.3"',
        'Toit panoramique',
        'Jantes alliage 19"',
        'Système audio Bose',
        'Caméra 360°',
        'Détection d\'angle mort',
        'Freinage d\'urgence intelligent'
      ]
    },
    images: [],
    ficheTechnique: '/documents/qashqai-fiche.pdf',
    dateAjout: new Date('2024-01-12'),
    dateModification: new Date('2024-01-12'),
    statut: 'Réservé'
  }
]

// Fonction pour obtenir un véhicule par ID
export function getVehicleById(id: string): Vehicle | undefined {
  return mockVehicles.find(vehicle => vehicle.id === id)
}

// Fonction pour obtenir tous les véhicules
export function getAllVehicles(): Vehicle[] {
  return mockVehicles
}

// Fonction pour obtenir les véhicules par statut
export function getVehiclesByStatus(status: string): Vehicle[] {
  return mockVehicles.filter(vehicle => vehicle.statut === status)
}
