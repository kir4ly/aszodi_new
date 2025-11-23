-- ===================================
-- MIGRATION: Gallery Images → Projects
-- ===================================
-- Ez a script átalakítja az adatbázist a régi gallery_images rendszerről
-- az új projects/project_images rendszerre.
--
-- FIGYELEM: Ez törli az összes meglévő képet!
-- Csak akkor futtasd, ha biztos vagy benne, hogy új kezdést szeretnél.
--
-- Futtatás: Másold be ezt a teljes scriptet a Supabase SQL Editor-ba és futtasd le.
-- ===================================

-- 1. DROP OLD TABLE AND POLICIES
-- Töröljük a régi gallery_images táblát és a hozzá tartozó policy-kat

DROP POLICY IF EXISTS "Gallery images readable by all" ON gallery_images;
DROP POLICY IF EXISTS "Gallery images writable by all" ON gallery_images;
DROP TABLE IF EXISTS gallery_images CASCADE;

-- 2. CREATE NEW PROJECTS TABLE
-- Ez tárolja a projekteket (referenciák)

CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index az időrendhez
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- 3. CREATE PROJECT IMAGES TABLE
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

-- 4. ENABLE ROW LEVEL SECURITY (RLS)

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

-- 5. CREATE RLS POLICIES

-- Projects: Mindenki olvashatja
CREATE POLICY "Projects readable by all"
  ON projects FOR SELECT
  USING (true);

-- Projects: Bárki írhatja (később finomíthatod admin-only-ra)
CREATE POLICY "Projects writable by all"
  ON projects FOR ALL
  USING (true);

-- Project images: Mindenki olvashatja
CREATE POLICY "Project images readable by all"
  ON project_images FOR SELECT
  USING (true);

-- Project images: Bárki írhatja (később finomíthatod admin-only-ra)
CREATE POLICY "Project images writable by all"
  ON project_images FOR ALL
  USING (true);

-- ===================================
-- MIGRATION COMPLETE
-- ===================================
-- Az új táblák létrejöttek és készen állnak a használatra.
--
-- KÖVETKEZŐ LÉPÉSEK:
-- 1. Ellenőrizd, hogy a táblák létrejöttek-e a Supabase Dashboard > Database > Tables menüben
-- 2. Az admin panelen keresztül tölts fel új projekteket
-- 3. A storage-ban a régi gallery/ mappában lévő képeket törölheted kézzel a Supabase Dashboard > Storage menüben
-- 4. Az új képek a projects/{project_id}/ mappákba kerülnek majd
-- ===================================
