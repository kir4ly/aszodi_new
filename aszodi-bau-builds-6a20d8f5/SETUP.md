# Aszódi Bau Admin Panel - Telepítési útmutató

## Előfeltételek

- Supabase fiók (ingyenes: https://supabase.com)
- Node.js telepítve (v16 vagy újabb)

## 1. Supabase Projekt Beállítása

### 1.1 Supabase Projekt Létrehozása

1. Menj a https://supabase.com címre
2. Jelentkezz be vagy regisztrálj
3. Kattints a "New project" gombra
4. Add meg a projekt nevét és jelszót
5. Várj, amíg a projekt létrejön (pár másodperc)

### 1.2 Adatbázis Táblák Létrehozása

1. A Supabase Dashboard-on menj a "SQL Editor" menüpontba
2. Nyisd meg a `supabase-setup.sql` fájlt ebből a projektből
3. Másold ki az egész tartalmát
4. Illeszd be a Supabase SQL Editor-ba
5. Kattints a "Run" gombra
6. Ellenőrizd, hogy a futtatás sikeres volt-e (zöld pipa jelenik meg)

### 1.3 Storage Bucket Létrehozása

1. A Supabase Dashboard-on menj a "Storage" menüpontba
2. Kattints a "New bucket" gombra
3. Bucket neve: `images`
4. Public bucket: **IGEN** (checked) - Ez fontos!
5. Kattints a "Create bucket" gombra
6. A bucket létrehozása után kattints rá
7. Menj a "Policies" fülre
8. Add hozzá ezeket a policy-kat:
   - **Policy 1**: "Public read access"
     - Operation: SELECT
     - Policy definition: `true`
   - **Policy 2**: "Public insert access"
     - Operation: INSERT
     - Policy definition: `true`
   - **Policy 3**: "Public delete access"
     - Operation: DELETE
     - Policy definition: `true`

### 1.4 API Kulcsok Megszerzése

1. A Supabase Dashboard-on menj a "Settings" > "API" menüpontba
2. Másold ki az alábbi értékeket:
   - **Project URL**: Ez lesz a `VITE_SUPABASE_URL`
   - **anon public**: Ez lesz a `VITE_SUPABASE_ANON_KEY`

## 2. Projekt Beállítása

### 2.1 .env Fájl Beállítása

1. Nyisd meg a `.env` fájlt a projekt gyökérkönyvtárában
2. Töltsd ki az értékeket az előző lépésből:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 2.2 Függőségek Telepítése

```bash
npm install
```

### 2.3 Fejlesztői Szerver Indítása

```bash
npm run dev
```

A weboldal elérhető lesz a `http://localhost:8080` címen.

## 3. Admin Panel Használata

### 3.1 Admin Panel Elérése

1. Menj a `http://localhost:8080/admin/login` címre
2. Add meg a hozzáférési kódot: `Aszodibau1212345`
   - **Fontos**: Változtasd meg ezt a kódot a `supabase-setup.sql` fájlban, majd futtasd újra a scriptet!
3. Kattints a "Bejelentkezés" gombra

### 3.2 Projektek Feltöltése

1. Az admin panelen add meg a projekt címét
2. Opcionálisan add meg a leírást
3. Válassz ki egy vagy több képet:
   - Fájlválasztóval (Ctrl/Cmd + klikk több képhez)
   - Vagy kattints a beillesztési területre és nyomd meg a Ctrl/Cmd + V billentyűt
4. Kattints a "Projekt Feltöltése" gombra

## 4. Hibakeresés

### Hiba: "Supabase nincs konfigurálva"

- Ellenőrizd, hogy a `.env` fájlban helyesen vannak-e beállítva a környezeti változók
- Újraindítás után próbáld meg újra

### Hiba: "Az adatbázis táblák nincsenek létrehozva"

- Futtasd le a `supabase-setup.sql` fájlt a Supabase Dashboard SQL Editor-jában
- Ellenőrizd, hogy a táblák létrejöttek-e a "Table Editor" menüpontban

### Hiba: Képek nem jelennek meg

- Ellenőrizd, hogy a storage bucket neve `images`-e
- Ellenőrizd, hogy a bucket publikus-e
- Ellenőrizd, hogy a policies helyesen vannak-e beállítva

## 5. Éles Használatra

### 5.1 Admin Kód Megváltoztatása

1. Nyisd meg a `supabase-setup.sql` fájlt
2. Változtasd meg ezt a sort:
   ```sql
   VALUES ('Aszodibau1212345', true)
   ```
   Cseréld le a `'Aszodibau1212345'` részt egy biztonságos kódra
3. Futtasd újra a scriptet a Supabase Dashboard-on

### 5.2 Deployment

A projekt deploy-olható Vercel-re, Netlify-ra vagy más hosting szolgáltatásra.
Ne felejtsd el beállítani a környezeti változókat a hosting platformon!

## Támogatás

Ha bármilyen problémád van, ellenőrizd a böngésző konzolt (F12) a részletes hibaüzenetekért.
