# Démo boulangerie — Boulangerie Delcourt

Site de démonstration de la formule **Premium** de [Moreau Digital](https://moreaudigital.fr) : un site sur mesure pour une boulangerie **fictive** à Étaples (62), en trois pages et en deux langues. Le fil rouge : ce que les clients ne voient jamais, le travail du boulanger pendant la nuit.

En ligne : https://julesmoreau62.github.io/demo-boulangerie/ (version anglaise : `en/`)

## L'idée

Une seule encre, comme sur un sachet de boulangerie : bleu de nuit sur papier farine, et l'orange du four pour ce qui est chaud. Le nom en très grandes lettres larges posé sur une baguette entaillée de sept coups de lame, comme sur les sachets, les heures en chiffres d'horloge, et un hublot rond qui sert à la fois de lune, de vitre du four et de soleil. Boutons et étiquettes rectangulaires, comme des étiquettes imprimées ; seuls le hublot et le voyant d'ouverture sont ronds. La nuit, de la farine semée en points fait aussi des étoiles.

Les pains et les gâteaux sont dessinés comme les impressions des sachets : un corps à l'encre pleine, les coups de lame découpés dedans. Quand un pain arrive à l'écran, la lame passe dessus.

Le site suit l'heure d'Étaples : bleu la nuit, couleur farine le jour.

## Les pages

**Accueil** (`index.html`)

- **Maintenant** : l'horloge à l'heure de Paris et une phrase qui dit ce qui se passe au fournil à cette minute (le levain, le façonnage, le four plein, la prochaine fournée dans 42 min, fermé jusqu'à jeudi…), avec la photo qui va avec. La nuit, la photo prend la couleur du ciel ; pendant la cuisson, le hublot devient la porte du four
- **La nuit au fournil** (contenu sur mesure) : en défilant, l'horloge tourne de 22 h à 6 h 45, minute par minute, et le ciel passe de la nuit à l'aube puis au jour. Sept étapes, du levain à l'ouverture. En haut, une baguette sert de jauge : un coup de lame par étape, et elle dore pendant la cuisson
- **Les fournées du jour** en direct : sortie, tout chaud, dans 2 h 14, ou celles de demain si la journée est finie
- **Réservation** (fonction en plus) : le ticket de caisse s'imprime pendant qu'on choisit, puis reçoit son numéro, le nom et le tampon « Mis de côté ». Ici rien n'est envoyé ; sur un vrai site, la commande part par e-mail
- **Sur la vitrine** : les annonces du moment (fonction « actualités » en plus)
- Horaires avec le jour courant surligné, numéro en grand, itinéraire, plan Google chargé seulement si on le demande

**Nos pains** (`pains.html`, la carte)

- **Le pain du jour** : un pain différent chaque jour de la semaine (seigle le lundi, pain à la bière le jeudi, pain aux algues le vendredi…). Onglets du lundi au dimanche, aujourd'hui ouvert d'office et souligné d'orange ; le mercredi, on se repose
- **La carte du comptoir**, comme un tarif imprimé : pains, viennoiseries, douceurs du Nord (tarte au sucre, tarte au libouli, merveilleux, gaufre fourrée), avec prix, poids et allergènes. Sous chaque pain, les fournées où il sort : la prochaine en bleu, celle qui sort du four en orange, et les heures du dimanche le dimanche
- Données structurées `Menu` (schema.org)

**Gâteaux** (`gateaux.html`, sur commande)

- En haut, une pièce montée se monte rang par rang
- **Le bon de commande** (fonction en plus) : un feuillet arraché du carnet, qu'on remplit au stylo. On coche le gâteau, on règle le nombre de parts, on écrit le message de la plaque en chocolat : le croquis suit, avec ses cotes (rond, cadre au-delà de 12 parts, tarte, bûche, pièce montée, galette avec sa couronne, fraisier) et le prix indicatif. Retrait trois jours plus tard au plus tôt (une semaine pour une pièce montée de plus de 40 personnes), jamais le mercredi, ni le 25 décembre ni le 1er janvier. À l'envoi, le bon reçoit son numéro, le tampon « Reçu » et dit quand Claire rappelle, selon l'heure. Ici rien n'est envoyé
- **Selon la saison** : la bûche (jusqu'au 20 décembre), la galette (en janvier) et le fraisier (de mai à septembre) n'apparaissent dans le bon qu'à leur saison

**Sur toutes les pages**

- **Version anglaise** (fonction en plus) : de vraies pages dans `en/` (`index.html`, `bread.html`, `cakes.html`), avec `hreflang`. Le bouton EN / FR mène à la même page dans l'autre langue
- Ouvert ou fermé en direct dans l'en-tête
- Sur mobile, une barre fixe en bas : appeler, l'action de la page (réserver, commander un gâteau ; sur l'accueil, elle affiche le total du ticket) et le menu, qui sort comme un sachet de boulangerie
- Données structurées `Bakery` sur l'accueil

Pour montrer le site à une autre heure pendant une démo : ajouter `?heure=3:12` à l'adresse (et `&jour=4` pour un jeudi, 0 = dimanche). Les liens gardent l'heure d'une page à l'autre.

## Technique

HTML, CSS et un peu de JavaScript (`app.js`, commun aux six pages), sans outil de compilation. Les pages anglaises sont des copies traduites, avec les mêmes classes et les mêmes ancres : une modification se fait dans les deux langues. Polices hébergées sur place, sous licence SIL OFL : Archivo (largeur variable, pour les grandes lettres), Fraunces et Familjen Grotesk. Photos recadrées en carré dans `photos/` (`rond-*.webp`, 480 px et taille d'origine). Pains et gâteaux en SVG dans les pages. Sans JavaScript, ou si le téléphone demande moins de mouvement, la nuit et le pain de chaque jour s'affichent en liste et tout le contenu reste lisible.

```bash
python3 -m http.server 8080
```

## Avertissements

- Commerce, adresse, brasserie et personnes fictifs. Le numéro (03 53 01 47 91) appartient à une plage réservée par l'ARCEP aux œuvres de fiction.
- Pages en `noindex`.
- Photos libres de droit, licence [Unsplash](https://unsplash.com/fr/licence) : Skyler Ewing, Gaëlle Marcel, Santesson, Tetiana Padurets, Sobalc, The Now Time, NS Doyle, Tunnuz, Mae Mu, Pic of Tasty. Aucun visage : Antoine et Claire sont fictifs. Sur la photo de devanture, le numéro de la boutique réelle est flouté. Crédits aussi en bas de page. Dessins de pains et de gâteaux : Moreau Digital.
