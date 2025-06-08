// Service d'authentification MySQL avec JWT
// Remplace src/lib/auth.ts

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import DatabaseService from './database'
import type { AdminUser } from '@prisma/client'

export interface AuthUser {
  id: string
  email: string
  nom?: string | null
  prenom?: string | null
  role: 'admin' | 'super_admin'
  actif: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  nom?: string
  prenom?: string
  role?: 'admin' | 'super_admin'
}

export interface AuthState {
  user: AuthUser | null
  loading: boolean
  error: string | null
}

/**
 * Service d'authentification personnalisé pour TSE
 * Remplace Supabase Auth avec JWT et bcrypt
 */
export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
  private static readonly JWT_EXPIRES_IN = '7d'
  private static readonly COOKIE_NAME = 'tse-auth-token'
  private static readonly SALT_ROUNDS = 12

  /**
   * Connexion utilisateur
   */
  static async signIn(credentials: LoginCredentials): Promise<{
    success: boolean
    user?: AuthUser
    token?: string
    error?: string
  }> {
    try {
      const { email, password } = credentials

      // Validation des entrées
      if (!email || !password) {
        return {
          success: false,
          error: 'Email et mot de passe requis'
        }
      }

      // Rechercher l'utilisateur
      const user = await DatabaseService.getUserByEmail(email.toLowerCase())
      
      if (!user) {
        return {
          success: false,
          error: 'Identifiants invalides'
        }
      }

      // Vérifier si l'utilisateur est actif
      if (!user.actif) {
        return {
          success: false,
          error: 'Compte désactivé'
        }
      }

      // Vérifier le mot de passe
      const isValidPassword = await bcrypt.compare(password, user.passwordHash)
      
      if (!isValidPassword) {
        return {
          success: false,
          error: 'Identifiants invalides'
        }
      }

      // Générer le token JWT
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role
        },
        this.JWT_SECRET,
        { expiresIn: this.JWT_EXPIRES_IN }
      )

      // Créer la session en base
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7) // 7 jours

      const tokenHash = await bcrypt.hash(token, 10)
      await DatabaseService.createSession(user.id, tokenHash, expiresAt)

      // Mettre à jour la dernière connexion
      await DatabaseService.updateUser(user.id, {
        derniereConnexion: new Date()
      })

      // Définir le cookie
      this.setAuthCookie(token)

      const authUser: AuthUser = {
        id: user.id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role,
        actif: user.actif
      }

      return {
        success: true,
        user: authUser,
        token
      }

    } catch (error) {
      console.error('Erreur lors de la connexion:', error)
      return {
        success: false,
        error: 'Erreur interne du serveur'
      }
    }
  }

  /**
   * Inscription d'un nouvel utilisateur (admin uniquement)
   */
  static async register(data: RegisterData, currentUser?: AuthUser): Promise<{
    success: boolean
    user?: AuthUser
    error?: string
  }> {
    try {
      // Vérifier les permissions (seul super_admin peut créer des comptes)
      if (!currentUser || currentUser.role !== 'super_admin') {
        return {
          success: false,
          error: 'Permissions insuffisantes'
        }
      }

      const { email, password, nom, prenom, role = 'admin' } = data

      // Validation des entrées
      if (!email || !password) {
        return {
          success: false,
          error: 'Email et mot de passe requis'
        }
      }

      if (password.length < 8) {
        return {
          success: false,
          error: 'Le mot de passe doit contenir au moins 8 caractères'
        }
      }

      // Vérifier si l'email existe déjà
      const existingUser = await DatabaseService.getUserByEmail(email.toLowerCase())
      
      if (existingUser) {
        return {
          success: false,
          error: 'Un compte avec cet email existe déjà'
        }
      }

      // Hasher le mot de passe
      const passwordHash = await bcrypt.hash(password, this.SALT_ROUNDS)

      // Créer l'utilisateur
      const newUser = await DatabaseService.createUser({
        email: email.toLowerCase(),
        passwordHash,
        nom,
        prenom,
        role,
        actif: true
      })

      const authUser: AuthUser = {
        id: newUser.id,
        email: newUser.email,
        nom: newUser.nom,
        prenom: newUser.prenom,
        role: newUser.role,
        actif: newUser.actif
      }

      return {
        success: true,
        user: authUser
      }

    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error)
      return {
        success: false,
        error: 'Erreur interne du serveur'
      }
    }
  }

  /**
   * Déconnexion
   */
  static async signOut(token?: string): Promise<void> {
    try {
      if (token) {
        // Supprimer la session de la base de données
        const tokenHash = await bcrypt.hash(token, 10)
        await DatabaseService.deleteSession(tokenHash)
      }

      // Supprimer le cookie
      this.clearAuthCookie()

    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  /**
   * Vérifier un token JWT
   */
  static async verifyToken(token: string): Promise<{
    valid: boolean
    user?: AuthUser
    error?: string
  }> {
    try {
      // Vérifier le JWT
      const decoded = jwt.verify(token, this.JWT_SECRET) as any
      
      if (!decoded.userId) {
        return { valid: false, error: 'Token invalide' }
      }

      // Vérifier la session en base
      const tokenHash = await bcrypt.hash(token, 10)
      const session = await DatabaseService.getSessionByToken(tokenHash)
      
      if (!session || !session.user) {
        return { valid: false, error: 'Session expirée' }
      }

      // Vérifier si l'utilisateur est toujours actif
      if (!session.user.actif) {
        return { valid: false, error: 'Compte désactivé' }
      }

      const authUser: AuthUser = {
        id: session.user.id,
        email: session.user.email,
        nom: session.user.nom,
        prenom: session.user.prenom,
        role: session.user.role,
        actif: session.user.actif
      }

      return {
        valid: true,
        user: authUser
      }

    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return { valid: false, error: 'Token invalide' }
      }
      
      console.error('Erreur lors de la vérification du token:', error)
      return { valid: false, error: 'Erreur interne' }
    }
  }

  /**
   * Obtenir l'utilisateur actuel depuis la requête
   */
  static async getCurrentUser(request?: NextRequest): Promise<AuthUser | null> {
    try {
      let token: string | undefined

      if (request) {
        // Depuis une API route
        token = request.cookies.get(this.COOKIE_NAME)?.value
      } else {
        // Depuis un composant serveur
        const cookieStore = cookies()
        token = cookieStore.get(this.COOKIE_NAME)?.value
      }

      if (!token) {
        return null
      }

      const result = await this.verifyToken(token)
      return result.valid ? result.user! : null

    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error)
      return null
    }
  }

  /**
   * Middleware d'authentification
   */
  static async requireAuth(request: NextRequest): Promise<{
    authenticated: boolean
    user?: AuthUser
    error?: string
  }> {
    const user = await this.getCurrentUser(request)
    
    if (!user) {
      return {
        authenticated: false,
        error: 'Authentification requise'
      }
    }

    return {
      authenticated: true,
      user
    }
  }

  /**
   * Middleware de vérification des rôles
   */
  static async requireRole(
    request: NextRequest, 
    requiredRole: 'admin' | 'super_admin'
  ): Promise<{
    authorized: boolean
    user?: AuthUser
    error?: string
  }> {
    const authResult = await this.requireAuth(request)
    
    if (!authResult.authenticated) {
      return {
        authorized: false,
        error: authResult.error
      }
    }

    const user = authResult.user!
    
    // super_admin a accès à tout
    if (user.role === 'super_admin') {
      return {
        authorized: true,
        user
      }
    }

    // Vérifier le rôle spécifique
    if (user.role !== requiredRole) {
      return {
        authorized: false,
        error: 'Permissions insuffisantes'
      }
    }

    return {
      authorized: true,
      user
    }
  }

  // ==================== UTILITAIRES COOKIES ====================

  /**
   * Définir le cookie d'authentification
   */
  private static setAuthCookie(token: string): void {
    const cookieStore = cookies()
    
    cookieStore.set(this.COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 jours
      path: '/'
    })
  }

  /**
   * Supprimer le cookie d'authentification
   */
  private static clearAuthCookie(): void {
    const cookieStore = cookies()
    
    cookieStore.set(this.COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    })
  }
}

export default AuthService
