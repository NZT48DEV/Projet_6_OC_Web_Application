// Requêtes API avec Promises

// Récupérer le meilleur film
export function fetchBestMovie() {
    return fetch("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=1")
      .then(response => response.json())
      .then(data => (data && data.results && data.results.length > 0) ? data.results[0] : null);
}
  
// Récupère tous les genres (même sur plusieurs pages)
export function fetchAllGenres() {
    const url = "http://localhost:8000/api/v1/genres/";
    let genres = [];
    
    function fetchPage(url) {
      return fetch(url)
        .then(res => res.json())
        .then(data => {
          genres = genres.concat(data.results);
          if (data.next) {
            // Appel récursif pour la page suivante
            return fetchPage(data.next);
          } else {
            return genres;
          }
        });
    }
  
    return fetchPage(url);
}

// Récupérer tous les films d'un genre donné (utilisé pour "Autres")
export function fetchMoviesByGenre(genre) {
    return fetch(`http://localhost:8000/api/v1/titles/?genre=${encodeURIComponent(genre)}`)
        .then(response => response.json())
        .then(data => data.results || []);
}
  
// Récupère les 6 films les mieux notés (toutes catégories)
export function fetchTopRatedMovies() {
    return fetch('http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=6')
      .then(res => res.json())
      .then(data => data.results || []);
}

// Récupérer les 6 premiers films d’un genre donné (pour Action/Aventure/etc)
export function fetchTopMoviesByGenre(genre) {
    return fetch(`http://localhost:8000/api/v1/titles/?genre=${encodeURIComponent(genre)}&sort_by=-imdb_score&page_size=6`)
        .then(res => res.json())
        .then(data => data.results || []);
}

// Détail d’un film par son ID (pour la modale)
export function fetchMovieDetails(id) {
    return fetch(`http://localhost:8000/api/v1/titles/${id}`)
        .then(res => res.json());
}
