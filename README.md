# Trygstua AS – nettside

Nettside for Trygstua AS, som leier ut små leiligheter i Kristiansand sentrum.

Siden er ren HTML, CSS og JavaScript. Det finnes ingen byggesteg og ingen avhengigheter som må installeres.

## Kjøre lokalt

Dobbeltklikk på `start.command`, eller kjør dette i terminalen fra prosjektmappen:

```bash
python3 -m http.server 8000
```

Åpne deretter http://localhost:8000 i nettleseren.

## Endre innhold

Alt som endres ofte ligger i `js/data.js`:

- **Kontaktinfo:** `SELSKAP` (e-post, telefon, org.nr.)
- **Leiligheter:** `LEILIGHETER`. Bytt `status` mellom `"utleid"`, `"ledig"` og `"kommer"`, oppdater pris, tekst og fasiliteter, eller kopier en blokk for å legge til en ny leilighet.
- **Spørsmål og svar:** `SPORSMAL`

Bilder ligger i `bilder/<leilighet>/`. Rekkefølgen styres av tallene i `bildeliste(...)` i `js/data.js`, og det første bildet brukes som forsidebilde.

Tekstene på forsiden ligger direkte i `index.html`.

## Struktur

```
index.html        Forside
leilighet.html    Side for én leilighet (leilighet.html?id=...)
personvern.html   Personvernerklæring
css/style.css     Design
js/data.js        Innhold: selskap, leiligheter, spørsmål
js/main.js        Logikk: kort, bildegalleri, skjemaer, meny
bilder/           Foto
```

## Skjemaene

Skjemaene har ingen server bak seg. De åpner besøkendes e-postprogram med en ferdig utfylt melding til adressen i `SELSKAP.epost`. Ønsker du at henvendelser sendes direkte fra siden, kan skjemaene kobles til en tjeneste som Formspree senere.

## GitHub

Mappen er allerede et git-repo. Slik kobler du det til GitHub første gang:

```bash
gh auth login
```

```bash
gh repo create trygstua-nettside --private --source=. --push
```

Etter det publiserer du endringer slik:

```bash
git add -A && git commit -m "Beskriv endringen" && git push
```

Vil du ha siden på nett, kan den publiseres gratis med GitHub Pages (Settings → Pages → Deploy from branch → `main`). Merk at GitHub Pages på gratisplanen krever at repoet er offentlig.
