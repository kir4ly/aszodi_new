# Képoptimalizálás terv - Aszódi Bau

## Probléma
- A képek eredeti méretben (akár több MB) töltődnek fel a Supabase-re
- Nincs tömörítés, nincs átméretezés
- Lassú oldalbetöltés, különösen mobilon

## Megoldás

### 1. Kliens-oldali képtömörítés feltöltés előtt
- **browser-image-compression** npm csomag telepítése
- Feltöltés előtt minden kép automatikusan:
  - Max 300 KB-ra tömörítve
  - Max 1920px szélességre méretezve (galéria/kártya megjelenítéshez bőven elég)
  - WebP formátumra konvertálva (ha a böngésző támogatja)
- Módosítandó fájl: `src/lib/supabase.ts` (createProject függvény) és/vagy `src/components/admin/ImageUploader.tsx`

### 2. Lazy loading minden képre
- `loading="lazy"` attribútum hozzáadása az összes `<img>` elemhez ahol még hiányzik:
  - `Home.tsx` - galéria preview képek, about szekció képek
  - `ImageUploader.tsx` - admin panel projekt képek
  - `Gallery.tsx` Lightbox képek (már van a kártyákon)

### 3. Kép méretek megadása (CLS megelőzés)
- `width` és `height` attribútumok vagy `aspect-ratio` CSS hozzáadása a képekhez a layout shift elkerüléséhez

## Érintett fájlok
1. `package.json` - új dependency
2. `src/lib/supabase.ts` - tömörítő logika a createProject-ben
3. `src/components/admin/ImageUploader.tsx` - preview is tömörített képből
4. `src/pages/Gallery.tsx` - lazy loading kiegészítés
5. `src/pages/Home.tsx` - lazy loading kiegészítés
