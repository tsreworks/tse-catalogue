import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Search, Home } from 'lucide-react'

export default function VehicleNotFound() {
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
                  TSE Catalogue
                </h1>
                <p className="text-sm text-gray-600">Véhicule non trouvé</p>
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

      {/* Contenu 404 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Icône d'erreur */}
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-8">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
            </svg>
          </div>

          {/* Titre et message */}
          <h1 className="text-4xl font-bold font-heading text-gray-900 mb-4">
            Véhicule non trouvé
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Désolé, le véhicule que vous recherchez n&apos;existe pas ou n&apos;est plus disponible dans notre catalogue.
          </p>

          {/* Suggestions */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8 text-left max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Que pouvez-vous faire ?
            </h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                Vérifiez l&apos;URL pour vous assurer qu&apos;elle est correcte
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                Le véhicule a peut-être été vendu ou retiré du catalogue
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                Utilisez notre système de recherche pour trouver des véhicules similaires
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                Contactez notre équipe pour plus d&apos;informations
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/catalogue" 
              className="tse-button text-lg px-8 py-3 inline-flex items-center justify-center"
            >
              <Search className="mr-2 h-5 w-5" />
              Parcourir le catalogue
            </Link>
            <Link 
              href="/" 
              className="tse-button-secondary text-lg px-8 py-3 inline-flex items-center justify-center"
            >
              <Home className="mr-2 h-5 w-5" />
              Retour à l&apos;accueil
            </Link>
          </div>

          {/* Lien de retour */}
          <div className="mt-8">
            <Link 
              href="/catalogue" 
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au catalogue
            </Link>
          </div>
        </div>
      </div>

      {/* Footer simplifié */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Image
                src="/images/logosansfond.png"
                alt="TSE Logo"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
              <div>
                <h5 className="font-semibold">Total Service Equipement</h5>
                <p className="text-sm text-gray-400">Votre partenaire véhicules</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-400">
                © 2025 Total Service Equipement. Tous droits réservés.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
