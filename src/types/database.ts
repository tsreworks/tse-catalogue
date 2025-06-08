// Types générés automatiquement pour la base de données Supabase
// Version: 1.0
// Date: 6 janvier 2025

export interface Database {
  public: {
    Tables: {
      brands: {
        Row: {
          id: string
          nom: string
          logo: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nom: string
          logo?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nom?: string
          logo?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      models: {
        Row: {
          id: string
          nom: string
          brand_id: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nom: string
          brand_id: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nom?: string
          brand_id?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vehicles: {
        Row: {
          id: string
          brand_id: string
          model_id: string
          annee: number
          couleur: string
          prix: number | null
          kilometrage: number | null
          carburant: 'Essence' | 'Diesel' | 'Hybride' | 'Électrique'
          transmission: 'Manuelle' | 'Automatique'
          description: string | null
          statut: 'Disponible' | 'Vendu' | 'Réservé' | 'En maintenance'
          puissance: string | null
          cylindree: string | null
          consommation: string | null
          emissions: string | null
          nombre_portes: number | null
          nombre_places: number | null
          coffre: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          brand_id: string
          model_id: string
          annee: number
          couleur: string
          prix?: number | null
          kilometrage?: number | null
          carburant: 'Essence' | 'Diesel' | 'Hybride' | 'Électrique'
          transmission: 'Manuelle' | 'Automatique'
          description?: string | null
          statut?: 'Disponible' | 'Vendu' | 'Réservé' | 'En maintenance'
          puissance?: string | null
          cylindree?: string | null
          consommation?: string | null
          emissions?: string | null
          nombre_portes?: number | null
          nombre_places?: number | null
          coffre?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          brand_id?: string
          model_id?: string
          annee?: number
          couleur?: string
          prix?: number | null
          kilometrage?: number | null
          carburant?: 'Essence' | 'Diesel' | 'Hybride' | 'Électrique'
          transmission?: 'Manuelle' | 'Automatique'
          description?: string | null
          statut?: 'Disponible' | 'Vendu' | 'Réservé' | 'En maintenance'
          puissance?: string | null
          cylindree?: string | null
          consommation?: string | null
          emissions?: string | null
          nombre_portes?: number | null
          nombre_places?: number | null
          coffre?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
      }
      equipments: {
        Row: {
          id: string
          nom: string
          description: string | null
          categorie: string | null
          created_at: string
        }
        Insert: {
          id?: string
          nom: string
          description?: string | null
          categorie?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          nom?: string
          description?: string | null
          categorie?: string | null
          created_at?: string
        }
      }
      vehicle_equipments: {
        Row: {
          vehicle_id: string
          equipment_id: string
        }
        Insert: {
          vehicle_id: string
          equipment_id: string
        }
        Update: {
          vehicle_id?: string
          equipment_id?: string
        }
      }
      vehicle_images: {
        Row: {
          id: string
          vehicle_id: string
          url: string
          alt_text: string | null
          ordre: number
          est_principale: boolean
          taille_fichier: number | null
          largeur: number | null
          hauteur: number | null
          created_at: string
        }
        Insert: {
          id?: string
          vehicle_id: string
          url: string
          alt_text?: string | null
          ordre?: number
          est_principale?: boolean
          taille_fichier?: number | null
          largeur?: number | null
          hauteur?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          vehicle_id?: string
          url?: string
          alt_text?: string | null
          ordre?: number
          est_principale?: boolean
          taille_fichier?: number | null
          largeur?: number | null
          hauteur?: number | null
          created_at?: string
        }
      }
      vehicle_documents: {
        Row: {
          id: string
          vehicle_id: string
          nom: string
          type_document: string
          url: string
          taille_fichier: number | null
          mime_type: string | null
          created_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          vehicle_id: string
          nom: string
          type_document: string
          url: string
          taille_fichier?: number | null
          mime_type?: string | null
          created_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          vehicle_id?: string
          nom?: string
          type_document?: string
          url?: string
          taille_fichier?: number | null
          mime_type?: string | null
          created_at?: string
          created_by?: string | null
        }
      }
      admin_users: {
        Row: {
          id: string
          email: string
          nom: string
          prenom: string
          role: 'admin' | 'super_admin'
          actif: boolean
          derniere_connexion: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          nom: string
          prenom: string
          role?: 'admin' | 'super_admin'
          actif?: boolean
          derniere_connexion?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          nom?: string
          prenom?: string
          role?: 'admin' | 'super_admin'
          actif?: boolean
          derniere_connexion?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
