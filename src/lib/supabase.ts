import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variables d\'environnement Supabase manquantes')
}

// Client Supabase pour le côté client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Client Supabase pour le côté serveur (avec service role key)
// Note: Cette fonction ne doit être utilisée que côté serveur
export const createSupabaseAdmin = () => {
  if (typeof window !== 'undefined') {
    throw new Error('supabaseAdmin ne peut être utilisé que côté serveur')
  }

  return createClient<Database>(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

// Types pour les requêtes
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Types spécifiques pour nos entités
export type Brand = Tables<'brands'>
export type Model = Tables<'models'>
export type Vehicle = Tables<'vehicles'>
export type Equipment = Tables<'equipments'>
export type VehicleImage = Tables<'vehicle_images'>
export type VehicleDocument = Tables<'vehicle_documents'>
export type AdminUser = Tables<'admin_users'>

// Types pour les insertions
export type BrandInsert = Inserts<'brands'>
export type ModelInsert = Inserts<'models'>
export type VehicleInsert = Inserts<'vehicles'>
export type EquipmentInsert = Inserts<'equipments'>
export type VehicleImageInsert = Inserts<'vehicle_images'>
export type VehicleDocumentInsert = Inserts<'vehicle_documents'>

// Types pour les mises à jour
export type BrandUpdate = Updates<'brands'>
export type ModelUpdate = Updates<'models'>
export type VehicleUpdate = Updates<'vehicles'>
export type EquipmentUpdate = Updates<'equipments'>
export type VehicleImageUpdate = Updates<'vehicle_images'>
export type VehicleDocumentUpdate = Updates<'vehicle_documents'>

// Type pour un véhicule complet avec ses relations
export interface VehicleWithRelations extends Vehicle {
  brand?: Brand
  model?: Model
  vehicle_images?: VehicleImage[]
  vehicle_documents?: VehicleDocument[]
  equipments?: Equipment[]
}

// Type pour les filtres de recherche
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
  recherche?: string
}

// Type pour les résultats de recherche paginés
export interface VehicleSearchResult {
  vehicles: VehicleWithRelations[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Fonctions utilitaires pour les requêtes
export const getVehicleWithRelations = () => {
  return supabase
    .from('vehicles')
    .select(`
      *,
      brand:brands(*),
      model:models(*),
      vehicle_images(*),
      vehicle_documents(*),
      equipments:vehicle_equipments(equipment:equipments(*))
    `)
}

export const getBrands = () => {
  return supabase
    .from('brands')
    .select('*')
    .order('nom')
}

export const getModels = (brandId?: string) => {
  let query = supabase
    .from('models')
    .select('*, brand:brands(*)')
    .order('nom')
  
  if (brandId) {
    query = query.eq('brand_id', brandId)
  }
  
  return query
}

export const getEquipments = () => {
  return supabase
    .from('equipments')
    .select('*')
    .order('categorie, nom')
}

// Fonction pour rechercher des véhicules avec filtres (version simplifiée)
export const searchVehicles = async (
  filters: VehicleFilters = {},
  page: number = 1,
  limit: number = 12
): Promise<VehicleSearchResult> => {
  let query = supabase
    .from('vehicles')
    .select(`
      *,
      brand:brands(*),
      model:models(*),
      vehicle_images(*),
      vehicle_documents(*),
      equipments:vehicle_equipments(equipment:equipments(*))
    `, { count: 'exact' })

  // Application des filtres directs (sans relations)
  if (filters.anneeMin) {
    query = query.gte('annee', filters.anneeMin)
  }

  if (filters.anneeMax) {
    query = query.lte('annee', filters.anneeMax)
  }

  if (filters.prixMin) {
    query = query.gte('prix', filters.prixMin)
  }

  if (filters.prixMax) {
    query = query.lte('prix', filters.prixMax)
  }

  if (filters.couleur) {
    query = query.ilike('couleur', `%${filters.couleur}%`)
  }

  if (filters.carburant) {
    query = query.eq('carburant', filters.carburant)
  }

  if (filters.transmission) {
    query = query.eq('transmission', filters.transmission)
  }

  if (filters.statut) {
    query = query.eq('statut', filters.statut)
  }

  if (filters.recherche) {
    // Recherche textuelle simple
    const searchTerm = `%${filters.recherche}%`
    query = query.or(`couleur.ilike.${searchTerm},description.ilike.${searchTerm}`)
  }

  // Pagination
  const from = (page - 1) * limit
  const to = from + limit - 1

  // Exécution de la requête avec pagination
  const { data: vehicles, error, count } = await query
    .range(from, to)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  // Filtrage post-requête pour les relations (marque, modèle)
  let filteredVehicles = vehicles || []

  if (filters.marque) {
    filteredVehicles = filteredVehicles.filter(v =>
      v.brand?.nom === filters.marque
    )
  }

  if (filters.modele) {
    filteredVehicles = filteredVehicles.filter(v =>
      v.model?.nom === filters.modele
    )
  }

  const totalPages = Math.ceil((count || 0) / limit)

  return {
    vehicles: filteredVehicles,
    total: count || 0,
    page,
    limit,
    totalPages
  }
}
