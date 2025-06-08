'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { CatalogueNavigationService, Brand, Model } from '@/services/catalogueNavigation'
import BrandSelector from '@/components/catalogue/BrandSelector'
import ModelSelector from '@/components/catalogue/ModelSelector'
import YearSelector from '@/components/catalogue/YearSelector'
import VehicleList from '@/components/catalogue/VehicleList'
import { ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'
import { COMPANY_INFO } from '@/config/company'
import Footer from '@/components/Footer'

// Types pour les étapes de navigation
type NavigationStep = 'brands' | 'models' | 'years' | 'vehicles'

export default function CataloguePage() {
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState<NavigationStep>('brands')
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialiser l'état depuis les paramètres URL
  useEffect(() => {
    initializeFromParams()
  }, [searchParams])

  const initializeFromParams = async () => {
    setLoading(true)

    const brandId = searchParams.get('brand')
    const modelId = searchParams.get('model')
    const year = searchParams.get('year')

    try {
      // Charger les informations de la marque si spécifiée
      if (brandId) {
        const brandResult = await CatalogueNavigationService.getBrandInfo(brandId)
        if (brandResult.success && brandResult.brand) {
          setSelectedBrand(brandResult.brand)

          // Charger les informations du modèle si spécifié
          if (modelId) {
            const modelResult = await CatalogueNavigationService.getModelInfo(modelId)
            if (modelResult.success && modelResult.model) {
              setSelectedModel(modelResult.model)

              // Définir l'année si spécifiée
              if (year) {
                setSelectedYear(parseInt(year))
                setCurrentStep('vehicles')
              } else {
                setCurrentStep('years')
              }
            } else {
              setCurrentStep('models')
            }
          } else {
            setCurrentStep('models')
          }
        } else {
          setCurrentStep('brands')
        }
      } else {
        setCurrentStep('brands')
      }
    } catch (error) {
      console.error('Erreur initialisation:', error)
      setCurrentStep('brands')
    }

    setLoading(false)
  }

  const handleBrandSelect = (brand: Brand) => {
    setSelectedBrand(brand)
    setSelectedModel(null)
    setSelectedYear(null)
    setCurrentStep('models')

    // Mettre à jour l'URL
    window.history.pushState({}, '', `/catalogue?brand=${brand.id}`)
  }

  const handleModelSelect = (model: Model) => {
    setSelectedModel(model)
    setSelectedYear(null)
    setCurrentStep('years')

    // Mettre à jour l'URL
    window.history.pushState({}, '', `/catalogue?brand=${selectedBrand?.id}&model=${model.id}`)
  }

  const handleYearSelect = (year: number) => {
    setSelectedYear(year)
    setCurrentStep('vehicles')

    // Mettre à jour l'URL
    window.history.pushState({}, '', `/catalogue?brand=${selectedBrand?.id}&model=${selectedModel?.id}&year=${year}`)
  }

  const handleBackToBrands = () => {
    setSelectedBrand(null)
    setSelectedModel(null)
    setSelectedYear(null)
    setCurrentStep('brands')
    window.history.pushState({}, '', '/catalogue')
  }

  const handleBackToModels = () => {
    setSelectedModel(null)
    setSelectedYear(null)
    setCurrentStep('models')
    window.history.pushState({}, '', `/catalogue?brand=${selectedBrand?.id}`)
  }

  const handleBackToYears = () => {
    setSelectedYear(null)
    setCurrentStep('years')
    window.history.pushState({}, '', `/catalogue?brand=${selectedBrand?.id}&model=${selectedModel?.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du catalogue...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold font-heading text-gray-900">
                  Catalogue Véhicules
                </h1>
                <p className="text-sm text-gray-600">{COMPANY_INFO.name}</p>
              </div>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-primary-600 font-medium">
                Accueil
              </Link>
              <Link href="/catalogue" className="text-primary-600 font-medium">
                Catalogue
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-primary-600 font-medium">
                Contact
              </Link>
              <Link href="/admin" className="text-gray-700 hover:text-primary-600 font-medium">
                Administration
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Fil d'Ariane Global */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary-600 flex items-center space-x-1">
              <Home className="w-4 h-4" />
              <span>Accueil</span>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium text-gray-900">Catalogue</span>

            {selectedBrand && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="font-medium text-gray-900">{selectedBrand.nom}</span>
              </>
            )}

            {selectedModel && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="font-medium text-gray-900">{selectedModel.nom}</span>
              </>
            )}

            {selectedYear && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="font-medium text-gray-900">{selectedYear}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Contenu Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Étape 1: Sélection de la marque */}
        {currentStep === 'brands' && (
          <BrandSelector
            onBrandSelect={handleBrandSelect}
            selectedBrandId={selectedBrand?.id}
          />
        )}

        {/* Étape 2: Sélection du modèle */}
        {currentStep === 'models' && selectedBrand && (
          <ModelSelector
            brandId={selectedBrand.id}
            brandInfo={selectedBrand}
            onModelSelect={handleModelSelect}
            onBack={handleBackToBrands}
            selectedModelId={selectedModel?.id}
          />
        )}

        {/* Étape 3: Sélection de l'année */}
        {currentStep === 'years' && selectedBrand && selectedModel && (
          <YearSelector
            brandId={selectedBrand.id}
            modelId={selectedModel.id}
            brandInfo={selectedBrand}
            modelInfo={selectedModel}
            onYearSelect={handleYearSelect}
            onBack={handleBackToModels}
            selectedYear={selectedYear || undefined}
          />
        )}

        {/* Étape 4: Liste des véhicules */}
        {currentStep === 'vehicles' && selectedBrand && selectedModel && (
          <VehicleList
            brandId={selectedBrand.id}
            modelId={selectedModel.id}
            year={selectedYear || undefined}
            brandInfo={selectedBrand}
            modelInfo={selectedModel}
            onBack={handleBackToYears}
          />
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
