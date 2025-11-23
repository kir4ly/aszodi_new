# Projekt Galéria Rendszer - Használati Útmutató

## Áttekintés

Az új rendszer lehetővé teszi, hogy **több képet** tölts fel egy projekthez, és ezek a projektek megjelenjenek a **Referenciáink** oldalon gyönyörű kártyák formájában képgalériával.

---

## 1. Adatbázis Migráció (FONTOS - ELŐSZÖR EZT TEDD!)

### Lépések:

1. **Jelentkezz be a Supabase Dashboard-ra:**
   - Menj a [Supabase Dashboard](https://app.supabase.com)
   - Válaszd ki a projektedet

2. **Futtasd a migration scriptet:**
   - Bal oldali menü > **SQL Editor**
   - Kattints **New query**
   - Nyisd meg a projekt mappában a `migration-to-projects.sql` fájlt
   - Másold be a teljes tartalmát az SQL Editor-ba
   - Kattints **Run** (vagy F5)

3. **Ellenőrzés:**
   - Bal oldali menü > **Database** > **Tables**
   - Látnod kell:
     - ✅ `projects` táblát
     - ✅ `project_images` táblát
     - ❌ `gallery_images` tábla már nem létezik (törölve lett)

---

## 2. Az Admin Panel Használata

### Új Projekt Létrehozása

1. **Bejelentkezés:**
   - Menj: `/admin/login`
   - Add meg a hozzáférési kódot

2. **Projekt Feltöltése:**
   - Kattints a **Képek** fülre
   - Töltsd ki:
     - **Projekt Címe** (kötelező): pl. "Családi ház teljes felújítása Kecskeméten"
     - **Leírás** (opcionális): pl. "2024-ben befejezett projekt, teljes belsőépítészeti átalakítás"
     - **Képek Kiválasztása** (kötelező): Válassz ki több képet egyszerre
       - Windows: `Ctrl + klikk` több kép kiválasztásához
       - Mac: `Cmd + klikk` több kép kiválasztásához
       - Vagy: `Shift + klikk` egy tartomány kiválasztásához

3. **Előnézet:**
   - A kiválasztott képek előnézete megjelenik a feltöltés előtt
   - Eltávolíthatsz képeket az X gombbal (hover-re látható)

4. **Feltöltés:**
   - Kattints **Projekt Feltöltése**
   - Várj, amíg minden kép feltöltődik
   - Sikeres feltöltés után automatikusan megjelenik a projekt a listában

### Projekt Törlése

- Minden projektnél van egy **Törlés** gomb
- Kattints rá → megerősítés → a projekt és **összes képe** törlődik (storage-ból is)

---

## 3. Projektek Megjelenítése a Referenciáink Oldalon

### Automatikus megjelenés:

- A feltöltött projektek automatikusan megjelennek a `/kepgaleria` oldalon
- **Projekt kártyák** formájában jelennek meg:
  - Cím
  - Leírás
  - Képek száma
  - **Képgaléria slideshow-val**

### Galéria funkciók:

- **Több kép esetén:**
  - Balra/jobbra nyilak a navigációhoz (hover-re látható)
  - Alsó indikátor pontok (kattintható)
  - Automatikus körkörös navigáció
- **Egy kép esetén:**
  - Csak a kép jelenik meg navigáció nélkül

---

## 4. Fájlstruktúra Változások

### Módosított fájlok:

1. **`supabase-setup.sql`** - Frissített adatbázis séma
2. **`src/lib/supabase.ts`** - Új TypeScript típusok és függvények:
   - `Project` interface
   - `ProjectImage` interface
   - `createProject()` - Projekt + képek feltöltése
   - `getProjects()` - Projektek lekérdezése
   - `deleteProject()` - Projekt törlése

3. **`src/components/admin/ImageUploader.tsx`** - Teljesen újraírva:
   - Többképes feltöltés támogatása
   - Képek előnézete
   - Projekt alapú kezelés

4. **`src/pages/Gallery.tsx`** - Teljesen újraírva:
   - Dinamikus betöltés Supabase-ből
   - Projekt kártyák képgalériával
   - Slideshow navigáció

### Új fájlok:

1. **`migration-to-projects.sql`** - Adatbázis migráció script
2. **`PROJEKT-GALERIA-UTMUTATO.md`** - Ez az útmutató

---

## 5. Adatbázis Struktúra

### `projects` tábla:
```sql
- id: UUID (elsődleges kulcs)
- title: TEXT (kötelező, projekt címe)
- description: TEXT (opcionális, projekt leírása)
- created_at: TIMESTAMP (létrehozás időpontja)
```

### `project_images` tábla:
```sql
- id: UUID (elsődleges kulcs)
- project_id: UUID (külső kulcs -> projects.id, CASCADE DELETE)
- image_url: TEXT (kép URL-je a Supabase storage-ból)
- display_order: INTEGER (képek sorrendje, 0-tól kezdve)
- created_at: TIMESTAMP (létrehozás időpontja)
```

### Storage struktúra:
```
Supabase Storage > images/
├── projects/
│   ├── {project-id-1}/
│   │   ├── abc123-timestamp.jpg
│   │   ├── def456-timestamp.png
│   │   └── ...
│   ├── {project-id-2}/
│   │   └── ...
```

---

## 6. Gyakori Kérdések (FAQ)

### ❓ Hány képet tölthetek fel egy projekthez?

Nincs technikai limit, de ajánlott 3-15 kép között maradni a jó teljesítmény érdekében.

### ❓ Milyen képformátumokat támogat?

Minden böngésző által támogatott képformátumot: JPG, PNG, WEBP, GIF, SVG.

### ❓ Mi történik, ha törölök egy projektet?

- A projekt rekord törlődik az adatbázisból
- Minden hozzá tartozó kép rekord törlődik (CASCADE)
- Minden hozzá tartozó kép fájl törlődik a storage-ból

### ❓ Szerkeszthetek egy már feltöltött projektet?

Jelenleg nem. Törölnöd kell a projektet és újra fel kell tölteni. (Ezt később lehet fejleszteni.)

### ❓ Mi történt a régi `gallery_images` táblával?

A migráció során töröltük. Az új rendszer a `projects` és `project_images` táblákat használja.

### ❓ Átmigrálhatom a régi képeket az új rendszerbe?

A jelenlegi migráció nem őrzi meg a régi képeket (tiszta újrakezdés). Ha szeretnéd megőrizni őket, kérj egyedi migration scriptet.

---

## 7. Technikai Megjegyzések

### TypeScript típusok:

```typescript
interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

interface Project {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  images?: ProjectImage[];
}
```

### API használat:

```typescript
// Projekt létrehozása
await createProject(
  "Projekt cím",
  "Projekt leírás",
  [file1, file2, file3] // File[] array
);

// Projektek lekérdezése (képekkel együtt)
const projects = await getProjects(); // Project[]

// Projekt törlése (képekkel együtt)
await deleteProject(projectId);
```

---

## 8. Következő Lépések (Opcionális Fejlesztések)

Jövőbeli fejlesztési lehetőségek:

1. ✨ Projekt szerkesztés (cím, leírás módosítása)
2. ✨ Képek átrendezése drag & drop-pal
3. ✨ Egyedi képek törlése egy projektből
4. ✨ További képek hozzáadása meglévő projekthez
5. ✨ Lightbox/modal a nagyobb képnézethez
6. ✨ Kategóriák/címkék a projektekhez
7. ✨ Keresés és szűrés a Referenciáink oldalon
8. ✨ Admin-only RLS policy-k (jelenleg bárki írhat)

---

## 9. Problémák Elhárítása

### "Hiba a projektek betöltése során"
- Ellenőrizd a Supabase connection-t (.env fájl)
- Ellenőrizd, hogy futtattad-e a migrációt
- Nézd meg a böngésző Console-ban a hibákat (F12)

### "Hiba a projekt létrehozása során"
- Ellenőrizd, hogy kitöltötted-e a projekt címét
- Ellenőrizd, hogy kiválasztottál-e legalább 1 képet
- Ellenőrizd a Supabase storage bucket policy-kat

### Képek nem jelennek meg
- Ellenőrizd a Supabase storage bucket beállításokat
- Ellenőrizd, hogy a `images` bucket publikus-e
- Ellenőrizd a browser Network tab-ot (F12)

---

## 10. Összefoglalás

✅ **Mit csináltunk:**
1. Új `projects` és `project_images` táblák
2. Többképes feltöltés támogatása
3. Admin panel projekt kezelés
4. Referenciáink oldal dinamikus betöltés
5. Képgaléria slideshow minden projekthez

✅ **Amit elvégeztünk helyetted:**
- Adatbázis séma frissítése
- TypeScript típusok és függvények
- Admin panel teljes átalakítása
- Gallery oldal teljes átalakítása
- Migráció script

🚀 **Kész vagy!** Most már feltölthetsz projekteket több képpel az admin panelen, és azok automatikusan megjelennek a Referenciáink oldalon!

---

**Készítette:** Claude Code
**Dátum:** 2025-11-22
**Verzió:** 1.0
