import { NextRequest, NextResponse } from 'next/server'
import { getModels, supabase } from '@/lib/supabase'
import { ValidationService } from '@/lib/validation'

// GET /api/models - Récupérer tous les modèles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const brandId = searchParams.get('brand_id') || searchParams.get('brandId')
    const includeBrand = searchParams.get('include_brand') === 'true'
    const includeStats = searchParams.get('include_stats') === 'true'
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = supabase
      .from('models')
      .select(`
        *
        ${includeBrand ? ', brand:brands(*)' : ''}
        ${includeStats ? ', vehicles(id, statut, prix)' : ''}
      `)

    // Filtrer par marque si spécifié
    if (brandId) {
      query = query.eq('brand_id', brandId)
    }

    // Recherche textuelle
    if (search) {
      query = query.ilike('nom', `%${search}%`)
    }

    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    // Ordre alphabétique
    query = query.order('nom')

    const { data: models, error, count } = await query

    if (error) {
      console.error('Erreur Supabase:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des modèles' },
        { status: 500 }
      )
    }

    // Calculer les statistiques si demandées
    let modelsWithStats = models
    if (includeStats && models) {
      modelsWithStats = models.map(model => {
        const vehicles = model.vehicles || []
        const stats = {
          totalVehicles: vehicles.length,
          disponibles: vehicles.filter((v: any) => v.statut === 'Disponible').length,
          vendus: vehicles.filter((v: any) => v.statut === 'Vendu').length,
          valeurTotale: vehicles
            .filter((v: any) => v.prix && v.statut !== 'Vendu')
            .reduce((sum: number, v: any) => sum + (v.prix || 0), 0)
        }

        // Supprimer les véhicules des données retournées pour éviter la redondance
        const { vehicles: _, ...modelWithoutVehicles } = model
        return {
          ...modelWithoutVehicles,
          stats
        }
      })
    }

    return NextResponse.json({
      models: modelsWithStats,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des modèles:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST /api/models - Créer un nouveau modèle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validation des données
    const validation = ValidationService.validateModel(body)
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: 'Données invalides',
          details: validation.errors
        },
        { status: 400 }
      )
    }

    // Vérifier si la marque existe
    const { data: brand, error: brandError } = await supabase
      .from('brands')
      .select('id')
      .eq('id', body.brand_id)
      .single()

    if (brandError || !brand) {
      return NextResponse.json(
        { error: 'Marque non trouvée' },
        { status: 404 }
      )
    }

    // Vérifier si le modèle existe déjà pour cette marque
    const { data: existingModel } = await supabase
      .from('models')
      .select('id')
      .eq('brand_id', body.brand_id)
      .ilike('nom', body.nom)
      .single()

    if (existingModel) {
      return NextResponse.json(
        { error: 'Un modèle avec ce nom existe déjà pour cette marque' },
        { status: 409 }
      )
    }

    // Créer le modèle
    const { data: model, error } = await supabase
      .from('models')
      .insert([{
        nom: body.nom,
        brand_id: body.brand_id,
        description: body.description || null
      }])
      .select(`
        *,
        brand:brands(*)
      `)
      .single()

    if (error) {
      console.error('Erreur lors de la création du modèle:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la création du modèle' },
        { status: 500 }
      )
    }

    return NextResponse.json(model, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du modèle:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// PUT /api/models - Mise à jour en lot des modèles
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { modelIds, updateData } = body

    if (!modelIds || !Array.isArray(modelIds) || modelIds.length === 0) {
      return NextResponse.json(
        { error: 'Liste des modèles requise' },
        { status: 400 }
      )
    }

    // Validation des données de mise à jour
    const validation = ValidationService.validateModel(updateData, true)
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: 'Données de mise à jour invalides',
          details: validation.errors
        },
        { status: 400 }
      )
    }

    // Mise à jour en lot
    const { data: updatedModels, error } = await supabase
      .from('models')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .in('id', modelIds)
      .select(`
        *,
        brand:brands(*)
      `)

    if (error) {
      console.error('Erreur lors de la mise à jour des modèles:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour des modèles' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: `${updatedModels?.length || 0} modèle(s) mis à jour`,
      models: updatedModels
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour des modèles:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// DELETE /api/models - Suppression en lot des modèles
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { modelIds } = body

    if (!modelIds || !Array.isArray(modelIds) || modelIds.length === 0) {
      return NextResponse.json(
        { error: 'Liste des modèles requise' },
        { status: 400 }
      )
    }

    // Vérifier s'il y a des véhicules associés
    const { data: vehiclesCount, error: countError } = await supabase
      .from('vehicles')
      .select('id', { count: 'exact', head: true })
      .in('model_id', modelIds)

    if (countError) {
      console.error('Erreur lors de la vérification des véhicules:', countError)
      return NextResponse.json(
        { error: 'Erreur lors de la vérification des dépendances' },
        { status: 500 }
      )
    }

    if (vehiclesCount && vehiclesCount > 0) {
      return NextResponse.json(
        {
          error: 'Impossible de supprimer les modèles',
          details: [`${vehiclesCount} véhicule(s) sont associés à ces modèles`]
        },
        { status: 409 }
      )
    }

    // Supprimer les modèles
    const { error } = await supabase
      .from('models')
      .delete()
      .in('id', modelIds)

    if (error) {
      console.error('Erreur lors de la suppression des modèles:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la suppression des modèles' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: `${modelIds.length} modèle(s) supprimé(s)`
    })
  } catch (error) {
    console.error('Erreur lors de la suppression des modèles:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
