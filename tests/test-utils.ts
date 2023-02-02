import { runInRepo } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'vuejs/test-utils',
		branch: 'main',
		test: ['test:coverage', 'test:build', 'tsd', 'vue-tsc'],
	})
}
