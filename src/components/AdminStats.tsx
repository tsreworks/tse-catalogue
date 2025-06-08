import { Car, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'
import { Vehicle } from '@/types/vehicle'

interface AdminStatsProps {
  vehicles: Vehicle[]
}

export default function AdminStats({ vehicles }: AdminStatsProps) {
  const totalVehicles = vehicles.length
  const disponibles = vehicles.filter(v => v.statut === 'Disponible').length
  const vendus = vehicles.filter(v => v.statut === 'Vendu').length
  const reserves = vehicles.filter(v => v.statut === 'Réservé').length
  const enMaintenance = vehicles.filter(v => v.statut === 'En maintenance').length

  const valeurTotale = vehicles
    .filter(v => v.prix && v.statut !== 'Vendu')
    .reduce((sum, v) => sum + (v.prix || 0), 0)

  const stats = [
    {
      title: 'Total Véhicules',
      value: totalVehicles,
      icon: Car,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Disponibles',
      value: disponibles,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Réservés',
      value: reserves,
      icon: AlertCircle,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Vendus',
      value: vendus,
      icon: TrendingUp,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div key={index} className={`${stat.bgColor} rounded-lg p-6`}>
            <div className="flex items-center">
              <div className={`${stat.color} rounded-md p-3`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-2xl font-semibold ${stat.textColor}`}>
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        )
      })}
      
      {/* Valeur totale du stock */}
      <div className="bg-purple-50 rounded-lg p-6 md:col-span-2 lg:col-span-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Valeur totale du stock disponible</p>
            <p className="text-3xl font-bold text-purple-600">
              {new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR',
              }).format(valeurTotale)}
            </p>
          </div>
          <div className="bg-purple-500 rounded-md p-3">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">En maintenance: </span>
            <span className="font-medium">{enMaintenance}</span>
          </div>
          <div>
            <span className="text-gray-600">Taux de disponibilité: </span>
            <span className="font-medium">
              {totalVehicles > 0 ? Math.round((disponibles / totalVehicles) * 100) : 0}%
            </span>
          </div>
          <div>
            <span className="text-gray-600">Prix moyen: </span>
            <span className="font-medium">
              {disponibles > 0 
                ? new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  }).format(valeurTotale / disponibles)
                : '0 €'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
