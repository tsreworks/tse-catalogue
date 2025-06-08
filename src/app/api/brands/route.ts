import { NextRequest, NextResponse } from 'next/server'
import DatabaseService from '@/lib/database'
import AuthService from '@/lib/auth-mysql'
import { ValidationService } from '@/lib/validation'

// GET /api/brands - Récupérer toutes les marques
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeModels = searchParams.get('include_models') === 'true'
    const includeStats = searchParams.get('include_stats') === 'true'
    const search = searchParams.get('search') || undefined

    // Récupérer les marques avec le nouveau service
    const brands = await DatabaseService.getBrands({
      includeStats,
      includeModels,
      search
    })

    return NextResponse.json({
      brands,
      total: brands.length
    })

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
    // Vérifier l'authentification
    const authResult = await AuthService.requireRole(request, 'admin')

    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validation des données
    const validation = ValidationService.validateBrand(body)
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: 'Données invalides',
          details: validation.errors
        },
        { status: 400 }
      )
    }

    // Vérifier si la marque existe déjà
    const existingBrand = await DatabaseService.getBrands({ search: body.nom })
    const duplicateBrand = existingBrand.find(brand =>
      brand.nom.toLowerCase() === body.nom.toLowerCase()
    )

    if (duplicateBrand) {
      return NextResponse.json(
        { error: 'Une marque avec ce nom existe déjà' },
        { status: 409 }
      )
    }

    // Créer la marque
    const brand = await DatabaseService.createBrand({
      nom: body.nom,
      description: body.description || null,
      logo: body.logo || null,
      siteWeb: body.siteWeb || body.site_web || null,
      paysOrigine: body.paysOrigine || body.pays_origine || null
    })

    return NextResponse.json(brand, { status: 201 })

  } catch (error) {
    console.error('Erreur lors de la création de la marque:', error)

    if (error instanceof Error && error.message.includes('Duplicate entry')) {
      return NextResponse.json(
        { error: 'Une marque avec ce nom existe déjà' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création de la marque' },
      { status: 500 }
    )
  }
}

// PUT /api/brands - Mise à jour en lot des marques
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { brandIds, updateData } = body

    if (!brandIds || !Array.isArray(brandIds) || brandIds.length === 0) {
      return NextResponse.json(
        { error: 'Liste des marques requise' },
        { status: 400 }
      )
    }

    // Validation des données de mise à jour
    const validation = ValidationService.validateBrand(updateData, true)
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
    const { data: updatedBrands, error } = await supabase
      .from('brands')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .in('id', brandIds)
      .select()

    if (error) {
      console.error('Erreur lors de la mise à jour des marques:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour des marques' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: `${updatedBrands?.length || 0} marque(s) mise(s) à jour`,
      brands: updatedBrands
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour des marques:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// DELETE /api/brands - Suppression en lot des marques
export async function DELETE(request: NextRequest) {
  try {
    // Vérifier l'authentification (seul super_admin peut supprimer)
    const authResult = await AuthService.requireRole(request, 'super_admin')

    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { brandIds } = body

    if (!brandIds || !Array.isArray(brandIds) || brandIds.length === 0) {
      return NextResponse.json(
        { error: 'Liste des marques requise' },
        { status: 400 }
      )
    }

    // Vérifier s'il y a des véhicules associés
    for (const brandId of brandIds) {
      const brand = await DatabaseService.getBrandById(brandId)
      if (brand && brand._count.vehicles > 0) {
        return NextResponse.json(
          {
            error: 'Impossible de supprimer les marques',
            details: [`La marque "${brand.nom}" a ${brand._count.vehicles} véhicule(s) associé(s)`]
          },
          { status: 409 }
        )
      }
    }

    // Supprimer les marques
    const result = await DatabaseService.deleteBrands(brandIds)

    return NextResponse.json({
      message: `${result.count} marque(s) supprimée(s)`,
      deleted: result.count
    })

  } catch (error) {
    console.error('Erreur lors de la suppression des marques:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression des marques' },
      { status: 500 }
    )
  }
}
