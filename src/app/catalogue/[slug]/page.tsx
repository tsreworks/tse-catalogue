import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import VehicleDetailPage from '@/components/VehicleDetailPage'
import { VehicleDetailService } from '@/services/vehicleDetailService'
import { generateMetaTitle, generateMetaDescription, generateVehicleSlug, findVehicleBySlug } from '@/lib/utils'

interface PageProps {
  params: {
    slug: string
  }
}

// Génération des métadonnées dynamiques
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const result = await VehicleDetailService.getVehicleBySlug(slug)

  if (!result.success || !result.vehicle) {
    return {
      title: 'Véhicule non trouvé - TSE Catalogue',
      description: 'Le véhicule demandé n\'existe pas dans notre catalogue.'
    }
  }

  const vehicle = result.vehicle

  const title = generateMetaTitle(vehicle)
  const description = generateMetaDescription(vehicle)
  
  return {
    title,
    description,
    keywords: `${vehicle.marque}, ${vehicle.modele}, ${vehicle.annee}, ${vehicle.carburant}, véhicule, automobile, TSE, Total Service Equipement`,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'fr_FR',
      siteName: 'TSE Catalogue',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: vehicle.statut === 'Disponible',
      follow: true,
    }
  }
}

// Génération des routes statiques pour le build
export async function generateStaticParams() {
  // Pour l'instant, on retourne un tableau vide
  // Les routes seront générées dynamiquement
  return []
}

export default async function VehicleDetail({ params }: PageProps) {
  const { slug } = await params
  const result = await VehicleDetailService.getVehicleBySlug(slug)

  if (!result.success || !result.vehicle) {
    console.error('Véhicule non trouvé:', result.error)
    notFound()
  }

  return <VehicleDetailPage vehicle={result.vehicle} />
}
