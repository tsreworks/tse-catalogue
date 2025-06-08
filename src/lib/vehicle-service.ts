// Service pour gérer les véhicules côté client
import { VehicleWithRelations, VehicleFilters, VehicleSearchResult, Brand, Model } from '@/lib/supabase'

const API_BASE_URL = '/api'

// Service pour les véhicules
export class VehicleService {
  // Récupérer tous les véhicules avec filtres
  static async getVehicles(
    filters: VehicleFilters = {},
    page: number = 1,
    limit: number = 12
  ): Promise<VehicleSearchResult> {
    const params = new URLSearchParams()
    
    // Ajouter les filtres aux paramètres
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString())
      }
    })
    
    params.append('page', page.toString())
    params.append('limit', limit.toString())

    const response = await fetch(`${API_BASE_URL}/vehicles?${params}`)
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des véhicules')
    }
    
    return response.json()
  }

  // Récupérer un véhicule par ID
  static async getVehicleById(id: string): Promise<VehicleWithRelations> {
    const response = await fetch(`${API_BASE_URL}/vehicles/${id}`)
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Véhicule non trouvé')
      }
      throw new Error('Erreur lors de la récupération du véhicule')
    }
    
    return response.json()
  }

  // Créer un nouveau véhicule
  static async createVehicle(vehicleData: any): Promise<VehicleWithRelations> {
    const response = await fetch(`${API_BASE_URL}/vehicles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vehicleData),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erreur lors de la création du véhicule')
    }
    
    return response.json()
  }

  // Mettre à jour un véhicule
  static async updateVehicle(id: string, vehicleData: any): Promise<VehicleWithRelations> {
    const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vehicleData),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erreur lors de la mise à jour du véhicule')
    }
    
    return response.json()
  }

  // Supprimer un véhicule
  static async deleteVehicle(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erreur lors de la suppression du véhicule')
    }
  }
}

// Service pour les marques
export class BrandService {
  // Récupérer toutes les marques
  static async getBrands(): Promise<Brand[]> {
    const response = await fetch(`${API_BASE_URL}/brands`)
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des marques')
    }
    
    return response.json()
  }

  // Créer une nouvelle marque
  static async createBrand(brandData: { nom: string; description?: string; logo?: string }): Promise<Brand> {
    const response = await fetch(`${API_BASE_URL}/brands`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(brandData),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erreur lors de la création de la marque')
    }
    
    return response.json()
  }
}

// Service pour les modèles
export class ModelService {
  // Récupérer tous les modèles (optionnellement filtrés par marque)
  static async getModels(brandId?: string): Promise<Model[]> {
    const params = brandId ? `?brandId=${brandId}` : ''
    const response = await fetch(`${API_BASE_URL}/models${params}`)
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des modèles')
    }
    
    return response.json()
  }

  // Créer un nouveau modèle
  static async createModel(modelData: { nom: string; brand_id: string; description?: string }): Promise<Model> {
    const response = await fetch(`${API_BASE_URL}/models`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(modelData),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erreur lors de la création du modèle')
    }
    
    return response.json()
  }
}

// Hooks React pour utiliser les services
export const useVehicles = () => {
  return {
    getVehicles: VehicleService.getVehicles,
    getVehicleById: VehicleService.getVehicleById,
    createVehicle: VehicleService.createVehicle,
    updateVehicle: VehicleService.updateVehicle,
    deleteVehicle: VehicleService.deleteVehicle,
  }
}

export const useBrands = () => {
  return {
    getBrands: BrandService.getBrands,
    createBrand: BrandService.createBrand,
  }
}

export const useModels = () => {
  return {
    getModels: ModelService.getModels,
    createModel: ModelService.createModel,
  }
}
