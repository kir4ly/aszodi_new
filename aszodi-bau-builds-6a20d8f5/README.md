# Aszódi Bau - Weboldal

Aszódi Bau építőipari vállalkozás hivatalos weboldala.

**Haza hoztuk a minőséget**

## Projekt információ

Ez a weboldal az Aszódi Bau szolgáltatásait mutatja be, beleértve:
- Teljes körű lakásfelújítás
- Homlokzatszigetelés
- Kőműves munkák

## Technológiák

A projekt a következő technológiákkal készült:

- **Vite** - Gyors build tool és dev server
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **shadcn-ui** - Komponens könyvtár
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase** - Backend és adatbázis

## Fejlesztés

### Követelmények

- Node.js (ajánlott: legfrissebb LTS verzió)
- npm vagy bun package manager

### Telepítés és futtatás

```sh
# 1. Függőségek telepítése
npm install

# 2. Fejlesztői szerver indítása
npm run dev

# 3. Production build készítése
npm run build

# 4. Production preview
npm run preview
```

A fejlesztői szerver alapértelmezetten a `http://localhost:5173` címen érhető el.

## Környezeti változók

**FONTOS**: A `.env` fájl sensitive információkat tartalmaz és **SOHA** nem szabad feltölteni GitHub-ra!

### Beállítás

1. Másold le a `.env.example` fájlt `.env` néven:
   ```sh
   cp .env.example .env
   ```

2. Töltsd ki a `.env` fájlban a Supabase credentials-t:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. Szerezd be a Supabase credentials-t a [Supabase Dashboard](https://app.supabase.com)-ról:
   - Project Settings → API
   - Másold ki a **Project URL**-t és az **anon/public** API kulcsot

### Biztonság

- A `.env` fájl automatikusan ignorálva van a `.gitignore` által
- **Soha ne commitold** a `.env` fájlt GitHub-ra
- Production környezetben használj environment variables-t (Netlify, Vercel, stb.)
- A `.env.example` fájl csak placeholder értékeket tartalmaz, biztonságos commitolni

## Deployment

A projekt könnyen telepíthető különböző platformokra:
- Netlify
- Vercel
- GitHub Pages
- Vagy bármely statikus hosting szolgáltatás

Build készítése: `npm run build` - az eredmény a `dist/` mappában lesz.
