// local-registry related utils

import { fileURLToPath } from 'node:url'
import { runServer, parseConfigFile } from 'verdaccio'

const START_VERDACCIO_TIMEOUT_IN_SECONDS = 60
// use an unconventional port to avoid conflicts with other local registries
const LOCAL_REGISTRY_PORT = 6173

export const REGISTRY_ADDRESS = `http://localhost:${LOCAL_REGISTRY_PORT}/`

export async function startRegistry() {
	// It's not ideal to repeat this config option here,
	// luckily, `self_path` would no longer be required in verdaccio 6
	const cache = fileURLToPath(new URL('./.verdaccio-cache', import.meta.url))
	const config = {
		...parseConfigFile(
			fileURLToPath(new URL('./verdaccio.yaml', import.meta.url)),
		),
		self_path: cache,
	}

	return new Promise((resolve, reject) => {
		// A promise can only be fulfilled/rejected once, so we can use this as a shortcut of `Promise.race`
		setTimeout(() => {
			reject(
				new Error(
					`Verdaccio did not start in ${START_VERDACCIO_TIMEOUT_IN_SECONDS} seconds`,
				),
			)
		}, START_VERDACCIO_TIMEOUT_IN_SECONDS * 1000)

		runServer(config).then((app) => {
			app.listen(LOCAL_REGISTRY_PORT, () => {
				console.log(`Verdaccio started on port ${LOCAL_REGISTRY_PORT}`)
				resolve(app)
			})

			for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
				// Use once() so that receiving double signals exit the app.
				process.once(signal, () => {
					console.log('Received shutdown signal - closing server...')
					app.close(() => {
						console.log('Server closed')
						process.exit(0)
					})
				})
			}
		})
	})
}
