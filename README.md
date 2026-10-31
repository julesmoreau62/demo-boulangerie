# Démo boulangerie — Boulangerie Delcourt

Page de démonstration de la formule **Premium** de [Moreau Digital](https://moreaudigital.fr) : un site sur mesure pour une boulangerie **fictive** à Étaples (62). Le fil rouge : ce que les clients ne voient jamais, le travail du boulanger pendant la nuit.

En ligne : https://julesmoreau62.github.io/demo-boulangerie/

## L'idée

Une seule encre, comme sur un sachet de boulangerie : bleu de nuit sur papier farine, et l'orange du four pour ce qui est chaud. Le nom en très grandes lettres larges posé sur une baguette entaillée de sept coups de lame, comme sur les sachets, les heures en chiffres d'horloge, et un hublot rond qui sert à la fois de lune, de vitre du four et de soleil. Boutons et étiquettes rectangulaires, comme des étiquettes imprimées ; seuls le hublot et le voyant d'ouverture sont ronds. La nuit, de la farine semée en points fait aussi des étoiles.

La page suit l'heure d'Étaples : bleue la nuit, couleur farine le jour.

## Ce que montre la page

- **Maintenant** : l'horloge à l'heure de Paris et une phrase qui dit ce qui se passe au fournil à cette minute (le levain, le façonnage, le four plein, la prochaine fournée dans 42 min, fermé jusqu'à jeudi…), avec la photo qui va avec. La nuit, la photo prend la couleur du ciel ; pendant la cuisson, le hublot devient la porte du four
- **La nuit au fournil** (contenu sur mesure) : en défilant, l'horloge tourne de 22 h à 6 h 45, minute par minute, et le ciel passe de la nuit à l'aube puis au jour. Sept étapes, du levain à l'ouverture. En haut, une baguette sert de jauge : un coup de lame par étape, et elle dore pendant la cuisson
- **Les fournées du jour** en direct : sortie, tout chaud, dans 2 h 14, ou celles de demain si la journée est finie
- **Réservation** (fonction en plus) : le ticket de caisse s'imprime pendant qu'on choisit, puis reçoit son numéro, le nom et le tampon « Mis de côté ». Ici rien n'est envoyé ; sur un vrai site, la commande part par e-mail
- **Version anglaise** : bouton FR / EN (fonction en plus)
- **Sur la vitrine** : les annonces du moment (fonction « actualités » en plus)
- Ouvert ou fermé en direct, jour courant surligné dans les horaires, numéro en grand, itinéraire, plan Google chargé seulement si on le demande, barre d'actions fixe sur mobile qui affiche le total du ticket
- Données structurées `Bakery` (schema.org)

Pour montrer la page à une autre heure pendant une démo : ajouter `?heure=3:12` à l'adresse (et `&jour=4` pour un jeudi, 0 = dimanche).

## Technique

HTML, CSS et un peu de JavaScript, sans outil de compilation. Polices hébergées sur place, sous licence SIL OFL : Archivo (largeur variable, pour les grandes lettres), Fraunces et Familjen Grotesk. Photos recadrées en carré dans `photos/` (`rond-*.webp`, 480 px et taille d'origine). Sans JavaScript, ou si le téléphone demande moins de mouvement, la nuit s'affiche en liste et tout le contenu reste lisible.

```bash
python3 -m http.server 8080
```

## Avertissements

- Commerce, adresse et personnes fictifs. Le numéro (03 53 01 47 91) appartient à une plage réservée par l'ARCEP aux œuvres de fiction.
- Page en `noindex`.
- Photos libres de droit, licence [Unsplash](https://unsplash.com/fr/licence) : Skyler Ewing, Gaëlle Marcel, Santesson, Tetiana Padurets, Sobalc, The Now Time, NS Doyle, Tunnuz, Mae Mu, Pic of Tasty. Aucun visage : Antoine et Claire sont fictifs. Sur la photo de devanture, le numéro de la boutique réelle est flouté. Crédits aussi en bas de page.
