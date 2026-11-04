/* Boulangerie Delcourt — démo Standard, la nuit au fournil.
   Trois pages, en français à la racine et en anglais dans en/.
   L'accueil suit l'heure d'Étaples : le haut dit ce qui se passe au fournil à cette minute,
   la nuit se déroule au défilement, le ticket s'imprime pendant qu'on choisit son pain.
   Nos pains montre le pain du jour et les fournées qui arrivent ; Gâteaux dessine la commande
   pendant qu'on remplit le bon. Sans JavaScript, tout le contenu reste lisible. */
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
      reserver: "Réserver mon pain", monTicket: "Mon ticket · ", articles: " art.", vide: "Votre ticket s’imprime ici, au fil de vos choix.",
      parts: " parts", personnes: " personnes", choux: " choux", nbParts: "Nombre de parts", nbPersonnes: "Nombre de personnes",
      bonNom: "Indiquez votre nom, pour le bon.", bonDate: "Il n’y a plus de date possible pour ce gâteau.", croquis: "Croquis : ",
      plaque: "plaque", facultatif: "Facultatif", parfum: "Marron-vanille ou chocolat noir ?",
      rappelAvant: "Merci ! Claire vous rappelle aujourd’hui avant {h} pour confirmer.",
      rappelPlusTard: "Merci ! Claire vous rappelle {quand} pour confirmer.",
      aujourdhuiDes: "aujourd’hui dès ", demainDes: "demain dès ", jourDes: " dès "
    },
    en: {
      ouvertJusque: "Open until ", fermeBientot: "Closing soon · ", ferme: "Closed · opens ", demain: "tomorrow at ", a: "at ",
      aujourdhui: "Today", demainJour: "Tomorrow", sortie: "Out", chaude: "Still warm", dans: "In ", aVenir: "Later",
      tableauAujourdhui: "Today, ", tableauDemain: "Tomorrow, ", tableauProchain: "Next batches: ", ferme_mercredi: "On Wednesdays, we rest.",
      pasDePain: "Pick at least one item.", nom: "Please enter the name for the bag.", tel: "Please enter a phone number.",
      reserver: "Reserve my bread", monTicket: "My ticket · ", articles: " items", vide: "Your ticket prints here as you choose.",
      parts: " slices", personnes: " guests", choux: " choux", nbParts: "Number of slices", nbPersonnes: "Number of guests",
      bonNom: "Please enter your name for the form.", bonDate: "There is no date left for this cake.", croquis: "Sketch: ",
      plaque: "plaque", facultatif: "Optional", parfum: "Chestnut-vanilla or dark chocolate?",
      rappelAvant: "Thank you! Claire will call you back today before {h} to confirm.",
      rappelPlusTard: "Thank you! Claire will call you back {quand} to confirm.",
      aujourdhuiDes: "today from ", demainDes: "tomorrow from ", jourDes: " from "
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
  // Gâteaux sur commande. Saisons en mois × 100 + jour ; « retrait » : dernier jour pour venir le chercher.
  var GATEAUX = {
    chocolat: { forme: "entremets", parts: [4, 6, 8, 10, 12, 16, 20, 24, 30], defaut: 8, prix: 4.2, plaque: true },
    poire: { forme: "entremets", parts: [4, 6, 8, 10, 12, 16, 20, 24, 30], defaut: 8, prix: 4.2, plaque: true },
    sucre: { forme: "tarte", parts: [6, 8, 10, 12], defaut: 8, tarif: { 6: 9.5, 8: 12.5, 10: 15.5, 12: 18.5 }, plaque: false },
    piece: { forme: "piece", parts: [12, 16, 20, 24, 30, 40, 50, 60], defaut: 20, prix: 3.3, plaque: true },
    buche: { forme: "buche", parts: [6, 8], defaut: 8, prix: 4.4, plaque: true, saison: [1101, 1220], retrait: 1224 },
    galette: { forme: "galette", parts: [4, 6, 8, 10], defaut: 6, prix: 3.2, plaque: false, saison: [102, 131] },
    fraisier: { forme: "fraisier", parts: [6, 8, 10, 12], defaut: 8, prix: 4.5, plaque: true, saison: [501, 930] }
  };
  // Tailles, en centimètres
  var DIAMETRE = { entremets: { 4: 16, 6: 18, 8: 20, 10: 22, 12: 24 }, tarte: { 6: 24, 8: 26, 10: 28, 12: 30 }, galette: { 4: 20, 6: 24, 8: 26, 10: 28 } };
  var CADRE = { 16: [4, 4], 20: [5, 4], 24: [6, 4], 30: [6, 5] };
  var FRAISIER = { 6: [3, 2], 8: [4, 2], 10: [5, 2], 12: [4, 3] };
  var BUCHE = { 6: 24, 8: 30 };
  var MOTS_GATEAUX = {
    fr: {
      chocolat: ["Trois chocolats", "Noir, lait et blanc sur un croustillant praliné."],
      poire: ["Poire-caramel", "Mousse au caramel au beurre salé, poires pochées à la vanille."],
      sucre: ["Tarte au sucre", "La tarte au sucre du comptoir, en grand."],
      piece: ["Pièce montée", "Choux à la crème vanille, caramel et nougatine. Trois choux par personne."],
      buche: ["Bûche de Noël", "Marron-vanille ou chocolat noir : dites-le dans la case « Précision »."],
      galette: ["Galette des rois", "Frangipane au beurre, avec la fève et la couronne en papier."],
      fraisier: ["Fraisier", "Les fraises de Samer, une génoise et de la crème mousseline."]
    },
    en: {
      chocolat: ["Three chocolate", "Dark, milk and white chocolate on a praline crunch."],
      poire: ["Pear and caramel", "Salted butter caramel mousse with vanilla-poached pears."],
      sucre: ["Sugar tart", "The counter’s sugar tart, made bigger."],
      piece: ["Croquembouche", "Vanilla cream puffs, caramel and nougatine. Three choux per guest."],
      buche: ["Christmas log", "Chestnut-vanilla or dark chocolate: say which under “Notes”."],
      galette: ["Galette des rois", "Butter frangipane, with the lucky charm and the paper crown."],
      fraisier: ["Strawberry cake", "Strawberries from Samer, sponge and mousseline cream."]
    }
  };
  var SAISONS = {
    fr: {
      buche: ["En ce moment, à commander jusqu’au 20 décembre.", "Revient le 1er novembre."],
      galette: ["En ce moment, jusqu’au 31 janvier.", "Revient le 2 janvier."],
      fraisier: ["En ce moment, jusqu’à la fin septembre.", "Revient en mai, avec les fraises."]
    },
    en: {
      buche: ["Now, to order until December 20.", "Back on November 1."],
      galette: ["Now, until January 31.", "Back on January 2."],
      fraisier: ["Now, until the end of September.", "Back in May, with the strawberries."]
    }
  };

  var racine = document.documentElement;
  var reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var lang = racine.lang === "en" ? "en" : "fr";
  // Les pages anglaises sont dans en/ : les photos se cherchent à côté de ce fichier.
  var SITE = document.currentScript && document.currentScript.src ? new URL(".", document.currentScript.src).href : "";

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
  function dateParis() {
    var v = {};
    new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" })
      .formatToParts(new Date()).forEach(function (p) { v[p.type] = p.value; });
    return { a: +v.year, m: +v.month, j: +v.day };
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
  function prix(n) { return lang === "en" ? "€" + n.toFixed(2) : n.toFixed(2).replace(".", ",") + " €"; }
  // Espaces insécables avant les signes doubles, dans les guillemets et dans les heures (« 6 h 45 »)
  function fin(s) {
    return s.replace(/ ([:;!?»])/g, " $1").replace(/« /g, "« ").replace(/(\d) h\b/g, "$1 h").replace(/(\d h) (\d)/g, "$1 $2").replace(/(\d) (am|pm|cm)\b/g, "$1 $2");
  }
  function remplir(modele, valeurs) { return modele.replace(/\{(\w+)\}/g, function (_, k) { return valeurs[k]; }); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c]; }); }

  /* --- Les noms en grandes lettres lèvent comme une pâte ---------------------------- */
  $$("[data-enseigne]").forEach(function (enseigne) {
    if (reduit) return;
    var mot = enseigne.textContent.trim();
    enseigne.textContent = "";
    var cache = document.createElement("span");
    cache.className = "visuellement-cache"; cache.textContent = mot;
    var lettres = document.createElement("span");
    lettres.setAttribute("aria-hidden", "true");
    mot.split("").forEach(function (c, i) {
      var l = document.createElement("span");
      l.className = "enseigne__lettre"; l.style.setProperty("--i", i); l.textContent = c === " " ? " " : c;
      lettres.appendChild(l);
    });
    enseigne.appendChild(cache); enseigne.appendChild(lettres);
  });

  /* --- Farine la nuit, grain du papier le jour : des points semés dans le haut des pages --- */
  $$(".maintenant, .page-tete").forEach(function (haut) {
    var graine = 11, alea = function () { graine = graine * 16807 % 2147483647; return graine / 2147483647; };
    var grains = [];
    for (var g = 0; g < 56; g++) {
      var r = .5 + alea() * alea() * 1.7;
      grains.push("radial-gradient(circle at " + (alea() * 100).toFixed(1) + "% " + (alea() * 100).toFixed(1) + "%, var(--grain) 0 " + r.toFixed(2) + "px, transparent " + (r + .7).toFixed(2) + "px)");
    }
    haut.style.setProperty("--grains", grains.join(","));
  });

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
      var base = SITE + "photos/rond-" + p[0] + "-";
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

  /* --- Nos pains : sous chaque pain, la prochaine fournée en bleu, celle qui sort en orange --- */
  var puces = $$("[data-f]");
  function majPuces() {
    if (!puces.length) return;
    var t = maintenantParis(), liste = FOURNEES[t.jour] || [], dimanche = t.jour === 0;
    var prochaine = liste.filter(function (f) { return f > t.min; })[0];
    puces.forEach(function (p) {
      var k = +p.dataset.f, f = (dimanche ? liste : FOURNEES[1])[k];
      if (!p.dataset.libelle) p.dataset.libelle = p.innerHTML;
      // Le dimanche, deux fournées seulement : 7 h et 10 h
      p.hidden = f === undefined;
      if (f === undefined) return;
      if (dimanche) p.textContent = fin(heure(f)); else p.innerHTML = p.dataset.libelle;
      var ouvert = liste.length > 0;
      p.classList.toggle("fournee--chaude", ouvert && f <= t.min && t.min - f < 20);
      p.classList.toggle("fournee--prochaine", ouvert && f === prochaine);
    });
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
  var qtes = function () { return []; }, total = function () { return 0; };
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
        li.lastChild.textContent = prix(x.q * x.prix).replace(" €", "").replace("€", "");
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
  }

  // Sur mobile, la barre du bas de l'accueil montre le ticket dès qu'il y a quelque chose dedans.
  function majDock() {
    if (!dockReserver || !form) return;
    var n = qtes().reduce(function (s, x) { return s + x.q; }, 0);
    var envoyee = form.hasAttribute("data-envoyee");
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

  /* --- Le menu sort de la barre du bas comme un sachet ---------------------------- */
  var menu = $("#menu"), ouvreMenu = $("[data-menu]");
  if (menu && ouvreMenu && typeof menu.showModal === "function") {
    ouvreMenu.setAttribute("role", "button");
    ouvreMenu.setAttribute("aria-haspopup", "dialog");
    ouvreMenu.setAttribute("aria-controls", "menu");
    var ouvrir = function (ev) { ev.preventDefault(); menu.showModal(); };
    ouvreMenu.addEventListener("click", ouvrir);
    ouvreMenu.addEventListener("keydown", function (ev) { if (ev.key === " ") ouvrir(ev); });
    // Fermé par la croix, par un clic à côté, ou en suivant un lien (vers une autre page ou plus bas).
    menu.addEventListener("click", function (ev) {
      if (ev.target === menu || ev.target.closest("[data-fermer]") || ev.target.closest("a")) menu.close();
    });
  }

  /* --- Pendant une démo à heure forcée, les liens gardent l'heure --------------------- */
  if (forcee) {
    $$("a[href]").forEach(function (a) {
      var h = a.getAttribute("href");
      if (/^(?:[a-z]+:|#|\/\/)/i.test(h) || h.indexOf("?") >= 0) return;
      var i = h.indexOf("#");
      a.setAttribute("href", (i < 0 ? h : h.slice(0, i)) + location.search + (i < 0 ? "" : h.slice(i)));
    });
  }

  /* --- Les pictogrammes : la lame passe sur chaque pain quand il arrive à l'écran --- */
  function entailler(p) {
    if (reduit) { p.classList.add("est-entaille"); return; }
    // On remet les entailles à zéro sans transition, puis la lame repasse.
    p.classList.add("picto--net");
    p.classList.remove("est-entaille");
    void p.getBoundingClientRect();
    p.classList.remove("picto--net");
    p.classList.add("est-entaille");
  }
  var pictos = $$(".picto[data-entaille]");
  if ("IntersectionObserver" in window && !reduit) {
    var vu = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("est-entaille"); vu.unobserve(e.target); } });
    }, { threshold: .55 });
    pictos.forEach(function (p) { vu.observe(p); });
  } else pictos.forEach(function (p) { p.classList.add("est-entaille"); });

  /* --- Nos pains : le pain du jour, un onglet par jour ----------------------------------- */
  var semaine = $("[data-semaine]");
  if (semaine) {
    var jours = $$(".jour", semaine), liste = $(".jours", semaine);
    var onglets = document.createElement("div"), boutons = [];
    var aujourdhui = maintenantParis().jour;
    onglets.className = "onglets";
    onglets.setAttribute("role", "tablist");
    onglets.setAttribute("aria-label", $("h2", semaine).textContent);
    var choisirJour = function (n, focus) {
      jours.forEach(function (j, k) {
        var oui = k === n;
        boutons[k].setAttribute("aria-selected", oui ? "true" : "false");
        boutons[k].tabIndex = oui ? 0 : -1;
        j.hidden = !oui;
      });
      var j = jours[n], nom = $("[data-jour-nom]", j);
      if (!nom.dataset.nom) nom.dataset.nom = nom.textContent;
      nom.textContent = +j.dataset.jour === aujourdhui
        ? semaine.dataset.aujourdhui + ", " + (lang === "fr" ? nom.dataset.nom.toLowerCase() : nom.dataset.nom)
        : nom.dataset.nom;
      var p = $(".picto", j);
      if (p) entailler(p);
      if (focus) boutons[n].focus();
    };
    jours.forEach(function (j, n) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "onglet"; b.id = "onglet-" + j.dataset.jour;
      b.setAttribute("role", "tab"); b.setAttribute("aria-controls", j.id);
      var court = document.createElement("span"); court.textContent = j.dataset.court;
      b.appendChild(court);
      var dessin = $(".picto, .jour__lune", j);
      if (dessin) {
        var c = dessin.cloneNode(true);
        c.removeAttribute("data-entaille");
        c.setAttribute("class", dessin.classList.contains("picto") ? "picto onglet__dessin" : "onglet__dessin onglet__lune");
        b.appendChild(c);
      }
      if (+j.dataset.jour === aujourdhui) b.classList.add("onglet--aujourdhui");
      b.addEventListener("click", function () { choisirJour(n); });
      b.addEventListener("keydown", function (ev) {
        var k = { ArrowRight: 1, ArrowLeft: -1, Home: -n, End: jours.length - 1 - n }[ev.key];
        if (k === undefined) return;
        ev.preventDefault();
        choisirJour((n + k + jours.length) % jours.length, true);
      });
      j.setAttribute("role", "tabpanel");
      j.setAttribute("aria-labelledby", b.id);
      j.tabIndex = 0;
      $(".picto", j) && vu && vu.unobserve($(".picto", j));
      boutons.push(b);
      onglets.appendChild(b);
    });
    liste.parentNode.insertBefore(onglets, liste);
    semaine.classList.add("du-jour--onglets");
    var index = 0;
    jours.forEach(function (j, n) { if (+j.dataset.jour === aujourdhui) index = n; });
    choisirJour(index);
  }

  /* --- Gâteaux : le bon de commande dessine le gâteau ----------------------------------- */
  // Un croquis, pas un plan : le gâteau grandit avec les parts, la cote donne la vraie taille.
  var CX = 200, CY = 116;
  function rayon(cm) { return 80 + (cm - 16) * 2.4; }
  function f1(n) { return Math.round(n * 10) / 10; }
  function alea(graine) { return function () { graine = graine * 16807 % 2147483647; return graine / 2147483647; }; }
  function ligne(x1, y1, x2, y2, i, ox, oy) {
    return '<line class="cq-part" style="--i:' + i + ";transform-origin:" + f1(ox) + "px " + f1(oy) + 'px" x1="' + f1(x1) + '" y1="' + f1(y1) + '" x2="' + f1(x2) + '" y2="' + f1(y2) + '"/>';
  }
  // Une cote de dessin technique : un trait, deux tirets, la mesure au milieu
  function cote(x1, y1, x2, y2, texte) {
    var vertical = Math.abs(x2 - x1) < 1, mx = (x1 + x2) / 2, my = (y1 + y2) / 2, w = texte.length * 8.4 + 12;
    var tirets = vertical ? "M" + f1(x1 - 6) + " " + f1(y1) + "h12M" + f1(x2 - 6) + " " + f1(y2) + "h12" : "M" + f1(x1) + " " + f1(y1 - 6) + "v12M" + f1(x2) + " " + f1(y2 - 6) + "v12";
    var s = '<path class="cq-cote" d="M' + f1(x1) + " " + f1(y1) + "L" + f1(x2) + " " + f1(y2) + tirets + '"/>';
    if (vertical) {
      s += '<rect class="cq-mesure-fond" x="' + f1(mx - 11) + '" y="' + f1(my - w / 2) + '" width="22" height="' + f1(w) + '"/>';
      s += '<text class="cq-mesure" x="' + f1(mx) + '" y="' + f1(my) + '" text-anchor="middle" dominant-baseline="central" transform="rotate(-90 ' + f1(mx) + " " + f1(my) + ')">' + esc(texte) + "</text>";
    } else {
      s += '<rect class="cq-mesure-fond" x="' + f1(mx - w / 2) + '" y="' + f1(my - 10) + '" width="' + f1(w) + '" height="20"/>';
      s += '<text class="cq-mesure" x="' + f1(mx) + '" y="' + f1(my) + '" text-anchor="middle" dominant-baseline="central">' + esc(texte) + "</text>";
    }
    return s;
  }
  function fraise(x, y, t) {
    return '<path class="cq-vide" d="M' + f1(x) + " " + f1(y + t) + "C" + f1(x - t * 1.1) + " " + f1(y + t * .3) + " " + f1(x - t * .9) + " " + f1(y - t * .8) + " " + f1(x) + " " + f1(y - t * .6) +
      "C" + f1(x + t * .9) + " " + f1(y - t * .8) + " " + f1(x + t * 1.1) + " " + f1(y + t * .3) + " " + f1(x) + " " + f1(y + t) + 'Z"/>' +
      '<circle class="cq-corps" cx="' + f1(x - t * .3) + '" cy="' + f1(y) + '" r="1"/><circle class="cq-corps" cx="' + f1(x + t * .3) + '" cy="' + f1(y - t * .1) + '" r="1"/><circle class="cq-corps" cx="' + f1(x) + '" cy="' + f1(y + t * .45) + '" r="1"/>';
  }
  function dessinRond(deco, n, cm) {
    var r = rayon(cm), s = "", k, a;
    if (deco === "tarte") {
      var pts = [];
      for (k = 0; k < 140; k++) { a = k / 140 * Math.PI * 2; var rr = r + 1.6 * Math.cos(28 * a); pts.push(f1(CX + rr * Math.cos(a)) + " " + f1(CY + rr * Math.sin(a))); }
      s += '<path class="cq-corps cq-pousse" d="M' + pts.join("L") + 'Z"/>';
      s += '<circle class="cq-trait" style="stroke-width:2.6" cx="' + CX + '" cy="' + CY + '" r="' + f1(r - 9) + '"/>';
      // la cassonade qui a caramélisé
      var hasard = alea(7);
      for (k = 0; k < Math.round(r * .5); k++) {
        var d = (r - 17) * Math.sqrt(hasard()), b = hasard() * Math.PI * 2;
        s += '<circle class="cq-vide" cx="' + f1(CX + d * Math.cos(b)) + '" cy="' + f1(CY + d * Math.sin(b)) + '" r="' + f1(.9 + hasard() * 2.1) + '"/>';
      }
    } else {
      s += '<circle class="cq-corps cq-pousse" cx="' + CX + '" cy="' + CY + '" r="' + f1(r) + '"/>';
      if (deco === "galette") {
        s += '<circle class="cq-trait" style="stroke-width:2.4" cx="' + CX + '" cy="' + CY + '" r="' + f1(r - 8) + '"/>';
        // la rosace dessinée au couteau sur la dorure
        for (k = 0; k < 18; k++) {
          a = k / 18 * Math.PI * 2;
          var r2 = r - 15;
          s += '<path class="cq-trait" style="stroke-width:1.8" d="M' + f1(CX + 7 * Math.cos(a)) + " " + f1(CY + 7 * Math.sin(a)) + "Q" + f1(CX + r2 * .6 * Math.cos(a + .12)) + " " + f1(CY + r2 * .6 * Math.sin(a + .12)) +
            " " + f1(CX + r2 * Math.cos(a + .5)) + " " + f1(CY + r2 * Math.sin(a + .5)) + '"/>';
        }
        // la couronne en papier, posée à côté
        var kx = CX + r * .92 + 4, ky = CY - r * .78;
        s += '<path class="cq-corps" style="stroke:var(--fond);stroke-width:3" d="M' + f1(kx - 24) + " " + f1(ky + 13) + "V" + f1(ky - 7) + "L" + f1(kx - 12) + " " + f1(ky + 3) + "L" + f1(kx) + " " + f1(ky - 12) + "L" + f1(kx + 12) + " " + f1(ky + 3) + "L" + f1(kx + 24) + " " + f1(ky - 7) + "V" + f1(ky + 13) + 'Z"/>';
        s += '<circle class="cq-vide" cx="' + f1(kx) + '" cy="' + f1(ky + 5) + '" r="2.6"/>';
      } else {
        // le bord poché à la douille
        s += '<circle class="cq-trait" style="stroke-width:5.5;stroke-dasharray:0 10.5" cx="' + CX + '" cy="' + CY + '" r="' + f1(r - 8) + '"/>';
      }
    }
    // Les parts : un coup de couteau du centre vers le bord
    for (var i = 0; i < n; i++) {
      a = -Math.PI / 2 + i / n * Math.PI * 2;
      s += ligne(CX, CY, CX + (r - 5) * Math.cos(a), CY + (r - 5) * Math.sin(a), i, CX, CY);
    }
    s += cote(CX - r, CY + r + 22, CX + r, CY + r + 22, "Ø " + cm + " cm");
    return { svg: s, plaque: { x: CX, y: CY, max: r * 1.62 } };
  }
  function dessinCadre(cols, rangs, cellule, fraises) {
    var l = cols * cellule, h = rangs * cellule, W = l * 7, H = h * 7, x0 = CX - W / 2, y0 = CY - H / 2 - 4, s = "", i = 0, c;
    s += '<rect class="cq-corps cq-pousse" x="' + f1(x0) + '" y="' + f1(y0) + '" width="' + f1(W) + '" height="' + f1(H) + '" rx="3"/>';
    if (!fraises) s += '<rect class="cq-trait" style="stroke-width:5.5;stroke-dasharray:0 10.5" x="' + f1(x0 + 8) + '" y="' + f1(y0 + 8) + '" width="' + f1(W - 16) + '" height="' + f1(H - 16) + '"/>';
    for (c = 1; c < cols; c++) s += ligne(x0 + c * W / cols, y0 + 5, x0 + c * W / cols, y0 + H - 5, i++, CX, y0 + H / 2);
    for (c = 1; c < rangs; c++) s += ligne(x0 + 5, y0 + c * H / rangs, x0 + W - 5, y0 + c * H / rangs, i++, CX, y0 + H / 2);
    if (fraises) {
      for (var a = 0; a < cols; a++) for (var b = 0; b < rangs; b++) s += fraise(x0 + (a + .5) * W / cols, y0 + (b + .5) * H / rangs, Math.min(W / cols, H / rangs) * .22);
    }
    s += cote(x0, y0 + H + 22, x0 + W, y0 + H + 22, l + " cm") + cote(x0 + W + 22, y0, x0 + W + 22, y0 + H, h + " cm");
    return { svg: s, plaque: { x: CX, y: y0 + H / 2, max: Math.min(W * .74, 230) } };
  }
  function dessinBuche(n) {
    var cm = BUCHE[n], L = cm * 9, H = 84, x0 = CX - L / 2 - 10, y0 = CY - H / 2 + 12, x1 = x0 + L, s = "", k;
    s += '<path class="cq-corps cq-pousse" d="M' + f1(x0 + 22) + " " + f1(y0) + "H" + f1(x1) + "V" + f1(y0 + H) + "H" + f1(x0 + 22) + "C" + f1(x0 + 6) + " " + f1(y0 + H) + " " + f1(x0 - 3) + " " + f1(y0 + H * .74) + " " + f1(x0 - 3) + " " + f1(y0 + H / 2) +
      "C" + f1(x0 - 3) + " " + f1(y0 + H * .26) + " " + f1(x0 + 6) + " " + f1(y0) + " " + f1(x0 + 22) + " " + f1(y0) + 'Z"/>';
    // le chicot, sur le dessus
    var cx = x0 + L * .28;
    s += '<path class="cq-corps" d="M' + f1(cx - 13) + " " + f1(y0 + 2) + "V" + f1(y0 - 15) + "Q" + f1(cx - 13) + " " + f1(y0 - 19) + " " + f1(cx - 9) + " " + f1(y0 - 19) + "H" + f1(cx + 9) + "Q" + f1(cx + 13) + " " + f1(y0 - 19) + " " + f1(cx + 13) + " " + f1(y0 - 15) + "V" + f1(y0 + 2) + 'Z"/>';
    s += '<ellipse class="cq-trait" style="stroke-width:1.6" cx="' + f1(cx) + '" cy="' + f1(y0 - 16) + '" rx="8.5" ry="2.4"/>';
    // l'écorce tracée à la fourchette
    for (k = 0; k < 4; k++) {
      var y = y0 + 13 + k * 17, pts = [];
      for (var x = x0 + 6; x < x1 - 14; x += 5) pts.push(f1(x) + " " + f1(y + Math.sin(x / 8 + k * 1.7) * 2.3));
      s += '<path class="cq-trait" style="stroke-width:1.7" d="M' + pts.join("L") + '"/>';
    }
    // le bout coupé, avec ses cernes
    s += '<ellipse class="cq-corps" style="stroke:var(--fond);stroke-width:2" cx="' + f1(x1) + '" cy="' + f1(y0 + H / 2) + '" rx="15" ry="' + f1(H / 2) + '"/>';
    s += '<ellipse class="cq-trait" style="stroke-width:1.8" cx="' + f1(x1) + '" cy="' + f1(y0 + H / 2) + '" rx="9" ry="' + f1(H / 2 - 12) + '"/>';
    s += '<ellipse class="cq-trait" style="stroke-width:1.8" cx="' + f1(x1) + '" cy="' + f1(y0 + H / 2) + '" rx="3.6" ry="' + f1(H / 2 - 25) + '"/>';
    for (var i = 1; i < n; i++) {
      var xi = x0 + 8 + (L - 8) * i / n;
      s += ligne(xi, y0 + 6, xi, y0 + H - 6, i, xi, y0 + H / 2);
    }
    s += cote(x0 - 3, y0 + H + 24, x1 + 15, y0 + H + 24, cm + " cm");
    return { svg: s, plaque: { x: x0 + L * .64, y: y0 - 6, max: L * .5, droite: true } };
  }
  function dessinPiece(n) {
    var choux = n * 3, visibles = Math.round(choux / 2), B = 1, s = "", k = 0, total;
    while (B * (B + 1) / 2 < visibles) B++;
    // Les choux se posent en moins d'une seconde, quelle que soit la taille de la pièce.
    total = B * (B + 1) / 2;
    var r = Math.min(16, 196 / (B * 1.72 + 1)), py = 2 * r * .86, yb = 222;
    s += '<path class="cq-corps" d="M' + f1(CX - B * r - 15) + " " + (yb + 18) + "L" + f1(CX - B * r - 5) + " " + yb + "H" + f1(CX + B * r + 5) + "L" + f1(CX + B * r + 15) + " " + (yb + 18) + 'Z"/>';
    for (var rang = 0; rang < B; rang++) {
      var compte = B - rang, y = yb - r - rang * py;
      for (var j = 0; j < compte; j++) {
        var x = CX + (j - (compte - 1) / 2) * 2 * r;
        s += '<g class="cq-chou" style="--i:' + Math.round(k++ * Math.min(1, 60 / total)) + '"><circle class="cq-corps" style="stroke:var(--fond);stroke-width:2" cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(r) + '"/>' +
          '<path class="cq-vide" d="M' + f1(x - r * .55) + " " + f1(y - r * .15) + "Q" + f1(x - r * .62) + " " + f1(y - r * .68) + " " + f1(x - r * .08) + " " + f1(y - r * .62) + "Q" + f1(x - r * .3) + " " + f1(y - r * .38) + " " + f1(x - r * .55) + " " + f1(y - r * .15) + 'Z"/></g>';
      }
    }
    // des fils de caramel en travers
    [.3, .55, .8].forEach(function (h, f) {
      var yy = yb - B * py * h, demi = B * r * (1 - h) + r, pts = [];
      for (var t = 0; t <= 20; t++) pts.push(f1(CX - demi + 2 * demi * t / 20) + " " + f1(yy + Math.sin(t / 20 * Math.PI * 2 + f * 1.4) * 3 + (t / 20 - .5) * (f % 2 ? -8 : 8)));
      s += '<path class="cq-trait" style="stroke-width:1.5" d="M' + pts.join("L") + '"/>';
    });
    var haut = Math.round(B * 3.2 + 4);
    s += cote(CX + B * r + 32, yb + 18, CX + B * r + 32, yb - B * py - r * .2, "≈ " + haut + " cm");
    return { svg: s, plaque: { x: CX, y: yb + 9, max: Math.max(120, B * r * 1.7) } };
  }
  function plaqueSvg(p, texte) {
    var t = (texte || "").trim();
    if (!t || !p) return "";
    var taille = Math.max(9, Math.min(16, (p.max - 18) / (t.length * .55)));
    var largeur = Math.min(p.max, t.length * taille * .55 + 20), hauteur = taille * 1.95;
    var ajuste = t.length * taille * .55 > largeur - 16 ? ' textLength="' + f1(largeur - 16) + '" lengthAdjust="spacingAndGlyphs"' : "";
    return '<g class="cq-plaque" transform="rotate(' + (p.droite ? 0 : -4) + " " + f1(p.x) + " " + f1(p.y) + ')"><rect x="' + f1(p.x - largeur / 2) + '" y="' + f1(p.y - hauteur / 2) + '" width="' + f1(largeur) + '" height="' + f1(hauteur) + '" rx="2"/>' +
      '<text x="' + f1(p.x) + '" y="' + f1(p.y + .5) + '" text-anchor="middle" dominant-baseline="central" style="font-size:' + f1(taille) + 'px"' + ajuste + ">" + esc(t) + "</text></g>";
  }

  function mmjj(d) { return d.m * 100 + d.j; }
  function enSaison(g, md) { var s = GATEAUX[g].saison; return !s || (md >= s[0] && md <= s[1]); }
  var aujourdhuiMd = mmjj(dateParis());

  // Les cartes « selon la saison » disent ce qu'on peut commander aujourd'hui.
  $$("[data-saison-carte]").forEach(function (c) {
    var g = c.dataset.saisonCarte, ok = enSaison(g, aujourdhuiMd);
    $("[data-saison-quand]", c).textContent = fin(SAISONS[lang][g][ok ? 0 : 1]);
    var b = $("[data-choisir]", c);
    if (b) b.hidden = !ok;
  });

  var bon = $("[data-bon]");
  if (bon) {
    var croquis = $("[data-croquis]", bon), coteEl = $("[data-cote]", bon), partsEl = $("[data-parts]", bon);
    var moins = $("[data-parts-moins]", bon), plus = $("[data-parts-plus]", bon), plaqueIn = $("[data-plaque]", bon);
    var lignePlaque = $("[data-ligne-plaque]", bon), descEl = $("[data-description]", bon), prixBon = $("[data-bon-prix]", bon);
    var dateSel = $("[data-date]", bon), momentSel = $("[data-moment-retrait]", bon), noteIn = $("[data-note]", bon);
    var titreParts = $("[data-parts-titre]", bon), numeroEl = $("[data-bon-numero]", bon), reponse = $("[data-bon-reponse]", bon), merci = $("[data-bon-merci]", bon);
    var erreurBon = $("[data-erreur]", bon), envoyerBon = $("[data-envoyer]", bon), autreBon = $("[data-nouvelle]", bon);
    var choix = { gateau: "chocolat", index: 2, ancre: null };

    // Hors saison, la bûche, la galette ou le fraisier disparaissent du bon.
    $$(".case[data-saison]", bon).forEach(function (c) { c.hidden = !enSaison(c.dataset.saison, aujourdhuiMd); });

    var valeur = function () { return GATEAUX[choix.gateau].parts[choix.index]; };
    var nomGateau = function () { return MOTS_GATEAUX[lang][choix.gateau][0]; };
    var majPlaque = function () {
      var zone = $("[data-cq-plaque]", croquis);
      if (zone) zone.innerHTML = GATEAUX[choix.gateau].plaque ? plaqueSvg(choix.ancre, plaqueIn.value) : "";
      croquis.setAttribute("aria-label", TXT[lang].croquis + nomGateau().toLowerCase() + ", " + coteEl.textContent +
        (GATEAUX[choix.gateau].plaque && plaqueIn.value.trim() ? ", " + TXT[lang].plaque + " « " + plaqueIn.value.trim() + " »" : ""));
    };
    var dessiner = function () {
      var g = GATEAUX[choix.gateau], n = valeur(), d, prixTotal;
      if (g.forme === "entremets") d = n <= 12 ? dessinRond("entremets", n, DIAMETRE.entremets[n]) : dessinCadre(CADRE[n][0], CADRE[n][1], 6, false);
      else if (g.forme === "tarte") d = dessinRond("tarte", n, DIAMETRE.tarte[n]);
      else if (g.forme === "galette") d = dessinRond("galette", n, DIAMETRE.galette[n]);
      else if (g.forme === "fraisier") d = dessinCadre(FRAISIER[n][0], FRAISIER[n][1], 7, true);
      else if (g.forme === "buche") d = dessinBuche(n);
      else d = dessinPiece(n);
      croquis.innerHTML = d.svg + "<g data-cq-plaque></g>";
      choix.ancre = d.plaque;
      partsEl.textContent = n;
      coteEl.textContent = g.forme === "piece" ? n + TXT[lang].personnes + " · " + n * 3 + TXT[lang].choux : n + TXT[lang].parts;
      prixTotal = g.tarif ? g.tarif[n] : g.prix * n;
      prixBon.textContent = prix(prixTotal);
      moins.disabled = choix.index === 0;
      plus.disabled = choix.index === g.parts.length - 1;
      majPlaque();
    };
    var remplirMoments = function () {
      var o = dateSel.options[dateSel.selectedIndex], dimanche = !!o && o.dataset.jour === "0", soir = $('option[value="soir"]', momentSel);
      soir.disabled = dimanche; soir.hidden = dimanche;
      if (dimanche) momentSel.value = "matin";
    };
    // Trois jours de délai (une semaine pour une grande pièce montée), jamais le mercredi, ni le 25 décembre ni le 1er janvier.
    var remplirDates = function () {
      var g = GATEAUX[choix.gateau], d = dateParis(), base = Date.UTC(d.a, d.m - 1, d.j), courant = dateSel.value;
      var delai = choix.gateau === "piece" && valeur() > 40 ? 7 : 3, dernier = g.retrait || (g.saison && g.saison[1]);
      var format = new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "fr-FR", { timeZone: "UTC", weekday: "long", day: "numeric", month: "long" });
      dateSel.innerHTML = "";
      for (var i = delai, n = 0; i < delai + 70 && n < 40; i++) {
        var t = new Date(base + i * 864e5), md = (t.getUTCMonth() + 1) * 100 + t.getUTCDate(), jour = t.getUTCDay();
        if (jour === 3 || md === 1225 || md === 101) continue;
        if (g.saison && (md < g.saison[0] || md > dernier)) continue;
        var o = document.createElement("option");
        o.value = t.toISOString().slice(0, 10);
        o.textContent = format.format(t);
        o.dataset.jour = jour;
        dateSel.appendChild(o);
        n++;
      }
      if (courant && $('option[value="' + courant + '"]', dateSel)) dateSel.value = courant;
      remplirMoments();
    };
    var changerGateau = function () {
      var c = $("input[name=gateau]:checked", bon), g;
      choix.gateau = c ? c.value : "chocolat";
      g = GATEAUX[choix.gateau];
      choix.index = g.parts.indexOf(g.defaut);
      descEl.textContent = fin(MOTS_GATEAUX[lang][choix.gateau][1]);
      lignePlaque.hidden = !g.plaque;
      noteIn.placeholder = choix.gateau === "buche" ? TXT[lang].parfum : TXT[lang].facultatif;
      titreParts.textContent = g.forme === "piece" ? TXT[lang].nbPersonnes : TXT[lang].nbParts;
      dessiner();
      remplirDates();
    };
    $$("input[name=gateau]", bon).forEach(function (r) { r.addEventListener("change", changerGateau); });
    moins.addEventListener("click", function () { if (choix.index > 0) { choix.index--; dessiner(); remplirDates(); } });
    plus.addEventListener("click", function () { if (choix.index < GATEAUX[choix.gateau].parts.length - 1) { choix.index++; dessiner(); remplirDates(); } });
    plaqueIn.addEventListener("input", majPlaque);
    dateSel.addEventListener("change", remplirMoments);
    $$("[data-choisir]").forEach(function (b) {
      b.addEventListener("click", function () {
        var r = $('input[name=gateau][value="' + b.dataset.choisir + '"]', bon);
        if (r && !bon.hasAttribute("data-envoyee")) { r.checked = true; changerGateau(); }
      });
    });

    var rappel = function () {
      var t = maintenantParis(), plage = HORAIRES[t.jour];
      if (plage && t.min >= plage[0] && t.min < plage[1] - 30) return remplir(TXT[lang].rappelAvant, { h: heure(plage[1]) });
      for (var i = 0; i < 8; i++) {
        var j = (t.jour + i) % 7, p = HORAIRES[j];
        if (!p || (i === 0 && t.min >= p[0])) continue;
        var quand = (i === 0 ? TXT[lang].aujourdhuiDes : i === 1 ? TXT[lang].demainDes : (lang === "en" ? "on " : "") + JOURS[lang][j] + TXT[lang].jourDes) + heure(p[0]);
        return remplir(TXT[lang].rappelPlusTard, { quand: quand });
      }
      return "";
    };
    var verrouillerBon = function (oui) {
      $$("input, select, button[data-parts-moins], button[data-parts-plus]", bon).forEach(function (e) { e.disabled = oui; });
      if (oui) bon.setAttribute("data-envoyee", ""); else { bon.removeAttribute("data-envoyee"); dessiner(); }
      envoyerBon.hidden = oui; autreBon.hidden = !oui;
    };
    bon.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var nom = bon.elements.nom.value.trim(), tel = bon.elements.tel.value.trim();
      var msg = !dateSel.value ? TXT[lang].bonDate : !nom ? TXT[lang].bonNom : tel.replace(/\D/g, "").length < 8 ? TXT[lang].tel : "";
      erreurBon.hidden = !msg; erreurBon.textContent = msg;
      if (msg) { (!dateSel.value ? dateSel : !nom ? bon.elements.nom : bon.elements.tel).focus(); return; }
      numeroEl.textContent = String(Math.floor(1000 + Math.random() * 9000));
      merci.textContent = fin(rappel());
      reponse.hidden = false;
      verrouillerBon(true);
      reponse.scrollIntoView({ behavior: reduit ? "auto" : "smooth", block: "center" });
    });
    autreBon.addEventListener("click", function () {
      reponse.hidden = true;
      numeroEl.textContent = "";
      ["nom", "tel", "note", "plaque"].forEach(function (k) { bon.elements[k].value = ""; });
      verrouillerBon(false);
      $(".bon__gateaux", bon).scrollIntoView({ behavior: reduit ? "auto" : "smooth", block: "start" });
    });

    if (!$("input[name=gateau]:checked", bon) || $("input[name=gateau]:checked", bon).closest(".case").hidden) $('input[value="chocolat"]', bon).checked = true;
    changerGateau();
  }

  function tout() { majMaintenant(); majHorloges(); majEtat(); majAujourdhui(); majTableau(); majDock(); majPuces(); }
  tout();
  setInterval(majHorloges, 1000);
  setInterval(function () { majMaintenant(); majEtat(); majTableau(); majAujourdhui(); majPuces(); }, 30000);
})();
