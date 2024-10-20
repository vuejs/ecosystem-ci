import { runInRepo } from '../utils.ts'
import { RunOptions } from '../types.ts'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'xiaoluoboding/vue-sonner',
		branch: 'main',
		build: ['build:lib'],
		beforeTest: [
			'cd test && pnpm i',
			'cd test && pnpm playwright-core install chromium',
		],
		test: ['cd test && pnpm test:e2e'],
	})
}
