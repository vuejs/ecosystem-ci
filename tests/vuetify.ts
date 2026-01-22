import { runInRepo } from '../utils.ts'
import { RunOptions } from '../types.ts'
import YAML from 'yaml'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'vuetifyjs/vuetify',
		branch: 'master',
		patchFiles: {
			'pnpm-workspace.yaml': (content) => {
				try {
					const data = YAML.parse(content) ?? {}
					const exclude: string[] = Array.isArray(data.minimumReleaseAgeExclude)
						? data.minimumReleaseAgeExclude
						: []

					const vuePkgs = ['@vue/*', 'vue']
					for (const name of vuePkgs) {
						if (!exclude.includes(name)) exclude.unshift(name)
					}

					data.minimumReleaseAgeExclude = exclude
					return YAML.stringify(data)
				} catch {
					return content
				}
			},
		},
		build: 'vue-ecosystem-ci:build',
		test: 'vue-ecosystem-ci:test',
	})
}
