/*
 * ALT INNHOLD SOM ENDRES OFTE LIGGER HER.
 * Endre kontaktinfo, legg til leiligheter eller bytt status uten å røre resten av koden.
 */

const SELSKAP = {
  navn: "Tryggstua AS",
  orgnr: "937 544 421",
  epost: "nicolaidahl00@gmail.com",
  telefon: "", // f.eks. "+47 900 00 000". La stå tom for å skjule.
  by: "Kristiansand",
};

const bildeliste = (mappe, rekkefolge) => rekkefolge.map((n) => `bilder/${mappe}/${String(n).padStart(2, "0")}.jpg`);

/*
 * status: "utleid" | "ledig" | "kommer"
 * pris: månedsleie i kroner, eller null for å skjule (vises som "Leie oppgis ved ledighet")
 * ledigFra: tekst, f.eks. "01.03.2027", eller "" hvis ukjent
 * bilder: filer i mappen bilder/. Det første bildet brukes som forsidebilde.
 * Felter som er null eller tomme vises ikke på siden.
 */
const LEILIGHETER = [
  {
    id: "kronprinsens-gate-41",
    tittel: "Kronprinsens gate 41",
    undertittel: "Lys og moderne leilighet med utsikt over takene i Kvadraturen",
    omrade: "Kvadraturen, Kristiansand",
    postadresse: "Kronprinsens gate 41, 4614 Kristiansand",
    status: "utleid",
    ledigFra: "",
    pris: 12500,
    depositum: 25000,
    areal: 32, // kvadratmeter
    soveplass: "Sovealkove",
    etasje: 4,
    moblert: true,
    dyrehold: true,
    kort: "Fullt møblert leilighet i fjerde etasje med utsikt over Posebyens trehus. Strøm, internett og oppvarming er inkludert.",
    beskrivelse: [
      "Et stilrent og praktisk hjem midt i Kristiansand sentrum. Leiligheten ligger i fjerde etasje og har god planløsning, mye naturlig lys og utsikt over de gamle trehusene i Posebyen, helt bort til domkirken.",
      "Stuen har stor hjørnesofa og TV, og den åpne kjøkkenløsningen har spiseplass og alt av kjøkkenutstyr. Sovealkoven har dobbeltseng, nattbord og skap. I tillegg får du en egen arbeidsplass med skrivepult og skjerm, som passer godt til hjemmekontor eller studier.",
      "Posebyen er en rolig del av Kvadraturen uten støy fra trafikk og byliv, samtidig som det er kort vei til UiA, butikker, kafeer, togstasjon og buss. Bygget har felles takterrasse og vaskerom i kjelleren.",
    ],
    fasiliteter: [
      "Fullt møblert",
      "Utsikt over Kvadraturen",
      "Sovealkove med dobbeltseng",
      "Arbeidsplass med skjerm",
      "Felles takterrasse",
      "Fellesvaskeri i kjeller",
      "Parkett",
      "Egen bod",
    ],
    inkludert: ["Strøm og oppvarming", "Internett", "Vann og avløp", "Møbler og hvitevarer"],
    ikkeInkludert: ["Kabel-TV"],
    bilder: bildeliste("kronprinsens-gate-41", [1, 5, 8, 6, 11, 10, 9, 2, 13, 12, 3, 4, 7]),
  },
  {
    id: "kongens-gate-80",
    tittel: "Kongens gate 80",
    undertittel: "Moderne hybel ved Aquarama og Bystranda, alt inkludert",
    omrade: "Kvadraturen, Kristiansand",
    postadresse: "Kongens gate 80, 4608 Kristiansand",
    status: "utleid",
    ledigFra: "",
    pris: 11000,
    depositum: 11000,
    areal: 28,
    soveplass: "Sovehems",
    etasje: 2,
    moblert: true,
    dyrehold: true,
    kort: "Lys og oppgradert hybel i Kasserna, et steinkast fra Bystranda og Aquarama. Møblert, med heis og alt inkludert i leien.",
    beskrivelse: [
      "Leiligheten ligger i andre etasje i Kasserna, et leilighetsbygg med svært god takhøyde nederst i Kvadraturen, mellom Kongens gate, Elvegata og Østre Strandgate. Du kommer opp med heis eller via et bredt, renovert trapperom.",
      "Den leies ut fullt møblert og har entré, flislagt dusjbad med vaskemaskin, og stue med åpen kjøkkenløsning. En fast stige leder opp til sovehemsen. Kjøkkenet har integrert komfyr, koketopp, kjøleskap og oppvaskmaskin.",
      "Foran bygget ligger en stor parkmessig hage og en leke- og treningspark. Bystranda, Aquarama med svømmehall og treningssenter, Kiwi og Rema ligger rett ved, og det er gangavstand til Markens, Fiskebrygga og Kilden.",
    ],
    fasiliteter: [
      "Fullt møblert",
      "Heis",
      "Sovehems",
      "Oppvaskmaskin og vaskemaskin",
      "Vannbåren varme",
      "Dørcalling",
      "Alarm",
      "Egen bod",
      "Mulighet for leie av P-plass i kjeller",
    ],
    inkludert: ["Strøm", "Oppvarming og varmtvann", "Internett (grunnpakke)", "Vann og avløp"],
    ikkeInkludert: [],
    bilder: bildeliste("kongens-gate-80", [2, 3, 5, 6, 7, 9, 4, 8, 10, 11, 12, 13, 1, 16, 17, 18, 19, 22, 20, 21, 14, 15]),
  },
];

const SPORSMAL = [
  {
    q: "Hvordan melder jeg interesse for en leilighet?",
    a: "Fyll ut skjemaet under Kontakt og velg leiligheten det gjelder. Er den utleid i dag, settes du på interesselisten og får beskjed når den blir ledig.",
  },
  {
    q: "Hvordan foregår kontrakt og betaling?",
    a: "Leiekontrakten signeres digitalt, og husleien faktureres månedlig via Husleie.no. Du får faktura i god tid før forfall.",
  },
  {
    q: "Hva slags depositum kreves?",
    a: "Vi følger husleieloven. Sikkerheten stilles enten som depositum på en sperret depositumskonto i ditt navn eller som depositumsgaranti. Beløpet står i annonsen og avtales i leiekontrakten.",
  },
  {
    q: "Hvor lang er leieperioden og oppsigelsestiden?",
    a: "Leieforholdene våre er normalt tidsubestemte, med en bindingstid i starten og tre måneders gjensidig oppsigelsestid etter det. Detaljene står i kontrakten din.",
  },
  {
    q: "Er det lov med husdyr?",
    a: "Dyrehold er tillatt etter avtale i begge leilighetene. Si fra når du melder interesse, så finner vi ut av det sammen.",
  },
  {
    q: "Hva gjør jeg hvis noe går i stykker?",
    a: "Bruk skjemaet «Meld fra om feil» under For leietakere. Beskriv hva som har skjedd, så tar vi kontakt og avtaler veien videre. Ved akutt fare for liv eller bygning ringer du nødetatene først.",
  },
  {
    q: "Kan leien endres underveis?",
    a: "Leien kan justeres én gang i året i tråd med konsumprisindeksen, slik husleieloven åpner for. Du får skriftlig varsel minst én måned i forveien.",
  },
];
