import Image from 'next/image'
import Link from 'next/link'
import { Car, Search, Filter, Download, MapPin, Phone, Mail } from 'lucide-react'
import { COMPANY_INFO, formatPrice } from '@/config/company'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Image
                src="/images/logosansfond.png"
                alt="TSE Logo"
                width={60}
                height={60}
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold font-heading text-gray-900">
                  {COMPANY_INFO.name}
                </h1>
                <p className="text-sm text-gray-600">{COMPANY_INFO.slogan}</p>
              </div>
            </div>
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

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold font-heading text-gray-900 mb-6">
              Découvrez Notre
              <span className="block text-primary-600">Catalogue Véhicules</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Découvrez notre sélection de véhicules neufs et d'occasion à Abidjan, Côte d'Ivoire.
              Des prix compétitifs en Francs CFA, un service de qualité et une expertise reconnue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/catalogue" 
                className="tse-button text-lg px-8 py-3 inline-flex items-center"
              >
                <Car className="mr-2 h-5 w-5" />
                Voir le Catalogue
              </Link>
              <Link 
                href="/admin" 
                className="tse-button-secondary text-lg px-8 py-3 inline-flex items-center"
              >
                Administration
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold font-heading text-gray-900 mb-4">
              Fonctionnalités du Catalogue
            </h3>
            <p className="text-lg text-gray-600">
              Un système complet pour gérer et consulter votre inventaire véhicules
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="tse-card p-6 text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6 text-primary-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Recherche Avancée</h4>
              <p className="text-gray-600">
                Trouvez rapidement le véhicule idéal grâce à notre système de recherche intelligent.
              </p>
            </div>
            
            <div className="tse-card p-6 text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Filter className="h-6 w-6 text-primary-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Filtrage Intelligent</h4>
              <p className="text-gray-600">
                Filtrez par marque, modèle, année, couleur et bien plus encore.
              </p>
            </div>
            
            <div className="tse-card p-6 text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Download className="h-6 w-6 text-primary-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Fiches Techniques</h4>
              <p className="text-gray-600">
                Téléchargez les fiches techniques détaillées de chaque véhicule.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer avec informations complètes */}
      <Footer />
    </div>
  )
}
