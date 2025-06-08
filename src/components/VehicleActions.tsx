'use client'

import { MessageCircle, Phone, Mail, Info, Eye } from 'lucide-react'
import Link from 'next/link'
import { COMPANY_INFO } from '@/config/company'
import { generateVehicleSlug } from '@/lib/utils'

interface Vehicle {
  brands: { nom: string }
  models: { nom: string }
  annee: number
  couleur: string
  carburant: string
  transmission: string
  kilometrage?: number
}

interface VehicleActionsProps {
  vehicle: Vehicle
  variant?: 'full' | 'compact'
  className?: string
  showDetailsLink?: boolean
}

export default function VehicleActions({
  vehicle,
  variant = 'full',
  className = '',
  showDetailsLink = true
}: VehicleActionsProps) {
  
  // Générer le message détaillé pour le contact
  const generateContactMessage = (type: 'info' | 'quote' = 'info') => {
    const baseMessage = type === 'quote' 
      ? 'Bonjour, je souhaite obtenir une cotation pour ce véhicule :'
      : 'Bonjour, je souhaite obtenir plus d\'informations sur ce véhicule :'

    return `${baseMessage}\n\n` +
           `${vehicle.brands.nom} ${vehicle.models.nom} ${vehicle.annee}\n` +
           `Couleur: ${vehicle.couleur}\n` +
           `Carburant: ${vehicle.carburant}\n` +
           `Transmission: ${vehicle.transmission}\n` +
           `Kilométrage: ${vehicle.kilometrage?.toLocaleString() || 'N/A'} km\n\n` +
           `Merci de me contacter avec vos meilleures conditions.`
  }

  // URLs de contact
  const contactUrls = {
    form: `/contact?subject=${encodeURIComponent('Demande d\'informations')}&message=${encodeURIComponent(generateContactMessage('info'))}`,
    quote: `/contact?subject=${encodeURIComponent('Demande de cotation')}&message=${encodeURIComponent(generateContactMessage('quote'))}`,
    whatsapp: `https://wa.me/225070752524?text=${encodeURIComponent(generateContactMessage('quote'))}`,
    phone: `tel:${COMPANY_INFO.contact.phones[0].replace(/\s/g, '')}`,
    email: `mailto:${COMPANY_INFO.contact.email}?subject=${encodeURIComponent(`Demande d'informations - ${vehicle.brands.nom} ${vehicle.models.nom} ${vehicle.annee}`)}&body=${encodeURIComponent(generateContactMessage('info'))}`
  }

  if (variant === 'compact') {
    return (
      <div className={`flex space-x-2 ${className}`}>
        {showDetailsLink ? (
          <Link
            href={`/catalogue/${generateVehicleSlug(vehicle.brands.nom, vehicle.models.nom, vehicle.annee)}`}
            className="flex-1 text-center px-3 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
          >
            Voir détails
          </Link>
        ) : (
          <Link
            href={contactUrls.form}
            className="flex-1 text-center px-3 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
          >
            Plus d'infos
          </Link>
        )}
        <a
          href={contactUrls.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          title="WhatsApp"
        >
          <MessageCircle className="w-4 h-4" />
        </a>
      </div>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Bouton principal - Voir détails */}
      {showDetailsLink && (
        <Link
          href={`/catalogue/${generateVehicleSlug(vehicle.brands.nom, vehicle.models.nom, vehicle.annee)}`}
          className="w-full inline-flex items-center justify-center space-x-2 px-4 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span>Voir détails</span>
        </Link>
      )}

      {/* Bouton secondaire - Plus d'informations */}
      <Link
        href={contactUrls.form}
        className="w-full inline-flex items-center justify-center space-x-2 px-4 py-3 border-2 border-primary-600 text-primary-600 font-medium rounded-lg hover:bg-primary-600 hover:text-white transition-colors"
      >
        <Info className="w-4 h-4" />
        <span>Plus d'informations</span>
      </Link>

      {/* Bouton tertiaire - Demander une cotation */}
      <Link
        href={contactUrls.quote}
        className="w-full inline-flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
      >
        <MessageCircle className="w-4 h-4" />
        <span>Demander une cotation</span>
      </Link>

      {/* Options de contact rapide */}
      <div className="flex space-x-2">
        <a
          href={contactUrls.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center space-x-2 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
          title="WhatsApp"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp</span>
        </a>
        
        <a
          href={contactUrls.phone}
          className="flex-1 inline-flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          title="Appeler"
        >
          <Phone className="w-4 h-4" />
          <span>Appeler</span>
        </a>
        
        <a
          href={contactUrls.email}
          className="flex-1 inline-flex items-center justify-center space-x-2 px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
          title="Email"
        >
          <Mail className="w-4 h-4" />
          <span>Email</span>
        </a>
      </div>

      {/* Note informative */}
      <p className="text-xs text-gray-500 text-center">
        Notre équipe vous répondra dans les plus brefs délais
      </p>
    </div>
  )
}

// Composant pour les actions rapides (dans les listes)
interface QuickActionsProps {
  vehicle: Vehicle
  className?: string
}

export function QuickActions({ vehicle, className = '' }: QuickActionsProps) {
  const whatsappUrl = `https://wa.me/225070752524?text=${encodeURIComponent(
    `Bonjour TSE, je m'intéresse au ${vehicle.brands.nom} ${vehicle.models.nom} ${vehicle.annee}. Pouvez-vous me donner plus d'informations ?`
  )}`

  const contactUrl = `/contact?subject=${encodeURIComponent('Demande d\'informations')}&message=${encodeURIComponent(
    `Bonjour, je souhaite des informations sur le ${vehicle.brands.nom} ${vehicle.models.nom} ${vehicle.annee} (${vehicle.couleur}).`
  )}`

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Link
        href={contactUrl}
        className="text-xs text-primary-600 hover:text-primary-800 font-medium"
      >
        Plus d'infos
      </Link>
      <span className="text-gray-300">•</span>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-green-600 hover:text-green-800 font-medium"
      >
        WhatsApp
      </a>
      <span className="text-gray-300">•</span>
      <a
        href={`tel:${COMPANY_INFO.contact.phones[0].replace(/\s/g, '')}`}
        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
      >
        Appeler
      </a>
    </div>
  )
}
