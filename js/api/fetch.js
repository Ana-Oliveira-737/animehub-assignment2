//import current_season_query from "./queries.js"

/*async function main() {
	//let section = document.querySelector('.dynamic');
	//if (!section) return;

	try {
		let variables = { season: "FALL", seasonYear: 2026 }
		let response = await aniListFetch(current_season_query, variables)
		let json = await response.json()
		console.log(current_season_query)
		let shows = json.data.Page.media

		if (shows) {
			console.log(shows)
			//section.innerHTML = ''

			shows.forEach(anime => {
				
				console.log(anime);
				//let title = document.createElement('div')
				//title.textContent = anime.title.english ? anime.title.english : anime.title.romaji
				//title.className = 'title'

				/*let score = document.createElement('div')
				score.className = 'score'
				score.textContent = anime.score ?? 'N/A'*/

				//let entry = document.createElement('div')
				//entry.appendChild(title)
				//entry.appendChild(score)

				//section.appendChild(entry)
			/*})
		}
	} catch (error) {
		console.error("Erro ao carregar dados da API:", error)
	}
}*/

export async function aniListFetch(query, variables) {
	var url = 'https://graphql.anilist.co',
		options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			body: JSON.stringify({
				query: query,
				variables: variables
			})
		};

	let response = (await fetch(url, options)).json()
	return response
}

//main()