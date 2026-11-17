import { aniListFetch } from "./fetch.js"

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
        anime.episodes && `${anime.episodes} episodes`
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