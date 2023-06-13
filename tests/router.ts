import { runInRepo } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'vuejs/router',
		branch: 'main',
		test: [
			'pnpm -r test:types',
			'pnpm -r test:unit',
			'pnpm -r build',
			'pnpm -r build:dts',
			'pnpm -r test:dts',
			'pnpm -r test:e2e:ci',
		],
	})
}
