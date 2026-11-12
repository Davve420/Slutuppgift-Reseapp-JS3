# Världsvän – reseapp

En responsiv reseapp byggd med React, TypeScript och Vite. Landlistan hämtar data från countries.dev; sökning, regionfilter och paginering arbetar sedan lokalt med den cachade listan.

## Teknikval

Jag valde React med Vite eftersom appen är en klientbaserad sida med flera vyer och API-anrop. React Router hanterar navigeringen, TanStack Query sköter hämtning och cache, och TypeScript hjälper till att hålla API-data och appens landmodell tydliga. Vite ger en enkel lokal utvecklingsserver och ett produktionsbygge.

## Kom igång

```bash
npm install
npm run dev
```

Produktionsbygge: `npm run build`.

## Vad som ingår

- Landlista med flagga, namn, region och huvudstad från countries.dev.
- Sökning, regionfilter och paginering i appen; vyns parametrar sparas i URL:en.
- Detaljsida med basfakta, väder från Open-Meteo och svensk introduktion/bild från Wikipedia.
- React Query-cache, laddningslägen, felmeddelanden och möjlighet att försöka igen.
- Responsiv layout, semantisk HTML, tangentbordsfokus och textalternativ för bilder/flagga.

Projektet använder countries.dev enligt grundkravet G. VG-kravet med REST Countries v5 och de extra fördjupningarna ingår inte.

## Före inlämning

- [x] `npm run build` går igenom.
- [x] Manuellt provat sökning, regionfilter, detaljsida, tillbaka-navigering, ogiltig landskod, 404 och 375 px utan horisontell scroll.
- [ ] Publicera appen på Netlify eller Vercel och lägg in den publika **app-URL:en** här. GitHub-adressen är bara källkodsrepo.
- [ ] Lägg upp koden på GitHub, skapa minst 10 meningsfulla commits och mergea minst en feature-branch via pull request. GitHub-repot är för närvarande tomt, så detta behöver göras på riktigt; historiken ska inte fejkas.
- [ ] Skriv en personlig reflektion på 3–5 meningar.

**GitHub:** [Davve420/Slutuppgift-Reseapp-JS3](https://github.com/Davve420/Slutuppgift-Reseapp-JS3)
**Deployment:** Inte publicerad ännu.

## AI-redovisning

Jag har använt VS Codes inbyggda AI som stöd för att jämföra projektet med uppgiftskraven, granska projektstrukturen och kontrollera bygget. Jag ansvarar själv för att granska förslagen och kunna förklara koden.

## Reflektion

Skriv här 3–5 egna meningar om vad som gick bra, vad som var svårast och vad du skulle göra annorlunda nästa gång. Avsnittet är inte färdigt förrän det beskriver din egen upplevelse.

## Förslag på videoredovisning (8–10 minuter)

1. **0:00–1:00 – Syfte och teknikval:** visa startsidan och berätta kort varför du valde React/Vite, React Router och TanStack Query.
2. **1:00–3:30 – Demo av listan:** sök `fin`, välj `Europe`, prova `zzz`, byt sida och visa hur URL:en följer sökning/filter. Visa gärna Network-fliken: landlistan ska inte hämtas på nytt när du filtrerar.
3. **3:30–6:00 – Landdetalj:** öppna Finland och visa basfakta, väder och Wikipedia. Visa att tillbaka-länken bevarar listans vy.
4. **6:00–7:30 – Förklara ett tekniskt val:** sök/filter/sida ligger i URL:en, medan API-data cachas med React Query. Väder och Wikipedia är separata frågor så att ett fel inte behöver slå ut resten.
5. **7:30–8:30 – Kvalitet:** visa `/country/XYZ` och `/finns-inte`; nämn tangentbord, fokusmarkering, alt-texter och mobilanpassning.
6. **8:30–10:00 – Egen reflektion och frågor:** berätta vad som gick bra, vad som var svårast och vad du skulle ändra nästa gång.

Öva en gång med appen redan laddad och förklara med egna ord. Visa bara kodfiler om det hjälper att förklara ett val: `src/pages/CountryListPage.tsx`, `src/pages/CountryDetailPage.tsx`, `src/api/countries.ts` och `src/api/weather.ts`.
