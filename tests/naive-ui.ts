import { runInRepo } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'tusen-ai/naive-ui',
		branch: 'main',
		build: 'build:package',
		test: 'test:cov',
	})
}
