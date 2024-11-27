import { runInRepo } from '../utils.ts'
import { RunOptions } from '../types.ts'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'vueuse/vueuse',
		branch: 'main',
		build: 'build',
		test: ['typecheck', 'test'],
	})
}
