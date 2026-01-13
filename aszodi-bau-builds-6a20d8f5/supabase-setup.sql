-- ===================================
-- ADMIN PANEL SUPABASE SETUP
-- ===================================
-- Ez a script létrehozza az összes szükséges táblát és storage bucket-et
-- a működő admin panelhez.

-- 1. ADMIN ACCESS TABLE
-- Ez tárolja a hozzáférési kódokat
CREATE TABLE IF NOT EXISTS admin_access (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index a gyors kereséshez
CREATE INDEX IF NOT EXISTS idx_admin_access_code ON admin_access(code);
CREATE INDEX IF NOT EXISTS idx_admin_access_active ON admin_access(is_active);

-- 2. PROJECTS TABLE
-- Ez tárolja a projekteket (referenciák)
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index az időrendhez
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- 2.1 PROJECT IMAGES TABLE
-- Ez tárolja a projektekhez tartozó képeket
CREATE TABLE IF NOT EXISTS project_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index a projekthez tartozó képek gyors lekérdezéséhez
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_project_images_order ON project_images(project_id, display_order);

-- 3. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE admin_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

-- 3.1 MEGLÉVŐ POLICY-K TÖRLÉSE (ha újrafuttatod a scriptet)
DROP POLICY IF EXISTS "Admin access readable by all" ON admin_access;
DROP POLICY IF EXISTS "Projects readable by all" ON projects;
DROP POLICY IF EXISTS "Projects writable by all" ON projects;
DROP POLICY IF EXISTS "Project images readable by all" ON project_images;
DROP POLICY IF EXISTS "Project images writable by all" ON project_images;

-- 4. RLS POLICIES
-- Ezek a szabályok határozzák meg, hogy ki mit olvashat/írhat

-- Admin access: Csak olvasható mindenki számára (a kód ellenőrzéshez)
CREATE POLICY "Admin access readable by all"
  ON admin_access FOR SELECT
  USING (true);

-- Projects: Mindenki olvashatja
CREATE POLICY "Projects readable by all"
  ON projects FOR SELECT
  USING (true);

-- Projects: Bárki írhatja (később finomíthatod)
CREATE POLICY "Projects writable by all"
  ON projects FOR ALL
  USING (true)
  WITH CHECK (true);

-- Project images: Mindenki olvashatja
CREATE POLICY "Project images readable by all"
  ON project_images FOR SELECT
  USING (true);

-- Project images: Bárki írhatja (később finomíthatod)
CREATE POLICY "Project images writable by all"
  ON project_images FOR ALL
  USING (true)
  WITH CHECK (true);

-- 5. ADMIN ACCESS KÓD BESZÚRÁSA
-- Cseréld ki a 'Aszodibau1212345' értéket a saját hozzáférési kódodra!
INSERT INTO admin_access (code, is_active)
VALUES ('Aszodibau1212345', true)
ON CONFLICT (code) DO NOTHING;

-- ===================================
-- STORAGE BUCKET LÉTREHOZÁSA
-- ===================================
-- FIGYELEM: Ez a része NEM SQL-ben fut!
-- Ezt a Supabase Dashboard-on kell végrehajtani:
--
-- 1. Menj a Supabase Dashboard > Storage menüpontba
-- 2. Kattints a "New bucket" gombra
-- 3. Bucket neve: 'images'
-- 4. Public bucket: IGEN (checked)
-- 5. Kattints a "Create bucket" gombra
-- 6. A bucket létrehozása után menj a Policies fülre
-- 7. Add hozzá ezeket a policy-kat:
--
-- Policy 1: "Public read access"
--   - Operation: SELECT
--   - Policy definition: true
--
-- Policy 2: "Public insert access"
--   - Operation: INSERT
--   - Policy definition: true
--
-- Policy 3: "Public delete access"
--   - Operation: DELETE
--   - Policy definition: true

-- Alternatíva: Ha van hozzáférésed a Supabase SQL Editor-hoz,
-- használhatod ezt a storage policy létrehozást is:

-- Töröljük a meglévő storage policy-kat
DROP POLICY IF EXISTS "Public read images" ON storage.objects;
DROP POLICY IF EXISTS "Public insert images" ON storage.objects;
DROP POLICY IF EXISTS "Public delete images" ON storage.objects;

-- Storage bucket létrehozása
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy-k létrehozása
CREATE POLICY "Public read images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

CREATE POLICY "Public insert images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Public delete images"
ON storage.objects FOR DELETE
USING (bucket_id = 'images');
