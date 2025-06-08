// Types pour la base de données MySQL avec Prisma
// Remplace src/types/database.ts pour la migration

// Import des types générés par Prisma
export type {
  Brand,
  Model,
  Vehicle,
  Equipment,
  VehicleImage,
  VehicleDocument,
  VehicleEquipment,
  AdminUser,
  UserSession,
  VehicleType,
  FuelType,
  TransmissionType,
  VehicleStatus,
  EquipmentCategory,
  DocumentType,
  AdminRole
} from '@prisma/client'

// Types étendus pour les relations
export interface VehicleWithRelations {
  id: string
  brandId: string
  modelId: string
  annee: number
  couleur: string
  prix: number | null
  kilometrage: number
  carburant: string
  transmission: string
  statut: string
  description: string | null
  puissance: string | null
  cylindree: string | null
  consommation: string | null
  emissionsCo2: string | null
  nombrePortes: number | null
  nombrePlaces: number | null
  coffre: string | null
  puissanceCv: number | null
  consommationL100km: number | null
  longueurMm: number | null
  largeurMm: number | null
  hauteurMm: number | null
  poidsKg: number | null
  equipements: string | null
  slug: string | null
  featured: boolean
  createdAt: Date
  updatedAt: Date
  brand: Brand
  model: Model
  images: VehicleImage[]
  documents: VehicleDocument[]
  vehicleEquipments: Array<{
    equipment: Equipment
  }>
}

export interface BrandWithStats {
  id: string
  nom: string
  description: string | null
  logo: string | null
  siteWeb: string | null
  paysOrigine: string | null
  createdAt: Date
  updatedAt: Date
  _count: {
    vehicles: number
    models: number
  }
  stats?: {
    totalVehicles: number
    disponibles: number
    vendus: number
    aVenir: number
    valeurTotale: number
  }
  models?: Model[]
}

export interface ModelWithBrand {
  id: string
  nom: string
  brandId: string
  description: string | null
  typeVehicule: string
  createdAt: Date
  updatedAt: Date
  brand: Brand
  _count: {
    vehicles: number
  }
}

// Types pour les filtres de recherche
export interface VehicleSearchFilters {
  search?: string
  brand_id?: string
  model_id?: string
  statut?: string
  carburant?: string
  transmission?: string
  anneeMin?: number
  anneeMax?: number
  prixMin?: number
  prixMax?: number
  kilometrageMin?: number
  kilometrageMax?: number
}

export interface PaginationOptions {
  page?: number
  limit?: number
}

export interface IncludeOptions {
  includeImages?: boolean
  includeBrand?: boolean
  includeModel?: boolean
  includeEquipments?: boolean
  includeDocuments?: boolean
}

// Types pour l'authentification
export interface AuthUser {
  id: string
  email: string
  nom?: string | null
  prenom?: string | null
  role: 'admin' | 'super_admin'
  actif: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  nom?: string
  prenom?: string
  role?: 'admin' | 'super_admin'
}

export interface AuthState {
  user: AuthUser | null
  loading: boolean
  error: string | null
}

// Types pour le storage
export interface UploadOptions {
  folder?: string
  generateUniqueFilename?: boolean
  resize?: {
    maxWidth?: number
    maxHeight?: number
    quality?: number
  }
  allowedTypes?: string[]
  maxSize?: number
}

export interface UploadResult {
  success: boolean
  url?: string
  key?: string
  filename?: string
  size?: number
  error?: string
}

export interface FileInfo {
  name: string
  size: number
  type: string
  extension: string
  isImage: boolean
}

// Types pour les réponses API
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T = any> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Types pour la validation
export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

// Types pour les statistiques
export interface CatalogueStats {
  totalVehicles: number
  totalBrands: number
  totalModels: number
  totalEquipments: number
  vehiclesByStatus: Array<{
    statut: string
    _count: number
  }>
  vehiclesByFuel: Array<{
    carburant: string
    _count: number
  }>
}

// Types pour la migration
export interface MigrationReport {
  timestamp: string
  duration: number
  tables: Record<string, number>
  storage: Record<string, number>
  files_generated: string[]
}

// Types pour les opérations en lot
export interface BulkOperation {
  action: 'update_status' | 'update_price' | 'delete' | 'assign_equipment'
  vehicleIds: string[]
  data?: any
}

export interface BulkOperationResult {
  success: boolean
  affected: number
  action: string
  errors?: string[]
}

// Types pour les formulaires
export interface VehicleFormData {
  brand_id: string
  model_id: string
  annee: number
  couleur: string
  prix?: number
  kilometrage?: number
  carburant: string
  transmission: string
  statut?: string
  description?: string
  puissance?: string
  cylindree?: string
  consommation?: string
  emissions?: string
  nombre_portes?: number
  nombre_places?: number
  coffre?: string
  featured?: boolean
}

export interface BrandFormData {
  nom: string
  description?: string
  logo?: string
  site_web?: string
  pays_origine?: string
}

export interface ModelFormData {
  nom: string
  brand_id: string
  description?: string
  type_vehicule?: string
}

export interface EquipmentFormData {
  nom: string
  description?: string
  categorie?: string
  icone?: string
}

// Types pour les hooks
export interface UseVehiclesOptions {
  filters?: VehicleSearchFilters
  pagination?: PaginationOptions
  includes?: IncludeOptions
  enabled?: boolean
}

export interface UseVehiclesResult {
  vehicles: VehicleWithRelations[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  refetch: () => void
}

// Types pour les contextes
export interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  error: string | null
  signIn: (credentials: LoginCredentials) => Promise<void>
  signOut: () => Promise<void>
  register: (data: RegisterData) => Promise<void>
}

export interface VehicleContextType {
  vehicles: VehicleWithRelations[]
  selectedVehicle: VehicleWithRelations | null
  loading: boolean
  error: string | null
  filters: VehicleSearchFilters
  setFilters: (filters: VehicleSearchFilters) => void
  selectVehicle: (vehicle: VehicleWithRelations | null) => void
  refreshVehicles: () => void
}

// Compatibilité avec l'ancien code Supabase (pour la transition)
export interface LegacyVehicleFilters {
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
  recherche?: string
}

// Fonction de conversion pour la compatibilité
export function convertLegacyFilters(legacy: LegacyVehicleFilters): VehicleSearchFilters {
  return {
    search: legacy.recherche,
    brand_id: legacy.marque,
    model_id: legacy.modele,
    anneeMin: legacy.anneeMin,
    anneeMax: legacy.anneeMax,
    prixMin: legacy.prixMin,
    prixMax: legacy.prixMax,
    carburant: legacy.carburant,
    transmission: legacy.transmission,
    statut: legacy.statut
  }
}

// Export des types principaux pour faciliter l'import
export type {
  Brand,
  Model,
  Vehicle,
  Equipment,
  VehicleImage,
  VehicleDocument,
  AdminUser
} from '@prisma/client'
