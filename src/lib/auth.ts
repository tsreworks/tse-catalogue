// Configuration et utilitaires d'authentification Supabase
import { supabase } from '@/lib/supabase'

// Utiliser le client Supabase centralisé
export const supabaseAuth = supabase

// Types pour l'authentification
export interface AuthUser {
  id: string
  email: string
  nom?: string
  prenom?: string
  role?: 'admin' | 'super_admin'
  actif?: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthState {
  user: AuthUser | null
  loading: boolean
  error: string | null
}

// Classe pour gérer l'authentification
export class AuthService {
  // Connexion avec email/mot de passe
  static async signIn(credentials: LoginCredentials) {
    try {
      const { data, error } = await supabaseAuth.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (error) {
        throw new Error(error.message)
      }

      // Vérifier que l'utilisateur est un admin
      if (data.user) {
        const adminUser = await this.getAdminUser(data.user.email!)
        if (!adminUser) {
          await this.signOut()
          throw new Error('Accès non autorisé. Seuls les administrateurs peuvent se connecter.')
        }
        
        if (!adminUser.actif) {
          await this.signOut()
          throw new Error('Compte administrateur désactivé.')
        }

        // Mettre à jour la dernière connexion
        await this.updateLastLogin(data.user.email!)
      }

      return { user: data.user, session: data.session }
    } catch (error) {
      console.error('Erreur de connexion:', error)
      throw error
    }
  }

  // Déconnexion
  static async signOut() {
    try {
      const { error } = await supabaseAuth.auth.signOut()
      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      console.error('Erreur de déconnexion:', error)
      throw error
    }
  }

  // Récupérer l'utilisateur actuel
  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabaseAuth.auth.getUser()
      
      if (!user) {
        return null
      }

      const adminUser = await this.getAdminUser(user.email!)
      if (!adminUser) {
        return null
      }

      return {
        id: user.id,
        email: user.email!,
        nom: adminUser.nom,
        prenom: adminUser.prenom,
        role: adminUser.role,
        actif: adminUser.actif
      }
    } catch (error) {
      console.error('Erreur récupération utilisateur:', error)
      return null
    }
  }

  // Récupérer les données admin depuis la base
  static async getAdminUser(email: string) {
    try {
      // Utiliser la fonction RPC pour contourner les politiques RLS
      const { data, error } = await supabaseAuth.rpc('check_admin_access', {
        user_email: email
      })

      if (error) {
        console.error('Erreur récupération admin:', error)
        return null
      }

      // Vérifier si l'utilisateur est admin
      if (data && data.is_admin) {
        return {
          id: data.id,
          email: email,
          nom: data.nom,
          prenom: data.prenom,
          role: data.role,
          actif: true
        }
      }

      return null
    } catch (error) {
      console.error('Erreur getAdminUser:', error)
      return null
    }
  }

  // Mettre à jour la dernière connexion
  static async updateLastLogin(email: string) {
    try {
      await supabaseAuth.rpc('update_admin_last_login', {
        user_email: email
      })
    } catch (error) {
      console.error('Erreur mise à jour dernière connexion:', error)
    }
  }

  // Vérifier si l'utilisateur est connecté
  static async isAuthenticated(): Promise<boolean> {
    try {
      const { data: { session } } = await supabaseAuth.auth.getSession()
      return !!session
    } catch (error) {
      return false
    }
  }

  // Vérifier les permissions
  static async hasPermission(requiredRole: 'admin' | 'super_admin' = 'admin'): Promise<boolean> {
    try {
      const user = await this.getCurrentUser()
      if (!user || !user.actif) {
        return false
      }

      if (requiredRole === 'admin') {
        return user.role === 'admin' || user.role === 'super_admin'
      }

      return user.role === 'super_admin'
    } catch (error) {
      return false
    }
  }

  // Écouter les changements d'authentification
  static onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabaseAuth.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const user = await this.getCurrentUser()
        callback(user)
      } else if (event === 'SIGNED_OUT') {
        callback(null)
      }
    })
  }

  // Réinitialisation de mot de passe
  static async resetPassword(email: string) {
    try {
      const { error } = await supabaseAuth.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      console.error('Erreur réinitialisation mot de passe:', error)
      throw error
    }
  }

  // Changer le mot de passe
  static async updatePassword(newPassword: string) {
    try {
      const { error } = await supabaseAuth.auth.updateUser({
        password: newPassword
      })

      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      console.error('Erreur changement mot de passe:', error)
      throw error
    }
  }
}

// Hook React pour l'authentification
export const useAuth = () => {
  return {
    signIn: AuthService.signIn,
    signOut: AuthService.signOut,
    getCurrentUser: AuthService.getCurrentUser,
    isAuthenticated: AuthService.isAuthenticated,
    hasPermission: AuthService.hasPermission,
    resetPassword: AuthService.resetPassword,
    updatePassword: AuthService.updatePassword,
  }
}
