# 🎬 Movie Explorer – Application Web de Navigation de Films

Une application web responsive de découverte de films, utilisant une API locale, développée en vanilla JS et CSS, optimisée pour un affichage multi-plateformes (desktop, tablette, mobile).

---

## 🚀 Fonctionnalités

- **Affichage du meilleur film**
  - Présentation dynamique du film le mieux noté de l’API en haut de page.
  - Ouverture de la fiche détaillée (modale) possible via l’affiche ou le bouton « Détails ».

- **Modal détaillée (fiche film complète)**
  - Contient : affiche, titre, genres complets, année de sortie, classification, score IMDb, réalisateurs, acteurs, durée, pays d’origine, recettes box-office, résumé.
  - S’ouvre via : image, titre, bouton Détails, overlay (pour toutes les catégories).
  - Fermeture : bouton, clic sur l’overlay ou touche `ESC`.
  - Accessible clavier et souris.

- **Sections thématiques**
  - **Top films toutes catégories**.
  - **Catégories fixes** : Action, Aventure.
  - **Dropdown dynamique** : sélection d’autres genres parmi tous les genres de l’API (liste complète à jour).

- **Navigation accessible**
  - Boutons “Voir plus/moins” dans chaque section pour révéler/masquer les films cachés.
  - Dropdown “Autres genres” accessible clavier/souris, navigation au clavier (flèches, tab, entrée).

- **Fallback images**
  - Affiche alternative si le film n’a pas d’affiche disponible (pas d’image cassée).

- **Responsive Design (RWD)**
  - **Interface réactive** : l’affichage s’adapte à tous les écrans (PC, tablette, mobile).
  - **Nombre de films visibles par section selon la taille d’écran** :
    - **PC** : 6 films affichés.
    - **Tablette** : 4 films affichés (2 cachés).
    - **Mobile** : 2 films affichés (4 cachés).
  - Les films cachés peuvent être affichés via le bouton “Voir plus”, puis masqués de nouveau (“Voir moins”).

- **Expérience utilisateur optimisée**
  - Défilement automatique sur les bons éléments lors des interactions pour faciliter la navigation (hors mobile).
  - Focus et accessibilité clavier pris en compte sur tous les boutons.
  - Affichage instantané des films sans rechargement de page.

---

## 🗂️ Structure du projet

```bash
static/
├── assets/
│ └── no_poster.svg # Image fallback pour affiches manquantes
├── css/
│ ├── global.css # Styles généraux
│ ├── style.css # Styles personnalisés principaux
│ ├── modal.css 
│ └── sections/
│ ├── best_movie.css
│ ├── categories.css
│ ├── drop_down_menu.css
│ └── header.css
├── js/
│ ├── api.js # Requêtes API centralisées
│ ├── app.js # Point d'entrée, initialisation de l’UI
│ ├── ui.js # Fonctions d’affichage et interactions
│ └── modal.js # Gestion dynamique de la modale
└── html/
└── index.html # Page principale
```

---

## ⚙️ Stack technique

- **Front** : HTML5, CSS3 (organisation modulaire), Vanilla JS (ES6 modules)
- **Backend/API** : API locale REST (Django REST version 5.0)
- **Assets** : Images SVG, responsive et optimisées

---

## 🛠️ Installation & Lancement

### Prérequis

- Node.js **(pour servir les fichiers statiques en local, ex: `http-server` ou `live-server`)**
- Une API films fonctionnelle accessible sur `localhost:8000` (respectant les endpoints `/api/v1/titles/`, `/api/v1/genres/`)

### Démarrage rapide

```bash
# 1. Clone le repo de l'API (films)
git clone https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR.git
cd OCMovies-API-EN-FR

# 2. Crée et active un environnement virtuel Python
#   Sur Windows :
python -m venv env
env\Scripts\activate

#   Sur Mac/Linux :
python3 -m venv env
source env/bin/activate

# 3. Installe les dépendances
pip install -r requirements.txt

# 4. Crée la base de données
python manage.py create_db

# 5. Lance l'API en local (par défaut sur localhost:8000)
python manage.py runserver
# Si vous souhaitez changer le port, il suffit de faire python manage.py runserver numéro_port
# python manage.py runserver 9000 # (exemple : pour être sur le port 9000)

# Plus d'informations sur le fonctionnement de l'API : https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR

# 6. Clone le repo du site (front)
git clone https://github.com/NZT48DEV/Projet_6_OC_Web_Application.git

# 7. Ouvre le dossier dans VS Code ou un éditeur compatible extensions
# 8. Installe l'extension "Live Server"
# 9. Navigue jusqu'au fichier static/html/index.html
# 10. Clique-droit > "Open with Live Server" (ou bouton "Go Live" en bas)
# 11. Accède à l’URL proposée (http://127.0.0.1:5500/static/html/index.html)
```
