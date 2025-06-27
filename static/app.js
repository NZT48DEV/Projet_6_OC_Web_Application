document.addEventListener('DOMContentLoaded', () => {
  const dd      = document.getElementById('genre-dropdown');
  const toggle  = dd.querySelector('.dropdown-toggle');
  const items   = dd.querySelectorAll('.dropdown-items li');
  const display = document.getElementById('selected-category-container');

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
  
    const selectedText = item.querySelector('span').textContent;       // Pour l'affichage du menu
    const movieTitle = item.getAttribute('data-title');              // Pour le nom affiché sur l'overlay
    const imagePath = item.getAttribute('data-image');

    toggle.querySelector('.selected-value').textContent = selectedText;
    dd.classList.remove('open');
    toggle.setAttribute('aria-expanded', false);

    display.innerHTML = `
    <div class="movie-item">
      <div class="uniform-card">
        <img src="${imagePath}" alt="${selectedText}" class="movie-poster" />
        <div class="overlay">
          <span>${selectedText}</span>
          <button>Détails</button>
        </div>
      </div>
    </div>
  `;
  
  }  
});
