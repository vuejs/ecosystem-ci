import { runInRepo } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'quasarframework/quasar',
		branch: 'dev',
		build: 'vue-ecosystem-ci:build',
		test: 'vue-ecosystem-ci:test',
	})
}
