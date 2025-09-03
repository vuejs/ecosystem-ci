import { runInRepo } from '../utils.ts'
import { Overrides, RunOptions } from '../types.ts'
import { REGISTRY_ADDRESS } from '../registry.ts'
import YAML from 'yaml'

export async function test(options: RunOptions) {
	const overrideVueVersion = '@^3'
	await runInRepo({
		...options,
		repo: 'vue-macros/vue-macros',
		branch: 'main',
		beforeBuild: `pnpm dedupe --registry=${REGISTRY_ADDRESS}`,
		build: 'build',
		test: ['test:ecosystem'],
		overrideVueVersion,

		// It's already overridden in pnpm-workspace.yaml in the original repo
		// but somehow it doesn't take effect when we also have overrides in package.json
		// So we have to override it here again
		// TODO: should handle such cases in the codebase rather than patching manually in each repo
		overrides: {
			vite: '^7.1.3',
		},
		patchFiles: {
			'pnpm-workspace.yaml': (content: string, overrides: Overrides) => {
				const data = YAML.parse(content)
				Object.keys(overrides).forEach((key) => {
					const pkgName = key.replace(overrideVueVersion, '')
					if (data.catalog[pkgName]) {
						data.catalog[pkgName] = overrides[key]
					}
				})
				return YAML.stringify(data)
			},
		},
	})
}
