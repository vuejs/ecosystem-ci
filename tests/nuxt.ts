import { runInRepo } from '../utils.ts'
import { RunOptions } from '../types.ts'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'nuxt/nuxt',
		branch: 'main',
		build: ['dev:prepare', 'typecheck', 'build'],
		beforeTest: ['pnpm playwright-core install chromium'],
		test: ['test:unit', 'test:types', 'test:fixtures'],
	})
}
