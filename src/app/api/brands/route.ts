import { NextRequest, NextResponse } from 'next/server'
import { getBrands, supabase } from '@/lib/supabase'

// GET /api/brands - Récupérer toutes les marques
export async function GET() {
  try {
    const { data: brands, error } = await getBrands()

    if (error) {
      console.error('Erreur Supabase:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des marques' },
        { status: 500 }
      )
    }

    return NextResponse.json(brands)
  } catch (error) {
    console.error('Erreur lors de la récupération des marques:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des marques' },
      { status: 500 }
    )
  }
}

// POST /api/brands - Créer une nouvelle marque
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation des données requises
    if (!body.nom) {
      return NextResponse.json(
        { error: 'Le nom de la marque est requis' },
        { status: 400 }
      )
    }

    const { data: brand, error } = await supabase
      .from('brands')
      .insert([body])
      .select()
      .single()

    if (error) {
      if (error.code === '23505') { // Violation de contrainte unique
        return NextResponse.json(
          { error: 'Cette marque existe déjà' },
          { status: 409 }
        )
      }
      console.error('Erreur Supabase:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la création de la marque' },
        { status: 500 }
      )
    }

    return NextResponse.json(brand, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de la marque:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la marque' },
      { status: 500 }
    )
  }
}
