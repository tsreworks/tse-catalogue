'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X, ZoomIn, Download, Share2 } from 'lucide-react'
import type { VehicleImageWithMetadata } from '@/lib/vehicle-images-service'

interface VehicleImageGalleryProps {
  vehicleId: string
  images?: VehicleImageWithMetadata[]
  className?: string
  showThumbnails?: boolean
  showControls?: boolean
  autoPlay?: boolean
  autoPlayInterval?: number
}

export default function VehicleImageGallery({
  vehicleId,
  images: initialImages,
  className = '',
  showThumbnails = true,
  showControls = true,
  autoPlay = false,
  autoPlayInterval = 5000
}: VehicleImageGalleryProps) {
  const [images, setImages] = useState<VehicleImageWithMetadata[]>(initialImages || [])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(!initialImages)
  const [error, setError] = useState<string | null>(null)

  // Charger les images si pas fournies en props
  useEffect(() => {
    if (!initialImages) {
      loadImages()
    }
  }, [vehicleId, initialImages])

  // Auto-play
  useEffect(() => {
    if (autoPlay && images.length > 1 && !isModalOpen) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % images.length)
      }, autoPlayInterval)

      return () => clearInterval(interval)
    }
  }, [autoPlay, images.length, isModalOpen, autoPlayInterval])

  const loadImages = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/vehicles/${vehicleId}/images`)
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des images')
      }

      const data = await response.json()
      setImages(data.images || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  const nextImage = () => {
    setCurrentIndex(prev => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length)
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const downloadImage = () => {
    if (images[currentIndex]) {
      const link = document.createElement('a')
      link.href = images[currentIndex].url
      link.download = `vehicle-image-${currentIndex + 1}.jpg`
      link.click()
    }
  }

  const shareImage = async () => {
    if (images[currentIndex] && navigator.share) {
      try {
        await navigator.share({
          title: 'Image du véhicule',
          text: images[currentIndex].alt_text || 'Image du véhicule',
          url: images[currentIndex].url
        })
      } catch (err) {
        // Fallback: copier l'URL
        navigator.clipboard.writeText(images[currentIndex].url)
      }
    }
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 bg-gray-100 rounded-lg ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-64 bg-gray-100 rounded-lg ${className}`}>
        <p className="text-gray-500">Erreur lors du chargement des images</p>
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className={`flex items-center justify-center h-64 bg-gray-100 rounded-lg ${className}`}>
        <p className="text-gray-500">Aucune image disponible</p>
      </div>
    )
  }

  const currentImage = images[currentIndex]

  return (
    <>
      {/* Galerie principale */}
      <div className={`space-y-4 ${className}`}>
        {/* Image principale */}
        <div className="relative group">
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={currentImage.url}
              alt={currentImage.alt_text || 'Image du véhicule'}
              fill
              className="object-cover cursor-pointer transition-transform group-hover:scale-105"
              onClick={openModal}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Overlay avec contrôles */}
            {showControls && images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Indicateur d'image */}
            {images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                {currentIndex + 1} / {images.length}
              </div>
            )}

            {/* Bouton zoom */}
            <button
              onClick={openModal}
              className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Miniatures */}
        {showThumbnails && images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => goToImage(index)}
                className={`
                  relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all
                  ${index === currentIndex 
                    ? 'border-primary-500 ring-2 ring-primary-200' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <Image
                  src={image.url}
                  alt={image.alt_text || `Miniature ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal plein écran */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Image en plein écran */}
            <div className="relative max-w-full max-h-full">
              <Image
                src={currentImage.url}
                alt={currentImage.alt_text || 'Image du véhicule'}
                width={currentImage.largeur || 1920}
                height={currentImage.hauteur || 1080}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Contrôles du modal */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation dans le modal */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Actions du modal */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              <button
                onClick={downloadImage}
                className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                title="Télécharger l'image"
              >
                <Download className="h-5 w-5" />
              </button>
              {navigator.share && (
                <button
                  onClick={shareImage}
                  className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                  title="Partager l'image"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Indicateur dans le modal */}
            {images.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded">
                {currentIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
