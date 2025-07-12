// Point d’entrée de l’application front-end.

import { openModal, setupModalEvents } from './modal.js';
import {
  renderBestMovieSection,
  setupShowMoreButtons,
  setupDropdown,
  setupMovieDetailButtons,
  renderTopRatedMoviesSection,
  renderCategoryMovies,
  getInitialCount,
} from './ui.js';
import {
  fetchTopMoviesByGenre,
  fetchAllGenres,
  fetchMovieDetails,
  fetchTopRatedMovies,
  fetchBestMovie
} from './api.js';

export const NO_POSTER = '/static/assets/no_poster.svg';

let actionMovies = [];
let adventureMovies = [];
let cachedTopRatedMovies = [];

// Fonction pour re-render selon device lors du resize
function renderCategoryGridsResponsive() {
  renderCategoryMovies('.category-1 .category-grid', actionMovies, getInitialCount());
  renderCategoryMovies('.category-2 .category-grid', adventureMovies, getInitialCount());
  if (cachedTopRatedMovies.length > 0) {
    renderTopRatedMoviesSection(cachedTopRatedMovies);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  setupShowMoreButtons();
  setupMovieDetailButtons();
  setupModalEvents();

  // Bloc "Meilleur film"
  fetchBestMovie()
  .then(function (bestMovie) {
    if (!bestMovie) return;
    fetchMovieDetails(bestMovie.id).then(function (detail) {
      renderBestMovieSection(detail);
    });
  })
  .catch(function (err) {
    console.error('Erreur lors de la récupération du meilleur film :', err);
  });

  // Bloc "Films les mieux notés"
  fetchTopRatedMovies()
    .then(function (movies) {
      cachedTopRatedMovies = movies;
      renderTopRatedMoviesSection(movies);
    })
    .catch(function (err) {
      console.error('Erreur lors de la récupération des films les mieux notés :', err);
    });

  // Bloc catégorie "Action" (Catégorie 1)
  fetchTopMoviesByGenre('Action')
    .then(function (movies) {
      actionMovies = movies; // Garde pour resize
      const title = document.querySelector('.category-1__title');
      if (title) title.textContent = 'Action';
      renderCategoryMovies('.category-1 .category-grid', movies, getInitialCount());
    })
    .catch(function (err) {
      console.error('Erreur lors de la récupération des films Action :', err);
    });

  // Bloc catégorie "Aventure" (Catégorie 2)
  fetchTopMoviesByGenre('Adventure')
    .then(function (movies) {
      adventureMovies = movies; // Garde pour resize
      const title = document.querySelector('.category-2__title');
      if (title) title.textContent = 'Aventure';
      renderCategoryMovies('.category-2 .category-grid', movies, getInitialCount());
    })
    .catch(function (err) {
      console.error('Erreur lors de la récupération des films Aventure :', err);
    });

  // --------- Dropdown dynamique des genres "Autres" ----------
  fetchAllGenres()
    .then(function (genres) {
      const ul = document.querySelector('.dropdown-items');
      if (!ul) return;
      ul.innerHTML = genres.map(genre => `
      <li role="option" data-value="${genre.name}" tabindex="0">
        <span>${genre.name}</span>
        <span class="checkmark">✔</span>
      </li>
    `).join('');
    
      setupDropdown();
    })
    .catch(function (err) {
      console.error('Erreur lors de la récupération des genres :', err);
    });

  // Re-render responsive sur resize (toutes grilles)
  window.addEventListener('resize', renderCategoryGridsResponsive);
});
