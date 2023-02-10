import { runInRepo } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'sxzz/unplugin-vue-macros',
		branch: 'main',
		test: ['test', 'typecheck'],
	})
}
