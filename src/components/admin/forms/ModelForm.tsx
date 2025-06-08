'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Save, 
  X, 
  AlertCircle, 
  Loader2,
  Car,
  Building2,
  FileText
} from 'lucide-react'
import { ValidationService } from '@/lib/validation'
import type { Database } from '@/types/database'

type Model = Database['public']['Tables']['models']['Row']
type Brand = Database['public']['Tables']['brands']['Row']

interface ModelFormProps {
  model?: Model
  brandId?: string // Pour pré-sélectionner une marque
  onSave?: (model: Model) => void
  onCancel?: () => void
  className?: string
}

interface FormData {
  nom: string
  brand_id: string
  description?: string
}

export default function ModelForm({ 
  model, 
  brandId,
  onSave, 
  onCancel,
  className = '' 
}: ModelFormProps) {
  const router = useRouter()
  const isEditing = !!model

  // État du formulaire
  const [formData, setFormData] = useState<FormData>({
    nom: model?.nom || '',
    brand_id: model?.brand_id || brandId || '',
    description: model?.description || ''
  })

  // États de l'interface
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [warnings, setWarnings] = useState<string[]>([])

  // Charger les marques au montage
  useEffect(() => {
    loadBrands()
  }, [])

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

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Effacer les erreurs quand l'utilisateur modifie
    if (errors.length > 0) {
      setErrors([])
    }
  }

  const validateForm = () => {
    const validation = ValidationService.validateModel(formData, isEditing)
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

      const url = isEditing ? `/api/models/${model.id}` : '/api/models'
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

      const savedModel = await response.json()
      
      if (onSave) {
        onSave(savedModel)
      } else {
        router.push('/admin/models')
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

  const selectedBrand = brands.find(brand => brand.id === formData.brand_id)

  return (
    <div className={`bg-white rounded-lg shadow-sm ${className}`}>
      {/* En-tête */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Car className="h-6 w-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? 'Modifier le modèle' : 'Nouveau modèle'}
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

      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-6">
          {/* Marque */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building2 className="inline h-4 w-4 mr-1" />
              Marque *
            </label>
            <select
              value={formData.brand_id}
              onChange={(e) => handleInputChange('brand_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
              disabled={loading}
            >
              <option value="">Sélectionner une marque</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>
                  {brand.nom}
                </option>
              ))}
            </select>
            {loading && (
              <p className="text-xs text-gray-500 mt-1">
                <Loader2 className="inline h-3 w-3 animate-spin mr-1" />
                Chargement des marques...
              </p>
            )}
          </div>

          {/* Nom du modèle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Car className="inline h-4 w-4 mr-1" />
              Nom du modèle *
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => handleInputChange('nom', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ex: Corolla, Série 3, Classe C..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Le nom doit être unique pour cette marque
            </p>
            
            {/* Aperçu du nom complet */}
            {selectedBrand && formData.nom && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                <span className="text-blue-800">
                  Nom complet : <strong>{selectedBrand.nom} {formData.nom}</strong>
                </span>
              </div>
            )}
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
              placeholder="Description du modèle, ses caractéristiques, ses versions..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum 1000 caractères (optionnel)
            </p>
          </div>

          {/* Informations supplémentaires pour l'édition */}
          {isEditing && model && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Informations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">ID :</span>
                  <span className="ml-2 font-mono text-gray-800">{model.id}</span>
                </div>
                <div>
                  <span className="text-gray-600">Créé le :</span>
                  <span className="ml-2 text-gray-800">
                    {new Date(model.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Modifié le :</span>
                  <span className="ml-2 text-gray-800">
                    {new Date(model.updated_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
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
                {isEditing ? 'Mettre à jour' : 'Créer le modèle'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
