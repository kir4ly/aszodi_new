# Admin Panel Telepítési Útmutató

## 1. Supabase Projekt Létrehozása

1. Menj a [Supabase Dashboard](https://app.supabase.com)-ra
2. Kattints a "New Project" gombra
3. Add meg a projekt nevét, adatbázis jelszót és válassz régiót
4. Várd meg amíg a projekt elkészül (1-2 perc)

## 2. Supabase Adatbázis Beállítása

### 2.1. SQL Scriptek Futtatása

1. A Supabase Dashboard-on menj a **SQL Editor** menüpontba
2. Kattints a "New query" gombra
3. Másold be a `supabase-setup.sql` fájl teljes tartalmát
4. **FONTOS**: Mielőtt futtatnád, cseréld ki ezt a sort:
   ```sql
   VALUES ('your-secret-code-123', true)
   ```
   A saját hozzáférési kódodra, pl:
   ```sql
   VALUES ('titkos-kod-2024', true)
   ```
5. Kattints a "Run" gombra a script futtatásához

### 2.2. Storage Bucket Létrehozása

1. Menj a Supabase Dashboard **Storage** menüpontjába
2. Kattints a **"New bucket"** gombra
3. Add meg az alábbi beállításokat:
   - **Name**: `images`
   - **Public bucket**: ✅ IGEN (pipáld be!)
4. Kattints a **"Create bucket"** gombra

### 2.3. Storage Policies Beállítása

1. A létrehozott `images` bucket-re kattints
2. Menj a **"Policies"** fülre
3. Kattints a **"New policy"** gombra háromszor, és add hozzá ezeket:

**Policy 1 - Olvasás:**
- Template: "Allow public read access"
- Vagy Custom policy:
  - Name: `Public read images`
  - Allowed operation: `SELECT`
  - Policy definition: `true`

**Policy 2 - Feltöltés:**
- Template: "Allow public insert access"
- Vagy Custom policy:
  - Name: `Public insert images`
  - Allowed operation: `INSERT`
  - WITH CHECK: `true`

**Policy 3 - Törlés:**
- Template: "Allow public delete access"
- Vagy Custom policy:
  - Name: `Public delete images`
  - Allowed operation: `DELETE`
  - USING: `true`

## 3. Frontend Beállítása

### 3.1. Supabase Kliens Telepítése

```bash
npm install @supabase/supabase-js
```

### 3.2. Környezeti Változók Beállítása

1. Másold le a `.env.example` fájlt `.env` néven:
   ```bash
   cp .env.example .env
   ```

2. Töltsd ki a `.env` fájlt a Supabase projekt adataival:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. Ezeket az értékeket a Supabase Dashboard-on találod:
   - Menj a **Settings** > **API** menüpontba
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Project API keys** > **anon/public** → `VITE_SUPABASE_ANON_KEY`

### 3.3. Alkalmazás Indítása

```bash
npm run dev
```

## 4. Admin Panel Használata

### 4.1. Bejelentkezés

1. Nyisd meg a böngészőben: `http://localhost:5173/admin/login`
2. Add meg a hozzáférési kódot (amit az SQL scriptben beállítottál)
3. Kattints a "Bejelentkezés" gombra

### 4.2. Funkciók

**Képek kezelése:**
- Új projekt létrehozása címmel, leírással és képekkel
- Meglévő projektek megtekintése
- Projektek törlése

### 4.3. Képek Használata

A galéria projekteket és képeket így tudod betölteni:

```tsx
import { useEffect, useState } from 'react';
import { getProjects } from '@/lib/supabase';

function Gallery() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const loadProjects = async () => {
      const data = await getProjects();
      setProjects(data);
    };
    loadProjects();
  }, []);

  return (
    <div className="grid gap-8">
      {projects.map((project) => (
        <div key={project.id}>
          <h3>{project.title}</h3>
          {project.description && <p>{project.description}</p>}
          <div className="grid grid-cols-3 gap-4">
            {project.images?.map((img) => (
              <img
                key={img.id}
                src={img.image_url}
                alt={project.title}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

## 5. Biztonság

### Fontos biztonsági megfontolások:

1. **Hozzáférési kód**: A példában szereplő `your-secret-code-123` kódot mindenképp cseréld le egy erős, egyedi kódra!

2. **RLS Policies**: A jelenlegi beállítások mindenki számára engedélyezik az írást/olvasást. Éles környezetben ezt finomítsd:
   - Használj Supabase Auth-ot valódi felhasználó hitelesítéshez
   - Korlátozd a write műveletet csak admin felhasználókra

3. **Environment változók**: SOHA ne commitáld a `.env` fájlt a git repository-ba!

## 6. Hibaelhárítás

**"Error verifying access code"**
- Ellenőrizd, hogy a `admin_access` táblában szerepel-e a kód
- Nézd meg, hogy az `is_active` mező `true` értékű-e

**"Error uploading image"**
- Ellenőrizd, hogy létrehoztad-e az `images` storage bucket-et
- Nézd meg, hogy a bucket public-e
- Ellenőrizd a storage policies beállításait

**"Supabase client error"**
- Ellenőrizd a `.env` fájl értékeit
- Győződj meg róla, hogy a Supabase projekt elérhető

## 7. Következő Lépések

- Integráld a meglévő oldalakba a `getProjects()` függvényt
- Valósíts meg image optimization-t (pl. responsive képek, lazy loading)
- Adj hozzá képek automatikus tömörítését feltöltés előtt
- Implementálj lightbox funkciót a képek nagyobb méretű megtekintéséhez
