# Aszódi Bau - Teszt Ellenőrző Lista

Használd ezt az ellenőrző listát, hogy megbizonyosodj arról, hogy minden működik!

## ✅ Adatbázis Ellenőrzés

- [ ] **Supabase SQL Editor**: Futtasd le a `supabase-setup-safe.sql` fájlt
  - Eredmény: "✅ Setup completed successfully!" üzenet

- [ ] **Táblák léteznek**: Supabase Dashboard → Table Editor
  - [ ] `admin_access` tábla létezik
  - [ ] `projects` tábla létezik
  - [ ] `project_images` tábla létezik

- [ ] **Storage Bucket**: Supabase Dashboard → Storage
  - [ ] `images` bucket létezik
  - [ ] A bucket **public** (publikus)
  - [ ] Storage policies be vannak állítva (SELECT, INSERT, DELETE)

## ✅ Weboldal Ellenőrzés

### Főoldal (/)
- [ ] Az oldal betölt hiba nélkül
- [ ] A "Munkáinkból" szekcióban megjelennek a feltöltött projektek
- [ ] A képekre kattintva megnyílik a lightbox
- [ ] A lightbox-ban lehet navigálni a képek között (←, → gombok)

### Képgaléria (/kepgaleria)
- [ ] Az oldal betölt hiba nélkül
- [ ] Megjelennek az összes projekt
- [ ] Minden projekthez megjelennek a képek
- [ ] A képekre kattintva működik a lightbox
- [ ] Ha nincs projekt, akkor "Jelenleg nincsenek megjeleníthető projektek" üzenet jelenik meg

### Admin Bejelentkezés (/admin/login)
- [ ] Az oldal betölt
- [ ] Be tudsz jelentkezni a következő kóddal: `Aszodibau1212345`
- [ ] Sikeres bejelentkezés után átirányít az admin panelre

### Admin Panel (/admin)
- [ ] Az oldal betölt a bejelentkezés után
- [ ] Látod a feltöltött projekteket
- [ ] **Új projekt feltöltése**:
  - [ ] Meg tudod adni a projekt címét
  - [ ] Meg tudod adni a leírást (opcionális)
  - [ ] Tudasz képeket kiválasztani (file picker)
  - [ ] Tudasz képeket beilleszteni (Ctrl/Cmd + V)
  - [ ] A kiválasztott képek előnézete megjelenik
  - [ ] A "Projekt Feltöltése" gomb működik
  - [ ] Sikeres feltöltés után toast notification jelenik meg
  - [ ] Az új projekt megjelenik a listában
- [ ] **Projekt törlése**:
  - [ ] A "Törlés" gombra kattintva megerősítést kér
  - [ ] A megerősítés után a projekt törlődik
  - [ ] Toast notification jelenik meg
- [ ] A "Kijelentkezés" gomb működik

## ✅ Böngésző Konzol Ellenőrzés

Nyisd meg a böngésző konzolt (F12) és ellenőrizd:

- [ ] **Nincs piros (error) üzenet** a konzolon
- [ ] **Supabase konfigurálva**: "✓ Supabase konfigurálva" üzenet látható
- [ ] Látható a Supabase URL a konzolon

## 🐛 Ha Valami Nem Működik

### Hiba: "Supabase nincs konfigurálva"
1. Ellenőrizd a `.env` fájlt
2. Indítsd újra a dev szervert: `npm run dev`
3. Frissítsd a böngészőt (Ctrl/Cmd + Shift + R)

### Hiba: "Az adatbázis táblák nincsenek létrehozva"
1. Futtasd le a `supabase-setup-safe.sql` fájlt
2. Frissítsd a böngészőt

### Hiba: "A 'images' storage bucket nem található"
1. Menj a Supabase Dashboard → Storage
2. Hozz létre egy új bucket-et "images" néven
3. Állítsd be publikusra
4. Add hozzá a storage policies-okat (lásd SETUP.md)

### Hiba: "Load failed" vagy hálózati hiba
1. Ellenőrizd az internet kapcsolatot
2. Ellenőrizd, hogy a `VITE_SUPABASE_URL` helyes-e
3. Ellenőrizd, hogy a Supabase projekt létezik és fut-e

### Képek nem jelennek meg a főoldalon
1. Ellenőrizd, hogy van-e feltöltött projekt az admin panelen
2. Ellenőrizd a böngésző konzolt hibákért
3. Ellenőrizd, hogy a storage bucket publikus-e

## 📝 Megjegyzések

Ha minden működik, készen állsz a production deployment-re! 🚀

Ne felejtsd el:
- Változtasd meg az admin kódot a `supabase-setup-safe.sql` fájlban
- Állítsd be a környezeti változókat a hosting platformon (Vercel/Netlify)
- Ellenőrizd a Supabase projekt limiteit (ingyenes csomag)
