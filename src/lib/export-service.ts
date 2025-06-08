// Service d'export pour le back office TSE
import { supabase } from '@/lib/supabase'

export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf'
  filters?: any
  fields?: string[]
  includeImages?: boolean
  includeEquipments?: boolean
}

export interface ExportResult {
  success: boolean
  data?: string | Blob
  filename: string
  error?: string
}

export class ExportService {
  // Exporter les véhicules en CSV
  static async exportVehiclesCSV(options: ExportOptions = { format: 'csv' }): Promise<ExportResult> {
    try {
      // Récupérer les données des véhicules
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
          puissance,
          cylindree,
          consommation,
          emissions,
          nombre_portes,
          nombre_places,
          coffre,
          created_at,
          updated_at,
          brand:brands(nom),
          model:models(nom)
          ${options.includeEquipments ? ',equipments:vehicle_equipments(equipment:equipments(nom, categorie))' : ''}
        `)

      // Appliquer les filtres si fournis
      if (options.filters) {
        if (options.filters.brand_id) {
          query = query.eq('brand_id', options.filters.brand_id)
        }
        if (options.filters.statut) {
          query = query.eq('statut', options.filters.statut)
        }
        if (options.filters.carburant) {
          query = query.eq('carburant', options.filters.carburant)
        }
        if (options.filters.anneeMin) {
          query = query.gte('annee', options.filters.anneeMin)
        }
        if (options.filters.anneeMax) {
          query = query.lte('annee', options.filters.anneeMax)
        }
      }

      const { data: vehicles, error } = await query.order('created_at', { ascending: false })

      if (error) throw error

      if (!vehicles || vehicles.length === 0) {
        return {
          success: false,
          filename: '',
          error: 'Aucun véhicule à exporter'
        }
      }

      // Générer le CSV
      const csvContent = this.generateCSV(vehicles, options)
      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `vehicules_tse_${timestamp}.csv`

      return {
        success: true,
        data: csvContent,
        filename
      }
    } catch (error) {
      console.error('Erreur lors de l\'export CSV:', error)
      return {
        success: false,
        filename: '',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }
    }
  }

  // Générer le contenu CSV
  private static generateCSV(vehicles: any[], options: ExportOptions): string {
    // Définir les en-têtes de colonnes
    const headers = [
      'ID',
      'Marque',
      'Modèle',
      'Année',
      'Couleur',
      'Prix (CFA)',
      'Kilométrage',
      'Carburant',
      'Transmission',
      'Statut',
      'Puissance',
      'Cylindrée',
      'Consommation',
      'Émissions',
      'Portes',
      'Places',
      'Coffre',
      'Description',
      'Date création',
      'Dernière modification'
    ]

    if (options.includeEquipments) {
      headers.push('Équipements')
    }

    // Filtrer les colonnes si spécifié
    const selectedHeaders = options.fields ? 
      headers.filter(header => options.fields!.includes(header)) : 
      headers

    // Générer les lignes de données
    const rows = vehicles.map(vehicle => {
      const row = [
        vehicle.id,
        vehicle.brand?.nom || '',
        vehicle.model?.nom || '',
        vehicle.annee,
        vehicle.couleur,
        vehicle.prix || '',
        vehicle.kilometrage || '',
        vehicle.carburant,
        vehicle.transmission,
        vehicle.statut,
        vehicle.puissance || '',
        vehicle.cylindree || '',
        vehicle.consommation || '',
        vehicle.emissions || '',
        vehicle.nombre_portes || '',
        vehicle.nombre_places || '',
        vehicle.coffre || '',
        vehicle.description || '',
        new Date(vehicle.created_at).toLocaleDateString('fr-FR'),
        new Date(vehicle.updated_at).toLocaleDateString('fr-FR')
      ]

      if (options.includeEquipments) {
        const equipments = vehicle.equipments?.map((eq: any) => eq.equipment?.nom).join('; ') || ''
        row.push(equipments)
      }

      return row
    })

    // Combiner en-têtes et données
    const allRows = [selectedHeaders, ...rows]

    // Convertir en CSV
    return allRows.map(row => 
      row.map(cell => {
        // Échapper les guillemets et entourer de guillemets si nécessaire
        const cellStr = String(cell || '')
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`
        }
        return cellStr
      }).join(',')
    ).join('\n')
  }

  // Exporter les statistiques en CSV
  static async exportStatsCSV(): Promise<ExportResult> {
    try {
      // Récupérer les statistiques par marque
      const { data: brandStats, error } = await supabase
        .from('vehicles')
        .select(`
          brand:brands(nom),
          statut,
          prix,
          carburant
        `)

      if (error) throw error

      // Calculer les statistiques
      const statsMap = new Map()
      
      brandStats?.forEach(vehicle => {
        const brandName = vehicle.brand?.nom || 'Inconnu'
        if (!statsMap.has(brandName)) {
          statsMap.set(brandName, {
            nom: brandName,
            total: 0,
            disponibles: 0,
            vendus: 0,
            reserves: 0,
            valeurTotale: 0,
            essence: 0,
            diesel: 0,
            hybride: 0,
            electrique: 0
          })
        }

        const stats = statsMap.get(brandName)
        stats.total++
        
        if (vehicle.statut === 'Disponible') stats.disponibles++
        if (vehicle.statut === 'Vendu') stats.vendus++
        if (vehicle.statut === 'Réservé') stats.reserves++
        
        if (vehicle.prix && vehicle.statut !== 'Vendu') {
          stats.valeurTotale += vehicle.prix
        }

        if (vehicle.carburant === 'Essence') stats.essence++
        if (vehicle.carburant === 'Diesel') stats.diesel++
        if (vehicle.carburant === 'Hybride') stats.hybride++
        if (vehicle.carburant === 'Électrique') stats.electrique++
      })

      // Générer le CSV des statistiques
      const headers = [
        'Marque',
        'Total véhicules',
        'Disponibles',
        'Vendus',
        'Réservés',
        'Valeur totale (CFA)',
        'Prix moyen (CFA)',
        'Essence',
        'Diesel',
        'Hybride',
        'Électrique'
      ]

      const rows = Array.from(statsMap.values()).map(stats => [
        stats.nom,
        stats.total,
        stats.disponibles,
        stats.vendus,
        stats.reserves,
        stats.valeurTotale,
        stats.disponibles > 0 ? Math.round(stats.valeurTotale / stats.disponibles) : 0,
        stats.essence,
        stats.diesel,
        stats.hybride,
        stats.electrique
      ])

      const csvContent = [headers, ...rows]
        .map(row => row.join(','))
        .join('\n')

      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `statistiques_tse_${timestamp}.csv`

      return {
        success: true,
        data: csvContent,
        filename
      }
    } catch (error) {
      console.error('Erreur lors de l\'export des statistiques:', error)
      return {
        success: false,
        filename: '',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }
    }
  }

  // Exporter la liste des marques et modèles
  static async exportBrandsModelsCSV(): Promise<ExportResult> {
    try {
      const { data: brands, error } = await supabase
        .from('brands')
        .select(`
          nom,
          description,
          created_at,
          models(nom, description, created_at)
        `)
        .order('nom')

      if (error) throw error

      // Générer le CSV avec marques et modèles
      const headers = ['Marque', 'Description marque', 'Date création marque', 'Modèle', 'Description modèle', 'Date création modèle']
      const rows: string[][] = []

      brands?.forEach(brand => {
        if (brand.models && brand.models.length > 0) {
          brand.models.forEach((model: any) => {
            rows.push([
              brand.nom,
              brand.description || '',
              new Date(brand.created_at).toLocaleDateString('fr-FR'),
              model.nom,
              model.description || '',
              new Date(model.created_at).toLocaleDateString('fr-FR')
            ])
          })
        } else {
          rows.push([
            brand.nom,
            brand.description || '',
            new Date(brand.created_at).toLocaleDateString('fr-FR'),
            '',
            '',
            ''
          ])
        }
      })

      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => {
          const cellStr = String(cell || '')
          if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
            return `"${cellStr.replace(/"/g, '""')}"`
          }
          return cellStr
        }).join(','))
        .join('\n')

      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `marques_modeles_tse_${timestamp}.csv`

      return {
        success: true,
        data: csvContent,
        filename
      }
    } catch (error) {
      console.error('Erreur lors de l\'export marques/modèles:', error)
      return {
        success: false,
        filename: '',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }
    }
  }

  // Télécharger un fichier CSV côté client
  static downloadCSV(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }
}
