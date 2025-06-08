import { ValidationService } from './validation'

describe('ValidationService', () => {
  describe('validateVehicle', () => {
    const validUUID1 = '123e4567-e89b-12d3-a456-426614174000'
    const validUUID2 = '987fcdeb-51a2-43d1-9f12-345678901234'

    const validVehicleData = {
      brand_id: validUUID1,
      model_id: validUUID2,
      annee: 2023,
      couleur: 'Blanc',
      carburant: 'Essence',
      transmission: 'Manuelle',
      statut: 'Disponible'
    }

    it('should validate a correct vehicle', () => {
      const result = ValidationService.validateVehicle(validVehicleData)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject vehicle without required fields', () => {
      const invalidData = { ...validVehicleData }
      delete invalidData.brand_id

      const result = ValidationService.validateVehicle(invalidData)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('La marque est requise')
    })

    it('should reject invalid year', () => {
      const invalidData = { ...validVehicleData, annee: 1800 }
      const result = ValidationService.validateVehicle(invalidData)
      expect(result.isValid).toBe(false)
      expect(result.errors.some(error => error.includes('année'))).toBe(true)
    })

    it('should reject negative price as error', () => {
      const dataWithNegativePrice = { ...validVehicleData, prix: -1000 }
      const result = ValidationService.validateVehicle(dataWithNegativePrice)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Le prix ne peut pas être négatif')
    })

    it('should warn about zero price', () => {
      const dataWithZeroPrice = { ...validVehicleData, prix: 0 }
      const result = ValidationService.validateVehicle(dataWithZeroPrice)
      expect(result.isValid).toBe(true)
      expect(result.warnings).toContain('Prix à zéro - vérifiez si c\'est intentionnel')
    })

    it('should warn about very high price', () => {
      const dataWithHighPrice = { ...validVehicleData, prix: 150000000 }
      const result = ValidationService.validateVehicle(dataWithHighPrice)
      expect(result.isValid).toBe(true)
      expect(result.warnings?.some(w => w.includes('Prix très élevé'))).toBe(true)
    })
  })

  describe('validateBrand', () => {
    it('should validate a correct brand', () => {
      const brandData = {
        nom: 'Toyota',
        description: 'Marque japonaise de qualité'
      }
      const result = ValidationService.validateBrand(brandData)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject brand without name', () => {
      const brandData = { description: 'Description' }
      const result = ValidationService.validateBrand(brandData)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Le nom de la marque est requis')
    })

    it('should reject invalid logo URL', () => {
      const brandData = {
        nom: 'Toyota',
        logo: 'invalid-url'
      }
      const result = ValidationService.validateBrand(brandData)
      expect(result.isValid).toBe(false)
      expect(result.errors.some(error => error.includes('URL du logo'))).toBe(true)
    })

    it('should accept valid logo URL', () => {
      const brandData = {
        nom: 'Toyota',
        logo: 'https://example.com/logo.png'
      }
      const result = ValidationService.validateBrand(brandData)
      expect(result.isValid).toBe(true)
    })
  })

  describe('validateModel', () => {
    const validUUID = '123e4567-e89b-12d3-a456-426614174000'

    it('should validate a correct model', () => {
      const modelData = {
        nom: 'Corolla',
        brand_id: validUUID
      }
      const result = ValidationService.validateModel(modelData)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject model without name', () => {
      const modelData = { brand_id: validUUID }
      const result = ValidationService.validateModel(modelData)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Le nom du modèle est requis')
    })

    it('should reject invalid brand_id format', () => {
      const modelData = {
        nom: 'Corolla',
        brand_id: 'invalid-uuid'
      }
      const result = ValidationService.validateModel(modelData)
      expect(result.isValid).toBe(false)
      expect(result.errors.some(error => error.includes('identifiant de la marque'))).toBe(true)
    })
  })
})
