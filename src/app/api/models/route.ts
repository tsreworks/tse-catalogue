import { NextRequest, NextResponse } from 'next/server'
import { getModels, supabase } from '@/lib/supabase'

// GET /api/models - Récupérer tous les modèles (optionnellement filtrés par marque)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const brandId = searchParams.get('brandId')

    const { data: models, error } = await getModels(brandId || undefined)

    if (error) {
      console.error('Erreur Supabase:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des modèles' },
        { status: 500 }
      )
    }

    return NextResponse.json(models)
  } catch (error) {
    console.error('Erreur lors de la récupération des modèles:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des modèles' },
      { status: 500 }
    )
  }
}

// POST /api/models - Créer un nouveau modèle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation des données requises
    if (!body.nom || !body.brand_id) {
      return NextResponse.json(
        { error: 'Le nom du modèle et l\'ID de la marque sont requis' },
        { status: 400 }
      )
    }

    const { data: model, error } = await supabase
      .from('models')
      .insert([body])
      .select('*, brand:brands(*)')
      .single()

    if (error) {
      if (error.code === '23505') { // Violation de contrainte unique
        return NextResponse.json(
          { error: 'Ce modèle existe déjà pour cette marque' },
          { status: 409 }
        )
      }
      if (error.code === '23503') { // Violation de clé étrangère
        return NextResponse.json(
          { error: 'La marque spécifiée n\'existe pas' },
          { status: 400 }
        )
      }
      console.error('Erreur Supabase:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la création du modèle' },
        { status: 500 }
      )
    }

    return NextResponse.json(model, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du modèle:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du modèle' },
      { status: 500 }
    )
  }
}
