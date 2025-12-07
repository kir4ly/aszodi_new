-- ===================================
-- ADMIN PANEL SUPABASE SETUP (SAFE VERSION)
-- ===================================
-- Ez a script biztonságosan futtatható többször is.
-- Nem hibázik, ha már léteznek a táblák vagy policies.

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

-- 4. RLS POLICIES (SAFE - drop if exists, then create)
-- Ezek a szabályok határozzák meg, hogy ki mit olvashat/írhat

-- Admin access: Csak olvasható mindenki számára (a kód ellenőrzéshez)
DROP POLICY IF EXISTS "Admin access readable by all" ON admin_access;
CREATE POLICY "Admin access readable by all"
  ON admin_access FOR SELECT
  USING (true);

-- Projects: Mindenki olvashatja
DROP POLICY IF EXISTS "Projects readable by all" ON projects;
CREATE POLICY "Projects readable by all"
  ON projects FOR SELECT
  USING (true);

-- Projects: Bárki írhatja (később finomíthatod)
DROP POLICY IF EXISTS "Projects writable by all" ON projects;
CREATE POLICY "Projects writable by all"
  ON projects FOR ALL
  USING (true);

-- Project images: Mindenki olvashatja
DROP POLICY IF EXISTS "Project images readable by all" ON project_images;
CREATE POLICY "Project images readable by all"
  ON project_images FOR SELECT
  USING (true);

-- Project images: Bárki írhatja (később finomíthatod)
DROP POLICY IF EXISTS "Project images writable by all" ON project_images;
CREATE POLICY "Project images writable by all"
  ON project_images FOR ALL
  USING (true);

-- 5. ADMIN ACCESS KÓD BESZÚRÁSA
-- Cseréld ki a 'Aszodibau1212345' értéket a saját hozzáférési kódodra!
INSERT INTO admin_access (code, is_active)
VALUES ('Aszodibau1212345', true)
ON CONFLICT (code) DO NOTHING;

-- ===================================
-- SUCCESS MESSAGE
-- ===================================
DO $$
BEGIN
  RAISE NOTICE '✅ Setup completed successfully!';
  RAISE NOTICE '📝 Next steps:';
  RAISE NOTICE '1. Create storage bucket named "images" (public)';
  RAISE NOTICE '2. Set up storage policies for the bucket';
  RAISE NOTICE '3. Admin login code: Aszodibau1212345';
END $$;
