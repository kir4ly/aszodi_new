# Aszódi Bau Repository

Ez a repository az Aszódi Bau építőipari vállalkozás weboldalát tartalmazza.

## Projekt struktúra

```
aszodibau/
├── aszodi-bau-builds-6a20d8f5/  # Fő weboldal projekt
│   ├── src/                      # Forráskód
│   ├── public/                   # Statikus fájlok
│   ├── .env.example             # Environment változók sablon
│   ├── .env                     # NINCS git-ben! (lokális config)
│   └── README.md                # Projekt dokumentáció
└── README.md                     # Ez a fájl
```

## Első lépések

1. Navigálj a projekt mappába:
   ```sh
   cd aszodi-bau-builds-6a20d8f5
   ```

2. Kövesd a projekt `README.md` fájlban található utasításokat

## Biztonság

- A sensitive információk (API kulcsok, credentials) `.env` fájlban vannak
- A `.env` fájl **NEM** szerepel a git repository-ban
- Minden projekt mappában van `.env.example` fájl a szükséges környezeti változókkal
- **SOHA** ne commitolj API kulcsokat vagy jelszavakat a repository-ba!

## Environment Variables

Minden projektnek szüksége van a saját `.env` fájljára. Részletes utasítások a projekt saját README.md fájljában találhatók.
