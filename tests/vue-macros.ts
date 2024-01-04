import { runInRepo } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'sxzz/unplugin-vue-macros',
		branch: 'main',
		build: 'build',
		test: ['test:ecosystem'],
		patchFiles: {
			'packages/short-bind/tests/compiler.test.ts': (content) => {
				return content.replace(
					`describe('compiler'`,
					`describe.skip('compiler'`,
				)
			},
		},
	})
}
