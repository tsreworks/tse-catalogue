'use client'

import { useState, useEffect } from 'react'
import { CatalogueNavigationService, Brand } from '@/services/catalogueNavigation'
import { Car, ChevronRight, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface BrandSelectorProps {
  onBrandSelect?: (brand: Brand) => void
  selectedBrandId?: string
  className?: string
}

export default function BrandSelector({ 
  onBrandSelect, 
  selectedBrandId,
  className = '' 
}: BrandSelectorProps) {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadBrands()
  }, [])

  const loadBrands = async () => {
    setLoading(true)
    setError(null)
    
    const result = await CatalogueNavigationService.getBrands()
    
    if (result.success) {
      setBrands(result.brands)
    } else {
      setError(result.error || 'Erreur lors du chargement des marques')
    }
    
    setLoading(false)
  }

  const handleBrandClick = (brand: Brand) => {
    if (onBrandSelect) {
      onBrandSelect(brand)
    }
  }

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-600 mb-4" />
          <p className="text-gray-600">Chargement des marques...</p>
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
            <button
              onClick={loadBrands}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (brands.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-12">
          <Car className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune marque disponible</h3>
          <p className="text-gray-600">Il n'y a actuellement aucune marque avec des véhicules disponibles.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      {/* En-tête */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold font-heading text-gray-900 mb-2">
          Choisissez une Marque
        </h2>
        <p className="text-gray-600">
          Sélectionnez la marque de véhicule qui vous intéresse pour voir les modèles disponibles.
        </p>
      </div>

      {/* Grille des marques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {brands.map((brand) => (
          <BrandCard
            key={brand.id}
            brand={brand}
            isSelected={selectedBrandId === brand.id}
            onClick={() => handleBrandClick(brand)}
          />
        ))}
      </div>

      {/* Statistiques */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          {brands.length} marque{brands.length > 1 ? 's' : ''} disponible{brands.length > 1 ? 's' : ''} • {' '}
          {brands.reduce((total, brand) => total + (brand.vehicleCount || 0), 0)} véhicule{brands.reduce((total, brand) => total + (brand.vehicleCount || 0), 0) > 1 ? 's' : ''} au total
        </p>
      </div>
    </div>
  )
}

// Composant pour une carte de marque
interface BrandCardProps {
  brand: Brand
  isSelected?: boolean
  onClick: () => void
}

function BrandCard({ brand, isSelected = false, onClick }: BrandCardProps) {
  return (
    <Link href={`/catalogue?brand=${brand.id}`}>
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
        {/* Logo de la marque */}
        <div className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            <Image
              src={brand.logo || '/images/brands/default.svg'}
              alt={`Logo ${brand.nom}`}
              width={48}
              height={48}
              className="w-12 h-12 object-contain"
              onError={(e) => {
                // Fallback vers le logo par défaut si l'image ne charge pas
                const target = e.currentTarget as HTMLImageElement;
                if (target.src !== '/images/brands/default.svg') {
                  target.src = '/images/brands/default.svg';
                }
              }}
            />
          </div>

          {/* Nom de la marque */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
            {brand.nom}
          </h3>

          {/* Description */}
          {brand.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {brand.description}
            </p>
          )}

          {/* Nombre de véhicules */}
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Car className="w-4 h-4" />
            <span>
              {brand.vehicleCount} véhicule{(brand.vehicleCount || 0) > 1 ? 's' : ''}
            </span>
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

// Composant compact pour la sélection de marque (pour les filtres)
interface CompactBrandSelectorProps {
  selectedBrandId?: string
  onBrandChange: (brandId: string | null) => void
  className?: string
}

export function CompactBrandSelector({ 
  selectedBrandId, 
  onBrandChange, 
  className = '' 
}: CompactBrandSelectorProps) {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBrands()
  }, [])

  const loadBrands = async () => {
    const result = await CatalogueNavigationService.getBrands()
    if (result.success) {
      setBrands(result.brands)
    }
    setLoading(false)
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
        value={selectedBrandId || ''}
        onChange={(e) => onBrandChange(e.target.value || null)}
        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        <option value="">Toutes les marques</option>
        {brands.map((brand) => (
          <option key={brand.id} value={brand.id}>
            {brand.nom} ({brand.vehicleCount} véhicule{(brand.vehicleCount || 0) > 1 ? 's' : ''})
          </option>
        ))}
      </select>
    </div>
  )
}
