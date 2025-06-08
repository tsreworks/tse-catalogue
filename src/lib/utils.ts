import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

export function formatKilometrage(km: number): string {
  return new Intl.NumberFormat('fr-FR').format(km) + ' km'
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

export function generateVehicleSlug(marque: string, modele: string, annee: number): string {
  return slugify(`${marque}-${modele}-${annee}`)
}

export function getVehicleStatusColor(statut: string): string {
  switch (statut) {
    case 'Disponible':
      return 'bg-green-100 text-green-800'
    case 'Vendu':
      return 'bg-red-100 text-red-800'
    case 'Réservé':
      return 'bg-yellow-100 text-yellow-800'
    case 'En maintenance':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function getCarburantIcon(carburant: string): string {
  switch (carburant) {
    case 'Essence':
      return '⛽'
    case 'Diesel':
      return '🛢️'
    case 'Hybride':
      return '🔋'
    case 'Électrique':
      return '⚡'
    default:
      return '🚗'
  }
}

export function findVehicleBySlug(vehicles: any[], slug: string) {
  return vehicles.find(vehicle => {
    const vehicleSlug = generateVehicleSlug(vehicle.marque, vehicle.modele, vehicle.annee)
    return vehicleSlug === slug
  })
}

export function generateMetaTitle(vehicle: any): string {
  return `${vehicle.marque} ${vehicle.modele} ${vehicle.annee} - TSE Catalogue`
}

export function generateMetaDescription(vehicle: any): string {
  const prix = vehicle.prix ? ` - ${formatPrice(vehicle.prix)}` : ''
  const km = vehicle.kilometrage ? ` - ${formatKilometrage(vehicle.kilometrage)}` : ''
  return `${vehicle.marque} ${vehicle.modele} ${vehicle.annee} ${vehicle.couleur}${prix}${km}. ${vehicle.description || 'Véhicule disponible chez Total Service Equipement.'}`
}
