// modal.js — Gestion de la modale
const NO_POSTER = `${window.location.origin}/static/assets/no_poster.svg`;

export function openModal(movie) {
  function na(value) {
    if (!value || (Array.isArray(value) && value.length === 0)) return 'N/A';
    return value;
  }
  function joinArray(arr) {
    if (!arr || arr.length === 0) return 'N/A';
    return arr.join(', ');
  }

  const modalOverlay = document.getElementById('modal-overlay');
  if (!modalOverlay) return; // sécurité : ne va pas plus loin si la modale n’existe pas

  // Gestion image desktop et mobile (double affichage)
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

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  setText('modal-title', na(movie.title));
  setText('modal-year', na(movie.year));
  setText('modal-genres', joinArray(movie.genres));
  setText('modal-classification', na(movie.rated));
  setText('modal-duration', movie.duration ? `${movie.duration} min` : 'N/A');
  setText('modal-countries', movie.countries ? `(${joinArray(movie.countries)})` : '(N/A)');
  setText('modal-imdb-score', movie.imdb_score ? `${movie.imdb_score}/10` : 'N/A');
  setText('modal-revenue', movie.worldwide_gross_income ? `${movie.worldwide_gross_income.toLocaleString()} $` : 'N/A');
  setText('modal-directors', joinArray(movie.directors));
  setText('modal-description', na(movie.long_description || movie.description));
  setText('modal-actors', joinArray(movie.actors));

  modalOverlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

export function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}

// Initialisation listeners modale
export function setupModalEvents() {
  const closeBtn = document.querySelector('.modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Fermeture bouton desktop
  const desktopCloseBtn = document.querySelector('.modal .btn');
  if (desktopCloseBtn) {
    desktopCloseBtn.addEventListener('click', closeModal);
  }

  // Clic sur overlay
  const overlay = document.getElementById('modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === this) closeModal();
    });
  }

  // Touche Esc
  window.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
  });
}
