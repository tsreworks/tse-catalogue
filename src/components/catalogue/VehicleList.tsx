'use client'

import { useState, useEffect } from 'react'
import { CatalogueNavigationService, Brand, Model } from '@/services/catalogueNavigation'
import { Car, ChevronRight, ChevronLeft, Loader2, Filter, Grid, List, Search } from 'lucide-react'
import Link from 'next/link'
import ConditionalPriceDisplay, { QuoteButton } from '@/components/ConditionalPriceDisplay'
import { useUserRole } from '@/hooks/useUserRole'

import { generateVehicleSlug } from '@/lib/utils'

interface Vehicle {
  id: string
  annee: number
  couleur: string
  prix: number
  kilometrage: number
  carburant: string
  transmission: string
  description: string
  statut: string
  brands: { id: string; nom: string; logo?: string }
  models: { id: string; nom: string }
}

interface VehicleListProps {
  brandId?: string
  modelId?: string
  year?: number
  brandInfo?: Brand
  modelInfo?: Model
  onBack?: () => void
  className?: string
}

export default function VehicleList({ 
  brandId,
  modelId,
  year,
  brandInfo,
  modelInfo,
  onBack,
  className = '' 
}: VehicleListProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    couleur: '',
    carburant: '',
    transmission: '',
    prixMin: '',
    prixMax: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  const { canViewPrices } = useUserRole()

  useEffect(() => {
    loadVehicles()
  }, [brandId, modelId, year])

  const loadVehicles = async () => {
    setLoading(true)
    setError(null)
    
    const result = await CatalogueNavigationService.getVehiclesByCriteria(
      brandId,
      modelId,
      year,
      {
        couleur: filters.couleur || undefined,
        carburant: filters.carburant || undefined,
        transmission: filters.transmission || undefined,
        prixMin: filters.prixMin ? parseInt(filters.prixMin) : undefined,
        prixMax: filters.prixMax ? parseInt(filters.prixMax) : undefined
      }
    )
    
    if (result.success) {
      setVehicles(result.vehicles)
    } else {
      setError(result.error || 'Erreur lors du chargement des véhicules')
    }
    
    setLoading(false)
  }

  // Filtrer les véhicules selon le terme de recherche
  const filteredVehicles = vehicles.filter(vehicle => {
    if (!searchTerm) return true
    
    const searchLower = searchTerm.toLowerCase()
    return (
      vehicle.brands.nom.toLowerCase().includes(searchLower) ||
      vehicle.models.nom.toLowerCase().includes(searchLower) ||
      vehicle.couleur.toLowerCase().includes(searchLower) ||
      vehicle.carburant.toLowerCase().includes(searchLower) ||
      vehicle.transmission.toLowerCase().includes(searchLower) ||
      vehicle.description?.toLowerCase().includes(searchLower)
    )
  })

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    loadVehicles()
    setShowFilters(false)
  }

  const clearFilters = () => {
    setFilters({
      couleur: '',
      carburant: '',
      transmission: '',
      prixMin: '',
      prixMax: ''
    })
    loadVehicles()
  }

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-600 mb-4" />
          <p className="text-gray-600">Chargement des véhicules...</p>
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
                onClick={loadVehicles}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Réessayer
              </button>
              {onBack && (
                <button
                  onClick={onBack}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Retour
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (vehicles.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-12">
          <Car className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun véhicule disponible</h3>
          <p className="text-gray-600 mb-4">
            Il n'y a actuellement aucun véhicule disponible selon vos critères.
          </p>
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Retour</span>
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
              Véhicules disponibles
            </h2>
            <p className="text-gray-600">
              {brandInfo?.nom} {modelInfo?.nom} {year ? year : ''} - {filteredVehicles.length} véhicule{filteredVehicles.length > 1 ? 's' : ''} trouvé{filteredVehicles.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Fil d'Ariane */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link href="/catalogue" className="hover:text-primary-600">
            Catalogue
          </Link>
          {brandInfo && (
            <>
              <ChevronRight className="w-4 h-4" />
              <Link href={`/catalogue?brand=${brandId}`} className="hover:text-primary-600">
                {brandInfo.nom}
              </Link>
            </>
          )}
          {modelInfo && (
            <>
              <ChevronRight className="w-4 h-4" />
              <Link href={`/catalogue?brand=${brandId}&model=${modelId}`} className="hover:text-primary-600">
                {modelInfo.nom}
              </Link>
            </>
          )}
          {year && (
            <>
              <ChevronRight className="w-4 h-4" />
              <span className="font-medium text-gray-900">{year}</span>
            </>
          )}
        </nav>

        {/* Barre d'outils */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Recherche */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Contrôles */}
          <div className="flex items-center space-x-4">
            {/* Filtres */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filtres</span>
            </button>

            {/* Mode d'affichage */}
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Panneau de filtres */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Couleur</label>
                <select
                  value={filters.couleur}
                  onChange={(e) => handleFilterChange('couleur', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Toutes</option>
                  <option value="Blanc">Blanc</option>
                  <option value="Noir">Noir</option>
                  <option value="Gris">Gris</option>
                  <option value="Rouge">Rouge</option>
                  <option value="Bleu">Bleu</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Carburant</label>
                <select
                  value={filters.carburant}
                  onChange={(e) => handleFilterChange('carburant', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Tous</option>
                  <option value="Essence">Essence</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybride">Hybride</option>
                  <option value="Électrique">Électrique</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                <select
                  value={filters.transmission}
                  onChange={(e) => handleFilterChange('transmission', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Toutes</option>
                  <option value="Manuelle">Manuelle</option>
                  <option value="Automatique">Automatique</option>
                </select>
              </div>

              {canViewPrices && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prix min (CFA)</label>
                    <input
                      type="number"
                      value={filters.prixMin}
                      onChange={(e) => handleFilterChange('prixMin', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prix max (CFA)</label>
                    <input
                      type="number"
                      value={filters.prixMax}
                      onChange={(e) => handleFilterChange('prixMax', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      placeholder="100000000"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="mt-4 flex space-x-4">
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Appliquer
              </button>
              <button
                onClick={clearFilters}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Effacer
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Liste des véhicules */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredVehicles.map((vehicle) => (
            <VehicleListItem key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}

      {/* Statistiques */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          {filteredVehicles.length} véhicule{filteredVehicles.length > 1 ? 's' : ''} affiché{filteredVehicles.length > 1 ? 's' : ''} sur {vehicles.length} total
        </p>
      </div>
    </div>
  )
}

// Composant carte véhicule
function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {vehicle.brands.nom} {vehicle.models.nom}
            </h3>
            <p className="text-sm text-gray-600">{vehicle.annee} • {vehicle.couleur}</p>
          </div>
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <Car className="w-6 h-6 text-primary-600" />
          </div>
        </div>

        {/* Détails */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Kilométrage:</span>
            <span className="font-medium">{vehicle.kilometrage?.toLocaleString()} km</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Carburant:</span>
            <span className="font-medium">{vehicle.carburant}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Transmission:</span>
            <span className="font-medium">{vehicle.transmission}</span>
          </div>
        </div>

        {/* STRATÉGIE COMMERCIALE : Masquer les prix dans le catalogue public */}
        <div className="mb-4">
          <ConditionalPriceDisplay
            price={vehicle.prix}
            vehicleInfo={{
              marque: vehicle.brands.nom,
              modele: vehicle.models.nom,
              annee: vehicle.annee
            }}
            size="lg"
            forceHidePrice={true}
          />
        </div>

        {/* Action principale */}
        <Link
          href={`/catalogue/${generateVehicleSlug(vehicle.brands.nom, vehicle.models.nom, vehicle.annee)}`}
          className="w-full text-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          Voir détails
        </Link>
      </div>
    </div>
  )
}

// Composant liste véhicule
function VehicleListItem({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                <Car className="w-8 h-8 text-primary-600" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {vehicle.brands.nom} {vehicle.models.nom} {vehicle.annee}
                </h3>
                <p className="text-gray-600">{vehicle.couleur} • {vehicle.carburant} • {vehicle.transmission}</p>
                <p className="text-sm text-gray-500">{vehicle.kilometrage?.toLocaleString()} km</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-right">
              <ConditionalPriceDisplay
                price={vehicle.prix}
                vehicleInfo={{
                  marque: vehicle.brands.nom,
                  modele: vehicle.models.nom,
                  annee: vehicle.annee
                }}
                size="lg"
                forceHidePrice={true}
              />
            </div>

            <Link
              href={`/catalogue/${generateVehicleSlug(vehicle.brands.nom, vehicle.models.nom, vehicle.annee)}`}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Voir détails
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
