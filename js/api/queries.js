export const current_season_query = `
query ($season: MediaSeason, $seasonYear: Int) {
Page (page: 1, perPage: 5) {
    media (season: $season, seasonYear: $seasonYear, type: ANIME) {
    id
    coverImage {
    color
    medium
    }
    title {
    romaji
    english
    }
	description
    season
    seasonYear
    format
    episodes
    }
}
}`

export const hero_query = `
query ($averageScoreGreater: Int, $startDateGreater: FuzzyDateInt) {
Page (page: 1, perPage: 5) {
  Media(type: ANIME, averageScore_greater: $averageScoreGreater, startDate_greater: $startDateGreater) {
    id
    coverImage {
    color
    medium
    }
    title {
    romaji
    english
    }
	description
    season
    seasonYear
    format
    episodes
    }
  }
}
`

export const popular_query = `
query {
Page (page: 1, perPage: 20) {
  media (type: ANIME, sort: POPULARITY_DESC){
  id
  popularity
    title {
    romaji
    english
    }
    season
    seasonYear
    format
    episodes
    }
}
}
`