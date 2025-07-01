document.addEventListener('DOMContentLoaded', () => {
  const dd      = document.getElementById('genre-dropdown');
  const toggle  = dd.querySelector('.dropdown-toggle');
  const items   = dd.querySelectorAll('.dropdown-items li');
  const display = dd.querySelector('#selected-category-container');

  toggle.addEventListener('click', () => {
    const isOpen = dd.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  items.forEach(item => {
    item.addEventListener('click', () => select(item));
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        select(item);
      }
    });
  });

  document.addEventListener('click', e => {
    if (!dd.contains(e.target)) {
      dd.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
    }
  });

  function select(item) {
    items.forEach(i => i.removeAttribute('aria-selected'));
    item.setAttribute('aria-selected', 'true');
  
    const selectedText = item.querySelector('span').textContent;
    toggle.querySelector('.selected-value').textContent = selectedText;
    dd.classList.remove('open');
    toggle.setAttribute('aria-expanded', false);
  
    // Lire l'attribut data-movies en toute sécurité
    const moviesAttr = item.getAttribute('data-movies');
    let movies = [];
  
    try {
      if (moviesAttr) {
        movies = JSON.parse(moviesAttr);
        if (!Array.isArray(movies)) {
          movies = [];
        }
      }
    } catch (e) {
      console.warn('data-movies invalide pour cet élément :', e);
      movies = [];
    }
  
    // Générer le HTML seulement si on a des films
    const movieCards = movies.map(({ title, image }) => `
      <div class="movie-item">
        <img src="${image}" alt="${title}">
        <div class="overlay">
          <span>${title}</span>
          <button class="movie-button">Détails</button>
        </div>
      </div>
    `).join('');
  
    display.innerHTML = movies.length
    ? `<div class="top-rated-grid">${movieCards}</div>`
    : `<p class="no-movie-message">Aucun film disponible pour cette catégorie.</p>`;  
  }  
});
