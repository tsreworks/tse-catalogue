// Service de base de données MySQL avec Prisma
// Remplace src/lib/supabase.ts

import { PrismaClient } from '@prisma/client'
import type { 
  Brand, 
  Model, 
  Vehicle, 
  Equipment,
  VehicleImage,
  VehicleDocument,
  AdminUser,
  VehicleEquipment
} from '@prisma/client'

// Types étendus pour les relations (basés sur l'analyse du projet)
export type VehicleWithRelations = Vehicle & {
  brand: Brand
  model: Model
  images: VehicleImage[]
  documents: VehicleDocument[]
  vehicleEquipments: Array<{
    equipment: Equipment
  }>
}

export type BrandWithStats = Brand & {
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

export type ModelWithBrand = Model & {
  brand: Brand
  _count: {
    vehicles: number
  }
}

export type VehicleSearchFilters = {
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

export type PaginationOptions = {
  page?: number
  limit?: number
}

export type IncludeOptions = {
  includeImages?: boolean
  includeBrand?: boolean
  includeModel?: boolean
  includeEquipments?: boolean
  includeDocuments?: boolean
}

// Instance Prisma globale (optimisation Next.js)
declare global {
  var __prisma: PrismaClient | undefined
}

export const prisma = globalThis.__prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'pretty'
})

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}

/**
 * Service de base de données MySQL pour TSE Catalogue
 * Remplace toutes les fonctionnalités Supabase
 */
export class DatabaseService {
  
  // ==================== VÉHICULES ====================
  
  /**
   * Obtenir tous les véhicules avec filtres et pagination
   * Équivalent à la fonction searchVehicles de Supabase
   */
  static async getVehicles(
    filters: VehicleSearchFilters = {},
    pagination: PaginationOptions = {},
    includes: IncludeOptions = {}
  ) {
    const {
      search,
      brand_id,
      model_id,
      statut,
      carburant,
      transmission,
      anneeMin,
      anneeMax,
      prixMin,
      prixMax,
      kilometrageMin,
      kilometrageMax
    } = filters

    const {
      page = 1,
      limit = 20
    } = pagination

    const {
      includeImages = false,
      includeBrand = true,
      includeModel = true,
      includeEquipments = false,
      includeDocuments = false
    } = includes

    // Construction des filtres WHERE
    const where: any = {}

    // Recherche textuelle
    if (search) {
      where.OR = [
        { brand: { nom: { contains: search, mode: 'insensitive' } } },
        { model: { nom: { contains: search, mode: 'insensitive' } } },
        { couleur: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Filtres spécifiques
    if (brand_id) where.brandId = brand_id
    if (model_id) where.modelId = model_id
    if (statut) where.statut = statut
    if (carburant) where.carburant = carburant
    if (transmission) where.transmission = transmission
    
    // Filtres de plage
    if (anneeMin || anneeMax) {
      where.annee = {}
      if (anneeMin) where.annee.gte = anneeMin
      if (anneeMax) where.annee.lte = anneeMax
    }
    
    if (prixMin || prixMax) {
      where.prix = {}
      if (prixMin) where.prix.gte = prixMin
      if (prixMax) where.prix.lte = prixMax
    }
    
    if (kilometrageMin || kilometrageMax) {
      where.kilometrage = {}
      if (kilometrageMin) where.kilometrage.gte = kilometrageMin
      if (kilometrageMax) where.kilometrage.lte = kilometrageMax
    }

    // Construction des inclusions
    const include: any = {}
    if (includeBrand) include.brand = true
    if (includeModel) include.model = true
    if (includeImages) {
      include.images = {
        orderBy: [
          { estPrincipale: 'desc' },
          { ordre: 'asc' }
        ]
      }
    }
    if (includeDocuments) {
      include.documents = {
        orderBy: { createdAt: 'desc' }
      }
    }
    if (includeEquipments) {
      include.vehicleEquipments = {
        include: { equipment: true }
      }
    }

    // Exécution des requêtes
    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        include,
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'desc' }
        ],
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.vehicle.count({ where })
    ])

    return {
      vehicles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  /**
   * Obtenir un véhicule par ID avec toutes ses relations
   */
  static async getVehicleById(id: string): Promise<VehicleWithRelations | null> {
    return prisma.vehicle.findUnique({
      where: { id },
      include: {
        brand: true,
        model: true,
        images: {
          orderBy: [
            { estPrincipale: 'desc' },
            { ordre: 'asc' }
          ]
        },
        documents: {
          orderBy: { createdAt: 'desc' }
        },
        vehicleEquipments: {
          include: {
            equipment: true
          }
        }
      }
    })
  }

  /**
   * Obtenir un véhicule par slug (pour les pages publiques)
   */
  static async getVehicleBySlug(slug: string): Promise<VehicleWithRelations | null> {
    return prisma.vehicle.findFirst({
      where: { slug },
      include: {
        brand: true,
        model: true,
        images: {
          orderBy: [
            { estPrincipale: 'desc' },
            { ordre: 'asc' }
          ]
        },
        documents: {
          orderBy: { createdAt: 'desc' }
        },
        vehicleEquipments: {
          include: {
            equipment: true
          }
        }
      }
    })
  }

  /**
   * Créer un nouveau véhicule
   */
  static async createVehicle(data: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.vehicle.create({
      data,
      include: {
        brand: true,
        model: true
      }
    })
  }

  /**
   * Mettre à jour un véhicule
   */
  static async updateVehicle(id: string, data: Partial<Vehicle>) {
    return prisma.vehicle.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      },
      include: {
        brand: true,
        model: true
      }
    })
  }

  /**
   * Supprimer un véhicule
   */
  static async deleteVehicle(id: string) {
    return prisma.vehicle.delete({
      where: { id }
    })
  }

  /**
   * Opérations en lot sur les véhicules
   */
  static async updateVehiclesStatus(vehicleIds: string[], statut: string) {
    return prisma.vehicle.updateMany({
      where: { id: { in: vehicleIds } },
      data: { statut: statut as any }
    })
  }

  static async updateVehiclesPrice(vehicleIds: string[], prix: number) {
    return prisma.vehicle.updateMany({
      where: { id: { in: vehicleIds } },
      data: { prix }
    })
  }

  static async deleteVehicles(vehicleIds: string[]) {
    return prisma.vehicle.deleteMany({
      where: { id: { in: vehicleIds } }
    })
  }

  // ==================== MARQUES ====================

  /**
   * Obtenir toutes les marques avec statistiques optionnelles
   */
  static async getBrands(options: {
    includeStats?: boolean
    includeModels?: boolean
    search?: string
  } = {}): Promise<BrandWithStats[]> {
    const { includeStats = false, includeModels = false, search } = options

    const where: any = {}
    if (search) {
      where.OR = [
        { nom: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const include: any = {
      _count: {
        select: {
          vehicles: true,
          models: true
        }
      }
    }

    if (includeModels) {
      include.models = {
        orderBy: { nom: 'asc' }
      }
    }

    const brands = await prisma.brand.findMany({
      where,
      include,
      orderBy: { nom: 'asc' }
    })

    // Ajouter les statistiques détaillées si demandées
    if (includeStats) {
      const brandsWithStats = await Promise.all(
        brands.map(async (brand) => {
          const vehicleStats = await prisma.vehicle.groupBy({
            by: ['statut'],
            where: { brandId: brand.id },
            _count: true,
            _sum: { prix: true }
          })

          const stats = {
            totalVehicles: brand._count.vehicles,
            disponibles: vehicleStats.find(s => s.statut === 'Disponible')?._count || 0,
            vendus: vehicleStats.find(s => s.statut === 'Vendu')?._count || 0,
            aVenir: vehicleStats.find(s => s.statut === 'AVenir')?._count || 0,
            valeurTotale: vehicleStats.reduce((sum, s) => sum + (s._sum.prix?.toNumber() || 0), 0)
          }

          return { ...brand, stats }
        })
      )

      return brandsWithStats
    }

    return brands
  }

  /**
   * Obtenir une marque par ID
   */
  static async getBrandById(id: string) {
    return prisma.brand.findUnique({
      where: { id },
      include: {
        models: true,
        _count: {
          select: {
            vehicles: true,
            models: true
          }
        }
      }
    })
  }

  /**
   * Créer une nouvelle marque
   */
  static async createBrand(data: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.brand.create({ data })
  }

  /**
   * Mettre à jour une marque
   */
  static async updateBrand(id: string, data: Partial<Brand>) {
    return prisma.brand.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    })
  }

  /**
   * Supprimer une marque
   */
  static async deleteBrand(id: string) {
    return prisma.brand.delete({
      where: { id }
    })
  }

  /**
   * Supprimer plusieurs marques
   */
  static async deleteBrands(brandIds: string[]) {
    return prisma.brand.deleteMany({
      where: { id: { in: brandIds } }
    })
  }

  // ==================== MODÈLES ====================

  /**
   * Obtenir tous les modèles avec filtres
   */
  static async getModels(options: {
    brandId?: string
    search?: string
    includeStats?: boolean
  } = {}): Promise<ModelWithBrand[]> {
    const { brandId, search, includeStats = false } = options

    const where: any = {}
    if (brandId) where.brandId = brandId
    if (search) {
      where.OR = [
        { nom: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    return prisma.model.findMany({
      where,
      include: {
        brand: true,
        _count: {
          select: { vehicles: true }
        }
      },
      orderBy: { nom: 'asc' }
    })
  }

  /**
   * Obtenir un modèle par ID
   */
  static async getModelById(id: string) {
    return prisma.model.findUnique({
      where: { id },
      include: {
        brand: true,
        vehicles: true,
        _count: {
          select: { vehicles: true }
        }
      }
    })
  }

  /**
   * Créer un nouveau modèle
   */
  static async createModel(data: Omit<Model, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.model.create({
      data,
      include: { brand: true }
    })
  }

  /**
   * Mettre à jour un modèle
   */
  static async updateModel(id: string, data: Partial<Model>) {
    return prisma.model.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      },
      include: { brand: true }
    })
  }

  /**
   * Supprimer un modèle
   */
  static async deleteModel(id: string) {
    return prisma.model.delete({
      where: { id }
    })
  }

  // ==================== ÉQUIPEMENTS ====================

  /**
   * Obtenir tous les équipements
   */
  static async getEquipments(options: {
    categorie?: string
    search?: string
  } = {}) {
    const { categorie, search } = options

    const where: any = {}
    if (categorie) where.categorie = categorie
    if (search) {
      where.OR = [
        { nom: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    return prisma.equipment.findMany({
      where,
      orderBy: [
        { categorie: 'asc' },
        { nom: 'asc' }
      ]
    })
  }

  /**
   * Créer un nouvel équipement
   */
  static async createEquipment(data: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.equipment.create({ data })
  }

  /**
   * Assigner des équipements à des véhicules
   */
  static async assignEquipmentToVehicles(vehicleIds: string[], equipmentIds: string[]) {
    const assignments = vehicleIds.flatMap(vehicleId =>
      equipmentIds.map(equipmentId => ({
        vehicleId,
        equipmentId
      }))
    )

    return prisma.vehicleEquipment.createMany({
      data: assignments,
      skipDuplicates: true
    })
  }

  // ==================== IMAGES ====================

  /**
   * Ajouter une image à un véhicule
   */
  static async addVehicleImage(data: Omit<VehicleImage, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.vehicleImage.create({ data })
  }

  /**
   * Supprimer une image
   */
  static async deleteVehicleImage(id: string) {
    return prisma.vehicleImage.delete({
      where: { id }
    })
  }

  /**
   * Définir une image comme principale
   */
  static async setMainImage(vehicleId: string, imageId: string) {
    await prisma.$transaction([
      // Retirer le statut principal de toutes les images
      prisma.vehicleImage.updateMany({
        where: { vehicleId },
        data: { estPrincipale: false }
      }),
      // Définir la nouvelle image principale
      prisma.vehicleImage.update({
        where: { id: imageId },
        data: { estPrincipale: true }
      })
    ])
  }

  // ==================== AUTHENTIFICATION ====================

  /**
   * Obtenir un utilisateur par email
   */
  static async getUserByEmail(email: string) {
    return prisma.adminUser.findUnique({
      where: { email }
    })
  }

  /**
   * Obtenir un utilisateur par ID
   */
  static async getUserById(id: string) {
    return prisma.adminUser.findUnique({
      where: { id }
    })
  }

  /**
   * Créer un nouvel utilisateur
   */
  static async createUser(data: Omit<AdminUser, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.adminUser.create({ data })
  }

  /**
   * Mettre à jour un utilisateur
   */
  static async updateUser(id: string, data: Partial<AdminUser>) {
    return prisma.adminUser.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    })
  }

  /**
   * Créer une session utilisateur
   */
  static async createSession(userId: string, tokenHash: string, expiresAt: Date) {
    return prisma.userSession.create({
      data: {
        userId,
        tokenHash,
        expiresAt
      }
    })
  }

  /**
   * Obtenir une session par token
   */
  static async getSessionByToken(tokenHash: string) {
    return prisma.userSession.findFirst({
      where: {
        tokenHash,
        expiresAt: { gt: new Date() }
      },
      include: { user: true }
    })
  }

  /**
   * Supprimer une session
   */
  static async deleteSession(tokenHash: string) {
    return prisma.userSession.deleteMany({
      where: { tokenHash }
    })
  }

  // ==================== UTILITAIRES ====================

  /**
   * Recherche globale
   */
  static async globalSearch(query: string, limit = 10) {
    const [vehicles, brands, models] = await Promise.all([
      prisma.vehicle.findMany({
        where: {
          OR: [
            { couleur: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ]
        },
        include: { brand: true, model: true },
        take: limit
      }),
      prisma.brand.findMany({
        where: {
          nom: { contains: query, mode: 'insensitive' }
        },
        take: limit
      }),
      prisma.model.findMany({
        where: {
          nom: { contains: query, mode: 'insensitive' }
        },
        include: { brand: true },
        take: limit
      })
    ])

    return { vehicles, brands, models }
  }

  /**
   * Statistiques générales du catalogue
   */
  static async getGeneralStats() {
    const [
      totalVehicles,
      totalBrands,
      totalModels,
      totalEquipments,
      vehiclesByStatus,
      vehiclesByFuel
    ] = await Promise.all([
      prisma.vehicle.count(),
      prisma.brand.count(),
      prisma.model.count(),
      prisma.equipment.count(),
      prisma.vehicle.groupBy({
        by: ['statut'],
        _count: true
      }),
      prisma.vehicle.groupBy({
        by: ['carburant'],
        _count: true
      })
    ])

    return {
      totalVehicles,
      totalBrands,
      totalModels,
      totalEquipments,
      vehiclesByStatus,
      vehiclesByFuel
    }
  }

  /**
   * Nettoyer les sessions expirées
   */
  static async cleanupExpiredSessions() {
    return prisma.userSession.deleteMany({
      where: {
        expiresAt: { lt: new Date() }
      }
    })
  }
}

// Export des types pour compatibilité
export type { Vehicle, Brand, Model, Equipment, VehicleImage, VehicleDocument, AdminUser }

// Fonctions utilitaires pour maintenir la compatibilité avec l'ancien code
export const getVehicleWithRelations = (id: string) => DatabaseService.getVehicleById(id)
export const getBrands = () => DatabaseService.getBrands()
export const getModels = (brandId?: string) => DatabaseService.getModels({ brandId })
export const getEquipments = () => DatabaseService.getEquipments()

// Fonction de recherche compatible avec l'ancienne API
export const searchVehicles = async (
  filters: any = {},
  page: number = 1,
  limit: number = 12
) => {
  const result = await DatabaseService.getVehicles(filters, { page, limit }, {
    includeImages: true,
    includeBrand: true,
    includeModel: true,
    includeEquipments: true
  })

  return {
    vehicles: result.vehicles,
    total: result.pagination.total,
    page: result.pagination.page,
    limit: result.pagination.limit,
    totalPages: result.pagination.totalPages
  }
}

export default DatabaseService
