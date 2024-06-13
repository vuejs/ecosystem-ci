import { runInRepo } from '../utils.ts'
import { RunOptions } from '../types.ts'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'tusen-ai/naive-ui',
		branch: 'main',
		build: 'build:package',
		test: 'test:cov',
	})
}
