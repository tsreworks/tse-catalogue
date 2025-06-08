import { supabase } from '@/lib/supabase'

// Types pour la navigation du catalogue
export interface Brand {
  id: string
  nom: string
  description?: string
  logo?: string
  vehicleCount?: number
}

export interface Model {
  id: string
  nom: string
  brand_id: string
  description?: string
  vehicleCount?: number
}

export interface YearInfo {
  annee: number
  vehicleCount: number
  minPrice?: number
  maxPrice?: number
}

export interface NavigationStep {
  type: 'brand' | 'model' | 'year' | 'vehicles'
  selectedBrand?: Brand
  selectedModel?: Model
  selectedYear?: number
}

// Service pour la navigation progressive du catalogue
export class CatalogueNavigationService {
  
  // Étape 1: Récupérer toutes les marques avec le nombre de véhicules
  static async getBrands(): Promise<{ success: boolean; brands: Brand[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select(`
          id,
          nom,
          description,
          logo,
          vehicles(id)
        `)
        .order('nom')

      if (error) {
        console.error('Erreur récupération marques:', error)
        return { success: false, brands: [], error: error.message }
      }

      // Compter les véhicules par marque
      const brandsWithCount = data?.map(brand => ({
        id: brand.id,
        nom: brand.nom,
        description: brand.description,
        logo: brand.logo,
        vehicleCount: brand.vehicles?.length || 0
      })) || []

      // Retourner toutes les marques (même celles sans véhicules pour l'instant)
      return { success: true, brands: brandsWithCount }
    } catch (error) {
      console.error('Erreur service marques:', error)
      return {
        success: false,
        brands: [],
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }
    }
  }

  // Étape 2: Récupérer les modèles d'une marque avec le nombre de véhicules
  static async getModelsByBrand(brandId: string): Promise<{ success: boolean; models: Model[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('models')
        .select(`
          id,
          nom,
          brand_id,
          description,
          vehicles(id)
        `)
        .eq('brand_id', brandId)
        .order('nom')

      if (error) {
        console.error('Erreur récupération modèles:', error)
        return { success: false, models: [], error: error.message }
      }

      // Compter les véhicules par modèle
      const modelsWithCount = data?.map(model => ({
        id: model.id,
        nom: model.nom,
        brand_id: model.brand_id,
        description: model.description,
        vehicleCount: model.vehicles?.length || 0
      })) || []

      // Retourner tous les modèles (même ceux sans véhicules pour l'instant)
      return { success: true, models: modelsWithCount }
    } catch (error) {
      console.error('Erreur service modèles:', error)
      return {
        success: false,
        models: [],
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }
    }
  }

  // Étape 3: Récupérer les années disponibles pour un modèle avec statistiques
  static async getYearsByModel(modelId: string): Promise<{ success: boolean; years: YearInfo[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('annee, prix, statut')
        .eq('model_id', modelId)
        .eq('statut', 'Disponible')
        .order('annee', { ascending: false })

      if (error) {
        console.error('Erreur récupération années:', error)
        return { success: false, years: [], error: error.message }
      }

      // Grouper par année et calculer les statistiques
      const yearStats = new Map<number, { count: number; prices: number[] }>()

      data?.forEach(vehicle => {
        const year = vehicle.annee
        if (!yearStats.has(year)) {
          yearStats.set(year, { count: 0, prices: [] })
        }
        const stats = yearStats.get(year)!
        stats.count++
        if (vehicle.prix) {
          stats.prices.push(vehicle.prix)
        }
      })

      // Convertir en tableau avec statistiques
      const years: YearInfo[] = Array.from(yearStats.entries()).map(([annee, stats]) => ({
        annee,
        vehicleCount: stats.count,
        minPrice: stats.prices.length > 0 ? Math.min(...stats.prices) : undefined,
        maxPrice: stats.prices.length > 0 ? Math.max(...stats.prices) : undefined
      }))

      return { success: true, years }
    } catch (error) {
      console.error('Erreur service années:', error)
      return { 
        success: false, 
        years: [], 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      }
    }
  }

  // Étape 4: Récupérer les véhicules selon les critères sélectionnés
  static async getVehiclesByCriteria(
    brandId?: string,
    modelId?: string,
    year?: number,
    additionalFilters?: {
      couleur?: string
      carburant?: string
      transmission?: string
      prixMin?: number
      prixMax?: number
    }
  ) {
    try {
      let query = supabase
        .from('vehicles')
        .select(`
          id,
          annee,
          couleur,
          prix,
          kilometrage,
          carburant,
          transmission,
          description,
          statut,
          created_at,
          brands!inner(id, nom, logo),
          models!inner(id, nom)
        `)
        .eq('statut', 'Disponible')

      // Appliquer les filtres
      if (brandId) {
        query = query.eq('brand_id', brandId)
      }
      if (modelId) {
        query = query.eq('model_id', modelId)
      }
      if (year) {
        query = query.eq('annee', year)
      }

      // Filtres additionnels
      if (additionalFilters) {
        if (additionalFilters.couleur) {
          query = query.eq('couleur', additionalFilters.couleur)
        }
        if (additionalFilters.carburant) {
          query = query.eq('carburant', additionalFilters.carburant)
        }
        if (additionalFilters.transmission) {
          query = query.eq('transmission', additionalFilters.transmission)
        }
        if (additionalFilters.prixMin) {
          query = query.gte('prix', additionalFilters.prixMin)
        }
        if (additionalFilters.prixMax) {
          query = query.lte('prix', additionalFilters.prixMax)
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) {
        console.error('Erreur récupération véhicules:', error)
        return { success: false, vehicles: [], error: error.message }
      }

      return { success: true, vehicles: data || [] }
    } catch (error) {
      console.error('Erreur service véhicules:', error)
      return { 
        success: false, 
        vehicles: [], 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      }
    }
  }

  // Utilitaire: Récupérer les informations complètes d'une marque
  static async getBrandInfo(brandId: string): Promise<{ success: boolean; brand?: Brand; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('id, nom, description, logo')
        .eq('id', brandId)
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, brand: data }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      }
    }
  }

  // Utilitaire: Récupérer les informations complètes d'un modèle
  static async getModelInfo(modelId: string): Promise<{ success: boolean; model?: Model; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('models')
        .select('id, nom, brand_id, description')
        .eq('id', modelId)
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, model: data }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      }
    }
  }

  // Utilitaire: Construire le fil d'Ariane (breadcrumb)
  static async buildBreadcrumb(brandId?: string, modelId?: string, year?: number) {
    const breadcrumb = []

    if (brandId) {
      const brandResult = await this.getBrandInfo(brandId)
      if (brandResult.success && brandResult.brand) {
        breadcrumb.push({
          type: 'brand',
          label: brandResult.brand.nom,
          href: `/catalogue?brand=${brandId}`
        })
      }
    }

    if (modelId && brandId) {
      const modelResult = await this.getModelInfo(modelId)
      if (modelResult.success && modelResult.model) {
        breadcrumb.push({
          type: 'model',
          label: modelResult.model.nom,
          href: `/catalogue?brand=${brandId}&model=${modelId}`
        })
      }
    }

    if (year && brandId && modelId) {
      breadcrumb.push({
        type: 'year',
        label: year.toString(),
        href: `/catalogue?brand=${brandId}&model=${modelId}&year=${year}`
      })
    }

    return breadcrumb
  }
}
