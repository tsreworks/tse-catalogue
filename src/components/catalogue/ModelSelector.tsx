'use client'

import { useState, useEffect } from 'react'
import { CatalogueNavigationService, Model, Brand } from '@/services/catalogueNavigation'
import { Car, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'


interface ModelSelectorProps {
  brandId: string
  brandInfo?: Brand
  onModelSelect?: (model: Model) => void
  onBack?: () => void
  selectedModelId?: string
  className?: string
}

export default function ModelSelector({ 
  brandId,
  brandInfo,
  onModelSelect, 
  onBack,
  selectedModelId,
  className = '' 
}: ModelSelectorProps) {
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (brandId) {
      loadModels()
    }
  }, [brandId])

  const loadModels = async () => {
    setLoading(true)
    setError(null)
    
    const result = await CatalogueNavigationService.getModelsByBrand(brandId)
    
    if (result.success) {
      setModels(result.models)
    } else {
      setError(result.error || 'Erreur lors du chargement des modèles')
    }
    
    setLoading(false)
  }

  const handleModelClick = (model: Model) => {
    if (onModelSelect) {
      onModelSelect(model)
    }
  }

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-600 mb-4" />
          <p className="text-gray-600">Chargement des modèles...</p>
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
                onClick={loadModels}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Réessayer
              </button>
              {onBack && (
                <button
                  onClick={onBack}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Retour aux marques
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (models.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-12">
          <Car className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun modèle disponible</h3>
          <p className="text-gray-600 mb-4">
            Il n'y a actuellement aucun modèle disponible pour {brandInfo?.nom || 'cette marque'}.
          </p>
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Retour aux marques</span>
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
              Modèles {brandInfo?.nom || 'disponibles'}
            </h2>
            <p className="text-gray-600">
              Choisissez le modèle qui vous intéresse pour voir les années disponibles.
            </p>
          </div>
        </div>

        {/* Fil d'Ariane */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <Link href="/catalogue" className="hover:text-primary-600">
            Catalogue
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-gray-900">
            {brandInfo?.nom || 'Marque'}
          </span>
        </nav>
      </div>

      {/* Grille des modèles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <ModelCard
            key={model.id}
            model={model}
            brandId={brandId}
            isSelected={selectedModelId === model.id}
            onClick={() => handleModelClick(model)}
          />
        ))}
      </div>

      {/* Statistiques */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          {models.length} modèle{models.length > 1 ? 's' : ''} disponible{models.length > 1 ? 's' : ''} • {' '}
          {models.reduce((total, model) => total + (model.vehicleCount || 0), 0)} véhicule{models.reduce((total, model) => total + (model.vehicleCount || 0), 0) > 1 ? 's' : ''} au total
        </p>
      </div>
    </div>
  )
}

// Composant pour une carte de modèle
interface ModelCardProps {
  model: Model
  brandId: string
  isSelected?: boolean
  onClick: () => void
}

function ModelCard({ model, brandId, isSelected = false, onClick }: ModelCardProps) {
  return (
    <Link href={`/catalogue?brand=${brandId}&model=${model.id}`}>
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
          {/* Icône du modèle */}
          <div className="w-12 h-12 mx-auto mb-4 bg-primary-100 rounded-lg flex items-center justify-center">
            <Car className="w-6 h-6 text-primary-600" />
          </div>

          {/* Nom du modèle */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center group-hover:text-primary-600 transition-colors">
            {model.nom}
          </h3>

          {/* Description */}
          {model.description && (
            <p className="text-sm text-gray-600 mb-4 text-center line-clamp-2">
              {model.description}
            </p>
          )}

          {/* Statistiques */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Car className="w-4 h-4" />
              <span>
                {model.vehicleCount} véhicule{(model.vehicleCount || 0) > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Flèche */}
          <div className="flex justify-center">
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  )
}

// Composant compact pour la sélection de modèle (pour les filtres)
interface CompactModelSelectorProps {
  brandId?: string
  selectedModelId?: string
  onModelChange: (modelId: string | null) => void
  className?: string
}

export function CompactModelSelector({ 
  brandId,
  selectedModelId, 
  onModelChange, 
  className = '' 
}: CompactModelSelectorProps) {
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (brandId) {
      loadModels()
    } else {
      setModels([])
      onModelChange(null)
    }
  }, [brandId])

  const loadModels = async () => {
    if (!brandId) return
    
    setLoading(true)
    const result = await CatalogueNavigationService.getModelsByBrand(brandId)
    if (result.success) {
      setModels(result.models)
    }
    setLoading(false)
  }

  if (!brandId) {
    return (
      <div className={className}>
        <select disabled className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100">
          <option>Sélectionnez d'abord une marque</option>
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
        value={selectedModelId || ''}
        onChange={(e) => onModelChange(e.target.value || null)}
        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        <option value="">Tous les modèles</option>
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.nom} ({model.vehicleCount} véhicule{(model.vehicleCount || 0) > 1 ? 's' : ''})
          </option>
        ))}
      </select>
    </div>
  )
}
