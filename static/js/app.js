// Gestion des boutons "Voir plus" dans les catégories fixes (avec éléments .movie-item.hidden)
document.querySelectorAll('.show-more-btn').forEach(btn => {
  // On remonte à la section parent
  const section = btn.closest('.category-section');
  if (!section) return;

  btn.addEventListener('click', () => {
      const hiddenMovies = section.querySelectorAll('.movie-item.hidden');
      hiddenMovies.forEach(item => item.classList.toggle('visible'));

      btn.textContent = btn.textContent === 'Voir plus' ? 'Voir moins' : 'Voir plus';
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
  
    toggle.addEventListener('click', () => {
      const isOpen = dd.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });
  
    items.forEach(item => {
      item.addEventListener('click', () => selectCategory(item));
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectCategory(item);
        }
      });
    });
  
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
        display.classList.add('single-column');  // <-- Force une colonne même quand vide
      }
    }
    
  
    function updateShowMoreButton() {
      if (displayedCount >= currentMovies.length) {
        showMoreBtn.textContent = 'Voir moins';
      } else {
        showMoreBtn.textContent = 'Voir plus';
      }
      showMoreBtn.style.display = currentMovies.length > INITIAL_COUNT ? 'block' : 'none';
    }
  
    function selectCategory(item) {
      items.forEach(i => i.removeAttribute('aria-selected'));
      item.setAttribute('aria-selected', 'true');
  
      const selectedText = item.querySelector('span').textContent;
      toggle.querySelector('.selected-value').textContent = selectedText;
      dd.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
  
      try {
        const moviesAttr = item.getAttribute('data-movies');
        currentMovies = moviesAttr ? JSON.parse(moviesAttr) : [];
        if (!Array.isArray(currentMovies)) currentMovies = [];
      } catch {
        currentMovies = [];
      }
  
      displayedCount = Math.min(INITIAL_COUNT, currentMovies.length);
      renderMovies(currentMovies, displayedCount);
      updateShowMoreButton();
    }
  
    showMoreBtn.addEventListener('click', () => {
      if (displayedCount >= currentMovies.length) {
        displayedCount = Math.min(INITIAL_COUNT, currentMovies.length);
      } else {
        displayedCount = Math.min(displayedCount + INCREMENT, currentMovies.length);
      }
      renderMovies(currentMovies, displayedCount);
      updateShowMoreButton();
    });
  });
  