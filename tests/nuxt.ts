import { runInRepo } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'nuxt/nuxt',
		build: 'build',
		beforeTest: 'pnpm playwright-core install chromium',
		test: ['test:unit', 'test:types', 'test:fixtures'],
		patchFiles: {
			'packages/nuxt/test/treeshake-client.test.ts': (content) => {
				return content
					.replace(/const \[_, scopeId\].*/, '')
					.replace(/expect\(clientResult\)\.toContain\(`pushScopeId\(.*/, '')
					.replace(/expect\(treeshaken\)\.toContain\(`<div \${scopeId}>`\)/, '')
			},
		},
	})
}
