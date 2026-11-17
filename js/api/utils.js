import { aniListFetch } from "./fetch.js"

const FAVORITES_STORAGE_KEY = "animehub-favorites"

export const titleOf = (anime) => anime.title.english ?? anime.title.romaji
export const posterOf = (anime) => anime.coverImage?.large ?? anime.coverImage?.medium ?? ""
export const pageOf = (anime) => `https://anilist.co/anime/${anime.id}`


export async function loadMedia(query, variables = {}) {
    const result = await aniListFetch(query, variables)
    if (result.errors) throw new Error(result.errors[0].message)
    return result.data.Page.media
}

function capitalise(text) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

function formatLabel(format) {
    return format.length <= 3 ? format : capitalise(format.replace("_", " "))
}

export function describe(anime) {
    return [
        anime.season && capitalise(anime.season),
        anime.format && formatLabel(anime.format),
        anime.seasonYear,
    ]
        .filter(Boolean)
        .join(" • ")
}

export function cleanSynopsis(text, maxLength = 220) {
    const plainText = (text ?? "No synopsis available.")
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    return plainText.length > maxLength
        ? plainText.slice(0, maxLength).trimEnd() + "…"
        : plainText
}

function readFavorites() {
    try {
        return JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY)) ?? []
    } catch {
        return []
    }
}

export const isFavorite = (anime) => readFavorites().some((favorite) => favorite.id === anime.id)

export function toggleFavorite(anime) {
    const favorites = readFavorites()
    const updatedFavorites = isFavorite(anime)
        ? favorites.filter((favorite) => favorite.id !== anime.id)
        : [...favorites, { id: anime.id, title: titleOf(anime), poster: posterOf(anime) }]
    try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updatedFavorites))
    } catch {
    }
}