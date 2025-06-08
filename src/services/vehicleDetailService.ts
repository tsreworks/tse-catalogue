import { supabase } from '@/lib/supabase'
import { generateVehicleSlug } from '@/lib/utils'

export interface VehicleDetail {
  id: string
  marque: string
  modele: string
  annee: number
  couleur: string
  prix?: number
  kilometrage?: number
  carburant: string
  transmission: string
  description?: string
  statut: string
  caracteristiques: {
    puissance?: string
    cylindree?: string
    consommation?: string
    emissions?: string
    nombrePortes?: number
    nombrePlaces?: number
    coffre?: string
    equipements?: string[]
  }
  images: Array<{
    id: string
    url: string
    alt: string
    ordre: number
    estPrincipale: boolean
  }>
  dateAjout: Date
  dateModification: Date
}

export class VehicleDetailService {
  static async getVehicleBySlug(slug: string): Promise<{ success: boolean; vehicle?: VehicleDetail; error?: string }> {
    try {
      // Récupérer tous les véhicules avec leurs relations
      const { data: vehicles, error } = await supabase
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
          updated_at,
          brands!inner(
            id,
            nom
          ),
          models!inner(
            id,
            nom
          )
        `)
        .eq('statut', 'Disponible')

      if (error) {
        console.error('Erreur récupération véhicules:', error)
        return { success: false, error: error.message }
      }

      if (!vehicles || vehicles.length === 0) {
        return { success: false, error: 'Aucun véhicule trouvé' }
      }

      // Trouver le véhicule correspondant au slug
      const vehicle = vehicles.find(v => {
        const vehicleSlug = generateVehicleSlug(v.brands.nom, v.models.nom, v.annee)
        return vehicleSlug === slug
      })

      if (!vehicle) {
        return { success: false, error: 'Véhicule non trouvé' }
      }

      // Récupérer les images du véhicule (si elles existent)
      const { data: images } = await supabase
        .from('vehicle_images')
        .select('*')
        .eq('vehicle_id', vehicle.id)
        .order('ordre')

      // Récupérer les équipements du véhicule (si ils existent)
      const { data: equipments } = await supabase
        .from('vehicle_equipments')
        .select(`
          equipments(nom)
        `)
        .eq('vehicle_id', vehicle.id)

      // Transformer en format attendu par la page de détails
      const vehicleDetail: VehicleDetail = {
        id: vehicle.id,
        marque: vehicle.brands.nom,
        modele: vehicle.models.nom,
        annee: vehicle.annee,
        couleur: vehicle.couleur,
        prix: vehicle.prix,
        kilometrage: vehicle.kilometrage,
        carburant: vehicle.carburant,
        transmission: vehicle.transmission,
        description: vehicle.description || `${vehicle.brands.nom} ${vehicle.models.nom} ${vehicle.annee} en excellent état.`,
        statut: vehicle.statut,
        caracteristiques: {
          // Valeurs par défaut basées sur la marque/modèle
          puissance: this.getDefaultPower(vehicle.brands.nom, vehicle.models.nom),
          cylindree: this.getDefaultEngine(vehicle.brands.nom, vehicle.models.nom),
          consommation: this.getDefaultConsumption(vehicle.carburant),
          emissions: this.getDefaultEmissions(vehicle.carburant),
          nombrePortes: this.getDefaultDoors(vehicle.models.nom),
          nombrePlaces: this.getDefaultSeats(vehicle.models.nom),
          coffre: this.getDefaultTrunk(vehicle.models.nom),
          equipements: equipments?.map(e => e.equipments.nom) || this.getDefaultEquipments(vehicle.brands.nom)
        },
        images: images?.map(img => ({
          id: img.id,
          url: img.url,
          alt: img.alt || `${vehicle.brands.nom} ${vehicle.models.nom}`,
          ordre: img.ordre,
          estPrincipale: img.est_principale || false
        })) || this.getDefaultImages(vehicle.brands.nom, vehicle.models.nom),
        dateAjout: new Date(vehicle.created_at),
        dateModification: new Date(vehicle.updated_at)
      }

      return { success: true, vehicle: vehicleDetail }
    } catch (error) {
      console.error('Erreur service véhicule:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      }
    }
  }

  // Méthodes pour générer des valeurs par défaut réalistes
  private static getDefaultPower(marque: string, modele: string): string {
    const powerMap: Record<string, string> = {
      'Toyota Corolla': '122 ch',
      'Toyota RAV4': '196 ch',
      'Toyota Hilux': '150 ch',
      'Nissan Sentra': '149 ch',
      'Honda Civic': '158 ch',
      'Hyundai Elantra': '147 ch',
      'Kia Cerato': '147 ch'
    }
    return powerMap[`${marque} ${modele}`] || '140 ch'
  }

  private static getDefaultEngine(marque: string, modele: string): string {
    const engineMap: Record<string, string> = {
      'Toyota Hilux': '2.4L',
      'Toyota RAV4': '2.5L',
      'Nissan X-Trail': '2.5L'
    }
    return engineMap[`${marque} ${modele}`] || '2.0L'
  }

  private static getDefaultConsumption(carburant: string): string {
    return carburant === 'Diesel' ? '5.8L/100km' : '6.5L/100km'
  }

  private static getDefaultEmissions(carburant: string): string {
    return carburant === 'Diesel' ? '135 g/km CO2' : '148 g/km CO2'
  }

  private static getDefaultDoors(modele: string): number {
    return modele.toLowerCase().includes('hilux') ? 4 : 5
  }

  private static getDefaultSeats(modele: string): number {
    if (modele.toLowerCase().includes('hilux')) return 5
    if (modele.toLowerCase().includes('x-trail')) return 7
    return 5
  }

  private static getDefaultTrunk(modele: string): string {
    if (modele.toLowerCase().includes('corolla')) return '470L'
    if (modele.toLowerCase().includes('rav4')) return '580L'
    if (modele.toLowerCase().includes('civic')) return '519L'
    return '500L'
  }

  private static getDefaultEquipments(marque: string): string[] {
    const baseEquipments = [
      'Climatisation automatique',
      'Système audio Bluetooth',
      'Régulateur de vitesse',
      'Vitres électriques',
      'Verrouillage centralisé',
      'ABS + ESP',
      'Airbags frontaux et latéraux'
    ]

    const premiumEquipments = [
      'Navigation GPS',
      'Caméra de recul',
      'Capteurs de stationnement',
      'Sièges chauffants',
      'Démarrage sans clé',
      'Phares LED',
      'Jantes alliage'
    ]

    const premiumBrands = ['BMW', 'Mercedes-Benz', 'Audi', 'Lexus']
    
    return premiumBrands.includes(marque) 
      ? [...baseEquipments, ...premiumEquipments]
      : baseEquipments
  }

  private static getDefaultImages(marque: string, modele: string): Array<{
    id: string
    url: string
    alt: string
    ordre: number
    estPrincipale: boolean
  }> {
    return [
      {
        id: '1',
        url: '/images/vehicles/default-exterior.svg',
        alt: `${marque} ${modele} - Vue extérieure`,
        ordre: 1,
        estPrincipale: true
      },
      {
        id: '2',
        url: '/images/vehicles/default-interior.svg',
        alt: `${marque} ${modele} - Intérieur`,
        ordre: 2,
        estPrincipale: false
      },
      {
        id: '3',
        url: '/images/vehicles/default-dashboard.svg',
        alt: `${marque} ${modele} - Tableau de bord`,
        ordre: 3,
        estPrincipale: false
      }
    ]
  }
}
