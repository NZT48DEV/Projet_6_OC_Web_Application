// ui.js — Gestion des boutons, dropdowns, rendering liste films
import { openModal } from './modal.js';
import { fetchTopMoviesByGenre, fetchMovieDetails } from './api.js';

const NO_POSTER = `${window.location.origin}/static/assets/no_poster.svg`;

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

// --------- Rendu catégorie générique (Action, Aventure, ...) ---------
export function renderCategoryMovies(gridSelector, movies, showInit = 2) {
  const grid = document.querySelector(gridSelector);
  if (!grid) return;
  grid.innerHTML = movies.map((movie, idx) => `
    <div class="movie-item${idx >= showInit ? ' hidden' : ''}" data-id="${movie.id}">
      <img 
        src="${movie.image_url ? movie.image_url : NO_POSTER}"
        alt="Affiche du film '${movie.title.replace(/'/g, "\\'")}'"
        onerror="this.onerror=null;this.src='${NO_POSTER}';"
      >
      <div class="overlay">
        <span>${movie.title}</span>
        <button class="movie-button">Détails</button>
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
  const INITIAL_COUNT = 2;
  const INCREMENT = 4;

  function isDesktop() {
    return window.innerWidth >= 1024;
  }

  function renderMovies(movies, count) {
    const moviesToShow = movies.slice(0, count);
    if (moviesToShow.length > 0) {
      display.innerHTML = moviesToShow.map(({ title, image_url, id }) => `
        <div class="movie-item" data-id="${id}">
          <img 
            src="${image_url ? image_url : NO_POSTER}"
            alt="${title}"
            onerror="this.onerror=null;this.src='${NO_POSTER}';"
          >
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

  function updateShowMoreButton() {
    if (isDesktop()) {
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
      if (isDesktop()) {
        displayedCount = currentMovies.length;
      } else {
        displayedCount = Math.min(INITIAL_COUNT, currentMovies.length);
      }
      renderMovies(currentMovies, displayedCount);
      updateShowMoreButton();

      // --- Ajout UX : scroll automatique en desktop après choix catégorie ---
      if (isDesktop() && currentMovies.length > 0) {
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
}

// --------- Délégation click sur .movie-button pour ouvrir la modale ---------
export function setupMovieDetailButtons() {
  document.body.addEventListener('click', async function (e) {
    if (e.target.matches('.overlay button, .movie-button')) {
      const movieItem = e.target.closest('.movie-item');
      if (movieItem) {
        const movieId = movieItem.dataset.id;
        if (movieId) {
          // On va chercher le détail du film avant d'ouvrir la modale
          const detail = await fetchMovieDetails(movieId);
          openModal(detail);
        }
      }
    }
  });
}

// -------- Correction Top Rated (voir plus/moins fonctionne partout) --------
let topRatedShowingAll = false;

export function renderTopRatedMoviesSection(movies) {
  const grid = document.querySelector('.top-rated-movie .category-grid');
  const showMoreBtn = document.querySelector('.top-rated-movie .show-more-btn');
  const SHOW_INIT = 2;

  if (!grid) return;

  grid.innerHTML = movies.map((movie, idx) => `
    <div class="movie-item${!topRatedShowingAll && idx >= SHOW_INIT ? ' hidden' : ''}" data-id="${movie.id}">
      <img 
        src="${movie.image_url ? movie.image_url : NO_POSTER}"
        alt="Affiche du film '${movie.title.replace(/'/g, "\\'")}'"
        onerror="this.onerror=null;this.src='${NO_POSTER}';"
      >
      <div class="overlay">
        <span>${movie.title}</span>
        <button>Détails</button>
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
