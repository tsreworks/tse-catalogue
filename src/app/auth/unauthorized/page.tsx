import { Metadata } from 'next'
import Link from 'next/link'
import { ShieldX, Home, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Accès Non Autorisé - TSE Catalogue',
  description: 'Accès refusé - Permissions insuffisantes',
  robots: 'noindex, nofollow',
}

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* Icône */}
        <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-100">
          <ShieldX className="h-8 w-8 text-red-600" />
        </div>

        {/* Titre */}
        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Accès Non Autorisé
        </h1>

        {/* Message */}
        <p className="mt-4 text-lg text-gray-600">
          Vous n&apos;avez pas les permissions nécessaires pour accéder à cette page.
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Seuls les administrateurs autorisés peuvent accéder à cette section.
        </p>

        {/* Actions */}
        <div className="mt-8 space-y-4">
          <Link
            href="/auth/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Se connecter avec un autre compte
          </Link>

          <div>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Home className="h-4 w-4 mr-2" />
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-8 p-4 bg-gray-100 rounded-md">
          <p className="text-sm text-gray-600">
            Besoin d&apos;accès ? Contactez votre administrateur système.
          </p>
        </div>
      </div>
    </div>
  )
}
