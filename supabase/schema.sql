-- Schema de base de données pour TSE Catalogue
-- Version: 1.0
-- Date: 6 janvier 2025

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des marques
CREATE TABLE brands (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE,
    logo TEXT, -- URL vers le logo de la marque
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des modèles
CREATE TABLE models (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(nom, brand_id)
);

-- Table des véhicules
CREATE TABLE vehicles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    brand_id UUID NOT NULL REFERENCES brands(id),
    model_id UUID NOT NULL REFERENCES models(id),
    annee INTEGER NOT NULL CHECK (annee >= 1900 AND annee <= EXTRACT(YEAR FROM NOW()) + 2),
    couleur VARCHAR(50) NOT NULL,
    prix INTEGER, -- Prix en Francs CFA (pas de décimales)
    kilometrage INTEGER CHECK (kilometrage >= 0),
    carburant VARCHAR(20) NOT NULL CHECK (carburant IN ('Essence', 'Diesel', 'Hybride', 'Électrique')),
    transmission VARCHAR(20) NOT NULL CHECK (transmission IN ('Manuelle', 'Automatique')),
    description TEXT,
    statut VARCHAR(20) NOT NULL DEFAULT 'Disponible' CHECK (statut IN ('Disponible', 'Vendu', 'Réservé', 'En maintenance')),
    
    -- Caractéristiques techniques
    puissance VARCHAR(20), -- ex: "122 ch"
    cylindree VARCHAR(20), -- ex: "1.8L"
    consommation VARCHAR(30), -- ex: "4.5L/100km"
    emissions VARCHAR(30), -- ex: "102 g/km CO2"
    nombre_portes INTEGER CHECK (nombre_portes > 0),
    nombre_places INTEGER CHECK (nombre_places > 0),
    coffre VARCHAR(20), -- ex: "487L"
    
    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID, -- Référence vers l'utilisateur qui a créé
    updated_by UUID  -- Référence vers l'utilisateur qui a modifié
);

-- Table des équipements
CREATE TABLE equipments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nom VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    categorie VARCHAR(50), -- ex: "Sécurité", "Confort", "Technologie"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table de liaison véhicule-équipements
CREATE TABLE vehicle_equipments (
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    equipment_id UUID NOT NULL REFERENCES equipments(id) ON DELETE CASCADE,
    PRIMARY KEY (vehicle_id, equipment_id)
);

-- Table des images de véhicules
CREATE TABLE vehicle_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    url TEXT NOT NULL, -- URL Supabase Storage
    alt_text VARCHAR(200),
    ordre INTEGER NOT NULL DEFAULT 1,
    est_principale BOOLEAN DEFAULT FALSE,
    taille_fichier INTEGER, -- en bytes
    largeur INTEGER,
    hauteur INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des documents (fiches techniques, etc.)
CREATE TABLE vehicle_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    nom VARCHAR(200) NOT NULL,
    type_document VARCHAR(50) NOT NULL, -- "fiche_technique", "manuel", "certificat"
    url TEXT NOT NULL, -- URL Supabase Storage
    taille_fichier INTEGER, -- en bytes
    mime_type VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID
);

-- Table des utilisateurs administrateurs
CREATE TABLE admin_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    actif BOOLEAN DEFAULT TRUE,
    derniere_connexion TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX idx_vehicles_brand_model ON vehicles(brand_id, model_id);
CREATE INDEX idx_vehicles_statut ON vehicles(statut);
CREATE INDEX idx_vehicles_carburant ON vehicles(carburant);
CREATE INDEX idx_vehicles_annee ON vehicles(annee);
CREATE INDEX idx_vehicles_prix ON vehicles(prix);
CREATE INDEX idx_vehicle_images_vehicle ON vehicle_images(vehicle_id);
CREATE INDEX idx_vehicle_images_principale ON vehicle_images(vehicle_id, est_principale);
CREATE INDEX idx_vehicle_documents_vehicle ON vehicle_documents(vehicle_id);

-- Triggers pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_models_updated_at BEFORE UPDATE ON models
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Contrainte pour s'assurer qu'il n'y a qu'une seule image principale par véhicule
CREATE UNIQUE INDEX idx_vehicle_image_principale_unique 
ON vehicle_images(vehicle_id) 
WHERE est_principale = TRUE;

-- RLS (Row Level Security) - À configurer selon les besoins
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE models ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_equipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Politiques RLS de base (lecture publique pour le catalogue)
CREATE POLICY "Lecture publique des marques" ON brands FOR SELECT USING (true);
CREATE POLICY "Lecture publique des modèles" ON models FOR SELECT USING (true);
CREATE POLICY "Lecture publique des véhicules" ON vehicles FOR SELECT USING (true);
CREATE POLICY "Lecture publique des équipements" ON equipments FOR SELECT USING (true);
CREATE POLICY "Lecture publique des équipements véhicules" ON vehicle_equipments FOR SELECT USING (true);
CREATE POLICY "Lecture publique des images" ON vehicle_images FOR SELECT USING (true);
CREATE POLICY "Lecture publique des documents" ON vehicle_documents FOR SELECT USING (true);

-- Commentaires pour la documentation
COMMENT ON TABLE brands IS 'Table des marques de véhicules (Toyota, Ford, etc.)';
COMMENT ON TABLE models IS 'Table des modèles de véhicules (Corolla, Territory, etc.)';
COMMENT ON TABLE vehicles IS 'Table principale des véhicules avec toutes leurs caractéristiques';
COMMENT ON TABLE equipments IS 'Table des équipements disponibles (GPS, Climatisation, etc.)';
COMMENT ON TABLE vehicle_equipments IS 'Table de liaison many-to-many entre véhicules et équipements';
COMMENT ON TABLE vehicle_images IS 'Table des images associées aux véhicules';
COMMENT ON TABLE vehicle_documents IS 'Table des documents (fiches techniques, manuels, etc.)';
COMMENT ON TABLE admin_users IS 'Table des utilisateurs administrateurs du système';
