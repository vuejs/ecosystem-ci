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
		patchFiles: {
			'packages/tsc/tests/index.spec.ts': (content) => {
				if (!options.vueVersion.startsWith('3.4')) {
					return content
				}
				return content.replace(
					'for (const file of files) {',
					"for (const file of files) { if (file.includes('vue3.5')) continue;",
				)
			},
		},
	})
}
