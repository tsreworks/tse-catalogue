import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Test simple pour vérifier que Jest fonctionne
describe('Configuration Jest', () => {
  it('devrait pouvoir exécuter un test basique', () => {
    const testElement = <div>Test TSE Catalogue</div>
    render(testElement)
    
    expect(screen.getByText('Test TSE Catalogue')).toBeInTheDocument()
  })

  it('devrait pouvoir tester les utilitaires TypeScript', () => {
    const testFunction = (a: number, b: number): number => a + b
    
    expect(testFunction(2, 3)).toBe(5)
  })

  it('devrait pouvoir tester les mocks Supabase', () => {
    // Test que les mocks Supabase sont disponibles
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBe('https://mock-supabase-url.supabase.co')
    expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe('mock-anon-key')
  })
})
