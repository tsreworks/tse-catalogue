import {
  formatPrice,
  formatKilometrage,
  generateVehicleSlug,
  slugify,
  cn,
  getVehicleStatusColor,
  getCarburantIcon,
  formatDate
} from './utils'

describe('Utils', () => {
  describe('formatPrice', () => {
    it('should format price correctly', () => {
      // Note: Current implementation uses EUR, we should update it for CFA
      expect(formatPrice(1000000)).toBe('1\u202F000\u202F000,00\u00A0€')
      expect(formatPrice(25000)).toBe('25\u202F000,00\u00A0€')
      expect(formatPrice(0)).toBe('0,00\u00A0€')
    })
  })

  describe('formatKilometrage', () => {
    it('should format kilometrage correctly', () => {
      expect(formatKilometrage(15000)).toBe('15\u202F000 km')
      expect(formatKilometrage(150000)).toBe('150\u202F000 km')
      expect(formatKilometrage(0)).toBe('0 km')
    })
  })

  describe('generateVehicleSlug', () => {
    it('should generate correct slug', () => {
      expect(generateVehicleSlug('Toyota', 'Corolla', 2023)).toBe('toyota-corolla-2023')
      expect(generateVehicleSlug('BMW', 'Série 3', 2022)).toBe('bmw-serie-3-2022')
    })

    it('should handle special characters', () => {
      expect(generateVehicleSlug('Citroën', 'C4 Picasso', 2021)).toBe('citroen-c4-picasso-2021')
    })
  })

  describe('slugify', () => {
    it('should slugify text correctly', () => {
      expect(slugify('Hello World')).toBe('hello-world')
      expect(slugify('Très spécial été')).toBe('tres-special-ete')
      expect(slugify('BMW Série 3')).toBe('bmw-serie-3')
    })

    it('should handle special characters', () => {
      expect(slugify('C4 Picasso')).toBe('c4-picasso')
      expect(slugify('Test & Co.')).toBe('test-co')
    })
  })

  describe('getVehicleStatusColor', () => {
    it('should return correct colors for statuses', () => {
      expect(getVehicleStatusColor('Disponible')).toBe('bg-green-100 text-green-800')
      expect(getVehicleStatusColor('Vendu')).toBe('bg-red-100 text-red-800')
      expect(getVehicleStatusColor('Réservé')).toBe('bg-yellow-100 text-yellow-800')
      expect(getVehicleStatusColor('En maintenance')).toBe('bg-blue-100 text-blue-800')
      expect(getVehicleStatusColor('Unknown')).toBe('bg-gray-100 text-gray-800')
    })
  })

  describe('getCarburantIcon', () => {
    it('should return correct icons for fuel types', () => {
      expect(getCarburantIcon('Essence')).toBe('⛽')
      expect(getCarburantIcon('Diesel')).toBe('🛢️')
      expect(getCarburantIcon('Hybride')).toBe('🔋')
      expect(getCarburantIcon('Électrique')).toBe('⚡')
      expect(getCarburantIcon('Unknown')).toBe('🚗')
    })
  })

  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('px-2 py-1', 'bg-red-500')).toBe('px-2 py-1 bg-red-500')
      expect(cn('px-2', 'px-4')).toBe('px-4') // Should override
    })
  })

  describe('formatDate', () => {
    it('should format dates correctly', () => {
      const date = new Date('2023-12-25')
      const formatted = formatDate(date)
      expect(formatted).toContain('2023')
      expect(formatted).toContain('décembre')
    })
  })
})
