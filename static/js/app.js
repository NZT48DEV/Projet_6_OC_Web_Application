import { openModal, setupModalEvents } from './modal.js';
import { setupShowMoreButtons, setupDropdown, setupMovieDetailButtons, renderTopRatedMoviesSection, renderCategoryMovies } from './ui.js';
import { fetchTopMoviesByGenre, fetchAllGenres } from './api.js';

// Récupère le meilleur film
function fetchBestMovie() {
  return fetch("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=1")
    .then(res => res.json())
    .then(data => data.results && data.results[0] ? data.results[0] : null);
}

// Récupère les 6 meilleurs films toutes catégories
function fetchTopRatedMovies() {
  return fetch("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=6")
    .then(res => res.json())
    .then(data => data.results || []);
}

// Récupère les détails d’un film par ID
function fetchMovieDetails(id) {
  return fetch(`http://localhost:8000/api/v1/titles/${id}`)
    .then(res => res.json());
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
        const poster = document.getElementById('best-movie-poster');
        document.getElementById('best-movie-title').textContent = detail.title || '';
        poster.src = detail.image_url ? detail.image_url : '/static/assets/no_poster.svg';
        poster.alt = detail.title || '';
        poster.onerror = function() {
          this.onerror = null;
          this.src = '/static/assets/no_poster.svg';
        };
        document.getElementById('best-movie-description').textContent = detail.description || detail.long_description || '';
        const detailsBtn = document.querySelector('.movie-info__btn');
        if (detailsBtn) {
          detailsBtn.onclick = function () {
            openModal({
              title: detail.title,
              image: detail.image_url ? detail.image_url : '/static/assets/no_poster.svg',
              description: detail.long_description || detail.description || ''
            });
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
