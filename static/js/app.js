import { openModal, setupModalEvents } from './modal.js';
import { setupShowMoreButtons, setupDropdown, setupMovieDetailButtons, renderTopRatedMoviesSection, renderCategoryMovies } from './ui.js';
import { fetchTopMoviesByGenre, fetchAllGenres, fetchMovieDetails, fetchTopRatedMovies, fetchBestMovie } from './api.js';

export const NO_POSTER = '/static/assets/no_poster.svg'

document.addEventListener('DOMContentLoaded', function () {
  setupShowMoreButtons();
  setupMovieDetailButtons();
  setupModalEvents();

  // Bloc "Meilleur film"
  fetchBestMovie()
    .then(function (bestMovie) {
      if (!bestMovie) return;
      fetchMovieDetails(bestMovie.id).then(function (detail) {
        const poster = document.getElementById('best-movie-poster');
        document.getElementById('best-movie-title').textContent = detail.title || '';
        poster.src = detail.image_url ? detail.image_url : NO_POSTER;
        poster.alt = detail.title || '';
        poster.onerror = function() {
          this.onerror = null;
          this.src = NO_POSTER;
        };
        document.getElementById('best-movie-description').textContent = detail.description || detail.long_description || '';
        const detailsBtn = document.querySelector('.movie-info__btn');
        if (detailsBtn) {
          detailsBtn.onclick = function () {
            openModal(detail);
          };
        }
      });
    })
    .catch(function (err) {
      console.error('Erreur lors de la récupération du meilleur film :', err);
    });

  // Bloc "Films les mieux notés"
  fetchTopRatedMovies()
    .then(function (movies) {
      renderTopRatedMoviesSection(movies);
    })
    .catch(function (err) {
      console.error('Erreur lors de la récupération des films les mieux notés :', err);
    });

  // Bloc catégorie "Action" (Catégorie 1)
  fetchTopMoviesByGenre('Action')
    .then(function (movies) {
      const title = document.querySelector('.category-1__title');
      if (title) title.textContent = 'Action';
      renderCategoryMovies('.category-1 .category-grid', movies);
    })
    .catch(function (err) {
      console.error('Erreur lors de la récupération des films Action :', err);
    });

  // Bloc catégorie "Aventure" (Catégorie 2)
  fetchTopMoviesByGenre('Adventure')
    .then(function (movies) {
      const title = document.querySelector('.category-2__title');
      if (title) title.textContent = 'Aventure';
      renderCategoryMovies('.category-2 .category-grid', movies);
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
        <li role="option" data-value="${genre.name}">
          <span>${genre.name}</span>
          <span class="checkmark">✔</span>
        </li>
      `).join('');
      setupDropdown();
    })
    .catch(function (err) {
      console.error('Erreur lors de la récupération des genres :', err);
    });
});
