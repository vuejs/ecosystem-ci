import { runInRepo } from '../utils.ts'
import { RunOptions } from '../types.ts'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'radix-vue/radix-vue',
		branch: 'main',
		test: 'test',
	})
}
