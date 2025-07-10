// modal.js — Gestion de la modale
const NO_POSTER = '/static/assets/no_poster.svg';

export function openModal(movie) {
  // Fallback N/A
  function na(value) {
    if (!value || (Array.isArray(value) && value.length === 0)) return 'N/A';
    return value;
  }

  // Pour joindre les tableaux avec virgule
  function joinArray(arr) {
    if (!arr || arr.length === 0) return 'N/A';
    return arr.join(', ');
  }

  const modalOverlay = document.getElementById('modal-overlay');

  // Image desktop et mobile (double affichage)
  const posterEl = document.getElementById('modal-poster');
  const posterMobileEl = document.getElementById('modal-poster-mobile');
  const posterSrc = movie.image_url ? movie.image_url : NO_POSTER;
  [posterEl, posterMobileEl].forEach(imgEl => {
    if (imgEl) {
      imgEl.src = posterSrc;
      imgEl.alt = movie.title || 'Poster du film';
      imgEl.onerror = function() {
        this.onerror = null;
        this.src = NO_POSTER;
      };
    }
  });

  document.getElementById('modal-title').textContent = na(movie.title);
  document.getElementById('modal-year').textContent = na(movie.year);
  document.getElementById('modal-genres').textContent = joinArray(movie.genres);
  document.getElementById('modal-classification').textContent = na(movie.rated);
  document.getElementById('modal-duration').textContent = movie.duration ? `${movie.duration} min` : 'N/A';
  document.getElementById('modal-countries').textContent = movie.countries ? `(${joinArray(movie.countries)})` : '(N/A)';
  document.getElementById('modal-imdb-score').textContent = movie.imdb_score ? `${movie.imdb_score}/10` : 'N/A';
  document.getElementById('modal-revenue').textContent = movie.worldwide_gross_income ? `${movie.worldwide_gross_income.toLocaleString()} $` : 'N/A';
  document.getElementById('modal-directors').textContent = joinArray(movie.directors);
  document.getElementById('modal-description').textContent = na(movie.long_description || movie.description);
  document.getElementById('modal-actors').textContent = joinArray(movie.actors);

  modalOverlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

export function closeModal() {
  document.getElementById('modal-overlay').style.display = 'none';
  document.body.style.overflow = '';
}

// Initialisation listeners modale
export function setupModalEvents() {
  document.querySelector('.modal-close').addEventListener('click', closeModal);

  // Fermeture bouton desktop
  const desktopCloseBtn = document.querySelector('.modal .btn');
  if (desktopCloseBtn) {
    desktopCloseBtn.addEventListener('click', closeModal);
  }

  // Clic sur overlay
  document.getElementById('modal-overlay').addEventListener('click', function (e) {
    if (e.target === this) closeModal();
  });

  // Touche Esc
  window.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
  });
}
