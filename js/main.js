import { current_season_query, movies_query, popular_query } from "./api/queries.js"
import { loadMedia, titleOf, posterOf, describe, cleanSynopsis } from "./api/utils.js"

const SEASON = "FALL"
const SEASON_YEAR = 2026
const CARDS_PER_SECTION = 5
const FAVORITES_STORAGE_KEY = "animehub-favorites"

const menuButton = document.querySelector(".menu-button")
const navigation = document.querySelector("#nav")

export const isFavorite = (anime) => readFavorites().some((favorite) => favorite.id === anime.id)

async function loadSection(gridId, query, variables) {
    const grid = document.querySelector(`#${gridId}`)
    try {
        if (!query) throw new Error("Query not defined yet.")
        const animes = await loadMedia(query, variables)
        grid.replaceChildren(...animes.slice(0, CARDS_PER_SECTION).map(createCard))
    } catch (error) {
        showError(grid, error)
    }
}

export function createCard(anime) {
    const card = document.createElement("li")
    card.className = "card"
    card.tabIndex = 0 

    if (posterOf(anime)) {
        const image = document.createElement("img")
        image.src = posterOf(anime)
        image.alt = titleOf(anime)
        image.loading = "lazy"
        card.append(image)
    } else {
        const fallbackTitle = document.createElement("p")
        fallbackTitle.textContent = titleOf(anime)
       
       
        card.append(fallbackTitle)
    }

    card.append(createTooltip(anime))
    return card
}

function showError(grid, error) {
    const message = document.createElement("li")
    message.className = "message"
    message.textContent = `Could not load the data. ${error.message}`
    grid.replaceChildren(message)
}

function createTooltip(anime) {
    const tooltip = document.createElement("div")
    tooltip.className = "card-tooltip"

    const title = document.createElement("h3")
    title.textContent = titleOf(anime)

    const details = document.createElement("p")
    details.textContent = [describe(anime)]
        .filter(Boolean)
        .join(" • ")

    tooltip.append(title, details)

    if (anime.description) {
        const synopsis = document.createElement("p")
        synopsis.textContent = cleanSynopsis(anime.description, 110)
        tooltip.append(synopsis)
    }

    const favoriteButton = document.createElement("button")
    favoriteButton.className = "button-icon"
    const favoriteIcon = document.createElement("img")

    const updateFavoriteButton = () => {
        const favorite = isFavorite(anime)
        favoriteIcon.src = favorite ? "image/favorites-filled.svg" : "image/favorites-empty.svg"
        favoriteIcon.alt = favorite ? "Remove from favorites" : "Add to favorites"
        favoriteButton.setAttribute("aria-pressed", favorite)
    }
    favoriteButton.onclick = () => {
        toggleFavorite(anime)
        updateFavoriteButton()
    }

    favoriteButton.appendChild(favoriteIcon)
    updateFavoriteButton()
    tooltip.append(favoriteButton)
    return tooltip
}


export function readFavorites() {
    try {
        return JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY)) ?? []
    } catch {
        return []
    }
}

export function toggleFavorite(anime) {
    const favorites = readFavorites()
    const updatedFavorites = isFavorite(anime)
        ? favorites.filter((favorite) => favorite.id !== anime.id)
        : [...favorites, anime]
    try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updatedFavorites))
    } catch {
    }
}

menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open")
    menuButton.setAttribute("aria-expanded", isOpen)
})

loadSection("fall-2026-anime", current_season_query, { season: SEASON, seasonYear: SEASON_YEAR })
loadSection("top-anime", popular_query)
loadSection("movies-anime", movies_query) 