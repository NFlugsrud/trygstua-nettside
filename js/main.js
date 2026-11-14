/* Felles logikk for alle sidene. Innholdet hentes fra js/data.js. */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const kr = (n) => new Intl.NumberFormat("nb-NO").format(n) + " kr";

const STATUS = {
  utleid: { tekst: "Utleid", klasse: "status--utleid" },
  ledig: { tekst: "Ledig", klasse: "status--ledig" },
  kommer: { tekst: "Kommer", klasse: "status--kommer" },
};

function statusMerke(l) {
  const s = STATUS[l.status] || STATUS.utleid;
  const tekst = l.status === "ledig" && l.ledigFra ? `Ledig fra ${l.ledigFra}` : s.tekst;
  return `<span class="status ${s.klasse}">${esc(tekst)}</span>`;
}

function nokkeltall(l) {
  const deler = [];
  if (l.areal) deler.push(`${l.areal} m²`);
  if (l.soveplass) deler.push(l.soveplass);
  if (l.etasje) deler.push(`${l.etasje}. etasje`);
  if (l.moblert === true) deler.push("Møblert");
  if (l.moblert === false) deler.push("Umøblert");
  return deler;
}

function prisTekst(l) {
  return l.pris ? `${kr(l.pris)} <span class="per">/ mnd</span>` : `<span class="pris-ukjent">Leie oppgis ved ledighet</span>`;
}

/* ---------- Felles: topp, bunn, kontaktinfo ---------- */

function fellesOppsett() {
  $$("[data-aar]").forEach((el) => (el.textContent = new Date().getFullYear()));
  $$("[data-orgnr]").forEach((el) => (el.textContent = SELSKAP.orgnr));
  $$("[data-epost]").forEach((el) => {
    el.textContent = SELSKAP.epost;
    if (el.tagName === "A") el.href = `mailto:${SELSKAP.epost}`;
  });
  $$("[data-telefon]").forEach((el) => {
    if (!SELSKAP.telefon) return el.closest("[data-telefon-rad]")?.remove();
    el.textContent = SELSKAP.telefon;
    if (el.tagName === "A") el.href = `tel:${SELSKAP.telefon.replace(/\s/g, "")}`;
  });

  const knapp = $(".meny-knapp");
  const meny = $(".meny");
  if (knapp && meny) {
    knapp.addEventListener("click", () => {
      const apen = meny.classList.toggle("er-apen");
      knapp.setAttribute("aria-expanded", apen);
    });
    $$("a", meny).forEach((a) =>
      a.addEventListener("click", () => {
        meny.classList.remove("er-apen");
        knapp.setAttribute("aria-expanded", "false");
      })
    );
  }

  const topp = $(".topp");
  if (topp) {
    const oppdater = () => topp.classList.toggle("har-skygge", window.scrollY > 8);
    oppdater();
    window.addEventListener("scroll", oppdater, { passive: true });
  }
}

/* ---------- Forside ---------- */

function visLeilighetskort() {
  const liste = $("#leilighetsliste");
  if (!liste) return;
  liste.innerHTML = LEILIGHETER.map(
    (l) => `
    <article class="kort">
      <a class="kort__bilde" href="leilighet.html?id=${encodeURIComponent(l.id)}" tabindex="-1" aria-hidden="true">
        <img src="${esc(l.bilder[0])}" alt="" loading="lazy">
        ${statusMerke(l)}
      </a>
      <div class="kort__innhold">
        <p class="kort__omrade">${esc(l.omrade)}</p>
        <h3><a href="leilighet.html?id=${encodeURIComponent(l.id)}">${esc(l.tittel)}</a></h3>
        <p class="kort__tekst">${esc(l.kort)}</p>
        <ul class="tagger">${nokkeltall(l).map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
        <div class="kort__bunn">
          <p class="pris">${prisTekst(l)}</p>
          <a class="lenke-pil" href="leilighet.html?id=${encodeURIComponent(l.id)}">Se leiligheten</a>
        </div>
      </div>
    </article>`
  ).join("");

  const antall = $("[data-antall]");
  if (antall) antall.textContent = LEILIGHETER.length;
}

function visSporsmal() {
  const boks = $("#sporsmal-liste");
  if (!boks) return;
  boks.innerHTML = SPORSMAL.map(
    (s) => `<details class="sporsmal"><summary>${esc(s.q)}</summary><p>${esc(s.a)}</p></details>`
  ).join("");
}

function fyllLeilighetsvalg() {
  $$("select[data-leiligheter]").forEach((sel) => {
    const valgt = new URLSearchParams(location.search).get("leilighet");
    sel.insertAdjacentHTML(
      "beforeend",
      LEILIGHETER.map((l) => `<option value="${esc(l.tittel)}"${l.id === valgt ? " selected" : ""}>${esc(l.tittel)}</option>`).join("")
    );
  });
}

/*
 * Skjemaene har ingen server bak seg. De åpner brukerens e-postprogram
 * med en ferdig utfylt melding til adressen i SELSKAP.epost.
 */
function skjemaOppsett() {
  $$("form[data-epostskjema]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const linjer = [];
      for (const [navn, verdi] of data.entries()) {
        if (!verdi || navn === "samtykke") continue;
        const etikett = form.querySelector(`[name="${navn}"]`)?.dataset.etikett || navn;
        linjer.push(navn === "melding" ? `\n${verdi}` : `${etikett}: ${verdi}`);
      }
      const emne = `${form.dataset.emne}${data.get("leilighet") ? `: ${data.get("leilighet")}` : ""}`;
      const url = `mailto:${SELSKAP.epost}?subject=${encodeURIComponent(emne)}&body=${encodeURIComponent(linjer.join("\n"))}`;
      window.location.href = url;
      const svar = $(".skjema__svar", form);
      if (svar) {
        svar.hidden = false;
        svar.innerHTML = `E-postprogrammet ditt åpnes nå med en ferdig utfylt melding. Trykk send der for å fullføre. Skjer det ingenting, kan du skrive direkte til <a href="mailto:${esc(SELSKAP.epost)}">${esc(SELSKAP.epost)}</a>.`;
      }
    });
  });
}

function faneOppsett() {
  const faner = $$("[role=tab]");
  faner.forEach((fane) =>
    fane.addEventListener("click", () => {
      faner.forEach((f) => {
        const aktiv = f === fane;
        f.setAttribute("aria-selected", aktiv);
        $(`#${f.getAttribute("aria-controls")}`).hidden = !aktiv;
      });
    })
  );
  if (location.hash === "#feil") $("#fane-feil")?.click();
  $$("[data-fane-lenke]").forEach((a) => a.addEventListener("click", () => $("#fane-feil")?.click()));
}

/* ---------- Leilighetsside ---------- */

function visLeilighet() {
  const rot = $("#leilighet");
  if (!rot) return;
  const id = new URLSearchParams(location.search).get("id");
  const l = LEILIGHETER.find((x) => x.id === id);

  if (!l) {
    rot.innerHTML = `
      <div class="tom">
        <h1>Fant ikke leiligheten</h1>
        <p>Lenken kan være utdatert. Du finner alle leilighetene våre på forsiden.</p>
        <a class="knapp" href="index.html#leiligheter">Se leilighetene</a>
      </div>`;
    return;
  }

  document.title = `${l.tittel} | ${SELSKAP.navn}`;
  const kart = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.postadresse)}`;
  const liste = (tittel, punkter, klasse = "") =>
    punkter.length
      ? `<div class="punktboks"><h3>${tittel}</h3><ul class="sjekkliste ${klasse}">${punkter.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div>`
      : "";
  const fakta = [
    ["Adresse", l.postadresse],
    ["Areal", l.areal ? `${l.areal} m²` : null],
    ["Soveplass", l.soveplass],
    ["Etasje", l.etasje ? `${l.etasje}.` : null],
    ["Møblering", l.moblert === true ? "Møblert" : l.moblert === false ? "Umøblert" : null],
    ["Månedsleie", l.pris ? kr(l.pris) : null],
    ["Depositum", l.depositum ? kr(l.depositum) : null],
    ["Dyrehold", l.dyrehold === true ? "Tillatt etter avtale" : null],
    ["Ledig fra", l.ledigFra || null],
  ].filter(([, v]) => v);

  const cta =
    l.status === "ledig"
      ? { tittel: "Interessert?", tekst: "Send oss noen linjer om deg selv, så avtaler vi visning.", knapp: "Søk om å leie" }
      : { tittel: "Utleid akkurat nå", tekst: "Sett deg på interesselisten, så får du beskjed når leiligheten blir ledig.", knapp: "Sett meg på listen" };

  rot.innerHTML = `
    <nav class="brodsmuler" aria-label="Brødsmulesti">
      <a href="index.html">Forside</a><span aria-hidden="true">/</span>
      <a href="index.html#leiligheter">Leiligheter</a><span aria-hidden="true">/</span>
      <span>${esc(l.tittel)}</span>
    </nav>

    <header class="l-topp">
      <div>
        <p class="overtittel">${esc(l.omrade)}</p>
        <h1>${esc(l.tittel)}</h1>
        ${l.undertittel ? `<p class="ingress">${esc(l.undertittel)}</p>` : ""}
        <ul class="tagger">${nokkeltall(l).map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
      </div>
      ${statusMerke(l)}
    </header>

    <div class="galleri galleri--${Math.min(l.bilder.length, 5)}">
      ${l.bilder
        .slice(0, 5)
        .map(
          (b, i) =>
            `<button type="button" class="galleri__rute" data-bilde="${i}" aria-label="Vis bilde ${i + 1} av ${l.bilder.length}"><img src="${esc(b)}" alt="${esc(l.tittel)}, bilde ${i + 1}"></button>`
        )
        .join("")}
      ${l.bilder.length > 1 ? `<button type="button" class="galleri__alle" data-bilde="0">Se alle ${l.bilder.length} bilder</button>` : ""}
    </div>

    <div class="l-kolonner">
      <div class="l-hoved">
        <h2>Om leiligheten</h2>
        ${l.beskrivelse.map((p) => `<p>${esc(p)}</p>`).join("")}

        <div class="punktrutenett">
          ${liste("Fasiliteter", l.fasiliteter)}
          ${liste("Inkludert i leien", l.inkludert)}
          ${liste("Ikke inkludert", l.ikkeInkludert, "sjekkliste--nei")}
        </div>

        <h2>Nøkkelinformasjon</h2>
        <dl class="fakta">
          ${fakta.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}
        </dl>

        <h2>Beliggenhet</h2>
        <p>${esc(l.postadresse)}. Leiligheten ligger i Kvadraturen, med gangavstand til butikker, kafeer, kollektivtransport og sjøen.</p>
        <a class="lenke-pil" href="${kart}" target="_blank" rel="noopener">Åpne i kart</a>
      </div>

      <aside class="l-side">
        <div class="sideboks">
          <p class="pris pris--stor">${prisTekst(l)}</p>
          <h3>${cta.tittel}</h3>
          <p>${cta.tekst}</p>
          <a class="knapp knapp--full" href="index.html?leilighet=${encodeURIComponent(l.id)}#kontakt">${cta.knapp}</a>
          <p class="liten">Eller send e-post til <a href="mailto:${esc(SELSKAP.epost)}">${esc(SELSKAP.epost)}</a></p>
        </div>
      </aside>
    </div>`;

  bildeviser(l);
}

/* Fullskjermvisning av bilder, med piltaster og sveip. */
function bildeviser(l) {
  const dialog = document.createElement("dialog");
  dialog.className = "viser";
  dialog.innerHTML = `
    <button type="button" class="viser__lukk" aria-label="Lukk">×</button>
    <button type="button" class="viser__pil viser__pil--forrige" aria-label="Forrige bilde">‹</button>
    <img alt="">
    <button type="button" class="viser__pil viser__pil--neste" aria-label="Neste bilde">›</button>
    <p class="viser__teller" aria-live="polite"></p>`;
  document.body.append(dialog);

  const bilde = $("img", dialog);
  let nr = 0;
  const vis = (i) => {
    nr = (i + l.bilder.length) % l.bilder.length;
    bilde.src = l.bilder[nr];
    bilde.alt = `${l.tittel}, bilde ${nr + 1}`;
    $(".viser__teller", dialog).textContent = `${nr + 1} / ${l.bilder.length}`;
  };

  $$("[data-bilde]").forEach((k) =>
    k.addEventListener("click", () => {
      vis(Number(k.dataset.bilde));
      dialog.showModal();
    })
  );
  $(".viser__lukk", dialog).addEventListener("click", () => dialog.close());
  $(".viser__pil--forrige", dialog).addEventListener("click", () => vis(nr - 1));
  $(".viser__pil--neste", dialog).addEventListener("click", () => vis(nr + 1));
  dialog.addEventListener("click", (e) => e.target === dialog && dialog.close());
  dialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") vis(nr - 1);
    if (e.key === "ArrowRight") vis(nr + 1);
  });
  let startX = null;
  dialog.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX), { passive: true });
  dialog.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) vis(nr + (dx < 0 ? 1 : -1));
    startX = null;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fellesOppsett();
  visLeilighetskort();
  visSporsmal();
  fyllLeilighetsvalg();
  skjemaOppsett();
  faneOppsett();
  visLeilighet();

  // Innholdet tegnes etter at siden er lastet, så vi hopper til ankeret på nytt.
  if (location.hash.length > 1) {
    const mal = document.getElementById(location.hash.slice(1));
    if (mal) requestAnimationFrame(() => mal.scrollIntoView({ behavior: "instant" }));
  }
});
