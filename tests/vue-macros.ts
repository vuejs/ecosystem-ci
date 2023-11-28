import { runInRepo } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'vue-macros/vue-macros',
		branch: 'vue-ecosystem-ci',
		build: 'build',
		test: ['test:ecosystem'],
	})
}
