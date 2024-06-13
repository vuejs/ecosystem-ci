import { runInRepo } from '../utils.ts'
import { RunOptions } from '../types.ts'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'jinjiang/vue-simple-compiler',
		branch: 'main',
		test: 'test',
	})
}
