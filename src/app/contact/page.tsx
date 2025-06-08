'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { COMPANY_INFO, formatPhoneNumber } from '@/config/company'
import Footer from '@/components/Footer'

export default function ContactPage() {
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Pré-remplir le formulaire depuis les paramètres URL
  useEffect(() => {
    const subject = searchParams.get('subject')
    const message = searchParams.get('message')
    
    if (subject || message) {
      setFormData(prev => ({
        ...prev,
        sujet: subject || prev.sujet,
        message: message || prev.message
      }))
    }
  }, [searchParams])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Simuler l'envoi du formulaire
      // Dans un vrai projet, vous enverriez les données à votre API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSubmitStatus('success')
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        sujet: '',
        message: ''
      })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateWhatsAppUrl = () => {
    const message = `Bonjour TSE, je souhaite vous contacter concernant :\n\n${formData.sujet}\n\n${formData.message}\n\nCordialement,\n${formData.prenom} ${formData.nom}`
    return `https://wa.me/225070752524?text=${encodeURIComponent(message)}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold font-heading text-gray-900">
                  Contact
                </h1>
                <p className="text-sm text-gray-600">{COMPANY_INFO.name}</p>
              </div>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-primary-600 font-medium">
                Accueil
              </Link>
              <Link href="/catalogue" className="text-gray-700 hover:text-primary-600 font-medium">
                Catalogue
              </Link>
              <Link href="/contact" className="text-primary-600 font-medium">
                Contact
              </Link>
              <Link href="/admin" className="text-gray-700 hover:text-primary-600 font-medium">
                Administration
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Informations de contact */}
          <div>
            <h2 className="text-3xl font-bold font-heading text-gray-900 mb-6">
              Contactez-nous
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Notre équipe est à votre disposition pour répondre à toutes vos questions 
              concernant nos véhicules et services.
            </p>

            <div className="space-y-6">
              {/* Adresse */}
              <div className="flex items-start space-x-4">
                <MapPin className="h-6 w-6 text-primary-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Adresse</h3>
                  <p className="text-gray-600">
                    {COMPANY_INFO.address.street}<br />
                    {COMPANY_INFO.address.city}, {COMPANY_INFO.address.country}<br />
                    {COMPANY_INFO.address.postalCode}
                  </p>
                </div>
              </div>

              {/* Téléphones */}
              <div className="flex items-start space-x-4">
                <Phone className="h-6 w-6 text-primary-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Téléphone</h3>
                  <div className="space-y-1">
                    {COMPANY_INFO.contact.phones.map((phone, index) => (
                      <p key={index}>
                        <a 
                          href={`tel:${phone.replace(/\s/g, '')}`}
                          className="text-gray-600 hover:text-primary-600"
                        >
                          {formatPhoneNumber(phone)}
                        </a>
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4">
                <Mail className="h-6 w-6 text-primary-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <a 
                    href={`mailto:${COMPANY_INFO.contact.email}`}
                    className="text-gray-600 hover:text-primary-600"
                  >
                    {COMPANY_INFO.contact.email}
                  </a>
                </div>
              </div>

              {/* Horaires */}
              <div className="flex items-start space-x-4">
                <Clock className="h-6 w-6 text-primary-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Horaires d'ouverture</h3>
                  <div className="text-gray-600">
                    <p>Lundi - Vendredi: {COMPANY_INFO.hours.weekdays}</p>
                    <p>Samedi: {COMPANY_INFO.hours.saturday}</p>
                    <p>Dimanche: {COMPANY_INFO.hours.sunday}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact rapide WhatsApp */}
            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-6 w-6 text-green-600" />
                <div>
                  <h4 className="font-semibold text-green-900">Contact rapide</h4>
                  <p className="text-sm text-green-700">
                    Contactez-nous directement via WhatsApp pour une réponse rapide
                  </p>
                </div>
              </div>
              <a
                href={generateWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Ouvrir WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold font-heading text-gray-900 mb-6">
                Envoyez-nous un message
              </h3>

              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800">
                    Merci ! Votre message a été envoyé avec succès. 
                    Nous vous répondrons dans les plus brefs délais.
                  </p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800">
                    Une erreur s'est produite lors de l'envoi de votre message. 
                    Veuillez réessayer ou nous contacter directement par téléphone.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      id="prenom"
                      name="prenom"
                      required
                      value={formData.prenom}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      required
                      value={formData.nom}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    placeholder="+225 XX XX XX XX XX"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="sujet" className="block text-sm font-medium text-gray-700 mb-2">
                    Sujet *
                  </label>
                  <select
                    id="sujet"
                    name="sujet"
                    required
                    value={formData.sujet}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="Demande de cotation">Demande de cotation</option>
                    <option value="Demande d'informations">Demande d'informations</option>
                    <option value="Prise de rendez-vous">Prise de rendez-vous</option>
                    <option value="Service après-vente">Service après-vente</option>
                    <option value="Financement">Financement</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Décrivez votre demande en détail..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Envoyer le message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
