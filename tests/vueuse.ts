import { runInRepo } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'vueuse/vueuse',
		branch: 'main',
		build: 'build',
		test: ['typecheck', 'test:3'],
	})
}
