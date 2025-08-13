import { runInRepo } from '../utils.ts'
import { RunOptions } from '../types.ts'
import { REGISTRY_ADDRESS } from '../registry.ts'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'vueuse/vueuse',
		branch: 'main',
		beforeBuild: `pnpm dedupe --registry=${REGISTRY_ADDRESS}`,
		build: 'build',
		test: ['typecheck', 'test'],
	})
}
