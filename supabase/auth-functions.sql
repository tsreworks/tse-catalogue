-- Fonctions RPC pour l'authentification TSE Catalogue
-- À exécuter dans Supabase SQL Editor

-- Fonction pour récupérer un admin par email (contourne RLS)
CREATE OR REPLACE FUNCTION get_admin_by_email(user_email TEXT)
RETURNS TABLE(
  id UUID,
  email TEXT,
  nom TEXT,
  prenom TEXT,
  role TEXT,
  actif BOOLEAN,
  derniere_connexion TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.email,
    a.nom,
    a.prenom,
    a.role,
    a.actif,
    a.derniere_connexion,
    a.created_at,
    a.updated_at
  FROM admin_users a
  WHERE a.email = user_email 
    AND a.actif = true;
END;
$$;

-- Fonction pour mettre à jour la dernière connexion
CREATE OR REPLACE FUNCTION update_admin_last_login(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE admin_users 
  SET derniere_connexion = NOW(),
      updated_at = NOW()
  WHERE email = user_email 
    AND actif = true;
  
  RETURN FOUND;
END;
$$;

-- Fonction pour vérifier si un email est admin (publique)
CREATE OR REPLACE FUNCTION check_admin_access(user_email TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_record RECORD;
  result JSON;
BEGIN
  -- Récupérer les données admin
  SELECT * INTO admin_record
  FROM admin_users
  WHERE email = user_email 
    AND actif = true;
  
  IF FOUND THEN
    result := json_build_object(
      'is_admin', true,
      'role', admin_record.role,
      'nom', admin_record.nom,
      'prenom', admin_record.prenom,
      'id', admin_record.id
    );
  ELSE
    result := json_build_object(
      'is_admin', false,
      'role', 'none',
      'message', 'Utilisateur non autorisé'
    );
  END IF;
  
  RETURN result;
END;
$$;

-- Test des fonctions
SELECT 'Fonctions RPC créées avec succès' as message;

-- Test avec l'utilisateur admin
SELECT check_admin_access('admin@tse.com') as test_admin_access;
