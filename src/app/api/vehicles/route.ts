import { NextRequest, NextResponse } from 'next/server'
import DatabaseService, { VehicleSearchFilters } from '@/lib/database'
import AuthService from '@/lib/auth-mysql'
import { ValidationService } from '@/lib/validation'

// GET /api/vehicles - Récupérer la liste des véhicules avec filtres
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Extraction des paramètres de filtrage
    const filters: VehicleSearchFilters = {
      search: searchParams.get('search') || searchParams.get('recherche') || undefined,
      brand_id: searchParams.get('brand_id') || searchParams.get('marque') || undefined,
      model_id: searchParams.get('model_id') || searchParams.get('modele') || undefined,
      anneeMin: searchParams.get('anneeMin') ? parseInt(searchParams.get('anneeMin')!) : undefined,
      anneeMax: searchParams.get('anneeMax') ? parseInt(searchParams.get('anneeMax')!) : undefined,
      prixMin: searchParams.get('prixMin') ? parseFloat(searchParams.get('prixMin')!) : undefined,
      prixMax: searchParams.get('prixMax') ? parseFloat(searchParams.get('prixMax')!) : undefined,
      carburant: searchParams.get('carburant') || undefined,
      transmission: searchParams.get('transmission') || undefined,
      statut: searchParams.get('statut') || undefined,
      kilometrageMin: searchParams.get('kilometrageMin') ? parseInt(searchParams.get('kilometrageMin')!) : undefined,
      kilometrageMax: searchParams.get('kilometrageMax') ? parseInt(searchParams.get('kilometrageMax')!) : undefined,
    }

    // Paramètres de pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 100) // Max 100

    // Options d'inclusion
    const includeImages = searchParams.get('include_images') === 'true'
    const includeBrand = searchParams.get('include_brand') !== 'false' // true par défaut
    const includeModel = searchParams.get('include_model') !== 'false' // true par défaut
    const includeEquipments = searchParams.get('include_equipments') === 'true'
    const includeDocuments = searchParams.get('include_documents') === 'true'

    // Recherche des véhicules avec le nouveau service
    const result = await DatabaseService.getVehicles(
      filters,
      { page, limit },
      { includeImages, includeBrand, includeModel, includeEquipments, includeDocuments }
    )

    return NextResponse.json({
      vehicles: result.vehicles,
      total: result.pagination.total,
      page: result.pagination.page,
      limit: result.pagination.limit,
      totalPages: result.pagination.totalPages
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des véhicules:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des véhicules' },
      { status: 500 }
    )
  }
}

// POST /api/vehicles - Créer un nouveau véhicule
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const authResult = await AuthService.requireRole(request, 'admin')

    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validation complète des données
    const validation = ValidationService.validateVehicle(body)
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: 'Données invalides',
          details: validation.errors
        },
        { status: 400 }
      )
    }

    // Vérifier que la marque et le modèle existent
    const [brand, model] = await Promise.all([
      DatabaseService.getBrandById(body.brand_id || body.brandId),
      DatabaseService.getModelById(body.model_id || body.modelId)
    ])

    if (!brand) {
      return NextResponse.json(
        { error: 'Marque non trouvée' },
        { status: 400 }
      )
    }

    if (!model) {
      return NextResponse.json(
        { error: 'Modèle non trouvé' },
        { status: 400 }
      )
    }

    if (model.brandId !== (body.brand_id || body.brandId)) {
      return NextResponse.json(
        { error: 'Le modèle ne correspond pas à la marque' },
        { status: 400 }
      )
    }

    // Générer le slug
    const slug = `${brand.nom.toLowerCase().replace(/\s+/g, '-')}-${model.nom.toLowerCase().replace(/\s+/g, '-')}-${body.annee}`

    // Préparer les données pour Prisma
    const vehicleData = {
      brandId: body.brand_id || body.brandId,
      modelId: body.model_id || body.modelId,
      annee: body.annee,
      couleur: body.couleur,
      prix: body.prix ? parseFloat(body.prix) : null,
      kilometrage: body.kilometrage || 0,
      carburant: body.carburant,
      transmission: body.transmission,
      statut: body.statut || 'Disponible',
      description: body.description,
      puissance: body.puissance,
      cylindree: body.cylindree,
      consommation: body.consommation,
      emissionsCo2: body.emissions || body.emissionsCo2,
      nombrePortes: body.nombre_portes || body.nombrePortes,
      nombrePlaces: body.nombre_places || body.nombrePlaces,
      coffre: body.coffre,
      slug,
      featured: body.featured || false
    }

    // Créer le véhicule
    const vehicle = await DatabaseService.createVehicle(vehicleData)

    // Retourner le véhicule créé avec ses relations
    const vehicleWithRelations = await DatabaseService.getVehicleById(vehicle.id)

    return NextResponse.json(vehicleWithRelations, { status: 201 })

  } catch (error) {
    console.error('Erreur lors de la création du véhicule:', error)

    // Gestion des erreurs spécifiques
    if (error instanceof Error) {
      if (error.message.includes('Duplicate entry')) {
        return NextResponse.json(
          { error: 'Un véhicule avec ces caractéristiques existe déjà' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création du véhicule' },
      { status: 500 }
    )
  }
}
