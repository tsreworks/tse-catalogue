'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthService, AuthUser, AuthState } from '@/lib/auth'

// Contexte d'authentification
const AuthContext = createContext<{
  user: AuthUser | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  clearError: () => void
} | null>(null)

// Provider d'authentification
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  })

  // Charger l'utilisateur au démarrage
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await AuthService.getCurrentUser()
        setState(prev => ({ ...prev, user, loading: false }))
      } catch (error) {
        console.error('Erreur chargement utilisateur:', error)
        setState(prev => ({ ...prev, loading: false, error: 'Erreur de chargement' }))
      }
    }

    loadUser()

    // Écouter les changements d'authentification
    const { data: { subscription } } = AuthService.onAuthStateChange((user) => {
      setState(prev => ({ ...prev, user, loading: false }))
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Fonction de connexion
  const signIn = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      await AuthService.signIn({ email, password })
      
      // L'utilisateur sera mis à jour via onAuthStateChange
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion'
      setState(prev => ({ ...prev, loading: false, error: errorMessage }))
      throw error
    }
  }

  // Fonction de déconnexion
  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      await AuthService.signOut()
      setState(prev => ({ ...prev, user: null, loading: false }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de déconnexion'
      setState(prev => ({ ...prev, loading: false, error: errorMessage }))
      throw error
    }
  }

  // Effacer les erreurs
  const clearError = () => {
    setState(prev => ({ ...prev, error: null }))
  }

  const value = {
    user: state.user,
    loading: state.loading,
    error: state.error,
    signIn,
    signOut,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook pour utiliser le contexte d'authentification
export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext doit être utilisé dans un AuthProvider')
  }
  return context
}

// Hook pour vérifier l'authentification
export function useRequireAuth() {
  const { user, loading } = useAuthContext()
  
  useEffect(() => {
    if (!loading && !user) {
      // Rediriger vers la page de connexion
      window.location.href = '/auth/login'
    }
  }, [user, loading])

  return { user, loading }
}

// Hook pour vérifier les permissions
export function useRequirePermission(requiredRole: 'admin' | 'super_admin' = 'admin') {
  const { user, loading } = useAuthContext()
  const [hasPermission, setHasPermission] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const checkPermission = async () => {
      if (loading) return

      if (!user) {
        setHasPermission(false)
        setChecking(false)
        return
      }

      try {
        const permission = await AuthService.hasPermission(requiredRole)
        setHasPermission(permission)
        
        if (!permission) {
          // Rediriger vers une page d'erreur ou d'accès refusé
          window.location.href = '/auth/unauthorized'
        }
      } catch (error) {
        console.error('Erreur vérification permissions:', error)
        setHasPermission(false)
      } finally {
        setChecking(false)
      }
    }

    checkPermission()
  }, [user, loading, requiredRole])

  return { hasPermission, checking }
}
