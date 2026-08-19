import { runInRepo } from '../utils.ts'
import { RunOptions } from '../types.ts'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'radix-vue/radix-vue',
		branch: 'v2',
		// Keep Vitest's peer context aligned with packages/core so pnpm doesn't
		// link the tests against a second Vitest instance from the workspace root.
		patchFiles: {
			'package.json': (content) => {
				const pkg = JSON.parse(content)
				pkg.devDependencies ||= {}
				pkg.devDependencies['@vitest/coverage-istanbul'] = '3.2.7'
				pkg.devDependencies.vite = '8.2.1'
				pkg.devDependencies.vitest = '4.1.10'
				return `${JSON.stringify(pkg, null, 2)}\n`
			},
		},
		test: 'test',
	})
}
