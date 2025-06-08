'use client'

import { useState } from 'react'
import { Upload, Image as ImageIcon, FileText, User, LogOut } from 'lucide-react'
import Link from 'next/link'

// Version de test sans authentification pour debug rapide
export default function MediaPageTest() {
  const [activeTab, setActiveTab] = useState<'images' | 'documents'>('images')

  // Utilisateur fictif pour les tests
  const mockUser = {
    email: 'admin@tse.com',
    nom: 'Admin',
    prenom: 'TSE',
    role: 'super_admin'
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
                  Gestion des Médias (TEST)
                </h1>
                <p className="text-sm text-gray-600">Images et documents - Version de test</p>
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
              
              {/* Informations utilisateur fictives */}
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
                <button className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors">
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
                Images (0)
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
                Documents (0)
              </button>
            </nav>
          </div>
        </div>

        {/* Zone d'upload */}
        <div className="mb-8">
          <div className="border-2 border-dashed border-gray-300 hover:border-primary-400 rounded-lg p-8 text-center transition-colors cursor-pointer">
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

        {/* Barre d'outils */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {/* Recherche */}
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher des fichiers..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Mode d'affichage */}
            <div className="flex border border-gray-300 rounded-lg">
              <button className="p-2 bg-primary-100 text-primary-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button className="p-2 text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Zone de fichiers vide */}
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5L12 5H5a2 2 0 00-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun fichier</h3>
          <p className="mt-1 text-sm text-gray-500">
            Commencez par uploader des {activeTab === 'images' ? 'images' : 'documents'}.
          </p>
        </div>

        {/* Informations de test */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Version de Test
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Cette page est une version de test sans authentification Supabase pour déboguer l'interface.
                  Les fonctionnalités d'upload seront intégrées une fois les problèmes d'authentification résolus.
                </p>
              </div>
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex space-x-2">
                  <Link
                    href="/admin"
                    className="bg-yellow-50 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100"
                  >
                    Retour à l'administration
                  </Link>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-yellow-50 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100"
                  >
                    Recharger la page
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques de test */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-600">Images uploadées</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-600">Documents uploadés</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900">0 MB</div>
            <div className="text-sm text-gray-600">Espace utilisé</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">✓</div>
            <div className="text-sm text-gray-600">Interface fonctionnelle</div>
          </div>
        </div>
      </div>
    </div>
  )
}
