'use client'

import { useState, useEffect } from 'react'
import { StorageService } from '@/lib/storage'
import ImageUpload from '@/components/ImageUpload'
import DocumentUpload from '@/components/DocumentUpload'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuthContext } from '@/contexts/AuthContext'
import { 
  Image as ImageIcon, 
  FileText, 
  Trash2, 
  Download, 
  Eye,
  Upload,
  Folder,
  Search,
  Filter,
  Grid,
  List,
  LogOut,
  User
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface MediaFile {
  name: string
  id: string
  updated_at: string
  created_at: string
  last_accessed_at: string
  metadata: {
    eTag: string
    size: number
    mimetype: string
    cacheControl: string
    lastModified: string
    contentLength: number
    httpStatusCode: number
  }
}

function MediaPageContent() {
  const { user, signOut, loading: authLoading } = useAuthContext()

  // Vérification simple de l'authentification
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Vous devez être connecté pour accéder à cette page.</p>
          <a href="/auth/login" className="text-primary-600 hover:text-primary-700">
            Se connecter
          </a>
        </div>
      </div>
    )
  }
  const [activeTab, setActiveTab] = useState<'images' | 'documents'>('images')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [images, setImages] = useState<MediaFile[]>([])
  const [documents, setDocuments] = useState<MediaFile[]>([])
  const [filesLoading, setFilesLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Erreur déconnexion:', error)
    }
  }

  // Charger les fichiers
  const loadFiles = async () => {
    setFilesLoading(true)
    try {
      const [imagesResult, documentsResult] = await Promise.all([
        StorageService.listFiles('vehicle-images'),
        StorageService.listFiles('vehicle-documents')
      ])

      if (imagesResult.success) {
        setImages(imagesResult.files)
      }
      if (documentsResult.success) {
        setDocuments(documentsResult.files)
      }
    } catch (error) {
      console.error('Erreur chargement fichiers:', error)
    } finally {
      setFilesLoading(false)
    }
  }

  useEffect(() => {
    loadFiles()
  }, [])

  // Filtrer les fichiers selon la recherche
  const filteredFiles = (files: MediaFile[]) => {
    if (!searchTerm) return files
    return files.filter(file => 
      file.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  // Supprimer des fichiers sélectionnés
  const deleteSelectedFiles = async () => {
    if (selectedFiles.length === 0) return
    
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${selectedFiles.length} fichier(s) ?`)) {
      return
    }

    try {
      const bucket = activeTab === 'images' ? 'vehicle-images' : 'vehicle-documents'
      
      await Promise.all(
        selectedFiles.map(fileName => 
          StorageService.deleteFile(bucket, fileName)
        )
      )
      
      setSelectedFiles([])
      await loadFiles()
    } catch (error) {
      console.error('Erreur suppression:', error)
    }
  }

  // Formater la taille du fichier
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Obtenir l'URL publique
  const getPublicUrl = (fileName: string) => {
    const bucket = activeTab === 'images' ? 'vehicle-images' : 'vehicle-documents'
    return StorageService.getPublicUrl(bucket, fileName)
  }

  const currentFiles = activeTab === 'images' ? images : documents
  const filteredCurrentFiles = filteredFiles(currentFiles)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/admin" className="flex items-center space-x-4">
              <Image
                src="/images/logosansfond.png"
                alt="TSE Logo"
                width={60}
                height={60}
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold font-heading text-gray-900">
                  Gestion des Médias
                </h1>
                <p className="text-sm text-gray-600">Images et documents</p>
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
              
              {/* Informations utilisateur */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">
                    {user?.prenom} {user?.nom}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {user?.role}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                  title="Se déconnecter"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Déconnexion</span>
                </button>
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
                Images ({images.length})
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
                Documents ({documents.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Zone d'upload */}
        <div className="mb-8">
          {activeTab === 'images' ? (
            <ImageUpload
              onUploadComplete={() => loadFiles()}
              onUploadError={(error) => console.error(error)}
              maxFiles={10}
              folder="admin-uploads"
            />
          ) : (
            <DocumentUpload
              onUploadComplete={() => loadFiles()}
              onUploadError={(error) => console.error(error)}
              maxFiles={5}
              folder="admin-uploads"
            />
          )}
        </div>

        {/* Barre d'outils */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher des fichiers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Actions sur la sélection */}
            {selectedFiles.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedFiles.length} sélectionné(s)
                </span>
                <button
                  onClick={deleteSelectedFiles}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 inline mr-1" />
                  Supprimer
                </button>
              </div>
            )}

            {/* Mode d'affichage */}
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-600'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Liste des fichiers */}
        {filesLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des fichiers...</p>
          </div>
        ) : filteredCurrentFiles.length === 0 ? (
          <div className="text-center py-12">
            <Folder className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun fichier</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Aucun fichier ne correspond à votre recherche.' : 'Commencez par uploader des fichiers.'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredCurrentFiles.map((file) => (
              <div
                key={file.name}
                className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <input
                  type="checkbox"
                  checked={selectedFiles.includes(file.name)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedFiles(prev => [...prev, file.name])
                    } else {
                      setSelectedFiles(prev => prev.filter(name => name !== file.name))
                    }
                  }}
                  className="absolute top-2 left-2 z-10"
                />

                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  {activeTab === 'images' ? (
                    <img
                      src={getPublicUrl(file.name)}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FileText className="w-12 h-12 text-gray-400" />
                  )}
                </div>

                <div className="p-3">
                  <p className="text-xs font-medium text-gray-900 truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.metadata?.size || 0)}
                  </p>
                </div>

                {/* Actions overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <a
                    href={getPublicUrl(file.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white rounded-full text-gray-600 hover:text-primary-600"
                    title="Voir"
                  >
                    <Eye className="w-4 h-4" />
                  </a>
                  <a
                    href={getPublicUrl(file.name)}
                    download
                    className="p-2 bg-white rounded-full text-gray-600 hover:text-primary-600"
                    title="Télécharger"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredCurrentFiles.map((file) => (
                <li key={file.name}>
                  <div className="px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFiles(prev => [...prev, file.name])
                          } else {
                            setSelectedFiles(prev => prev.filter(name => name !== file.name))
                          }
                        }}
                        className="mr-4"
                      />
                      
                      <div className="flex-shrink-0">
                        {activeTab === 'images' ? (
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        ) : (
                          <FileText className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(file.metadata?.size || 0)} • {new Date(file.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <a
                        href={getPublicUrl(file.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-primary-600"
                        title="Voir"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      <a
                        href={getPublicUrl(file.name)}
                        download
                        className="p-2 text-gray-400 hover:text-primary-600"
                        title="Télécharger"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

// Import de la version avec Supabase Storage
import MediaPageSupabase from './page-supabase'

export default function MediaPage() {
  // Version avec Supabase Storage réel
  return <MediaPageSupabase />
}
