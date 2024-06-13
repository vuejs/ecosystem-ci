import { runInRepo } from '../utils.ts'
import { RunOptions } from '../types.ts'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'quasarframework/quasar',
		branch: 'dev',
		build: 'vue-ecosystem-ci:build',
		test: 'vue-ecosystem-ci:test',
	})
}
