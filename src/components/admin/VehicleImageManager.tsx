'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { 
  Upload, 
  Trash2, 
  Star, 
  Edit3, 
  Move, 
  Download,
  AlertCircle,
  Check,
  Loader2,
  Plus,
  X
} from 'lucide-react'
import type { VehicleImageWithMetadata, ImageGalleryData } from '@/lib/vehicle-images-service'

interface VehicleImageManagerProps {
  vehicleId: string
  onImagesChange?: (gallery: ImageGalleryData) => void
  className?: string
}

interface EditingImage {
  id: string
  altText: string
}

export default function VehicleImageManager({
  vehicleId,
  onImagesChange,
  className = ''
}: VehicleImageManagerProps) {
  const [gallery, setGallery] = useState<ImageGalleryData>({ images: [], totalCount: 0 })
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [editingImage, setEditingImage] = useState<EditingImage | null>(null)
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set())
  const [draggedImage, setDraggedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Charger les images
  const loadImages = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/vehicles/${vehicleId}/images?include_stats=true`)
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des images')
      }

      const data = await response.json()
      setGallery(data)
      onImagesChange?.(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }, [vehicleId, onImagesChange])

  useEffect(() => {
    loadImages()
  }, [loadImages])

  // Upload d'images
  const handleImageUpload = async (files: FileList) => {
    if (files.length === 0) return

    try {
      setUploading(true)
      setError(null)

      const formData = new FormData()
      Array.from(files).forEach(file => {
        formData.append('images', file)
      })
      formData.append('altTextPrefix', 'Image du véhicule')

      const response = await fetch(`/api/vehicles/${vehicleId}/images`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de l\'upload')
      }

      const result = await response.json()
      
      if (result.errors && result.errors.length > 0) {
        setError(`Certaines images n'ont pas pu être uploadées: ${result.errors.join(', ')}`)
      }

      await loadImages()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setUploading(false)
    }
  }

  // Définir comme image principale
  const setPrimaryImage = async (imageId: string) => {
    try {
      const response = await fetch(`/api/vehicles/${vehicleId}/images`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'set_primary',
          imageId
        })
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la définition de l\'image principale')
      }

      await loadImages()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    }
  }

  // Supprimer une image
  const deleteImage = async (imageId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return

    try {
      const response = await fetch(`/api/vehicles/${vehicleId}/images/${imageId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression')
      }

      await loadImages()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    }
  }

  // Supprimer les images sélectionnées
  const deleteSelectedImages = async () => {
    if (selectedImages.size === 0) return
    
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${selectedImages.size} image(s) ?`)) return

    try {
      const imageIds = Array.from(selectedImages).join(',')
      const response = await fetch(`/api/vehicles/${vehicleId}/images?imageIds=${imageIds}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression')
      }

      setSelectedImages(new Set())
      await loadImages()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    }
  }

  // Éditer le texte alternatif
  const saveImageEdit = async () => {
    if (!editingImage) return

    try {
      const response = await fetch(`/api/vehicles/${vehicleId}/images/${editingImage.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          altText: editingImage.altText
        })
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour')
      }

      setEditingImage(null)
      await loadImages()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    }
  }

  // Gestion de la sélection
  const toggleImageSelection = (imageId: string) => {
    const newSelection = new Set(selectedImages)
    if (newSelection.has(imageId)) {
      newSelection.delete(imageId)
    } else {
      newSelection.add(imageId)
    }
    setSelectedImages(newSelection)
  }

  const selectAllImages = () => {
    setSelectedImages(new Set(gallery.images.map(img => img.id)))
  }

  const clearSelection = () => {
    setSelectedImages(new Set())
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête avec actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Galerie d'images</h3>
          <p className="text-sm text-gray-600">
            {gallery.totalCount} image(s) • {gallery.stats?.totalSize ? `${Math.round(gallery.stats.totalSize / 1024 / 1024)} MB` : ''}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedImages.size > 0 && (
            <>
              <span className="text-sm text-gray-600">
                {selectedImages.size} sélectionnée(s)
              </span>
              <button
                onClick={deleteSelectedImages}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={clearSelection}
                className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
              >
                Désélectionner
              </button>
            </>
          )}
          
          {gallery.images.length > 0 && selectedImages.size === 0 && (
            <button
              onClick={selectAllImages}
              className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
            >
              Tout sélectionner
            </button>
          )}
        </div>
      </div>

      {/* Zone d'upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
          className="hidden"
          id="image-upload"
          disabled={uploading}
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          ) : (
            <Plus className="h-8 w-8 text-gray-400" />
          )}
          <span className="text-sm text-gray-600">
            {uploading ? 'Upload en cours...' : 'Cliquez pour ajouter des images ou glissez-déposez'}
          </span>
        </label>
      </div>

      {/* Messages d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <span className="text-red-700">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Grille d'images */}
      {gallery.images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.images.map((image) => (
            <div
              key={image.id}
              className={`
                relative group border-2 rounded-lg overflow-hidden transition-all
                ${selectedImages.has(image.id)
                  ? 'border-primary-500 ring-2 ring-primary-200'
                  : 'border-gray-200 hover:border-gray-300'
                }
                ${image.est_principale ? 'ring-2 ring-yellow-400' : ''}
              `}
            >
              {/* Image */}
              <div className="aspect-square relative">
                <Image
                  src={image.url}
                  alt={image.alt_text || 'Image du véhicule'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />

                {/* Overlay avec contrôles */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPrimaryImage(image.id)}
                    className={`p-2 rounded-full transition-colors ${
                      image.est_principale
                        ? 'bg-yellow-500 text-white'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                    title={image.est_principale ? 'Image principale' : 'Définir comme principale'}
                  >
                    <Star className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => setEditingImage({ id: image.id, altText: image.alt_text || '' })}
                    className="p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
                    title="Modifier le texte alternatif"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => deleteImage(image.id)}
                    className="p-2 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="Supprimer l'image"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Checkbox de sélection */}
                <div className="absolute top-2 left-2">
                  <input
                    type="checkbox"
                    checked={selectedImages.has(image.id)}
                    onChange={() => toggleImageSelection(image.id)}
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                </div>

                {/* Badge image principale */}
                {image.est_principale && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Principale
                  </div>
                )}
              </div>

              {/* Informations */}
              <div className="p-2 bg-white">
                <p className="text-xs text-gray-600 truncate">
                  {image.alt_text || 'Sans description'}
                </p>
                <p className="text-xs text-gray-400">
                  {image.largeur}×{image.hauteur} • {Math.round((image.taille_fichier || 0) / 1024)} KB
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <Upload className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Aucune image pour ce véhicule</p>
          <p className="text-sm">Ajoutez des images pour créer une galerie</p>
        </div>
      )}

      {/* Modal d'édition */}
      {editingImage && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Modifier l'image</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texte alternatif
                </label>
                <input
                  type="text"
                  value={editingImage.altText}
                  onChange={(e) => setEditingImage({ ...editingImage, altText: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Description de l'image"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setEditingImage(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={saveImageEdit}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
