'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, Upload, Download, LogOut, User } from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuthContext } from '@/contexts/AuthContext'
import { Vehicle } from '@/types/vehicle'
import { formatPrice, formatDate, getVehicleStatusColor } from '@/lib/utils'
import AdminStats from '@/components/AdminStats'
import { mockVehicles } from '@/lib/vehicles-data'

function AdminPageContent() {
  const { user, signOut } = useAuthContext()
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles)
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([])

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Erreur déconnexion:', error)
    }
  }

  const handleSelectVehicle = (vehicleId: string) => {
    setSelectedVehicles(prev => 
      prev.includes(vehicleId) 
        ? prev.filter(id => id !== vehicleId)
        : [...prev, vehicleId]
    )
  }

  const handleSelectAll = () => {
    setSelectedVehicles(
      selectedVehicles.length === vehicles.length 
        ? [] 
        : vehicles.map(v => v.id)
    )
  }

  const handleDeleteSelected = () => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedVehicles.length} véhicule(s) ?`)) {
      setVehicles(prev => prev.filter(v => !selectedVehicles.includes(v.id)))
      setSelectedVehicles([])
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-4">
              <Image
                src="/images/logosansfond.png"
                alt="TSE Logo"
                width={60}
                height={60}
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold font-heading text-gray-900">
                  Administration TSE
                </h1>
                <p className="text-sm text-gray-600">Gestion du catalogue</p>
                <p className="text-xs text-red-600 font-medium">
                  🔒 Mode Admin : Prix visibles uniquement ici
                </p>
              </div>
            </Link>
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex space-x-8">
                <Link href="/" className="text-gray-700 hover:text-primary-600 font-medium">
                  Accueil
                </Link>
                <Link href="/catalogue" className="text-gray-700 hover:text-primary-600 font-medium">
                  Catalogue
                </Link>
                <Link href="/admin" className="text-primary-600 font-medium">
                  Administration
                </Link>
                <Link href="/admin/media" className="text-gray-700 hover:text-primary-600 font-medium">
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
        {/* Statistiques */}
        <AdminStats vehicles={vehicles} />

        {/* Actions principales */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold font-heading text-gray-900 mb-2">
                Gestion des Véhicules
              </h2>
              <p className="text-gray-600">
                {vehicles.length} véhicule{vehicles.length > 1 ? 's' : ''} dans le catalogue
              </p>
            </div>
            
            <div className="flex gap-3">
              <button className="tse-button flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un véhicule
              </button>
              <Link href="/admin/media" className="tse-button-secondary flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Gérer les médias
              </Link>
              <button className="tse-button-secondary flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </button>
            </div>
          </div>
        </div>

        {/* Actions de sélection */}
        {selectedVehicles.length > 0 && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-blue-800 font-medium">
                {selectedVehicles.length} véhicule{selectedVehicles.length > 1 ? 's' : ''} sélectionné{selectedVehicles.length > 1 ? 's' : ''}
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={handleDeleteSelected}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Supprimer
                </button>
                <button 
                  onClick={() => setSelectedVehicles([])}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tableau des véhicules */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedVehicles.length === vehicles.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Véhicule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date d'ajout
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedVehicles.includes(vehicle.id)}
                        onChange={() => handleSelectVehicle(vehicle.id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-12 w-16 bg-gray-100 rounded flex items-center justify-center mr-4">
                          <svg width="24" height="18" viewBox="0 0 24 18" fill="none" className="text-gray-400">
                            <path d="M6 9L7.2 7.8H16.8L18 9V12H16.8V11.4H7.2V12H6V9Z" fill="currentColor"/>
                            <circle cx="8.4" cy="12" r="0.9" fill="currentColor"/>
                            <circle cx="15.6" cy="12" r="0.9" fill="currentColor"/>
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {vehicle.marque} {vehicle.modele}
                          </div>
                          <div className="text-sm text-gray-500">
                            {vehicle.annee} • {vehicle.couleur} • {vehicle.carburant}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {vehicle.prix ? formatPrice(vehicle.prix) : 'Non défini'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getVehicleStatusColor(vehicle.statut)}`}>
                        {vehicle.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(vehicle.dateAjout)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-primary-600 hover:text-primary-900" title="Voir">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900" title="Modifier">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900" title="Supprimer">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {vehicles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucun véhicule dans le catalogue.</p>
            <button className="mt-4 tse-button flex items-center mx-auto">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter le premier véhicule
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminPageContent />
    </ProtectedRoute>
  )
}
