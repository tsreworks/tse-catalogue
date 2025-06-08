-- Configuration de l'authentification Supabase pour TSE Catalogue
-- Version: 1.0
-- Date: 6 janvier 2025

-- Activer l'extension auth si pas déjà fait
-- (Normalement déjà activée par défaut dans Supabase)

-- Politiques RLS pour admin_users
-- Seuls les utilisateurs authentifiés peuvent lire leurs propres données
CREATE POLICY "Les admins peuvent lire leurs propres données" ON admin_users
FOR SELECT USING (auth.uid() = id OR auth.email() = email);

-- Seuls les super_admins peuvent modifier les données admin
CREATE POLICY "Seuls les super_admins peuvent modifier les admins" ON admin_users
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = auth.email() 
    AND role = 'super_admin' 
    AND actif = true
  )
);

-- Politiques pour les opérations CRUD sur les véhicules
-- Seuls les admins authentifiés peuvent modifier les véhicules
CREATE POLICY "Admins peuvent modifier les véhicules" ON vehicles
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = auth.email() 
    AND actif = true
  )
);

CREATE POLICY "Admins peuvent mettre à jour les véhicules" ON vehicles
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = auth.email() 
    AND actif = true
  )
);

CREATE POLICY "Admins peuvent supprimer les véhicules" ON vehicles
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = auth.email() 
    AND actif = true
  )
);

-- Politiques similaires pour les autres tables
CREATE POLICY "Admins peuvent modifier les marques" ON brands
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = auth.email() 
    AND actif = true
  )
);

CREATE POLICY "Admins peuvent modifier les modèles" ON models
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = auth.email() 
    AND actif = true
  )
);

CREATE POLICY "Admins peuvent modifier les équipements" ON equipments
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = auth.email() 
    AND actif = true
  )
);

-- Fonction pour créer une entrée admin_users (l'utilisateur auth doit être créé via l'interface)
CREATE OR REPLACE FUNCTION create_admin_profile(
  user_id UUID,
  user_email TEXT,
  user_nom TEXT,
  user_prenom TEXT,
  user_role TEXT DEFAULT 'admin'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  -- Créer l'entrée dans admin_users
  INSERT INTO admin_users (
    id,
    email,
    nom,
    prenom,
    role,
    actif
  ) VALUES (
    user_id,
    user_email,
    user_nom,
    user_prenom,
    user_role,
    true
  );

  result := json_build_object(
    'success', true,
    'user_id', user_id,
    'email', user_email,
    'message', 'Profil admin créé avec succès'
  );

  RETURN result;

EXCEPTION WHEN OTHERS THEN
  result := json_build_object(
    'success', false,
    'error', SQLERRM,
    'message', 'Erreur lors de la création du profil'
  );
  RETURN result;
END;
$$;

-- Créer un profil admin pour l'utilisateur par défaut
-- Note: L'utilisateur auth doit être créé manuellement via l'interface Supabase
-- ou via l'API d'authentification

-- Fonction pour vérifier si un utilisateur est admin
CREATE OR REPLACE FUNCTION is_admin(user_email TEXT DEFAULT auth.email())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = user_email 
    AND actif = true
  );
END;
$$;

-- Fonction pour obtenir le rôle d'un utilisateur
CREATE OR REPLACE FUNCTION get_user_role(user_email TEXT DEFAULT auth.email())
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM admin_users 
  WHERE email = user_email 
  AND actif = true;
  
  RETURN COALESCE(user_role, 'none');
END;
$$;

-- Trigger pour mettre à jour updated_at sur admin_users
CREATE OR REPLACE FUNCTION update_admin_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_admin_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_updated_at();

-- Vue pour les statistiques d'authentification (optionnel)
CREATE OR REPLACE VIEW auth_stats AS
SELECT 
  COUNT(*) as total_admins,
  COUNT(*) FILTER (WHERE actif = true) as admins_actifs,
  COUNT(*) FILTER (WHERE role = 'super_admin') as super_admins,
  COUNT(*) FILTER (WHERE derniere_connexion > NOW() - INTERVAL '30 days') as connexions_recentes
FROM admin_users;

-- Commentaires pour la documentation
COMMENT ON FUNCTION create_admin_user IS 'Crée un nouvel utilisateur administrateur avec authentification Supabase';
COMMENT ON FUNCTION is_admin IS 'Vérifie si un utilisateur a les droits administrateur';
COMMENT ON FUNCTION get_user_role IS 'Retourne le rôle d''un utilisateur administrateur';
COMMENT ON VIEW auth_stats IS 'Statistiques sur les utilisateurs administrateurs';
