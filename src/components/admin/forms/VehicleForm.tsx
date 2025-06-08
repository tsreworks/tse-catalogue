'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Save, 
  X, 
  AlertCircle, 
  Loader2,
  Car,
  Palette,
  Calendar,
  Fuel,
  Settings,
  Gauge,
  FileText,
  Tag
} from 'lucide-react'
import VehicleImageManager from '@/components/admin/VehicleImageManager'
import { ValidationService } from '@/lib/validation'
import type { Database } from '@/types/database'

type Vehicle = Database['public']['Tables']['vehicles']['Row']
type VehicleInsert = Database['public']['Tables']['vehicles']['Insert']
type Brand = Database['public']['Tables']['brands']['Row']
type Model = Database['public']['Tables']['models']['Row']

interface VehicleFormProps {
  vehicle?: Vehicle
  onSave?: (vehicle: Vehicle) => void
  onCancel?: () => void
  className?: string
}

interface FormData {
  brand_id: string
  model_id: string
  annee: number
  couleur: string
  prix?: number
  kilometrage?: number
  carburant: string
  transmission: string
  statut: string
  description?: string
  puissance?: string
  cylindree?: string
  consommation?: string
  emissions?: string
  nombre_portes?: number
  nombre_places?: number
  coffre?: string
}

const CARBURANT_OPTIONS = ['Essence', 'Diesel', 'Hybride', 'Électrique']
const TRANSMISSION_OPTIONS = ['Manuelle', 'Automatique']
const STATUT_OPTIONS = ['Disponible', 'Vendu', 'Réservé', 'En maintenance']

export default function VehicleForm({ 
  vehicle, 
  onSave, 
  onCancel,
  className = '' 
}: VehicleFormProps) {
  const router = useRouter()
  const isEditing = !!vehicle

  // État du formulaire
  const [formData, setFormData] = useState<FormData>({
    brand_id: vehicle?.brand_id || '',
    model_id: vehicle?.model_id || '',
    annee: vehicle?.annee || new Date().getFullYear(),
    couleur: vehicle?.couleur || '',
    prix: vehicle?.prix || undefined,
    kilometrage: vehicle?.kilometrage || undefined,
    carburant: vehicle?.carburant || 'Essence',
    transmission: vehicle?.transmission || 'Manuelle',
    statut: vehicle?.statut || 'Disponible',
    description: vehicle?.description || '',
    puissance: vehicle?.puissance || '',
    cylindree: vehicle?.cylindree || '',
    consommation: vehicle?.consommation || '',
    emissions: vehicle?.emissions || '',
    nombre_portes: vehicle?.nombre_portes || undefined,
    nombre_places: vehicle?.nombre_places || undefined,
    coffre: vehicle?.coffre || ''
  })

  // États de l'interface
  const [brands, setBrands] = useState<Brand[]>([])
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [warnings, setWarnings] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'basic' | 'specs' | 'images'>('basic')

  // Charger les marques au montage
  useEffect(() => {
    loadBrands()
  }, [])

  // Charger les modèles quand la marque change
  useEffect(() => {
    if (formData.brand_id) {
      loadModels(formData.brand_id)
    } else {
      setModels([])
      setFormData(prev => ({ ...prev, model_id: '' }))
    }
  }, [formData.brand_id])

  const loadBrands = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/brands')
      if (response.ok) {
        const data = await response.json()
        setBrands(data.brands || data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des marques:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadModels = async (brandId: string) => {
    try {
      const response = await fetch(`/api/models?brand_id=${brandId}`)
      if (response.ok) {
        const data = await response.json()
        setModels(data.models || data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des modèles:', error)
    }
  }

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Effacer les erreurs quand l'utilisateur modifie
    if (errors.length > 0) {
      setErrors([])
    }
  }

  const validateForm = () => {
    const validation = ValidationService.validateVehicle(formData, isEditing)
    setErrors(validation.errors)
    setWarnings(validation.warnings || [])
    return validation.isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setSaving(true)
      setErrors([])

      const url = isEditing ? `/api/vehicles/${vehicle.id}` : '/api/vehicles'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la sauvegarde')
      }

      const savedVehicle = await response.json()
      
      if (onSave) {
        onSave(savedVehicle)
      } else {
        router.push('/admin/vehicles')
      }
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Erreur inconnue'])
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      router.back()
    }
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm ${className}`}>
      {/* En-tête */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Car className="h-6 w-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? 'Modifier le véhicule' : 'Nouveau véhicule'}
            </h2>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Messages d'erreur */}
      {errors.length > 0 && (
        <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Erreurs de validation</h3>
              <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Messages d'avertissement */}
      {warnings.length > 0 && (
        <div className="mx-6 mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Avertissements</h3>
              <ul className="mt-1 text-sm text-yellow-700 list-disc list-inside">
                {warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('basic')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'basic'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Informations de base
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'specs'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Spécifications
          </button>
          {isEditing && (
            <button
              onClick={() => setActiveTab('images')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'images'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Images
            </button>
          )}
        </nav>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="p-6">
          {/* Onglet Informations de base */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              {/* Marque et Modèle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Car className="inline h-4 w-4 mr-1" />
                    Marque *
                  </label>
                  <select
                    value={formData.brand_id}
                    onChange={(e) => handleInputChange('brand_id', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Sélectionner une marque</option>
                    {brands.map(brand => (
                      <option key={brand.id} value={brand.id}>
                        {brand.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modèle *
                  </label>
                  <select
                    value={formData.model_id}
                    onChange={(e) => handleInputChange('model_id', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                    disabled={!formData.brand_id}
                  >
                    <option value="">Sélectionner un modèle</option>
                    {models.map(model => (
                      <option key={model.id} value={model.id}>
                        {model.nom}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Année, Couleur et Statut */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Année *
                  </label>
                  <input
                    type="number"
                    min="1900"
                    max={new Date().getFullYear() + 2}
                    value={formData.annee}
                    onChange={(e) => handleInputChange('annee', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Palette className="inline h-4 w-4 mr-1" />
                    Couleur *
                  </label>
                  <input
                    type="text"
                    value={formData.couleur}
                    onChange={(e) => handleInputChange('couleur', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Ex: Blanc, Noir, Rouge..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag className="inline h-4 w-4 mr-1" />
                    Statut *
                  </label>
                  <select
                    value={formData.statut}
                    onChange={(e) => handleInputChange('statut', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    {STATUT_OPTIONS.map(statut => (
                      <option key={statut} value={statut}>
                        {statut}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Carburant et Transmission */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Fuel className="inline h-4 w-4 mr-1" />
                    Carburant *
                  </label>
                  <select
                    value={formData.carburant}
                    onChange={(e) => handleInputChange('carburant', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    {CARBURANT_OPTIONS.map(carburant => (
                      <option key={carburant} value={carburant}>
                        {carburant}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Settings className="inline h-4 w-4 mr-1" />
                    Transmission *
                  </label>
                  <select
                    value={formData.transmission}
                    onChange={(e) => handleInputChange('transmission', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    {TRANSMISSION_OPTIONS.map(transmission => (
                      <option key={transmission} value={transmission}>
                        {transmission}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Prix et Kilométrage */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix (CFA)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.prix || ''}
                    onChange={(e) => handleInputChange('prix', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Prix en francs CFA"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Laisser vide pour masquer le prix au public
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Gauge className="inline h-4 w-4 mr-1" />
                    Kilométrage
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.kilometrage || ''}
                    onChange={(e) => handleInputChange('kilometrage', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Kilométrage en km"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="inline h-4 w-4 mr-1" />
                  Description
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Description détaillée du véhicule..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum 2000 caractères
                </p>
              </div>
            </div>
          )}

          {/* Onglet Spécifications */}
          {activeTab === 'specs' && (
            <div className="space-y-6">
              {/* Caractéristiques moteur */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Caractéristiques moteur</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Puissance
                    </label>
                    <input
                      type="text"
                      value={formData.puissance || ''}
                      onChange={(e) => handleInputChange('puissance', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Ex: 150 ch, 110 kW"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cylindrée
                    </label>
                    <input
                      type="text"
                      value={formData.cylindree || ''}
                      onChange={(e) => handleInputChange('cylindree', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Ex: 2.0L, 1600 cm³"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Consommation
                    </label>
                    <input
                      type="text"
                      value={formData.consommation || ''}
                      onChange={(e) => handleInputChange('consommation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Ex: 6.5L/100km"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Émissions CO2
                    </label>
                    <input
                      type="text"
                      value={formData.emissions || ''}
                      onChange={(e) => handleInputChange('emissions', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Ex: 120 g/km"
                    />
                  </div>
                </div>
              </div>

              {/* Caractéristiques véhicule */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Caractéristiques véhicule</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de portes
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.nombre_portes || ''}
                      onChange={(e) => handleInputChange('nombre_portes', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de places
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={formData.nombre_places || ''}
                      onChange={(e) => handleInputChange('nombre_places', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Volume coffre
                    </label>
                    <input
                      type="text"
                      value={formData.coffre || ''}
                      onChange={(e) => handleInputChange('coffre', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Ex: 500L, 1200L"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Images */}
          {activeTab === 'images' && isEditing && vehicle && (
            <div>
              <VehicleImageManager
                vehicleId={vehicle.id}
                className="border-0 shadow-none p-0"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving || loading}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? 'Mettre à jour' : 'Créer le véhicule'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
