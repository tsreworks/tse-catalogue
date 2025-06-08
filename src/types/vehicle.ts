export interface Vehicle {
  id: string
  marque: string
  modele: string
  annee: number
  couleur: string
  prix?: number
  kilometrage?: number
  carburant: 'Essence' | 'Diesel' | 'Hybride' | 'Électrique'
  transmission: 'Manuelle' | 'Automatique'
  description?: string
  caracteristiques: VehicleCaracteristiques
  images: VehicleImage[]
  ficheTechnique?: string // URL vers le PDF
  dateAjout: Date
  dateModification: Date
  statut: 'Disponible' | 'Vendu' | 'Réservé' | 'En maintenance'
}

export interface VehicleCaracteristiques {
  puissance?: string // ex: "150 ch"
  cylindree?: string // ex: "2.0L"
  consommation?: string // ex: "6.5L/100km"
  emissions?: string // ex: "120 g/km CO2"
  nombrePortes?: number
  nombrePlaces?: number
  coffre?: string // ex: "500L"
  equipements?: string[]
}

export interface VehicleImage {
  id: string
  url: string
  alt: string
  ordre: number
  estPrincipale: boolean
}

export interface Marque {
  id: string
  nom: string
  logo?: string
  dateCreation: Date
}

export interface Modele {
  id: string
  nom: string
  marqueId: string
  marque?: Marque
  dateCreation: Date
}

export interface VehicleFilters {
  marque?: string
  modele?: string
  anneeMin?: number
  anneeMax?: number
  prixMin?: number
  prixMax?: number
  couleur?: string
  carburant?: string
  transmission?: string
  statut?: string
  recherche?: string // recherche textuelle
}

export interface VehicleSearchResult {
  vehicles: Vehicle[]
  total: number
  page: number
  limit: number
  totalPages: number
}
