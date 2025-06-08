'use client'

import { useState, useRef, useCallback } from 'react'
import { StorageService, UploadResult } from '@/lib/storage'
import { Upload, X, FileText, Loader2, Check, AlertCircle, Download } from 'lucide-react'

interface DocumentUploadProps {
  onUploadComplete?: (results: UploadResult[]) => void
  onUploadError?: (error: string) => void
  maxFiles?: number
  folder?: string
  allowedTypes?: string[]
  className?: string
}

interface UploadingDocument {
  file: File
  status: 'uploading' | 'success' | 'error'
  result?: UploadResult
  progress?: number
}

const DEFAULT_ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]

const FILE_TYPE_LABELS: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/msword': 'Word (DOC)',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word (DOCX)'
}

export default function DocumentUpload({
  onUploadComplete,
  onUploadError,
  maxFiles = 3,
  folder,
  allowedTypes = DEFAULT_ALLOWED_TYPES,
  className = ''
}: DocumentUploadProps) {
  const [uploadingDocs, setUploadingDocs] = useState<UploadingDocument[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Gérer la sélection de fichiers
  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)
    
    // Vérifier le nombre maximum de fichiers
    if (fileArray.length > maxFiles) {
      onUploadError?.(`Maximum ${maxFiles} documents autorisés`)
      return
    }

    // Filtrer les types de fichiers autorisés
    const validFiles = fileArray.filter(file => allowedTypes.includes(file.type))
    
    if (validFiles.length !== fileArray.length) {
      const allowedLabels = allowedTypes.map(type => FILE_TYPE_LABELS[type] || type).join(', ')
      onUploadError?.(`Types de fichiers autorisés: ${allowedLabels}`)
      return
    }

    // Créer les objets d'upload
    const uploadDocs: UploadingDocument[] = validFiles.map(file => ({
      file,
      status: 'uploading' as const,
      progress: 0
    }))

    setUploadingDocs(uploadDocs)

    // Uploader les fichiers
    await Promise.all(uploadDocs.map(async (uploadDoc, index) => {
      try {
        // Upload vers Supabase
        const result = await StorageService.uploadFile(uploadDoc.file, {
          bucket: 'vehicle-documents',
          folder
        })

        // Mettre à jour le statut
        setUploadingDocs(prev => prev.map((item, i) => 
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
        setUploadingDocs(prev => prev.map((item, i) => 
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
    }))

    // Notifier la fin de l'upload
    setTimeout(() => {
      const results = uploadDocs.map(d => d.result).filter(Boolean) as UploadResult[]
      onUploadComplete?.(results)
    }, 1000)
  }, [maxFiles, folder, allowedTypes, onUploadComplete, onUploadError])

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

  // Supprimer un document de la liste
  const removeDocument = useCallback((index: number) => {
    setUploadingDocs(prev => {
      const newDocs = [...prev]
      newDocs.splice(index, 1)
      return newDocs
    })
  }, [])

  // Obtenir l'icône selon le type de fichier
  const getFileIcon = (mimeType: string) => {
    if (mimeType === 'application/pdf') {
      return <FileText className="w-8 h-8 text-red-500" />
    }
    return <FileText className="w-8 h-8 text-blue-500" />
  }

  // Formater la taille du fichier
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const acceptedFileTypes = allowedTypes.join(',')

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
          accept={acceptedFileTypes}
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <FileText className="w-6 h-6 text-gray-600" />
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              Glissez vos documents ici
            </p>
            <p className="text-sm text-gray-500">
              ou cliquez pour sélectionner des fichiers
            </p>
          </div>
          
          <div className="text-xs text-gray-400">
            Maximum {maxFiles} documents • {Object.values(FILE_TYPE_LABELS).join(', ')} • 50MB max par fichier
          </div>
        </div>
      </div>

      {/* Liste des documents */}
      {uploadingDocs.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Documents sélectionnés</h4>
          
          <div className="space-y-2">
            {uploadingDocs.map((uploadDoc, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-lg"
              >
                {/* Icône du fichier */}
                <div className="flex-shrink-0">
                  {getFileIcon(uploadDoc.file.type)}
                </div>

                {/* Informations du fichier */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {uploadDoc.file.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {FILE_TYPE_LABELS[uploadDoc.file.type] || uploadDoc.file.type} • {formatFileSize(uploadDoc.file.size)}
                  </p>
                  
                  {/* Message d'erreur */}
                  {uploadDoc.status === 'error' && uploadDoc.result?.error && (
                    <p className="text-sm text-red-600 mt-1">
                      {uploadDoc.result.error}
                    </p>
                  )}
                </div>

                {/* Statut */}
                <div className="flex-shrink-0">
                  {uploadDoc.status === 'uploading' && (
                    <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />
                  )}
                  {uploadDoc.status === 'success' && (
                    <Check className="w-5 h-5 text-green-600" />
                  )}
                  {uploadDoc.status === 'error' && (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 flex space-x-2">
                  {uploadDoc.status === 'success' && uploadDoc.result?.url && (
                    <a
                      href={uploadDoc.result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-gray-400 hover:text-primary-600"
                      title="Télécharger"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  )}
                  
                  <button
                    onClick={() => removeDocument(index)}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Supprimer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Résumé de l'upload */}
      {uploadingDocs.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {uploadingDocs.filter(d => d.status === 'success').length} / {uploadingDocs.length} documents uploadés
            </span>
            
            {uploadingDocs.every(d => d.status !== 'uploading') && (
              <button
                onClick={() => setUploadingDocs([])}
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
