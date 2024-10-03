import { runInRepo } from '../utils.ts'
import { RunOptions } from '../types.ts'
import { REGISTRY_ADDRESS } from '../registry.ts'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'vuejs/language-tools',
		branch: 'master',
		beforeBuild: `pnpm dedupe --registry=${REGISTRY_ADDRESS}`,
		build: 'build',
		test: 'test',
		overrideVueVersion: '@^3.5.2',
		// As of Oct 3 2024, the language-tools repo is using TypeScript 5.5.4 & 5.7.0-dev.20240904,
		// while referring to them as `@latest` and `@next` respectively.
		// TODO: infer the TypeScript versions from the cloned lockfile.
		patchFiles: {
			'package.json': (content) => {
				const pkg = JSON.parse(content)
				pkg.devDependencies.typescript = '~5.5.4'
				pkg.devDependencies['typescript-stable'] = 'npm:typescript@~5.5.4'
				return JSON.stringify(pkg, null, 2)
			},
			'test-workspace/package.json': (content) => {
				const pkg = JSON.parse(content)
				pkg.devDependencies['typescript-stable'] = 'npm:typescript@~5.5.4'
				pkg.devDependencies['typescript-next'] =
					'npm:typescript@5.7.0-dev.20240904'
				return JSON.stringify(pkg, null, 2)
			},
		},
	})
}
