import { runInRepo } from '../utils.ts'
import { RunOptions } from '../types.ts'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'primefaces/primevue',
		branch: 'master',
		// 4.3.1 but not tagged on GitHub. It's the latest commit that with passing tests.
		commit: 'e53d48ed62dc845d8f8ca3c7ccd00941229b98f9',
		build: ['format', 'build'],
		test: 'test:unit',
	})
}
