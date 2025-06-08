// Service de gestion des fichiers avec Supabase Storage
import { supabase } from '@/lib/supabase'

// Types pour les uploads
export interface UploadResult {
  success: boolean
  url?: string
  path?: string
  error?: string
}

export interface FileUploadOptions {
  bucket: 'vehicle-images' | 'vehicle-documents'
  folder?: string
  maxSize?: number // en bytes
  allowedTypes?: string[]
  generateThumbnail?: boolean
}

// Configuration par défaut
const DEFAULT_OPTIONS: Record<string, FileUploadOptions> = {
  'vehicle-images': {
    bucket: 'vehicle-images',
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    generateThumbnail: true
  },
  'vehicle-documents': {
    bucket: 'vehicle-documents',
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  }
}

// Classe principale pour la gestion des fichiers
export class StorageService {
  // Upload d'un fichier
  static async uploadFile(
    file: File,
    options: Partial<FileUploadOptions> = {}
  ): Promise<UploadResult> {
    try {
      // Fusionner avec les options par défaut
      const config = {
        ...DEFAULT_OPTIONS[options.bucket || 'vehicle-images'],
        ...options
      }

      // Validation du fichier
      const validation = this.validateFile(file, config)
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error
        }
      }

      // Générer un nom de fichier unique
      const fileName = this.generateFileName(file, config.folder)

      // Upload vers Supabase Storage
      const { data, error } = await supabase.storage
        .from(config.bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Erreur upload Supabase:', error)
        return {
          success: false,
          error: `Erreur d'upload: ${error.message}`
        }
      }

      // Obtenir l'URL publique
      const { data: urlData } = supabase.storage
        .from(config.bucket)
        .getPublicUrl(fileName)

      return {
        success: true,
        url: urlData.publicUrl,
        path: fileName
      }
    } catch (error) {
      console.error('Erreur upload fichier:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }
    }
  }

  // Upload multiple de fichiers
  static async uploadMultipleFiles(
    files: File[],
    options: Partial<FileUploadOptions> = {}
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = []

    for (const file of files) {
      const result = await this.uploadFile(file, options)
      results.push(result)
    }

    return results
  }

  // Supprimer un fichier
  static async deleteFile(
    bucket: 'vehicle-images' | 'vehicle-documents',
    path: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path])

      if (error) {
        return {
          success: false,
          error: error.message
        }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }
    }
  }

  // Obtenir l'URL publique d'un fichier
  static getPublicUrl(
    bucket: 'vehicle-images' | 'vehicle-documents',
    path: string
  ): string {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    return data.publicUrl
  }

  // Lister les fichiers d'un dossier
  static async listFiles(
    bucket: 'vehicle-images' | 'vehicle-documents',
    folder?: string
  ) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(folder || '', {
          limit: 100,
          offset: 0
        })

      if (error) {
        throw error
      }

      return {
        success: true,
        files: data || []
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        files: []
      }
    }
  }

  // Validation d'un fichier
  private static validateFile(
    file: File,
    options: FileUploadOptions
  ): { valid: boolean; error?: string } {
    // Vérifier la taille
    if (options.maxSize && file.size > options.maxSize) {
      const maxSizeMB = Math.round(options.maxSize / 1024 / 1024)
      return {
        valid: false,
        error: `Le fichier est trop volumineux. Taille maximum: ${maxSizeMB}MB`
      }
    }

    // Vérifier le type MIME
    if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Type de fichier non autorisé. Types acceptés: ${options.allowedTypes.join(', ')}`
      }
    }

    return { valid: true }
  }

  // Générer un nom de fichier unique
  private static generateFileName(file: File, folder?: string): string {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split('.').pop()
    const baseName = file.name.split('.').slice(0, -1).join('.')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .substring(0, 50)

    const fileName = `${baseName}-${timestamp}-${randomString}.${extension}`
    
    return folder ? `${folder}/${fileName}` : fileName
  }

  // Redimensionner une image (côté client)
  static async resizeImage(
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

  // Obtenir les informations d'un fichier
  static async getFileInfo(
    bucket: 'vehicle-images' | 'vehicle-documents',
    path: string
  ) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list('', {
          search: path
        })

      if (error) {
        throw error
      }

      const fileInfo = data?.find(file => file.name === path.split('/').pop())
      
      return {
        success: true,
        info: fileInfo
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }
    }
  }
}

// Utilitaires pour les images
export const ImageUtils = {
  // Vérifier si un fichier est une image
  isImage: (file: File): boolean => {
    return file.type.startsWith('image/')
  },

  // Obtenir les dimensions d'une image
  getDimensions: (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight })
      }
      img.onerror = reject
      img.src = URL.createObjectURL(file)
    })
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

// Export des types et constantes
export { DEFAULT_OPTIONS }
