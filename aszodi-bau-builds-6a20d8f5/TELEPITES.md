# Gyors Telepítési Útmutató

## 1. Telepítsd a Supabase klienst

```bash
npm install @supabase/supabase-js
```

## 2. Supabase Beállítás

### Projekt létrehozása
1. Menj a https://app.supabase.com oldalra
2. Hozz létre új projektet
3. Várd meg amíg elkészül

### SQL Scriptek futtatása
1. Supabase Dashboard → **SQL Editor**
2. Másold be a `supabase-setup.sql` fájl tartalmát
3. **FONTOS**: Cseréld ki a hozzáférési kódot (67. sor):
   ```sql
   VALUES ('your-secret-code-123', true)
   ```
   Például:
   ```sql
   VALUES ('sajat-titkos-kodom-2024', true)
   ```
4. Futtasd le a scriptet (RUN gomb)

### Storage Bucket létrehozása
1. Supabase Dashboard → **Storage**
2. **New bucket** gomb
3. Beállítások:
   - Name: `images`
   - Public bucket: ✅ **BE KELL PIPÁLNI!**
4. Create bucket

### Storage Policies
1. Kattints az `images` bucket-re
2. **Policies** fül
3. Három policy hozzáadása:

**1. Olvasás:**
- New policy → Allow public read access

**2. Feltöltés:**
- New policy → Allow public insert access

**3. Törlés:**
- New policy → Allow public delete access

## 3. Környezeti Változók

### .env fájl létrehozása
```bash
cp .env.example .env
```

### .env kitöltése
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Ezeket az értékeket itt találod:
- Supabase Dashboard → **Settings** → **API**
- Project URL → `VITE_SUPABASE_URL`
- anon/public key → `VITE_SUPABASE_ANON_KEY`

## 4. Alkalmazás Indítása

```bash
npm run dev
```

## 5. Admin Panel Használata

**Bejelentkezés:**
- URL: `http://localhost:5173/admin/login`
- Hozzáférési kód: amit az SQL scriptben beállítottál

**Funkciók:**
- Képek feltöltése/törlése
- Szöveges tartalmak kezelése

## Részletes útmutató

A teljes dokumentációt lásd: `ADMIN_SETUP.md`

## Fontos fájlok

- `supabase-setup.sql` - Adatbázis struktúra
- `.env.example` - Környezeti változók sablon
- `ADMIN_SETUP.md` - Részletes dokumentáció
- `src/lib/supabase.ts` - Supabase helper függvények
- `src/pages/admin/` - Admin komponensek
