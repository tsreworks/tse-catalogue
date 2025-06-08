'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { UploadService, UploadResult } from '@/lib/upload-service'
import { Upload, Image as ImageIcon, FileText, User, LogOut, X, Check, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

// Interface pour les fichiers uploadés
interface UploadedFile {
  file: File
  result?: UploadResult
  status: 'uploading' | 'success' | 'error'
  preview?: string
}

// Version avec Supabase Storage réel
export default function MediaPageSupabase() {
  const [activeTab, setActiveTab] = useState<'images' | 'documents'>('images')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [savedFiles, setSavedFiles] = useState<any[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Utilisateur fictif pour les tests
  const mockUser = {
    email: 'admin@tse.com',
    nom: 'Admin',
    prenom: 'TSE',
    role: 'super_admin'
  }

  // Charger les fichiers existants depuis Supabase
  const loadExistingFiles = useCallback(async () => {
    setIsLoading(true)
    try {
      const [imagesResult, documentsResult] = await Promise.all([
        UploadService.listFiles('images', 'uploads'),
        UploadService.listFiles('documents', 'uploads')
      ])

      const allFiles = [
        ...(imagesResult.files || []).map(f => ({ ...f, type: 'images' })),
        ...(documentsResult.files || []).map(f => ({ ...f, type: 'documents' }))
      ]

      setSavedFiles(allFiles)
      console.log('📁 Fichiers chargés:', allFiles.length)
    } catch (error) {
      console.error('❌ Erreur chargement fichiers:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Charger les fichiers au montage du composant
  useEffect(() => {
    loadExistingFiles()
  }, [loadExistingFiles])

  // Gérer la sélection de fichiers
  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)
    const maxFiles = activeTab === 'images' ? 5 : 3
    
    if (fileArray.length > maxFiles) {
      alert(`Maximum ${maxFiles} fichiers autorisés`)
      return
    }

    // Filtrer selon le type d'onglet
    let validFiles: File[] = []
    if (activeTab === 'images') {
      validFiles = fileArray.filter(file => file.type.startsWith('image/'))
      if (validFiles.length !== fileArray.length) {
        alert('Seules les images sont autorisées (JPG, PNG, WebP)')
        return
      }
    } else {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      validFiles = fileArray.filter(file => allowedTypes.includes(file.type))
      if (validFiles.length !== fileArray.length) {
        alert('Seuls les fichiers PDF et Word sont autorisés')
        return
      }
    }

    // Créer les objets d'upload avec preview pour les images
    const uploadFiles: UploadedFile[] = await Promise.all(
      validFiles.map(async (file) => {
        let preview: string | undefined
        if (file.type.startsWith('image/')) {
          preview = URL.createObjectURL(file)
        }
        
        return {
          file,
          status: 'uploading' as const,
          preview
        }
      })
    )

    setUploadedFiles(prev => [...prev, ...uploadFiles])

    // Uploader vers Supabase Storage
    for (let i = 0; i < uploadFiles.length; i++) {
      const uploadFile = uploadFiles[i]
      const fileIndex = uploadedFiles.length + i

      try {
        console.log('🔄 Upload en cours:', uploadFile.file.name)
        
        const result = await UploadService.uploadFile(
          uploadFile.file,
          activeTab,
          'uploads'
        )

        // Mettre à jour le statut
        setUploadedFiles(prev => prev.map((item, index) => 
          index === fileIndex 
            ? { 
                ...item, 
                status: result.success ? 'success' : 'error',
                result 
              }
            : item
        ))

        if (result.success) {
          console.log('✅ Upload réussi:', result.url)
          // Recharger la liste des fichiers
          await loadExistingFiles()
        } else {
          console.error('❌ Upload échoué:', result.error)
        }

      } catch (error) {
        console.error('❌ Erreur upload:', error)
        setUploadedFiles(prev => prev.map((item, index) => 
          index === fileIndex 
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
    }
  }, [activeTab, uploadedFiles.length, loadExistingFiles])

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

  // Supprimer un fichier de la liste d'upload
  const removeUploadFile = useCallback((index: number) => {
    setUploadedFiles(prev => {
      const newFiles = [...prev]
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!)
      }
      newFiles.splice(index, 1)
      return newFiles
    })
  }, [])

  // Supprimer un fichier sauvegardé
  const deleteSavedFile = useCallback(async (file: any) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${file.name} ?`)) {
      return
    }

    try {
      const result = await UploadService.deleteFile(
        file.type as 'images' | 'documents',
        `uploads/${file.name}`
      )

      if (result.success) {
        console.log('✅ Fichier supprimé:', file.name)
        await loadExistingFiles()
      } else {
        console.error('❌ Erreur suppression:', result.error)
        alert(`Erreur lors de la suppression: ${result.error}`)
      }
    } catch (error) {
      console.error('❌ Erreur suppression:', error)
      alert('Erreur lors de la suppression')
    }
  }, [loadExistingFiles])

  // Filtrer les fichiers selon l'onglet actif
  const currentUploadFiles = uploadedFiles.filter(item => 
    activeTab === 'images' ? item.file.type.startsWith('image/') : !item.file.type.startsWith('image/')
  )

  const currentSavedFiles = savedFiles.filter(file => 
    activeTab === 'images' ? file.type === 'images' : file.type === 'documents'
  )

  // Formater la taille du fichier
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Obtenir l'URL publique d'un fichier sauvegardé
  const getFileUrl = (file: any) => {
    return UploadService.getPublicUrl(file.type, `uploads/${file.name}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/admin" className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold font-heading text-gray-900">
                  Gestion des Médias
                </h1>
                <p className="text-sm text-gray-600">Images et documents - Supabase Storage</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex space-x-8">
                <Link href="/admin" className="text-gray-700 hover:text-primary-600 font-medium">
                  Administration
                </Link>
                <Link href="/admin/media" className="text-primary-600 font-medium">
                  Médias
                </Link>
              </nav>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">
                    {mockUser.prenom} {mockUser.nom}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {mockUser.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Onglets */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('images')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'images'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ImageIcon className="w-5 h-5 inline mr-2" />
                Images ({currentSavedFiles.length})
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'documents'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="w-5 h-5 inline mr-2" />
                Documents ({currentSavedFiles.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Zone d'upload */}
        <div className="mb-8">
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
              accept={activeTab === 'images' ? 'image/*' : '.pdf,.doc,.docx'}
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
            
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-gray-600" />
              </div>
              
              <div>
                <p className="text-lg font-medium text-gray-900">
                  Glissez vos {activeTab === 'images' ? 'images' : 'documents'} ici
                </p>
                <p className="text-sm text-gray-500">
                  ou cliquez pour sélectionner des fichiers
                </p>
              </div>
              
              <div className="text-xs text-gray-400">
                {activeTab === 'images' 
                  ? 'Maximum 5 images • JPG, PNG, WebP • 10MB max par fichier'
                  : 'Maximum 3 documents • PDF, Word • 50MB max par fichier'
                }
              </div>
            </div>
          </div>
        </div>

        {/* Fichiers en cours d'upload */}
        {currentUploadFiles.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Upload en cours ({currentUploadFiles.length})
            </h3>
            
            <div className="space-y-2">
              {currentUploadFiles.map((uploadFile, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-lg">
                  {/* Preview ou icône */}
                  <div className="flex-shrink-0">
                    {uploadFile.preview ? (
                      <img src={uploadFile.preview} alt="" className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <FileText className="w-12 h-12 text-blue-500" />
                    )}
                  </div>
                  
                  {/* Informations */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {uploadFile.file.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(uploadFile.file.size)}
                    </p>
                    {uploadFile.status === 'error' && uploadFile.result?.error && (
                      <p className="text-sm text-red-600 mt-1">
                        {uploadFile.result.error}
                      </p>
                    )}
                  </div>
                  
                  {/* Statut */}
                  <div className="flex-shrink-0">
                    {uploadFile.status === 'uploading' && (
                      <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />
                    )}
                    {uploadFile.status === 'success' && (
                      <Check className="w-5 h-5 text-green-600" />
                    )}
                    {uploadFile.status === 'error' && (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  
                  {/* Supprimer */}
                  <button
                    onClick={() => removeUploadFile(index)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fichiers sauvegardés */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Fichiers sauvegardés ({currentSavedFiles.length})
            </h3>
            <button
              onClick={loadExistingFiles}
              disabled={isLoading}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50"
            >
              {isLoading ? 'Chargement...' : 'Actualiser'}
            </button>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
              <p className="mt-2 text-gray-600">Chargement des fichiers...</p>
            </div>
          ) : currentSavedFiles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Aucun fichier sauvegardé</p>
            </div>
          ) : activeTab === 'images' ? (
            // Vue grille pour les images
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {currentSavedFiles.map((file, index) => (
                <div key={index} className="relative group bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    <img
                      src={getFileUrl(file)}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <button
                    onClick={() => deleteSavedFile(file)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  
                  <div className="p-2">
                    <p className="text-xs font-medium text-gray-900 truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.metadata?.size || 0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Vue liste pour les documents
            <div className="space-y-2">
              {currentSavedFiles.map((file, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-lg">
                  <FileText className="w-8 h-8 text-blue-500 flex-shrink-0" />
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.metadata?.size || 0)}
                    </p>
                  </div>
                  
                  <a
                    href={getFileUrl(file)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Ouvrir
                  </a>
                  
                  <button
                    onClick={() => deleteSavedFile(file)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message de succès */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Supabase Storage Intégré !
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  Les fichiers sont maintenant sauvegardés dans Supabase Storage. 
                  Vous pouvez uploader, visualiser et supprimer des fichiers en temps réel.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900">
              {savedFiles.filter(f => f.type === 'images').length}
            </div>
            <div className="text-sm text-gray-600">Images sauvegardées</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900">
              {savedFiles.filter(f => f.type === 'documents').length}
            </div>
            <div className="text-sm text-gray-600">Documents sauvegardés</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(savedFiles.reduce((acc, file) => acc + (file.metadata?.size || 0), 0) / 1024 / 1024 * 100) / 100} MB
            </div>
            <div className="text-sm text-gray-600">Espace utilisé</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">✓</div>
            <div className="text-sm text-gray-600">Supabase Storage</div>
          </div>
        </div>
      </div>
    </div>
  )
}
