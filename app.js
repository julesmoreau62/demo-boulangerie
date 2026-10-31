/* Maison Vasseur — état d'ouverture et prochaine fournée, à l'heure de Paris.
   Sans JavaScript, la page reste complète : horaires et fournées sont dans le HTML. */
(function () {
  // Minutes depuis minuit. 0 = dimanche.
  var HORAIRES = {
    0: [420, 750],
    1: [405, 1170],
    2: [405, 1170],
    3: null,
    4: [405, 1170],
    5: [405, 1170],
    6: [405, 1140]
  };
  var FOURNEES = {
    0: [420, 600],
    1: [405, 690, 1020], 2: [405, 690, 1020], 3: [],
    4: [405, 690, 1020], 5: [405, 690, 1020], 6: [405, 690, 1020]
  };
  var JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

  function maintenantParis() {
    var parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Paris", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23"
    }).formatToParts(new Date());
    var v = {};
    parts.forEach(function (p) { v[p.type] = p.value; });
    var jour = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(v.weekday);
    return { jour: jour, min: parseInt(v.hour, 10) * 60 + parseInt(v.minute, 10) };
  }

  function heure(min) {
    var h = Math.floor(min / 60), m = min % 60;
    return h + " h" + (m ? " " + String(m).padStart(2, "0") : "");
  }

  function duree(min) {
    if (min < 60) return min + " min";
    var h = Math.floor(min / 60), m = min % 60;
    return h + " h" + (m ? " " + String(m).padStart(2, "0") : "");
  }

  function prochaineOuverture(t) {
    for (var i = 0; i < 8; i++) {
      var j = (t.jour + i) % 7, plage = HORAIRES[j];
      if (!plage) continue;
      if (i === 0 && t.min >= plage[0]) continue;
      var quand = i === 0 ? "à " : i === 1 ? "demain à " : JOURS[j] + " à ";
      return quand + heure(plage[0]);
    }
    return "";
  }

  function majEtat(t) {
    var el = document.querySelector("[data-etat]");
    if (!el) return;
    var plage = HORAIRES[t.jour], texte, classe;
    if (plage && t.min >= plage[0] && t.min < plage[1]) {
      var reste = plage[1] - t.min;
      classe = reste <= 45 ? "etat--bientot" : "etat--ouvert";
      texte = (reste <= 45 ? "Ferme bientôt · " : "Ouvert jusqu'à ") + heure(plage[1]);
    } else {
      classe = "etat--ferme";
      texte = "Fermé · ouvre " + prochaineOuverture(t);
    }
    el.className = "etat " + classe;
    el.querySelector("[data-etat-texte]").textContent = texte;
    el.hidden = false;
  }

  function majFournees(t) {
    var liste = FOURNEES[t.jour];
    var prochaine = null;
    for (var i = 0; i < liste.length; i++) {
      if (liste[i] > t.min) { prochaine = liste[i]; break; }
    }

    // La frise ne décrit que les jours de semaine : on la marque hors dimanche et mercredi.
    if (t.jour !== 0 && t.jour !== 3) {
      document.querySelectorAll("[data-fournees] .fournee").forEach(function (li) {
        var m = parseInt(li.getAttribute("data-min"), 10);
        if (m <= t.min) li.classList.add("fournee--passee");
        if (m === prochaine) {
          li.classList.add("fournee--prochaine");
          var badge = document.createElement("span");
          badge.className = "fournee__badge";
          badge.textContent = "dans " + duree(m - t.min);
          li.appendChild(badge);
        }
      });
    }
  }

  function majAujourdhui(t) {
    var ligne = document.querySelector('.horaires__table tr[data-jour="' + t.jour + '"]');
    if (ligne) ligne.classList.add("aujourdhui");
  }

  // Sur mobile, la carte se lit une catégorie à la fois (le CSS ignore les onglets sur grand écran).
  function ongletsArdoise() {
    var ardoise = document.querySelector("[data-ardoise]");
    if (!ardoise) return;
    var nav = ardoise.querySelector(".ardoise__onglets");
    var categories = ardoise.querySelectorAll(".categorie");
    function activer(id) {
      categories.forEach(function (c) { c.classList.toggle("est-active", c.id === id); });
      nav.querySelectorAll("button").forEach(function (b) {
        b.setAttribute("aria-pressed", b.getAttribute("aria-controls") === id ? "true" : "false");
      });
    }
    nav.addEventListener("click", function (e) {
      var bouton = e.target.closest("button");
      if (bouton) activer(bouton.getAttribute("aria-controls"));
    });
    activer(categories[0].id);
    ardoise.classList.add("ardoise--onglets");
    nav.hidden = false;
  }
  ongletsArdoise();

  var t = maintenantParis();
  if (t.jour < 0) return;
  majEtat(t);
  majFournees(t);
  majAujourdhui(t);
})();
