// Service d'administration pour le back office TSE
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

type Tables = Database['public']['Tables']
type Vehicle = Tables['vehicles']['Row']
type Brand = Tables['brands']['Row']
type Model = Tables['models']['Row']
type Equipment = Tables['equipments']['Row']

export interface AdminStats {
  totalVehicles: number
  disponibles: number
  vendus: number
  reserves: number
  enMaintenance: number
  valeurTotale: number
  prixMoyen: number
  tauxDisponibilite: number
  totalBrands: number
  totalModels: number
  recentActivity: ActivityItem[]
}

export interface ActivityItem {
  id: string
  type: 'create' | 'update' | 'delete'
  entity: 'vehicle' | 'brand' | 'model'
  entityName: string
  userId: string
  userName: string
  timestamp: string
}

export interface BulkOperation {
  action: 'update_status' | 'update_price' | 'delete' | 'assign_equipment'
  vehicleIds: string[]
  data?: any
}

export class AdminService {
  // Récupérer les statistiques complètes du tableau de bord
  static async getDashboardStats(): Promise<AdminStats> {
    try {
      // Récupérer tous les véhicules avec leurs relations
      const { data: vehicles, error: vehiclesError } = await supabase
        .from('vehicles')
        .select(`
          *,
          brand:brands(nom),
          model:models(nom)
        `)

      if (vehiclesError) throw vehiclesError

      // Récupérer le nombre de marques et modèles
      const [brandsResult, modelsResult] = await Promise.all([
        supabase.from('brands').select('id', { count: 'exact', head: true }),
        supabase.from('models').select('id', { count: 'exact', head: true })
      ])

      const totalVehicles = vehicles?.length || 0
      const disponibles = vehicles?.filter(v => v.statut === 'Disponible').length || 0
      const vendus = vehicles?.filter(v => v.statut === 'Vendu').length || 0
      const reserves = vehicles?.filter(v => v.statut === 'Réservé').length || 0
      const enMaintenance = vehicles?.filter(v => v.statut === 'En maintenance').length || 0

      // Calculer la valeur totale (véhicules disponibles avec prix)
      const vehiculesAvecPrix = vehicles?.filter(v => 
        v.prix && v.statut !== 'Vendu'
      ) || []
      
      const valeurTotale = vehiculesAvecPrix.reduce((sum, v) => sum + (v.prix || 0), 0)
      const prixMoyen = vehiculesAvecPrix.length > 0 ? valeurTotale / vehiculesAvecPrix.length : 0
      const tauxDisponibilite = totalVehicles > 0 ? (disponibles / totalVehicles) * 100 : 0

      // Récupérer l'activité récente (simulée pour l'instant)
      const recentActivity = await this.getRecentActivity()

      return {
        totalVehicles,
        disponibles,
        vendus,
        reserves,
        enMaintenance,
        valeurTotale,
        prixMoyen,
        tauxDisponibilite,
        totalBrands: brandsResult.count || 0,
        totalModels: modelsResult.count || 0,
        recentActivity
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
      throw new Error('Impossible de récupérer les statistiques')
    }
  }

  // Récupérer l'activité récente
  static async getRecentActivity(limit: number = 10): Promise<ActivityItem[]> {
    try {
      // Pour l'instant, on simule l'activité récente
      // Dans une version future, on pourrait ajouter une table d'audit
      const { data: recentVehicles, error } = await supabase
        .from('vehicles')
        .select(`
          id,
          created_at,
          updated_at,
          brand:brands(nom),
          model:models(nom),
          annee
        `)
        .order('updated_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return recentVehicles?.map(vehicle => ({
        id: vehicle.id,
        type: 'update' as const,
        entity: 'vehicle' as const,
        entityName: `${vehicle.brand?.nom} ${vehicle.model?.nom} ${vehicle.annee}`,
        userId: 'system',
        userName: 'Système',
        timestamp: vehicle.updated_at
      })) || []
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'activité:', error)
      return []
    }
  }

  // Opérations en lot sur les véhicules
  static async performBulkOperation(operation: BulkOperation): Promise<{ success: number; errors: string[] }> {
    const results = { success: 0, errors: [] as string[] }

    try {
      switch (operation.action) {
        case 'update_status':
          if (!operation.data?.statut) {
            throw new Error('Statut requis pour cette opération')
          }
          
          const { error: statusError } = await supabase
            .from('vehicles')
            .update({ 
              statut: operation.data.statut,
              updated_at: new Date().toISOString()
            })
            .in('id', operation.vehicleIds)

          if (statusError) throw statusError
          results.success = operation.vehicleIds.length
          break

        case 'update_price':
          if (!operation.data?.prix) {
            throw new Error('Prix requis pour cette opération')
          }

          const { error: priceError } = await supabase
            .from('vehicles')
            .update({ 
              prix: operation.data.prix,
              updated_at: new Date().toISOString()
            })
            .in('id', operation.vehicleIds)

          if (priceError) throw priceError
          results.success = operation.vehicleIds.length
          break

        case 'delete':
          // Supprimer les véhicules (les images et documents seront supprimés en cascade)
          const { error: deleteError } = await supabase
            .from('vehicles')
            .delete()
            .in('id', operation.vehicleIds)

          if (deleteError) throw deleteError
          results.success = operation.vehicleIds.length
          break

        case 'assign_equipment':
          if (!operation.data?.equipmentIds) {
            throw new Error('Équipements requis pour cette opération')
          }

          // Supprimer les équipements existants pour ces véhicules
          await supabase
            .from('vehicle_equipments')
            .delete()
            .in('vehicle_id', operation.vehicleIds)

          // Ajouter les nouveaux équipements
          const equipmentAssignments = operation.vehicleIds.flatMap(vehicleId =>
            operation.data.equipmentIds.map((equipmentId: string) => ({
              vehicle_id: vehicleId,
              equipment_id: equipmentId
            }))
          )

          const { error: equipmentError } = await supabase
            .from('vehicle_equipments')
            .insert(equipmentAssignments)

          if (equipmentError) throw equipmentError
          results.success = operation.vehicleIds.length
          break

        default:
          throw new Error(`Opération non supportée: ${operation.action}`)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      results.errors.push(errorMessage)
    }

    return results
  }

  // Recherche avancée de véhicules
  static async searchVehicles(query: string, filters: any = {}) {
    try {
      let supabaseQuery = supabase
        .from('vehicles')
        .select(`
          *,
          brand:brands(nom, logo),
          model:models(nom),
          vehicle_images(url, alt_text, est_principale),
          equipments:vehicle_equipments(equipment:equipments(nom, categorie))
        `)

      // Recherche textuelle
      if (query) {
        supabaseQuery = supabaseQuery.or(`
          description.ilike.%${query}%,
          couleur.ilike.%${query}%,
          brand.nom.ilike.%${query}%,
          model.nom.ilike.%${query}%
        `)
      }

      // Appliquer les filtres
      if (filters.brand_id) {
        supabaseQuery = supabaseQuery.eq('brand_id', filters.brand_id)
      }
      if (filters.model_id) {
        supabaseQuery = supabaseQuery.eq('model_id', filters.model_id)
      }
      if (filters.statut) {
        supabaseQuery = supabaseQuery.eq('statut', filters.statut)
      }
      if (filters.carburant) {
        supabaseQuery = supabaseQuery.eq('carburant', filters.carburant)
      }
      if (filters.anneeMin) {
        supabaseQuery = supabaseQuery.gte('annee', filters.anneeMin)
      }
      if (filters.anneeMax) {
        supabaseQuery = supabaseQuery.lte('annee', filters.anneeMax)
      }
      if (filters.prixMin) {
        supabaseQuery = supabaseQuery.gte('prix', filters.prixMin)
      }
      if (filters.prixMax) {
        supabaseQuery = supabaseQuery.lte('prix', filters.prixMax)
      }

      const { data, error } = await supabaseQuery
        .order('updated_at', { ascending: false })

      if (error) throw error

      return data || []
    } catch (error) {
      console.error('Erreur lors de la recherche:', error)
      throw new Error('Erreur lors de la recherche de véhicules')
    }
  }

  // Validation des données de véhicule
  static validateVehicleData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Champs requis
    if (!data.brand_id) errors.push('La marque est requise')
    if (!data.model_id) errors.push('Le modèle est requis')
    if (!data.annee) errors.push('L\'année est requise')
    if (!data.couleur) errors.push('La couleur est requise')
    if (!data.carburant) errors.push('Le type de carburant est requis')
    if (!data.transmission) errors.push('Le type de transmission est requis')

    // Validation des valeurs
    const currentYear = new Date().getFullYear()
    if (data.annee && (data.annee < 1900 || data.annee > currentYear + 2)) {
      errors.push(`L'année doit être entre 1900 et ${currentYear + 2}`)
    }

    if (data.prix && data.prix < 0) {
      errors.push('Le prix ne peut pas être négatif')
    }

    if (data.kilometrage && data.kilometrage < 0) {
      errors.push('Le kilométrage ne peut pas être négatif')
    }

    // Validation des énumérations
    const validCarburants = ['Essence', 'Diesel', 'Hybride', 'Électrique']
    if (data.carburant && !validCarburants.includes(data.carburant)) {
      errors.push('Type de carburant invalide')
    }

    const validTransmissions = ['Manuelle', 'Automatique']
    if (data.transmission && !validTransmissions.includes(data.transmission)) {
      errors.push('Type de transmission invalide')
    }

    const validStatuts = ['Disponible', 'Vendu', 'Réservé', 'En maintenance']
    if (data.statut && !validStatuts.includes(data.statut)) {
      errors.push('Statut invalide')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}
