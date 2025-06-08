// Service d'upload simplifié pour Supabase Storage
import { supabase } from '@/lib/supabase'

// Types pour les résultats d'upload
export interface UploadResult {
  success: boolean
  url?: string
  path?: string
  error?: string
  fileName?: string
}

// Configuration des buckets
const BUCKETS = {
  images: 'vehicle-images',
  documents: 'vehicle-documents'
} as const

// Types MIME autorisés
const ALLOWED_TYPES = {
  images: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
} as const

// Limites de taille (en bytes)
const SIZE_LIMITS = {
  images: 10 * 1024 * 1024, // 10MB
  documents: 50 * 1024 * 1024 // 50MB
} as const

export class UploadService {
  // Upload d'un fichier vers Supabase Storage
  static async uploadFile(
    file: File, 
    type: 'images' | 'documents',
    folder: string = 'uploads'
  ): Promise<UploadResult> {
    try {
      console.log('🔄 Début upload:', file.name, 'Type:', type)

      // Validation du fichier
      const validation = this.validateFile(file, type)
      if (!validation.valid) {
        console.error('❌ Validation échouée:', validation.error)
        return {
          success: false,
          error: validation.error
        }
      }

      // Générer un nom de fichier unique
      const fileName = this.generateFileName(file, folder)
      console.log('📝 Nom de fichier généré:', fileName)

      // Redimensionner l'image si nécessaire
      let fileToUpload = file
      if (type === 'images') {
        try {
          fileToUpload = await this.resizeImage(file)
          console.log('🖼️ Image redimensionnée:', fileToUpload.size, 'bytes')
        } catch (error) {
          console.warn('⚠️ Redimensionnement échoué, utilisation du fichier original:', error)
        }
      }

      // Upload vers Supabase Storage
      console.log('☁️ Upload vers Supabase Storage...')
      const { data, error } = await supabase.storage
        .from(BUCKETS[type])
        .upload(fileName, fileToUpload, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('❌ Erreur Supabase Storage:', error)
        return {
          success: false,
          error: `Erreur d'upload: ${error.message}`
        }
      }

      // Obtenir l'URL publique
      const { data: urlData } = supabase.storage
        .from(BUCKETS[type])
        .getPublicUrl(fileName)

      console.log('✅ Upload réussi:', urlData.publicUrl)

      return {
        success: true,
        url: urlData.publicUrl,
        path: fileName,
        fileName: file.name
      }

    } catch (error) {
      console.error('❌ Erreur upload:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }
    }
  }

  // Upload multiple de fichiers
  static async uploadMultipleFiles(
    files: File[],
    type: 'images' | 'documents',
    folder: string = 'uploads'
  ): Promise<UploadResult[]> {
    console.log('🔄 Upload multiple:', files.length, 'fichiers')
    
    const results: UploadResult[] = []
    
    for (const file of files) {
      const result = await this.uploadFile(file, type, folder)
      results.push(result)
      
      // Petite pause entre les uploads pour éviter la surcharge
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    const successCount = results.filter(r => r.success).length
    console.log(`✅ Upload multiple terminé: ${successCount}/${files.length} réussis`)
    
    return results
  }

  // Validation d'un fichier
  private static validateFile(file: File, type: 'images' | 'documents'): { valid: boolean; error?: string } {
    // Vérifier la taille
    const maxSize = SIZE_LIMITS[type]
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / 1024 / 1024)
      return {
        valid: false,
        error: `Fichier trop volumineux. Taille maximum: ${maxSizeMB}MB`
      }
    }

    // Vérifier le type MIME
    const allowedTypes = ALLOWED_TYPES[type]
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Type de fichier non autorisé. Types acceptés: ${allowedTypes.join(', ')}`
      }
    }

    return { valid: true }
  }

  // Générer un nom de fichier unique
  private static generateFileName(file: File, folder: string): string {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split('.').pop()
    const baseName = file.name.split('.').slice(0, -1).join('.')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .substring(0, 30)

    const fileName = `${baseName}-${timestamp}-${randomString}.${extension}`
    
    return `${folder}/${fileName}`
  }

  // Redimensionner une image (côté client)
  private static async resizeImage(
    file: File,
    maxWidth: number = 1920,
    maxHeight: number = 1080,
    quality: number = 0.8
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // Calculer les nouvelles dimensions
        let { width, height } = img
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }

        // Redimensionner
        canvas.width = width
        canvas.height = height
        ctx?.drawImage(img, 0, 0, width, height)

        // Convertir en blob puis en file
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              })
              resolve(resizedFile)
            } else {
              reject(new Error('Erreur lors du redimensionnement'))
            }
          },
          file.type,
          quality
        )
      }

      img.onerror = () => reject(new Error('Erreur lors du chargement de l\'image'))
      img.src = URL.createObjectURL(file)
    })
  }

  // Supprimer un fichier
  static async deleteFile(
    type: 'images' | 'documents',
    path: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🗑️ Suppression fichier:', path)
      
      const { error } = await supabase.storage
        .from(BUCKETS[type])
        .remove([path])

      if (error) {
        console.error('❌ Erreur suppression:', error)
        return {
          success: false,
          error: error.message
        }
      }

      console.log('✅ Fichier supprimé avec succès')
      return { success: true }
      
    } catch (error) {
      console.error('❌ Erreur suppression:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }
    }
  }

  // Lister les fichiers d'un bucket
  static async listFiles(type: 'images' | 'documents', folder?: string) {
    try {
      console.log('📋 Liste des fichiers:', type, folder || 'root')
      
      const { data, error } = await supabase.storage
        .from(BUCKETS[type])
        .list(folder || '', {
          limit: 100,
          offset: 0
        })

      if (error) {
        console.error('❌ Erreur liste fichiers:', error)
        return {
          success: false,
          error: error.message,
          files: []
        }
      }

      console.log('✅ Fichiers récupérés:', data?.length || 0)
      return {
        success: true,
        files: data || []
      }
      
    } catch (error) {
      console.error('❌ Erreur liste fichiers:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        files: []
      }
    }
  }

  // Obtenir l'URL publique d'un fichier
  static getPublicUrl(type: 'images' | 'documents', path: string): string {
    const { data } = supabase.storage
      .from(BUCKETS[type])
      .getPublicUrl(path)

    return data.publicUrl
  }
}

// Utilitaires pour les images
export const ImageUtils = {
  // Vérifier si un fichier est une image
  isImage: (file: File): boolean => {
    return file.type.startsWith('image/')
  },

  // Générer une miniature
  generateThumbnail: async (file: File, size: number = 200): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        canvas.width = size
        canvas.height = size
        
        // Calculer le crop centré
        const { width, height } = img
        const minDim = Math.min(width, height)
        const x = (width - minDim) / 2
        const y = (height - minDim) / 2
        
        ctx?.drawImage(img, x, y, minDim, minDim, 0, 0, size, size)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }

      img.onerror = reject
      img.src = URL.createObjectURL(file)
    })
  }
}
