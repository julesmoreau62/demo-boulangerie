/* Boulangerie Delcourt — démo Premium, la nuit au fournil.
   La page suit l'heure d'Étaples : le haut dit ce qui se passe au fournil à cette minute,
   la nuit se déroule au défilement, le ticket s'imprime pendant qu'on choisit son pain.
   En plus : fournées du jour en direct, version anglaise, plan chargé à la demande.
   Sans JavaScript, tout le contenu reste lisible. */
(function () {
  "use strict";

  /* --- Données ------------------------------------------------------------- */
  // Minutes depuis minuit, heure de Paris. 0 = dimanche.
  var HORAIRES = { 0: [420, 750], 1: [405, 1170], 2: [405, 1170], 3: null, 4: [405, 1170], 5: [405, 1170], 6: [405, 1140] };
  var FOURNEES = { 0: [420, 600], 1: [405, 690, 1020], 2: [405, 690, 1020], 3: [], 4: [405, 690, 1020], 5: [405, 690, 1020], 6: [405, 690, 1020] };
  var CONTENU_FOURNEE = {
    405: { fr: "Baguettes, pains de campagne, croissants et pains au chocolat", en: "Baguettes, country loaves, croissants and pains au chocolat" },
    420: { fr: "Baguettes, pains de campagne, croissants et pains au chocolat", en: "Baguettes, country loaves, croissants and pains au chocolat" },
    600: { fr: "Tradition, brioches et tartes pour le déjeuner du dimanche", en: "Traditional baguettes, brioches and tarts for Sunday lunch" },
    690: { fr: "Tradition et ficelles, pour les sandwichs du midi", en: "Traditional baguettes and ficelles, in time for lunch" },
    1020: { fr: "Tradition, pain du soir et tarte au sucre encore tiède", en: "Traditional baguettes, evening bread and a still-warm sugar tart" }
  };
  var JOURS = {
    fr: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
    en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  };
  // Photos du hublot : [fichier, plus grande taille disponible, texte alternatif]
  var PHOTOS = {
    levain: ["levain", 800, { fr: "Une main laisse tomber du levain dans un saladier en verre", en: "A hand drops starter into a glass bowl" }],
    petrissage: ["petrissage", 800, { fr: "Deux mains pétrissent une boule de pâte", en: "Two hands knead a ball of dough" }],
    faconnage: ["faconnage", 534, { fr: "Un boulanger façonne des baguettes sur une plaque", en: "A baker shapes baguettes on a tray" }],
    lame: ["lame", 800, { fr: "Un nuage de farine tombe sur une miche", en: "A cloud of flour falls over a loaf" }],
    defournement: ["defournement", 800, { fr: "Des miches refroidissent sur un chariot à grilles", en: "Loaves cooling on a bakery rack" }],
    matin: ["matin", 800, { fr: "Un croissant et un pain au chocolat dorés", en: "A golden croissant and pain au chocolat" }],
    midi: ["midi", 534, { fr: "Deux pains entaillés, tout juste cuits", en: "Two freshly baked scored loaves" }],
    pains: ["pains", 800, { fr: "Des miches de campagne empilées dans des mains", en: "Country loaves stacked in two hands" }],
    soir: ["soir", 640, { fr: "Des croissants dans un voile de farine, la nuit", en: "Croissants in a veil of flour, at night" }],
    ouverture: ["ouverture", 800, { fr: "L’enseigne dorée « Boulangerie » au-dessus de la vitrine", en: "The gilded “Boulangerie” sign above the shop window" }]
  };
  // Le ciel de la nuit, minute par minute depuis 22 h
  // L'aube passe vite du sombre au clair : le texte reste lisible à chaque instant.
  var CIEL = [[0, "#1b2482"], [160, "#141b6c"], [300, "#10165c"], [400, "#1b2482"], [445, "#33298a"], [472, "#6a2d7c"], [490, "#a83c3a"], [494, "#e98a45"], [508, "#f3b765"], [524, "#f4ecdf"]];

  var TXT = {
    fr: {
      ouvertJusque: "Ouvert jusqu’à ", fermeBientot: "Ferme bientôt · ", ferme: "Fermé · ouvre ", demain: "demain à ", a: "à ",
      aujourdhui: "Aujourd’hui", demainJour: "Demain", sortie: "Sortie", chaude: "Tout chaud", dans: "Dans ", aVenir: "À venir",
      tableauAujourdhui: "Aujourd’hui, ", tableauDemain: "Demain, ", tableauProchain: "Prochaines fournées : ", ferme_mercredi: "Le mercredi, on se repose.",
      pasDePain: "Choisissez au moins un produit.", nom: "Indiquez le nom à écrire sur le sachet.", tel: "Indiquez un numéro de téléphone.",
      reserver: "Réserver mon pain", monTicket: "Mon ticket · ", articles: " art.", vide: "Votre ticket s’imprime ici, au fil de vos choix."
    },
    en: {
      ouvertJusque: "Open until ", fermeBientot: "Closing soon · ", ferme: "Closed · opens ", demain: "tomorrow at ", a: "at ",
      aujourdhui: "Today", demainJour: "Tomorrow", sortie: "Out", chaude: "Still warm", dans: "In ", aVenir: "Later",
      tableauAujourdhui: "Today, ", tableauDemain: "Tomorrow, ", tableauProchain: "Next batches: ", ferme_mercredi: "On Wednesdays, we rest.",
      pasDePain: "Pick at least one item.", nom: "Please enter the name for the bag.", tel: "Please enter a phone number.",
      reserver: "Reserve my bread", monTicket: "My ticket · ", articles: " items", vide: "Your ticket prints here as you choose."
    }
  };
  var PHRASES = {
    fr: {
      levain: "Antoine nourrit le levain. La boutique ouvre à {ouv}.",
      petrissage: "La pâte est pétrie, elle repose dans le noir. Ouverture à {ouv}.",
      faconnage: "Antoine façonne les baguettes, une par une. Ouverture à {ouv}.",
      lame: "Un coup de lame sur chaque baguette, puis au four. Ouverture à {ouv}.",
      four: "Le four est plein, la rue commence à sentir le pain. Ouverture à {ouv}.",
      defournement: "Le pain refroidit sur les grilles. On ouvre à {ouv}.",
      sortie: "La fournée de {f} vient de sortir du four. Elle est encore chaude.",
      entre: "Prochaine fournée à {f}, dans {d}. Le pain de {der} est sur les grilles.",
      premiere: "Le four chauffe : première fournée à {f}, dans {d}.",
      derniere: "La dernière fournée est sortie à {f}. On ferme à {fer}.",
      bientot: "On ferme dans {d}. S’il reste du pain, il est pour vous.",
      soir: "Fermé. Antoine revient au fournil à 22 h.",
      repos: "Fermé. Demain, mercredi, on se repose. Retour jeudi à 6 h 45.",
      mercredi: "Mercredi, jour de repos. Antoine reprend ce soir à 22 h.",
      dimanche: "Fermé le dimanche après-midi. Antoine reprend ce soir à 22 h."
    },
    en: {
      levain: "Antoine is feeding the starter. The shop opens at {ouv}.",
      petrissage: "The dough is mixed and resting in the dark. We open at {ouv}.",
      faconnage: "Antoine is shaping the baguettes, one by one. We open at {ouv}.",
      lame: "A cut of the blade on every baguette, then into the oven. We open at {ouv}.",
      four: "The oven is full and the street is starting to smell of bread. We open at {ouv}.",
      defournement: "The bread is cooling on the racks. We open at {ouv}.",
      sortie: "The {f} batch just came out of the oven. It is still warm.",
      entre: "Next batch at {f}, in {d}. The {der} bread is on the racks.",
      premiere: "The oven is heating up: first batch at {f}, in {d}.",
      derniere: "The last batch came out at {f}. We close at {fer}.",
      bientot: "We close in {d}. If there is bread left, it is yours.",
      soir: "Closed. Antoine is back at the oven at 10 pm.",
      repos: "Closed. Tomorrow is Wednesday, our day off. Back on Thursday at 6:45 am.",
      mercredi: "Wednesday is our day off. Antoine starts again tonight at 10 pm.",
      dimanche: "Closed on Sunday afternoons. Antoine starts again tonight at 10 pm."
    }
  };
  var NOMS = {
    tradition: { fr: "Baguette tradition", en: "Trad. baguette" },
    campagne: { fr: "Pain de campagne", en: "Country loaf" },
    cereales: { fr: "Pain aux céréales", en: "Seeded loaf" },
    croissant: { fr: "Croissant", en: "Croissant" },
    chocolat: { fr: "Pain au chocolat", en: "Pain au chocolat" },
    cramique: { fr: "Cramique", en: "Cramique" },
    tarte: { fr: "Tarte au sucre", en: "Sugar tart" }
  };

  var racine = document.documentElement;
  var reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var lang = "fr";

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function deux(n) { return String(n).padStart(2, "0"); }

  // ?heure=3:12 (et &jour=4, 0 = dimanche) : montrer la page à une autre heure pendant une démo.
  var forcee = (function () {
    var q = /[?&]heure=(\d{1,2})(?:[:h](\d{2}))?/.exec(location.search), j = /[?&]jour=([0-6])/.exec(location.search);
    return q ? { min: Math.min(1439, parseInt(q[1], 10) * 60 + parseInt(q[2] || "0", 10)), jour: j ? parseInt(j[1], 10) : null } : null;
  })();
  function maintenantParis() {
    var v = {};
    new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Paris", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(new Date()).forEach(function (p) { v[p.type] = p.value; });
    var t = { jour: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(v.weekday), min: parseInt(v.hour, 10) * 60 + parseInt(v.minute, 10) };
    if (forcee) { t.min = forcee.min; if (forcee.jour !== null) t.jour = forcee.jour; }
    return t;
  }
  function heure(min) {
    var h = Math.floor(min / 60) % 24, m = min % 60;
    if (lang === "en") { var h12 = h % 12 || 12; return h12 + (m ? ":" + deux(m) : "") + (h < 12 ? " am" : " pm"); }
    return h + " h" + (m ? " " + deux(m) : "");
  }
  function duree(min) {
    var h = Math.floor(min / 60), m = min % 60;
    if (lang === "en") return h ? h + " h" + (m ? " " + m + " min" : "") : m + " min";
    return h ? h + " h" + (m ? " " + deux(m) : "") : m + " min";
  }
  function prix(n) { return lang === "en" ? "€" + n.toFixed(2) : n.toFixed(2).replace(".", ",") + "\u00a0€"; }
  // Espaces insécables avant les signes doubles et dans les heures (« 6 h 45 »)
  function fin(s) {
    return s.replace(/ ([:;!?])/g, "\u00a0$1").replace(/(\d) h\b/g, "$1\u00a0h").replace(/(\d\u00a0h) (\d)/g, "$1\u00a0$2").replace(/(\d) (am|pm)\b/g, "$1\u00a0$2");
  }
  function remplir(modele, valeurs) { return modele.replace(/\{(\w+)\}/g, function (_, k) { return valeurs[k]; }); }

  /* --- L'enseigne lève comme une pâte ---------------------------------------- */
  var enseigne = $("[data-enseigne]");
  if (enseigne && !reduit) {
    var mot = enseigne.textContent.trim();
    enseigne.textContent = "";
    var cache = document.createElement("span");
    cache.className = "visuellement-cache"; cache.textContent = mot;
    var lettres = document.createElement("span");
    lettres.setAttribute("aria-hidden", "true");
    mot.split("").forEach(function (c, i) {
      var l = document.createElement("span");
      l.className = "enseigne__lettre"; l.style.setProperty("--i", i); l.textContent = c;
      lettres.appendChild(l);
    });
    enseigne.appendChild(cache); enseigne.appendChild(lettres);
  }

  /* --- Farine la nuit, grain du papier le jour : des points semés dans le haut de page --- */
  var haut = $(".maintenant");
  if (haut) {
    var graine = 11, alea = function () { graine = graine * 16807 % 2147483647; return graine / 2147483647; };
    var grains = [];
    for (var g = 0; g < 56; g++) {
      var r = .5 + alea() * alea() * 1.7;
      grains.push("radial-gradient(circle at " + (alea() * 100).toFixed(1) + "% " + (alea() * 100).toFixed(1) + "%, var(--grain) 0 " + r.toFixed(2) + "px, transparent " + (r + .7).toFixed(2) + "px)");
    }
    haut.style.setProperty("--grains", grains.join(","));
  }

  /* --- Maintenant : ce qui se passe au fournil -------------------------------- */
  function phaseNuit(n, ouverture) {
    var cle = n < 90 ? "levain" : n < 270 ? "petrissage" : n < 375 ? "faconnage" : n < 420 ? "lame" : n < 465 ? "four" : "defournement";
    return { cle: cle, photo: cle === "four" ? null : cle, v: { ouv: heure(ouverture) } };
  }
  function phase(t) {
    var j = t.jour, m = t.min, plage = HORAIRES[j];
    // La nuit de travail prépare le matin suivant : de 22 h à minuit, c'est pour demain.
    if (m >= 1320) return HORAIRES[(j + 1) % 7] ? phaseNuit(m - 1320, HORAIRES[(j + 1) % 7][0]) : { cle: "repos", photo: "soir" };
    if (!plage) return { cle: "mercredi", photo: m < 390 || m >= 1170 ? "soir" : "ouverture" };
    if (m < plage[0]) return phaseNuit(m + 120, plage[0]);
    if (m >= plage[1]) {
      if (j === 0) return { cle: "dimanche", photo: m >= 1200 ? "soir" : "ouverture" };
      return HORAIRES[(j + 1) % 7] ? { cle: "soir", photo: "soir" } : { cle: "repos", photo: "soir" };
    }
    var derniere = null, prochaine = null;
    FOURNEES[j].forEach(function (f) { if (f <= m) derniere = f; else if (prochaine === null) prochaine = f; });
    var photo = j === 0 ? (m < 600 ? "matin" : "midi") : m < 690 ? "matin" : m < 1020 ? "midi" : "pains";
    if (plage[1] - m <= 30) return { cle: "bientot", photo: photo, v: { d: duree(plage[1] - m) } };
    if (derniere !== null && m - derniere < 20) return { cle: "sortie", photo: photo, chaud: true, v: { f: heure(derniere) } };
    if (prochaine !== null) {
      return derniere === null
        ? { cle: "premiere", photo: photo, v: { f: heure(prochaine), d: duree(prochaine - m) } }
        : { cle: "entre", photo: photo, v: { f: heure(prochaine), d: duree(prochaine - m), der: heure(derniere) } };
    }
    return { cle: "derniere", photo: photo, v: { f: heure(derniere), fer: heure(plage[1]) } };
  }

  var hublot = $("[data-hublot]"), hublotImg = $("[data-hublot-photo]"), phraseEl = $("[data-phrase]");
  var themeMeta = $('meta[name="theme-color"]');
  var photoCourante = "matin";
  function poserPhoto(cle) {
    if (!hublot) return;
    hublot.classList.toggle("hublot--four", !cle);
    if (!cle) return;
    var p = PHOTOS[cle];
    hublotImg.alt = p[2][lang];
    if (cle !== photoCourante) {
      photoCourante = cle;
      hublot.classList.remove("est-pret");
      var base = "photos/rond-" + p[0] + "-";
      hublotImg.srcset = base + "480.webp 480w, " + base + p[1] + ".webp " + p[1] + "w";
      hublotImg.src = base + "480.webp";
    }
    if (hublotImg.complete && hublotImg.naturalWidth) hublot.classList.add("est-pret");
    else hublotImg.onload = function () { hublot.classList.add("est-pret"); };
  }
  function majMaintenant() {
    var t = maintenantParis();
    if (t.jour < 0) return;
    var nuit = t.min >= 1200 || t.min < 390;
    racine.setAttribute("data-moment", nuit ? "nuit" : "jour");
    if (themeMeta) themeMeta.content = nuit ? "#1b2482" : "#f4ecdf";
    var ph = phase(t);
    if (hublot) hublot.classList.toggle("lunaire", nuit);
    poserPhoto(ph.photo);
    if (phraseEl) phraseEl.textContent = fin(remplir(PHRASES[lang][ph.cle], ph.v || {}));
  }
  function majHorloges() {
    var t = maintenantParis();
    var hh = $("[data-horloge] [data-hh]"), mm = $("[data-horloge] [data-mm]");
    if (hh) { hh.textContent = deux(Math.floor(t.min / 60)); mm.textContent = deux(t.min % 60); }
  }

  /* --- État d'ouverture -------------------------------------------------------- */
  function prochaineOuverture(t) {
    for (var i = 0; i < 8; i++) {
      var j = (t.jour + i) % 7, plage = HORAIRES[j];
      if (!plage || (i === 0 && t.min >= plage[0])) continue;
      return (i === 0 ? TXT[lang].a : i === 1 ? TXT[lang].demain : JOURS[lang][j] + " " + TXT[lang].a) + heure(plage[0]);
    }
    return "";
  }
  function majEtat() {
    var el = $("[data-etat]"), t = maintenantParis(), plage = HORAIRES[t.jour];
    if (!el || t.jour < 0) return;
    var classe, texte;
    if (plage && t.min >= plage[0] && t.min < plage[1]) {
      var reste = plage[1] - t.min;
      classe = reste <= 45 ? "etat--bientot" : "etat--ouvert";
      texte = (reste <= 45 ? TXT[lang].fermeBientot : TXT[lang].ouvertJusque) + heure(plage[1]);
    } else { classe = "etat--ferme"; texte = TXT[lang].ferme + prochaineOuverture(t); }
    el.className = "etat " + classe;
    $("[data-etat-texte]").textContent = fin(texte);
    el.hidden = false;
  }
  function majAujourdhui() {
    var t = maintenantParis();
    $$(".horaires tr").forEach(function (l) { l.classList.toggle("aujourdhui", l.dataset.jour === String(t.jour)); });
  }

  /* --- Les fournées du jour ----------------------------------------------------- */
  var tableau = $("[data-tableau]"), tableauJour = $("[data-tableau-jour]");
  function heureTableau(min) {
    var h = Math.floor(min / 60), m = min % 60;
    if (lang === "en") return (h % 12 || 12) + ":" + deux(m) + '<span class="tableau__h">' + (h < 12 ? "am" : "pm") + "</span>";
    return h + '<span class="tableau__h">h</span>' + deux(m);
  }
  function majTableau() {
    if (!tableau) return;
    var t = maintenantParis(), j = t.jour, decalage = 0;
    // Aujourd'hui tant qu'une fournée arrive ou sort à peine du four, sinon le prochain jour qui en a.
    var reste = function (liste) { return liste.some(function (f) { return f > t.min - 20; }); };
    while ((!FOURNEES[j].length || (!decalage && !reste(FOURNEES[j]))) && decalage < 7) { decalage++; j = (t.jour + decalage) % 7; }
    var liste = FOURNEES[j];
    var prochaine = decalage ? liste[0] : liste.filter(function (f) { return f > t.min; })[0];
    tableau.innerHTML = "";
    liste.forEach(function (f) {
      var li = document.createElement("li"), statut = "", classe = "";
      if (decalage) { statut = decalage === 1 ? TXT[lang].demainJour : JOURS[lang][j]; classe = f === prochaine ? "prochaine" : ""; }
      else if (f <= t.min && t.min - f < 20) { statut = TXT[lang].chaude; classe = "chaude"; }
      else if (f <= t.min) { statut = TXT[lang].sortie; classe = "passee"; }
      else if (f === prochaine) { statut = TXT[lang].dans + duree(f - t.min); classe = "prochaine"; }
      else { statut = TXT[lang].aVenir; }
      li.className = "tableau__ligne" + (classe ? " tableau__ligne--" + classe : "");
      li.innerHTML = '<span class="tableau__heure">' + heureTableau(f) + '</span><span class="tableau__quoi"></span><span class="tableau__statut"></span>';
      $(".tableau__quoi", li).textContent = CONTENU_FOURNEE[f][lang];
      $(".tableau__statut", li).textContent = statut.charAt(0).toUpperCase() + statut.slice(1);
      tableau.appendChild(li);
    });
    if (tableauJour) {
      var entete = (!decalage ? TXT[lang].tableauAujourdhui : decalage === 1 ? TXT[lang].tableauDemain : TXT[lang].tableauProchain) + JOURS[lang][j] + ".";
      tableauJour.textContent = fin((t.jour === 3 ? TXT[lang].ferme_mercredi + " " : "") + entete);
    }
  }

  /* --- La nuit : l'horloge suit le défilement ------------------------------------ */
  var nuit = $("[data-nuit]"), piste = $("[data-piste]");
  var etapes = $$(".etape", nuit || document);
  function versRvb(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
  var cielRvb = CIEL.map(function (c) { return [c[0], versRvb(c[1])]; });
  function couleurCiel(t) {
    for (var i = 1; i < cielRvb.length; i++) {
      if (t <= cielRvb[i][0]) {
        var a = cielRvb[i - 1], b = cielRvb[i], k = (t - a[0]) / (b[0] - a[0]);
        return a[1].map(function (v, n) { return Math.round(v + (b[1][n] - v) * k); });
      }
    }
    return cielRvb[cielRvb.length - 1][1];
  }
  function luminance(c) {
    var l = c.map(function (v) { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); });
    return .2126 * l[0] + .7152 * l[1] + .0722 * l[2];
  }
  if (nuit && piste && etapes.length && !reduit && "requestAnimationFrame" in window) {
    var temps = etapes.map(function (e) { return parseInt(e.dataset.t, 10); });
    var horlogeNuit = $("[data-nuit-horloge]"), hhN = $("[data-hh]", horlogeNuit), mmN = $("[data-mm]", horlogeNuit);
    var grignesNuit = $$("[data-baguette] [data-grigne]", nuit);
    var active = -1, demande = false;
    nuit.classList.add("nuit--scene");
    nuit.style.setProperty("--n", etapes.length);

    var charge = false;
    // Chargées et décodées d'avance, pour qu'aucun hublot ne s'allume vide en fondu.
    var precharger = function () {
      charge = true;
      $$("img", piste).forEach(function (img) {
        img.loading = "eager";
        if (img.decode) img.decode().catch(function () {});
      });
    };
    var regler = function () {
      demande = false;
      var r = piste.getBoundingClientRect(), course = piste.offsetHeight - window.innerHeight;
      // Les photos de la nuit se chargent toutes quand on approche : pas de hublot vide en défilant vite.
      if (!charge && r.top < window.innerHeight * 2) precharger();
      var p = Math.min(1, Math.max(0, -r.top / Math.max(course, 1)));
      // Chaque étape a la même longueur de défilement ; l'heure avance entre deux étapes.
      var pos = p * etapes.length, i = Math.min(etapes.length - 1, Math.floor(pos)), f = pos - i;
      var suivant = i < etapes.length - 1 ? temps[i + 1] : temps[i] + 15;
      var t = temps[i] + (suivant - temps[i]) * f;
      var c = couleurCiel(t), clair = luminance(c) > .22, chaud = c[0] > c[2] + 40;
      nuit.style.setProperty("--ciel", "rgb(" + c.join(",") + ")");
      nuit.style.setProperty("--ciel-texte", clair ? "#1b2482" : "#f4ecdf");
      nuit.style.setProperty("--accent-ciel", clair ? "#b8380a" : chaud ? "#f4ecdf" : "#ff5b1f");
      nuit.style.setProperty("--derive", (t < 420 ? t / 420 * 4 : 4 - (t - 420) / 105 * 9).toFixed(2) + "vh");
      nuit.style.setProperty("--indice", p > .02 ? 0 : 1);
      // La baguette de la jauge dore entre l'enfournement (5 h) et le défournement (5 h 45).
      var k = Math.min(1, Math.max(0, (t - 420) / 45));
      nuit.style.setProperty("--mie", "rgb(" + [241, 230, 210].map(function (v, n) { return Math.round(v + ([214, 128, 44][n] - v) * k); }).join(",") + ")");
      var minute = Math.round(1320 + t) % 1440;
      hhN.textContent = deux(Math.floor(minute / 60)); mmN.textContent = deux(minute % 60);
      if (i !== active) {
        active = i;
        etapes.forEach(function (e, n) { e.classList.toggle("est-active", n === i); });
        grignesNuit.forEach(function (gr, n) { gr.classList.toggle("est-coupee", n <= i); });
      }
    };
    var demander = function () { if (!demande) { demande = true; requestAnimationFrame(regler); } };
    // Une fois la page chargée, les photos de la nuit arrivent en douce, avant qu'on y descende.
    window.addEventListener("load", function () {
      setTimeout(function () { if (!charge) precharger(); }, 1200);
    });
    window.addEventListener("scroll", demander, { passive: true });
    window.addEventListener("resize", demander);
    regler();
  }

  /* --- Réservation et ticket ------------------------------------------------------ */
  var form = $("[data-commande]");
  var dockReserver = $("[data-dock-reserver]");
  var qtes = function () { return []; }, total = function () { return 0; }, commande = null;
  if (form) {
    var produits = $$(".produit", form), selJour = $("[data-jour]", form), selFournee = $("[data-fournee]", form);
    var totalEl = $("[data-total]", form), erreur = $("[data-erreur]", form);
    var lignesEl = $("[data-ticket-lignes]", form), videEl = $("[data-ticket-vide]", form), dateEl = $("[data-ticket-date]", form);
    var confirmation = $("[data-confirmation]", form), envoyer = $("[data-envoyer]", form), nouvelle = $("[data-nouvelle]", form);

    qtes = function () {
      return produits.map(function (p) { return { id: p.dataset.id, prix: parseFloat(p.dataset.prix), q: parseInt($("[data-qte]", p).textContent, 10) }; });
    };
    total = function () { return qtes().reduce(function (s, x) { return s + x.q * x.prix; }, 0); };

    // Une ligne par produit choisi ; une ligne nouvelle « s'imprime ».
    var majTicket = function () {
      var choisis = qtes().filter(function (x) { return x.q > 0; });
      var deja = {};
      $$("li", lignesEl).forEach(function (li) { deja[li.dataset.id] = li; });
      choisis.forEach(function (x) {
        var li = deja[x.id];
        if (!li) { li = document.createElement("li"); li.dataset.id = x.id; li.innerHTML = "<span></span><span></span>"; }
        li.firstChild.textContent = x.q + " x " + NOMS[x.id][lang].toUpperCase();
        li.lastChild.textContent = prix(x.q * x.prix).replace("\u00a0€", "").replace("€", "");
        lignesEl.appendChild(li);
        delete deja[x.id];
      });
      Object.keys(deja).forEach(function (k) { deja[k].remove(); });
      videEl.hidden = choisis.length > 0;
      totalEl.textContent = prix(total());
      majDock();
    };
    var majDate = function () {
      var d = new Date();
      var jour = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day: "2-digit", month: "2-digit", year: "numeric" }).format(d);
      var h = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", hour: "2-digit", minute: "2-digit" }).format(d);
      dateEl.textContent = jour + "   " + h;
    };

    produits.forEach(function (p) {
      var out = $("[data-qte]", p);
      var changer = function (d) {
        if (form.hasAttribute("data-envoyee")) return;
        var n = Math.max(0, Math.min(20, parseInt(out.textContent, 10) + d));
        out.textContent = n; p.classList.toggle("a-qte", n > 0); majTicket();
      };
      $("[data-plus]", p).addEventListener("click", function () { changer(1); });
      $("[data-moins]", p).addEventListener("click", function () { changer(-1); });
    });

    // Les six prochains jours d'ouverture ; aujourd'hui seulement s'il reste une fournée dans plus d'une heure.
    var jourOptions = function () {
      var t = maintenantParis(), opts = [], d = new Date();
      for (var i = 0; i < 8 && opts.length < 6; i++) {
        var j = (t.jour + i) % 7;
        if (!FOURNEES[j].length) continue;
        if (i === 0 && !FOURNEES[j].some(function (m) { return m > t.min + 60; })) continue;
        var date = new Date(d.getTime() + i * 86400000);
        var lib = i === 0 ? TXT[lang].aujourdhui : i === 1 ? TXT[lang].demainJour : JOURS[lang][j].charAt(0).toUpperCase() + JOURS[lang][j].slice(1);
        var jj = new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-GB", { timeZone: "Europe/Paris", day: "numeric", month: "short" }).format(date);
        opts.push({ value: i + ":" + j, text: lib + " · " + jj });
      }
      return opts;
    };
    var remplirFournees = function () {
      var t = maintenantParis(), parts = selJour.value.split(":"), i = parseInt(parts[0], 10), j = parseInt(parts[1], 10);
      var courant = selFournee.value;
      selFournee.innerHTML = "";
      (FOURNEES[j] || []).forEach(function (m) {
        if (i === 0 && m <= t.min + 60) return;
        var e = document.createElement("option"); e.value = m; e.textContent = heure(m); selFournee.appendChild(e);
      });
      if (courant && $('option[value="' + courant + '"]', selFournee)) selFournee.value = courant;
    };
    var remplirJours = function () {
      var courant = selJour.value;
      selJour.innerHTML = "";
      jourOptions().forEach(function (o) { var e = document.createElement("option"); e.value = o.value; e.textContent = o.text; selJour.appendChild(e); });
      if (courant && $('option[value="' + courant + '"]', selJour)) selJour.value = courant;
      remplirFournees();
    };
    selJour.addEventListener("change", remplirFournees);

    var verrouiller = function (oui) {
      $$("button[data-plus], button[data-moins], input, select", form).forEach(function (e) { e.disabled = oui; });
      if (oui) form.setAttribute("data-envoyee", ""); else form.removeAttribute("data-envoyee");
      envoyer.hidden = oui; nouvelle.hidden = !oui;
    };

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var choisis = qtes().filter(function (x) { return x.q > 0; });
      var nom = form.elements.nom.value.trim(), tel = form.elements.tel.value.trim();
      var msg = !choisis.length ? TXT[lang].pasDePain : !nom ? TXT[lang].nom : tel.replace(/\D/g, "").length < 8 ? TXT[lang].tel : "";
      erreur.hidden = !msg; erreur.textContent = msg;
      if (msg) { (!choisis.length ? $("[data-plus]", form) : !nom ? form.elements.nom : form.elements.tel).focus(); return; }
      majDate();
      $("[data-t-numero]", form).textContent = "N° " + String(Math.floor(100 + Math.random() * 900));
      $("[data-t-nom]", form).textContent = nom.toUpperCase();
      var jourTexte = selJour.options[selJour.selectedIndex].text.split(" · ")[0];
      $("[data-t-retrait]", form).textContent = (jourTexte + ", " + heure(parseInt(selFournee.value, 10))).toUpperCase();
      confirmation.hidden = false;
      verrouiller(true);
      majDock();
      $("[data-ticket]", form).scrollIntoView({ behavior: reduit ? "auto" : "smooth", block: "center" });
    });
    nouvelle.addEventListener("click", function () {
      confirmation.hidden = true;
      verrouiller(false);
      produits.forEach(function (p) { $("[data-qte]", p).textContent = "0"; p.classList.remove("a-qte"); });
      majTicket(); majDate();
      $(".produits", form).scrollIntoView({ behavior: reduit ? "auto" : "smooth", block: "start" });
    });

    majDate();
    remplirJours();
    majTicket();
    commande = { remplirJours: remplirJours, majTicket: majTicket };
  }

  // Sur mobile, la barre du bas montre le ticket dès qu'il y a quelque chose dedans.
  function majDock() {
    if (!dockReserver) return;
    var n = qtes().reduce(function (s, x) { return s + x.q; }, 0);
    var envoyee = form && form.hasAttribute("data-envoyee");
    dockReserver.textContent = n && !envoyee ? TXT[lang].monTicket + prix(total()) : TXT[lang].reserver;
    dockReserver.setAttribute("href", n ? "#ticket" : "#reserver");
  }

  /* --- Plan à la demande : rien n'est envoyé à Google avant le clic ------------------ */
  var boutonPlan = $("[data-plan]");
  if (boutonPlan) {
    boutonPlan.addEventListener("click", function () {
      var zone = $("[data-plan-zone]");
      var iframe = document.createElement("iframe");
      iframe.src = "https://www.google.com/maps?q=%C3%89taples%2062630&z=15&output=embed";
      iframe.title = lang === "en" ? "Google map: Boulangerie Delcourt in Étaples" : "Plan Google Maps : Boulangerie Delcourt à Étaples";
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      zone.appendChild(iframe);
      zone.hidden = false;
      boutonPlan.hidden = true;
      var note = $("[data-plan-note]"); if (note) note.hidden = true;
    });
  }

  /* --- Version anglaise ---------------------------------------------------------- */
  var bouton = $("[data-langue]");
  var traduisibles = $$("[data-en]"), etiquettes = $$("[data-en-label]");
  traduisibles.forEach(function (e) { e.dataset.fr = e.innerHTML; });
  etiquettes.forEach(function (e) { e.dataset.frLabel = e.getAttribute("aria-label") || ""; });
  var titreFr = document.title;
  function appliquer(l) {
    lang = l;
    racine.lang = l;
    traduisibles.forEach(function (e) { e.innerHTML = l === "en" ? e.dataset.en : e.dataset.fr; });
    etiquettes.forEach(function (e) { e.setAttribute("aria-label", l === "en" ? e.dataset.enLabel : e.dataset.frLabel); });
    $$("[data-prix-texte]").forEach(function (e) { e.textContent = prix(parseFloat(e.closest("[data-prix]").dataset.prix)); });
    document.title = l === "en" ? "Delcourt Bakery · Artisan baker in Étaples" : titreFr;
    bouton.textContent = l === "en" ? "FR" : "EN";
    bouton.setAttribute("lang", l === "en" ? "fr" : "en");
    bouton.setAttribute("aria-label", l === "en" ? "Passer en français" : "Switch to English");
    if (hublotImg && photoCourante) hublotImg.alt = PHOTOS[photoCourante][2][l];
    tout();
    if (commande) { commande.remplirJours(); commande.majTicket(); }
  }
  if (bouton) bouton.addEventListener("click", function () { appliquer(lang === "fr" ? "en" : "fr"); });

  function tout() { majMaintenant(); majHorloges(); majEtat(); majAujourdhui(); majTableau(); majDock(); }
  tout();
  setInterval(majHorloges, 1000);
  setInterval(function () { majMaintenant(); majEtat(); majTableau(); majAujourdhui(); }, 30000);
})();
