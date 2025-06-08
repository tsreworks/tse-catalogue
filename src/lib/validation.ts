// Service de validation pour le back office TSE
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings?: string[]
}

export interface VehicleValidationData {
  brand_id?: string
  model_id?: string
  annee?: number
  couleur?: string
  prix?: number
  kilometrage?: number
  carburant?: string
  transmission?: string
  statut?: string
  puissance?: string
  cylindree?: string
  consommation?: string
  emissions?: string
  nombre_portes?: number
  nombre_places?: number
  coffre?: string
  description?: string
}

export interface BrandValidationData {
  nom?: string
  description?: string
  logo?: string
}

export interface ModelValidationData {
  nom?: string
  brand_id?: string
  description?: string
}

export interface EquipmentValidationData {
  nom?: string
  description?: string
  categorie?: string
}

export class ValidationService {
  // Validation des données de véhicule
  static validateVehicle(data: VehicleValidationData, isUpdate: boolean = false): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // Champs requis pour création
    if (!isUpdate) {
      if (!data.brand_id) errors.push('La marque est requise')
      if (!data.model_id) errors.push('Le modèle est requis')
      if (!data.annee) errors.push('L\'année est requise')
      if (!data.couleur) errors.push('La couleur est requise')
      if (!data.carburant) errors.push('Le type de carburant est requis')
      if (!data.transmission) errors.push('Le type de transmission est requis')
    }

    // Validation de l'année
    if (data.annee !== undefined) {
      const currentYear = new Date().getFullYear()
      if (data.annee < 1900) {
        errors.push('L\'année ne peut pas être antérieure à 1900')
      } else if (data.annee > currentYear + 2) {
        errors.push(`L'année ne peut pas être supérieure à ${currentYear + 2}`)
      } else if (data.annee > currentYear) {
        warnings.push('Véhicule de l\'année future détecté')
      }
    }

    // Validation du prix
    if (data.prix !== undefined) {
      if (data.prix < 0) {
        errors.push('Le prix ne peut pas être négatif')
      } else if (data.prix === 0) {
        warnings.push('Prix à zéro - vérifiez si c\'est intentionnel')
      } else if (data.prix > 100000000) { // 100 millions CFA
        warnings.push('Prix très élevé détecté - vérifiez la saisie')
      }
    }

    // Validation du kilométrage
    if (data.kilometrage !== undefined) {
      if (data.kilometrage < 0) {
        errors.push('Le kilométrage ne peut pas être négatif')
      } else if (data.kilometrage > 1000000) {
        warnings.push('Kilométrage très élevé détecté')
      }
    }

    // Validation des énumérations
    if (data.carburant) {
      const validCarburants = ['Essence', 'Diesel', 'Hybride', 'Électrique']
      if (!validCarburants.includes(data.carburant)) {
        errors.push(`Type de carburant invalide. Valeurs acceptées: ${validCarburants.join(', ')}`)
      }
    }

    if (data.transmission) {
      const validTransmissions = ['Manuelle', 'Automatique']
      if (!validTransmissions.includes(data.transmission)) {
        errors.push(`Type de transmission invalide. Valeurs acceptées: ${validTransmissions.join(', ')}`)
      }
    }

    if (data.statut) {
      const validStatuts = ['Disponible', 'Vendu', 'Réservé', 'En maintenance']
      if (!validStatuts.includes(data.statut)) {
        errors.push(`Statut invalide. Valeurs acceptées: ${validStatuts.join(', ')}`)
      }
    }

    // Validation de la couleur
    if (data.couleur) {
      if (data.couleur.length < 2) {
        errors.push('La couleur doit contenir au moins 2 caractères')
      } else if (data.couleur.length > 50) {
        errors.push('La couleur ne peut pas dépasser 50 caractères')
      }
    }

    // Validation des caractéristiques techniques
    if (data.nombre_portes !== undefined) {
      if (data.nombre_portes < 1 || data.nombre_portes > 10) {
        errors.push('Le nombre de portes doit être entre 1 et 10')
      }
    }

    if (data.nombre_places !== undefined) {
      if (data.nombre_places < 1 || data.nombre_places > 50) {
        errors.push('Le nombre de places doit être entre 1 et 50')
      }
    }

    // Validation des formats de chaînes techniques
    if (data.puissance && !this.isValidPowerFormat(data.puissance)) {
      warnings.push('Format de puissance non standard (ex: "150 ch" ou "110 kW")')
    }

    if (data.cylindree && !this.isValidEngineFormat(data.cylindree)) {
      warnings.push('Format de cylindrée non standard (ex: "2.0L" ou "1600 cm³")')
    }

    if (data.consommation && !this.isValidConsumptionFormat(data.consommation)) {
      warnings.push('Format de consommation non standard (ex: "6.5L/100km")')
    }

    // Validation de la description
    if (data.description && data.description.length > 2000) {
      errors.push('La description ne peut pas dépasser 2000 caractères')
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined
    }
  }

  // Validation des données de marque
  static validateBrand(data: BrandValidationData, isUpdate: boolean = false): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // Champs requis
    if (!isUpdate && !data.nom) {
      errors.push('Le nom de la marque est requis')
    }

    // Validation du nom
    if (data.nom) {
      if (data.nom.length < 2) {
        errors.push('Le nom de la marque doit contenir au moins 2 caractères')
      } else if (data.nom.length > 100) {
        errors.push('Le nom de la marque ne peut pas dépasser 100 caractères')
      }

      // Vérifier les caractères spéciaux
      if (!/^[a-zA-ZÀ-ÿ0-9\s\-&.]+$/.test(data.nom)) {
        warnings.push('Le nom contient des caractères spéciaux qui pourraient poser problème')
      }
    }

    // Validation de la description
    if (data.description && data.description.length > 1000) {
      errors.push('La description ne peut pas dépasser 1000 caractères')
    }

    // Validation de l'URL du logo
    if (data.logo && !this.isValidUrl(data.logo)) {
      errors.push('L\'URL du logo n\'est pas valide')
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined
    }
  }

  // Validation des données de modèle
  static validateModel(data: ModelValidationData, isUpdate: boolean = false): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // Champs requis
    if (!isUpdate) {
      if (!data.nom) errors.push('Le nom du modèle est requis')
      if (!data.brand_id) errors.push('La marque est requise')
    }

    // Validation du nom
    if (data.nom) {
      if (data.nom.length < 1) {
        errors.push('Le nom du modèle doit contenir au moins 1 caractère')
      } else if (data.nom.length > 100) {
        errors.push('Le nom du modèle ne peut pas dépasser 100 caractères')
      }
    }

    // Validation de la description
    if (data.description && data.description.length > 1000) {
      errors.push('La description ne peut pas dépasser 1000 caractères')
    }

    // Validation de l'UUID de la marque
    if (data.brand_id && !this.isValidUUID(data.brand_id)) {
      errors.push('L\'identifiant de la marque n\'est pas valide')
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined
    }
  }

  // Validation des données d'équipement
  static validateEquipment(data: EquipmentValidationData, isUpdate: boolean = false): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // Champs requis
    if (!isUpdate && !data.nom) {
      errors.push('Le nom de l\'équipement est requis')
    }

    // Validation du nom
    if (data.nom) {
      if (data.nom.length < 2) {
        errors.push('Le nom de l\'équipement doit contenir au moins 2 caractères')
      } else if (data.nom.length > 200) {
        errors.push('Le nom de l\'équipement ne peut pas dépasser 200 caractères')
      }
    }

    // Validation de la catégorie
    if (data.categorie) {
      const validCategories = ['Sécurité', 'Confort', 'Technologie', 'Performance', 'Esthétique', 'Autre']
      if (!validCategories.includes(data.categorie)) {
        warnings.push(`Catégorie non standard. Catégories recommandées: ${validCategories.join(', ')}`)
      }
    }

    // Validation de la description
    if (data.description && data.description.length > 1000) {
      errors.push('La description ne peut pas dépasser 1000 caractères')
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined
    }
  }

  // Utilitaires de validation
  private static isValidPowerFormat(power: string): boolean {
    // Formats acceptés: "150 ch", "110 kW", "150ch", "110kW"
    return /^\d+(\.\d+)?\s*(ch|kW|hp|cv)$/i.test(power.trim())
  }

  private static isValidEngineFormat(engine: string): boolean {
    // Formats acceptés: "2.0L", "1600 cm³", "2000cc"
    return /^\d+(\.\d+)?\s*(L|l|cm³|cc|cm3)$/i.test(engine.trim())
  }

  private static isValidConsumptionFormat(consumption: string): boolean {
    // Formats acceptés: "6.5L/100km", "6.5 L/100km"
    return /^\d+(\.\d+)?\s*L\/100km$/i.test(consumption.trim())
  }

  private static isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  private static isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidRegex.test(uuid)
  }

  // Validation en lot
  static validateBulkOperation(action: string, vehicleIds: string[], data?: any): ValidationResult {
    const errors: string[] = []

    if (!vehicleIds || vehicleIds.length === 0) {
      errors.push('Aucun véhicule sélectionné')
    }

    if (vehicleIds.length > 100) {
      errors.push('Trop de véhicules sélectionnés (maximum 100)')
    }

    // Validation spécifique par action
    switch (action) {
      case 'update_status':
        if (!data?.statut) {
          errors.push('Statut requis pour cette opération')
        } else {
          const validStatuts = ['Disponible', 'Vendu', 'Réservé', 'En maintenance']
          if (!validStatuts.includes(data.statut)) {
            errors.push('Statut invalide')
          }
        }
        break

      case 'update_price':
        if (!data?.prix && data?.prix !== 0) {
          errors.push('Prix requis pour cette opération')
        } else if (data.prix < 0) {
          errors.push('Le prix ne peut pas être négatif')
        }
        break

      case 'assign_equipment':
        if (!data?.equipmentIds || !Array.isArray(data.equipmentIds) || data.equipmentIds.length === 0) {
          errors.push('Au moins un équipement doit être sélectionné')
        }
        break

      case 'delete':
        // Pas de validation supplémentaire pour la suppression
        break

      default:
        errors.push(`Action non supportée: ${action}`)
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}
