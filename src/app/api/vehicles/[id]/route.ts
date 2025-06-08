import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/vehicles/[id] - Récupérer un véhicule spécifique
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .select(`
        *,
        brand:brands(*),
        model:models(*),
        vehicle_images(*),
        vehicle_documents(*),
        equipments:vehicle_equipments(equipment:equipments(*))
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Véhicule non trouvé' },
          { status: 404 }
        )
      }
      console.error('Erreur Supabase:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération du véhicule' },
        { status: 500 }
      )
    }

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error('Erreur lors de la récupération du véhicule:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du véhicule' },
      { status: 500 }
    )
  }
}

// PUT /api/vehicles/[id] - Mettre à jour un véhicule
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()

    // Supprimer les champs qui ne doivent pas être mis à jour directement
    const { brand, model, vehicle_images, vehicle_documents, equipments, ...updateData } = body

    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .update(updateData)
      .eq('id', id)
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
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Véhicule non trouvé' },
          { status: 404 }
        )
      }
      console.error('Erreur Supabase:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du véhicule' },
        { status: 500 }
      )
    }

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du véhicule:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du véhicule' },
      { status: 500 }
    )
  }
}

// DELETE /api/vehicles/[id] - Supprimer un véhicule
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erreur Supabase:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la suppression du véhicule' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Véhicule supprimé avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression du véhicule:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du véhicule' },
      { status: 500 }
    )
  }
}
