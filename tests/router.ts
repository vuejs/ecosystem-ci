import { runInRepo } from '../utils.ts'
import { RunOptions } from '../types.ts'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'vuejs/router',
		branch: 'main',
		test: [
			'pnpm -r build',
			'pnpm -r build:dts',
			'pnpm -r test:types',
			'pnpm -r test:unit',
			'pnpm -r test:e2e:ci',
		],
	})
}
