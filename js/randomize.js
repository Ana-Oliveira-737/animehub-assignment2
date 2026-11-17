import { random_anime_query } from "./api/queries.js"
import { aniListFetch } from "./api/fetch.js"
import { titleOf, posterOf, cleanSynopsis, toggleFavorite, isFavorite } from "./api/utils.js"

const randomButton = document.querySelector(".random-button")
const modal = document.querySelector("dialog")

if (randomButton && modal) {
    randomButton.addEventListener("click", async () => {
        randomButton.disabled = true
        try {
            const randomPage = Math.floor(Math.random() * 20) + 1
            const data = await aniListFetch(random_anime_query, { page: randomPage })
            
            const animes = data.data.Page.media
            const randomAnime = animes[Math.floor(Math.random() * animes.length)]
            
            openModal(randomAnime)
        } catch (error) {
            console.error("Error loading random anime:", error)
            alert("Could not get an anime. Please try again.")
        } finally {
            randomButton.disabled = false
        }
    })

    modal.addEventListener("click", event => {
        if (event.target === modal) modal.close()
    })
}

function openModal(anime) {
    const img = document.querySelector("#dialog-image") || modal.querySelector("img")
    const title = document.querySelector("#dialog-title") || modal.querySelector("h2")
    const chips = document.querySelector("#dialog-chips") || modal.querySelector(".chips")
    const synopsis = document.querySelector("#dialog-synopsis") || modal.querySelector(".dialog-synopsis")
    const closeBtn = modal.querySelector(".close")

    if (img) {
        img.src = posterOf(anime)
        img.alt = titleOf(anime)
    }
    if (title) title.textContent = titleOf(anime)
    
    if (chips) {
        chips.innerHTML = [
            anime.averageScore ? `★ ${anime.averageScore}%` : null,
            anime.format ? anime.format.replace("_", " ") : "Anime",
            anime.episodes ? `${anime.episodes} episodes` : null,
            anime.seasonYear,
            ...(anime.genres ? anime.genres.slice(0, 4) : [])
        ]
        .filter(Boolean)
        .map(text => `<span>${text}</span>`)
        .join("")
    }

    if (synopsis) {
        synopsis.textContent = cleanSynopsis(anime.description, 300)
    }

    if (closeBtn && !closeBtn.onclick) {
        closeBtn.onclick = () => modal.close()
    }

    modal.showModal()
}