import { runInRepo } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'nuxt/framework',
		// https://github.com/vitejs/vite-ecosystem-ci/pull/158#discussion_r1038778127
		// For monorepos, overrides need to be manually specified.
		overrides: {
			'@vue/reactivity': true,
			'@vue/shared': true,
			vue: true,
		},
		build: 'build',
		test: ['test:fixtures', 'test:types', 'test:unit'],
	})
}
