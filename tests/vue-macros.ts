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
				data.catalog ||= {}
				data.overrides ||= {}

				// Newer rolldown versions (e.g. beta.60) have been observed to crash
				// via rolldown-plugin-dts during `pnpm run build`.
				const pinnedRolldown = '1.0.0-beta.40'
				data.catalog.rolldown = pinnedRolldown
				data.catalog['@rolldown/pluginutils'] = pinnedRolldown
				data.overrides.rolldown = pinnedRolldown
				data.overrides['@rolldown/pluginutils'] = pinnedRolldown

				Object.keys(overrides).forEach((key) => {
					const pkgName = key.replace(overrideVueVersion, '')
					if (data.catalog?.[pkgName] != null) {
						data.catalog[pkgName] = overrides[key]
					}
				})
				return YAML.stringify(data)
			},
		},
	})
}
