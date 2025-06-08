// Adaptateur pour migrer progressivement des données statiques vers Supabase
import { Vehicle as StaticVehicle } from '@/types/vehicle'
import { VehicleWithRelations, VehicleFilters, VehicleSearchResult } from '@/lib/supabase'
import { mockVehicles } from '@/lib/vehicles-data'
import { VehicleService } from '@/lib/vehicle-service'

// Configuration pour basculer entre données statiques et Supabase
const USE_SUPABASE = typeof window !== 'undefined'
  ? process.env.NEXT_PUBLIC_USE_SUPABASE === 'true'
  : false // Côté serveur, utiliser les données statiques pour l'instant

// Fonction pour convertir un véhicule statique en format Supabase
function convertStaticToSupabase(staticVehicle: StaticVehicle): VehicleWithRelations {
  return {
    id: staticVehicle.id,
    brand_id: '', // À mapper avec les vraies IDs
    model_id: '', // À mapper avec les vraies IDs
    annee: staticVehicle.annee,
    couleur: staticVehicle.couleur,
    prix: staticVehicle.prix || null,
    kilometrage: staticVehicle.kilometrage || null,
    carburant: staticVehicle.carburant,
    transmission: staticVehicle.transmission,
    description: staticVehicle.description || null,
    statut: staticVehicle.statut,
    puissance: staticVehicle.caracteristiques.puissance || null,
    cylindree: staticVehicle.caracteristiques.cylindree || null,
    consommation: staticVehicle.caracteristiques.consommation || null,
    emissions: staticVehicle.caracteristiques.emissions || null,
    nombre_portes: staticVehicle.caracteristiques.nombrePortes || null,
    nombre_places: staticVehicle.caracteristiques.nombrePlaces || null,
    coffre: staticVehicle.caracteristiques.coffre || null,
    created_at: staticVehicle.dateAjout.toISOString(),
    updated_at: staticVehicle.dateModification.toISOString(),
    created_by: null,
    updated_by: null,
    // Relations simulées
    brand: {
      id: '',
      nom: staticVehicle.marque,
      logo: null,
      description: null,
      created_at: '',
      updated_at: ''
    },
    model: {
      id: '',
      nom: staticVehicle.modele,
      brand_id: '',
      description: null,
      created_at: '',
      updated_at: ''
    },
    vehicle_images: staticVehicle.images.map(img => ({
      id: img.id,
      vehicle_id: staticVehicle.id,
      url: img.url,
      alt_text: img.alt,
      ordre: img.ordre,
      est_principale: img.estPrincipale,
      taille_fichier: null,
      largeur: null,
      hauteur: null,
      created_at: ''
    })),
    vehicle_documents: staticVehicle.ficheTechnique ? [{
      id: `doc-${staticVehicle.id}`,
      vehicle_id: staticVehicle.id,
      nom: `Fiche technique ${staticVehicle.marque} ${staticVehicle.modele}`,
      type_document: 'fiche_technique',
      url: staticVehicle.ficheTechnique,
      taille_fichier: null,
      mime_type: 'application/pdf',
      created_at: '',
      created_by: null
    }] : [],
    equipments: staticVehicle.caracteristiques.equipements?.map((eq, index) => ({
      id: `eq-${staticVehicle.id}-${index}`,
      nom: eq,
      description: null,
      categorie: null,
      created_at: ''
    })) || []
  }
}

// Fonction pour convertir un véhicule Supabase en format statique
function convertSupabaseToStatic(supabaseVehicle: VehicleWithRelations): StaticVehicle {
  return {
    id: supabaseVehicle.id,
    marque: supabaseVehicle.brand?.nom || '',
    modele: supabaseVehicle.model?.nom || '',
    annee: supabaseVehicle.annee,
    couleur: supabaseVehicle.couleur,
    prix: supabaseVehicle.prix || undefined,
    kilometrage: supabaseVehicle.kilometrage || undefined,
    carburant: supabaseVehicle.carburant,
    transmission: supabaseVehicle.transmission,
    description: supabaseVehicle.description || undefined,
    statut: supabaseVehicle.statut,
    caracteristiques: {
      puissance: supabaseVehicle.puissance || undefined,
      cylindree: supabaseVehicle.cylindree || undefined,
      consommation: supabaseVehicle.consommation || undefined,
      emissions: supabaseVehicle.emissions || undefined,
      nombrePortes: supabaseVehicle.nombre_portes || undefined,
      nombrePlaces: supabaseVehicle.nombre_places || undefined,
      coffre: supabaseVehicle.coffre || undefined,
      equipements: supabaseVehicle.equipments?.map(eq => eq.nom) || []
    },
    images: supabaseVehicle.vehicle_images?.map(img => ({
      id: img.id,
      url: img.url,
      alt: img.alt_text || '',
      ordre: img.ordre,
      estPrincipale: img.est_principale
    })) || [],
    ficheTechnique: supabaseVehicle.vehicle_documents?.find(doc => doc.type_document === 'fiche_technique')?.url,
    dateAjout: new Date(supabaseVehicle.created_at),
    dateModification: new Date(supabaseVehicle.updated_at)
  }
}

// Adaptateur principal pour les véhicules
export class DataAdapter {
  // Récupérer tous les véhicules
  static async getVehicles(
    filters: VehicleFilters = {},
    page: number = 1,
    limit: number = 12
  ): Promise<{ vehicles: StaticVehicle[], total: number, page: number, limit: number, totalPages: number }> {
    if (USE_SUPABASE && typeof window !== 'undefined') {
      try {
        const result = await VehicleService.getVehicles(filters, page, limit)
        return {
          vehicles: result.vehicles.map(convertSupabaseToStatic),
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages
        }
      } catch (error) {
        console.warn('Erreur Supabase, fallback vers données statiques:', error)
        // Fallback vers données statiques
      }
    }

    // Utilisation des données statiques avec filtrage manuel
    let filtered = [...mockVehicles]

    // Application des filtres
    if (filters.recherche) {
      const searchTerm = filters.recherche.toLowerCase()
      filtered = filtered.filter(vehicle => 
        vehicle.marque.toLowerCase().includes(searchTerm) ||
        vehicle.modele.toLowerCase().includes(searchTerm) ||
        vehicle.couleur.toLowerCase().includes(searchTerm)
      )
    }

    if (filters.marque) {
      filtered = filtered.filter(vehicle => vehicle.marque === filters.marque)
    }

    if (filters.carburant) {
      filtered = filtered.filter(vehicle => vehicle.carburant === filters.carburant)
    }

    if (filters.transmission) {
      filtered = filtered.filter(vehicle => vehicle.transmission === filters.transmission)
    }

    if (filters.couleur) {
      filtered = filtered.filter(vehicle => 
        vehicle.couleur.toLowerCase().includes(filters.couleur!.toLowerCase())
      )
    }

    if (filters.statut) {
      filtered = filtered.filter(vehicle => vehicle.statut === filters.statut)
    }

    if (filters.anneeMin) {
      filtered = filtered.filter(vehicle => vehicle.annee >= filters.anneeMin!)
    }

    if (filters.anneeMax) {
      filtered = filtered.filter(vehicle => vehicle.annee <= filters.anneeMax!)
    }

    if (filters.prixMin) {
      filtered = filtered.filter(vehicle => 
        vehicle.prix && vehicle.prix >= filters.prixMin!
      )
    }

    if (filters.prixMax) {
      filtered = filtered.filter(vehicle => 
        vehicle.prix && vehicle.prix <= filters.prixMax!
      )
    }

    // Pagination manuelle
    const total = filtered.length
    const totalPages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const end = start + limit
    const vehicles = filtered.slice(start, end)

    return {
      vehicles,
      total,
      page,
      limit,
      totalPages
    }
  }

  // Récupérer un véhicule par ID
  static async getVehicleById(id: string): Promise<StaticVehicle | null> {
    if (USE_SUPABASE) {
      try {
        const vehicle = await VehicleService.getVehicleById(id)
        return convertSupabaseToStatic(vehicle)
      } catch (error) {
        console.warn('Erreur Supabase, fallback vers données statiques:', error)
      }
    }

    // Fallback vers données statiques
    return mockVehicles.find(vehicle => vehicle.id === id) || null
  }

  // Récupérer un véhicule par slug
  static async getVehicleBySlug(slug: string): Promise<StaticVehicle | null> {
    const vehicles = await this.getVehicles()
    return vehicles.vehicles.find(vehicle => {
      const vehicleSlug = `${vehicle.marque.toLowerCase()}-${vehicle.modele.toLowerCase().replace(/\s+/g, '-')}-${vehicle.annee}`
      return vehicleSlug === slug
    }) || null
  }

  // Récupérer les marques uniques
  static async getBrands(): Promise<string[]> {
    const vehicles = await this.getVehicles()
    return Array.from(new Set(vehicles.vehicles.map(v => v.marque)))
  }

  // Récupérer les carburants uniques
  static async getCarburants(): Promise<string[]> {
    const vehicles = await this.getVehicles()
    return Array.from(new Set(vehicles.vehicles.map(v => v.carburant)))
  }
}

// Export de la configuration
export { USE_SUPABASE }
