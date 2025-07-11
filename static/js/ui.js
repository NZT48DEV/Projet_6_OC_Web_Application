// ui.js — Gestion des boutons, dropdowns, rendering liste films
import { openModal } from './modal.js';
import { fetchTopMoviesByGenre, fetchMovieDetails } from './api.js';
import { NO_POSTER } from './app.js';

// --------- Boutons "Voir plus" des sections fixes ---------
export function setupShowMoreButtons() {
  document.querySelectorAll('.show-more-btn').forEach(btn => {
    const section = btn.closest('section');
    if (!section) return;

    btn.addEventListener('click', () => {
      const hiddenMovies = section.querySelectorAll('.movie-item.hidden');
      hiddenMovies.forEach(item => item.classList.toggle('visible'));
      btn.textContent = btn.textContent === 'Voir plus' ? 'Voir moins' : 'Voir plus';
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      btn.focus();
    });
  });
}

// --------- Fonction utilitaire propre pour gestion d'image fallback ---------
function renderPoster(url, alt, extra = '') {
  return `
    <img
      src="${url ? url : NO_POSTER}"
      alt="${alt}"
      onerror="this.onerror=null;this.src='${NO_POSTER}';"
      ${extra}
    >
  `;
}

// --------- Helpers pour Responsive ---------
function getDeviceType() {
  const w = window.innerWidth;
  if (w > 1024) return 'desktop';
  if (w >= 769) return 'tablet';
  return 'mobile';
}
function getInitialCount() {
  const type = getDeviceType();
  if (type === 'desktop') return 6;
  if (type === 'tablet') return 4;
  return 2;
}
function getIncrement() {
  const type = getDeviceType();
  if (type === 'desktop') return 0;
  if (type === 'tablet') return 2;
  return 4;
}

// --------- Rendu catégorie générique (Action, Aventure, ...) ---------
export function renderCategoryMovies(gridSelector, movies, showInit = 2) {
  const grid = document.querySelector(gridSelector);
  if (!grid) return;
  grid.innerHTML = movies.map((movie, idx) => `
    <div class="movie-item${idx >= showInit ? ' hidden' : ''}" data-id="${movie.id}">
      ${renderPoster(movie.image_url, `Affiche du film '${movie.title.replace(/'/g, "\\'")}'`)}
      <div class="overlay">
        <span>${movie.title}</span>
        <button class="movie-button"${movie.id ? '' : ' disabled'}>Détails</button>
      </div>
    </div>
  `).join('');
}

// --------- Dropdown + liste films section "Autres" ---------
export function setupDropdown() {
  const dd = document.getElementById('genre-dropdown');
  if (!dd) return;

  const toggle = dd.querySelector('.dropdown-toggle');
  const ul = dd.querySelector('.dropdown-items');
  const display = document.getElementById('selected-category-container');
  const showMoreBtn = document.getElementById('others-show-more-btn');

  let currentMovies = [];
  let displayedCount = 0;
  let INITIAL_COUNT = getInitialCount();
  let INCREMENT = getIncrement();

  function renderMovies(movies, count) {
    const moviesToShow = movies.slice(0, count);
    if (moviesToShow.length > 0) {
      display.innerHTML = moviesToShow.map(({ title, image_url, id }) => `
        <div class="movie-item" data-id="${id}">
          ${renderPoster(image_url, title)}
          <div class="overlay">
            <span>${title}</span>
            <button class="movie-button"${id ? '' : ' disabled'}>Détails</button>
          </div>
        </div>
      `).join('');
      display.classList.remove('single-column');
    } else {
      display.innerHTML = `<p class="no-movie-message">Aucun film disponible pour cette catégorie.</p>`;
      display.classList.add('single-column');
    }
  }

  function updateShowMoreButton() {
    if (getDeviceType() === 'desktop') {
      showMoreBtn.style.display = 'none';
      return;
    }
    showMoreBtn.textContent = (displayedCount >= currentMovies.length) ? 'Voir moins' : 'Voir plus';
    showMoreBtn.style.display = currentMovies.length > INITIAL_COUNT ? 'block' : 'none';
  }

  ul.addEventListener('click', e => {
    const li = e.target.closest('li[role="option"]');
    if (!li) return;
    const genre = li.getAttribute('data-value');
    toggle.querySelector('.selected-value').textContent = li.querySelector('span').textContent;
    dd.classList.remove('open');
    toggle.setAttribute('aria-expanded', false);
    ul.querySelectorAll('li').forEach(node => node.removeAttribute('aria-selected'));
    li.setAttribute('aria-selected', 'true');
    fetchTopMoviesByGenre(genre).then(movies => {
      currentMovies = movies;
      INITIAL_COUNT = getInitialCount();
      INCREMENT = getIncrement();
      if (getDeviceType() === 'desktop') {
        displayedCount = currentMovies.length;
      } else {
        displayedCount = Math.min(INITIAL_COUNT, currentMovies.length);
      }
      renderMovies(currentMovies, displayedCount);
      updateShowMoreButton();

      // --- Ajout UX : scroll automatique en desktop après choix catégorie ---
      if (getDeviceType() === 'desktop' && currentMovies.length > 0) {
        const lastItem = display.querySelector('.movie-item:last-child');
        if (lastItem) {
          lastItem.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }
    });
  });

  ul.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('li[role="option"]')) {
      e.preventDefault();
      e.target.click();
    }
  });

  toggle.addEventListener('click', () => {
    const isOpen = dd.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  document.addEventListener('click', e => {
    if (!dd.contains(e.target)) {
      dd.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
    }
  });

  showMoreBtn.addEventListener('click', () => {
    if (displayedCount >= currentMovies.length) {
      displayedCount = Math.min(INITIAL_COUNT, currentMovies.length);
    } else {
      displayedCount = Math.min(displayedCount + INCREMENT, currentMovies.length);
    }
    renderMovies(currentMovies, displayedCount);
    updateShowMoreButton();
    showMoreBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    showMoreBtn.focus();
  });

  window.addEventListener('resize', () => {
    INITIAL_COUNT = getInitialCount();
    INCREMENT = getIncrement();
    if (currentMovies.length > 0) {
      if (getDeviceType() === 'desktop') {
        displayedCount = currentMovies.length;
      } else {
        displayedCount = Math.min(INITIAL_COUNT, currentMovies.length);
      }
      renderMovies(currentMovies, displayedCount);
      updateShowMoreButton();
    }
  });
}

// -------- Délégation click sur bouton Détails OU sur image du film --------
export function setupMovieDetailButtons() {
  document.body.addEventListener('click', async function (e) {
    const movieItem = e.target.closest('.movie-item');
    if (!movieItem) return;

    // Si clic sur bouton, image, overlay (hors bouton), ou titre (span ou son texte)
    if (
      e.target.matches('.overlay button, .movie-button, .movie-item img') ||
      (e.target.closest('.overlay') && !e.target.matches('button')) ||
      e.target.closest('.overlay span')
    ) {
      const movieId = movieItem.dataset.id;
      if (movieId) {
        try {
          const detail = await fetchMovieDetails(movieId);
          openModal(detail);
        } catch (err) {
          // Optionnel : gestion d’erreur silencieuse
        }
      }
    }
  });
}

// -------- Best Movie  --------
export function renderBestMovieSection(detail) {
  const poster = document.getElementById('best-movie-poster');
  const title = document.getElementById('best-movie-title');
  const description = document.getElementById('best-movie-description');
  const detailsBtn = document.querySelector('.movie-info__btn');
  if (!poster || !title || !description) return;

  title.textContent = detail.title || '';
  poster.src = detail.image_url ? detail.image_url : NO_POSTER;
  poster.alt = detail.title || '';
  poster.onerror = function () {
    this.onerror = null;
    this.src = NO_POSTER;
  };
  description.textContent = detail.description || detail.long_description || '';

  // Délègue ouverture modale sur bouton
  if (detailsBtn) {
    detailsBtn.onclick = function () {
      import('./modal.js').then(({ openModal }) => openModal(detail));
    };
  }
  // Délègue ouverture modale sur image
  poster.style.cursor = 'pointer';
  poster.onclick = function () {
    import('./modal.js').then(({ openModal }) => openModal(detail));
  };
}

// -------- Top Rated  --------
let topRatedShowingAll = false;
let cachedTopRatedMovies = []; // <-- Pour garder les films pour le resize

export function renderTopRatedMoviesSection(movies) {
  const grid = document.querySelector('.top-rated-movie .category-grid');
  const showMoreBtn = document.querySelector('.top-rated-movie .show-more-btn');
  const SHOW_INIT = getInitialCount(); // <--- responsive

  cachedTopRatedMovies = movies; // <-- stock pour resize

  if (!grid) return;

  grid.innerHTML = movies.map((movie, idx) => `
    <div class="movie-item${!topRatedShowingAll && idx >= SHOW_INIT ? ' hidden' : ''}" data-id="${movie.id}">
      ${renderPoster(movie.image_url, `Affiche du film '${movie.title.replace(/'/g, "\\'")}'`)}
      <div class="overlay">
        <span>${movie.title}</span>
        <button class="movie-button"${movie.id ? '' : ' disabled'}>Détails</button>
      </div>
    </div>
  `).join('');

  if (showMoreBtn) {
    showMoreBtn.style.display = movies.length > SHOW_INIT ? "block" : "none";
    showMoreBtn.textContent = topRatedShowingAll ? 'Voir moins' : 'Voir plus';
    if (!showMoreBtn.dataset.init) {
      showMoreBtn.addEventListener('click', function () {
        topRatedShowingAll = !topRatedShowingAll;
        renderTopRatedMoviesSection(movies);
        showMoreBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        showMoreBtn.focus();
      });
      showMoreBtn.dataset.init = "1";
    }
  }
}

export { getInitialCount };
