// modal.js — Gestion de la modale

export function openModal({ title, image, description }) {
    const modalOverlay = document.getElementById('modal-overlay');
    document.getElementById('modal-title').textContent = title || '';
    const posterEl = document.getElementById('modal-poster');
    if (posterEl) {
      posterEl.src = image || '';
      posterEl.alt = title || '';
    }
    document.getElementById('modal-description').textContent = description || 'Description non disponible.';
    modalOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
  
  export function closeModal() {
    document.getElementById('modal-overlay').style.display = 'none';
    document.body.style.overflow = '';
  }
  
  // Initialisation listeners modale
  export function setupModalEvents() {
    // Fermeture par la croix
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
  