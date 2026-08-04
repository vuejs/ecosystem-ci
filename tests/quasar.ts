import { runInRepo } from '../utils.ts'
import { RunOptions } from '../types.ts'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'quasarframework/quasar',
		branch: 'dev',
		patchFiles: {
			'ui/package.json': (content) => {
				const pkg = JSON.parse(content)
				pkg.devDependencies ||= {}
				pkg.devDependencies['@vue/test-utils'] ||= '^2.4.10'
				return `${JSON.stringify(pkg, null, 2)}\n`
			},
		},
		build: 'vue-ecosystem-ci:build',
		beforeTest:
			'pnpm --filter quasar-ui-test exec playwright install --with-deps chromium',
		test: 'vue-ecosystem-ci:test',
	})
}
