import { NextRequest, NextResponse } from 'next/server'
import { supabase, searchVehicles, VehicleFilters } from '@/lib/supabase'

// GET /api/vehicles - Récupérer la liste des véhicules avec filtres
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extraction des paramètres de filtrage
    const filters: VehicleFilters = {
      marque: searchParams.get('marque') || undefined,
      modele: searchParams.get('modele') || undefined,
      anneeMin: searchParams.get('anneeMin') ? parseInt(searchParams.get('anneeMin')!) : undefined,
      anneeMax: searchParams.get('anneeMax') ? parseInt(searchParams.get('anneeMax')!) : undefined,
      prixMin: searchParams.get('prixMin') ? parseFloat(searchParams.get('prixMin')!) : undefined,
      prixMax: searchParams.get('prixMax') ? parseFloat(searchParams.get('prixMax')!) : undefined,
      couleur: searchParams.get('couleur') || undefined,
      carburant: searchParams.get('carburant') || undefined,
      transmission: searchParams.get('transmission') || undefined,
      statut: searchParams.get('statut') || undefined,
      recherche: searchParams.get('recherche') || undefined,
    }

    // Paramètres de pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    // Recherche des véhicules avec gestion d'erreur
    let result
    try {
      result = await searchVehicles(filters, page, limit)
    } catch (error) {
      console.error('Erreur searchVehicles:', error)
      // Fallback vers une requête simple
      const { data: vehicles, error: dbError } = await supabase
        .from('vehicles')
        .select(`
          *,
          brand:brands(*),
          model:models(*),
          vehicle_images(*),
          vehicle_documents(*),
          equipments:vehicle_equipments(equipment:equipments(*))
        `)
        .range((page - 1) * limit, page * limit - 1)
        .order('created_at', { ascending: false })

      if (dbError) throw dbError

      result = {
        vehicles: vehicles || [],
        total: vehicles?.length || 0,
        page,
        limit,
        totalPages: Math.ceil((vehicles?.length || 0) / limit)
      }
    }

    return NextResponse.json(result)
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
    const body = await request.json()
    
    // Validation des données requises
    const requiredFields = ['brand_id', 'model_id', 'annee', 'couleur', 'carburant', 'transmission']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Le champ ${field} est requis` },
          { status: 400 }
        )
      }
    }

    // Insertion du véhicule
    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .insert([body])
      .select(`
        *,
        brand:brands(*),
        model:models(*),
        vehicle_images(*),
        vehicle_documents(*),
        equipments:vehicle_equipments(equipment:equipments(*))
      `)
      .single()

    if (error) {
      console.error('Erreur Supabase:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la création du véhicule' },
        { status: 500 }
      )
    }

    return NextResponse.json(vehicle, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du véhicule:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du véhicule' },
      { status: 500 }
    )
  }
}
