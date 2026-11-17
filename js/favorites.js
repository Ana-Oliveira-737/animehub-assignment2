import { createCard, isFavorite, readFavorites, toggleFavorite } from "./main.js"

function loadFavorites(gridId) {
    const grid = document.querySelector(`#${gridId}`)
    const favorites = readFavorites()

    if (favorites.length == 0) {
        grid.innerHTML = "<div>No favorites added... yet!</div>"
    }

    else favorites.forEach(anime => {
        let element = createCard(anime)
        grid.appendChild(element)
    })
}

loadFavorites("favorite-anime")