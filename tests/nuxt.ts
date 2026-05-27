import { runInRepo } from '../utils.ts'
import { RunOptions } from '../types.ts'
import YAML from 'yaml'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'nuxt/nuxt',
		branch: 'main',
		patchFiles: {
			'pnpm-workspace.yaml': (content) => {
				const data = YAML.parse(content) ?? {}
				data.blockExoticSubdeps = false
				return YAML.stringify(data)
			},
		},
		build: ['dev:prepare', 'typecheck', 'build'],
		beforeTest: ['pnpm playwright-core install chromium'],
		test: ['test:unit', 'test:types', 'test:fixtures'],
	})
}
