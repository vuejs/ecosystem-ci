import path from 'node:path'
import { runInRepo } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'vuejs/ecosystem-ci',
		test: 'pnpm run selftestscript',
		verify: false,
		patchFiles: {
			'package.json': (content) => {
				const pkg = JSON.parse(content)
				if (pkg.name !== '@vue/ecosystem-ci') {
					throw new Error(
						`invalid checkout, expected package.json with "name": "@vue/ecosystem-ci" in ${path.resolve(
							options.workspace,
							'ecosystem-ci',
						)}`,
					)
				}
				pkg.scripts.selftestscript =
					"[ -d ../../core/packages/vue/dist ] || (echo 'vue build failed' && exit 1)"
				return JSON.stringify(pkg, null, 2)
			},
		},
	})
}
