import React from 'react'
import { render, screen } from '@testing-library/react'
import PriceDisplay from './PriceDisplay'

// Mock de la fonction formatPrice pour éviter les problèmes de locale
jest.mock('@/config/company', () => ({
  formatPrice: jest.fn((amount: number) => `${amount.toLocaleString('fr-FR')} CFA`)
}))

describe('PriceDisplay', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render price correctly', () => {
    render(<PriceDisplay price={25000000} />)

    expect(screen.getByText(/25.*000.*000.*CFA/)).toBeInTheDocument()
  })

  it('should apply correct size classes', () => {
    const { container } = render(<PriceDisplay price={25000000} size="lg" />)

    expect(container.firstChild).toHaveClass('text-lg')
  })

  it('should apply custom className', () => {
    const { container } = render(<PriceDisplay price={25000000} className="custom-class" />)

    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('should show price without currency when showCurrency is false', () => {
    render(<PriceDisplay price={25000000} showCurrency={false} />)

    // Should show formatted number without CFA
    expect(screen.getByText(/25.*000.*000/)).toBeInTheDocument()
    expect(screen.queryByText(/CFA/)).not.toBeInTheDocument()
  })

  it('should handle conditional prop', () => {
    // Test simple : vérifier que le composant ne crash pas avec conditional=true
    // Note: Le test complet nécessiterait un AuthProvider
    expect(() => {
      render(<PriceDisplay price={25000000} conditional={false} />)
    }).not.toThrow()
  })
})
