import { useAuthContext } from '@/contexts/AuthContext'

// Types pour les rôles utilisateur
export type UserRole = 'super_admin' | 'admin' | 'user' | 'guest'

// Hook pour gérer les permissions utilisateur
export function useUserRole() {
  const { user, loading } = useAuthContext()

  // Déterminer le rôle de l'utilisateur
  const getUserRole = (): UserRole => {
    if (!user) return 'guest'
    return user.role as UserRole || 'user'
  }

  // Vérifier si l'utilisateur peut voir les prix
  const canViewPrices = (): boolean => {
    const role = getUserRole()
    return role === 'admin' || role === 'super_admin'
  }

  // Vérifier si l'utilisateur est administrateur
  const isAdmin = (): boolean => {
    const role = getUserRole()
    return role === 'admin' || role === 'super_admin'
  }

  // Vérifier si l'utilisateur est super administrateur
  const isSuperAdmin = (): boolean => {
    const role = getUserRole()
    return role === 'super_admin'
  }

  // Vérifier si l'utilisateur est connecté
  const isAuthenticated = (): boolean => {
    return !!user
  }

  // Vérifier si l'utilisateur est un invité
  const isGuest = (): boolean => {
    return !user
  }

  return {
    user,
    loading,
    role: getUserRole(),
    canViewPrices: canViewPrices(),
    isAdmin: isAdmin(),
    isSuperAdmin: isSuperAdmin(),
    isAuthenticated: isAuthenticated(),
    isGuest: isGuest()
  }
}

// Hook pour les permissions spécifiques
export function usePermissions() {
  const { canViewPrices, isAdmin, isSuperAdmin } = useUserRole()

  return {
    // Permissions de visualisation
    canViewPrices,
    canViewCatalogue: true, // Tout le monde peut voir le catalogue
    canViewVehicleDetails: true, // Tout le monde peut voir les détails
    
    // Permissions d'administration
    canManageVehicles: isAdmin,
    canManageUsers: isSuperAdmin,
    canManageMedia: isAdmin,
    canAccessAdmin: isAdmin,
    
    // Permissions de modification
    canEditVehicles: isAdmin,
    canDeleteVehicles: isAdmin,
    canUploadMedia: isAdmin
  }
}
