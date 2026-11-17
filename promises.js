async function syncronous() {
	console.log('started...')
	console.log(fakeFetch('www.google.com'))
	console.log('result was not ready')
}

async function asyncronous() {
	console.log('started...')
	console.log(await fakeFetch('www.google.com'))
	console.log('result received')
}

async function parallel() {
	console.log('started...')

	const [googleResults, bingResults] = await Promise.all([
		fakeFetch('www.google.com'),
		fakeFetch('www.bing.com'),
	])

	console.log('results ready:', googleResults, bingResults)
}

function fakeFetch(url) {
	return new Promise(resolve => setTimeout(() => resolve({ url, data: 5 }), 3000))
}

syncronous()
asyncronous()
parallel()