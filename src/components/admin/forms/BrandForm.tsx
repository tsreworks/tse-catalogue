'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Save, 
  X, 
  AlertCircle, 
  Loader2,
  Building2,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon
} from 'lucide-react'
import { ValidationService } from '@/lib/validation'
import type { Database } from '@/types/database'

type Brand = Database['public']['Tables']['brands']['Row']

interface BrandFormProps {
  brand?: Brand
  onSave?: (brand: Brand) => void
  onCancel?: () => void
  className?: string
}

interface FormData {
  nom: string
  description?: string
  logo?: string
}

export default function BrandForm({ 
  brand, 
  onSave, 
  onCancel,
  className = '' 
}: BrandFormProps) {
  const router = useRouter()
  const isEditing = !!brand

  // État du formulaire
  const [formData, setFormData] = useState<FormData>({
    nom: brand?.nom || '',
    description: brand?.description || '',
    logo: brand?.logo || ''
  })

  // États de l'interface
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [warnings, setWarnings] = useState<string[]>([])

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Effacer les erreurs quand l'utilisateur modifie
    if (errors.length > 0) {
      setErrors([])
    }
  }

  const validateForm = () => {
    const validation = ValidationService.validateBrand(formData, isEditing)
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

      const url = isEditing ? `/api/brands/${brand.id}` : '/api/brands'
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

      const savedBrand = await response.json()
      
      if (onSave) {
        onSave(savedBrand)
      } else {
        router.push('/admin/brands')
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
            <Building2 className="h-6 w-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? 'Modifier la marque' : 'Nouvelle marque'}
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
          {/* Nom de la marque */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building2 className="inline h-4 w-4 mr-1" />
              Nom de la marque *
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => handleInputChange('nom', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ex: Toyota, BMW, Mercedes..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Le nom doit être unique et contenir au moins 2 caractères
            </p>
          </div>

          {/* Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <ImageIcon className="inline h-4 w-4 mr-1" />
              URL du logo
            </label>
            <input
              type="url"
              value={formData.logo || ''}
              onChange={(e) => handleInputChange('logo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="https://exemple.com/logo.png"
            />
            <p className="text-xs text-gray-500 mt-1">
              URL complète vers le logo de la marque (optionnel)
            </p>
            
            {/* Prévisualisation du logo */}
            {formData.logo && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Prévisualisation :</p>
                <div className="w-20 h-20 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                  <img
                    src={formData.logo}
                    alt="Logo de la marque"
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      target.nextElementSibling!.classList.remove('hidden')
                    }}
                  />
                  <div className="hidden text-gray-400 text-xs text-center">
                    <ImageIcon className="h-6 w-6 mx-auto mb-1" />
                    Erreur de chargement
                  </div>
                </div>
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
              placeholder="Description de la marque, son histoire, ses spécialités..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum 1000 caractères (optionnel)
            </p>
          </div>

          {/* Informations supplémentaires pour l'édition */}
          {isEditing && brand && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Informations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">ID :</span>
                  <span className="ml-2 font-mono text-gray-800">{brand.id}</span>
                </div>
                <div>
                  <span className="text-gray-600">Créée le :</span>
                  <span className="ml-2 text-gray-800">
                    {new Date(brand.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Modifiée le :</span>
                  <span className="ml-2 text-gray-800">
                    {new Date(brand.updated_at).toLocaleDateString('fr-FR')}
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
            disabled={saving}
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
                {isEditing ? 'Mettre à jour' : 'Créer la marque'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
