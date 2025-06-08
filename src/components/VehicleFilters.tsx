import { X } from 'lucide-react'
import { VehicleFilters as Filters } from '@/types/vehicle'

interface VehicleFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  marques: string[]
  carburants: string[]
  onClose: () => void
}

export default function VehicleFilters({ 
  filters, 
  onFiltersChange, 
  marques, 
  carburants, 
  onClose 
}: VehicleFiltersProps) {
  const handleFilterChange = (key: keyof Filters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined
    })
  }

  const clearFilters = () => {
    onFiltersChange({})
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== null
  )

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filtres avancés</h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Effacer tout
            </button>
          )}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Marque */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marque
          </label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={filters.marque || ''}
            onChange={(e) => handleFilterChange('marque', e.target.value)}
          >
            <option value="">Toutes les marques</option>
            {marques.map(marque => (
              <option key={marque} value={marque}>{marque}</option>
            ))}
          </select>
        </div>

        {/* Carburant */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Carburant
          </label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={filters.carburant || ''}
            onChange={(e) => handleFilterChange('carburant', e.target.value)}
          >
            <option value="">Tous les carburants</option>
            {carburants.map(carburant => (
              <option key={carburant} value={carburant}>{carburant}</option>
            ))}
          </select>
        </div>

        {/* Transmission */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transmission
          </label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={filters.transmission || ''}
            onChange={(e) => handleFilterChange('transmission', e.target.value)}
          >
            <option value="">Toutes les transmissions</option>
            <option value="Manuelle">Manuelle</option>
            <option value="Automatique">Automatique</option>
          </select>
        </div>

        {/* Année minimum */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Année minimum
          </label>
          <input
            type="number"
            min="1990"
            max={new Date().getFullYear() + 1}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={filters.anneeMin || ''}
            onChange={(e) => handleFilterChange('anneeMin', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="Ex: 2020"
          />
        </div>

        {/* Année maximum */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Année maximum
          </label>
          <input
            type="number"
            min="1990"
            max={new Date().getFullYear() + 1}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={filters.anneeMax || ''}
            onChange={(e) => handleFilterChange('anneeMax', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="Ex: 2024"
          />
        </div>

        {/* Prix minimum */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prix minimum (€)
          </label>
          <input
            type="number"
            min="0"
            step="1000"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={filters.prixMin || ''}
            onChange={(e) => handleFilterChange('prixMin', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="Ex: 15000"
          />
        </div>

        {/* Prix maximum */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prix maximum (€)
          </label>
          <input
            type="number"
            min="0"
            step="1000"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={filters.prixMax || ''}
            onChange={(e) => handleFilterChange('prixMax', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="Ex: 50000"
          />
        </div>

        {/* Couleur */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Couleur
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={filters.couleur || ''}
            onChange={(e) => handleFilterChange('couleur', e.target.value)}
            placeholder="Ex: Blanc, Noir, Rouge..."
          />
        </div>

        {/* Statut */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Statut
          </label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={filters.statut || ''}
            onChange={(e) => handleFilterChange('statut', e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="Disponible">Disponible</option>
            <option value="Réservé">Réservé</option>
            <option value="Vendu">Vendu</option>
            <option value="En maintenance">En maintenance</option>
          </select>
        </div>
      </div>

      {/* Résumé des filtres actifs */}
      {hasActiveFilters && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Filtres actifs :</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null
              return (
                <span
                  key={key}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                >
                  {key}: {value}
                  <button
                    onClick={() => handleFilterChange(key as keyof Filters, undefined)}
                    className="ml-2 text-primary-600 hover:text-primary-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
