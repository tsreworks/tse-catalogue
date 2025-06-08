'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { 
  LayoutDashboard,
  Car,
  Building2,
  Settings,
  Download,
  Menu,
  X,
  LogOut,
  User,
  Bell,
  Search,
  ChevronDown
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

const navigation = [
  {
    name: 'Tableau de bord',
    href: '/admin/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'Véhicules',
    href: '/admin/vehicles',
    icon: Car,
    children: [
      { name: 'Liste des véhicules', href: '/admin/vehicles' },
      { name: 'Nouveau véhicule', href: '/admin/vehicles/new' }
    ]
  },
  {
    name: 'Marques',
    href: '/admin/brands',
    icon: Building2
  },
  {
    name: 'Modèles',
    href: '/admin/models',
    icon: Settings
  },
  {
    name: 'Export',
    href: '/admin/export',
    icon: Download
  }
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
            <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
              <Link href="/admin/dashboard" className="flex items-center">
                <Image
                  src="/images/tse-logo.png"
                  alt="TSE Logo"
                  width={40}
                  height={40}
                  className="h-10 w-auto"
                />
                <span className="ml-2 text-xl font-bold text-gray-900">TSE Admin</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                  {item.children && isActive(item.href) && (
                    <div className="ml-8 mt-2 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                            pathname === child.href
                              ? 'bg-primary-50 text-primary-600'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Sidebar desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4 border-b border-gray-200">
            <Link href="/admin/dashboard" className="flex items-center">
              <Image
                src="/images/tse-logo.png"
                alt="TSE Logo"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
              <span className="ml-2 text-xl font-bold text-gray-900">TSE Admin</span>
            </Link>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
                {item.children && isActive(item.href) && (
                  <div className="ml-8 mt-2 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                          pathname === child.href
                            ? 'bg-primary-50 text-primary-600'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          
          {/* Lien vers le site public */}
          <div className="p-4 border-t border-gray-200">
            <Link
              href="/catalogue"
              target="_blank"
              className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Search className="h-5 w-5 mr-3" />
              Voir le site public
            </Link>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="lg:pl-64">
        {/* Barre de navigation supérieure */}
        <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-gray-600"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="text-gray-400 hover:text-gray-600 relative">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>

              {/* Menu utilisateur */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center text-sm text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center mr-2">
                    <User className="h-5 w-5 text-primary-600" />
                  </div>
                  <span className="hidden sm:block">Administrateur</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      <Link
                        href="/admin/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profil
                      </Link>
                      <Link
                        href="/admin/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Paramètres
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={() => {
                          // Logique de déconnexion
                          setUserMenuOpen(false)
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contenu de la page */}
        <main>
          {children}
        </main>
      </div>
    </div>
  )
}
