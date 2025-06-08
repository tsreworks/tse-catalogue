'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/contexts/AuthContext'
import { AuthService } from '@/lib/auth'
import { Loader2, Shield } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'super_admin'
  fallback?: React.ReactNode
}

export default function ProtectedRoute({ 
  children, 
  requiredRole = 'admin',
  fallback 
}: ProtectedRouteProps) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuthContext()
  const [hasPermission, setHasPermission] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const checkAccess = async () => {
      try {
        console.log('ProtectedRoute - Debug:', {
          authLoading,
          user: user ? { email: user.email, role: user.role } : null,
          requiredRole
        })

        // Si l'authentification est en cours, attendre
        if (authLoading) {
          console.log('ProtectedRoute - Authentification en cours...')
          return
        }

        // Si pas d'utilisateur, rediriger vers login
        if (!user) {
          console.log('ProtectedRoute - Pas d\'utilisateur, redirection vers login')
          router.push('/auth/login')
          return
        }

        // Vérifier les permissions directement avec l'utilisateur du contexte
        console.log('ProtectedRoute - Vérification des permissions...')
        let permission = false

        if (requiredRole === 'admin') {
          permission = user.role === 'admin' || user.role === 'super_admin'
        } else if (requiredRole === 'super_admin') {
          permission = user.role === 'super_admin'
        }

        console.log('ProtectedRoute - Résultat permission:', permission)
        setHasPermission(permission)

        // Si pas de permission, rediriger vers unauthorized
        if (!permission) {
          console.log('ProtectedRoute - Permission refusée, redirection')
          router.push('/auth/unauthorized')
          return
        }

        console.log('ProtectedRoute - Accès autorisé !')
      } catch (error) {
        console.error('Erreur vérification accès:', error)
        router.push('/auth/login')
      } finally {
        setChecking(false)
      }
    }

    checkAccess()
  }, [user, authLoading, requiredRole, router])

  // Affichage pendant la vérification
  if (authLoading || checking) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100 mb-4">
            <Shield className="h-6 w-6 text-primary-600" />
          </div>
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Vérification des permissions...</p>
        </div>
      </div>
    )
  }

  // Si pas d'utilisateur ou pas de permission, ne rien afficher
  // (la redirection est gérée dans useEffect)
  if (!user || !hasPermission) {
    return null
  }

  // Afficher le contenu protégé
  return <>{children}</>
}

// Composant pour protéger spécifiquement les pages admin
export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="admin">
      {children}
    </ProtectedRoute>
  )
}

// Composant pour protéger les pages super admin
export function SuperAdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="super_admin">
      {children}
    </ProtectedRoute>
  )
}
