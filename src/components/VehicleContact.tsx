'use client'

import { useState } from 'react'
import { Vehicle } from '@/types/vehicle'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  User, 
  MessageSquare,
  Calendar,
  Car
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { COMPANY_INFO } from '@/config/company'

interface VehicleContactProps {
  vehicle: Vehicle
}

export default function VehicleContact({ vehicle }: VehicleContactProps) {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    message: `Bonjour,\n\nJe suis intéressé(e) par le véhicule ${vehicle.marque} ${vehicle.modele} ${vehicle.annee} (Réf: TSE-${vehicle.id}).\n\nPouvez-vous me contacter pour plus d&apos;informations ?\n\nCordialement,`
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Créer le lien mailto avec les informations
    const subject = `Demande d'information - ${vehicle.marque} ${vehicle.modele} ${vehicle.annee}`
    const body = `Nom: ${formData.nom}\nEmail: ${formData.email}\nTéléphone: ${formData.telephone}\n\nMessage:\n${formData.message}`
    const mailtoLink = `mailto:${COMPANY_INFO.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    
    window.location.href = mailtoLink
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="space-y-8">
      {/* Informations de contact */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Contactez {COMPANY_INFO.name}</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Coordonnées */}
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-primary-100 rounded-lg p-2 mr-4">
                <Phone className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h5 className="font-medium text-gray-900">Téléphone</h5>
                <p className="text-gray-600">{COMPANY_INFO.contact.phones[0]}</p>
                <a
                  href={`tel:${COMPANY_INFO.contact.phones[0].replace(/\s/g, '')}`}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Appeler maintenant
                </a>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-primary-100 rounded-lg p-2 mr-4">
                <Mail className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h5 className="font-medium text-gray-900">Email</h5>
                <p className="text-gray-600">{COMPANY_INFO.contact.email}</p>
                <a
                  href={`mailto:${COMPANY_INFO.contact.email}?subject=Demande d&apos;information - ${vehicle.marque} ${vehicle.modele} ${vehicle.annee}`}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Envoyer un email
                </a>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-primary-100 rounded-lg p-2 mr-4">
                <MapPin className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h5 className="font-medium text-gray-900">Adresse</h5>
                <p className="text-gray-600">
                  {COMPANY_INFO.address.street}<br />
                  {COMPANY_INFO.address.city}, {COMPANY_INFO.address.country}
                </p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(COMPANY_INFO.address.street + ' ' + COMPANY_INFO.address.city)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Voir sur la carte
                </a>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-primary-100 rounded-lg p-2 mr-4">
                <Clock className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h5 className="font-medium text-gray-900">Horaires d&apos;ouverture</h5>
                <div className="text-gray-600 text-sm space-y-1">
                  <p>Lundi - Vendredi: 9h00 - 18h00</p>
                  <p>Samedi: 9h00 - 17h00</p>
                  <p>Dimanche: Fermé</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div>
            <h5 className="font-medium text-gray-900 mb-4">Demande d&apos;information</h5>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    required
                    value={formData.nom}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="06 12 34 56 78"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    placeholder="Votre message..."
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full tse-button flex items-center justify-center"
              >
                <Send className="h-4 w-4 mr-2" />
                Envoyer la demande
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Informations sur le véhicule */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h5 className="font-medium text-gray-900 mb-4 flex items-center">
          <Car className="h-5 w-5 mr-2 text-primary-600" />
          Récapitulatif du véhicule
        </h5>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Véhicule:</span>
            <span className="ml-2 font-medium">{vehicle.marque} {vehicle.modele} {vehicle.annee}</span>
          </div>
          <div>
            <span className="text-gray-600">Référence:</span>
            <span className="ml-2 font-medium">TSE-{vehicle.id}</span>
          </div>
          <div>
            <span className="text-gray-600">Couleur:</span>
            <span className="ml-2 font-medium">{vehicle.couleur}</span>
          </div>
          <div>
            <span className="text-gray-600">Carburant:</span>
            <span className="ml-2 font-medium">{vehicle.carburant}</span>
          </div>
          {vehicle.kilometrage && (
            <div>
              <span className="text-gray-600">Kilométrage:</span>
              <span className="ml-2 font-medium">{vehicle.kilometrage.toLocaleString('fr-FR')} km</span>
            </div>
          )}
          {vehicle.prix && (
            <div>
              <span className="text-gray-600">Prix:</span>
              <span className="ml-2 font-medium text-primary-600">{formatPrice(vehicle.prix)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Services proposés */}
      <div>
        <h5 className="font-medium text-gray-900 mb-4">Nos services</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center p-3 bg-white border border-gray-200 rounded-lg">
            <Calendar className="h-5 w-5 text-green-500 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Essai gratuit</p>
              <p className="text-sm text-gray-600">Prenez rendez-vous</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-white border border-gray-200 rounded-lg">
            <Car className="h-5 w-5 text-green-500 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Reprise véhicule</p>
              <p className="text-sm text-gray-600">Estimation gratuite</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-white border border-gray-200 rounded-lg">
            <Phone className="h-5 w-5 text-green-500 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Financement</p>
              <p className="text-sm text-gray-600">Solutions adaptées</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-white border border-gray-200 rounded-lg">
            <MapPin className="h-5 w-5 text-green-500 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Livraison</p>
              <p className="text-sm text-gray-600">Possible sur demande</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
