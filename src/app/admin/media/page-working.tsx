'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, Image as ImageIcon, FileText, User, LogOut, X, Check, AlertCircle } from 'lucide-react'
import Link from 'next/link'

// Version fonctionnelle avec upload basique (sans Supabase pour l'instant)
export default function MediaPageWorking() {
  const [activeTab, setActiveTab] = useState<'images' | 'documents'>('images')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Utilisateur fictif pour les tests
  const mockUser = {
    email: 'admin@tse.com',
    nom: 'Admin',
    prenom: 'TSE',
    role: 'super_admin'
  }

  // Gérer la sélection de fichiers
  const handleFileSelect = useCallback((files: FileList | null) => {
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

    // Ajouter les fichiers à la liste
    setUploadedFiles(prev => [...prev, ...validFiles])
  }, [activeTab])

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

  // Supprimer un fichier
  const removeFile = useCallback((index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }, [])

  // Filtrer les fichiers selon l'onglet actif
  const currentFiles = uploadedFiles.filter(file => 
    activeTab === 'images' ? file.type.startsWith('image/') : !file.type.startsWith('image/')
  )

  // Formater la taille du fichier
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
                <p className="text-sm text-gray-600">Images et documents - Version fonctionnelle</p>
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
                Images ({uploadedFiles.filter(f => f.type.startsWith('image/')).length})
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
                Documents ({uploadedFiles.filter(f => !f.type.startsWith('image/')).length})
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

        {/* Liste des fichiers uploadés */}
        {currentFiles.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Fichiers sélectionnés ({currentFiles.length})
            </h3>
            
            {activeTab === 'images' ? (
              // Vue grille pour les images
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {currentFiles.map((file, index) => (
                  <div key={index} className="relative group bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="aspect-square bg-gray-100 flex items-center justify-center">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <button
                      onClick={() => removeFile(uploadedFiles.indexOf(file))}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    
                    <div className="p-2">
                      <p className="text-xs font-medium text-gray-900 truncate" title={file.name}>
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Vue liste pour les documents
              <div className="space-y-2">
                {currentFiles.map((file, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-lg">
                    <FileText className="w-8 h-8 text-blue-500 flex-shrink-0" />
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {file.type.includes('pdf') ? 'PDF' : 'Word'} • {formatFileSize(file.size)}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => removeFile(uploadedFiles.indexOf(file))}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Message d'information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Upload Fonctionnel !
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Vous pouvez maintenant glisser-déposer ou sélectionner des fichiers. 
                  Les fichiers sont stockés temporairement en mémoire. 
                  L'intégration Supabase Storage sera ajoutée dans la prochaine étape.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900">
              {uploadedFiles.filter(f => f.type.startsWith('image/')).length}
            </div>
            <div className="text-sm text-gray-600">Images sélectionnées</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900">
              {uploadedFiles.filter(f => !f.type.startsWith('image/')).length}
            </div>
            <div className="text-sm text-gray-600">Documents sélectionnés</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(uploadedFiles.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024 * 100) / 100} MB
            </div>
            <div className="text-sm text-gray-600">Taille totale</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">✓</div>
            <div className="text-sm text-gray-600">Upload fonctionnel</div>
          </div>
        </div>
      </div>
    </div>
  )
}
