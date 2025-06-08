import { formatPrice } from '@/config/company'
import ConditionalPriceDisplay from './ConditionalPriceDisplay'

interface PriceDisplayProps {
  price: number
  className?: string
  showCurrency?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  conditional?: boolean // Nouveau prop pour activer l'affichage conditionnel
  vehicleInfo?: {
    marque: string
    modele: string
    annee: number
  }
}

export default function PriceDisplay({
  price,
  className = '',
  showCurrency = true,
  size = 'md',
  conditional = false,
  vehicleInfo
}: PriceDisplayProps) {
  // Si l'affichage conditionnel est activé, utiliser ConditionalPriceDisplay
  if (conditional) {
    return (
      <ConditionalPriceDisplay
        price={price}
        vehicleInfo={vehicleInfo}
        className={className}
        size={size}
      />
    )
  }

  // Affichage normal (pour les admins ou quand conditional=false)
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  const formattedPrice = formatPrice(price)

  return (
    <span className={`font-semibold text-primary-600 ${sizeClasses[size]} ${className}`}>
      {showCurrency ? formattedPrice : price.toLocaleString('fr-CI')}
    </span>
  )
}

// Composant pour afficher une gamme de prix
interface PriceRangeProps {
  minPrice: number
  maxPrice: number
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function PriceRange({ minPrice, maxPrice, className = '', size = 'md' }: PriceRangeProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  return (
    <span className={`font-semibold text-primary-600 ${sizeClasses[size]} ${className}`}>
      {formatPrice(minPrice)} - {formatPrice(maxPrice)}
    </span>
  )
}

// Composant pour afficher un prix avec réduction
interface PriceWithDiscountProps {
  originalPrice: number
  discountedPrice: number
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function PriceWithDiscount({ 
  originalPrice, 
  discountedPrice, 
  className = '', 
  size = 'md' 
}: PriceWithDiscountProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  const discountPercentage = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)

  return (
    <div className={`${className}`}>
      <div className="flex items-center space-x-2">
        <span className={`font-semibold text-primary-600 ${sizeClasses[size]}`}>
          {formatPrice(discountedPrice)}
        </span>
        <span className={`line-through text-gray-500 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          {formatPrice(originalPrice)}
        </span>
        <span className={`bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium`}>
          -{discountPercentage}%
        </span>
      </div>
    </div>
  )
}
