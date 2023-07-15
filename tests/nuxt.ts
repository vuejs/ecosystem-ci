import { runInRepo } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'nuxt/nuxt',
		build: 'build',
		beforeTest: 'pnpm playwright-core install chromium',
		test: ['test:fixtures', 'test:types', 'test:unit'],
	})
}
