// Service de storage S3 pour remplacer Supabase Storage
// Compatible avec AWS S3, DigitalOcean Spaces, MinIO, etc.

import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'

export interface UploadOptions {
  folder?: string
  generateUniqueFilename?: boolean
  resize?: {
    maxWidth?: number
    maxHeight?: number
    quality?: number
  }
  allowedTypes?: string[]
  maxSize?: number // en bytes
}

export interface UploadResult {
  success: boolean
  url?: string
  key?: string
  filename?: string
  size?: number
  error?: string
}

export interface FileInfo {
  name: string
  size: number
  type: string
  extension: string
  isImage: boolean
}

/**
 * Service de storage S3 pour TSE Catalogue
 * Remplace Supabase Storage
 */
export class StorageService {
  private static s3Client: S3Client
  private static bucket: string
  private static region: string
  private static baseUrl: string

  /**
   * Initialiser le client S3
   */
  static initialize() {
    this.bucket = process.env.S3_BUCKET_NAME || 'tse-catalogue'
    this.region = process.env.S3_REGION || 'eu-west-1'
    this.baseUrl = process.env.S3_BASE_URL || `https://${this.bucket}.s3.${this.region}.amazonaws.com`

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!
      },
      // Pour MinIO ou autres services compatibles S3
      ...(process.env.S3_ENDPOINT && {
        endpoint: process.env.S3_ENDPOINT,
        forcePathStyle: true
      })
    })
  }

  /**
   * Uploader un fichier
   */
  static async uploadFile(
    file: File | Buffer,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    try {
      if (!this.s3Client) {
        this.initialize()
      }

      const {
        folder = 'uploads',
        generateUniqueFilename = true,
        resize,
        allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
        maxSize = 10 * 1024 * 1024 // 10MB par défaut
      } = options

      let buffer: Buffer
      let filename: string
      let contentType: string
      let size: number

      if (file instanceof File) {
        // Validation du type de fichier
        if (!allowedTypes.includes(file.type)) {
          return {
            success: false,
            error: `Type de fichier non autorisé. Types acceptés: ${allowedTypes.join(', ')}`
          }
        }

        // Validation de la taille
        if (file.size > maxSize) {
          return {
            success: false,
            error: `Fichier trop volumineux. Taille maximale: ${maxSize / 1024 / 1024}MB`
          }
        }

        buffer = Buffer.from(await file.arrayBuffer())
        filename = file.name
        contentType = file.type
        size = file.size
      } else {
        buffer = file
        filename = 'upload'
        contentType = 'application/octet-stream'
        size = buffer.length
      }

      // Générer un nom de fichier unique si demandé
      if (generateUniqueFilename) {
        const extension = filename.split('.').pop() || ''
        const baseName = filename.split('.').slice(0, -1).join('.')
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .substring(0, 30)
        filename = `${baseName}-${uuidv4()}.${extension}`
      }

      // Redimensionner l'image si nécessaire
      if (resize && this.isImageType(contentType)) {
        buffer = await this.resizeImage(buffer, resize)
        size = buffer.length
      }

      // Construire la clé S3
      const key = folder ? `${folder}/${filename}` : filename

      // Uploader vers S3
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        // Rendre le fichier public pour les images
        ACL: contentType.startsWith('image/') ? 'public-read' : 'private'
      })

      await this.s3Client.send(command)

      // Construire l'URL publique
      const url = `${this.baseUrl}/${key}`

      return {
        success: true,
        url,
        key,
        filename,
        size
      }

    } catch (error) {
      console.error('Erreur upload S3:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }
    }
  }

  /**
   * Supprimer un fichier
   */
  static async deleteFile(key: string): Promise<{
    success: boolean
    error?: string
  }> {
    try {
      if (!this.s3Client) {
        this.initialize()
      }

      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key
      })

      await this.s3Client.send(command)

      return { success: true }

    } catch (error) {
      console.error('Erreur suppression S3:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }
    }
  }

  /**
   * Obtenir une URL signée pour un fichier privé
   */
  static async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    if (!this.s3Client) {
      this.initialize()
    }

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key
    })

    return getSignedUrl(this.s3Client, command, { expiresIn })
  }

  /**
   * Obtenir l'URL publique d'un fichier
   */
  static getPublicUrl(key: string): string {
    return `${this.baseUrl}/${key}`
  }

  /**
   * Redimensionner une image
   */
  private static async resizeImage(
    buffer: Buffer,
    options: {
      maxWidth?: number
      maxHeight?: number
      quality?: number
    }
  ): Promise<Buffer> {
    const { maxWidth = 1920, maxHeight = 1080, quality = 85 } = options

    let image = sharp(buffer)

    // Obtenir les métadonnées
    const metadata = await image.metadata()
    
    // Redimensionner si nécessaire
    if (metadata.width && metadata.height) {
      if (metadata.width > maxWidth || metadata.height > maxHeight) {
        image = image.resize(maxWidth, maxHeight, {
          fit: 'inside',
          withoutEnlargement: true
        })
      }
    }

    // Optimiser selon le format
    if (metadata.format === 'jpeg') {
      image = image.jpeg({ quality })
    } else if (metadata.format === 'png') {
      image = image.png({ quality })
    } else if (metadata.format === 'webp') {
      image = image.webp({ quality })
    }

    return image.toBuffer()
  }

  /**
   * Vérifier si un type MIME est une image
   */
  private static isImageType(mimeType: string): boolean {
    return mimeType.startsWith('image/')
  }

  /**
   * Obtenir les informations d'un fichier
   */
  static getFileInfo(file: File): FileInfo {
    const extension = file.name.split('.').pop()?.toLowerCase() || ''
    
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      extension,
      isImage: this.isImageType(file.type)
    }
  }

  /**
   * Valider un fichier
   */
  static validateFile(
    file: File,
    options: {
      allowedTypes?: string[]
      maxSize?: number
      minSize?: number
    } = {}
  ): {
    valid: boolean
    errors: string[]
  } {
    const {
      allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
      maxSize = 10 * 1024 * 1024, // 10MB
      minSize = 1024 // 1KB
    } = options

    const errors: string[] = []

    // Vérifier le type
    if (!allowedTypes.includes(file.type)) {
      errors.push(`Type de fichier non autorisé. Types acceptés: ${allowedTypes.join(', ')}`)
    }

    // Vérifier la taille
    if (file.size > maxSize) {
      errors.push(`Fichier trop volumineux. Taille maximale: ${Math.round(maxSize / 1024 / 1024)}MB`)
    }

    if (file.size < minSize) {
      errors.push(`Fichier trop petit. Taille minimale: ${Math.round(minSize / 1024)}KB`)
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Uploader plusieurs fichiers
   */
  static async uploadMultipleFiles(
    files: File[],
    options: UploadOptions = {}
  ): Promise<{
    success: boolean
    results: UploadResult[]
    errors: string[]
  }> {
    const results: UploadResult[] = []
    const errors: string[] = []

    for (const file of files) {
      const result = await this.uploadFile(file, options)
      results.push(result)
      
      if (!result.success && result.error) {
        errors.push(`${file.name}: ${result.error}`)
      }
    }

    return {
      success: errors.length === 0,
      results,
      errors
    }
  }

  /**
   * Migrer un fichier depuis Supabase
   */
  static async migrateFromSupabase(
    supabaseUrl: string,
    targetFolder: string,
    filename: string
  ): Promise<UploadResult> {
    try {
      // Télécharger depuis Supabase
      const response = await fetch(supabaseUrl)
      
      if (!response.ok) {
        throw new Error(`Erreur téléchargement: ${response.statusText}`)
      }

      const buffer = Buffer.from(await response.arrayBuffer())
      const contentType = response.headers.get('content-type') || 'application/octet-stream'

      // Uploader vers S3
      const key = `${targetFolder}/${filename}`
      
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        ACL: contentType.startsWith('image/') ? 'public-read' : 'private'
      })

      await this.s3Client.send(command)

      const url = `${this.baseUrl}/${key}`

      return {
        success: true,
        url,
        key,
        filename,
        size: buffer.length
      }

    } catch (error) {
      console.error('Erreur migration Supabase:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }
    }
  }
}

/**
 * Utilitaires pour les images
 */
export class ImageUtils {
  /**
   * Obtenir les dimensions d'une image
   */
  static async getDimensions(file: File): Promise<{
    width: number
    height: number
  }> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        })
      }
      
      img.onerror = () => {
        reject(new Error('Erreur lors du chargement de l\'image'))
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  /**
   * Valider les dimensions d'une image
   */
  static async validateImageDimensions(
    file: File,
    options: {
      minWidth?: number
      minHeight?: number
      maxWidth?: number
      maxHeight?: number
      aspectRatio?: number
    }
  ): Promise<{
    valid: boolean
    errors: string[]
    dimensions?: { width: number; height: number }
  }> {
    try {
      const dimensions = await this.getDimensions(file)
      const errors: string[] = []

      const { minWidth, minHeight, maxWidth, maxHeight, aspectRatio } = options

      if (minWidth && dimensions.width < minWidth) {
        errors.push(`Largeur minimale: ${minWidth}px (actuelle: ${dimensions.width}px)`)
      }

      if (minHeight && dimensions.height < minHeight) {
        errors.push(`Hauteur minimale: ${minHeight}px (actuelle: ${dimensions.height}px)`)
      }

      if (maxWidth && dimensions.width > maxWidth) {
        errors.push(`Largeur maximale: ${maxWidth}px (actuelle: ${dimensions.width}px)`)
      }

      if (maxHeight && dimensions.height > maxHeight) {
        errors.push(`Hauteur maximale: ${maxHeight}px (actuelle: ${dimensions.height}px)`)
      }

      if (aspectRatio) {
        const currentRatio = dimensions.width / dimensions.height
        const tolerance = 0.1
        
        if (Math.abs(currentRatio - aspectRatio) > tolerance) {
          errors.push(`Ratio d'aspect requis: ${aspectRatio} (actuel: ${currentRatio.toFixed(2)})`)
        }
      }

      return {
        valid: errors.length === 0,
        errors,
        dimensions
      }

    } catch (error) {
      return {
        valid: false,
        errors: ['Impossible de lire les dimensions de l\'image']
      }
    }
  }
}

export default StorageService
