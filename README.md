# Paadriv-redd-fjorden

Nettside for _Oppdrag: Fjorden Vår_, et fellesskap som kobler enkeltmennesker, virksomheter og organisasjoner på tvers av offentlig, privat og frivillig sektor for en friskere Oslofjord.

## Oppdrag: Fjorden Vår - Nettside

Landingsside og påmeldingsportal der en rekke partnere og pådrivere samarbeider for Oslofjordens fremtid.

## Formål

Nettsiden er en nøytral møteplass der privatpersoner og organisasjoner kan:

- Bli med som frivillig pådriver eller partner i prosjektet
- Knytte kontakt og samarbeide enkelt med andre i nettverket
- Synliggjøre sitt engasjement og bidrag
- Holde seg oppdatert på prosjektet og andre i nettverket

## Teknologi

- [Next.js](https://nextjs.org/) 16 (App Router) med React 19
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Biome](https://biomejs.dev/) for linting og formatering (`npm run lint` / `npm run format`)
- [Airtable](https://airtable.com/) som datakilde for pådrivere, partnere og sitater

## Kom i gang

1. Installer avhengigheter:
   ```bash
   npm install
   ```
2. Kopier `.example.env` til `.env` og fyll ut variablene, se [Miljøvariabler](#miljøvariabler) under.
3. Start utviklingsserveren:
   ```bash
   npm run dev
   ```
   Siden kjører da på [http://localhost:3000](http://localhost:3000).

## Miljøvariabler

Alle miljøvariabler er samlet i `.example.env`. Kopier filen til `.env` og fyll ut følgende:

| Variabel | Beskrivelse |
| --- | --- |
| `AIRTABLE_BASE_URL` | Airtables offentlige API-URL (`https://api.airtable.com/v0`) |
| `AIRTABLE_APP_BASE_ID` | ID-en til Airtable-basen (starter med `app`), finnes i URL-en til basen eller i Airtable API-dokumentasjonen for basen |
| `AIRTABLE_PADRIVERE_TABLE_ID` | Tabell-ID for tabellen med pådrivere (starter med `tbl`) |
| `AIRTABLE_PARTNERE_TABLE_ID` | Tabell-ID for tabellen med partnere (starter med `tbl`) |
| `AIRTABLE_PROSJEKTPORTEFOLJE_TABLE_ID` | Tabell-ID for Prosjektportefølje-tabellen (starter med `tbl`) |
| `AIRTABLE_PROSJEKT_RECORD_ID` | Rad-ID for "Oppdrag Fjorden vår"-prosjektet i Prosjektportefølje-tabellen (starter med `rec`) |
| `AIRTABLE_SITAT_TABLE_ID` | Tabell-ID for tabellen med sitater (starter med `tbl`) |
| `AIRTABLE_PAT` | Personal Access Token med lese- og skrivetilgang til basen (starter med `pat`) |

Tabell- og rad-IDer finner du enklest ved å åpne basen i Airtable og se på URL-en, eller via Airtables API-dokumentasjon for basen (`Help` → `API documentation`). Et Personal Access Token opprettes under [airtable.com/create/tokens](https://airtable.com/create/tokens) og må ha `data.records:read` og `data.records:write`-scope for basen.

## Hvordan innhold vises på siden

Nettsiden viser kun data fra Airtable som oppfyller bestemte krav til godkjenning og samtykke. Dette gjelder pådrivere, partnere og kontaktpersoner på vegne av partnerskap. Kravene styres av avkrysningsfelter i Airtable, ikke av koden, og det er disse feltene som avgjør om noe vises på nettsiden.

Både pådrivere og partnere melder først sin interesse gjennom interesseregistreringsskjemaene på nettsiden. Deretter sendes det automatisk ut en oppfølgingsmail med et skjema der personen/organisasjonen samtykker til å bli vist offentlig og fyller ut det som mangler.

### Pådriver

En pådriver vises på nettsiden når alt dette stemmer i **Pådrivere**-tabellen i Airtable:

- `Godkjent av Pådriv` er avkrysset (gjøres manuelt av Pådriv)
- `Samtykke synlig Pådriver` er avkrysset (settes når personen samtykker til dette i oppfølgingsskjemaet "Synlig Pådriver")
- `Prosjekt`-feltet inneholder "Oppdrag Fjorden vår" (settes automatisk når interesseregistreringen skjer via nettsiden)
- `Navn` er fylt ut

I oppfølgingsskjemaet kan pådriveren også laste opp et profilbilde og oppdatere motivasjonsteksten. Lar man de feltene stå tomme, blir man synlig på nettsiden uten profilbilde, mens motivasjonsteksten fra den opprinnelige interesseregistreringen blir stående.

### Partner

En partner vises på nettsiden når alt dette stemmer i **Partnere**-tabellen i Airtable:

- `Godkjent av Pådriv` er avkrysset (gjøres manuelt av Pådriv)
- `Navn på organisasjon` er fylt ut
- Et bilde er lastet opp i `Logo`-feltet (dette er obligatorisk i oppfølgingsskjemaet "Synlig partner")

### Kontaktperson for en partner

Kontaktinformasjonen til en partner (navn, bilde, e-post, telefon) vises kun når:

- `Samtykke synlig kontaktperson` er avkrysset
- `Navn kontaktperson` er fylt ut

Begge deler settes i et valgfritt steg i oppfølgingsskjemaet "Synlig partner", der kontaktpersonen kan velge å være synlig på nettsiden og eventuelt laste opp et profilbilde.

Hvis ett eller begge kravene ikke er oppfylt, vises partneren fortsatt på nettsiden, men uten kontaktperson. Profilbilde er heller ikke her et krav. Kontaktpersonen kan derfor være synlig selv om det ikke er lastet opp et bilde.
