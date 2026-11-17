import { current_season_query, hero_query } from "./api/queries.js"
import { loadMedia, titleOf, posterOf, pageOf, describe, cleanSynopsis, isFavorite, toggleFavorite,
} from "./api/utils.js"

const HERO_SLIDE_DURATION = 3000
const MAX_SLIDES = 5
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

const heroSection = document.querySelector(".hero")
let heroSlides = []
let currentHeroIndex = 0
let heroTimer

heroSection.addEventListener("mouseenter", stopHeroAutoplay)
heroSection.addEventListener("mouseleave", startHeroAutoplay)
heroSection.addEventListener("focusin", stopHeroAutoplay)
heroSection.addEventListener("focusout", startHeroAutoplay)
heroSection.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") showHeroSlide(currentHeroIndex + 1)
    if (event.key === "ArrowLeft") showHeroSlide(currentHeroIndex - 1)
})

async function loadSlides() {
    try {
        const heroes = await loadMedia(hero_query, {
            averageScoreGreater: 80,
            startDateGreater: 20240101,
        })
        if (heroes.length) return heroes.slice(0, MAX_SLIDES)
    } catch {
    }
    try {
        const animes = await loadMedia(current_season_query, { season: "FALL", seasonYear: 2026 })
        return animes.slice(0, MAX_SLIDES)
    } catch {
        return []
    }
}

async function loadHero() {
    heroSlides = await loadSlides()
    if (!heroSlides.length) return

    createHeroDots()
    showHeroSlide(0)
    startHeroAutoplay()
}

function showHero(anime) {
    document.querySelector("#hero-title").textContent = titleOf(anime)
    document.querySelector(".hero-data").textContent = describe(anime)
    document.querySelector(".hero-synopsis").textContent = cleanSynopsis(anime.description)

    const detailsLink = document.querySelector(".hero-actions .button")
    detailsLink.href = pageOf(anime)
    detailsLink.target = "_blank"
    detailsLink.rel = "noopener"

    const poster = document.createElement("img")
    poster.src = posterOf(anime)
    poster.alt = ""
    document.querySelector(".hero-card .card:last-child").replaceChildren(poster)

    const favoriteButton = document.querySelector(".hero-actions .button-icon")
    const favoriteIcon = favoriteButton.querySelector("img")
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
    updateFavoriteButton()
}

function updateHeroDots() {
    heroSection.querySelectorAll(".hero-dots button").forEach((dot, index) => {
        dot.setAttribute("aria-current", index === currentHeroIndex)
    })
}

function showHeroSlide(index) {
    currentHeroIndex = (index + heroSlides.length) % heroSlides.length
    showHero(heroSlides[currentHeroIndex])
    updateHeroDots()

    if (!prefersReducedMotion) {
        heroSection.querySelectorAll(".hero > div:not(.hero-dots)").forEach((block) => {
            block.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400 })
        })
    }
}

function stopHeroAutoplay() {
    clearInterval(heroTimer)
}

function startHeroAutoplay() {
    stopHeroAutoplay()
    if (prefersReducedMotion || heroSlides.length < 2) return
    heroTimer = setInterval(() => showHeroSlide(currentHeroIndex + 1), HERO_SLIDE_DURATION)
}

function createHeroDots() {
    const dots = document.createElement("div")
    dots.className = "hero-dots"

    heroSlides.forEach((anime, index) => {
        const dot = document.createElement("button")
        dot.type = "button"
        dot.setAttribute("aria-label", `Show ${titleOf(anime)}`)
        dot.addEventListener("click", () => {
            showHeroSlide(index)
            startHeroAutoplay()
        })
        dots.append(dot)
    })
    heroSection.append(dots)
}

loadHero()