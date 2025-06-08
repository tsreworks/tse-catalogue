import { Metadata } from 'next'
import LoginForm from '@/components/LoginForm'

export const metadata: Metadata = {
  title: 'Connexion Administrateur - TSE Catalogue',
  description: 'Connexion sécurisée pour les administrateurs de Total Service Equipement',
  robots: 'noindex, nofollow', // Empêcher l'indexation de la page de connexion
}

export default function LoginPage() {
  return <LoginForm />
}
