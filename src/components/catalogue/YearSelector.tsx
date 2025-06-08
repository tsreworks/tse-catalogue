'use client'

import { useState, useEffect } from 'react'
import { CatalogueNavigationService, YearInfo, Brand, Model } from '@/services/catalogueNavigation'
import { Calendar, ChevronRight, ChevronLeft, Loader2, Car } from 'lucide-react'
import Link from 'next/link'


interface YearSelectorProps {
  brandId: string
  modelId: string
  brandInfo?: Brand
  modelInfo?: Model
  onYearSelect?: (year: number) => void
  onBack?: () => void
  selectedYear?: number
  className?: string
}

export default function YearSelector({ 
  brandId,
  modelId,
  brandInfo,
  modelInfo,
  onYearSelect, 
  onBack,
  selectedYear,
  className = '' 
}: YearSelectorProps) {
  const [years, setYears] = useState<YearInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (modelId) {
      loadYears()
    }
  }, [modelId])

  const loadYears = async () => {
    setLoading(true)
    setError(null)
    
    const result = await CatalogueNavigationService.getYearsByModel(modelId)
    
    if (result.success) {
      setYears(result.years)
    } else {
      setError(result.error || 'Erreur lors du chargement des années')
    }
    
    setLoading(false)
  }

  const handleYearClick = (year: number) => {
    if (onYearSelect) {
      onYearSelect(year)
    }
  }

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-600 mb-4" />
          <p className="text-gray-600">Chargement des années...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-x-4">
              <button
                onClick={loadYears}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Réessayer
              </button>
              {onBack && (
                <button
                  onClick={onBack}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Retour aux modèles
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (years.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune année disponible</h3>
          <p className="text-gray-600 mb-4">
            Il n'y a actuellement aucun véhicule disponible pour {brandInfo?.nom} {modelInfo?.nom}.
          </p>
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Retour aux modèles</span>
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      {/* En-tête avec navigation */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Retour</span>
            </button>
          )}
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold font-heading text-gray-900">
              Années disponibles
            </h2>
            <p className="text-gray-600">
              Choisissez l'année du {brandInfo?.nom} {modelInfo?.nom} qui vous intéresse.
            </p>
          </div>
        </div>

        {/* Fil d'Ariane */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <Link href="/catalogue" className="hover:text-primary-600">
            Catalogue
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/catalogue?brand=${brandId}`} className="hover:text-primary-600">
            {brandInfo?.nom || 'Marque'}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-gray-900">
            {modelInfo?.nom || 'Modèle'}
          </span>
        </nav>
      </div>

      {/* Grille des années */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {years.map((yearInfo) => (
          <YearCard
            key={yearInfo.annee}
            yearInfo={yearInfo}
            brandId={brandId}
            modelId={modelId}
            isSelected={selectedYear === yearInfo.annee}
            onClick={() => handleYearClick(yearInfo.annee)}
          />
        ))}
      </div>

      {/* Statistiques */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          {years.length} année{years.length > 1 ? 's' : ''} disponible{years.length > 1 ? 's' : ''} • {' '}
          {years.reduce((total, year) => total + year.vehicleCount, 0)} véhicule{years.reduce((total, year) => total + year.vehicleCount, 0) > 1 ? 's' : ''} au total
        </p>
      </div>
    </div>
  )
}

// Composant pour une carte d'année
interface YearCardProps {
  yearInfo: YearInfo
  brandId: string
  modelId: string
  isSelected?: boolean
  onClick: () => void
}

function YearCard({ yearInfo, brandId, modelId, isSelected = false, onClick }: YearCardProps) {
  const currentYear = new Date().getFullYear()
  const isRecent = yearInfo.annee >= currentYear - 2
  const isNew = yearInfo.annee >= currentYear

  return (
    <Link href={`/catalogue?brand=${brandId}&model=${modelId}&year=${yearInfo.annee}`}>
      <div
        className={`
          group cursor-pointer bg-white rounded-xl border-2 transition-all duration-200 hover:shadow-lg
          ${isSelected 
            ? 'border-primary-500 shadow-md' 
            : 'border-gray-200 hover:border-primary-300'
          }
        `}
        onClick={onClick}
      >
        <div className="p-6">
          {/* Année avec badge */}
          <div className="text-center mb-4">
            <div className="relative inline-block">
              <div className="w-16 h-16 mx-auto bg-primary-100 rounded-lg flex items-center justify-center mb-2">
                <Calendar className="w-8 h-8 text-primary-600" />
              </div>
              
              {/* Badge pour les véhicules récents/neufs */}
              {isNew && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Neuf
                </span>
              )}
              {isRecent && !isNew && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  Récent
                </span>
              )}
            </div>

            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
              {yearInfo.annee}
            </h3>
          </div>

          {/* Statistiques */}
          <div className="space-y-3">
            {/* Nombre de véhicules */}
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Car className="w-4 h-4" />
              <span>
                {yearInfo.vehicleCount} véhicule{yearInfo.vehicleCount > 1 ? 's' : ''}
              </span>
            </div>


          </div>

          {/* Flèche */}
          <div className="mt-4 flex justify-center">
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  )
}

// Composant compact pour la sélection d'année (pour les filtres)
interface CompactYearSelectorProps {
  modelId?: string
  selectedYear?: number
  onYearChange: (year: number | null) => void
  className?: string
}

export function CompactYearSelector({ 
  modelId,
  selectedYear, 
  onYearChange, 
  className = '' 
}: CompactYearSelectorProps) {
  const [years, setYears] = useState<YearInfo[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (modelId) {
      loadYears()
    } else {
      setYears([])
      onYearChange(null)
    }
  }, [modelId])

  const loadYears = async () => {
    if (!modelId) return
    
    setLoading(true)
    const result = await CatalogueNavigationService.getYearsByModel(modelId)
    if (result.success) {
      setYears(result.years)
    }
    setLoading(false)
  }

  if (!modelId) {
    return (
      <div className={className}>
        <select disabled className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100">
          <option>Sélectionnez d'abord un modèle</option>
        </select>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={className}>
        <select disabled className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100">
          <option>Chargement...</option>
        </select>
      </div>
    )
  }

  return (
    <div className={className}>
      <select
        value={selectedYear || ''}
        onChange={(e) => onYearChange(e.target.value ? parseInt(e.target.value) : null)}
        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        <option value="">Toutes les années</option>
        {years.map((yearInfo) => (
          <option key={yearInfo.annee} value={yearInfo.annee}>
            {yearInfo.annee} ({yearInfo.vehicleCount} véhicule{yearInfo.vehicleCount > 1 ? 's' : ''})
          </option>
        ))}
      </select>
    </div>
  )
}
