// Service de gestion des images de véhicules
import { supabase } from '@/lib/supabase'
import { StorageService, ImageUtils } from '@/lib/storage'
import type { Database } from '@/types/database'

type VehicleImage = Database['public']['Tables']['vehicle_images']['Row']
type VehicleImageInsert = Database['public']['Tables']['vehicle_images']['Insert']
type VehicleImageUpdate = Database['public']['Tables']['vehicle_images']['Update']

export interface VehicleImageWithMetadata extends VehicleImage {
  thumbnail?: string
  dimensions?: { width: number; height: number }
}

export interface ImageUploadResult {
  success: boolean
  image?: VehicleImageWithMetadata
  error?: string
}

export interface ImageGalleryData {
  images: VehicleImageWithMetadata[]
  primaryImage?: VehicleImageWithMetadata
  totalCount: number
}

export class VehicleImagesService {
  // Récupérer toutes les images d'un véhicule
  static async getVehicleImages(vehicleId: string): Promise<ImageGalleryData> {
    try {
      const { data: images, error } = await supabase
        .from('vehicle_images')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('ordre')
        .order('created_at')

      if (error) throw error

      const primaryImage = images?.find(img => img.est_principale) || images?.[0]
      
      return {
        images: images || [],
        primaryImage,
        totalCount: images?.length || 0
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des images:', error)
      throw new Error('Impossible de récupérer les images du véhicule')
    }
  }

  // Ajouter une image à un véhicule
  static async addImageToVehicle(
    vehicleId: string,
    file: File,
    options: {
      altText?: string
      isPrimary?: boolean
      order?: number
    } = {}
  ): Promise<ImageUploadResult> {
    try {
      // Vérifier que le véhicule existe
      const { data: vehicle, error: vehicleError } = await supabase
        .from('vehicles')
        .select('id')
        .eq('id', vehicleId)
        .single()

      if (vehicleError || !vehicle) {
        return {
          success: false,
          error: 'Véhicule non trouvé'
        }
      }

      // Redimensionner l'image si nécessaire
      const resizedFile = await StorageService.resizeImage(file, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.85
      })

      // Upload vers Supabase Storage
      const uploadResult = await StorageService.uploadFile(resizedFile, {
        bucket: 'vehicle-images',
        folder: `vehicles/${vehicleId}`
      })

      if (!uploadResult.success) {
        return {
          success: false,
          error: uploadResult.error
        }
      }

      // Obtenir les dimensions de l'image
      const dimensions = await ImageUtils.getDimensions(file)

      // Si c'est l'image principale, désactiver les autres images principales
      if (options.isPrimary) {
        await supabase
          .from('vehicle_images')
          .update({ est_principale: false })
          .eq('vehicle_id', vehicleId)
      }

      // Déterminer l'ordre si non spécifié
      let order = options.order
      if (order === undefined) {
        const { data: lastImage } = await supabase
          .from('vehicle_images')
          .select('ordre')
          .eq('vehicle_id', vehicleId)
          .order('ordre', { ascending: false })
          .limit(1)
          .single()

        order = (lastImage?.ordre || 0) + 1
      }

      // Insérer l'enregistrement de l'image
      const { data: imageRecord, error: insertError } = await supabase
        .from('vehicle_images')
        .insert({
          vehicle_id: vehicleId,
          url: uploadResult.url!,
          alt_text: options.altText || `Image du véhicule`,
          ordre: order,
          est_principale: options.isPrimary || false,
          taille_fichier: file.size,
          largeur: dimensions.width,
          hauteur: dimensions.height
        })
        .select()
        .single()

      if (insertError) {
        // Supprimer le fichier uploadé en cas d'erreur
        await StorageService.deleteFile('vehicle-images', uploadResult.path!)
        throw insertError
      }

      return {
        success: true,
        image: imageRecord as VehicleImageWithMetadata
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'image:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }
    }
  }

  // Upload multiple d'images
  static async addMultipleImages(
    vehicleId: string,
    files: File[],
    options: {
      altTextPrefix?: string
      startOrder?: number
    } = {}
  ): Promise<ImageUploadResult[]> {
    const results: ImageUploadResult[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const result = await this.addImageToVehicle(vehicleId, file, {
        altText: `${options.altTextPrefix || 'Image'} ${i + 1}`,
        order: (options.startOrder || 1) + i,
        isPrimary: i === 0 && results.length === 0 // Première image = principale si aucune autre
      })
      results.push(result)
    }

    return results
  }

  // Mettre à jour une image
  static async updateImage(
    imageId: string,
    updates: {
      altText?: string
      isPrimary?: boolean
      order?: number
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Récupérer l'image actuelle
      const { data: currentImage, error: fetchError } = await supabase
        .from('vehicle_images')
        .select('*')
        .eq('id', imageId)
        .single()

      if (fetchError || !currentImage) {
        return {
          success: false,
          error: 'Image non trouvée'
        }
      }

      // Si on définit comme image principale, désactiver les autres
      if (updates.isPrimary) {
        await supabase
          .from('vehicle_images')
          .update({ est_principale: false })
          .eq('vehicle_id', currentImage.vehicle_id)
          .neq('id', imageId)
      }

      // Mettre à jour l'image
      const updateData: VehicleImageUpdate = {}
      if (updates.altText !== undefined) updateData.alt_text = updates.altText
      if (updates.isPrimary !== undefined) updateData.est_principale = updates.isPrimary
      if (updates.order !== undefined) updateData.ordre = updates.order

      const { error: updateError } = await supabase
        .from('vehicle_images')
        .update(updateData)
        .eq('id', imageId)

      if (updateError) throw updateError

      return { success: true }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'image:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }
    }
  }

  // Supprimer une image
  static async deleteImage(imageId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Récupérer l'image pour obtenir l'URL
      const { data: image, error: fetchError } = await supabase
        .from('vehicle_images')
        .select('*')
        .eq('id', imageId)
        .single()

      if (fetchError || !image) {
        return {
          success: false,
          error: 'Image non trouvée'
        }
      }

      // Extraire le chemin du fichier depuis l'URL
      const url = new URL(image.url)
      const pathParts = url.pathname.split('/')
      const bucket = pathParts[pathParts.indexOf('storage') + 2]
      const filePath = pathParts.slice(pathParts.indexOf('storage') + 3).join('/')

      // Supprimer le fichier du storage
      await StorageService.deleteFile(bucket as 'vehicle-images', filePath)

      // Supprimer l'enregistrement de la base de données
      const { error: deleteError } = await supabase
        .from('vehicle_images')
        .delete()
        .eq('id', imageId)

      if (deleteError) throw deleteError

      // Si c'était l'image principale, définir une nouvelle image principale
      if (image.est_principale) {
        const { data: nextImage } = await supabase
          .from('vehicle_images')
          .select('id')
          .eq('vehicle_id', image.vehicle_id)
          .order('ordre')
          .limit(1)
          .single()

        if (nextImage) {
          await supabase
            .from('vehicle_images')
            .update({ est_principale: true })
            .eq('id', nextImage.id)
        }
      }

      return { success: true }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'image:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }
    }
  }

  // Réorganiser les images (changer l'ordre)
  static async reorderImages(
    vehicleId: string,
    imageOrders: { imageId: string; order: number }[]
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Mettre à jour l'ordre de chaque image
      for (const { imageId, order } of imageOrders) {
        await supabase
          .from('vehicle_images')
          .update({ ordre: order })
          .eq('id', imageId)
          .eq('vehicle_id', vehicleId) // Sécurité supplémentaire
      }

      return { success: true }
    } catch (error) {
      console.error('Erreur lors de la réorganisation des images:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }
    }
  }

  // Définir l'image principale
  static async setPrimaryImage(
    vehicleId: string,
    imageId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Désactiver toutes les images principales du véhicule
      await supabase
        .from('vehicle_images')
        .update({ est_principale: false })
        .eq('vehicle_id', vehicleId)

      // Activer l'image sélectionnée comme principale
      const { error } = await supabase
        .from('vehicle_images')
        .update({ est_principale: true })
        .eq('id', imageId)
        .eq('vehicle_id', vehicleId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Erreur lors de la définition de l\'image principale:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }
    }
  }

  // Obtenir les statistiques des images d'un véhicule
  static async getImageStats(vehicleId: string) {
    try {
      const { data: images, error } = await supabase
        .from('vehicle_images')
        .select('taille_fichier, largeur, hauteur')
        .eq('vehicle_id', vehicleId)

      if (error) throw error

      const totalSize = images?.reduce((sum, img) => sum + (img.taille_fichier || 0), 0) || 0
      const avgDimensions = images?.length ? {
        width: Math.round(images.reduce((sum, img) => sum + (img.largeur || 0), 0) / images.length),
        height: Math.round(images.reduce((sum, img) => sum + (img.hauteur || 0), 0) / images.length)
      } : null

      return {
        count: images?.length || 0,
        totalSize,
        averageDimensions: avgDimensions
      }
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques:', error)
      return {
        count: 0,
        totalSize: 0,
        averageDimensions: null
      }
    }
  }
}
