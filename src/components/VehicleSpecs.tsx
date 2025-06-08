import { Vehicle } from '@/types/vehicle'
import { 
  Zap, 
  Fuel, 
  Gauge, 
  Users, 
  Package, 
  Settings, 
  Leaf, 
  Shield,
  Car,
  Wrench
} from 'lucide-react'

interface VehicleSpecsProps {
  vehicle: Vehicle
}

export default function VehicleSpecs({ vehicle }: VehicleSpecsProps) {
  const { caracteristiques } = vehicle

  const specSections = [
    {
      title: 'Motorisation',
      icon: Zap,
      specs: [
        { label: 'Puissance', value: caracteristiques.puissance, icon: Gauge },
        { label: 'Cylindrée', value: caracteristiques.cylindree, icon: Settings },
        { label: 'Carburant', value: vehicle.carburant, icon: Fuel },
        { label: 'Transmission', value: vehicle.transmission, icon: Wrench },
      ]
    },
    {
      title: 'Performance & Consommation',
      icon: Leaf,
      specs: [
        { label: 'Consommation mixte', value: caracteristiques.consommation, icon: Fuel },
        { label: 'Émissions CO2', value: caracteristiques.emissions, icon: Leaf },
      ]
    },
    {
      title: 'Dimensions & Capacités',
      icon: Car,
      specs: [
        { label: 'Nombre de portes', value: caracteristiques.nombrePortes?.toString(), icon: Car },
        { label: 'Nombre de places', value: caracteristiques.nombrePlaces?.toString(), icon: Users },
        { label: 'Volume coffre', value: caracteristiques.coffre, icon: Package },
      ]
    }
  ]

  return (
    <div className="space-y-8">
      {/* Spécifications techniques */}
      {specSections.map((section, sectionIndex) => {
        const SectionIcon = section.icon
        const validSpecs = section.specs.filter(spec => spec.value)
        
        if (validSpecs.length === 0) return null

        return (
          <div key={sectionIndex}>
            <div className="flex items-center mb-4">
              <div className="bg-primary-100 rounded-lg p-2 mr-3">
                <SectionIcon className="h-5 w-5 text-primary-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">{section.title}</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {validSpecs.map((spec, specIndex) => {
                const SpecIcon = spec.icon
                return (
                  <div key={specIndex} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <SpecIcon className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-600">{spec.label}</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{spec.value}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Équipements complets */}
      {caracteristiques.equipements && caracteristiques.equipements.length > 0 && (
        <div>
          <div className="flex items-center mb-4">
            <div className="bg-primary-100 rounded-lg p-2 mr-3">
              <Shield className="h-5 w-5 text-primary-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">
              Équipements & Options ({caracteristiques.equipements.length})
            </h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {caracteristiques.equipements.map((equipement, index) => (
              <div key={index} className="flex items-center bg-white border border-gray-200 rounded-lg p-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                <span className="text-sm text-gray-700">{equipement}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Informations générales */}
      <div>
        <div className="flex items-center mb-4">
          <div className="bg-primary-100 rounded-lg p-2 mr-3">
            <Car className="h-5 w-5 text-primary-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">Informations Générales</h4>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            <div className="px-4 py-3 flex justify-between">
              <span className="text-sm font-medium text-gray-500">Marque</span>
              <span className="text-sm text-gray-900">{vehicle.marque}</span>
            </div>
            <div className="px-4 py-3 flex justify-between">
              <span className="text-sm font-medium text-gray-500">Modèle</span>
              <span className="text-sm text-gray-900">{vehicle.modele}</span>
            </div>
            <div className="px-4 py-3 flex justify-between">
              <span className="text-sm font-medium text-gray-500">Année</span>
              <span className="text-sm text-gray-900">{vehicle.annee}</span>
            </div>
            <div className="px-4 py-3 flex justify-between">
              <span className="text-sm font-medium text-gray-500">Couleur</span>
              <span className="text-sm text-gray-900">{vehicle.couleur}</span>
            </div>
            {vehicle.kilometrage && (
              <div className="px-4 py-3 flex justify-between">
                <span className="text-sm font-medium text-gray-500">Kilométrage</span>
                <span className="text-sm text-gray-900">{vehicle.kilometrage.toLocaleString('fr-FR')} km</span>
              </div>
            )}
            <div className="px-4 py-3 flex justify-between">
              <span className="text-sm font-medium text-gray-500">Statut</span>
              <span className="text-sm text-gray-900">{vehicle.statut}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Note sur les spécifications */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Shield className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h5 className="text-sm font-medium text-blue-800">
              Informations importantes
            </h5>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Les spécifications peuvent varier selon les options et finitions</li>
                <li>Consommation mesurée selon le cycle WLTP</li>
                <li>Équipements de série selon la version</li>
                <li>Contactez-nous pour plus de détails techniques</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
