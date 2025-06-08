import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Fuel, Settings, Download } from 'lucide-react'
import { Vehicle } from '@/types/vehicle'
import { formatPrice, formatKilometrage, getVehicleStatusColor, getCarburantIcon, generateVehicleSlug } from '@/lib/utils'

interface VehicleCardProps {
  vehicle: Vehicle
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const imagePrincipale = vehicle.images.find(img => img.estPrincipale) || vehicle.images[0]
  const vehicleSlug = generateVehicleSlug(vehicle.marque, vehicle.modele, vehicle.annee)

  return (
    <div className="tse-card overflow-hidden">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        {imagePrincipale ? (
          <Image
            src={imagePrincipale.url}
            alt={imagePrincipale.alt}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <svg width="80" height="60" viewBox="0 0 80 60" fill="none" className="text-gray-400">
              <path d="M20 30L24 26H56L60 30V40H56V38H24V40H20V30Z" fill="currentColor"/>
              <circle cx="28" cy="40" r="3" fill="currentColor"/>
              <circle cx="52" cy="40" r="3" fill="currentColor"/>
              <rect x="26" y="28" width="28" height="8" fill="currentColor" opacity="0.5"/>
            </svg>
          </div>
        )}
        
        {/* Statut Badge */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVehicleStatusColor(vehicle.statut)}`}>
            {vehicle.statut}
          </span>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4">
        {/* Titre */}
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {vehicle.marque} {vehicle.modele}
          </h3>
          <p className="text-sm text-gray-600">{vehicle.couleur}</p>
        </div>

        {/* Informations principales */}
        <div className="grid grid-cols-2 gap-2 mb-3 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {vehicle.annee}
          </div>
          <div className="flex items-center">
            <Fuel className="h-4 w-4 mr-1" />
            {vehicle.carburant}
          </div>
          {vehicle.kilometrage && (
            <div className="flex items-center">
              <Settings className="h-4 w-4 mr-1" />
              {formatKilometrage(vehicle.kilometrage)}
            </div>
          )}
          <div className="flex items-center">
            <span className="mr-1">{getCarburantIcon(vehicle.carburant)}</span>
            {vehicle.transmission}
          </div>
        </div>

        {/* Prix */}
        {vehicle.prix && (
          <div className="mb-3">
            <span className="text-xl font-bold text-primary-600">
              {formatPrice(vehicle.prix)}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/catalogue/${vehicleSlug}`}
            className="flex-1 tse-button text-center text-sm py-2"
          >
            Voir détails
          </Link>
          {vehicle.ficheTechnique && (
            <a
              href={vehicle.ficheTechnique}
              target="_blank"
              rel="noopener noreferrer"
              className="tse-button-secondary p-2 flex items-center justify-center"
              title="Télécharger la fiche technique"
            >
              <Download className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
