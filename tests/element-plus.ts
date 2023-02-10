import { runInRepo } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'element-plus/element-plus',
		branch: 'master',
		test: ['test', 'typecheck'],
	})
}
