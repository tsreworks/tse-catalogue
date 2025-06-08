'use client'

import { useUserRole } from '@/hooks/useUserRole'
import { formatPrice } from '@/config/company'
import { MessageCircle, Phone, Mail } from 'lucide-react'
import Link from 'next/link'

interface ConditionalPriceDisplayProps {
  price: number
  vehicleInfo?: {
    marque: string
    modele: string
    annee: number
  }
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showQuoteButton?: boolean
  forceHidePrice?: boolean // Nouvelle option pour forcer le masquage
}

export default function ConditionalPriceDisplay({
  price,
  vehicleInfo,
  className = '',
  size = 'md',
  showQuoteButton = true,
  forceHidePrice = false
}: ConditionalPriceDisplayProps) {
  const { canViewPrices, isGuest, isAdmin } = useUserRole()

  // Stratégie commerciale stricte : masquer les prix pour tous sauf admin dans le catalogue public
  const shouldShowPrice = canViewPrices && !forceHidePrice && isAdmin

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  const buttonSizeClasses = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  }

  // STRATÉGIE COMMERCIALE : Afficher les prix UNIQUEMENT pour les administrateurs
  if (shouldShowPrice) {
    return (
      <div className={`${className}`}>
        <span className={`font-semibold text-primary-600 ${sizeClasses[size]}`}>
          {formatPrice(price)}
        </span>
        <p className="text-xs text-gray-500 mt-1">
          Prix visible - Mode Administrateur
        </p>
      </div>
    )
  }

  // STRATÉGIE COMMERCIALE : Message épuré pour encourager la consultation des détails
  if (showQuoteButton) {
    return (
      <div className={`${className}`}>
        <div className={`text-center ${sizeClasses[size]}`}>
          <span className="font-medium text-primary-600">
            💰 Prix sur demande
          </span>
          <p className="text-xs text-gray-600 mt-1">
            Voir les détails pour plus d'informations
          </p>
        </div>
      </div>
    )
  }

  // Affichage minimal épuré
  return (
    <div className={`${className}`}>
      <span className={`font-medium text-gray-600 ${sizeClasses[size]}`}>
        Prix sur demande
      </span>
    </div>
  )
}

// Composant pour le bouton de demande de cotation
interface QuoteButtonProps {
  vehicleInfo?: {
    marque: string
    modele: string
    annee: number
  }
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  variant?: 'primary' | 'secondary' | 'outline'
}

export function QuoteButton({ 
  vehicleInfo, 
  size = 'md', 
  className = '',
  variant = 'primary'
}: QuoteButtonProps) {
  // Construire le message pré-rempli pour le formulaire de contact
  const getQuoteMessage = () => {
    if (vehicleInfo) {
      return `Bonjour, je souhaite obtenir une cotation pour le véhicule suivant :\n\nMarque: ${vehicleInfo.marque}\nModèle: ${vehicleInfo.modele}\nAnnée: ${vehicleInfo.annee}\n\nMerci de me contacter avec vos meilleures conditions.`
    }
    return 'Bonjour, je souhaite obtenir une cotation pour un véhicule. Merci de me contacter.'
  }

  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white'
  }

  const iconSize = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  }

  return (
    <div className="space-y-2">
      {/* Bouton principal de cotation */}
      <Link
        href={`/contact?subject=Demande de cotation&message=${encodeURIComponent(getQuoteMessage())}`}
        className={`
          inline-flex items-center justify-center space-x-2 
          ${variantClasses[variant]}
          ${className}
          rounded-lg font-medium transition-colors duration-200
          hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        `}
      >
        <MessageCircle className={iconSize[size]} />
        <span>Demander une Cotation</span>
      </Link>

      {/* Options de contact rapide */}
      <div className="flex items-center space-x-3 text-xs text-gray-600">
        <span>Ou contactez-nous :</span>
        <a 
          href="tel:+225070752524" 
          className="flex items-center space-x-1 hover:text-primary-600 transition-colors"
        >
          <Phone className="w-3 h-3" />
          <span>Appel</span>
        </a>
        <a 
          href="mailto:infostse747@gmail.com" 
          className="flex items-center space-x-1 hover:text-primary-600 transition-colors"
        >
          <Mail className="w-3 h-3" />
          <span>Email</span>
        </a>
      </div>
    </div>
  )
}

// Composant pour afficher une gamme de prix conditionnelle
interface ConditionalPriceRangeProps {
  minPrice: number
  maxPrice: number
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function ConditionalPriceRange({ 
  minPrice, 
  maxPrice, 
  className = '', 
  size = 'md' 
}: ConditionalPriceRangeProps) {
  const { canViewPrices } = useUserRole()

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  if (canViewPrices) {
    return (
      <span className={`font-semibold text-primary-600 ${sizeClasses[size]} ${className}`}>
        {formatPrice(minPrice)} - {formatPrice(maxPrice)}
      </span>
    )
  }

  return (
    <div className={className}>
      <span className={`font-medium text-gray-600 ${sizeClasses[size]}`}>
        Prix sur demande
      </span>
      <div className="mt-2">
        <QuoteButton size={size} variant="outline" className="text-xs px-3 py-1" />
      </div>
    </div>
  )
}

// Hook pour les actions de cotation
export function useQuoteActions() {
  const generateQuoteUrl = (vehicleInfo?: {
    marque: string
    modele: string
    annee: number
    couleur?: string
  }) => {
    const message = vehicleInfo 
      ? `Bonjour, je souhaite obtenir une cotation pour :\n\n${vehicleInfo.marque} ${vehicleInfo.modele} ${vehicleInfo.annee}${vehicleInfo.couleur ? ` (${vehicleInfo.couleur})` : ''}\n\nMerci de me contacter.`
      : 'Bonjour, je souhaite obtenir une cotation. Merci de me contacter.'

    return `/contact?subject=Demande de cotation&message=${encodeURIComponent(message)}`
  }

  const generateWhatsAppUrl = (vehicleInfo?: {
    marque: string
    modele: string
    annee: number
  }) => {
    const message = vehicleInfo 
      ? `Bonjour TSE, je souhaite une cotation pour ${vehicleInfo.marque} ${vehicleInfo.modele} ${vehicleInfo.annee}`
      : 'Bonjour TSE, je souhaite obtenir une cotation'

    return `https://wa.me/225070752524?text=${encodeURIComponent(message)}`
  }

  return {
    generateQuoteUrl,
    generateWhatsAppUrl
  }
}
