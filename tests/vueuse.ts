import { runInRepo } from '../utils.ts'
import { RunOptions } from '../types.ts'
import { REGISTRY_ADDRESS } from '../registry.ts'
import YAML from 'yaml'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'vueuse/vueuse',
		branch: 'main',
		patchFiles: {
			'pnpm-workspace.yaml': (content) => {
				try {
					const data = YAML.parse(content) ?? {}
					data.trustPolicy = 'off'
					return YAML.stringify(data)
				} catch {
					return content
				}
			},
		},
		beforeBuild: `pnpm dedupe --registry=${REGISTRY_ADDRESS}`,
		build: 'build',
		test: ['typecheck', 'test'],
	})
}
