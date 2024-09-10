import { runInRepo } from '../utils.ts'
import { RunOptions } from '../types.ts'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'vue-macros/vue-macros',
		branch: 'main',
		build: 'build',
		test: ['test:ecosystem'],
		overrideVueVersion: '@^3',
	})
}
