// Gestion des boutons "Voir plus" dans les catégories fixes (avec éléments .movie-item.hidden)
document.querySelectorAll('.show-more-btn').forEach(btn => {
  // On remonte jusqu'à la <section> parent
  const section = btn.closest('section');
  if (!section) return;

  btn.addEventListener('click', () => {
    // On affiche / masque les .movie-item.hidden
    const hiddenMovies = section.querySelectorAll('.movie-item.hidden');
    hiddenMovies.forEach(item => item.classList.toggle('visible'));

    // On alterne le texte du bouton
    btn.textContent = btn.textContent === 'Voir plus' ? 'Voir moins' : 'Voir plus';

    // —— SCROLL + FOCUS : on ramène le bouton à l'écran et lui redonne le focus
    btn.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
    btn.focus();
  });
});

// Gestion spécifique du bouton "Voir plus" dans la section "Autres"
document.addEventListener('DOMContentLoaded', () => {
  const dd = document.getElementById('genre-dropdown');
  const toggle = dd.querySelector('.dropdown-toggle');
  const items = dd.querySelectorAll('.dropdown-items li');
  const display = document.getElementById('selected-category-container');
  const showMoreBtn = document.getElementById('others-show-more-btn');

  let currentMovies = [];
  let displayedCount = 0;
  const INITIAL_COUNT = 2;
  const INCREMENT = 4;

  // --------- AJOUT : fonction helper pour détecter le desktop
  function isDesktop() {
    return window.innerWidth >= 1024;
  }

  // Ouvre/ferme le menu déroulant
  toggle.addEventListener('click', () => {
    const isOpen = dd.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Sélection de catégorie au clic et au clavier
  items.forEach(item => {
    item.addEventListener('click', () => selectCategory(item));
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectCategory(item);
      }
    });
  });

  // Ferme la dropdown si on clique à l'extérieur
  document.addEventListener('click', e => {
    if (!dd.contains(e.target)) {
      dd.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
    }
  });

  function renderMovies(movies, count) {
    const moviesToShow = movies.slice(0, count);

    if (moviesToShow.length > 0) {
      display.innerHTML = moviesToShow.map(({ title, image }) => `
        <div class="movie-item">
          <img src="${image}" alt="${title}">
          <div class="overlay">
            <span>${title}</span>
            <button class="movie-button">Détails</button>
          </div>
        </div>
      `).join('');
      display.classList.remove('single-column');
    } else {
      display.innerHTML = `<p class="no-movie-message">Aucun film disponible pour cette catégorie.</p>`;
      display.classList.add('single-column');
    }
  }

  // --------- AJOUT : mise à jour du bouton selon la largeur écran
  function updateShowMoreButton() {
    if (isDesktop()) {
      showMoreBtn.style.display = 'none';
      return;
    }
    showMoreBtn.textContent = (displayedCount >= currentMovies.length) ? 'Voir moins' : 'Voir plus';
    showMoreBtn.style.display = currentMovies.length > INITIAL_COUNT ? 'block' : 'none';
  }

  // --------- MODIFIE : adapte le nombre de films selon la largeur écran
  function selectCategory(item) {
    items.forEach(i => i.removeAttribute('aria-selected'));
    item.setAttribute('aria-selected', 'true');

    toggle.querySelector('.selected-value').textContent = item.querySelector('span').textContent;
    dd.classList.remove('open');
    toggle.setAttribute('aria-expanded', false);

    try {
      const moviesAttr = item.getAttribute('data-movies');
      currentMovies = moviesAttr ? JSON.parse(moviesAttr) : [];
      if (!Array.isArray(currentMovies)) currentMovies = [];
    } catch {
      currentMovies = [];
    }

    if (isDesktop()) {
      displayedCount = currentMovies.length;
    } else {
      displayedCount = Math.min(INITIAL_COUNT, currentMovies.length);
    }
    renderMovies(currentMovies, displayedCount);
    updateShowMoreButton();
  }

  // Lorsque l'on clique sur "Voir plus" / "Voir moins" dans "Autres"
  showMoreBtn.addEventListener('click', () => {
    if (displayedCount >= currentMovies.length) {
      displayedCount = Math.min(INITIAL_COUNT, currentMovies.length);
    } else {
      displayedCount = Math.min(displayedCount + INCREMENT, currentMovies.length);
    }
    renderMovies(currentMovies, displayedCount);
    updateShowMoreButton();

    // —— SCROLL + FOCUS pour le bouton "Autres" aussi
    showMoreBtn.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
    showMoreBtn.focus();
  });

  // --------- AJOUT : mets à jour l'affichage lors d'un resize
  window.addEventListener('resize', () => {
    if (currentMovies.length > 0) {
      if (isDesktop()) {
        displayedCount = currentMovies.length;
      } else {
        displayedCount = Math.min(INITIAL_COUNT, currentMovies.length);
      }
      renderMovies(currentMovies, displayedCount);
      updateShowMoreButton();
    }
  });

});
