'use client'

import { useState } from 'react'
import { useAuthContext } from '@/contexts/AuthContext'
import { Upload, Image as ImageIcon, FileText } from 'lucide-react'
import Link from 'next/link'

export default function MediaPageSimple() {
  const { user, loading } = useAuthContext()
  const [activeTab, setActiveTab] = useState<'images' | 'documents'>('images')

  // Vérification simple de l'authentification
  if (loading) {
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
          <Link href="/auth/login" className="text-primary-600 hover:text-primary-700">
            Se connecter
          </Link>
        </div>
      </div>
    )
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
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  {user?.prenom} {user?.nom}
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {user?.role}
                </span>
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
                Images
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
                Documents
              </button>
            </nav>
          </div>
        </div>

        {/* Zone d'upload simplifiée */}
        <div className="mb-8">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-gray-600" />
              </div>
              
              <div>
                <p className="text-lg font-medium text-gray-900">
                  Zone d'upload {activeTab === 'images' ? 'Images' : 'Documents'}
                </p>
                <p className="text-sm text-gray-500">
                  Fonctionnalité en cours de développement
                </p>
              </div>
              
              <div className="text-xs text-gray-400">
                {activeTab === 'images' 
                  ? 'JPG, PNG, WebP • 10MB max par fichier'
                  : 'PDF, Word • 50MB max par fichier'
                }
              </div>
            </div>
          </div>
        </div>

        {/* Message de statut */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Interface de Gestion des Médias
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Cette page permet de gérer les images et documents associés aux véhicules.
                  Les fonctionnalités d'upload seront bientôt disponibles.
                </p>
              </div>
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex">
                  <Link
                    href="/admin"
                    className="bg-blue-50 px-2 py-1.5 rounded-md text-sm font-medium text-blue-800 hover:bg-blue-100"
                  >
                    Retour à l'administration
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informations de configuration */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Utilisateur connecté:</span>
              <span className="ml-2 text-gray-600">{user.email}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Rôle:</span>
              <span className="ml-2 text-gray-600">{user.role}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Onglet actif:</span>
              <span className="ml-2 text-gray-600">{activeTab}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Statut:</span>
              <span className="ml-2 text-green-600">Connecté</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
