# Världsvän – reseapp

En responsiv reseapp där du kan söka bland världens länder, filtrera efter region och läsa mer om ett land. Appen hämtar landdata från countries.dev, väder från Open-Meteo och en introduktion med eventuell bild från Wikipedia.

## Teknik

Appen är byggd med React, TypeScript och Vite. React delar upp gränssnittet i sidor och komponenter, React Router hanterar navigeringen och TanStack Query sköter API-hämtning, laddning, fel och cache. Sökning, region och sida ligger i URL:en så att vyn går att ladda om och dela.

## Kom igång

```bash
npm install
npm run dev
```

Skapa en produktionsversion med `npm run build`.

## Funktioner

- Landlista med flagga, namn, region och huvudstad. Listan hämtas i ett anrop; sökning, filtrering och paginering sker lokalt.
- URL-styrd sökning, region och paginering.
- Detaljsidor med landfakta, aktuellt väder samt svensk Wikipedia-text och eventuell bild.
- Separata laddnings- och felmeddelanden med möjlighet att försöka igen.
- Responsiv layout, semantiska element, tangentbordsfokus och textbeskrivningar för flaggor och bilder.

Landdata använder countries.dev enligt grundkravet G. REST Countries v5 och de extra VG-fördjupningarna ingår inte.

## Länkar

- [x] `npm run build` går igenom.
- [x] Manuellt provat sökning, regionfilter, detaljsida, tillbaka-navigering, ogiltig landskod, 404 och 375 px utan horisontell scroll.
- [ ] Publicera appen på Netlify eller Vercel och lägg in den publika **app-URL:en** här. GitHub-adressen är bara källkodsrepo.
- [ ] Lägg upp koden på GitHub, skapa minst 10 meningsfulla commits och mergea minst en feature-branch via pull request. GitHub-repot är för närvarande tomt, så detta behöver göras på riktigt; historiken ska inte fejkas.
- [ ] Skriv en personlig reflektion på 3–5 meningar.

**GitHub:** [Davve420/Slutuppgift-Reseapp-JS3](https://github.com/Davve420/Slutuppgift-Reseapp-JS3)
**Deployment:** https://varldsvan.netlify.app/

## AI-redovisning

Jag använde VS Codes inbyggda AI-assistent för att ta fram huvuddelen av appens kod utifrån uppgiftskraven. AI:n skrev även dokumentationen i den här README-filen och hjälpte till att kontrollera bygget och prova appens viktigaste flöden. Jag ansvarar för att förstå och kunna förklara koden i projektet, även de delar som AI:n skrev.

## Reflektion

Jag tyckte uppgiften var intressant, särskilt att kombinera API-data med sökning och filtrering. Under tidspressen var det en fördel att kunna fokusera på det tekniska utan att behöva göra designen extravagant, även om jag tycker om att arbeta med utseende. Det svåraste var tiden, vilket gjorde att jag använde AI som stöd för delar som annars hade tagit lång tid; jag följde arbetet och granskade förslagen mot kraven. Nästa gång skulle jag börja tidigare och dela upp arbetet i mindre steg för att hinna testa och förstå mer själv. Trots frånvaro och sjukdom har projektet stärkt mina React-kunskaper, och jag har också byggt om min portfolio i React, vilket var både pilligt och roligt.
