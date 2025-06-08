'use client'

import { useState, useRef, useCallback } from 'react'
import { StorageService, ImageUtils, UploadResult } from '@/lib/storage'
import { Upload, X, Image as ImageIcon, Loader2, Check, AlertCircle } from 'lucide-react'

interface ImageUploadProps {
  onUploadComplete?: (results: UploadResult[]) => void
  onUploadError?: (error: string) => void
  maxFiles?: number
  folder?: string
  showPreview?: boolean
  className?: string
}

interface UploadingFile {
  file: File
  preview: string
  status: 'uploading' | 'success' | 'error'
  result?: UploadResult
  progress?: number
}

export default function ImageUpload({
  onUploadComplete,
  onUploadError,
  maxFiles = 5,
  folder,
  showPreview = true,
  className = ''
}: ImageUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Gérer la sélection de fichiers
  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)
    
    // Vérifier le nombre maximum de fichiers
    if (fileArray.length > maxFiles) {
      onUploadError?.(`Maximum ${maxFiles} fichiers autorisés`)
      return
    }

    // Filtrer les images uniquement
    const imageFiles = fileArray.filter(file => ImageUtils.isImage(file))
    
    if (imageFiles.length !== fileArray.length) {
      onUploadError?.('Seules les images sont autorisées')
      return
    }

    // Créer les objets d'upload avec preview
    const uploadFiles: UploadingFile[] = await Promise.all(
      imageFiles.map(async (file) => ({
        file,
        preview: URL.createObjectURL(file),
        status: 'uploading' as const,
        progress: 0
      }))
    )

    setUploadingFiles(uploadFiles)

    // Uploader les fichiers
    await uploadFiles.map(async (uploadFile, index) => {
      try {
        // Redimensionner l'image si nécessaire
        const resizedFile = await StorageService.resizeImage(uploadFile.file)
        
        // Upload vers Supabase
        const result = await StorageService.uploadFile(resizedFile, {
          bucket: 'vehicle-images',
          folder
        })

        // Mettre à jour le statut
        setUploadingFiles(prev => prev.map((item, i) => 
          i === index 
            ? { 
                ...item, 
                status: result.success ? 'success' : 'error',
                result 
              }
            : item
        ))

        if (!result.success) {
          onUploadError?.(result.error || 'Erreur d\'upload')
        }
      } catch (error) {
        setUploadingFiles(prev => prev.map((item, i) => 
          i === index 
            ? { 
                ...item, 
                status: 'error',
                result: { 
                  success: false, 
                  error: error instanceof Error ? error.message : 'Erreur inconnue' 
                }
              }
            : item
        ))
      }
    })

    // Notifier la fin de l'upload
    setTimeout(() => {
      const results = uploadFiles.map(f => f.result).filter(Boolean) as UploadResult[]
      onUploadComplete?.(results)
    }, 1000)
  }, [maxFiles, folder, onUploadComplete, onUploadError])

  // Gérer le drag & drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }, [handleFileSelect])

  // Supprimer un fichier de la liste
  const removeFile = useCallback((index: number) => {
    setUploadingFiles(prev => {
      const newFiles = [...prev]
      URL.revokeObjectURL(newFiles[index].preview)
      newFiles.splice(index, 1)
      return newFiles
    })
  }, [])

  // Nettoyer les URLs d'objet au démontage
  const cleanup = useCallback(() => {
    uploadingFiles.forEach(file => URL.revokeObjectURL(file.preview))
  }, [uploadingFiles])

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Zone de drop */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
          ${isDragOver 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Upload className="w-6 h-6 text-gray-600" />
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              Glissez vos images ici
            </p>
            <p className="text-sm text-gray-500">
              ou cliquez pour sélectionner des fichiers
            </p>
          </div>
          
          <div className="text-xs text-gray-400">
            Maximum {maxFiles} images • JPG, PNG, WebP • 10MB max par fichier
          </div>
        </div>
      </div>

      {/* Prévisualisation des fichiers */}
      {showPreview && uploadingFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Images sélectionnées</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadingFiles.map((uploadFile, index) => (
              <div
                key={index}
                className="relative group bg-white border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Image preview */}
                <div className="aspect-square bg-gray-100">
                  <img
                    src={uploadFile.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Overlay avec statut */}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  {uploadFile.status === 'uploading' && (
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  )}
                  {uploadFile.status === 'success' && (
                    <Check className="w-8 h-8 text-green-400" />
                  )}
                  {uploadFile.status === 'error' && (
                    <AlertCircle className="w-8 h-8 text-red-400" />
                  )}
                </div>

                {/* Bouton de suppression */}
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Nom du fichier */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-2 truncate">
                  {uploadFile.file.name}
                </div>

                {/* Message d'erreur */}
                {uploadFile.status === 'error' && uploadFile.result?.error && (
                  <div className="absolute bottom-8 left-0 right-0 bg-red-500 text-white text-xs p-1 text-center">
                    {uploadFile.result.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Résumé de l'upload */}
      {uploadingFiles.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {uploadingFiles.filter(f => f.status === 'success').length} / {uploadingFiles.length} images uploadées
            </span>
            
            {uploadingFiles.every(f => f.status !== 'uploading') && (
              <button
                onClick={cleanup}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Effacer la liste
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
