'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  Download,
  Share2,
  Printer,
  Phone,
  Mail,
  Calendar,
  Fuel,
  Settings,
  Gauge,
  Users,
  Package,
  Zap,
  Shield,
  Award
} from 'lucide-react'
import { Vehicle } from '@/types/vehicle'
import {
  formatKilometrage,
  formatDate,
  getVehicleStatusColor,
  getCarburantIcon
} from '@/lib/utils'
import ConditionalPriceDisplay from '@/components/ConditionalPriceDisplay'
import VehicleImageGallery from '@/components/VehicleImageGallery'
import VehicleSpecs from '@/components/VehicleSpecs'
import VehicleContact from '@/components/VehicleContact'
import { COMPANY_INFO } from '@/config/company'

interface VehicleDetailPageProps {
  vehicle: Vehicle
}

export default function VehicleDetailPage({ vehicle }: VehicleDetailPageProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'contact'>('overview')

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${vehicle.marque} ${vehicle.modele} ${vehicle.annee}`,
          text: vehicle.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Erreur lors du partage:', error)
      }
    } else {
      // Fallback: copier l'URL dans le presse-papiers
      navigator.clipboard.writeText(window.location.href)
      alert('Lien copié dans le presse-papiers!')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm print:hidden">
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
                  TSE Catalogue
                </h1>
                <p className="text-sm text-gray-600">Détails véhicule</p>
              </div>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-primary-600 font-medium">
                Accueil
              </Link>
              <Link href="/catalogue" className="text-gray-700 hover:text-primary-600 font-medium">
                Catalogue
              </Link>
              <Link href="/admin" className="text-gray-700 hover:text-primary-600 font-medium">
                Administration
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Breadcrumb et navigation */}
      <div className="bg-white border-b print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/catalogue" 
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour au catalogue
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">
                {vehicle.marque} {vehicle.modele} {vehicle.annee}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleShare}
                className="tse-button-secondary p-2 flex items-center"
                title="Partager"
              >
                <Share2 className="h-4 w-4" />
              </button>
              <button
                onClick={handlePrint}
                className="tse-button-secondary p-2 flex items-center"
                title="Imprimer"
              >
                <Printer className="h-4 w-4" />
              </button>
              {vehicle.ficheTechnique && (
                <a
                  href={vehicle.ficheTechnique}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tse-button flex items-center"
                  title="Télécharger la fiche technique"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Fiche PDF
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* En-tête véhicule */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold font-heading text-gray-900 mb-2">
                    {vehicle.marque} {vehicle.modele}
                  </h1>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {vehicle.annee}
                    </span>
                    <span>•</span>
                    <span>{vehicle.couleur}</span>
                    <span>•</span>
                    <span className="flex items-center">
                      <span className="mr-1">{getCarburantIcon(vehicle.carburant)}</span>
                      {vehicle.carburant}
                    </span>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getVehicleStatusColor(vehicle.statut)}`}>
                    {vehicle.statut}
                  </span>
                </div>
              </div>

              {/* Prix et kilométrage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-primary-50 rounded-lg p-4">
                  <p className="text-sm text-primary-600 font-medium mb-2">Prix</p>
                  <div className="text-xl font-bold">
                    <ConditionalPriceDisplay
                      price={vehicle.prix || 0}
                      vehicleInfo={{
                        marque: vehicle.marque,
                        modele: vehicle.modele,
                        annee: vehicle.annee
                      }}
                      size="xl"
                      forceHidePrice={true}
                      showQuoteButton={false}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Consultez l'onglet Contact pour une offre personnalisée
                  </p>
                </div>
                {vehicle.kilometrage && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 font-medium">Kilométrage</p>
                    <p className="text-2xl font-bold text-gray-700">
                      {formatKilometrage(vehicle.kilometrage)}
                    </p>
                  </div>
                )}
              </div>

              {/* Description */}
              {vehicle.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{vehicle.description}</p>
                </div>
              )}
            </div>

            {/* Galerie d'images */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Photos du véhicule</h3>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <svg width="80" height="60" viewBox="0 0 80 60" fill="none" className="text-gray-400 mx-auto mb-4">
                    <path d="M20 30L24 26H56L60 30V40H56V38H24V40H20V30Z" fill="currentColor"/>
                    <circle cx="28" cy="40" r="3" fill="currentColor"/>
                    <circle cx="52" cy="40" r="3" fill="currentColor"/>
                    <rect x="26" y="28" width="28" height="8" fill="currentColor" opacity="0.5"/>
                  </svg>
                  <p className="text-gray-500">Photos à venir</p>
                  <p className="text-sm text-gray-400">Contactez-nous pour plus d&apos;images</p>
                </div>
              </div>
            </div>

            {/* Onglets */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'overview'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Vue d&apos;ensemble
                  </button>
                  <button
                    onClick={() => setActiveTab('specs')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'specs'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Spécifications
                  </button>
                  <button
                    onClick={() => setActiveTab('contact')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'contact'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Contact
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Informations rapides */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Fuel className="h-6 w-6 mx-auto text-primary-600 mb-2" />
                        <p className="text-sm text-gray-600">Carburant</p>
                        <p className="font-semibold">{vehicle.carburant}</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Settings className="h-6 w-6 mx-auto text-primary-600 mb-2" />
                        <p className="text-sm text-gray-600">Transmission</p>
                        <p className="font-semibold">{vehicle.transmission}</p>
                      </div>
                      {vehicle.caracteristiques.nombrePlaces && (
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <Users className="h-6 w-6 mx-auto text-primary-600 mb-2" />
                          <p className="text-sm text-gray-600">Places</p>
                          <p className="font-semibold">{vehicle.caracteristiques.nombrePlaces}</p>
                        </div>
                      )}
                      {vehicle.caracteristiques.coffre && (
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <Package className="h-6 w-6 mx-auto text-primary-600 mb-2" />
                          <p className="text-sm text-gray-600">Coffre</p>
                          <p className="font-semibold">{vehicle.caracteristiques.coffre}</p>
                        </div>
                      )}
                    </div>

                    {/* Équipements principaux */}
                    {vehicle.caracteristiques.equipements && vehicle.caracteristiques.equipements.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Équipements principaux</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {vehicle.caracteristiques.equipements.slice(0, 6).map((equipement, index) => (
                            <div key={index} className="flex items-center text-gray-600">
                              <Shield className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                              <span>{equipement}</span>
                            </div>
                          ))}
                        </div>
                        {vehicle.caracteristiques.equipements.length > 6 && (
                          <button
                            onClick={() => setActiveTab('specs')}
                            className="mt-4 text-primary-600 hover:text-primary-700 font-medium text-sm"
                          >
                            Voir tous les équipements ({vehicle.caracteristiques.equipements.length})
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'specs' && <VehicleSpecs vehicle={vehicle} />}
                {activeTab === 'contact' && <VehicleContact vehicle={vehicle} />}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informations de contact rapide */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Intéressé par ce véhicule ?</h3>
              <div className="space-y-4">
                <a
                  href={`tel:${COMPANY_INFO.contact.phones[0].replace(/\s/g, '')}`}
                  className="tse-button w-full flex items-center justify-center"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Appeler maintenant
                </a>
                <a
                  href={`mailto:${COMPANY_INFO.contact.email}?subject=Demande d'information - ${vehicle.marque} ${vehicle.modele} ${vehicle.annee}`}
                  className="tse-button-secondary w-full flex items-center justify-center"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Envoyer un email
                </a>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
                <p>📍 {COMPANY_INFO.name}</p>
                <p>📞 {COMPANY_INFO.contact.phones[0]}</p>
                <p>✉️ {COMPANY_INFO.contact.email}</p>
                <p>🌐 {COMPANY_INFO.contact.website}</p>
              </div>
            </div>

            {/* Informations véhicule */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Référence:</span>
                  <span className="font-medium">TSE-{vehicle.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ajouté le:</span>
                  <span className="font-medium">{formatDate(vehicle.dateAjout)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dernière MAJ:</span>
                  <span className="font-medium">{formatDate(vehicle.dateModification)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Statut:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getVehicleStatusColor(vehicle.statut)}`}>
                    {vehicle.statut}
                  </span>
                </div>
              </div>
            </div>

            {/* Garantie et services */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nos services</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Award className="h-4 w-4 text-green-500 mr-2" />
                  <span>Garantie constructeur</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-green-500 mr-2" />
                  <span>Contrôle technique OK</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Settings className="h-4 w-4 text-green-500 mr-2" />
                  <span>Service après-vente</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Zap className="h-4 w-4 text-green-500 mr-2" />
                  <span>Financement disponible</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
