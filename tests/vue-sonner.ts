import { runInRepo } from '../utils.ts'
import { RunOptions } from '../types.ts'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'xiaoluoboding/vue-sonner',
		branch: 'main',
		build: ['build:lib'],
		beforeTest: ['pnpm playwright-core install chromium', 'cd test && pnpm i'],
		test: ['test:e2e'],
	})
}
