import { runInRepo } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'radix-vue/radix-vue',
		branch: 'main',
		test: 'test',
	})
}
