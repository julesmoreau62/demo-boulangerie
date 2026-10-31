# Démo boulangerie — Maison Vasseur

Page de démonstration de la formule **Essentiel** de [Moreau Digital](https://moreaudigital.fr) : un site vitrine d'une page pour une boulangerie-pâtisserie **fictive** à Montreuil-sur-Mer (62).

En ligne : https://julesmoreau62.github.io/demo-boulangerie/

## Ce que montre la page

- Ouvert ou fermé en direct (heure de Paris), jour courant surligné dans les horaires
- Les fournées de la journée, avec la prochaine mise en avant
- La carte sur une ardoise : onglets sur mobile, deux colonnes sur grand écran
- Horaires, adresse, carte Google Maps, itinéraire et appel en un geste
- Barre d'actions fixe sur mobile
- Données structurées `Bakery` (schema.org) pour Google et les assistants IA

## Technique

HTML, CSS et un peu de JavaScript, sans outil de compilation. Publié avec GitHub Pages depuis la branche `main`.

Pour la voir en local :

```bash
python -m http.server 8080
```

## Avertissements

- Commerce, adresse et personnes fictifs. Le numéro (03 53 01 47 82) appartient à une plage réservée par l'ARCEP aux œuvres de fiction.
- La page est en `noindex` pour ne pas être référencée.
- Photos libres de droit, licence [Unsplash](https://unsplash.com/fr/licence) : The Now Time (devanture), Stefan Hiienurm (boulangère), Mae Mu (miches). Sur la photo de devanture, le numéro de téléphone de la boutique réelle a été flouté.
