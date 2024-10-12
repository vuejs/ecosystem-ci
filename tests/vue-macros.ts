import { runInRepo } from '../utils.ts'
import { Overrides, RunOptions } from '../types.ts'
import YAML from 'yaml'

export async function test(options: RunOptions) {
	const overrideVueVersion = '@^3'
	await runInRepo({
		...options,
		repo: 'vue-macros/vue-macros',
		branch: 'main',
		build: 'build',
		test: ['test:ecosystem'],
		overrideVueVersion,
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
