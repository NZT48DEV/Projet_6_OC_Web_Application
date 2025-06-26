document.addEventListener('DOMContentLoaded', () => {
    const dd      = document.getElementById('genre-dropdown');
    const toggle  = dd.querySelector('.dropdown-toggle');
    const items   = dd.querySelectorAll('.dropdown-items li');
    const info    = document.getElementById('info-selection');
  
    // Ouvrir / fermer
    toggle.addEventListener('click', () => {
      const isOpen = dd.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });
  
    // Sélection d’un item
    items.forEach(item => {
      item.addEventListener('click', () => select(item));
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          select(item);
        }
      });
    });
  
    // Fermer si clic hors du menu
    document.addEventListener('click', e => {
      if (!dd.contains(e.target)) {
        dd.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
      }
    });
  
    function select(item) {
      items.forEach(i => i.removeAttribute('aria-selected'));
      item.setAttribute('aria-selected', 'true');
      toggle.firstChild.textContent = item.textContent;
      info.innerHTML = `Voir au-dessus (catégorie choisie : 
                        <strong>${item.textContent}</strong>)`;
      dd.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
    }
  });
  