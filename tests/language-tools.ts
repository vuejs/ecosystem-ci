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
			// 'package.json': (content) => {
			// 	const pkg = JSON.parse(content)
			// 	pkg.devDependencies.typescript = '~5.4.5'
			// 	return JSON.stringify(pkg, null, 2)
			// },
		},
	})
}
