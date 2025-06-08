import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Mail, Clock, Globe, CreditCard } from 'lucide-react'
import { COMPANY_INFO, formatPhoneNumber } from '@/config/company'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <Image
                src="/images/logosansfond.png"
                alt="TSE Logo"
                width={50}
                height={50}
                className="h-12 w-auto"
              />
              <div>
                <h3 className="text-xl font-bold font-heading">{COMPANY_INFO.shortName}</h3>
                <p className="text-sm text-gray-400">{COMPANY_INFO.name}</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              {COMPANY_INFO.slogan}
            </p>
            <p className="text-gray-400 text-xs">
              Régime d'imposition: {COMPANY_INFO.legal.regime}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-300">
                  <p>{COMPANY_INFO.address.street}</p>
                  <p>{COMPANY_INFO.address.city}, {COMPANY_INFO.address.country}</p>
                  <p className="text-gray-400">{COMPANY_INFO.address.postalCode}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-300">
                  {COMPANY_INFO.contact.phones.map((phone, index) => (
                    <p key={index}>
                      <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-primary-400">
                        {formatPhoneNumber(phone)}
                      </a>
                    </p>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <a 
                  href={`mailto:${COMPANY_INFO.contact.email}`}
                  className="text-sm text-gray-300 hover:text-primary-400"
                >
                  {COMPANY_INFO.contact.email}
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <a 
                  href={`https://${COMPANY_INFO.contact.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-300 hover:text-primary-400"
                >
                  {COMPANY_INFO.contact.website}
                </a>
              </div>
            </div>
          </div>

          {/* Horaires */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Horaires</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <div className="text-sm text-gray-300">
                  <p>Lun - Ven: {COMPANY_INFO.hours.weekdays}</p>
                  <p>Samedi: {COMPANY_INFO.hours.saturday}</p>
                  <p>Dimanche: {COMPANY_INFO.hours.sunday}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Navigation</h4>
            <div className="space-y-2">
              <Link href="/" className="block text-sm text-gray-300 hover:text-primary-400">
                Accueil
              </Link>
              <Link href="/catalogue" className="block text-sm text-gray-300 hover:text-primary-400">
                Catalogue
              </Link>
              <Link href="/about" className="block text-sm text-gray-300 hover:text-primary-400">
                À propos
              </Link>
              <Link href="/contact" className="block text-sm text-gray-300 hover:text-primary-400">
                Contact
              </Link>
              <Link href="/services" className="block text-sm text-gray-300 hover:text-primary-400">
                Services
              </Link>
            </div>
          </div>
        </div>

        {/* Informations légales */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-sm text-gray-400">
              <p>RCCM: {COMPANY_INFO.legal.rccm}</p>
              <p>CC N°: {COMPANY_INFO.legal.cc}</p>
            </div>
            <div className="text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span>Compte BDU: {COMPANY_INFO.banking.account}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} {COMPANY_INFO.name}. Tous droits réservés.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Développé avec ❤️ pour la Côte d'Ivoire
          </p>
        </div>
      </div>
    </footer>
  )
}
