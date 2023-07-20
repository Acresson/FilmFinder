const searchFilms = async () => {
    try {
        const movieTitle = document.getElementById("movieTitle").value.trim();

        const response = await fetch(`http://www.omdbapi.com/?s=${encodeURIComponent(movieTitle)}&type=movie&apikey=f4216ca6`);
        const films = await response.json();
        const infoFilm = films.Search;
        const filmContainer = document.querySelector('.film-container');
        filmContainer.innerHTML = '';

        if (infoFilm) {
            infoFilm.forEach(film => {
                showFilmInformation(filmContainer, film.Title, film.Year, film.Poster, film.imdbID);
            });
        } else {
            filmContainer.innerHTML = "<p>Aucun film trouvé pour cette recherche.</p>";
        }
    } catch (error) {
        console.error('Response error:', error.message);
    }
};

document.getElementById("searchForm").addEventListener("submit", function (event) {
    event.preventDefault();
    searchFilms();
});

const showFilmInformation = (element, title, year, poster, filmId) => {
    element.innerHTML += `
        <div>
            <h2>${title}</h2>
            <p>${year}</p>
            <img src='${poster}'>
            <button class="show-details" data-film-id="${filmId}"> Read More </button>
        </div>
        <br><br><br><br><br><br>
    `;
};

async function afficherPopupPersonnalise(filmId) {
  const modal = document.getElementById("modal");
  const closeButton = document.querySelector(".close");
  const modalContent = document.querySelector(".modal-content");

  try {
    const response = await fetch(`http://www.omdbapi.com/?i=${filmId}&apikey=f4216ca6`);
    const filmDetails = await response.json();

    modalContent.innerHTML = `
      <span class="close">&times;</span>
      <h2>${filmDetails.Title}</h2>
      <p>Année: ${filmDetails.Year}</p>
      <p>Réalisateur: ${filmDetails.Director}</p>
      <p>Genre: ${filmDetails.Genre}</p>
      <p>Acteurs: ${filmDetails.Actors}</p>
      <img src="${filmDetails.Poster}" alt="${filmDetails.Title} Poster">
      <p>Synopsis: ${filmDetails.Plot}</p>
      `;

    modal.style.display = "block";

    closeButton.addEventListener("click", function () {
      modal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });

  } catch (error) {
    console.error('Error fetching film details:', error.message);
    modalContent.innerHTML = "<p>Une erreur s'est produite lors de la récupération des informations du film.</p>";
    modal.style.display = "block";
  }
}

document.querySelector('.film-container').addEventListener('click', function (event) {
  if (event.target.classList.contains('show-details')) {
    const filmId = event.target.dataset.filmId;
    afficherPopupPersonnalise(filmId);
  }
});
